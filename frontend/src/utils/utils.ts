import { AxiosError } from "axios";
import { TableSelectionError } from "./validation";
import {
  AlertSeverity,
  SelectDataFormData,
  rawTablesAndColumnsData,
} from "../types/types";

export const displayErrorMessage = (
  error: unknown,
  showAlertSnackBar: (message: string, severity: AlertSeverity) => void
) => {
  if (error instanceof TableSelectionError) {
    showAlertSnackBar(error.message, "error");
  } else if (error instanceof AxiosError) {
    const message = error.response?.data.message as string;
    showAlertSnackBar(message, "error");
  } else {
    showAlertSnackBar("An error occured. Please try again.", "error");
  }
};

export const formatrawTablesAndColumnsData = (
  rawTablesAndColumnsData: rawTablesAndColumnsData
) => {
  const result: SelectDataFormData = [];
  rawTablesAndColumnsData.forEach((schemaTables) => {
    schemaTables.tables.forEach((table) => {
      const hasPrimaryKeys = table.primaryKeys.length > 0;
      const schemaName = schemaTables.schema_name;
      const tableName = table.table_name;
      const columns = table.columns.map((column) => {
        const isPrimaryKey = table.primaryKeys.includes(column);
        return {
          column,
          selected: true,
          dbzColumnValue: `${schemaName}.${tableName}.${column}`,
          isPrimaryKey,
        };
      });

      result.push({
        table_name: tableName,
        schema_name: schemaName,
        dbzTableValue: `${schemaName}.${tableName}`,
        columns,
        selected: hasPrimaryKeys,
        visible: hasPrimaryKeys,
      });
    });
  });
  return result;
};
