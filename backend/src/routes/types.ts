export interface TypedRequest<T> extends Express.Request {
  body: T;
}

export interface SourceRequestBody {
  user: string;
  password: string;
  host: string;
  port: string;
  dbName: string;
}

type FormColumnObj = {
  column: string;
  selected: boolean;
  dbzColumnValue: string;
};

export interface FormTableObj {
  table_name: string;
  schema_name: string;
  dbzTableValue: string;
  columns: FormColumnObj[];
  selected: boolean;
}

type FormData = FormTableObj[];

export interface FinalSourceRequestBody extends SourceRequestBody {
  formData: FormData;
  connectionName: string;
}

export interface SinkRequestBody {
  url: string;
  username: string;
  password: string;
  topics: string[];
  connectionName: string;
}
