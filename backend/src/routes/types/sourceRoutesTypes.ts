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

interface FormTableObj {
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