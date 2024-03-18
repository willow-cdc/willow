// routes for managing/checking/setting up sink cache connections

import express from 'express';
import Redis from '../lib/redis';
import KafkaConsumer from '../lib/consumer';
import { TypedRequest, SinkRequestBody } from './types';
import { Client } from 'pg';
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

  const database = new Client({
    connectionString: 'postgres://postgres:postgres@db:5432',
  });
  const query = 'INSERT INTO sinks (name, url, username, topics) VALUES ($1, $2, $3, $4)';
  const values = [connectionName, url, username, JSON.stringify(topics)];

  // const result = await database.query(query, values);
  // console.log(result.rows);
  try {
    await redis.connect();
    await consumer.startConsumer(topics);

    await database.connect();
    const result = await database.query(query, values);
    console.log('sink result', result);
    console.log('sink result.row', result.rows);
    
    res.json({ message: 'Consumer created!' });
  } catch (err) {
    next(err);
  }
});

export default router;