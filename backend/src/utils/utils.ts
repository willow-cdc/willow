import { Client } from 'pg';
import { FinalSourceRequestBody, FormTableObj } from '../routes/types';

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

interface DebeziumConfig {
  [property: string]: string;
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

const hasAllUnselectedColumns = (table: FormTableObj) => {
  return table.columns.every(column => !column.selected);
};

const addTablesAndColumnsToConfig = (source: FinalSourceRequestBody, config: DebeziumConfig ) => {
  // determine tables that are excluded and save their corresponding Debezium-friendly names
  const tablesToExclude = source.formData
    .filter(table => !table.selected)
    .map(table => table.dbzTableValue);

  // determine tables that are included
  const tablesToInclude = source.formData.filter(table => table.selected);

  const columnsToExclude: string[] = [];

  // iterate through the included tables and exclude non-selected columns
  tablesToInclude.forEach(table => {
    table.columns.forEach(column => {
      // if all of a table's columns are excluded, exclude the whole table
      if (hasAllUnselectedColumns(table)) {
        tablesToExclude.push(table.dbzTableValue);
      // otherwise if the column is not selected, then exclude it
      } else if (!column.selected) {
        columnsToExclude.push(column.dbzColumnValue);
      }
    });
  });

  // remove duplicate excluded tables
  const uniqueTablesToExclude = [...new Set(tablesToExclude)];

  // add to config if there are any tables or columns to exclude
  if (uniqueTablesToExclude.length > 0) {
    config['table.exclude.list'] = uniqueTablesToExclude.join(',');
  }

  if (columnsToExclude.length > 0) {
    config['column.exclude.list'] = columnsToExclude.join(',');
  }
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
    addTablesAndColumnsToConfig(source, connectorObj.config);
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
