import axios from "axios";
import { RedisSinkFormState, RedisConnectionDetails } from "../types/types";

export const postSinkVerify = async (formState: RedisConnectionDetails) => {
  const { data } = await axios.post(
    "http://localhost:3000/consumer/check", // this would need to be 'backend' instead of localhost in the future
    formState
  );
  return data.data;
};

export const postSinkCreate = async (formState: RedisSinkFormState) => {
  const { data } = await axios.post(
    "http://localhost:3000/consumer/create", // this would need to be 'backend' instead of localhost in the future
    formState
  );
  return data.data;
};
