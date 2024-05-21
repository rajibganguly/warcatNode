import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button, Chip, InputLabel, TextField } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Sidebar from "../components/Sidebar";

import { DepartmentContext } from '../context/DepartmentContext';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';

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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

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
    const [personName, setPersonName] = React.useState([]);
    const theme = useTheme();
    const { allDepartmentList } = React.useContext(DepartmentContext);
    const allDepartmentData = allDepartmentList.map((dept) => dept.department);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        // Find the department objects with the matching _ids
        const selectedDepts = allDepartmentData.filter((dept) => value.includes(dept._id));

        // Create a new array to hold the updated personName state
        let updatedPersonName = [...personName];

        // Add or remove department names based on the selected value
        selectedDepts.forEach((dept) => {
            const index = updatedPersonName.indexOf(dept.department_name);
            if (index === -1) {
                // If the department name is not already in the array, add it
                updatedPersonName.push(dept.department_name);
            } else {
                // If the department name is already in the array, remove it
                updatedPersonName.splice(index, 1);
            }
        });

        // Update the personName state with the new array
        setPersonName(updatedPersonName);
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
                                            <Grid container spacing={2} sx={{ mb: 4, borderBottom: '1px solid #eff2f7', pb: 2 }}>
                                                <Grid item xs={12} md={6}>
                                                    <InputLabel id="demo-multiple-chip-label1">Department / Government Organisation</InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-chip-label2"
                                                        id="demo-multiple-chip"
                                                        fullWidth
                                                        value={personName}
                                                        onChange={handleChange}
                                                        size="small"
                                                        multiple
                                                        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                                        renderValue={(selected) => (
                                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                {selected.map((value) => (
                                                                    <Chip key={value} label={value} />
                                                                ))}
                                                            </Box>
                                                        )}

                                                        MenuProps={MenuProps}
                                                    >
                                                        {allDepartmentData.map((value) => (
                                                            <MenuItem
                                                                key={value?._id}
                                                                value={value?._id}
                                                                style={getStyles(value?.department_name, personName, theme)}
                                                            >
                                                                {value?.department_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <label>Tag</label>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Tag"
                                                        variant="outlined"
                                                        fullWidth
                                                        name="dep_name"
                                                        size="small"
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <label>Meeting Id</label>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Meeting Id"
                                                        variant="outlined"
                                                        fullWidth
                                                        name="dep_name"
                                                        size="small"
                                                        aria-readonly
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <label>Meeting Topic</label>
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Meeting Topic"
                                                        variant="outlined"
                                                        fullWidth
                                                        name="dep_name"
                                                        size="small"
                                                        aria-readonly
                                                    />
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
