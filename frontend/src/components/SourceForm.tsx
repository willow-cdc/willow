import {
  TextField,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import React from "react";
import {
  AlertSeverity,
  SourceFormConnectionDetails,
  rawTablesAndColumnsData,
} from "../types/types";
import { postSourceVerify } from "../services/source";
import SubmitButton from "./SubmitButton";

interface SourceFormProps {
  formStateObj: SourceFormConnectionDetails;
  setFormStateObj: React.Dispatch<
    React.SetStateAction<SourceFormConnectionDetails>
  >;
  setIsValidSourceConnection: React.Dispatch<React.SetStateAction<boolean>>;
  setrawTablesAndColumnsData: React.Dispatch<
    React.SetStateAction<rawTablesAndColumnsData>
  >;
  showAlertSnackbar: (message: string, severity: AlertSeverity) => void;
}

const SourceForm = ({
  formStateObj,
  setFormStateObj,
  setIsValidSourceConnection,
  setrawTablesAndColumnsData,
  showAlertSnackbar,
}: SourceFormProps) => {

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = await postSourceVerify(formStateObj);
      setIsValidSourceConnection(true);
      setrawTablesAndColumnsData(data);
      showAlertSnackbar("Connection to source database successful.", "success");
    } catch (error) {
      setIsValidSourceConnection(false);
      setrawTablesAndColumnsData([]);
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
    <>
      <Container maxWidth="md" sx={{ marginBottom: 10 }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            CONNECT TO SOURCE
          </Typography>
          <Typography variant="body1" gutterBottom>
            Instructions for connecting the source PostgreSQL database and what
            is expected to happen. Instructions for connecting the source
            database and what is expected to happen. Instructions for connecting
            the source database and what is expected to happen.
          </Typography>
          <Grid container rowSpacing={4} columnSpacing={2} alignItems="center">
            <Grid item xs={12}>
              <TextField
                size="small"
                required
                label="connection name"
                fullWidth
                margin="normal"
                value={formStateObj.connectionName}
                name="connectionName"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography marginTop={-3} align="center" variant="body2">
                Provide a unique name for this source connection.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                required
                label="host"
                fullWidth
                margin="normal"
                value={formStateObj.host}
                name="host"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
                <TextField
                  size="small"
                  required
                  label="port"
                  fullWidth
                  value={formStateObj.port}
                  name="port"
                  onChange={handleChange}
                />
            </Grid>
            <Grid item xs={12}>
              <Typography marginTop={-3} align="center" variant="body2">
                The host is the IP address for the database from which you want
                to stream. This will need to be exposed publicly which can be
                done by using a tool like ngrok or if your database has a public
                IP and the correct settings.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                required
                label="database name"
                fullWidth
                margin="normal"
                value={formStateObj.dbName}
                name="dbName"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                Please provide the name of the source database you would like to
                stream from.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                required
                label="user"
                fullWidth
                margin="normal"
                value={formStateObj.user}
                name="user"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="password"
                size="small"
                required
                label="password"
                fullWidth
                margin="normal"
                value={formStateObj.password}
                name="password"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography marginTop={-3} align="center" variant="body2">
                This is the username and password for the database you entered
                above.
              </Typography>
            </Grid>
          </Grid>
          <SubmitButton content="Connect"/>
        </form>
      </Container>
    </>
  );
};

export default SourceForm;
