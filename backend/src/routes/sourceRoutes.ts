// routes for managing/checking/setting up source database connections
import express from 'express';
import { TypedRequest, SourceRequestBody, FinalSourceRequestBody } from './types';
import { extractDbInfo, setupConnectorPayload } from '../utils/utils';
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
    const data = await extractDbInfo(client);
    await client.end();
    res.json({ data });
  } catch (error) {
    next(error);
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
    await axios.post('http://connect:8083/connectors/', kafkaConnectPayload);
    await database.connect();

    await database.insertSource(
      source.connectionName,
      source.dbName,
      tables,
      source.host,
      Number(source.port),
      source.user
    );

    await database.end();

    res.json({ message: 'Source connector created!' });
  } catch (error) {
    next(error);
  }
});

export default router;
