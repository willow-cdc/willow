// routes for managing/checking/setting up source database connections
import express from 'express';
import { TypedRequest, SourceRequestBody } from './types';
import { HttpError, extractDbInfo, setupConnectorPayload } from '../utils/utils';
import { Client } from 'pg';
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
  const database = new Client({
    connectionString: 'postgres://postgres:postgres@db:5432',
  });

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { data } = await axios.post('http://connect:8083/connectors/', kafkaConnectPayload);
    console.log(data);
    await database.connect();

    const query = 'INSERT INTO sources (name, db, tables, host, port, dbUser) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [source.connectionName, source.dbName, source.tables, source.host, source.port, source.user];

    const result = await database.query(query, values);
    console.log(result.rows);

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
