import supertest from 'supertest';
import app from '../../src/app';
const api = supertest(app);

jest.mock('pg', () => {
  const mockClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mockClient) };
});

const mockExtractDbInfoReturn = {
  schema_name: 'schemaName',
  tables: [
    {
      table_name: 'tableName',
      columns: ['column1', 'column2'],
      primaryKeys: ['column1'],
    },
  ],
};

jest.mock('../../src/utils/sourceDbHelpers', () => {
  return {
    ...jest.requireActual('../../src/utils/sourceDbHelpers.ts'),
    extractDbInfo: () => mockExtractDbInfoReturn,
  };
});

const verifyRequestBody = {
  host: 'host',
  port: '8000',
  dbName: 'dbName',
  user: 'user',
  password: 'password',
};

const invalidVerifyRequestBody = {
  ...verifyRequestBody,
  port: 'hello',
};

describe('POST /sources/verify', () => {
  test('returns status code 200 if successfully able to verify source connection details', async () => {
    const result = await api
      .post('/sources/verify')
      .send(verifyRequestBody)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.statusCode).toEqual(200);
  });

  test('returns status code 400 if request contains invalid connection details', async () => {
    const result = await api
      .post('/sources/verify')
      .send(invalidVerifyRequestBody)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.statusCode).toEqual(400);
  });
});
