export interface formState {
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
