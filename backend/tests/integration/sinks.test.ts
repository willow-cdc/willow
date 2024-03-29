import supertest from 'supertest';
import app from '../../src/app';
const api = supertest(app);
import Database from '../../src/lib/dataPersistence';
import Redis from '../../src/lib/redis';
import KafkaConsumer from '../../src/lib/consumer';
import { sinks } from '../../src/data/sinks';

jest.mock('../../src/data/sinks');
jest.mock('../../src/lib/redis');

const INVALID_USERNAME = '';
const INVALID_CONNECTION_NAME = '%3234mySource-+';
const SOURCE_NAME = 'source_name';

const validRequestBody = {
  url: 'redis://redisUrl.com',
  username: 'user',
  password: 'password',
  topics: [`${SOURCE_NAME}.public.table1`, `${SOURCE_NAME}.public.table2`],
  connectionName: 'mySource',
};

const invalidRequestBody = {
  ...validRequestBody,
  username: INVALID_USERNAME,
  connectionName: INVALID_CONNECTION_NAME,
};

let database: Database;

beforeEach(async () => {
  database = new Database('postgres://postgres:postgres@db:5432');

  const sourceDetails: [string, string, string, string, number, string] = [
    SOURCE_NAME,
    'testDb',
    'table1,table2',
    'host',
    12345,
    'testDbUser',
  ];

  try {
    await database.connect();
    await database.insertSource(...sourceDetails);
  } catch (err) {
    console.error(err);
  }
});

afterEach(async () => {
  try {
    await database.deleteSource(SOURCE_NAME);
    await database.end();
  } catch (err) {
    console.error(err);
  }
});

describe('POST /sinks/verify', () => {
  test('returns status code 200 if successfully able to verify source connection details', async () => {
    const result = await api
      .post('/sinks/verify')
      .send(validRequestBody)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.statusCode).toEqual(200);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Redis.checkConnection).toHaveBeenCalledTimes(1);
    expect(result.body.message).toBe('Connection successful.');
  });

  test('returns status code 400 if request contains invalid connection details', async () => {
    const result = await api
      .post('/sinks/verify')
      .send(invalidRequestBody)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.statusCode).toEqual(400);
    expect(result.body.message).toBe('Required parameters missing from request body.');
  });
});

describe('POST /sinks/create', () => {
  test('returns status code 201 if successfully able to create sink connector', async () => {
    const mockConsumerStart = jest
      .spyOn(KafkaConsumer.prototype, 'start')
      .mockImplementation(async () => undefined);
    const mockRedisConnect = jest
      .spyOn(Redis.prototype, 'connect')
      .mockImplementation(async () => undefined);

    const result = await api
      .post('/sinks/create')
      .send(validRequestBody)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.statusCode).toEqual(201);
    expect(mockConsumerStart).toHaveBeenCalledTimes(1);
    expect(mockRedisConnect).toHaveBeenCalledTimes(1);
    expect(sinks.add).toHaveBeenCalledTimes(1);
  });

  test('returns status code 400 if request contains invalid connection details', async () => {
    const result = await api
      .post('/sinks/create')
      .send(invalidRequestBody)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.statusCode).toEqual(400);
  });
});
