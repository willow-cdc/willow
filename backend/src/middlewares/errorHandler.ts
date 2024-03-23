import { Request, Response, NextFunction } from 'express';
import { RedisError, ValidationError, DatabaseError } from '../utils/utils';
import axios from 'axios';

interface AxiosResponseData {
  error_code: number;
  message: string;
}

export function errorHandler(err: unknown, _request: Request, response: Response, _next: NextFunction) {
  if (err instanceof Error) {
    console.error(err.message);

    if (err instanceof RedisError || err instanceof ValidationError || err instanceof DatabaseError) {
      const { status, message } = err;
      response.status(status).json({ status, message });
    } else if (err.message.includes('does not exist')) {
      const status = 400;
      response.status(status).json({ status, message: `Connecting to Source Postgres Error: ${err.message}` });
    } else if (axios.isAxiosError(err)) {
      if (err.response) {
        const data = err.response.data as AxiosResponseData;
        const { error_code: status, message } = data;
        response.status(status).json({ status, message: `Axios Error: ${message}` });
      }
    } else {
      const status = 500;
      response.status(status).json({ status, message: 'Unknown error occurred.' });
    }
  }
}
