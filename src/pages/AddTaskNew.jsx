import React, { useEffect, useState } from "react";
import {
    Box,
    Grid,
    Card,
    Chip,
    styled,
    Button,
    Toolbar,
    useTheme,
    MenuItem,
    InputLabel,
    Typography,
    createTheme,
    CssBaseline,
    Breadcrumbs,
    CardContent,
    OutlinedInput,
    ThemeProvider,
    TextField,
    Select,

    FormControl,


    FormHelperText,

} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    dateSelected,
    fetchDepartmentData,
    fetchTaskData,
    getTodayDate,
    handleAddTask,
    parentTaskEdit,
} from "./common";
import MuiAppBar from "@mui/material/AppBar";
import { DepartmentContext } from './../context/DepartmentContext'
import { TaskContext } from "../context/TaskContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import LoadingIndicator from "../components/loadingIndicator";
import dayjs from 'dayjs';

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


const tags = ["Secretary", "Head Of Office"];

function extractDate(dateTimeString) {
    return dayjs(dateTimeString).format('YYYY-MM-DD');
}

const AddTaskNew = () => {
    const [taskId, setTaskId] = useState();
    const { allDepartmentList } = React.useContext(DepartmentContext);
    const allDepartmentData = allDepartmentList?.map((dept) => dept.department);
    const { setAllDepartmentList } = React.useContext(DepartmentContext);
    const { setAllTaskLists } = React.useContext(TaskContext);
    const { allTaskLists } = React.useContext(TaskContext);
    const allTaskListsData = allTaskLists?.tasks;
    const [meetingTopic, setMeetingTopic] = useState('');
    const [meetingId, setMeetingId] = useState('');
    const [tagName, setTagName] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [updateTaskTitle, setUpdateTaskTitle] = useState('');
    const [updateSelectedDate, setUpdateSelectedDate] = useState('');
    const [updateTaskFile, setupdateTaskFile] = useState(null);
    const [open, setOpen] = React.useState(true);
    const [departmentIds, setDepartmentIds] = useState([]);
    const location = useLocation();

    const [selectedDept, setSelectedDept] = useState([]);

    const handleOutput = (open) => {
        toggleDrawer();
    };
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [fields, setFields] = useState([
        {
            department: "",
            tags: [],
            title: "",
            date: "",
            image: "",
            imagePreview: "",
        },
    ]);

    const [errors, setErrors] = useState([
        { department: false, tags: false, title: false, date: false, image: false },
    ]);


    useEffect(() => {
        if (selectedDept.length > 0) {
            setFields((prevFields) =>
                prevFields.map((field, index) => ({
                    ...field,
                    department: selectedDept[index] || "",
                    tags: tagName || [],
                    title: updateTaskTitle,
                    date: updateSelectedDate,
                    image: updateTaskFile,
                    imagePreview: updateTaskFile,

                }))
            );
        }

    }, [selectedDept, tagName, updateTaskTitle, updateSelectedDate, updateTaskFile]);


    useEffect(() => {
        const fetchData = async () => {
            // setIsLoading(true)
            const fetchDepdata = await fetchDepartmentData();
            const setAllTaskListsData = await fetchTaskData();
            setAllTaskLists(setAllTaskListsData);
            console.log(fetchDepdata, 'fetchDepdata')
            setAllDepartmentList(fetchDepdata);
            // setIsLoading(false)
        };
        fetchData();
        const queryParams = new URLSearchParams(location.search);
        const encodedMeetingId = queryParams.get('meetingId');
        const encodedMeetingTopic = queryParams.get('meetingTopic');
        const encodedTaskId = queryParams.get('taskId');
        if (encodedMeetingId && encodedMeetingTopic) {

            const decodedMeetingId = window.atob(encodedMeetingId);
            const decodedMeetingTopic = window.atob(encodedMeetingTopic);

            setMeetingId(decodedMeetingId);
            setMeetingTopic(decodedMeetingTopic);
        }

        if (encodedTaskId) {
            const decodedTaskId = window.atob(encodedTaskId);
            setTaskId(decodedTaskId);
            const filteredObject = allTaskListsData?.find(task => task.task_id === decodedTaskId);
            const depIds = filteredObject?.department?.map(obj => obj.dep_id);
            if (depIds) {
                const selectedDepartments = depIds?.map(id => {
                    const department = allDepartmentData?.find(dept => dept?._id === id);
                    return department ? department : null;
                });

                const departmentNames = selectedDepartments?.filter(dep => dep !== null)?.map(dep => dep.department_name);
                setSelectedDept(departmentNames);

                const tags = [...new Set(filteredObject?.department?.flatMap(obj => obj.tag) || [])];
                setTagName(tags);



                const taskTitle = filteredObject ? filteredObject.task_title : "Task not found";
                setUpdateTaskTitle(taskTitle);

                const updateSelectedDate = extractDate(filteredObject?.target_date);
                setUpdateSelectedDate(updateSelectedDate);

                setupdateTaskFile(filteredObject?.task_image)
                setDepartmentIds(depIds);
                console.log(filteredObject?.task_image);


            }

        }

    }, []);



    useEffect(() => {
        const fetchData = async () => {
            // setIsLoading(true)
            const fetchDepdata = await fetchDepartmentData();
            const setAllTaskListsData = await fetchTaskData();
            setAllTaskLists(setAllTaskListsData);
            console.log(fetchDepdata, 'fetchDepdata')
            setAllDepartmentList(fetchDepdata);
            // setIsLoading(false)
        };
        fetchData();
        const queryParams = new URLSearchParams(location.search);
        const encodedMeetingId = queryParams.get('meetingId');
        const encodedMeetingTopic = queryParams.get('meetingTopic');
        const encodedTaskId = queryParams.get('taskId');
        if (encodedMeetingId && encodedMeetingTopic) {

            const decodedMeetingId = window.atob(encodedMeetingId);
            const decodedMeetingTopic = window.atob(encodedMeetingTopic);

            setMeetingId(decodedMeetingId);
            setMeetingTopic(decodedMeetingTopic);
        }

        if (encodedTaskId) {
            const decodedTaskId = window.atob(encodedTaskId);
            setTaskId(decodedTaskId);
            const filteredObject = allTaskListsData?.find(task => task.task_id === decodedTaskId);
            const depIds = filteredObject?.department?.map(obj => obj.dep_id);
            if (depIds) {
                const selectedDepartments = depIds?.map(id => {
                    const department = allDepartmentData?.find(dept => dept?._id === id);
                    return department ? department : null;
                });

                const departmentNames = selectedDepartments?.filter(dep => dep !== null)?.map(dep => dep.department_name);
                setSelectedDept(departmentNames);

                const tags = [...new Set(filteredObject?.department?.flatMap(obj => obj.tag) || [])];
                setTagName(tags);



                const taskTitle = filteredObject ? filteredObject.task_title : "Task not found";
                setUpdateTaskTitle(taskTitle);

                const updateSelectedDate = extractDate(filteredObject?.target_date);
                setUpdateSelectedDate(updateSelectedDate);

                setupdateTaskFile(filteredObject?.task_image)
                setDepartmentIds(depIds);
                console.log(filteredObject?.task_image);


            }

        }

    }, []);


    console.log(taskId);

    const handleChange = (index, field, value) => {
        const newFields = [...fields];
        newFields[index][field] = value;
        setFields(newFields);

        const newErrors = [...errors];
        newErrors[index][field] = false;
        setErrors(newErrors);

        if (field === "image") {
            const file = value;
            const reader = new FileReader();
            reader.onloadend = () => {
                newFields[index].imagePreview = reader.result;
                setFields([...newFields]);
            };
            if (file) {
                reader.readAsDataURL(file);
            }
        }
    };

    const handleAdd = () => {
        const firstFieldFilled = fields[0].department && fields[0].tags.length > 0;
        const otherFieldsFilled = fields.every(
            (field, index) => {
                if (index === 0) {
                    return true; // Skip validation for the first field
                }
                return field.title && field.date && field.image;
            }
        );

        if (!firstFieldFilled || !otherFieldsFilled) {
            toast.error("Please fill all required fields before adding a new one.");
            return;
        }

        setFields([
            ...fields,
            {
                department: "",
                tags: [],
                title: "",
                date: "",
                image: "",
                imagePreview: "",
            },
        ]);
        setErrors([
            ...errors,
            {
                department: false,
                tags: false,
                title: false,
                date: false,
                image: false,
            },
        ]);
    };



    const handleRemove = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        const newErrors = errors.filter((_, i) => i !== index);
        setFields(newFields);
        setErrors(newErrors);
    };




    const handleSubmit = async () => {
        const allFieldsFilled = fields.every((field, index) => {
            if (index === 0) {
                // For the first field, check all fields
                return (
                    field.department &&
                    field.tags.length > 0 &&
                    field.title &&
                    field.date &&
                    field.image
                );
            } else {
                // For subsequent fields, check only title, date, and image
                return field.title && field.date && field.image;
            }
        });

        if (!allFieldsFilled) {
            const newErrors = fields.map((field, index) => {
                if (index === 0) {
                    // For the first field, check all fields
                    return {
                        department: !field.department,
                        tags: field.tags.length === 0,
                        title: !field.title,
                        date: !field.date,
                        image: !field.image,
                    };
                } else {
                    // For subsequent fields, check only title, date, and image
                    return {
                        department: false,
                        tags: false,
                        title: !field.title,
                        date: !field.date,
                        image: !field.image,
                    };
                }
            });
            setErrors(newErrors);
            toast.error("Please fill all required fields before submitting.");
            return;
        }

        try {
            const apiUrl = taskId
                ? 'https://warcat2024-qy2v.onrender.com/api/edit-task'
                : 'https://warcat2024-qy2v.onrender.com/api/add-task';

            const postAddData = {
                ...(taskId && { task_id: taskId }),
                department: fields.map((field) => ({
                    dep_id: departmentIds,
                    dep_name: field.department,
                    tag: field.tags,
                    taskTitle: fields.title,
                })),
                target_date: fields[0].date,

                task_image: fields[0].image,
            };

            const postEditData = {
                ...(taskId && { task_id: taskId }),
                dep_name: selectedDept,
                dep_id: departmentIds,
                target_date: fields[0].date,
                task_title: fields[0].title,
                task_image: fields[0].image,

            };

            const response = await fetch(apiUrl, {
                method: taskId ? 'POST' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: taskId ? JSON.stringify(postEditData) : JSON.stringify(postAddData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Task', taskId ? 'edited' : 'added', 'successfully:', data);
            } else {
                console.error('Failed to', taskId ? 'edit' : 'add', 'task:', response.statusText);
            }
        } catch (error) {
            console.error('Error', taskId ? 'editing' : 'adding', 'task:', error);
        }
    };


    console.log(allDepartmentData);
    return (


        <ThemeProvider theme={defaultTheme}>
            {/* For Loader */}
            <LoadingIndicator isLoading={isLoading} />
            {/*  */}
            <Box display={'flex'}>
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
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 2,

                        }}
                    >
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>Tasks</Typography>

                        <div>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link underline="hover" color="inherit" href="/">
                                    WARCAT
                                </Link>
                                <Link
                                    underline="hover"
                                    color="inherit"
                                    href="/tasks"
                                >
                                    Tasks
                                </Link>
                                <Typography color="text.primary">
                                    Add Task
                                </Typography>
                            </Breadcrumbs>
                        </div>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 2,
                            width: 100 + '%',

                        }}
                    >
                        <Card sx={{ width: 100 + '%', padding: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: 2,
                                    borderBottom: '1px solid #eff2f7',

                                }}
                            >
                                <Typography variant="body1"> Tasks</Typography>


                            </Box>

                            <CardContent>
                                <Grid container spacing={2} sx={{ mb: 4, borderBottom: '1px solid #eff2f7', pb: 2 }}>
                                    {fields.map((field, index) => (
                                        <div key={index} style={{ width: '100' + '%', marginBottom: "20px", position: "relative" }}>
                                            <Grid container spacing={2} sx={{ borderBottom: '1px solid #eff2f7', pb: 2 }}>
                                                {index === 0 && (
                                                    <>
                                                        <Grid item xs={12} md={6}>
                                                            <FormControl
                                                                fullWidth
                                                                margin="normal"
                                                                error={errors[index]?.department}
                                                            >
                                                                <InputLabel>Department</InputLabel>
                                                                <Select
                                                                    value={field.department}
                                                                    onChange={(e) =>
                                                                        handleChange(index, "department", e.target.value)
                                                                    }
                                                                    label="Department"
                                                                >
                                                                    {allDepartmentData?.map((dept) => (
                                                                        <MenuItem key={dept?._id} value={dept?.department_name}>
                                                                            {dept?.department_name}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                                {errors[index]?.department && (
                                                                    <FormHelperText error>Required</FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <FormControl fullWidth margin="normal" error={errors[index]?.tags}>
                                                                <InputLabel>Tags</InputLabel>
                                                                <Select
                                                                    multiple
                                                                    value={field.tags}
                                                                    onChange={(e) => handleChange(index, "tags", e.target.value)}
                                                                    input={<OutlinedInput label="Tags" />}
                                                                    renderValue={(selected) => (
                                                                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                                                                            {selected.map((value) => (
                                                                                <Chip key={value} label={value} style={{ margin: 2 }} />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                >
                                                                    {tags.map((tag) => (
                                                                        <MenuItem key={tag} value={tag}>
                                                                            {tag}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                                {errors[index]?.tags && (
                                                                    <FormHelperText error>Required</FormHelperText>
                                                                )}
                                                            </FormControl>
                                                        </Grid>
                                                    </>
                                                )}

                                                <Grid item xs={12} md={12}>
                                                    <TextField
                                                        fullWidth
                                                        margin="normal"
                                                        label="Task Title"
                                                        value={field.title}
                                                        onChange={(e) => handleChange(index, "title", e.target.value)}
                                                        error={errors[index]?.title}
                                                        helperText={errors[index]?.title ? "Required" : ""}
                                                    />
                                                </Grid>

                                               

                                                <Grid item xs={12} md={6} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                                    <TextField
                                                        fullWidth
                                                        margin="normal"
                                                        type="file"
                                                        label="Image"
                                                        InputLabelProps={{ shrink: true }}
                                                        inputProps={{ accept: "image/*" }}
                                                        onChange={(e) => handleChange(index, "image", e.target.files[0])}
                                                        error={errors[index]?.image}
                                                        helperText={errors[index]?.image ? "Required" : ""}
                                                    />

                                                    <Box width={'40px'} height={'40px'} minWidth={'40px'} borderRadius={'6px'} backgroundColor='#ebebeb'>
                                                        {field.imagePreview && (
                                                            <img
                                                                alt=""
                                                                width={'100%'}
                                                                height={'100%'}
                                                                className="smallImageInTask"
                                                                src={field.imagePreview}
                                                            />
                                                        )}
                                                    </Box>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <TextField
                                                        fullWidth
                                                        margin="normal"
                                                        type="date"
                                                        label="Date"
                                                        InputLabelProps={{ shrink: true }}
                                                        value={field.date}
                                                        onChange={(e) => handleChange(index, "date", e.target.value)}
                                                        error={errors[index]?.date}
                                                        helperText={errors[index]?.date ? "Required" : ""}
                                                    />
                                                </Grid>
                                            </Grid>



                                            {fields.length > 1 && (
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleRemove(fields.length - 1)}
                                                    style={{ display: "block", margin: "10px auto" }}
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button variant="contained" color="primary" onClick={handleAdd}>
                                        Add
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleSubmit}
                                        style={{ marginLeft: "10px" }}
                                    >
                                        Submit
                                    </Button>
                                </Grid>

                            </CardContent>

                        </Card>
                    </Box>
                    <Box
                        component="footer"
                        pb={'20px'}
                        width={'100%'}
                    >
                        <Footer />
                    </Box>
                </Box>

            </Box>
        </ThemeProvider>




    );
};

export default AddTaskNew;
