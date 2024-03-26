import { SelectDataFormData } from "../types/types";

class TableSelectionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const isOneTableSelected = (formData: SelectDataFormData) => {
  if (formData.every((tableObj) => !tableObj.selected)) {
    throw new TableSelectionError("Please select at least one table");
  }
};

export const isValidConnectionName = (connectionName: string) => {
  return /^[\w\d.-]+$/i.test(connectionName);
};
