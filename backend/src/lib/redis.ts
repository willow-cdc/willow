// connection to redis & sending to redis

import { type EachMessagePayload } from 'kafkajs';
import { createClient } from 'redis';
import { RedisError } from '../utils/utils';
import { Key, Value } from './types';
import { RedisSink } from './types';

export default class Redis implements RedisSink {
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
      .on('error', (err: Error) => {
        throw new RedisError(401, err.message);
      })
      .connect();

    const isReady = client.isReady;
    await client.quit();

    return isReady;
  }

  public async connect(): Promise<void> {
    await this.client
      .on('error', (err: Error) => {
        throw new RedisError(401, err.message);
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

    const parsedValue = this.parseValue(value);

    if (key === null) {
      // handle truncate events - the entire table is cleared out! no rows remaining
      console.log('TRUNCATE EVENT');
      const keyPattern = this.determineRedisKeyPattern(parsedValue) + '*';
      await this.deleteKeysMatchingPattern(keyPattern);
      return;
    }

    const parsedKey = this.parseKey(key);
    const operation = this.determineOperation(parsedValue);
    const redisKey = this.determineRedisKey(parsedKey, parsedValue);

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

  private determineRedisKey(parsedMessageKey: Key, parsedValue: Value) {
    // extract value of primary key
    const primaryKey = Object.values(parsedMessageKey.payload)[0]; // this assumes that there will ALWAYS be a single primary key (no less and no more than 1 PK)

    // Redis key is database.table.primaryKey
    const redisKey = this.determineRedisKeyPattern(parsedValue) + primaryKey;
    console.log('Redis key should be: ', redisKey);
    return redisKey;
  }

  private determineRedisKeyPattern(parsedValue: Value) {
    const {db, table} = parsedValue.payload.source;
    const redisKeyPattern = `${db}.${table}.`;
    return redisKeyPattern;
  }

  private async deleteKeysMatchingPattern(pattern: string) {
    console.log('Deleting keys matching pattern', pattern);

    for await (const key of this.client.scanIterator({
      MATCH: pattern,
      TYPE: 'ReJSON-RL',
    })) {
      console.log('Deleting Redis key:', key);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.client.del(key);
    }
  }
}
