export interface ConsumerSink {
  startConsumer: (topicsArray: string[]) => Promise<void>;
  shutdown: () => Promise<void>; 
}