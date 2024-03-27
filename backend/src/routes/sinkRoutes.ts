import express from 'express';
import Redis from '../lib/redis';
import KafkaConsumer from '../lib/consumer';
import { TypedRequest } from './types/commonTypes';
import { SinkRequestBody } from './types/sinkRoutesTypes';
import Database from '../lib/dataPersistence';
import { sinks } from '../data/sinks';
import { validateSinkBody, validateSinkConnectionDetails } from '../utils/validation';
import { parseSourceName } from '../utils/routeHelpers';

const router = express.Router();

router.post('/verify', async (req: TypedRequest<SinkRequestBody>, res, next) => {
  const { url, username, password } = req.body;
  try {
    validateSinkConnectionDetails(url, username, password);
    await Redis.checkConnection(url, password, username);
    res.status(200).send({ message: 'Connection successful.' });
  } catch (err) {
    next(err);
  }
});

router.post('/create', async (req: TypedRequest<SinkRequestBody>, res, next) => {
  const { url, username, password, topics, connectionName } = req.body;
  const redis = new Redis(url, password, username);
  const consumer = new KafkaConsumer(redis, connectionName, ['kafka:9092'], connectionName);

  const database = new Database('postgres://postgres:postgres@db:5432');
  try {
    validateSinkBody(req.body);
    await redis.connect();
    await consumer.start(topics);

    await database.connect();
    await database.insertSink(connectionName, url, username, JSON.stringify(topics));
    const sourceName = parseSourceName(topics);
    await database.insertPipeline(sourceName, connectionName);
    await database.end();

    sinks.add(connectionName, consumer);

    res.status(201).json({ message: 'Consumer created!' });
  } catch (err) {
    next(err);
  }
});

export default router;
