import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RouteIcon from "@mui/icons-material/Route";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const SideBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index);
  };
  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 193,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 193,
            boxSizing: "border-box",
          },
        }}
      >
        <Logo />
        <List component="nav" aria-label="main mailbox folders">
          <ListItemButton
            component={Link}
            to="/"
            onClick={() => handleListItemClick(0)}
            selected={selectedIndex === 0}
          >
            <ListItemIcon
              sx={{
                color: (theme) =>
                  selectedIndex === 0
                    ? theme.palette.willowGreen.main
                    : "inherit",
              }}
            >
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/pipelines"
            onClick={() => handleListItemClick(1)}
            selected={selectedIndex === 1}
          >
            <ListItemIcon
              sx={{
                color: (theme) =>
                  selectedIndex === 1
                    ? theme.palette.willowGreen.main
                    : "inherit",
              }}
            >
              <RouteIcon />
            </ListItemIcon>
            <ListItemText primary="Pipelines" />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};

export default SideBar;
