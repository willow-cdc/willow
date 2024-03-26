import { TextField } from "@mui/material";
import { SourceFormConnectionDetails } from "../types/types";
import { ChangeEvent } from "react";

interface PortTextFieldProps {
  formStateObj: SourceFormConnectionDetails;
  handleChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const PortTextField = ({ formStateObj, handleChange }: PortTextFieldProps) => {
  const handlePortTextFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (/^[0-9]*$/.test(event.target.value)) {
      handleChange(event);
    } else {
      return;
    }
  };

  return (
    <TextField
      size="small"
      required
      label="port"
      fullWidth
      margin="normal"
      value={formStateObj.port}
      name="port"
      onChange={handlePortTextFieldChange}
    />
  );
};

export default PortTextField;
