import * as React from "react";
import { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button, TextField, FormControl, MenuItem } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Sidebar from "../components/Sidebar";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const defaultTheme = createTheme();

function Label({ componentName, valueType }) {

}

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

export default function AddNewMeeting() {
    const [open, setOpen] = React.useState(true);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        departmentIds: '',
        tag: '',
        meetingTopic: '',
        selectDate: null,
        selectTime: null,
    });
    const theme = useTheme();
    const departments = useSelector(state => state.departments.data);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleDateChange = (date) => {
        setFormData((prevData) => ({
            ...prevData,
            selectDate: date,
        }));
    };

    const handleTimeChange = (time) => {
        setFormData((prevData) => ({
            ...prevData,
            selectTime: time,
        }));
    };

    const handleAddMeeting = async () => {
        try {
            const { departmentIds, tag, meetingTopic, selectDate, selectTime } = formData;

            const formDataSend = new FormData();
            formDataSend.append('departmentIds', departmentIds);
            formDataSend.append('tag', tag);
            formDataSend.append('meetingTopic', meetingTopic);
            formDataSend.append('selectDate', selectDate);
            formDataSend.append('selectTime', selectTime);
            formDataSend.append('file', file);


            const token = localStorage.getItem('token');
            const response = await axios.post('https://warcat2024-qy2v.onrender.com/api/add-meeting', formDataSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log(response.data);
        } catch (error) {
            console.error('Error occurred:', error);
        }

    };

    const handleOutput = (open) => {
        toggleDrawer();
    };
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const departmentNames = departments.map((dept) => dept.department.department_name);
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
                            <Grid item xs={12}>
                                <Card sx={{ width: 100 + "%", padding: 2 }}>
                                    <CardContent>
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="off"
                                            sx={{ marginTop: 2 }}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <FormControl fullWidth variant="outlined">
                                                        <TextField
                                                            id="department"
                                                            name="departmentIds"
                                                            label="Department / Government Organisation"
                                                            select
                                                            value={formData.departmentIds}
                                                            onChange={handleChange}
                                                        >
                                                            {departmentNames.map((deptName) => (
                                                                <MenuItem key={deptName} value={deptName}>
                                                                    {deptName}
                                                                </MenuItem>
                                                            ))}
                                                        </TextField>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControl sx={{ width: 100 + '%' }}>
                                                        <TextField
                                                            id="tag"
                                                            name="tag"
                                                            label="Tag"
                                                            variant="outlined"
                                                            fullWidth
                                                            select
                                                            value={formData.tag}
                                                            onChange={handleChange}
                                                        >
                                                            <MenuItem >
                                                                Admin
                                                            </MenuItem>
                                                            <MenuItem >
                                                                Secretary
                                                            </MenuItem>
                                                            <MenuItem >
                                                                Head Of Office
                                                            </MenuItem>
                                                        </TextField>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField
                                                        id="outlined-basic"
                                                        name="meetingTopic"
                                                        label="Enter Meeting Topic"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={formData.meetingTopic}
                                                        onChange={handleChange}
                                                    />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer
                                                            components={['DatePicker', 'TimePicker']}
                                                        >
                                                            <Grid item xs={4}>
                                                                <DemoItem label="Select Date">
                                                                    <DatePicker
                                                                        value={formData.selectDate}
                                                                        onChange={handleDateChange}
                                                                    />
                                                                </DemoItem>
                                                            </Grid>

                                                            <Grid item xs={4}>
                                                                <DemoItem label="Select Time">
                                                                    <TimePicker
                                                                        value={formData.selectTime}
                                                                        onChange={handleTimeChange}
                                                                    />
                                                                </DemoItem>
                                                            </Grid>

                                                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Button
                                                                    component="label"
                                                                    variant="contained"
                                                                    startIcon={<CloudUploadIcon />}
                                                                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                                                >
                                                                    Upload file
                                                                    <VisuallyHiddenInput
                                                                        type="file"
                                                                        onChange={(e) => setFile(e.target.files[0])}
                                                                    />
                                                                </Button>
                                                            </Grid>
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            <Button
                                                variant="contained"
                                                color="info"
                                                sx={{ color: 'white', marginTop: '2%' }}
                                                onClick={handleAddMeeting}
                                            >
                                                Add Meeting
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
