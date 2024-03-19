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
}
