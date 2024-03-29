import { Request, Response } from 'express';
import path from 'path';
import 'dotenv/config';

export function unknownEndpointHandler(_request: Request, response: Response) {
  if (process.env.NODE_ENV === 'production') {
    response.sendFile(path.join(__dirname + '../../../dist/index.html'));
  } else {
    const status = 404;
    const message = 'Unknown endpoint.';
    response.status(status).send({
      status,
      message,
    });
  }
}