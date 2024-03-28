import supertest from 'supertest';
import app from '../../src/app';
const api = supertest(app);
import axios from 'axios';

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

const formData = [
  {
    table_name: 'table1',
    schema_name: 'public',
    dbzTableValue: 'public.table1',
    selected: true,
    columns: [{ column: 'column1', dbzColumnValue: 'public.table1.column1', selected: true }],
  },
];

const createRequestBody = {
  ...verifyRequestBody,
  formData,
  connectionName: 'source_name43',
};
const invalidCreateRequestBody = {
  invalidVerifyRequestBody,
  formData,
  connectionName: 'source_name?=*',
};

describe('POST /sources/create', () => {
  test('returns status code 201 if successfully able to create source connector', async () => {
    axios.post = jest.fn();
    const result = await api
      .post('/sources/create')
      .send(createRequestBody)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.statusCode).toEqual(201);
  });

  test('returns status code 400 if request contains invalid connection details', async () => {
    const result = await api
      .post('/sources/create')
      .send(invalidCreateRequestBody)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    expect(result.statusCode).toEqual(400);
  });
});
