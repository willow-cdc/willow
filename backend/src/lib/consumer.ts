import { type Consumer, type ConsumerSubscribeTopics, Kafka, type EachMessagePayload } from 'kafkajs';
import { RedisSink } from './types';

export default class KafkaConsumer {
  private readonly kafkaConsumer: Consumer;
  private readonly redis: RedisSink; // this is our Redis class - update the type!

  public constructor(
    redis: RedisSink, // fix the typing to be our custom Redis class!
    clientId: string,
    brokerArr: string[],
    groupId: string
  ) {
    this.redis = redis;
    this.kafkaConsumer = this.createKafkaConsumer(clientId, brokerArr, groupId);
  }

  public async startConsumer(topicsArray: string[]): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: topicsArray,
      fromBeginning: true,
    };

    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe(topic);

    await this.kafkaConsumer.run({
      eachMessage: async (messagePayload: EachMessagePayload) => {
        try {
          await this.redis.processKafkaMessage(messagePayload);
        } catch (err) {
          console.error(err);
        }
      },
    });
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(clientId: string, brokerArr: string[], groupId: string): Consumer {
    const kafka = new Kafka({
      clientId, // 'client-id'
      brokers: brokerArr, // ['example.kafka.broker:9092']
    });
    const consumer = kafka.consumer({ groupId });
    return consumer;
  }
}
