import axios from "axios";
import {
  rawTablesAndColumnsData,
  SourceFormConnectionDetails,
  KafkaConnectPayload,
} from "../types/types";

export const postSourceVerify = async (
  formState: SourceFormConnectionDetails
) => {
  const { data } = await axios.post(
    "http://localhost:3000/source/verify", // this would need to be 'backend' instead of localhost in the future
    formState
  );
  return data.data as rawTablesAndColumnsData;
};

export const postSourceKafkaConnect = async (
  KafkaConnectPayload: KafkaConnectPayload
) => {
  const { data } = await axios.post(
    "http://localhost:3000/source/connect", // this would need to be 'backend' instead of localhost in the future
    KafkaConnectPayload
  );
  return data.data;
};
