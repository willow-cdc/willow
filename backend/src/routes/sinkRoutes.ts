// routes for managing/checking/setting up sink cache connections

/*
POST: user sends sink connection info
name for connection
Redis URL
Redis username
Redis password
RESPONSE:
if unable to access sink/cache, return error.
if able to access sink/cache, return 200 and give back demo Redis cache data in JSON (example of what it would look like).

POST: user confirms to begin consuming from source DB…?
name for connection
Redis URL
Redis username
Redis password
Establish the connection and set up the consumer to begin consuming from the source DB and stream rows into the sink. Reply with a 200.
*/

import express from 'express';
import Redis from '../lib/redis';
import ExampleConsumer from '../lib/consumer';
const router = express.Router();

interface RequestBody {
  url: string;
  username: string;
  password: string;
}

// check sink cache is accessible
router.post('/checkConnection', async (req, res) => {
  const {url, username, password } = <RequestBody>req.body;
  try {
    await Redis.checkConnection(url, password, username);
    res.status(200).send({message: 'Connection successful.'});
  } catch (err) {
    let errorMessage = 'Unknown error occurred.';
    if (typeof err === 'object' && err !== null && 'message' in err && typeof err.message === 'string') {
      errorMessage = err.message;
    }

    res.status(400).send({error: errorMessage});
  }
});


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