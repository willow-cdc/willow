import { Client } from 'pg';
import { FinalSourceRequestBody } from '../routes/types';

interface Table {
  table_name: string;
  columns: string[];
}

interface Schema {
  schema_name: string;
  tables: Table[];
}

interface ColumnName {
  column_name: string;
}

const retrieveSchema = async (client: Client, dbName: string) => {
  const schemaTextQuery =
    "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg%' AND schema_name NOT LIKE 'information_schema' AND catalog_name LIKE $1";
  const schemaQueryValue = [dbName];
  const schemaQueryResult = await client.query(schemaTextQuery, schemaQueryValue);

  return schemaQueryResult.rows as Schema[];
};

const retrieveTables = async (client: Client, schema: Schema) => {
  const tableTextQuery =
    "SELECT table_name FROM information_schema.tables WHERE table_schema=$1 AND table_type='BASE TABLE'";
  const tableQueryValue = [schema.schema_name];
  const tableQueryResult = await client.query(tableTextQuery, tableQueryValue);
  return tableQueryResult.rows as Table[];
};

const retrieveColumns = async (client: Client, schemaName: string, table: Table) => {
  const columnTextQuery =
    'select column_name from information_schema.columns where table_name = $1 and table_schema = $2';
  const columnQueryValue = [table.table_name, schemaName];
  const columnQueryResult = await client.query(columnTextQuery, columnQueryValue);

  const columnsArr = columnQueryResult.rows as ColumnName[];
  const columns = columnsArr.map((columObj) => columObj.column_name);
  return columns;
};

export const extractDbInfo = async (client: Client, dbName: string) => {
  const schemaArr = await retrieveSchema(client, dbName);

  for (let i = 0; i < schemaArr.length; i += 1) {
    const currentSchema = schemaArr[i];

    const tables = await retrieveTables(client, currentSchema);
    currentSchema.tables = tables;

    for (let j = 0; j < tables.length; j += 1) {
      const currentTable = tables[j];

      currentTable.columns = await retrieveColumns(client, currentSchema.schema_name, currentTable);
    }
  }

  return schemaArr;
};

export const setupConnectorPayload = (source: FinalSourceRequestBody) => {
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
      'topic.prefix': source.connectionName,
      'skipped.operations': 'none',
      'decimal.handling.mode': 'double',
    },
  };

  if (source.formData.length > 0) {
    const tablesToExclude = source.formData
      .filter((obj) => obj.selected === false)
      .map((objToExclue) => objToExclue.dbzTableValue);

    const tablesToInclude = source.formData.filter((obj) => obj.selected === true);

    const columnsToExclude: string[] = [];

    tablesToInclude.forEach((obj) => {
      obj.columns.forEach((colObj) => {
        if (obj.columns.every((colObj) => colObj.selected === false)) {
          //if all the columns are excluded, exclude the table wholly
          tablesToExclude.push(obj.dbzTableValue);
        } else if (colObj.selected === false) {
          columnsToExclude.push(colObj.dbzColumnValue);
        }
      });
    });

    const settablesToExclude = [...new Set(tablesToExclude)];

    if (tablesToExclude.length > 0) {
      connectorObj.config['table.exclude.list'] = settablesToExclude.join(',');
    }

    if (columnsToExclude.length > 0) {
      connectorObj.config['column.exclude.list'] = columnsToExclude.join(',');
    }
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

export class NoPrimaryKeyError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class ValidationError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}