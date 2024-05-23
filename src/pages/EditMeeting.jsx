import * as React from "react";
import { useState, useEffect, useContext } from 'react';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "../components/listitems";
import LogoBlack from "../components/logoblack";
import ProfileSidePane from "../components/profileSidepane";
import MuiDrawer from "@mui/material/Drawer";
import { Button, TextField } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Sidebar from "../components/Sidebar";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from "react-toastify";
import ApiConfig from "../config/ApiConfig";
import { MeetingContext } from './../context/MeetingContext';
import { useParams } from "react-router-dom";
import { format } from 'date-fns';
import dayjs from 'dayjs';
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

const names = [
    'head_of_office',
    'Secretary',
];
function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
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

const defaultTheme = createTheme();
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};


export default function EditMeeting() {
    const [open, setOpen] = useState(true);
    const [data, setData] = useState([]);
    const [filteredMeeting, setFilteredMeeting] = useState([]);
    const { id } = useParams();
    const { allMeetingLists } = useContext(MeetingContext);

    const [formData, setFormData] = useState({
        departmentNames: [],
        tag: [],
        imageUrl: "",
        meetingTopic: "",
        selectDate: dayjs(), // Default to current date using dayjs
        selectTime: dayjs(),

    });

    useEffect(() => {
        if (Array.isArray(allMeetingLists?.meetings)) {
            const filteredMeetings = allMeetingLists?.meetings.filter(meeting => meeting.meetingId === id);
            setFilteredMeeting(filteredMeetings);
            console.log(filteredMeetings)
        } else {
            console.error("Error getting Data");
        }
    }, [allMeetingLists, id]);

    useEffect(() => {
        if (filteredMeeting.length > 0) {
            const meetingData = filteredMeeting[0];
            setFormData({
                departmentNames: meetingData.departmentNames,
                imageUrl: meetingData.imageUrl,
                meetingTopic: meetingData.meetingTopic,
                selectDate: dayjs(meetingData.selectDate),
                selectTime: dayjs(meetingData.selectTime, 'hh:mm'), // Time only, parse with dummy date
                tag: meetingData.tag
            });
        }
    }, [filteredMeeting]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFormData(prevState => ({
                ...prevState,
                imageUrl: base64
            }));
        }
    };


    const handleDateChange = (newDate) => {
        setFormData(prevState => ({
            ...prevState,
            selectDate: newDate
        }));
    };

    const handleTimeChange = (newTime) => {
        setFormData(prevState => ({
            ...prevState,
            selectTime: newTime
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {
                ...formData,
                selectDate: formData.selectDate.toISOString(),
                selectTime: formData.selectTime.format('hh:mm')
            };
            console.log(updatedData)

            const response = await fetch(`https://warcat2024-qy2v.onrender.com/api/edit-meeting?meetingId=${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            if (response.ok) {
                toast.success('Meeting updated successfully');
            } else {
                console.error('Failed to update meeting');
            }
        } catch (error) {
            console.error('Error updating meeting:', error);
        }
    };

    useEffect(() => {
        fetchDepartmentData();
    }, []);

    const fetchDepartmentData = async () => {
        if (!toast.isActive("loading")) {
            toast.loading("Loading Meetings data...", { autoClose: false, toastId: "loading" });
        }
        const localData = localStorage.getItem("user");
        const userObj = JSON.parse(localData);
        try {
            const params = {
                userId: userObj._id,
                role_type: userObj.role_type
            };
            const departmentsAll = await ApiConfig.requestData('get', '/departments', params, null);
            setData(departmentsAll);
            toast.dismiss("loading");
        } catch (error) {
            console.error("Error fetching department data:", error);
            toast.dismiss("loading");
            toast.error("Failed to fetch department data");
        }
    };

    const handleOutput = (open) => {
        toggleDrawer();
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const departmentNames = data.map((dept) => dept.department.department_name);

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
                                        Meetings
                                    </div>
                                    <div>
                                        <Breadcrumbs aria-label="breadcrumb">
                                            <Link underline="hover" color="inherit" href="/">
                                                WARCAT
                                            </Link>
                                            <Link underline="hover" color="inherit">
                                                Meetings
                                            </Link>
                                            <Typography color="text.primary">
                                                Edit Meeting
                                            </Typography>
                                        </Breadcrumbs>
                                    </div>
                                </div>
                                <Card sx={{ width: '100%', padding: 2 }}>
                                    <CardContent>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: 2,
                                                borderBottom: '1px solid #eff2f7',
                                            }}
                                        >
                                            <Typography variant="body1">Edit Meetings</Typography>
                                            <Button variant="contained" sx={{
                                                backgroundColor: '#fb4',
                                                color: '#000000',
                                                '&:hover': {
                                                    backgroundColor: '#fb4',
                                                },
                                            }} component={Link} to="/meetings">
                                                All Meetings
                                            </Button>
                                        </Box>
                                        <Box
                                            component="form"
                                            noValidate
                                            autoComplete="off"
                                            sx={{ marginTop: 2 }}
                                            onSubmit={handleSubmit}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <FormControl sx={{ width: '100%' }}>
                                                        <InputLabel id="demo-multiple-chip-label1">Department / Government Organisation</InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-chip-label1"
                                                            id="demo-multiple-chip"
                                                            fullWidth
                                                            multiple
                                                            value={formData.departmentNames}
                                                            onChange={handleChange}
                                                            input={<OutlinedInput id="select-multiple-chip1" label="Chip" name="departmentNames" />}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {departmentNames.map((deptName) => (
                                                                <MenuItem key={deptName} value={deptName}>
                                                                    {deptName}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>

                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControl sx={{ width: '100%' }}>
                                                        <InputLabel id="demo-multiple-chip-label2">Tag</InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-chip-label2"
                                                            id="demo-multiple-chip"
                                                            fullWidth
                                                            multiple
                                                            value={formData.tag}
                                                            onChange={handleChange}
                                                            input={<OutlinedInput id="select-multiple-chip" label="Chip" name="tag" />}
                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip key={value} label={value} />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                            MenuProps={MenuProps}
                                                        >
                                                            {names.map((name) => (
                                                                <MenuItem
                                                                    key={name} value={name}>
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField id="outlined-basic" label="Meeting Topic"
                                                        name='meetingTopic'
                                                        value={formData.meetingTopic}
                                                        onChange={handleChange}
                                                        variant="outlined" fullWidth disabled/>
                                                        
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer
                                                            components={['DatePicker', 'TimePicker']}
                                                        >
                                                            <Grid xs={4}>
                                                               
                                                                    <DatePicker
                                                                        value={formData.selectDate}
                                                                        onChange={handleDateChange}
                                                                        renderInput={(params) => <TextField {...params} />} />
                                                               
                                                            </Grid>
                                                            <Grid xs={4}>
                                                                
                                                                    <TimePicker
                                                                        value={formData.selectTime}
                                                                        onChange={handleTimeChange}
                                                                        renderInput={(params) => <TextField {...params} />} />
                                                               
                                                            </Grid>
                                                            <Grid xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                <Button
                                                                    component="label"
                                                                    role={undefined}
                                                                    variant="contained"
                                                                    tabIndex={-1}
                                                                    startIcon={<CloudUploadIcon />}
                                                                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                                                >
                                                                    Upload file
                                                                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                                                                </Button>

                                                            </Grid>
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            <Button type="submit" variant="contained" color="success" sx={{ color: 'white', marginTop: '2%' }}>Update</Button>
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
