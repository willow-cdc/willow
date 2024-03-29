import 'dotenv/config';
import express from 'express';
import sinkRoutes from './routes/sinkRoutes';
import sourceRoutes from './routes/sourceRoutes';
import pipelineRoutes from './routes/pipelineRoutes';
import { unknownEndpointHandler } from './middlewares/unknownEndpointHandler';
import { errorHandler } from './middlewares/errorHandler';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("common"));

app.use('/api/sinks', sinkRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/pipelines', pipelineRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
}

app.use(unknownEndpointHandler);

export default app;