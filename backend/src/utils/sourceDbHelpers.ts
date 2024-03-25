import { Client } from 'pg';
import { Schema, QueryRow, PrimaryKeyQueryRow } from './types/sourceDbHelpersTypes';

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

