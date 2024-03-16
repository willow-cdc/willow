import {
  Button,
  TextField,
  Grid,
  Typography,
  Container,
  FormControl,
  // FormHelperText,
} from "@mui/material";
import { useState } from "react";
import { formState } from "../types/types";
import { postSourceVerify } from "../services/source";

const TestForm = () => {
  const [formStateObj, setFormStateObj] = useState<formState>({
    host: "",
    port: "",
    dbName: "",
    user: "",
    password: "",
  });

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const data = await postSourceVerify(formStateObj);
      console.log(data);
    } catch (error) {
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
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
              <TextField
                size="small"
                required
                id="outlined-required"
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
                  id="outlined-required"
                  label="port"
                  // fullWidth
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
              <Typography variant="body2">
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
                id="outlined-required"
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
                id="outlined-required"
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
                id="outlined-required"
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
          </Grid>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </form>
      </Container>
    </>
  );
};

export default TestForm;
