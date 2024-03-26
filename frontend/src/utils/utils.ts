import { AxiosError } from "axios";
import { TableSelectionError } from "./validation";
import { AlertSeverity } from "../types/types";

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
