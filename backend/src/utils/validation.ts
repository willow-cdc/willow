import { SourceRequestBody, FinalSourceRequestBody } from "../routes/types/sourceRoutesTypes";
import { SinkRequestBody } from "../routes/types/sinkRoutesTypes";
import { ValidationError } from "./errors";

const MIN_PORT = 0;
const MAX_PORT = 65535;
const TOPIC_PREFIX_REGEX = /^[\w\d.-]+$/i;
const INVALID_PORT_MESSAGE = 'Invalid port.';
const INVALID_CONNECTION_NAME_MESSAGE = 'Invalid connection name.';
const MISSING_PARAMETERS_MESSAGE = 'Required parameters missing from request body.';
const INVALID_TOPICS_MESSAGE = 'Invalid topics array.';

function isValidPort(input: string) {
  const num = Number(input);
  return MIN_PORT <= num && num <= MAX_PORT && String(num) === input && Number.isInteger(num);
}

function isValidConnectionName(input: string) {
  return TOPIC_PREFIX_REGEX.test(input);
}

function isPresent(...inputs) {
  let bool = true;
  inputs.forEach(i => {
    if (i === undefined || i === null || i === '') {
      bool = false;
    }
  });

  return bool;
}

function isValidTopics(topicsArr: string[]) {
  return topicsArr.filter(t => t !== '').length > 0;
}

export function validateSourceConnectionDetails(body: SourceRequestBody) {
  const {user, password, host, port, dbName} = body;

  if (!isPresent(user, password, host, dbName)) {
    throw new ValidationError(MISSING_PARAMETERS_MESSAGE);
  }

  if (!isValidPort(port)) {
    throw new ValidationError(INVALID_PORT_MESSAGE);
  }
}

export function validateSourceBody(body: FinalSourceRequestBody) {
  const {connectionName} = body;

  validateSourceConnectionDetails(body);

  if (!isValidConnectionName(connectionName)) {
    throw new ValidationError(INVALID_CONNECTION_NAME_MESSAGE);
  }
}

export function validateSinkConnectionDetails(url: string, username: string, password: string) {
  if (!isPresent(url, username, password)) {
    throw new ValidationError(MISSING_PARAMETERS_MESSAGE);
  }
}

export function validateSinkBody(body: SinkRequestBody) {
  const {url, username, password, topics, connectionName} = body;

  validateSinkConnectionDetails(url, username, password);

  if (!isValidTopics(topics)) {
    throw new ValidationError(INVALID_TOPICS_MESSAGE);
  }

  if (!isValidConnectionName(connectionName)) {
    throw new ValidationError(INVALID_CONNECTION_NAME_MESSAGE);
  }
}