import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://teminos.com/">
        Teminos
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}



const defaultTheme = createTheme();

export default function LogIn() {
  const [loginRoleType, setLoginRoleType] = useState("admin");
  const [disabledLogin, setDisabledLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role_type: "admin",
  });

  const navigate = useNavigate();

  /**
   * @description: Check all fields if not empty
   * @input: form object { email, password }
   * @output: boolean 
   */
  const isFieldsMapped = (obj) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (obj["email"] && emailPattern.test(obj["email"]) && obj["password"]) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * @Description: Update changes and trigger complete flag
   * @Input: form object { email, password }
   * @Output: boolean 
   */  
  const handleChange = (event) => {
    const { name, value } = event.target;

    // Update the form data based on the field
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });

    // Setup flag
    if (isFieldsMapped(formData)) {
      setDisabledLogin(false);
    } else {
      setDisabledLogin(true);
    }
  };

  /**
   * @Description: set role type in application of tab
   * @Input: rolestype as String
   * @Output: String 
   */    
  const tabSelection = (event, newValue) => {
    setLoginRoleType(newValue);
  };

  /**
   * @Description: handleSubmit
   * @Input: Event
   * @Output: {Success/ fails} 
   */ 
    const handleSubmit = async (event) => {
    event.preventDefault();
    setDisabledLogin(true);
    const reactAppHostname = process.env.REACT_APP_HOSTNAME;
    const response = await fetch(`${reactAppHostname}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        role_type: loginRoleType,
        password: formData.password,
      }),
    });

    try {
      if (response.status === 200) {
        alert(`${reactAppHostname}/api/login`);
        navigate("/dashboard");
      } else {
        alert("Login Failed");
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              padding: 4,
              alignItems: "center",
            }}
          >
            <Logo />
          </Box>
          <TabContext value={loginRoleType}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={tabSelection}
                aria-label="Login application tabs"
              >
                <Tab label="Admin" value="admin" />
                <Tab label="Secretary" value="secretary" />
                <Tab label="Head of Office" value="head_of_Office" />
              </TabList>
            </Box>
            <TabPanel value="admin">
              <Typography component="h1" variant="h5">
                Admin Login
              </Typography>
            </TabPanel>
            <TabPanel value="secretary">
              <Typography component="h1" variant="h5">
                Secretary Login
              </Typography>
            </TabPanel>
            <TabPanel value="head_of_Office">
              <Typography component="h1" variant="h5">
                Head of Office
              </Typography>
            </TabPanel>
            <Box>
              <div
                style={{
                  border: "1px solid #ccc",
                  padding: "20px",
                  marginTop: "-20px",
                }}
              >
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    autoComplete="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleChange}
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    onChange={handleChange}
                    onBlur={handleChange}
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="success"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={disabledLogin}
                  >
                    LogIn
                  </Button>
                  <Grid container>
                    <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </Box>
          </TabContext>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}