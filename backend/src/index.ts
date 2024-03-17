import 'dotenv/config';
import express from 'express';
import sinkRoutes from './routes/sinkRoutes';
import sourceRoutes from './routes/sourceRoutes';
import { unknownEndpointHandler } from './middlewares/unknownEndpointHandler';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('howdy there!');
});

app.use('/consumer', sinkRoutes);
app.use('/source', sourceRoutes);

app.use(unknownEndpointHandler);
app.use(errorHandler);

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running');
});
