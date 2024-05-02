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

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function LogIn() {
  const [loginRoleType, setLoginRoleType] = useState("1");

  const navigate = useNavigate();
  const handleChange = (event, newValue) => {
    setLoginRoleType(newValue);
  };

  const handleSubmit = async (event) => {
    const reactAppHostname = process.env.REACT_APP_HOSTNAME;
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch(`${reactAppHostname}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.get("email"),
          role_type : loginRoleType,
          password: data.get("password")
        }),
      });

      try{
        if (response.status === 200) {
          alert(`${reactAppHostname}/api/login`);
          navigate("/dashboard");
          
        } else {
          alert("Login Failed");
          // Handle error cases here
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }   
    
  }
    

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
                onChange={handleChange}
                aria-label="lab API tabs"
              >
                <Tab label="Admin" value="1" />
                <Tab label="Secretary" value="2" />
                <Tab label="Head of Office" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Typography component="h1" variant="h5">
                Admin Login
              </Typography>
            </TabPanel>
            <TabPanel value="2">
              <Typography component="h1" variant="h5">
                Secretary Login
              </Typography>
            </TabPanel>
            <TabPanel value="3">
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
                    name="email"
                    autoComplete="email"
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
