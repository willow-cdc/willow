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
}
