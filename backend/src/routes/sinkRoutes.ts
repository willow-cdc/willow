// routes for managing/checking/setting up sink cache connections
import express from 'express';
import Redis from '../lib/redis';
import KafkaConsumer from '../lib/consumer';
import { TypedRequest, SinkRequestBody } from './types';
import Database from '../lib/dataPersistence';
import { sinks } from '../data/sinks';
import { validateSinkBody, validateSinkConnectionDetails } from '../utils/validation';
import { parseSourceName } from '../utils/utils';
const router = express.Router();

// check sink cache is accessible
router.post('/check', async (req: TypedRequest<SinkRequestBody>, res, next) => {
  const { url, username, password } = req.body;
  try {
    validateSinkConnectionDetails(url, username, password);
    await Redis.checkConnection(url, password, username);
    res.status(200).send({ message: 'Connection successful.' });
  } catch (err) {
    next(err);
  }
});

// create sink cache connection
router.post('/create', async (req: TypedRequest<SinkRequestBody>, res, next) => {
  const { url, username, password, topics, connectionName } = req.body;
  const redis = new Redis(url, password, username);
  const consumer = new KafkaConsumer(redis, connectionName, ['kafka:9092'], connectionName);

  const database = new Database('postgres://postgres:postgres@db:5432');
  try {
    validateSinkBody(req.body);
    await redis.connect();
    await consumer.startConsumer(topics);

    await database.connect();
    const result = await database.insertSink(connectionName, url, username, JSON.stringify(topics));
    const sourceName = parseSourceName(topics);
    await database.insertPipeline(sourceName, connectionName);
    await database.end();

    console.log('sink result', result);
    sinks.add(connectionName, consumer);
    
    res.json({ message: 'Consumer created!' });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (_req, res, next) => {
  const database = new Database('postgres://postgres:postgres@db:5432');

  try {
    console.log('Fetching all sinks.');

    await database.connect();
    const s = await database.retrieveAllSinks();
    await database.end();

    console.log('Fetched all sinks.');
    res.json(s);
  } catch (error) {
    next(error);
  }
});

router.get('/:name', async (req, res, next) => {
  const name = req.params.name;
  const database = new Database('postgres://postgres:postgres@db:5432');

  try {
    console.log('Fetching sink', name);

    await database.connect();
    const sink = await database.retrieveSink(name);
    await database.end();

    console.log('Fetched sink', name);
    res.json(sink);
  } catch (error) {
    next(error);
  }
});

router.delete('/:name', async (req, res, next) => {
  const name = req.params.name;
  const database = new Database('postgres://postgres:postgres@db:5432');

  try {
    console.log('Deleting sink', name);
    const sinkInMemory = sinks.delete(name);
    if (sinkInMemory) {
      await sinkInMemory.consumer.shutdown();
    }

    await database.connect();
    const sink = await database.deleteSink(name);
    await database.end();

    console.log('Deleted sink', name);
    res.json(sink);
  } catch (error) {
    next(error);
  }
});

export default router;
