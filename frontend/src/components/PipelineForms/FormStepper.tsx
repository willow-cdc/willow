import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Snackbar, Alert } from "@mui/material";
import SourceConnectionForm from "./SourceForm/SourceConnectionForm";
import RedisSinkForm from "./SinkForm/RedisSinkForm";
import { useState } from "react";
import { AlertSeverity } from "../../types/types";

const steps = ["CONNECT TO SOURCE", "CONNECT TO CACHE"];

export default function FormStepper() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertSeverity>("info");

  const showAlertSnackbar = (message: string, severity: AlertSeverity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleNext = () => {
    if (activeStep + 1 <= steps.length) {
      setActiveStep((prev) => prev + 1);
    } else {
      console.log("steps complete");
    }
  };

  const renderForm = () => {
    switch (activeStep) {
      case 0:
        return (
          <SourceConnectionForm
            handleNext={handleNext}
            showAlertSnackbar={showAlertSnackbar}
          />
        );
      case 1:
        return <RedisSinkForm showAlertSnackbar={showAlertSnackbar} />;
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <>
      <Box sx={{ marginBottom: 10, width: "100%" }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{ marginBottom: 10 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={snackbarSeverity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
        {renderForm()}
      </Box>
    </>
  );
}
