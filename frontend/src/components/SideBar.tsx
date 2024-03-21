import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { Drawer } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import RouteIcon from "@mui/icons-material/Route";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const SideBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    index: number
  ) => {
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
            onClick={(event) => handleListItemClick(event, 0)}
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
            <ListItemText
              primary="Home"
              sx={{
                color: (theme) =>
                  selectedIndex === 0
                    ? theme.palette.willowGreen.main
                    : "inherit",
              }}
            />
          </ListItemButton>
          <ListItemButton
            component={Link}
            to="/pipelines"
            onClick={(event) => handleListItemClick(event, 1)}
            selected={selectedIndex === 1}
            sx={{
              color: (theme) =>
                selectedIndex === 1
                  ? theme.palette.willowGreen.main
                  : "inherit",
            }}
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
            <ListItemText
              primary="Pipelines"
              sx={{
                color: (theme) =>
                  selectedIndex === 1
                    ? theme.palette.willowGreen.main
                    : "inherit",
              }}
            />
          </ListItemButton>
        </List>
      </Drawer>
    </>
  );
};

export default SideBar;
