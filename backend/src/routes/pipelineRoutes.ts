import express from 'express';
import axios from 'axios';
import Database from '../lib/dataPersistence';
import { BasicPipeline, Pipeline } from '../lib/types/dataPersistenceTypes';
import { formatTableFields } from '../utils/routeHelpers';
import { HttpError } from '../utils/errors';
import { sinks } from '../data/sinks';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  const database = new Database('postgres://postgres:postgres@db:5432');
  try {
    await database.connect();

    const data = await database.retrieveAllPipelines() as BasicPipeline[];

    await database.end();
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

    const result = await database.retrievePipeline(id) as Pipeline[];

    await database.end();
    const data = formatTableFields(result);
    if (result.length < 1) {
      throw new HttpError(404, `Pipeline with id ${id} not found.`);
    }
    res.json({data: data[0]});
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const database = new Database('postgres://postgres:postgres@db:5432');
  const id = req.params.id;
  try {
    await database.connect();

    const result = await database.retrievePipeline(id) as Pipeline[];
    const {source_name, sink_name} = result[0];
    await database.deleteSource(source_name);
    await database.deleteSink(sink_name);

    await database.end();
    await axios.delete(`http://connect:8083/connectors/${source_name}`);
    await sinks.delete(sink_name);

    res.json({ message: 'Pipeline deleted.' });
  } catch (err) {
    next(err);
  }

});

export default router;