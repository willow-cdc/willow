// routes for managing/checking/setting up source database connections
import express from 'express';
import { TypedRequest, SourceRequestBody, FinalSourceRequestBody } from './types';
import { HttpError, extractDbInfo, setupConnectorPayload } from '../utils/utils';
import { Client } from 'pg';
import Database from '../lib/dataPersistence';
import axios from 'axios';
import { validateSourceBody } from '../utils/validation';

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
    validateSourceBody(source);
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

router.post('/connect', async (req: TypedRequest<FinalSourceRequestBody>, res, next) => {
  const source = req.body;
  const kafkaConnectPayload = setupConnectorPayload(source);
  const database = new Database('postgres://postgres:postgres@db:5432');

  const mappedTables = source.formData
    .filter((obj) => obj.selected === false)
    .map((includedTable) => includedTable.table_name);

  const tables = mappedTables.join(',');

  try {
    validateSourceBody(source);
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

    await database.end();
    
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

router.get('/', async (_req, res, next) => {
  const database = new Database('postgres://postgres:postgres@db:5432');

  try {
    console.log('Fetching all sources.');

    await database.connect();
    const s = await database.retrieveAllSources();
    await database.end();

    console.log('Fetched all sources.');
    res.json(s);
  } catch (error) {
    next(error);
  }
});

router.get('/:name', async (req, res, next) => {
  const name = req.params.name;
  const database = new Database('postgres://postgres:postgres@db:5432');

  try {
    console.log('Fetching source', name);

    await database.connect();
    const source = await database.retrieveSource(name);
    await database.end();

    console.log('Fetched source', name);
    res.json(source);
  } catch (error) {
    next(error);
  }
});

router.delete('/:name', async (req, res, next) => {
  const name = req.params.name;
  const database = new Database('postgres://postgres:postgres@db:5432');

  try {
    console.log('Deleting source', name);
    await axios.delete(`http://connect:8083/connectors/${name}`);

    await database.connect();
    const source = await database.deleteSource(name);
    await database.end();

    console.log('Deleted source', name);
    res.json(source);
  } catch (error) {
    next(error);
  }
});

export default router;
