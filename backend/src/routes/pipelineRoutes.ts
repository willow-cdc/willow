// routes for retrieving existing pipelines
import express from 'express';
import Database, { BasicPipeline } from '../lib/dataPersistence';
import { formatPipelineRows, HttpError, PipelineResult} from '../utils/utils';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  const database = new Database('postgres://postgres:postgres@db:5432');
  try {
    await database.connect();

    const data = await database.retrieveAllPipelines() as BasicPipeline[];

    await database.end();
    console.log(data);
    res.json({data});
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  const database = new Database('postgres://postgres:postgres@db:5432');
  const id = req.params.id;
  try {
    await database.connect();

    const result = await database.retrievePipeline(id) as PipelineResult[];

    await database.end();
    const data = formatPipelineRows(result);
    if (data.length < 1) {
      throw new HttpError(404, `Pipeline with id ${id} not found.`);
    }
    res.json({data: data[0]});
  } catch (err) {
    next(err);
  }
});

export default router;