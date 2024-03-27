import axios from "axios";
import { PipeLineArr, PipeLine } from "../types/types";

export const getAllPipelines = async () => {
  const { data } = await axios.get(
    "http://localhost:3000/pipelines" // this would need to be 'backend' instead of localhost in the future
  );
  return data.data as PipeLineArr;
};

export const getPipeLineById = async (id: number) => {
  const { data } = await axios.get(
    `http://localhost:3000/pipelines/${id}` // this would need to be 'backend' instead of localhost in the future
  );
  return data.data as PipeLine;
};

export const deletePipelineById = async (id: number) => {
  await axios.delete(
    `http://localhost:3000/pipelines/${id}` // this would need to be 'backend' instead of localhost in the future
  );
};