// routes for managing/checking/setting up sink cache connections
import express from 'express';
import Redis from '../lib/redis';
import KafkaConsumer from '../lib/consumer';
import { TypedRequest, SinkRequestBody } from './types';
import { sinks } from '../data/sinks';
const router = express.Router();

// check sink cache is accessible
router.post('/check', async (req: TypedRequest<SinkRequestBody>, res, next) => {
  const {url, username, password } = req.body;
  try {
    await Redis.checkConnection(url, password, username);
    res.status(200).send({message: 'Connection successful.'});
  } catch (err) {
    next(err);
  }
});

// create sink cache connection
router.post('/create', async (req: TypedRequest<SinkRequestBody>, res, next)=> {
  const {url, username, password, topics, connectionName } = req.body;
  const redis = new Redis(url, password, username);
  const consumer = new KafkaConsumer(redis, connectionName, ['kafka:9092'], connectionName);
  try {
    await redis.connect();
    await consumer.startConsumer(topics);
    sinks.add(connectionName, consumer);
    res.json({ message: 'Consumer created!' });
  } catch (err) {
    next(err);
  }
});

router.get('/', (_req, res, next) => {
  try {
    console.log('Fetching all sinks.');
    const s = sinks.getAll();
    console.log('Fetched all sinks.');
    res.json(s);
  } catch (error) {
    next(error);
  }
});

router.get('/:name', (req, res, next) => {
  const name = req.params.name;

  try {
    console.log('Fetching sink', name);
    const sink = sinks.find(name);
    console.log('Fetched sink', name);
    res.json(sink);
  } catch (error) {
    next(error);
  }
});

router.delete('/:name', (req, res, next) => {
  const name = req.params.name;

  try {
    console.log('Deleting sink', name);
    const sink = sinks.delete(name);
    console.log('Deleted sink', name);
    res.json(sink);
  } catch (error) {
    next(error);
  }
});

export default router;