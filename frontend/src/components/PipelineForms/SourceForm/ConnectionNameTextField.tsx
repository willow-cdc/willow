import { TextField } from "@mui/material";
import { SourceFormConnectionDetails } from "../../../types/types";
import { useState } from "react";
import { isValidConnectionName } from "../../../utils/validation";

interface ConnectionNameTextFieldProps {
  formStateObj: SourceFormConnectionDetails;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const ConnectionNameTextField = ({
  formStateObj,
  handleChange,
}: ConnectionNameTextFieldProps) => {
  const [isError, setIsError] = useState(false);
  const [helperText, setHelperText] = useState(" ");

  const handleConnectionNameChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (isValidConnectionName(event.target.value)) {
      setIsError(false);
      setHelperText(" ");
    } else {
      setIsError(true);
      setHelperText("Alphanumeric, dot(.) and dash(-) characters allowed only");
    }
    handleChange(event);
  };

  return (
    <TextField
      helperText={helperText}
      size="small"
      required
      label="connection name"
      fullWidth
      margin="normal"
      value={formStateObj.connectionName}
      name="connectionName"
      onChange={handleConnectionNameChange}
      error={isError}
      inputProps={{ maxLength: 20 }}
    />
  );
};

export default ConnectionNameTextField;
