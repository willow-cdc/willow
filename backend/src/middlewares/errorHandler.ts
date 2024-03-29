import { Request, Response, NextFunction } from 'express';
import { RedisError, ValidationError, DatabaseError, HttpError } from '../utils/errors';
import axios from 'axios';
import { AxiosResponseData } from './types/errorHandlerTypes';
import 'dotenv/config';

export function errorHandler(err: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (err instanceof Error) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(err.message);
    }

    let status: number;
    let message: string;

    if (err instanceof HttpError || err instanceof RedisError || err instanceof ValidationError || err instanceof DatabaseError) {
      status = err.status;
      message = err.message;
    } else if (err.message.includes('does not exist') || err.message.includes('password authentication failed')) {
      status = 400;
      message = `Connecting to Source Postgres Error: ${err.message}`;
    } else if (axios.isAxiosError(err) && err.response) {
      const data = err.response.data as AxiosResponseData;
      status = data.error_code;
      message = `Axios Error: ${data.message}`;
    } else if (/duplicate key value violates unique constraint/.test(String(err))) {
      status = 400;
      message = `Postgres Query Error: ${err.message}`;
    } else {
      status = 500;
      message = 'Unknown error occurred.';
    }

    response.status(status).json({status, message});
  }
}
