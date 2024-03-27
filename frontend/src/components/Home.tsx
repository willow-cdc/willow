import { Button, Grid, Typography } from "@mui/material";
import TransparentLogo from "../assets/Transparent Logo No Name.png";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Grid container alignItems={"center"} spacing={15}>
      <Grid item xs={6} style={{ marginLeft: "5%" }}>
        <img
          src={TransparentLogo}
          className="homeLogo"
          alt="Willow logo"
          style={{ maxWidth: "100%", width: "100%", height: "100%" }}
        />
      </Grid>
      <Grid item xs={6} style={{ marginLeft: "-10%" }}>
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
          Create a CDC Pipeline
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
