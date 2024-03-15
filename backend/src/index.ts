import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import sinkRoutes from './routes/sinkRoutes';
import sourceRoutes from './routes/sourceRoutes';
import { HttpError, RedisError } from './utils/utils';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('howdy there!');
});

app.use('/consumer', sinkRoutes);
app.use('/source', sourceRoutes);

app.use((_request, response) => {
  const status = 404;
  response.status(status).send({ status, message: 'Unknown endpoint.' });
});

app.use(((err: unknown, req, res, _next) => {
  if (err instanceof HttpError) {
    const { status, message } = err;
    res.status(status).json({ status, message });
  } else if (err instanceof RedisError) {
    const { status, message } = err;
    res.status(status).json({ status, message });
  } else {
    const status = 500;
    res.status(status).json({ status, message: 'Unknown error occurred.' });
  }
}) as ErrorRequestHandler); // ok

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running');
});
