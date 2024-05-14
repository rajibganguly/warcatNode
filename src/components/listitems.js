import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';

const user = localStorage.getItem("user");
const currentRoleType = JSON.parse(user);

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard">
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/departments">
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Departments" />
    </ListItemButton>
    <ListItemButton component={Link} to="/meetings">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Meetings" />
    </ListItemButton>
    <ListItemButton component={Link} to="/tasks">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Tasks" />
    </ListItemButton>
    <ListItemButton component={Link} to="/reports">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
    </ListItemButton>
    {currentRoleType.role_type === 'admin' && (<ListItemButton component={Link} to="/task-approval">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Task Approval" />
    </ListItemButton>)}
  </React.Fragment>
);

export const secondaryListItems = (
  <>
  </>
  // <React.Fragment>
  //   <ListSubheader component="div" inset>
  //     Saved reports
  //   </ListSubheader>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <AssignmentIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Current month" />
  //   </ListItemButton>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <AssignmentIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Last quarter" />
  //   </ListItemButton>
  //   <ListItemButton>
  //     <ListItemIcon>
  //       <AssignmentIcon />
  //     </ListItemIcon>
  //     <ListItemText primary="Year-end sale" />
  //   </ListItemButton>
  // </React.Fragment>
);