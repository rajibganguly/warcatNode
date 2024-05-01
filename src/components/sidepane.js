
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "./listitems";
import LogoBlack from "./logoblack";
import ProfileSidePane from "./profileSidepane";
import { useState } from "react"
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";

const drawerWidth = 240;

const SidePane = (props) => {
    const [open, setOpen] = useState(props.open);
    const toggleDrawer = (open) => {
        props.onOutput(!open)
        setOpen(!open);
    };

    
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
          ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
              width: theme.spacing(9),
            },
          }),
        },
      }));

    return(
        <>
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
          <Box
            sx={{
              p: 2,
              textAlign: 'center'
            }}
          >
            <ProfileSidePane />
            </Box>
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        </>
    )
}

export default SidePane;