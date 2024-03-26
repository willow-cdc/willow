import { TextField, Typography, Grid } from "@mui/material";
import { postSinkVerify } from "../services/sink";
import { AlertSeverity, RedisConnectionDetails } from "../types/types";
import SubmitButton from "./SubmitButton";
import { displayErrorMessage } from "../utils/utils";

interface RedisSinkVerifyConnectionFormProps {
  isValidConnection: boolean;
  setIsValidConnection: React.Dispatch<React.SetStateAction<boolean>>;
  formStateObj: RedisConnectionDetails;
  setFormStateObj: React.Dispatch<React.SetStateAction<RedisConnectionDetails>>;
  showAlertSnackbar: (message: string, severity: AlertSeverity) => void;
}

const RedisSinkVerifyConnectionForm = ({
  isValidConnection,
  setIsValidConnection,
  formStateObj,
  setFormStateObj,
  showAlertSnackbar,
}: RedisSinkVerifyConnectionFormProps) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await postSinkVerify(formStateObj);
      setIsValidConnection(true);
      showAlertSnackbar("Connection to sink successful.", "success");
    } catch (error) {
      displayErrorMessage(error, showAlertSnackbar);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormStateObj((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        CONNECT TO SINK
      </Typography>
      <Typography variant="body1" gutterBottom>
        This step will establish the connection to your target redis cache where
        changes to your source database will be sent. Please provide your redis
        connection string along with your username and password credentials.
        Once the connection to the redis cache is verified, please provide a
        unique name for this sink connection.
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <TextField
            placeholder="redis://redis-url:port"
            size="small"
            required
            variant="outlined"
            label="url"
            fullWidth
            margin="normal"
            name="url"
            value={formStateObj.url}
            onChange={handleChange}
            disabled={isValidConnection}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            size="small"
            required
            variant="outlined"
            label="username"
            fullWidth
            margin="normal"
            name="username"
            value={formStateObj.username}
            onChange={handleChange}
            disabled={isValidConnection}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="password"
            size="small"
            required
            variant="outlined"
            label="password"
            fullWidth
            margin="normal"
            name="password"
            value={formStateObj.password}
            onChange={handleChange}
            disabled={isValidConnection}
          />
        </Grid>
      </Grid>
      {!isValidConnection && <SubmitButton content="Verify Connection" />}
    </form>
  );
};

export default RedisSinkVerifyConnectionForm;
