// routes for managing/checking/setting up source database connections
import express from 'express';
import { TypedRequest, SourceRequestBody } from './types';
import { HttpError, extractDbInfo, setupConnectorPayload } from '../utils/utils';
import { Client } from 'pg';
import Database from '../lib/dataPersistence';
import axios from 'axios';

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
  const database = new Database('postgres://postgres:postgres@db:5432');

  const tables = source.tables ? source.tables.join(',') : undefined;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axios.post('http://connect:8083/connectors/', kafkaConnectPayload);
    console.log(data);
    await database.connect();

    const result = await database.insertSource(
      source.connectionName,
      source.dbName,
      tables,
      source.host,
      Number(source.port),
      source.user
    );

    console.log('The source insert result is', result);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    res.json({ data });
  } catch (error) {
    if (error instanceof Error) {
      const err = new HttpError(400, `Connection failed with error: ${error.message}`);
      next(err);
    }
  }
});

export default router;
