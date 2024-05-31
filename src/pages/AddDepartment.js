import React, { useContext, useState } from "react";
import {
  Box,
  Grid,
  Card,
  Stack,
  styled,
  Button,
  Toolbar,
  TextField,
  Container,
  Typography,
  createTheme,
  CssBaseline,
  Breadcrumbs,
  CardContent,
  ThemeProvider,
} from "@mui/material";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import MuiAppBar from "@mui/material/AppBar";
import { fetchDepartmentData } from "./common";
import { useNavigate } from "react-router-dom";
import { DepartmentContext } from "../context/DepartmentContext";
import LoadingIndicator from "../components/loadingIndicator";
import { InputAdornment } from "@mui/material";

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

const defaultTheme = createTheme();

export default function AddDepartment() {
  const [open, setOpen] = React.useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);


  const [errors, setErrors] = useState({
    secretaryEmail: '',
    headOfficeEmail: ''
  });

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

  const { setAllDepartmentList } = useContext(DepartmentContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleOutput = (open) => {
    toggleDrawer();
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const fetchDepartmentDataList = async () => {
    const data = await fetchDepartmentData();
    setAllDepartmentList(data);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

const isFormValid = () => {
  const newErrors = {};
  let valid = true;

  if (!formData.dep_name) {
    newErrors.dep_name = "Department name is required";
    valid = false;
  }

  if (!formData.secretary.name) {
    newErrors.secretaryName = "Secretary name is required";
    valid = false;
  }

  if (!formData.secretary.phone_number) {
    newErrors.secretaryPhoneNumber = "Secretary phone number is required";
    valid = false;
  }

  if (!formData.secretary.email || errors.secretaryEmail) {
    newErrors.secretaryEmail = "Valid Secretary email is required";
    valid = false;
  }

  if (!formData.headOffice.name) {
    newErrors.headOfficeName = "Head of Office name is required";
    valid = false;
  }

  if (!formData.headOffice.designation) {
    newErrors.headOfficeDesignation = "Head of Office designation is required";
    valid = false;
  }

  if (!formData.headOffice.phone_number) {
    newErrors.headOfficePhoneNumber = "Head of Office phone number is required";
    valid = false;
  }

  if (!formData.headOffice.email || errors.headOfficeEmail) {
    newErrors.headOfficeEmail = "Valid Head of Office email is required";
    valid = false;
  }

  setErrors(newErrors);

  if (!valid) {
    toast.error("Please correct the highlighted fields", {
      autoClose: 2000,
    });
  }

  return valid;
};



  const handleChange = (event) => {
    const { name, value } = event.target;
    const [field, nestedField] = name.split(".");

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

    if (name === "secretary.email" || name === "headOffice.email") {
      if (!validateEmail(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name === "secretary.email" ? "secretaryEmail" : "headOfficeEmail"]: "Enter Correct Email ID",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name === "secretary.email" ? "secretaryEmail" : "headOfficeEmail"]: "",
        }));
      }
    }
  };

  const handleAddDepartment = async () => {

    setIsSubmitted(true);

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found in localStorage");
      }

      const reactAppHostname = process.env.REACT_APP_HOSTNAME;

      const updatedFormData = {
        ...formData,
        secretary: {
          ...formData.secretary,
          phone_number: `+91${formData.secretary.phone_number}`,
        },
        headOffice: {
          ...formData.headOffice,
          phone_number: `+91${formData.headOffice.phone_number}`,
        },
      };

      const response = await fetch(`${reactAppHostname}/api/register-user-with-department`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFormData),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Department Added Successfully", {
          autoClose: 2000,
        });
        await fetchDepartmentDataList();
        setIsLoading(false);
        navigate("/departments");
      } else {
        toast.error(responseData.message || "Something went wrong", {
          autoClose: 2000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <LoadingIndicator isLoading={isLoading} />
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

                      <TextField
                        id="outlined-basic"
                        label="Department / Government Organisation"
                        variant="outlined"
                        fullWidth
                        size="small"
                        name="dep_name"
                        value={formData.dep_name}
                        onChange={handleChange}
                        error={isSubmitted && !formData.dep_name}
                        // helperText={isSubmitted && !formData.dep_name ? "Department name is required" : ""}

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


                          <TextField
                            id="outlined-basic-1"
                            label="Enter Secretary Name"
                            variant="outlined"
                            sx={{ width: "100%" }}
                            name="secretary.name"
                            value={formData.secretary.name}
                            onChange={handleChange}
                            size="small"
                            error={isSubmitted && !formData.secretary.name}
                            // helperText={isSubmitted && !formData.secretary.name ? "Secretary name is required" : ""}
                          />

                        </Grid>
                        <Grid item xs={12} sm={6}>

                          <TextField
                            id="outlined-basic-2"
                            label="Enter Secretary Phone Number"
                            placeholder=""
                            variant="outlined"
                            size="small"
                            sx={{ width: "100%" }}
                            name="secretary.phone_number"
                            value={formData.secretary.phone_number}
                            inputProps={{
                              maxLength: 10,
                              onKeyPress: (event) => {
                                if (!/^\d*$/.test(event.key)) {
                                  event.preventDefault();
                                }
                              }
                            }}
                            onChange={handleChange}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                            }}
                            error={isSubmitted && !formData.secretary.phone_number}
                            // helperText={isSubmitted && !formData.secretary.phone_number ? "Secretary phone number is required" : ""}
                          />

                        </Grid>
                        <Grid item xs={12} sm={6}>

                          <TextField
                            id="outlined-basic-3"
                            label="Enter Secretary Email Id"
                            variant="outlined"
                            sx={{ width: "100%" }}
                            name="secretary.email"
                            value={formData.secretary.email}
                            onChange={handleChange}
                            size="small"
                            error={isSubmitted && !!errors.secretaryEmail}
                            // helperText={isSubmitted && errors.secretaryEmail}
                            FormHelperTextProps={{
                              sx: { paddingLeft: '0px' }
                            }}
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

                            <TextField
                              id="outlined-basic-1"
                              label="Enter Head of Office Name"
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="headOffice.name"
                              value={formData.headOffice.name}
                              onChange={handleChange}
                              size="small"
                              error={isSubmitted && !formData.headOffice.name}
                              // helperText={isSubmitted && !formData.headOffice.name ? "Head of Office name is required" : ""}
                            />

                            <TextField
                              id="outlined-basic-2"
                              label="Enter Head of Office Designation"
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="headOffice.designation"
                              value={formData.headOffice.designation}
                              onChange={handleChange}
                              size="small"
                              error={isSubmitted && !formData.headOffice.designation}
                              // helperText={isSubmitted && !formData.headOffice.designation ? "Head of Office designation is required" : ""}
                            />
                          </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Stack direction="column" spacing={2}>

                            <TextField
                              id="outlined-basic-1"
                              label="Enter Head of Office Phone Number"
                              placeholder=""
                              variant="outlined"
                              size="small"
                              sx={{ width: "100%" }}
                              name="headOffice.phone_number"
                              value={formData.headOffice.phone_number}
                              inputProps={{
                                maxLength: 10,
                                onKeyPress: (event) => {
                                  if (!/^\d*$/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }
                              }}
                              onChange={handleChange}
                              InputProps={{
                                startAdornment: <InputAdornment position="start">+91</InputAdornment>,
                              }}
                              error={isSubmitted && !formData.headOffice.phone_number}
                              // helperText={isSubmitted && !formData.headOffice.phone_number ? "Head of Office phone number is required" : ""}
                            />

                            <TextField
                              id="outlined-basic-2"
                              label="Head of Office Email Id"
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="headOffice.email"
                              value={formData.headOffice.email}
                              onChange={handleChange}
                              size="small"
                              error={isSubmitted && !!errors.headOfficeEmail}
                              // helperText={isSubmitted && errors.headOfficeEmail}
                            />
                          </Stack>
                        </Grid>
                      </Grid>

                      <Button
                        variant="contained"
                        color="success"
                        sx={{ color: "white", marginTop: "2%" }}
                        onClick={handleAddDepartment}
                      >
                        Submit
                      </Button>
                    </Box>
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
