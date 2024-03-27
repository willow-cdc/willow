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

app.use('/consumer', sinkRoutes);
app.use('/source', sourceRoutes);
app.use('/pipelines', pipelineRoutes);

app.use(unknownEndpointHandler);
app.use(errorHandler);

export default app;