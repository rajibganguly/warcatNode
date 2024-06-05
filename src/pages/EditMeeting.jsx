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
import { Link, useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import ApiConfig from "../config/ApiConfig";
import { MeetingContext } from './../context/MeetingContext';
import { useLocation } from "react-router-dom";
import dayjs from 'dayjs';
import LoadingIndicator from "../components/loadingIndicator";
import { fetchTaskData } from "./common";



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


const tagMapping = {
    'Head Office': 'head_of_office',
    'Secretary': 'secretary'
};

const reverseTagMapping = {
    'head_of_office': 'Head Office',
    'secretary': 'Secretary'
};


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
    const location = useLocation();
    const [data, setData] = useState([]);
    const [filteredMeeting, setFilteredMeeting] = useState([]);
    const [fileName, setFileName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [editMeetingId, seteditMeetingId] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState({
        departmentIds: false,
        tag: false,
        meetingTopic: false,
        selectDate: false,
        selectTime: false,
        imageUrl: false,
    });

    const validateForm = () => {
        let isValid = true;
        let newError = {
            departmentIds: false,
            tag: false,
            meetingTopic: false,
            selectDate: false,
            selectTime: false,
            imageUrl: false,
        };

        if (formData.departmentIds.length === 0) {
            newError.departmentIds = true;
            isValid = false;
        }

        if (formData.tag.length === 0) {
            newError.tag = true;
            isValid = false;
        }

        if (!formData.meetingTopic) {
            newError.meetingTopic = true;
            isValid = false;
        }

        if (!formData.selectDate) {
            newError.selectDate = true;
            isValid = false;
        }

        if (!formData.selectTime) {
            newError.selectTime = true;
            isValid = false;
        }

        if (!formData.imageUrl) {
            newError.imageUrl = true;
            isValid = false;
        }

        setError(newError);

        return isValid;
    };

    const { allMeetingLists } = useContext(MeetingContext);

    const [formData, setFormData] = useState({
        departmentIds: [],
        tag: [],
        imageUrl: "",
        meetingTopic: "",
        selectDate: dayjs(),
        selectTime: dayjs(),

    });

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const encodededMeetingId = queryParams.get('meetingId');

        if (encodededMeetingId) {
            const decodededMeetingId = window.atob(encodededMeetingId);
            seteditMeetingId(decodededMeetingId);

        }
        console.log(allMeetingLists)
        if (Array.isArray(allMeetingLists?.meetings)) {
            const filteredMeetings = allMeetingLists?.meetings.filter(meeting => meeting.meetingId === editMeetingId);
            setFilteredMeeting(filteredMeetings);
            console.log(filteredMeetings)
        } else {
            console.error("Error getting Data");
        }
    }, [allMeetingLists, editMeetingId]);


    useEffect(() => {
        if (filteredMeeting.length > 0) {
            const meetingData = filteredMeeting[0];
            setFormData({
                departmentIds: meetingData.departmentNames.map(deptName => {
                    const dept = data.find(d => d.department.department_name === deptName);
                    return dept ? dept.department._id : null;
                }).filter(id => id !== null),
                imageUrl: meetingData.imageUrl,
                meetingTopic: meetingData.meetingTopic,
                selectDate: dayjs(meetingData.selectDate),
                selectTime: dayjs(meetingData.selectTime, 'hh:mm'),
                tag: meetingData.tag
            });
            console.log(meetingData.tag);
        }


    }, [filteredMeeting, data]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "departmentIds") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value.map(deptName => {
                    const dept = data.find(d => d.department.department_name === deptName);
                    return dept ? dept.department._id : null;
                }).filter(id => id !== null)
            }));
            if (value.length > 0) {
                setError(prev => ({ ...prev, departmentIds: false }));
            }
        } else if (name === "tag") {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
            if (value.length > 0) {
                setError(prev => ({ ...prev, tag: false }));
            }
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
            if (value) {
                setError(prev => ({ ...prev, [name]: false }));
            }
        }
    };


    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFormData(prevState => ({
                ...prevState,
                imageUrl: base64
            }));
            setFileName(file.name);
        }
    };



    const handleDateChange = (newDate) => {
        setFormData(prevState => ({
            ...prevState,
            selectDate: newDate
        }));
    };

    const handleTimeChange = (event) => {
        setFormData(prevState => ({
            ...prevState,
            selectTime: event.target.value
        }));
    };

    const handleSubmit = async (e) => {
        const formattedTime = formData.selectTime.format('HH:mm');
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please check the fields with red outlines.");
            return;
        }

        try {
            setIsLoading(true);
            const updatedData = {
                ...formData,
                selectDate: formData.selectDate.toISOString(),

                selectTime: formattedTime,
                departmentNames: departmentNames,
            };

            const response = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/edit-meeting?meetingId=${editMeetingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });
            navigate('/meetings')
            await fetchTaskData();
            if (response.ok) {
                toast.success('Meeting updated successfully');
                setIsLoading(false);
            } else {
                console.error('Failed to update meeting');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error updating meeting:', error);
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchDepartmentData();
    }, []);

    const fetchDepartmentData = async () => {
        // if (!toast.isActive("loading")) {
        //     toast.loading("Loading Meetings data...", { autoClose: false, toastId: "loading" });
        // }
        setIsLoading(true);
        const localData = localStorage.getItem("user");
        const userObj = JSON.parse(localData);
        try {
            const params = {
                userId: userObj._id,
                role_type: userObj.role_type
            };
            const departmentsAll = await ApiConfig.requestData('get', '/departments', params, null);
            setData(departmentsAll);
            // toast.dismiss("loading");
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching department data:", error);
            setIsLoading(false);
            // toast.dismiss("loading");
            //toast.error("Failed to fetch department data");
        }
    };

    const handleRemoveTag = (tag) => {
        const updatedTags = formData.tag.filter((t) => t !== tag);
        setFormData(prevState => ({
            ...prevState,
            tag: updatedTags
        }));
    };

    const handleRemoveDepartment = (departmentId) => {
        const updatedDepartments = formData.departmentIds.filter((id) => id !== departmentId);
        setFormData(prevState => ({
            ...prevState,
            departmentIds: updatedDepartments
        }));
    };



    const handleOutput = (open) => {
        toggleDrawer();
    };

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const departmentNames = data.map((dept) => dept.department.department_name);

    const formatTimeString = (isoString) => {
        if (typeof (isoString) === 'string') {
            return `${isoString}`;
        } else {
            const date = new Date(isoString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    }

    // const getDepartmentIds = (departmentNames) => {

    //     const departmentMap = new Map(data.map(dep => [dep.name, dep.id]));

    //     return departmentNames.map(name => departmentMap.get(name)).filter(id => id !== undefined);
    // };

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
                                                            label="Department / Government Organisation"
                                                            id="demo-multiple-chip"
                                                            fullWidth
                                                            multiple
                                                            value={formData.departmentIds.map(id => {
                                                                const dept = data.find(d => d.department._id === id);
                                                                return dept ? dept.department.department_name : '';
                                                            })}
                                                            onChange={(e) => handleChange({
                                                                target: {
                                                                    name: 'departmentIds',
                                                                    value: e.target.value
                                                                }
                                                            })}

                                                            renderValue={(selected) => (
                                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                    {selected.map((value) => (
                                                                        <Chip
                                                                            key={value}
                                                                            label={value}
                                                                            onDelete={() => handleRemoveDepartment(data.find(d => d.department.department_name === value).department._id)} // Attach onDelete event
                                                                            onMouseDown={(event) => event.stopPropagation()}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                            MenuProps={MenuProps}
                                                            error={error.departmentIds}
                                                            sx={{ borderColor: error.departmentIds ? 'red' : '' }}
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
                                                                        <Chip
                                                                            key={value}
                                                                            label={reverseTagMapping[value]}
                                                                            onDelete={() => handleRemoveTag(value)} // Attach onDelete event
                                                                            onMouseDown={(event) => event.stopPropagation()}
                                                                        />
                                                                    ))}
                                                                </Box>
                                                            )}
                                                            MenuProps={MenuProps}
                                                            error={error.tag}
                                                            sx={{ borderColor: error.tag ? 'red' : '' }}
                                                        >
                                                            {Object.keys(tagMapping).map((key) => (
                                                                <MenuItem key={tagMapping[key]} value={tagMapping[key]}>
                                                                    {key}
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
                                                        variant="outlined" fullWidth
                                                        error={error.meetingTopic}
                                                        sx={{ borderColor: error.meetingTopic ? 'red' : '' }} />

                                                </Grid>
                                                <Grid item xs={12}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}
                                                            components={['DatePicker', 'TimePicker']}
                                                        >
                                                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>

                                                                <DatePicker
                                                                    value={formData.selectDate}
                                                                    onChange={handleDateChange}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                    disablePast
                                                                    fullWidth

                                                                    error={error.selectDate}
                                                                    sx={{ width: 100 + '%', borderColor: error.selectDate ? 'red' : '' }} />

                                                            </Grid>
                                                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                <TextField
                                                                    type="time"
                                                                    name="time"
                                                                    fullWidth
                                                                    value={formatTimeString(formData.selectTime)}
                                                                    size="small"
                                                                    onChange={handleTimeChange}
                                                                    renderInput={(params) => <TextField {...params} />}
                                                                    inputProps={{
                                                                        step: 300,
                                                                    }}
                                                                    error={error.selectTime}
                                                                    sx={{ borderColor: error.selectTime ? 'red' : '' }}

                                                                />

                                                            </Grid>
                                                            <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>

                                                                <TextField
                                                                    variant="outlined"
                                                                    fullWidth
                                                                    placeholder="Enter task title"
                                                                    name="uploadImage"
                                                                    size="small"
                                                                    type="file"
                                                                    onChange={handleFileChange}
                                                                    error={error.imageUrl}
                                                                    sx={{ padding: '17px', borderColor: error.imageUrl ? 'red' : '' }}
                                                                />
                                                                <Typography variant="caption" sx={{ marginTop: '0.5rem' }}>
                                                                    Accepted formats: JPEG, PNG, GIF
                                                                </Typography>




                                                            </Grid>
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Button type="submit" variant="contained" color="success" sx={{ color: 'white', marginTop: '2%' }}>Update</Button>
                                                <Box width={'40px'} height={'40px'} minWidth={'40px'} borderRadius={'6px'} backgroundColor='#ebebeb'>
                                                    {formData.imageUrl && (
                                                        <img
                                                            alt=""
                                                            width={'100%'}
                                                            height={'100%'}
                                                            className="smallImageInTask"
                                                            src={formData.imageUrl}
                                                        />
                                                    )}
                                                </Box>
                                            </div>

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
