import { Pipeline } from "../lib/types/dataPersistenceTypes";

export const parseSourceName = (topics: string[]) => {
  const topic = topics[0];

  const delimitedTopic = topic.split('.');

  const delimitedSourceName = delimitedTopic.slice(0, delimitedTopic.length - 2);

  return delimitedSourceName.join('.');
};

export const formatTableFields = (result: Pipeline[]): Pipeline[] => {
  return result.map((row) => {
    if (!Array.isArray(row.tables)) {
      row.tables = row.tables.split(',');
    }

    return row;
  });
};