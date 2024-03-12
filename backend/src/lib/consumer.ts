import {
  type Consumer,
  type ConsumerSubscribeTopics,
  Kafka,
  type EachMessagePayload
} from 'kafkajs'

export default class ExampleConsumer {
  private readonly kafkaConsumer: Consumer
  private readonly redis: any // this is our Redis class - update the type!

  public constructor (
    redis: any, // fix the typing to be our custom Redis class!
    clientId: string,
    brokerArr: string[],
    groupId: string
  ) {
    this.redis = redis
    this.kafkaConsumer = this.createKafkaConsumer(clientId, brokerArr, groupId)
  }

  public async startConsumer (topicsArray: string[]): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: topicsArray,
      fromBeginning: true
    }

    try {
      await this.redis.connect() // should we do this connection outside of this consumer class?
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          this.redis.processKafkaMessage(messagePayload)
        }
      })
    } catch (error) {
      console.log('Error: ', error)
    }
  }

  public async shutdown (): Promise<void> {
    await this.kafkaConsumer.disconnect()
  }

  private createKafkaConsumer (
    clientId: string,
    brokerArr: string[],
    groupId: string
  ): Consumer {
    const kafka = new Kafka({
      clientId, // 'client-id'
      brokers: brokerArr // ['example.kafka.broker:9092']
    })
    const consumer = kafka.consumer({ groupId })
    return consumer
  }
}
