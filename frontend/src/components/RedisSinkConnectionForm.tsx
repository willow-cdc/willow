import { TextField, Typography, Grid } from "@mui/material";
import { useState, useContext } from "react";
import { postSinkCreate } from "../services/sink";
import { AlertSeverity } from "../types/types";
import { useNavigate } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import SideBarSelectionContext from "../context/SideBarSelectionContext";

interface RedisSinkConnectionFormProps {
  topics: string[];
  url: string;
  username: string;
  password: string;
  showAlertSnackbar: (message: string, severity: AlertSeverity) => void;
}

const RedisSinkConnectionForm = ({
  topics,
  url,
  username,
  password,
  showAlertSnackbar,
}: RedisSinkConnectionFormProps) => {
  const [connectionName, setConnectionName] = useState<string>("");
  const navigate = useNavigate();
  const { setSelectedSideBarIndex } = useContext(SideBarSelectionContext);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const connectionDetails = {
        url,
        username,
        password,
        topics,
        connectionName,
      };
      const data = await postSinkCreate(connectionDetails);
      console.log(data);
      showAlertSnackbar("Connection to sink created.", "success");
      setTimeout(() => {
        setSelectedSideBarIndex(1);
        navigate("/pipelines");
      }, 1500);
    } catch (error) {
      showAlertSnackbar("An error occured. Please try again.", "error");
      console.log(error);
    }
  }

  return (
    <>
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
        <SubmitButton content="Create Connection" />
      </form>
    </>
  );
};

export default RedisSinkConnectionForm;
