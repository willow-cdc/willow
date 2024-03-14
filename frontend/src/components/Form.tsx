import FormControl from "@mui/material/FormControl";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { formState } from "../types/types";
import { postSourceVerify } from "../services/source";

const Form = () => {
  const [formStateObj, setFormStateObj] = useState<formState>({
    host: "",
    port: "",
    dbName: "",
    user: "",
    password: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const data = await postSourceVerify(formStateObj);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
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
            value={formStateObj.host}
            onChange={(e) => {
              setFormStateObj({ ...formStateObj, host: e.target.value });
            }}
          />
          <TextField
            size="small"
            required
            id="outlined-required"
            label="port"
            margin="normal"
            value={formStateObj.port}
            onChange={(e) => {
              setFormStateObj({ ...formStateObj, port: e.target.value });
            }}
          />
          <TextField
            size="small"
            required
            id="outlined-required"
            label="database name"
            margin="normal"
            value={formStateObj.dbName}
            onChange={(e) => {
              setFormStateObj({ ...formStateObj, dbName: e.target.value });
            }}
          />
          <TextField
            size="small"
            required
            id="outlined-required"
            label="user"
            margin="normal"
            value={formStateObj.user}
            onChange={(e) => {
              setFormStateObj({ ...formStateObj, user: e.target.value });
            }}
          />
          <TextField
            size="small"
            required
            id="outlined-required"
            label="password"
            margin="normal"
            value={formStateObj.password}
            onChange={(e) => {
              setFormStateObj({ ...formStateObj, password: e.target.value });
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
