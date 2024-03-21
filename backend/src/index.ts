import 'dotenv/config';
import express from 'express';
import sinkRoutes from './routes/sinkRoutes';
import sourceRoutes from './routes/sourceRoutes';
import pipelineRoutes from './routes/pipelineRoutes';
import { unknownEndpointHandler } from './middlewares/unknownEndpointHandler';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import { Client } from 'pg';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('howdy there!');
});

app.use('/consumer', sinkRoutes);
app.use('/source', sourceRoutes);
app.use('/pipelines', pipelineRoutes);

app.get('/pingPostgresContainer', async (_req, res) => {
  const client = new Client({
    connectionString: 'postgres://postgres:postgres@db:5432',
  });
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM sources');
    console.log('result\n', result);
    console.log('result.rows\n', result.rows);
    await client.end();
    res.send(result.rows);
  } catch (e) {
    console.log('something went wrong');
    console.log(e);
  }
});

app.use(unknownEndpointHandler);
app.use(errorHandler);

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running');
});
