import { Client } from 'pg';

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
    let result = await this.client.query(CHECK_CONNECTION_NAME, [connectionName]);
    return (result.rowCount as number) > 0;
  }

  public async sinkExists(connectionName: string): Promise<boolean> {
    const CHECK_CONNECTION_NAME = 'SELECT NULL FROM sinks WHERE name = $1';
    let result = await this.client.query(CHECK_CONNECTION_NAME, [connectionName]);
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
}
