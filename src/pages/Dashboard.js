import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import AreaChart from '../components/AreaChart';
import Linecolumnchart from '../components/Linecolumnchart';
import Sidebar from "../components/Sidebar";


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const cardData = [
  { title: 'Total Department', value: 5, icon: <AccountBalanceIcon /> },
  { title: 'Completed Tasks', value: 1, icon: <PeopleIcon /> },
  { title: 'Total Meeting', value: 3, icon: <MonetizationOnIcon /> },
  { title: 'Assigned Task', value: 0, icon: <MonetizationOnIcon /> },
];

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);

  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Header props={open} onOutput={handleOutput} />
        </AppBar>
        <Sidebar open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            width: "100%",
            paddingBottom: "20px",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "start",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      textTransform: "uppercase",
                      paddingBottom: "10px",
                    }}
                  >
                    Dashboard
                  </div>
                  <div>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="/">
                        WARCAT
                      </Link>
                      <Typography color="text.primary">Dashboard</Typography>
                    </Breadcrumbs>
                  </div>
                </div>
              </Grid>
            </Grid>


            <Grid container spacing={2} >
              {cardData.map((data, index) => (
                <Grid item xs={12} sm={3} key={index}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                      <Stack spacing={2} direction="row" alignItems="center">
                        <Stack spacing={1} direction="column" alignItems="flex-start">
                          <Typography variant="body1" component="span">
                            {data.title}
                          </Typography>
                          <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                            {data.value}
                          </Typography>
                        </Stack>
                        <Box flexGrow={1} />
                        {data.icon}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ my: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card sx={{ maxWidth: 100 + "%" }}>
                  <CardContent>
                    <AreaChart />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ maxWidth: 100 + "%" }}>
                  <CardContent>
                    <Linecolumnchart />
                  </CardContent>
                </Card>
              </Grid>

            </Grid>
          </Container>
          <Box
            component="footer"
            sx={{
              width: "100%",
              paddingBottom: "20px",
            }}
          >
            <Footer />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
