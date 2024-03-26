export interface ConsumerSink {
  start: (topicsArray: string[]) => Promise<void>;
  shutdown: () => Promise<void>; 
}