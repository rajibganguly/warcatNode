import * as React from "react";
import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { Box, styled } from '@mui/system';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Input as BaseInput } from '@mui/base/Input';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "./../components/loadingIndicator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const InputElement = styled('input')(
    ({ theme }) => `
    width: 40px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 0px;
    border-radius: 8px;
    text-align: center;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 4px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.5)' : 'rgba(0,0,0, 0.05)'
        };
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);

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

export default function Forgetpassword({ separator, length, value = new Array(length).fill(''), onChange }) {
    const [disabledLogin, setDisabledLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const [showOtpField, setShowOtpField] = useState(false);
    const navigate = useNavigate();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const inputRefs = useRef(new Array(length).fill(null));

    const focusInput = (targetIndex) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.focus();
    };

    const selectInput = (targetIndex) => {
        const targetInput = inputRefs.current[targetIndex];
        targetInput.select();
    };

    const handleKeyDown = (event, currentIndex) => {
        switch (event.key) {
            case 'ArrowUp':
            case 'ArrowDown':
            case ' ':
                event.preventDefault();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                break;
            case 'ArrowRight':
                event.preventDefault();
                if (currentIndex < length - 1) {
                    focusInput(currentIndex + 1);
                    selectInput(currentIndex + 1);
                }
                break;
            case 'Delete':
                event.preventDefault();
                onChange((prevOtp) => {
                    const otp =
                        prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                });
                break;
            case 'Backspace':
                event.preventDefault();
                if (currentIndex > 0) {
                    focusInput(currentIndex - 1);
                    selectInput(currentIndex - 1);
                }
                onChange((prevOtp) => {
                    const otp =
                        prevOtp.slice(0, currentIndex) + prevOtp.slice(currentIndex + 1);
                    return otp;
                });
                break;
            default:
                break;
        }
    };

    const handleOtpInputChange = (event, currentIndex) => {
        const currentValue = event.target.value;
        let indexToEnter = 0;

        while (indexToEnter <= currentIndex) {
            if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
                indexToEnter += 1;
            } else {
                break;
            }
        }

        onChange((prev) => {
            const otpArray = (prev || new Array(length).fill('')).split('');
            const lastValue = currentValue[currentValue.length - 1];
            otpArray[indexToEnter] = lastValue;
            return otpArray.join('');
        });

        if (currentValue !== '') {
            if (currentIndex < length - 1) {
                focusInput(currentIndex + 1);
            }
        }
    };

    const handleClick = (event, currentIndex) => {
        selectInput(currentIndex);
    };

    const handlePaste = (event, currentIndex) => {
        event.preventDefault();
        const clipboardData = event.clipboardData;

        if (clipboardData.types.includes('text/plain')) {
            let pastedText = clipboardData.getData('text/plain');
            pastedText = pastedText.substring(0, length).trim();
            let indexToEnter = 0;

            while (indexToEnter <= currentIndex) {
                if (inputRefs.current[indexToEnter].value && indexToEnter < currentIndex) {
                    indexToEnter += 1;
                } else {
                    break;
                }
            }

            const otpArray = (value || new Array(length).fill('')).split('');

            for (let i = indexToEnter; i < length; i += 1) {
                const lastValue = pastedText[i - indexToEnter] ?? ' ';
                otpArray[i] = lastValue;
            }

            onChange(otpArray.join(''));
        }
    };

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

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
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
            body: JSON.stringify({ email: formData.email, otp, password: formData.password }),
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
                        />
                        {showOtpField && (
                            <>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                    {new Array(length).fill(null).map((_, index) => (
                                        <React.Fragment key={index}>
                                            <BaseInput
                                                slots={{
                                                    input: InputElement,
                                                }}
                                                aria-label={`Digit ${index + 1} of OTP`}
                                                slotProps={{
                                                    input: {
                                                        ref: (ele) => {
                                                            inputRefs.current[index] = ele;
                                                        },
                                                        onKeyDown: (event) => handleKeyDown(event, index),
                                                        onChange: (event) => handleOtpInputChange(event, index),
                                                        onClick: (event) => handleClick(event, index),
                                                        onPaste: (event) => handlePaste(event, index),
                                                        value: value[index] ?? '',
                                                    },
                                                }}
                                            />
                                            {index === length - 1 ? null : separator}
                                        </React.Fragment>
                                    ))}
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
