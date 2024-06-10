import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Box } from '@mui/system';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "./../components/loadingIndicator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

export default function Forgetpassword() {
    const [disabledLogin, setDisabledLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", otp: "", password: "", confirmPassword: "" });
    const [showOtpField, setShowOtpField] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const validateFields = () => {
        let tempErrors = {};
        if (!formData.email) tempErrors.email = "Email is required";
        if (showOtpField) {
            if (!formData.otp) tempErrors.otp = "OTP is required";
            if (!formData.password) tempErrors.password = "Password is required";
            if (!formData.confirmPassword) tempErrors.confirmPassword = "Confirm Password is required";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };



    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
        if (name === "email" && emailPattern.test(value)) {
            setDisabledLogin(false);
        } else {
            setDisabledLogin(true);
        }
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateFields()) {
            toast.error('Please check the highlighted fields', { autoClose: 2000 });
            return;
        }
        setIsLoading(true);
        setDisabledLogin(true);

        const reactAppHostname = process.env.REACT_APP_HOSTNAME;
        const response = await fetch(`${reactAppHostname}/api/request-reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: formData.email }),
        });
        setIsLoading(false);
        if (response.status === 200) {
            toast.success('OTP sent to your email', { autoClose: 2000 });
            setShowOtpField(true);
        } else {
            toast.error('Failed to send OTP', { autoClose: 2000 });
            setDisabledLogin(false);
        }
    };

    const handleOtpSubmit = async (event) => {
        event.preventDefault();
        if (!validateFields()) {
            toast.error('Please check the highlighted fields', { autoClose: 2000 });
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match', { autoClose: 2000 });
            return;
        }
        setIsLoading(true);
        const reactAppHostname = process.env.REACT_APP_HOSTNAME;
        const response = await fetch(`${reactAppHostname}/api/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: formData.email, otp: formData.otp, password: formData.password }),
        });
        setIsLoading(false);
        if (response.status === 200) {
            toast.success('OTP verified and password reset successfully', { autoClose: 2000 });
            navigate("/dashboard");
        } else {
            toast.error('OTP verification failed', { autoClose: 2000 });
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
                    <Box
                        component="form"
                        onSubmit={showOtpField ? handleOtpSubmit : handleSubmit}
                        noValidate
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Enter Registered Email Address"
                            autoComplete="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleChange}
                            autoFocus
                            size="small"
                            disabled={showOtpField}
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        {showOtpField && (
                            <>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="otp"
                                        label="Enter OTP"
                                        type="text"
                                        id="otp"
                                        onChange={handleChange}
                                        onBlur={handleChange}
                                        size="small"
                                        inputProps={{
                                            maxLength: 6,
                                            minLength: 6,
                                            onKeyPress: (event) => {
                                                if (!/^\d*$/.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }
                                        }}
                                        error={!!errors.otp}
                                        helperText={errors.otp}

                                    />
                                </Box>

                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="New Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    onBlur={handleChange}
                                    size="small"
                                    error={!!errors.password}
                                    helperText={errors.password}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="confirmPassword"
                                    label="Confirm New Password"
                                    type="password"
                                    id="confirmPassword"
                                    autoComplete="new-password"
                                    onChange={handleChange}
                                    onBlur={handleChange}
                                    size="small"
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                />
                            </>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="success"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={disabledLogin && !showOtpField}
                        >
                            {showOtpField ? "Verify OTP" : "Verify Email"}
                        </Button>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
                <LoadingIndicator isLoading={isLoading} />
            </Container>
        </ThemeProvider>
    );
}
