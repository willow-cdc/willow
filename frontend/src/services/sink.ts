import axios from "axios";
import { RedisSinkFormState, RedisConnectionDetails } from "../types/types";

export const postSinkVerify = async (formState: RedisConnectionDetails) => {
  const { data } = await axios.post(
    "http://localhost:3000/sinks/verify",
    formState
  );
  return data.data;
};

export const postSinkCreate = async (formState: RedisSinkFormState) => {
  const { data } = await axios.post(
    "http://localhost:3000/sinks/create",
    formState
  );
  return data.data;
};
