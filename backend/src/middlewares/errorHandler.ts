import { Request, Response, NextFunction } from 'express';
import { RedisError, ValidationError } from '../utils/utils';

export function errorHandler(err: unknown, _request: Request, response: Response, _next: NextFunction) {
  console.error((err as Error).message);

  if (err instanceof RedisError || err instanceof ValidationError) {
    const { status, message } = err;
    response.status(status).json({ status, message });
  } else {
    const status = 500;
    response.status(status).json({ status, message: 'Unknown error occurred.' });
  }
}
