import { Client } from 'pg';
import { SourceRequestBody } from '../routes/types';

// export const testSourceConnection = async (client: Client) => {
//   await client.connect();
//   await client.end();
//   console.log('Connection attempt succesful');
// };

export const extractDbInfo = async (client: Client, dbName: string) => {
  await client.connect();

  const schemaTextQuery =
    "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg%' AND schema_name NOT LIKE 'information_schema' AND catalog_name LIKE $1";
  const schemaQueryValue = [dbName];
  const schemaQueryResult = await client.query(schemaTextQuery, schemaQueryValue);

  const resultArr = schemaQueryResult.rows;

  for (let i = 0; i < resultArr.length; i += 1) {
    const currentSchema = resultArr[i];

    const tableTextQuery =
      "SELECT table_name FROM information_schema.tables WHERE table_schema=$1 AND table_type='BASE TABLE'";
    const tableQueryValue = [currentSchema.schema_name];
    const tableQueryResult = await client.query(tableTextQuery, tableQueryValue);
    currentSchema.tables = tableQueryResult.rows;

    for (let j = 0; j < currentSchema.tables.length; j += 1) {
      const currentTable = currentSchema.tables[j];

      const columnTextQuery =
        'select column_name from information_schema.columns where table_name = $1 and table_schema = $2';
      const columnQueryValue = [currentTable.table_name, currentSchema.schema_name];
      const columnQueryResult = await client.query(columnTextQuery, columnQueryValue);
      const columns = columnQueryResult.rows.map((columObj) => columObj.column_name);
      currentTable.columns = columns;
    }
  }

  return resultArr;
};

export const setupConnectorPayload = (source: SourceRequestBody) => {
  const connectorObj = {
    name: source.connectionName,
    config: {
      'plugin.name': 'pgoutput',
      'connector.class': 'io.debezium.connector.postgresql.PostgresConnector',
      'tasks.max': '1',
      'database.hostname': source.host,
      'database.port': source.port,
      'database.user': source.user,
      'database.password': source.password,
      'database.dbname': source.dbName,
      'topic.prefix': 'dbserver1', //must agree on how to define this for each connector!!!!
      'skipped.operations': 'none'
    },
  };

  if (source.tables) {
    connectorObj.config['table.include.list'] = source.tables.join(',');
  }

  return connectorObj;
};

export class HttpError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class RedisError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(`Redis Client Error - ${message}`);
    this.status = status;
  }
}
