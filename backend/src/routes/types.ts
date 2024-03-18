export interface TypedRequest<T> extends Express.Request {
  body: T;
}

export interface SourceRequestBody {
  user: string;
  password: string;
  host: string;
  port: string;
  dbName: string;
  connectionName: string;
  tables?: string[];
}

export interface SinkRequestBody {
  url: string;
  username: string;
  password: string;
  topics: string[];
  connectionName: string;
}