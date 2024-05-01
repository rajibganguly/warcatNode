import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "../components/listitems";
import LogoBlack from "../components/logoblack";
import ProfileSidePane from "../components/profileSidepane";
import MuiDrawer from "@mui/material/Drawer";
import { Button, ButtonGroup, TextField } from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

//import Orders from "../components/orders";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import SidePane from "../components/sidepane";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";

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

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AddDepartment() {
  const [open, setOpen] = React.useState(true);
  const [submitDisable, setSubmitDisable] = React.useState(true);
  const [formData, setFormData] = React.useState({
    secretary: {
      email: "",
      name: "",
      role_type: "secretary",
      phone_number: "",
    },
    headOffice: {
      email: "",
      name: "",
      role_type: "head_of_Office",
      designation: "",
      phone_number: "",
    },
    dep_name: "",
  });

  const navigate = useNavigate();
  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  /**
   * Check all fields if not empty
   */
  const allFieldsMapped = (obj) => {
    for (const key in obj) {
      // Check if the value is an object, then recursively check its fields
      if (typeof obj[key] === "object") {
        if (!allFieldsMapped(obj[key])) {
          return false;
        }
      } else {
        // If any field is empty, return false
        if (!obj[key]) {
          return false;
        }
      }
    }
    return true; // All fields are not empty
  };

  /**
   * Collect form values
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Split the name to get the nested object structure
    const [field, nestedField] = name.split(".");

    // Update the form data based on the field
    setFormData((prevFormData) => {
      if (field === "secretary" || field === "headOffice") {
        return {
          ...prevFormData,
          [field]: {
            ...prevFormData[field],
            [nestedField]: value,
          },
        };
      } else {
        return {
          ...prevFormData,
          [field]: value,
        };
      }
    });

    if (allFieldsMapped(formData)) {
      setSubmitDisable(false);
    }
  };

  /**
   * Post call on submit
   */
  const handleAddDepartment = async () => {
    const reactAppHostname = process.env.REACT_APP_HOSTNAME;
    setSubmitDisable(true);
    const response = await fetch(
      `${reactAppHostname}/api/register-user-with-department`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    try {
      if (response.status === 200) {
        alert(`${reactAppHostname}/api/login`);
        navigate("/departments");
      } else {
        alert("Login Failed");
        // Handle error cases here
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Header props={open} onOutput={handleOutput} />
        </AppBar>
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
              textAlign: "center",
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
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            width: "100%",
            height: "108vh",
            paddingBottom: "20px",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
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
                    Add Departments
                  </div>
                  <div>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="/">
                        WARCAT
                      </Link>
                      <Link
                        underline="hover"
                        color="inherit"
                        href="/departments"
                      >
                        Departments
                      </Link>
                      <Typography color="text.primary">
                        Add Departments
                      </Typography>
                    </Breadcrumbs>
                  </div>
                </div>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Card sx={{ width: 100 + "%", padding: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 2,
                        borderBottom: "1px solid #eff2f7",
                      }}
                    >
                      <Typography variant="body1">Add Departments</Typography>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#fb4",
                          color: "#000000",
                          "&:hover": {
                            backgroundColor: "#fb4",
                          },
                        }}
                        component={Link}
                        to="/departments"
                        size="small"
                      >
                        All Departments
                      </Button>
                    </Box>
                    <CardContent>
                      <Box component="form" noValidate autoComplete="off">
                        <label>Department / Government Organisation</label>
                        <TextField
                          id="outlined-basic"
                          label="Department / Government Organisation"
                          variant="outlined"
                          fullWidth
                          name="dep_name"
                          value={formData.dep_name}
                          onChange={handleChange}
                        />

                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{ marginTop: "5%", marginBottom: "2%" }}
                        >
                          Secretary Details
                        </Typography>

                        <Grid
                          container
                          spacing={2}
                          sx={{ marginBottom: "20px" }}
                        >
                          <Grid item xs={12} sm={6}>
                            <Stack direction="column" spacing={2}>
                              <label>Secretary Name</label>
                              <TextField
                                id="outlined-basic-1"
                                label="Enter Secretary Name"
                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="secretary.name"
                                value={formData.secretary.name}
                                onChange={handleChange}
                              />
                              <label>Secretary Phone Number</label>
                              <TextField
                                id="outlined-basic-2"
                                label="Enter Secretary Phone Number"
                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="secretary.phone_number"
                                value={formData.secretary.phone_number}
                                onChange={handleChange}
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <label>Secretary Email Id</label>
                            <TextField
                              id="outlined-basic-3"
                              label="Enter Secretary Email Id"
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="secretary.email"
                              value={formData.secretary.email}
                              onChange={handleChange}
                            />
                          </Grid>
                        </Grid>

                        <Typography
                          variant="h5"
                          component="h2"
                          sx={{ marginTop: "5%", marginBottom: "2%" }}
                        >
                          Head Of Office Details
                        </Typography>

                        <Grid
                          container
                          spacing={2}
                          sx={{ marginBottom: "20px" }}
                        >
                          <Grid item xs={12} sm={6}>
                            <Stack direction="column" spacing={2}>
                              <label>Head of Office Name</label>
                              <TextField
                                id="outlined-basic-1"
                                label="Enter Head of Office Name"
                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="headOffice.name"
                                value={formData.headOffice.name}
                                onChange={handleChange}
                              />
                              <label>Head of Office Designation</label>
                              <TextField
                                id="outlined-basic-2"
                                label="Enter Head of Office Designation"
                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="headOffice.designation"
                                value={formData.headOffice.designation}
                                onChange={handleChange}
                              />
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Stack direction="column" spacing={2}>
                              <label>Head of Office Phone Number</label>
                              <TextField
                                id="outlined-basic-1"
                                label="Enter Head of Office Phone Number"
                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="headOffice.phone_number"
                                value={formData.headOffice.phone_number}
                                onChange={handleChange}
                              />
                              <label>Head of Office Email Id</label>
                              <TextField
                                id="outlined-basic-2"
                                label="Head of Office Email Id"
                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="headOffice.email"
                                value={formData.headOffice.email}
                                onChange={handleChange}
                              />
                            </Stack>
                          </Grid>
                        </Grid>

                        <Button
                          variant="contained"
                          color="success"
                          sx={{ color: "white", marginTop: "2%" }}
                          disabled={submitDisable}
                          onClick={handleAddDepartment}
                        >
                          Submit
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Paper>
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
