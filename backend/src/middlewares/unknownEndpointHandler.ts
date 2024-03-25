import { Request, Response } from 'express';

export function unknownEndpointHandler(_request: Request, response: Response) {
  const status = 404;
  const message = 'Unknown endpoint.';
  response.status(status).send({
    status,
    message,
  });
}