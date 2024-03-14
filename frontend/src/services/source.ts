import axios from "axios";
import { formState } from "../types/types";

export const postSourceVerify = async (formState: formState) => {
  const { data } = await axios.post(
    "http://localhost:3000/source/verify", // this would need to be 'backend' instead of localhost in the future
    formState
  );
  return data.data;
};
