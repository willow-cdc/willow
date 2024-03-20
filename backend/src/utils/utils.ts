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

interface QueryRow {
  schema: string;
  table: string;
  column: string;
}


const formatResult = (rows: QueryRow[]) => {
  const formattedResult: Schema[] = [];

  // sort the order of the rows by the column name to make sure the column ordering is consistent
  rows = rows.sort((obj1, obj2) => obj1.column.localeCompare(obj2.column));

  // build the formatted result object
  rows.forEach(row => {
    let schema = formattedResult.find(s => s.schema_name == row.schema);
    if (!schema) {
      schema = {schema_name: row.schema, tables: []};
      formattedResult.push(schema);
    }

    let table = schema.tables.find(t => t.table_name === row.table);
    if (!table) {
      table = {table_name: row.table, columns: []};
      schema.tables.push(table);
    }

    table.columns.push(row.column);
  });

  return formattedResult;
};

export const extractDbInfo = async (client: Client) => {
  const text = `
    SELECT table_schema AS schema, table_name AS table, column_name AS column
    FROM information_schema.columns
    WHERE table_schema != 'information_schema' AND table_schema != 'pg_catalog';`;

    const result = await client.query(text);

    const rows = result.rows as QueryRow[];

    return formatResult(rows);
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
