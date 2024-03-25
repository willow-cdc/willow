interface Table {
  table_name: string;
  columns: string[];
  primaryKeys?: string[];
}

export interface Schema {
  schema_name: string;
  tables: Table[];
}

export interface QueryRow {
  schema: string;
  table: string;
  column: string;
  isPrimaryKey?: boolean;
}

export interface PrimaryKeyQueryRow {
  schema: string;
  table: string;
  primary_key: string;
}