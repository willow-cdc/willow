// connection to redis & sending to redis

import { type EachMessagePayload } from 'kafkajs';
import { createClient } from 'redis';

// SHARED TYPES

interface Row {
  // represents an object that contains the column name as the key and a specific row's value in that column
  [key: string]: string | number | boolean; // will want to revisit this - does this cover all possible types? MAP? STRUCT? BYTES? Do we even want to handle those?
}

// KEYS TYPES

interface KeyFieldElementSchema {
  type: string;
  optional: string;
}

interface KeyFieldElement {
  name: string;
  index: string;
  schema: KeyFieldElementSchema;
}

interface KeySchema {
  type: 'struct';
  name: string;
  optional: boolean;
  fields: KeyFieldElement[];
}

interface Key {
  schema: KeySchema;
  payload: Row;
}

// VALUES TYPES

interface FieldSchema {
  // schema of a field given in the value's payload
  type: string;
  optional: boolean;
  field: string;
}

interface ValueSchemaField {
  // schema for the before/after/source schema fields
  type: 'struct';
  fields: FieldSchema[];
  optional: boolean;
  name: string;
  field: 'before' | 'after' | 'source';
}

interface ValueSchemaEnvelope {
  type: 'struct';
  fields: (ValueSchemaField | FieldSchema)[]; // the FieldSchema are the 'op' and 'ts_ms' fields
  optional: boolean;
  name: string; // usually ends in .Envelope
}

interface PostgresSource {
  version: string;
  connector: 'postgresql';
  name: string;
  ts_ms: number;
  snapshot: boolean;
  db: string;
  sequence: string;
  schema: string;
  table: string;
  txId: number;
  lsn: number;
  xmin: number | null;
}

type EventOperation = 'r' | 'c' | 'u' | 'd' | 't' | 'm'; // m = message type events

interface MessageDetails {
  prefix: string;
  content: string;
}

interface ValuePayload {
  before: Row | null; // before is null for create events
  after: Row | null; // after is null for delete events
  source: PostgresSource;
  op: EventOperation;
  ts_min?: number;
  message?: MessageDetails; // only present for 'm' events
}

interface Value {
  schema: ValueSchemaEnvelope;
  payload: ValuePayload;
}

export default class Redis {
  private readonly client: ReturnType<typeof createClient>;

  public constructor(url: string, password: string, username: string) {
    this.client = this.createNewClient(url, password, username);
  }

  public createNewClient(url: string, password: string, username: string): ReturnType<typeof createClient> {
    const client = createClient({ url, password, username });
    return client;
  }

  public static async checkConnection(url: string, password: string, username: string): Promise<boolean> {
    const client = createClient({ url, password, username });
    await client
      .on('error', (err) => {
        throw new Error(`Redis Client Error ${err}`);
      })
      .connect();

    const isReady = client.isReady;
    await client.quit();

    return isReady;
  }

  public async connect(): Promise<void> {
    await this.client
      .on('error', (err) => {
        throw new Error(`Redis Client Error ${err}`);
      })
      .connect();
  }

  public async processKafkaMessage(messagePayload: EachMessagePayload): Promise<void> {
    const { message } = messagePayload;
    const key = message.key;
    const value = message.value;

    if (value === null) {
      // handle tombstone events
      return;
    }

    // WHAT DO WE DO IF WE HAVE A TRUNCATE EVENT????? WHEN key === null
    if (key === null) {
      // handle truncate events - the entire table is cleared out! no rows remaining
      // figure out and create function to appropriately han
      return;
    }

    const parsedKey = this.parseKey(key);
    const parsedValue = this.parseValue(value);

    const operation = this.determineOperation(parsedValue);
    const redisKey = this.determineRedisKey(parsedKey);

    console.log('Performing', operation, 'operation on Redis key ', redisKey);

    // if we see a delete event, then delete that key-value pair from Redis
    if (operation === 'd') {
      console.log('Deleting', redisKey, 'from Redis.');
      await this.client.del(redisKey);
      // otherwise update the key-value pair in Redis for create, update, and read events
    } else {
      const value = parsedValue.payload.after;
      console.log('Setting Redis key', redisKey, 'to value: ', value);

      await this.client.json.set(redisKey, '$', value);
    }
  }

  private parseKey(messageKey: Buffer) {
    return JSON.parse(messageKey.toString()) as Key;
  }

  private parseValue(messageValue: Buffer): Value {
    return JSON.parse(messageValue.toString()) as Value;
  }

  private determineOperation(parsedMessageValue: Value) {
    return parsedMessageValue.payload.op;
  }

  private determineRedisKey(parsedMessageKey: Key) {
    // extract value of primary key
    const primaryKey = Object.values(parsedMessageKey.payload)[0]; // this assumes that there will ALWAYS be a single primary key (no less and no more than 1 PK)

    // extract the topic prefix (the database name) and the table
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [database, _schema, table] = parsedMessageKey.schema.name.split('.');

    const redisKey = `${database}.${table}.${primaryKey}`;
    console.log('Redis key should be: ', redisKey);
    return redisKey;
  }
}
