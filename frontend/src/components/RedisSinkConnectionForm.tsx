import { TextField, Typography, Grid } from "@mui/material";
import { useState, useContext } from "react";
import { postSinkCreate } from "../services/sink";
import { AlertSeverity } from "../types/types";
import { useNavigate } from "react-router-dom";
import SubmitButton from "./SubmitButton";
import SideBarSelectionContext from "../context/SideBarSelectionContext";
import { displayErrorMessage } from "../utils/utils";

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
      await postSinkCreate(connectionDetails);
      showAlertSnackbar("Connection to sink created.", "success");
      setTimeout(() => {
        setSelectedSideBarIndex(1);
        navigate("/pipelines");
      }, 1500);
    } catch (error) {
      displayErrorMessage(error, showAlertSnackbar);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Typography sx={{ marginTop: 3 }} variant="h4" gutterBottom>
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
              margin="none"
              value={connectionName}
              onChange={(e) => {
                setConnectionName(e.target.value);
              }}
              inputProps={{ maxLength: 20 }}
            />
          </Grid>
        </Grid>
        <SubmitButton content="Create Connection" />
      </form>
    </>
  );
};

export default RedisSinkConnectionForm;
