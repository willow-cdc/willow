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
    "http://localhost:3000/sources/verify",
    formState
  );
  return data.data as rawTablesAndColumnsData;
};

export const postSourceKafkaConnect = async (
  KafkaConnectPayload: KafkaConnectPayload
) => {
  const { data } = await axios.post(
    "http://localhost:3000/sources/create",
    KafkaConnectPayload
  );
  return data.data;
};
