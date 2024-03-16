// routes for managing/checking/setting up sink cache connections

import express from 'express';
import Redis from '../lib/redis';
import ExampleConsumer from '../lib/consumer';
const router = express.Router();

interface RequestBody {
  url: string;
  username: string;
  password: string;
  topics: string[];
  connectionName: string;
}

// check sink cache is accessible
router.post('/check', async (req, res, next) => {
  const {url, username, password } = <RequestBody>req.body;
  try {
    await Redis.checkConnection(url, password, username);
    res.status(200).send({message: 'Connection successful.'});
  } catch (err) {
    next(err);
  }
});

// create sink cache connection
router.post('/create', async (req, res, next)=> {
  const {url, username, password, topics, connectionName } = <RequestBody>req.body;
  const redis = new Redis(url, password, username);
  const consumer = new ExampleConsumer(redis, connectionName, ['kafka:9092'], connectionName);
  try {
    await redis.connect();
    await consumer.startConsumer(topics);
    res.json({ message: 'Consumer created!' });
  } catch (err) {
    next(err);
  }
});

export default router;