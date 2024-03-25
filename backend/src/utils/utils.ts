import { Client } from 'pg';
import { FinalSourceRequestBody } from '../routes/types';
import { Pipeline } from '../lib/dataPersistence';
import shortUuid from 'short-uuid';

interface Table {
  table_name: string;
  columns: string[];
  primaryKeys?: string[];
}

interface Schema {
  schema_name: string;
  tables: Table[];
}

interface QueryRow {
  schema: string;
  table: string;
  column: string;
  isPrimaryKey?: boolean;
}

interface PrimaryKeyQueryRow {
  schema: string;
  table: string;
  primary_key: string;
}

interface DebeziumConfig {
  [property: string]: string;
}

const formatResult = (rows: QueryRow[]) => {
  const formattedResult: Schema[] = [];

  // sort the order of the rows by the column name to make sure the column ordering is consistent
  rows = rows.sort((obj1, obj2) => obj1.column.localeCompare(obj2.column));

  // build the formatted result object
  rows.forEach((row) => {
    let schema = formattedResult.find((s) => s.schema_name == row.schema);
    if (!schema) {
      schema = { schema_name: row.schema, tables: [] };
      formattedResult.push(schema);
    }

    let table = schema.tables.find((t) => t.table_name === row.table);
    if (!table) {
      table = { table_name: row.table, columns: [], primaryKeys: [] };
      schema.tables.push(table);
    }

    table.columns.push(row.column);
    // if the column is a primary key, then add it to the primary key array on the table
    if (row.isPrimaryKey && table.primaryKeys) {
      table.primaryKeys.push(row.column);
    }
  });

  return formattedResult;
};

const retrieveSchemaTablesColumns = async (client: Client) => {
  const text = `
  SELECT table_schema AS schema, table_name AS table, column_name AS column
  FROM information_schema.columns
  WHERE table_schema != 'information_schema' AND table_schema != 'pg_catalog';`;

  const result = await client.query(text);

  const rows = result.rows as QueryRow[];

  return rows;
};

const retrievePrimaryKeys = async (client: Client) => {
  const text = `
    SELECT tc.table_schema AS schema, tc.table_name AS table, kc.column_name AS primary_key
    FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kc
        ON kc.table_name = tc.table_name AND kc.table_schema = tc.table_schema AND kc.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'PRIMARY KEY'
      AND kc.ordinal_position IS NOT NULL
      AND tc.table_schema != 'pg_catalog'
    ORDER BY tc.table_schema,
            tc.table_name,
            kc.position_in_unique_constraint;`;

  const result = await client.query(text);

  const rows = result.rows as PrimaryKeyQueryRow[];

  return rows;
};

const addPrimaryKeyInfo = (schemaTableColumnRows: QueryRow[], primaryKeyRows: PrimaryKeyQueryRow[]) => {
  schemaTableColumnRows.forEach((row) => {
    const isPrimaryKey = !!primaryKeyRows.find((pkRow) => {
      return row.schema === pkRow.schema && row.table === pkRow.table && row.column === pkRow.primary_key;
    });

    row.isPrimaryKey = isPrimaryKey;
  });
};

export const extractDbInfo = async (client: Client) => {
  const schemaTableColumnRows = await retrieveSchemaTablesColumns(client);
  const primaryKeyRows = await retrievePrimaryKeys(client);

  addPrimaryKeyInfo(schemaTableColumnRows, primaryKeyRows);

  return formatResult(schemaTableColumnRows);
};

const addTablesAndColumnsToConfig = (source: FinalSourceRequestBody, config: DebeziumConfig) => {
  const selectedTables = source.formData.filter((table) => table.selected);

  const includedTables: string[] = [];
  const includedColumns: string[] = [];

  selectedTables.forEach((table) => {
    const selectedColumns = table.columns.filter((column) => column.selected).map((column) => column.dbzColumnValue);

    if (selectedColumns.length > 0) {
      includedTables.push(table.dbzTableValue);
      includedColumns.push(...selectedColumns);
    }
  });

  if (includedTables.length > 0) {
    config['table.include.list'] = includedTables.join(',');
    config['column.include.list'] = includedColumns.join(',');
  }
};

const ALLOWED_SLOT_NAME_CHARACTERS = '0123456789abcdefghijkmnopqrstuvwxyz_';

export const setupConnectorPayload = (source: FinalSourceRequestBody) => {
  const uuid = shortUuid(ALLOWED_SLOT_NAME_CHARACTERS).generate();
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
      'publication.name': 'willow_publication',
      'slot.name': `willow_${uuid}`,
      'publication.autocreate.mode': 'filtered',
    },
  };

  if (source.formData.length > 0) {
    addTablesAndColumnsToConfig(source, connectorObj.config);
  }

  return connectorObj;
};

export const parseSourceName = (topics: string[]) => {
  const topic = topics[0];

  const delimitedTopic = topic.split('.');

  // need to drop the last two elements (the schema name and table name)
  const delimitedSourceName = delimitedTopic.slice(0, delimitedTopic.length - 2);

  return delimitedSourceName.join('.');
};

export const formatTableFields = (result: Pipeline[]): Pipeline[] => {
  return result.map((row) => {
    if (!Array.isArray(row.tables)) {
      row.tables = row.tables.split(',');
    }

    return row;
  });
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

export class DatabaseError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}