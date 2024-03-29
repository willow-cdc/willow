import supertest from 'supertest';
import app from '../../src/app';
const api = supertest(app);
import Database from '../../src/lib/dataPersistence';

import axios from 'axios';
import { sinks } from '../../src/data/sinks';

jest.mock('../../src/data/sinks');
jest.mock('axios');

const SOURCE_NAME = 'source_name';
const SINK_NAME = 'sink_name';

const sourceDetails: [string, string, string, string, number, string] = [
  SOURCE_NAME,
  'testDb',
  'table1,table2',
  'host',
  12345,
  'testDbUser',
];
const sinkDetails: [string, string, string, string] = [
  SINK_NAME,
  'redis://redisURL.com',
  'username',
  '["source_name.schema.table1","source_name.schema.table2"]',
];

const pipelineDetails: [string, string] = [SOURCE_NAME, SINK_NAME];

let database: Database;

beforeEach(async () => {
  database = new Database('postgres://postgres:postgres@db:5432');

  try {
    await database.connect();
    await database.insertSource(...sourceDetails);
    await database.insertSink(...sinkDetails);
    await database.insertPipeline(...pipelineDetails);
  } catch (err) {
    console.error(err);
  }
});

afterEach(async () => {
  try {
    await database.deleteSource(SOURCE_NAME);
    await database.deleteSink(SINK_NAME);
    await database.end();
  } catch (err) {
    console.error(err);
  }
});

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
      source_name: SOURCE_NAME,
      sink_name: SINK_NAME,
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
      source_name: SOURCE_NAME,
      source_database: 'testDb',
      source_host: 'host',
      source_port: 12345,
      tables: ['table1', 'table2'],
      source_user: 'testDbUser',
      sink_name: SINK_NAME,
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
    const allPipelines = await api.get('/pipelines');
    const pipelineId = allPipelines.body.data[0].pipeline_id as string;
    const result = await api.delete(`/pipelines/${pipelineId}`);

    expect(result.statusCode).toEqual(200);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(axios.delete).toHaveBeenCalledWith(`http://connect:8083/connectors/${SOURCE_NAME}`);
    expect(sinks.delete).toHaveBeenCalledWith(SINK_NAME);
    expect(result.body.message).toBe('Pipeline deleted.');
  });
});
