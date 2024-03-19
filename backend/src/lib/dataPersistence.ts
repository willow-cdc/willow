import { Client } from 'pg';

interface SourceRow {
  db: string;
  tables: string;
  host: string;
  port: number;
  dbUser: string;
}

interface SinkRow {
  url: string;
  usename: string;
  topics: string;
}

export default class Database {
  private client: Client; // double-check typing for this.

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

  public async insertSourceInfo(
    name: string,
    db: string,
    tables: string,
    host: string,
    port: number,
    dbUser: string
  ): Promise<number> {
    const query = 'INSERT INTO sources (name, db, tables, host, port, dbUser) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [name, db, tables, host, port, dbUser];

    const result = await this.client.query(query, values);
    return result.rowCount as number;
  }

  public async insertSinkInfo(name: string, url: string, username: string, topics: string): Promise<number> {
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

  public async deleteSource(connectionName: string): Promise<boolean> {
    const DELETE_SOURCE_INFO = 'DELETE FROM sources WHERE name = $1';

    const result = await this.client.query(DELETE_SOURCE_INFO, [connectionName]);
    const rowCount = result.rowCount as number;
    return rowCount === 1;
  }

  public async retrieveSink(connectionName: string): Promise<SinkRow | undefined> {
    const GET_SINK_INFO = 'SELECT url, username, topics FROM sinks WHERE name = $1';

    const result = await this.client.query(GET_SINK_INFO, [connectionName]);
    const activity = result.rows[0] as SinkRow | undefined;
    return activity;
  }

  public async deleteSink(connectionName: string): Promise<boolean> {
    const DELETE_SINK_INFO = 'DELETE FROM sinks WHERE name = $1';

    const result = await this.client.query(DELETE_SINK_INFO, [connectionName]);
    const rowCount = result.rowCount as number;
    return rowCount === 1;
  }
}
