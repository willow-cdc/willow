// routes for managing/checking/setting up source database connections
import express from 'express';
import { SourceRequestBody } from './types';
import { HttpError, extractDbInfo, setupConnectorPayload } from '../utils/utils';
import { Client } from 'pg';
import axios from 'axios';

const router = express.Router();

router.post('/verify', async (req, res, next) => {
  const source = req.body as SourceRequestBody;
  try {
    const client = new Client({
      host: source.host,
      port: Number(source.port),
      database: source.dbName,
      user: source.user,
      password: source.password,
    });

    // await testSourceConnection(client);
    const data = await extractDbInfo(client, source.dbName);
    await client.end();
    res.json({ data });
  } catch (error) {
    if (error instanceof Error) {
      const err = new HttpError(400, `Verification failed with error: ${error.message}`);
      next(err);
    }
  }
});

router.post('/connect', async (req, res) => {
  const source = req.body as SourceRequestBody;

  try {
    const kafkaConnectPayload = setupConnectorPayload(source);
    const { data } = await axios.post('http://connect:8083/connectors/', kafkaConnectPayload);
    console.log(data);
    res.json({ data });
  } catch {
    res.status(401).end(); //needs refactor
  }
});

export default router;
