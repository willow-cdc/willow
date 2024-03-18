// routes for managing/checking/setting up source database connections
import express from 'express';
import { TypedRequest, SourceRequestBody } from './types';
import { HttpError, extractDbInfo, setupConnectorPayload } from '../utils/utils';
import { Client } from 'pg';
import axios from 'axios';
import { sources } from '../data/sources';

const router = express.Router();

router.post('/verify', async (req: TypedRequest<SourceRequestBody>, res, next) => {
  const source = req.body;
  const client = new Client({
    host: source.host,
    port: Number(source.port),
    database: source.dbName,
    user: source.user,
    password: source.password,
  });

  try {
    await client.connect();
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

router.post('/connect', async (req: TypedRequest<SourceRequestBody>, res, next) => {
  const source = req.body;
  const kafkaConnectPayload = setupConnectorPayload(source);

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axios.post('http://connect:8083/connectors/', kafkaConnectPayload);
    console.log(data);
    sources.add(source.connectionName);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res.json({ data });
  } catch (error) {
    if (error instanceof Error) {
      const err = new HttpError(400, `Connection failed with error: ${error.message}`);
      next(err);
    }
  }
});

router.get('/', (_req, res, next) => {
  try {
    console.log('Fetching all sources.');
    const s = sources.getAll();
    console.log('Fetched all sources.');
    res.json(s);
  } catch (error) {
    next(error);
  }
});

router.get('/:name', (req, res, next) => {
  const name = req.params.name;

  try {
    console.log('Fetching source', name);
    const source = sources.find(name);
    console.log('Fetched source', name);
    res.json(source);
  } catch (error) {
    next(error);
  }
});

router.delete('/:name', async (req, res, next) => {
  const name = req.params.name;

  try {
    console.log('Deleting source', name);
    await axios.delete(`http://connect:8083/connectors/${name}`);
    const source = sources.delete(name);
    console.log('Deleted source', name);
    res.json(source);
  } catch (error) {
    next(error);
  }
});

export default router;
