export interface SourceFormConnectionDetails {
  host: string;
  port: string;
  dbName: string;
  user: string;
  password: string;
}

export interface RedisConnectionDetails {
  url: string;
  username: string;
  password: string;
}

export interface RedisSinkFormState extends RedisConnectionDetails {
  topics: string[];
  connectionName: string;
}

interface RawTableDataObj {
  table_name: string;
  columns: string[];
}

interface RawTablesAndColumnsDataObj {
  schema_name: string;
  tables: RawTableDataObj[];
}

export type rawTablesAndColumnsData = RawTablesAndColumnsDataObj[];

export type SelectDataFormColumnObj = {
  column: string;
  selected: boolean;
  dbzColumnValue: string;
};

interface SelectDataFormDataObj {
  table_name: string;
  schema_name: string;
  dbzTableValue: string;
  columns: SelectDataFormColumnObj[];
  selected: boolean;
}

export type SelectDataFormData = SelectDataFormDataObj[];

export interface KafkaConnectPayload extends SourceFormConnectionDetails {
  formData: SelectDataFormData;
}
