import React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoBlack from "../components/logoblack";
import ProfileSidePane from "../components/profileSidepane";
import { mainListItems, secondaryListItems } from "../components/listitems";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(open && {
      width: drawerWidth,
    }),
    ...(!open && {
      overflowX: "hidden",
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const Sidebar = ({ open, toggleDrawer }) => {
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          background: "#505d69",
          px: [1],
        }}
      >
        <LogoBlack />
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon sx={{ color: "white" }} />
        </IconButton>
      </Toolbar>
      <Divider />
      <ProfileSidePane isopen={open} />
      <List component="nav">
        {mainListItems}
        <Divider sx={{ my: 1 }} />
        {secondaryListItems}
      </List>
    </Drawer>
  );
};

export default Sidebar;
