// routes for retrieving existing pipelines
import express from 'express';
import Database, { Pipeline } from '../lib/dataPersistence';
import { formatPipelineRows, PipelineResult} from '../utils/utils';


const router = express.Router();

router.get('/', async (_req, res, next) => {
  const database = new Database('postgres://postgres:postgres@db:5432');
  try {
    await database.connect();

    const result = await database.retrieveAllPipelines() as PipelineResult[];

    await database.end();
    const data = formatPipelineRows(result);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;