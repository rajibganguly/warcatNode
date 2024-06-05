import React, { useState } from "react";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Menu from '@mui/material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../pages/common";

const Header = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);

  
  const localUser = localStorage.getItem('user');
  const user = JSON.parse(localUser);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    handleClose(); // Assuming handleClose is defined somewhere in your component
    navigate('/logout');
  };

  const toggleDrawer = () => {
    props.onOutput(!props.open);
  };


  return (
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
            display: props.open ? "none" : "block",
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
        <Button
          id="basic-button"
          aria-controls={anchorEl ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl)}
          onClick={handleClick}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Avatar alt="Avatar" src={null} />
            <Typography sx={{ color: 'white', variant: 'body1', textTransform: 'none' }}> {capitalizeFirstLetter(user.name)}</Typography>
          </Stack>

        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <Stack sx={{ minWidth: 150 }}>
            <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
              <LogoutIcon sx={{ marginRight: '10px', color: 'red' }} />
              Logout
            </MenuItem>
          </Stack>
        </Menu>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </>
  );
};

export default Header;
