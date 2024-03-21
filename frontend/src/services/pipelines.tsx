import axios from "axios";
import { PipeLineArr } from "../types/types";

export const getAllPipelines = async () => {
  const { data } = await axios.get(
    "http://localhost:3000/pipelines" // this would need to be 'backend' instead of localhost in the future
  );
  return data.data as PipeLineArr;
};
