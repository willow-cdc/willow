// routes for managing/checking/setting up sink cache connections

import express from 'express';
import Redis from '../lib/redis';
import KafkaConsumer from '../lib/consumer';
import { TypedRequest, SinkRequestBody } from './types';
import Database from '../lib/dataPersistence';
const router = express.Router();

// check sink cache is accessible
router.post('/check', async (req: TypedRequest<SinkRequestBody>, res, next) => {
  const { url, username, password } = req.body;
  try {
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
    await redis.connect();
    await consumer.startConsumer(topics);

    await database.connect();

    const result = await database.insertSink(connectionName, url, username, JSON.stringify(topics));
    console.log('sink result', result);

    res.json({ message: 'Consumer created!' });
  } catch (err) {
    next(err);
  }
});

export default router;
