export interface TypedRequest<T> extends Express.Request {
  body: T;
}

export interface SourceRequestBody {
  user: string;
  password: string;
  host: string;
  port: string;
  dbName: string;
  connectionName: string;
}

type SelectDataFormColumnObj = {
  column: string;
  selected: boolean;
  dbzColumnValue: string;
};

export interface SelectDataFormDataObj {
  table_name: string;
  schema_name: string;
  dbzTableValue: string;
  columns: SelectDataFormColumnObj[];
  selected: boolean;
}

type SelectDataFormData = SelectDataFormDataObj[];

export interface FinalSourceRequestBody extends SourceRequestBody {
  formData: SelectDataFormData;
}

export interface SinkRequestBody {
  url: string;
  username: string;
  password: string;
  topics: string[];
  connectionName: string;
}
