export interface SourceRow {
  name?: string;
  db: string;
  tables: string;
  host: string;
  port: number;
  dbUser: string;
}

export interface SinkRow {
  name?: string;
  url: string;
  usename: string;
  topics: string;
}

export interface BasicPipeline {
  pipeline_id: string;
  source_name: string;
  sink_name: string;
}

export interface Pipeline {
  source_name: string;
  source_database: string;
  source_host: string;
  source_port: string;
  source_user: string;
  sink_name: string;
  sink_url: string;
  sink_user: string;
  pipeline_id: string;
  tables: string | string[];
}

export interface ConnectionDatabase {
  connect: () => Promise<void>;
  end: () => Promise<void>;
  sourceExists: (connectionName: string) => Promise<boolean>;
  sinkExists: (connectionName: string) => Promise<boolean>;
  insertSource: (
    name: string,
    db: string,
    tables: string | undefined,
    host: string,
    port: number,
    dbUser: string
  ) => Promise<number>;
  insertSink: (name: string, url: string, username: string, topics: string) => Promise<number>;
  retrieveSource: (connectionName: string) => Promise<SourceRow | undefined>;
  deleteSource: (connectionName: string) => Promise<void>;
  retrieveSink: (connectionName: string) => Promise<SinkRow | undefined>;
  deleteSink: (connectionName: string) => Promise<void>;
  retrieveAllSources: () => Promise<SourceRow[] | unknown[]>;
  retrieveAllSinks: () => Promise<SinkRow[] | unknown[]>;
  insertPipeline: (sourceName: string, sinkName: string) => Promise<boolean>;
  retrieveAllPipelines: () => Promise<BasicPipeline[] | unknown[]>;
  retrievePipeline: (id: string) => Promise<Pipeline[] | unknown[]>;
}