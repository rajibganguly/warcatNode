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
import { useParams } from "react-router-dom";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { API } from "../api";

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

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const departmentList = useSelector(state => state.departments.data);
  const [submitDisable, setSubmitDisable] = React.useState(false);


  const [formData, setFormData] = React.useState({
    department_name: "",
    secretary: {
      name: "",
      phone_number: "",
      email: "",
    },
    headOffice: {
      name: "",
      designation: "",
      phone_number: "",
      email: "",
    },
  });

  



  React.useEffect(() => {
    const departmentData = departmentList.find((dept) => dept.id === id);
    console.log("Department Data:", departmentData.department.department_name);

    if (!departmentData) {
      throw new Error("Department not found");
    }
    setFormData({
      dep_name: departmentData.department.department_name,
      secretary: {
        name: departmentData.secretary.name,
        phone_number: departmentData.secretary.phone_number,
        role_type: "secretary",
        email: departmentData.secretary.email,
      },
      headOffice: {
        name: departmentData.headOffice.name,
        role_type: "head_of_Office",
        designation: departmentData.headOffice.designation,
        phone_number: departmentData.headOffice.phone_number,
        email: departmentData.headOffice.email,
      },
    });

  }, [id]);





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
    return true; 
  };

  /**
   * Collect form values
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
  
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevFormData) => ({
        ...prevFormData,
        [parent]: {
          ...prevFormData[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
  
  


  const full_id = id.toString();
  const extracted_id = full_id.split("-")[1];
  console.log(extracted_id);

  /**
   * Post call on submit
   */
  const handleAddDepartment = async (event) => {
    event.preventDefault();

    try {
      const updatedFormData = {
        ...formData,
        department_id: extracted_id,
      };

      const response = await API.editRegisterUserWithDepartment(updatedFormData, localStorage.getItem("token"));

      if (response.status === 200) {
        toast.success("Department updated successfully");
        navigate("/departments");
      } else {
        toast.error("Failed to update department");
      }
    } catch (error) {
      console.error("Error updating department:", error);
      toast.error("Failed to update department");
    }
  };
  console.log(formData)

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
                        <label>Department / Government Organisation</label>
                        <TextField
                          fullWidth
                          name="department_name"
                          value={formData.dep_name}
                          onChange={handleChange}
                          aria-readonly
                          disabled
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
                            <label>Secretary Name</label>
                            <TextField
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="secretary.name"
                              value={formData.secretary.name}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <label>Secretary Phone Number</label>
                            <TextField
                              variant="outlined"
                              sx={{ width: "100%" }}
                              name="secretary.phone_number"
                              value={formData.secretary.phone_number}
                              inputProps={{
                                minLength: 13,
                                maxLength: 13,
                              }}
                              onChange={handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <label>Secretary Email Id</label>
                            <TextField
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
                                inputProps={{
                                  minLength: 13,
                                  maxLength: 13,
                                }}
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
                          Update Department
                        </Button>
                      </Box>
                    ) : (
                      <span> Data is not available </span>
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