export interface SourceFormConnectionDetails {
  host: string;
  port: string;
  dbName: string;
  user: string;
  password: string;
  connectionName: string;
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
  primaryKeys: string[];
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
  isPrimaryKey: boolean;
};

export interface SelectDataFormDataObj {
  table_name: string;
  schema_name: string;
  dbzTableValue: string;
  columns: SelectDataFormColumnObj[];
  selected: boolean;
  visible: boolean;
}

export type SelectDataFormData = SelectDataFormDataObj[];

export interface KafkaConnectPayload extends SourceFormConnectionDetails {
  formData: SelectDataFormData;
}

export interface PipeLine extends PipeLineMinimal {
  source_database: string;
  source_host: string;
  source_port: number;
  source_user: string;
  sink_url: string;
  sink_user: string;
  tables: string[];
}

export interface PipeLineMinimal {
  source_name: string;
  sink_name: string;
  pipeline_id: string;
}

export type PipeLineArr = PipeLineMinimal[];
export type AlertSeverity = "error" | "warning" | "info" | "success";
