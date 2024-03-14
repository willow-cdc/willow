export interface SourceRequestBody {
  user: string;
  password: string;
  host: string;
  port: string;
  dbName: string;
  connectionName: string;
  tables?: string[];
}
