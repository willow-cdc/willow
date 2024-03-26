import { type Consumer, type ConsumerSubscribeTopics, Kafka, type EachMessagePayload } from 'kafkajs';
import { RedisSink } from './types/redisTypes';
import { ConsumerSink } from './types/consumerTypes';

export default class KafkaConsumer implements ConsumerSink {
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

  public async start(topicsArray: string[]): Promise<void> {
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
    await this.redis.disconnect();
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
