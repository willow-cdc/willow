import {Request, Response, NextFunction} from 'express';
import { HttpError, RedisError } from '../utils/utils';

export function errorHandler(err: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    const { status, message } = err;
    response.status(status).json({ status, message });
  } else if (err instanceof RedisError) {
    const { status, message } = err;
    response.status(status).json({ status, message });
  } else {
    const status = 500;
    response.status(status).json({ status, message: 'Unknown error occurred.' });
  }
}