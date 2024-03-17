import { type Consumer, type ConsumerSubscribeTopics, Kafka, type EachMessagePayload } from 'kafkajs';
import { RedisSink } from './types';

export default class KafkaConsumer {
  private readonly kafkaConsumer: Consumer;
  private readonly redis: RedisSink;

  public constructor(
    redis: RedisSink,
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
      clientId,
      brokers: brokerArr,
    });
    const consumer = kafka.consumer({ groupId });
    return consumer;
  }
}
