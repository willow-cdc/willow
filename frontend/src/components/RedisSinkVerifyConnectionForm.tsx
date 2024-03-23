import { TextField, Typography, Grid } from "@mui/material";
import { postSinkVerify } from "../services/sink";
import { AlertSeverity, RedisConnectionDetails } from "../types/types";
import SubmitButton from "./SubmitButton";

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
      const data = await postSinkVerify(formStateObj);
      setIsValidConnection(true);
      showAlertSnackbar("Connection to sink successful.", "success");
      console.log(data);
    } catch (error) {
      showAlertSnackbar("An error occured. Please try again.", "error");
      console.log(error);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormStateObj(prevState => {
      return {...prevState, [event.target.name]: event.target.value}
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>
        CONNECT TO SINK
      </Typography>
      <Typography variant="body1" gutterBottom>
        Instructions for connecting the sink Redis cache and what is expected to
        happen. Instructions for connecting the sink cache and what is expected
        to happen. Instructions for connecting the sink cache and what is
        expected to happen.
      </Typography>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <TextField
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
      {!isValidConnection && <SubmitButton content='Verify Connection'/>}
    </form>
  );
};

export default RedisSinkVerifyConnectionForm;
