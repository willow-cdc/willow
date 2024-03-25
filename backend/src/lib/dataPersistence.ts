import { Client } from 'pg';
import { DatabaseError } from '../utils/utils';

interface SourceRow {
  name?: string;
  db: string;
  tables: string;
  host: string;
  port: number;
  dbUser: string;
}

interface SinkRow {
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

interface ConnectionDatabase {
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

export default class Database implements ConnectionDatabase {
  private client: Client;

  public constructor(connectionString: string) {
    this.client = this.createNewClient(connectionString);
  }

  private createNewClient(connectionString: string): Client {
    const client = new Client({ connectionString });
    return client;
  }

  public async connect() {
    await this.client.connect();
  }

  public async end() {
    await this.client.end();
  }

  public async sourceExists(connectionName: string): Promise<boolean> {
    const CHECK_CONNECTION_NAME = 'SELECT NULL FROM sources WHERE name = $1';
    const result = await this.client.query(CHECK_CONNECTION_NAME, [connectionName]);
    return (result.rowCount as number) > 0;
  }

  public async sinkExists(connectionName: string): Promise<boolean> {
    const CHECK_CONNECTION_NAME = 'SELECT NULL FROM sinks WHERE name = $1';
    const result = await this.client.query(CHECK_CONNECTION_NAME, [connectionName]);
    return (result.rowCount as number) > 0;
  }

  public async insertSource(
    name: string,
    db: string,
    tables: string | undefined,
    host: string,
    port: number,
    dbUser: string
  ): Promise<number> {
    const query = 'INSERT INTO sources (name, db, tables, host, port, dbUser) VALUES ($1, $2, $3, $4, $5, $6)';
    if (!tables) {
      tables = '';
    }
    const values = [name, db, tables, host, String(port), dbUser];

    const result = await this.client.query(query, values);
    return result.rowCount as number;
  }

  public async insertSink(name: string, url: string, username: string, topics: string): Promise<number> {
    const query = 'INSERT INTO sinks (name, url, username, topics) VALUES ($1, $2, $3, $4)';
    const values = [name, url, username, topics];

    const result = await this.client.query(query, values);
    return result.rowCount as number;
  }

  public async retrieveSource(connectionName: string): Promise<SourceRow | undefined> {
    const GET_SOURCE_INFO = 'SELECT db, tables, host, port, dbUser FROM sources WHERE name = $1';

    const result = await this.client.query(GET_SOURCE_INFO, [connectionName]);
    const activity = result.rows[0] as SourceRow | undefined;
    return activity;
  }

  public async retrieveAllSources(): Promise<SourceRow[] | unknown[]> {
    const GET_SOURCE_INFO = 'SELECT name, db, tables, host, port, dbUser FROM sources';

    const result = await this.client.query(GET_SOURCE_INFO);
    const activity = result.rows as SourceRow[] | unknown[];
    return activity;
  }

  public async retrieveSink(connectionName: string): Promise<SinkRow | undefined> {
    const GET_SINK_INFO = 'SELECT url, username, topics FROM sinks WHERE name = $1';

    const result = await this.client.query(GET_SINK_INFO, [connectionName]);
    const activity = result.rows[0] as SinkRow | undefined;
    return activity;
  }

  public async retrieveAllSinks(): Promise<SinkRow[] | unknown[]> {
    const GET_SINK_INFO = 'SELECT name, url, username, topics FROM sinks';

    const result = await this.client.query(GET_SINK_INFO);
    const activity = result.rows as SinkRow[] | unknown[];
    return activity;
  }

  public async deleteSource(connectionName: string): Promise<void> {
    const DELETE_SOURCE_INFO = 'DELETE FROM sources WHERE name = $1';

    const result = await this.client.query(DELETE_SOURCE_INFO, [connectionName]);
    const rowCount = result.rowCount as number;
    if (rowCount !== 1) {
      throw new DatabaseError('Unable to delete sink from database.');
    }
  }

  public async deleteSink(connectionName: string): Promise<void> {
    const DELETE_SINK_INFO = 'DELETE FROM sinks WHERE name = $1';

    const result = await this.client.query(DELETE_SINK_INFO, [connectionName]);
    const rowCount = result.rowCount as number;
    if (rowCount !== 1) {
      throw new DatabaseError('Unable to delete sink from database.');
    }
  }

  public async insertPipeline(sourceName: string, sinkName: string): Promise<boolean> {
    const INSERT_PIPELINE_INFO = 'INSERT INTO sourceSink (source_name, sink_name) VALUES ($1, $2)';

    const result = await this.client.query(INSERT_PIPELINE_INFO, [sourceName, sinkName]);
    const rowCount = result.rowCount as number;
    return rowCount === 1;
  }

  public async retrieveAllPipelines(): Promise<BasicPipeline[] | unknown[]> {
    const GET_ALL_PIPELINE_INFO = `SELECT id AS pipeline_id, source_name, sink_name FROM sourceSink`;

    const result = await this.client.query(GET_ALL_PIPELINE_INFO);
    const activity = result.rows as BasicPipeline[] | unknown[];
    return activity;
  }

  public async retrievePipeline(id: string): Promise<Pipeline[] | unknown[]> {
    const GET_PIPELINE_INFO = `SELECT 
          sources.name AS source_name, sources.db AS source_database, sources.host AS source_host, sources.port AS source_port, sources.tables AS tables,
          sources.dbUser AS source_user, sinks.name AS sink_name, sinks.url AS sink_url, sinks.username AS sink_user, ss.id AS pipeline_id FROM sources 
        INNER JOIN sourceSink AS ss 
          ON sources.name = ss.source_name 
        INNER JOIN sinks 
          ON ss.sink_name = sinks.name
        WHERE ss.id = $1`;

    const values = [id];

    const result = await this.client.query(GET_PIPELINE_INFO, values);
    const activity = result.rows as Pipeline[] | unknown[];
    return activity;
  }
}
