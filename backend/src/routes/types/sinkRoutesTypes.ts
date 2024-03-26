export interface SinkRequestBody {
  url: string;
  username: string;
  password: string;
  topics: string[];
  connectionName: string;
}