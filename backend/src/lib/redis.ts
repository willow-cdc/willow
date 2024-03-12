// connection to redis & sending to redis

import { type EachMessagePayload } from 'kafkajs'
import { createClient } from 'redis'

export default class Redis {
  private readonly client: ReturnType<typeof createClient>

  public constructor (url: string, password: string, username: string) {
    this.client = this.createNewClient(url, password, username)
  }

  public createNewClient (
    url: string,
    password: string,
    username: string
  ): ReturnType<typeof createClient> {
    const client = createClient({ url, password, username })
    return client
  }

  public async connect (): Promise<void> {
    await this.client.on('error', (err) => {
      throw new Error(`Redis Client Error ${err}`)
    })
      .connect()
  }

  public async processKafkaMessage (messagePayload: EachMessagePayload): Promise<void> {
    const { message } = messagePayload
    const key: Buffer | null = message.key
    const value: Buffer | null = message.value
    const parsedKey = this.parseKey(key)
    const parsedValue = this.parseValue(value)

    const operation = this.determineOperation(parsedValue)
    const redisKey = this.determineRedisKey(parsedKey)

    console.log('Performing', operation, 'operation on Redis key ', redisKey)

    // if we see a delete event, then delete that key-value pair from Redis
    if (operation === 'd') {
      console.log('Deleting', redisKey, 'from Redis.')
      await this.client.del(redisKey)
    // otherwise update the key-value pair in Redis for create, update, and read events
    } else {
      const value = JSON.stringify(parsedValue.payload.after)
      console.log('Setting Redis key', redisKey, 'to value: ', value)

      await this.client.sendCommand([
        'JSON.SET',
        redisKey,
        '$',
        JSON.stringify(parsedValue.payload.after)
      ])
    }
  }

  private parseKey (messageKey: Buffer | null): any { // change the any!
    if (messageKey === null) {
      return null
    }

    return JSON.parse(messageKey.toString())
  }

  private parseValue (messageValue: Buffer | null): any { // change the any!
    if (messageValue === null) {
      return null
    }

    return JSON.parse(messageValue.toString())
  }

  private determineOperation (parsedMessageValue: any): any { // need to change the any return type AND have the correct parsedMessage argument type
    if (parsedMessageValue === null) {
      return null
    }
    return parsedMessageValue.payload.op
  }

  private determineRedisKey (parsedMessageKey: any): string { // need to change the any return type AND have the correct parsedMessage argument type
    // extract value of primary key
    const primaryKey = Object.values(parsedMessageKey.payload as string[])[0] // need to change type assertion to actual type

    // extract the topic prefix (the database name) and the table
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [database, _schema, table] = parsedMessageKey.schema.name.split('.')

    const redisKey = `${database}.${table}.${primaryKey}`
    console.log('Redis key should be: ', redisKey)
    return redisKey
  }
}
