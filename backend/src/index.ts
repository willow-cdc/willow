import 'dotenv/config';
import express, { ErrorRequestHandler } from 'express';
import sinkRoutes from './routes/sinkRoutes';
import sourceRoutes from './routes/sourceRoutes';
import { HttpError, RedisError } from './utils/utils';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('howdy there!');
});

app.use('/consumer', sinkRoutes);
app.use('/source', sourceRoutes);

app.use(((err: unknown, req, res, next) => {
  if (err instanceof HttpError) {
    const { status, message } = err;
    res.status(status).json({ status, message });
  } else if (err instanceof RedisError) {
    const { status, message } = err;
    res.status(status).json({ status, message });
  }
  next();
}) as ErrorRequestHandler); // ok

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running');
});
