import FormControl from "@mui/material/FormControl";
import { Button, TextField } from "@mui/material";
import { useState } from "react";

const Form = () => {
  const [formState, setFormState] = useState({
    host: "",
    port: "",
    dbName: "",
    user: "",
    password: "",
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(formState);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <TextField
            size="small"
            required
            id="outlined-required"
            label="host"
            margin="normal"
            value={formState.host}
            onChange={(e) => {
              setFormState({ ...formState, host: e.target.value });
            }}
          />
          <TextField
            size="small"
            required
            id="outlined-required"
            label="port"
            margin="normal"
            value={formState.port}
            onChange={(e) => {
              setFormState({ ...formState, port: e.target.value });
            }}
          />
          <TextField
            size="small"
            required
            id="outlined-required"
            label="database name"
            margin="normal"
            value={formState.dbName}
            onChange={(e) => {
              setFormState({ ...formState, dbName: e.target.value });
            }}
          />
          <TextField
            size="small"
            required
            id="outlined-required"
            label="user"
            margin="normal"
            value={formState.user}
            onChange={(e) => {
              setFormState({ ...formState, user: e.target.value });
            }}
          />
          <TextField
            size="small"
            required
            id="outlined-required"
            label="password"
            margin="normal"
            value={formState.password}
            onChange={(e) => {
              setFormState({ ...formState, password: e.target.value });
            }}
          />
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </FormControl>
      </form>
    </div>
  );
};

export default Form;

// const client = new Client({
//   host: source.host,
//   port: Number(source.port),
//   database: source.dbName,
//   user: source.user,
//   password: source.password,
// });
