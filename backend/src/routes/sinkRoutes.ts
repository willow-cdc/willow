// routes for managing/checking/setting up sink cache connections

import express from 'express';
import Redis from '../lib/redis';
import ExampleConsumer from '../lib/consumer';
const router = express.Router();

// check sink cache is accessible

// create sink cache connection
router.post('/', async (req, res)=> {
  const url = process.env.REDIS_URL ?? '';
  const username = process.env.REDIS_USERNAME ?? '';
  const password = process.env.REDIS_PASSWORD ?? '';
  const redis = new Redis(url, password, username);
  const consumer = new ExampleConsumer(redis, 'my-kafka', ['kafka:9092'], 'my-group');
  await consumer.startConsumer(['dbserver1.public.demo']);
  res.json({ message: 'Consumer created!' });
});

export default router;