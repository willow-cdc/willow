export class HttpError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class RedisError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(`Redis Client Error - ${message}`);
    this.status = status;
  }
}

export class NoPrimaryKeyError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export class ValidationError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export class DatabaseError extends Error {
  public status: number;
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}