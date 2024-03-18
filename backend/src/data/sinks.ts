import KafkaConsumer from "../lib/consumer";

interface Sink {
  name: string;
  consumer: KafkaConsumer;
}

interface SinkManager {
  sinks: Sink[];
  find: (name: string) => Sink | undefined;
  add: (name: string, consumer: KafkaConsumer) => Sink;
  delete: (name: string) => Sink | undefined;
  getAll: () => Sink[];
}

export const sinks: SinkManager  = {
  sinks: [],
  find(name: string) {
    const sink = this.sinks.find(s => s.name === name);
    return sink;
  },
  add(name: string, consumer: KafkaConsumer) {
    const exists = !!this.find(name);
    if (exists) {
      throw Error(`Sink ${name} already exists.`);
    }

    const sink = {name, consumer};
    this.sinks.push(sink);
    return sink;
  },
  delete(name: string) {
    const sink = this.find(name);
    if (sink) {
      this.sinks = this.sinks.filter(s => s.name !== name);
    }

    return sink;
  },
  getAll() {
    return this.sinks;
  }
};