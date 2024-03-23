import { Request, Response, NextFunction } from 'express';
import { RedisError, ValidationError } from '../utils/utils';

export function errorHandler(err: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (err instanceof Error) {
    console.error(err.message);

    if (err instanceof RedisError || err instanceof ValidationError) {
      const { status, message } = err;
      response.status(status).json({ status, message });
    } else if (err.message.includes("does not exist")) {
      const status = 400;
      response.status(status).json({ status, message: `Connecting to Postgres Error: ${err.message}`});
    }
    else {
      const status = 500;
      response.status(status).json({ status, message: 'Unknown error occurred.' });
    }
  }

}
