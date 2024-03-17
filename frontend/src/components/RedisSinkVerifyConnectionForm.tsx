import { Button, TextField, Typography, Grid } from '@mui/material';
import { postSinkVerify } from '../services/sink';
import { RedisConnectionDetails } from '../types/types';

const RedisSinkVerifyConnectionForm = ({isValidConnection, setIsValidConnection, formStateObj, setFormStateObj}: {isValidConnection: boolean, setIsValidConnection: React.Dispatch<React.SetStateAction<boolean>>, formStateObj: RedisConnectionDetails, setFormStateObj: React.Dispatch<React.SetStateAction<RedisConnectionDetails>>}) => {
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = await postSinkVerify(formStateObj);
      setIsValidConnection(true);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  return ( 
  <form onSubmit={handleSubmit}>
    <Typography variant="h4" gutterBottom>
      CONNECT TO SINK
    </Typography>
    <Typography variant="body1" gutterBottom>
      Instructions for connecting the sink Redis cache and what is
      expected to happen. Instructions for connecting the sink cache and
      what is expected to happen. Instructions for connecting the sink
      cache and what is expected to happen.
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
          value={formStateObj.url}
          onChange={(e) => {
            setFormStateObj({ ...formStateObj, url: e.target.value });
          }}
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
          value={formStateObj.username}
          onChange={(e) => {
            setFormStateObj({
              ...formStateObj,
              username: e.target.value,
            });
          }}
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
          value={formStateObj.password}
          onChange={(e) => {
            setFormStateObj({
              ...formStateObj,
              password: e.target.value,
            });
          }}
          disabled={isValidConnection}
        />
      </Grid>
    </Grid>
    {isValidConnection ? null : (
      <Button type="submit" variant="contained" color="success">
        Verify Connection
      </Button>
    )}
  </form> );
}

export default RedisSinkVerifyConnectionForm;