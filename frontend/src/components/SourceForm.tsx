import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  FormControl,
  Box,
  // FormHelperText,
} from "@mui/material";
import React from "react";
import {
  SourceFormConnectionDetails,
  rawTablesAndColumnsData,
} from "../types/types";
import { postSourceVerify } from "../services/source";

const SourceForm = ({
  formStateObj,
  setFormStateObj,
  isValidSourceConnection,
  setIsValidSourceConnection,
  setrawTablesAndColumnsData,
}: {
  formStateObj: SourceFormConnectionDetails;
  setFormStateObj: React.Dispatch<
    React.SetStateAction<SourceFormConnectionDetails>
  >;
  isValidSourceConnection: boolean;
  setIsValidSourceConnection: React.Dispatch<React.SetStateAction<boolean>>;
  setrawTablesAndColumnsData: React.Dispatch<
    React.SetStateAction<rawTablesAndColumnsData>
  >;
}) => {
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = await postSourceVerify(formStateObj);
      setIsValidSourceConnection(true);
      setrawTablesAndColumnsData(data);
    } catch (error) {
      setIsValidSourceConnection(false);
      setrawTablesAndColumnsData([]);
      console.log(error);
    }
  }

  return (
    <>
      <Container maxWidth="md">
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
            <Grid item xs={6}>
              <TextField
                size="small"
                required
                label="host"
                fullWidth
                margin="normal"
                value={formStateObj.host}
                onChange={(e) => {
                  setFormStateObj({ ...formStateObj, host: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <TextField
                  size="small"
                  required
                  label="port"
                  fullWidth
                  // margin="normal"
                  value={formStateObj.port}
                  onChange={(e) => {
                    setFormStateObj({ ...formStateObj, port: e.target.value });
                  }}
                />
                {/* <FormHelperText>Required</FormHelperText> */}
              </FormControl>
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
                onChange={(e) => {
                  setFormStateObj({ ...formStateObj, dbName: e.target.value });
                }}
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
                onChange={(e) => {
                  setFormStateObj({ ...formStateObj, user: e.target.value });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                size="small"
                required
                label="password"
                fullWidth
                margin="normal"
                value={formStateObj.password}
                onChange={(e) => {
                  setFormStateObj({
                    ...formStateObj,
                    password: e.target.value,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography marginTop={-3} align="center" variant="body2">
                This is the username and password for the database you entered
                above.
              </Typography>
            </Grid>
          </Grid>
          <Box marginTop={3} display="flex" justifyContent="center">
            <Button
              disabled={isValidSourceConnection}
              color="willowGreen"
              type="submit"
              variant="contained"
            >
              Connect
            </Button>
          </Box>
        </form>
      </Container>
    </>
  );
};

export default SourceForm;
