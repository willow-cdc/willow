import supertest from 'supertest';
import app from '../../src/app';
const api = supertest(app);
import Database from '../../src/lib/dataPersistence';

import axios from 'axios';
jest.mock('axios');
import { sinks } from '../../src/data/sinks';
jest.mock('../../src/data/sinks');

/*
Insert dummy data in DB.

Tests to make:
pipelines.test.js - will need to mock function calls to external services
sources.test.js - will need to mock function calls to external services
sinks.test.js - will need to mock function calls to external services

Remove dummy data from DB.
*/

beforeEach(async () => {
  const database = new Database('postgres://postgres:postgres@db:5432');

  const sourceDetails: [string, string, string, string, number, string] = [
    'source_name',
    'testDb',
    'table1,table2',
    'host',
    12345,
    'testDbUser',
  ];
  const sinkDetails: [string, string, string, string] = [
    'sink_name',
    'redis://redisURL.com',
    'username',
    '["source_name.schema.table1","source_name.schema.table2"]',
  ];
  const pipelineDetails: [string, string] = ['source_name', 'sink_name'];

  try {
    await database.connect();
    await database.insertSource(...sourceDetails);
    await database.insertSink(...sinkDetails);
    await database.insertPipeline(...pipelineDetails);
    await database.end();
  } catch (err) {
    console.error(err);
  }
});

afterEach(async () => {
  const database = new Database('postgres://postgres:postgres@db:5432');
  try {
    await database.connect();
    await database.deleteSource('source_name');
    await database.deleteSink('sink_name');
    await database.end();
  } catch (err) {
    console.error(err);
  }
});

/* 
INSERT INTO sources (name, db, tables, host, port, dbUser) VALUES ('source_name', 'test', 'demo,numbers', '4.tcp.ngrok.to', '12536', 'postgres');

INSERT INTO sinks (name, url, username, topics) VALUES ('sink_name', 'redis://redisUser.com:12432', 'default', '["source_name.public.demo","source_name.public.numbers"]');

INSERT INTO sourceSink (source_name, sink_name) VALUES ('source_name', 'sink_name');

  const INSERT_SOURCE = `INSERT INTO sources (name, db, tables, host, port, dbUser) 
                         VALUES ($1, $2, $3, $4, $5, $6);`;
  const INSERT_SINK = `INSERT INTO sinks (name, url, username, topics) 
                       VALUES ('sink_name', 'redis://redisUser.com:12432', 'default', 
                       '["source_name.public.demo","source_name.public.numbers"]');`;
  const INSERT_PIPELINE = `INSERT INTO sourceSink (source_name, sink_name) 
                           VALUES ('source_name', 'sink_name');`
  
*/

describe('GET /pipelines', () => {
  test('returns status code 200 if successfully able to get request', async () => {
    const result = await api.get('/pipelines/');

    expect(result.statusCode).toEqual(200);
  });

  test('returns all pipelines', async () => {
    const result = await api.get('/pipelines');
    expect(result.body.data).toHaveLength(1);
    expect(result.body.data[0]).toEqual({
      pipeline_id: 2,
      source_name: 'source_name',
      sink_name: 'sink_name',
    });
  });
});

describe('GET /pipelines/:id', () => {
  test('returns status code 200 if successfully able to get request', async () => {
    const allPipelines = await api.get('/pipelines');
    const pipelineId = allPipelines.body.data[0].pipeline_id as string;
    const result = await api.get(`/pipelines/${pipelineId}`);

    expect(result.statusCode).toEqual(200);
  });

  test('returns a single pipeline', async () => {
    const allPipelines = await api.get('/pipelines');
    const pipelineId = allPipelines.body.data[0].pipeline_id as string;
    const result = await api.get(`/pipelines/${pipelineId}`);

    expect(result.body.data).toHaveProperty('tables');
    expect(result.body.data).toHaveProperty('pipeline_id');
    expect(result.body.data).toEqual({
      source_name: 'source_name',
      source_database: 'testDb',
      source_host: 'host',
      source_port: 12345,
      tables: ['table1', 'table2'],
      source_user: 'testDbUser',
      sink_name: 'sink_name',
      sink_url: 'redis://redisURL.com',
      sink_user: 'username',
      pipeline_id: pipelineId,
    });
  });

  test('returns status code 404 for a non-existant pipeline', async () => {
    const result = await api.get(`/pipelines/0`);

    expect(result.statusCode).toEqual(404);
  });

  test('returns status code 404 for a non-existant pipeline', async () => {
    const result = await api.get(`/pipelines/0`);

    expect(result.body.message).toMatch(/Pipeline with id 0 not found./);
  });
});

describe('DELETE /pipelines/:id', () => {
  test('returns status code 200 if successfully able to delete pipeline', async () => {
    // axios.delete = jest.fn();

    const allPipelines = await api.get('/pipelines');
    const pipelineId = allPipelines.body.data[0].pipeline_id as string;
    const result = await api.delete(`/pipelines/${pipelineId}`);

    expect(result.statusCode).toEqual(200);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(axios.delete).toHaveBeenCalledWith(`http://connect:8083/connectors/source_name`);
    expect(sinks.delete).toHaveBeenCalledWith('sink_name');
    expect(result.body.message).toBe('Pipeline deleted.');
  });
});
