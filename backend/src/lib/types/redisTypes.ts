import { type EachMessagePayload } from 'kafkajs';
import { createClient } from 'redis';

// interface for the public instance methods of the Redis class in redis.ts
export interface RedisSink {
  create(url: string, password: string, username: string): ReturnType<typeof createClient>;
  connect(): void;
  processKafkaMessage(messagePayload: EachMessagePayload): Promise<void>;
  disconnect(): Promise<void>;
}

// Types for Debezium event messages

// SHARED

interface Row {
  // represents an object that contains the column name as the key and a specific row's value in that column
  [key: string]: string | number | boolean;
}

// KEYS

interface KeyFieldElementSchema {
  type: string;
  optional: string;
}

interface KeyFieldElement {
  name: string;
  index: string;
  schema: KeyFieldElementSchema;
}

interface KeySchema {
  type: 'struct';
  name: string;
  optional: boolean;
  fields: KeyFieldElement[];
}

export interface Key {
  schema: KeySchema;
  payload: Row;
}

// VALUES TYPES

interface FieldSchema {
  // schema of a field given in the value's payload
  type: string;
  optional: boolean;
  field: string;
}

interface ValueSchemaField {
  // schema for the before/after/source schema fields
  type: 'struct';
  fields: FieldSchema[];
  optional: boolean;
  name: string;
  field: 'before' | 'after' | 'source';
}

interface ValueSchemaEnvelope {
  type: 'struct';
  fields: (ValueSchemaField | FieldSchema)[]; // the FieldSchema are the 'op' and 'ts_ms' fields
  optional: boolean;
  name: string; // usually ends in .Envelope
}

interface PostgresSource {
  version: string;
  connector: 'postgresql';
  name: string;
  ts_ms: number;
  snapshot: boolean;
  db: string;
  sequence: string;
  schema: string;
  table: string;
  txId: number;
  lsn: number;
  xmin: number | null;
}

type EventOperation = 'r' | 'c' | 'u' | 'd' | 't' | 'm'; // m = message type events

interface MessageDetails {
  prefix: string;
  content: string;
}

interface ValuePayload {
  before: Row | null; // before is null for create events
  after: Row | null; // after is null for delete events
  source: PostgresSource;
  op: EventOperation;
  ts_min?: number;
  message?: MessageDetails; // only present for 'm' events
}

export interface Value {
  schema: ValueSchemaEnvelope;
  payload: ValuePayload;
}