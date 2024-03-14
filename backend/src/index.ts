import 'dotenv/config';
// dotenv.config({ path: '/full/custom/path/to/your/env/vars' });
// dotenv.config({ path: './../..' })
import express, { ErrorRequestHandler } from 'express';
import sinkRoutes from './routes/sinkRoutes';
import sourceRoutes from './routes/sourceRoutes';
import { HttpError } from './utils/utils';

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
  }
  next();
}) as ErrorRequestHandler); // ok

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running');
});
