import {
  type Consumer,
  type ConsumerSubscribeTopics,
  Kafka,
  type EachMessagePayload
} from 'kafkajs'

export default class ExampleConsumer {
  private readonly kafkaConsumer: Consumer
  // private readonly messageProcessor: ExampleMessageProcessor

  public constructor (
    // messageProcessor: ExampleMessageProcessor,
    clientId: string,
    brokerArr: string[],
    groupId: string
  ) {
    // this.messageProcessor = messageProcessor;
    this.kafkaConsumer = this.createKafkaConsumer(clientId, brokerArr, groupId)
  }

  public async startConsumer (topicsArray: string[]): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: topicsArray,
      fromBeginning: true
    }

    try {
      await this.kafkaConsumer.connect()
      await this.kafkaConsumer.subscribe(topic)

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
          console.log(`- ${prefix} ${message.key}#${message.value}`)
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
