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
import { API } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Copyright } from "./Copyright";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleType, setRoleType] = useState("admin");
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return; // Stop further execution if email is invalid
      }

      // Password validation
      if (!password) {
        toast.error("Please enter a password.");
        return; // Stop further execution if password is missing
      }

      const response = await API.login({ email, role_type: roleType, password });

      if (response && response?.data?.statusTxt === "error") {
        // Display error message in toast
        toast.error(response?.data?.message);
        return; // Stop further execution if login failed
      }

      // Login successful
      toast.success("Login successful");
      // Store token in local storage
      const token = response?.data?.token;
      if (token) {
        localStorage.setItem('token', token);
        // Perform actions after successful login, such as redirecting to another page
        navigate('/dashboard');
      }
      // Perform actions after successful login
    } catch (error) {
      console.error("Login failed", error);
      const errorMessage = error.message || "An unknown error occurred";
      toast.error(errorMessage);
      // Handle login error
    }
  };
  const token = localStorage.getItem('token');
  React.useEffect(() => {
  }, [token]);

  const tabSelection = (newValue) => {
    setRoleType(newValue);
  };

  return (
    <ThemeProvider theme={createTheme()}>
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
          <TabContext value={roleType}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={(event, newValue) => {
                  setRoleType(newValue);
                  tabSelection(newValue)
                }}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleLogin}
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
      <ToastContainer />
    </ThemeProvider>
  );
}

export default LogIn;
