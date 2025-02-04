/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button, TextField } from "@mui/material";
// import { useParams } from "react-router-dom";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { InputAdornment } from "@mui/material";
import { DepartmentContext } from './../context/DepartmentContext'
import { fetchDepartmentData } from "./common";
import LoadingIndicator from "../components/loadingIndicator";
import { toast } from "react-toastify";
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
const styles = {
  labelAsterisk: {
    color: "red"
  }
};



export default function EditDepartment() {
  const [open, setOpen] = React.useState(true);
  const [submitDisable, setSubmitDisable] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errors, setErrors] = React.useState({});

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
    department_id: "",
  });

  const { selectedDepartmentData } = React.useContext(DepartmentContext);
  const { setAllDepartmentList } = React.useContext(DepartmentContext);

  React.useEffect(() => {

    const updateDataforCurrentData = {
      headOffice: selectedDepartmentData.headOffice,
      secretary: selectedDepartmentData.secretary,
      department: selectedDepartmentData.department,
      department_id: selectedDepartmentData.department?._id
    }
    setFormData(updateDataforCurrentData)
    console.log('EDIT>>86>', selectedDepartmentData, formData)
  }, []);

  const navigate = useNavigate();
  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  /**
 * Fetch Department Data & set the data
 */
  const fetchDepartmentDataList = async () => {
    const data = await fetchDepartmentData();
    setAllDepartmentList(data);
  };

  const isFormValid = () => {
    const newErrors = {};
    let valid = true;

    if (!formData.department.department_name) {
      newErrors.department_name = "Department name is required";
      valid = false;
    }

    if (!formData.secretary.name) {
      newErrors.secretaryName = "Secretary name is required";
      valid = false;
    }

    if (!formData.secretary.phone_number) {
      newErrors.secretaryPhoneNumber = "Secretary phone number is required";
      valid = false;
    } else if (secretaryphone.length !== 10) {
      newErrors.secretaryPhoneNumber = "Phone number must be 10 digits";
      valid = false;
    }

    if (!formData.secretary.email) {
      newErrors.secretaryEmail = "Secretary email is required";
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
    } else if (headofficephone.length !== 10) {
      newErrors.headOfficePhoneNumber = "Phone number must be 10 digits";
      valid = false;
    }

    if (!formData.headOffice.email) {
      newErrors.headOfficeEmail = "Head of Office email is required";
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


  const stripCountryCode = (phoneNumber) => {
    if (phoneNumber?.startsWith('+91')) {
      return phoneNumber.slice(3);
    }
    return phoneNumber;
  };

  const addCountryCode = (phoneNumber) => {
    if (!phoneNumber.startsWith('+91')) {
      return `+91${phoneNumber}`;
    }
    return phoneNumber;
  };

  const headofficephone = stripCountryCode(formData?.headOffice?.phone_number)
  console.log(headofficephone);

  const secretaryphone = stripCountryCode(formData?.secretary?.phone_number)
  console.log(secretaryphone);



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
    return true;
  };


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
            [nestedField]: nestedField === "phone_number" ? value : value,
          },
        };
      } else {
        return {
          ...prevFormData,
          [name]: value,
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

    if (!isFormValid()) return;


    const reactAppHostname = process.env.REACT_APP_HOSTNAME;
    setSubmitDisable(true);
    setIsLoading(true);
    const setDataPropMap = {
      department_id: formData.department_id,
      dep_name: formData.department.department_name,
      secretary: {
        ...formData.secretary,
        phone_number: addCountryCode(formData.secretary.phone_number), 
        role_type: 'secretary'
      },
      headOffice: {
        ...formData.headOffice,
        phone_number: addCountryCode(formData.headOffice.phone_number), // Add country code
        role_type: 'head_of_office'
      }
    };

    const auth_token = localStorage.getItem('token');
    const response = await fetch(
      `${reactAppHostname}/api/edit-register-user-with-department`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: `Bearer ${auth_token}`
        },
        body: JSON.stringify(setDataPropMap),
      }
    );

    try {
      if (response.status === 200) {

        await fetchDepartmentDataList();
        toast.success("Update successfully");
        navigate("/departments");
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error occurred:", error);
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* For Loader */}
      <LoadingIndicator isLoading={isLoading} />
      {/*  */}
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
                    Departments
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
                        Edit Departments
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
                    <Typography variant="body1">Edit Departments</Typography>
                  </Box>
                  <CardContent>
                    {formData ? (
                      <Box component="form" noValidate autoComplete="off">

                        <TextField
                          label={
                            <span>
                              Department / Government Organisation
                              <span style={styles.labelAsterisk}> *</span>
                            </span>
                          }
                          fullWidth
                          name="department_name"
                          value={formData?.department?.department_name}
                          onChange={handleChange}
                          aria-readonly
                          error={!!errors.department_name}
                          helperText={errors.department_name}
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
                              label={
                                <span>
                                  Secretary Name
                                  <span style={styles.labelAsterisk}> *</span>
                                </span>
                              }
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="secretary.name"
                              value={formData?.secretary?.name}
                              onChange={handleChange}
                              error={!!errors.secretaryName}
                              helperText={errors.secretaryName}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>

                            <TextField
                              label={
                                <span>
                                  Secretary Phone Number
                                  <span style={styles.labelAsterisk}> *</span>
                                </span>
                              }
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="secretary.phone_number"
                              value={secretaryphone}

                              inputProps={{
                                maxLength: 10,
                                onKeyPress: (event) => {
                                  if (!/^\d*$/.test(event.key)) {
                                    event.preventDefault();
                                  }
                                }
                              }}

                              onChange={handleChange}
                              error={!!errors.secretaryPhoneNumber}
                              helperText={errors.secretaryPhoneNumber}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>

                            <TextField
                              label={
                                <span>
                                  Secretary Email Id
                                  <span style={styles.labelAsterisk}> *</span>
                                </span>
                              }
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="secretary.email"
                              value={formData?.secretary?.email}
                              onChange={handleChange}
                              error={!!errors.secretaryEmail}
                              helperText={errors.secretaryEmail}
                            />
                            <input
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="secretary.role_type"
                              value={formData?.secretary?.role_type}
                              //onChange={handleChange}
                              type="hidden"
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
                                label={
                                  <span>
                                    Head of Office Name
                                    <span style={styles.labelAsterisk}> *</span>
                                  </span>
                                }
                                id="outlined-basic-1"

                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="headOffice.name"
                                value={formData?.headOffice?.name}
                                onChange={handleChange}
                                error={!!errors.headOfficeName}
                                helperText={errors.headOfficeName}
                              />

                              <TextField
                                id="outlined-basic-2"
                                label={
                                  <span>
                                    Head of Office Designation
                                    <span style={styles.labelAsterisk}> *</span>
                                  </span>
                                }

                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="headOffice.designation"
                                value={formData?.headOffice?.designation}
                                onChange={handleChange}
                                error={!!errors.headOfficeDesignation}
                                helperText={errors.headOfficeDesignation}
                              />
                              <input
                                type="hidden"
                                name="headOffice.role_type"
                                value={formData?.headOffice?.role_type}
                              />

                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Stack direction="column" spacing={2}>

                              <TextField
                                id="outlined-basic-1"

                                label={
                                  <span>
                                    Enter Head of Office Phone Number
                                    <span style={styles.labelAsterisk}> *</span>
                                  </span>
                                }
                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="headOffice.phone_number"
                                value={headofficephone}

                                inputProps={{
                                  maxLength: 10,
                                  onKeyPress: (event) => {
                                    if (!/^\d*$/.test(event.key)) {
                                      event.preventDefault();
                                    }
                                  }
                                }}
                                onChange={handleChange}
                                error={!!errors.headOfficePhoneNumber}
                                helperText={errors.headOfficePhoneNumber}
                              />

                              <TextField
                                id="outlined-basic-2"
                                label={
                                  <span>
                                    Head of Office Email Id
                                    <span style={styles.labelAsterisk}> *</span>
                                  </span>
                                }

                                variant="outlined"
                                sx={{ width: "100%" }}
                                name="headOffice.email"
                                value={formData?.headOffice?.email}
                                onChange={handleChange}
                                error={!!errors.headOfficeEmail}
                                helperText={errors.headOfficeEmail}
                              />
                            </Stack>
                          </Grid>
                        </Grid>

                        <Button
                          variant="contained"
                          color="success"
                          sx={{ color: "white", marginTop: "2%" }}
                          // disabled={submitDisable}
                          onClick={handleAddDepartment}
                        >
                          Update Department
                        </Button>
                      </Box>
                    ) : (
                      <span> data is not available </span>
                    )}
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
