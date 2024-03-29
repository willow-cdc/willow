import axios from "axios";
import { PipeLineArr, PipeLine } from "../types/types";

export const getAllPipelines = async () => {
  const { data } = await axios.get(
    "http://localhost:3000/api/pipelines"
  );
  return data.data as PipeLineArr;
};

export const getPipeLineById = async (id: number) => {
  const { data } = await axios.get(
    `http://localhost:3000/api/pipelines/${id}`
  );
  return data.data as PipeLine;
};

export const deletePipelineById = async (id: number) => {
  await axios.delete(
    `http://localhost:3000/api/pipelines/${id}`
  );
};
