import { Button, TextField, Typography, Grid } from "@mui/material";
import { useState } from "react";
import { postSinkCreate } from "../services/sink";

const RedisSinkConnectionForm = ({topics, url, username, password} : {topics: string[], url: string, username: string, password: string}) => {
  const [connectionName, setConnectionName] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const connectionDetails = {
        url,
        username,
        password,
        topics,
        connectionName
      }
      const data = await postSinkCreate(connectionDetails);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
    {/* <Container maxWidth="md"> */}
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          CREATE SINK CONNECTION
        </Typography>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12}>
            <TextField
              size="small"
              required
              variant="outlined"
              label="connection name"
              fullWidth
              margin="normal"
              value={connectionName}
              onChange={(e) => {
                setConnectionName(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="success">
          Create Connection
        </Button>
      </form>
    {/* </Container> */}
  </>
  )
}

export default RedisSinkConnectionForm;