import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";

import { useState } from "react"

const Header = (props) => {
    const [open, setOpen] = useState(props.open);
    const toggleDrawer = (open) => {
        props.onOutput(!open)
        setOpen(!open);
    };

    return(
        <>
        <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
              background: "#505d69",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              War-room Assistant for Report Compilation & Task tracking
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </>
    )

}

export default Header;