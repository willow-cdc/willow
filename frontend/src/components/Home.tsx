import { Button, Grid, Typography } from "@mui/material";
import OriginalLogo from "../assets/Original Logo Symbol.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Grid container alignItems={"center"} spacing={15}>
      <Grid item xs={6}>
        <img src={OriginalLogo} className="homeLogo" alt="Willow logo" />
      </Grid>
      <Grid item xs={6}>
        <Typography fontWeight={500} variant="h4">
          WELCOME TO
        </Typography>
        <Typography fontWeight={500} variant="h1" color="willowGreen.main">
          WILLOW
        </Typography>
        <Button
          component={Link}
          to="/new"
          color="willowGreen"
          variant="contained"
        >
          Create a Pipeline
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
