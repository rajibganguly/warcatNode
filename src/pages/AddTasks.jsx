/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    Chip,
    Select,
    styled,
    Button,
    Toolbar,
    useTheme,
    MenuItem,
    TextField,
    InputLabel,
    Typography,
    createTheme,
    CssBaseline,
    Breadcrumbs,
    CardContent,
    OutlinedInput,
    ThemeProvider,
} from "@mui/material";
import {
    dateSelected,
    fetchDepartmentData,
    fetchTaskData,
    getTodayDate,
    handleAddTask,
    parentTaskEdit,
} from "./common";
import {
    useForm,
    Controller,
} from 'react-hook-form';
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import MuiAppBar from "@mui/material/AppBar";
import { TaskContext } from "../context/TaskContext";
import { PlusCircleOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DepartmentContext } from './../context/DepartmentContext'
import LoadingIndicator from "../components/loadingIndicator";

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

const tagMapping = {
    'Head Office': 'head_of_office',
    'Secretary': 'secretary'
};

const reverseTagMapping = {
    'head_of_office': 'Head Office',
    'secretary': 'Secretary'
};

export default function AddTasks() {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = React.useState(true);
    const [personName, setPersonName] = React.useState([]);
    const [deptId, setDeptId] = useState('');
    const [meetingId, setMeetingId] = useState('');
    const [taskId, setTaskId] = useState();
    const [updateTaskTitle, setUpdateTaskTitle] = useState('');
    const [meetingTopic, setMeetingTopic] = useState('');
    const { control } = useForm({});
    const [base64Image, setBase64Image] = React.useState("");
    const [updateTaskFile, setupdateTaskFile] = useState(null);
    const [updateSelectedDate, setUpdateSelectedDate] = useState('');
    const { allDepartmentList } = React.useContext(DepartmentContext);
    const allDepartmentData = allDepartmentList?.map((dept) => dept.department);
    const { allTaskLists } = React.useContext(TaskContext);
    const allTaskListsData = allTaskLists?.tasks;
    const [tagName, setTagName] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDeparmentobj, setSelectedDeparmentObj] = useState([])
    const { setAllDepartmentList } = React.useContext(DepartmentContext);
    const { setAllTaskLists } = React.useContext(TaskContext);
    const [formattedTagNames, setFormattedTagNames] = useState([]);
    const [dataforval, setdataforval] = useState([]);

    const { formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [error, setError] = useState({
        personName: false,
        taskTitle: false,
        tagName: false,
        targetDate: false,
        taskImage: false,
    });



    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            const fetchDepdata = await fetchDepartmentData();
            const setAllTaskListsData = await fetchTaskData();
            setAllTaskLists(setAllTaskListsData);
            console.log(fetchDepdata, 'fetchDepdata')
            setAllDepartmentList(fetchDepdata);
            setIsLoading(false)
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
                setSelectedDeparmentObj(selectedDepartments[0])
                const departmentNames = selectedDepartments?.filter(dep => dep !== null)?.map(dep => dep.department_name);
                setPersonName(departmentNames);
                const departmentId = selectedDepartments?.filter(dep => dep !== null)?.map(dep => dep._id);
                setDeptId(departmentId);

                const tags = [...new Set(filteredObject?.department?.flatMap(obj => obj.tag) || [])];
                console.log(filteredObject?.target_date)

                setTagName(tags);
                setUpdateTaskTitle(filteredObject?.task_title);
                setUpdateSelectedDate(dateSelected(filteredObject?.target_date))
                setupdateTaskFile(filteredObject?.task_image)

            }

        }

    }, []);

    const handleUpdateFileChange = (event) => {
        let file = event.target.files[0];

        const reader = new FileReader();
        reader.onloadend = async function () {
            file = reader.result.split(',')[1];
            setupdateTaskFile(`data:image/jpeg;base64,` + file);
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value, 'valuevaluevalue')
        // Find the department object with the matching _id
        const selectedDept = allDepartmentData.find(dept => dept._id === value);
        console.log(selectedDept, 'selectedDeptselectedDept')
        setSelectedDeparmentObj(selectedDept);

        // If a matching department is found, add its name to the personName array
        if (selectedDept) {
            setDeptId(prevPersonName => [selectedDept._id]);
            setPersonName(prevPersonName => [selectedDept.department_name]);
        }

        setError(prev => ({
            ...prev,
            personName: value.length === 0
        }));
    };

    let departmentData = selectedDeparmentobj ? [
        {
            dep_id: selectedDeparmentobj._id,
            dep_name: selectedDeparmentobj.department_name,
            tag: tagName
        }
    ] : [];

    const handleTagChange = (event) => {
        const selectedFormattedTags = event.target.value;
        const selectedTags = selectedFormattedTags.map(tag => tagMapping[tag]);
        setTagName(selectedTags);
        setFormattedTagNames(selectedFormattedTags);
        setError(prev => ({
            ...prev,
            tagName: selectedFormattedTags.length === 0
        }));
    };

    const handleOutput = (open) => {
        toggleDrawer();
    };
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const [inputGroups, setInputGroups] = useState([
        [
            { id: 1, type: "text", value: "" },
            { id: 2, type: "file", value: null },
            { id: 3, type: "date", value: null },
        ],
    ]);

    function handleInputChange(groupId, id, e) {
        const newInputGroups = [...inputGroups];
        const groupIndex = newInputGroups.findIndex(
            (group) => group[0].id === groupId
        );
        if (groupIndex !== -1) {
            const inputIndex = newInputGroups[groupIndex].findIndex(
                (input) => input.id === id
            );

            if (inputIndex !== -1) {
                newInputGroups[groupIndex][inputIndex].value = e.target.value;
                setInputGroups(newInputGroups);
            }

            // if (newInputGroups[groupIndex].find(item => item.type === 'text').value) {
            //     error.taskTitle[groupIndex] = false;
            // }

            // if (newInputGroups[groupIndex].find(item => item.type === 'date').value) {
            //     error.targetDate[groupIndex] = false;
            // }

            if (newInputGroups[groupIndex].find(item => item.type === 'file').value) {
                error.taskImage[groupIndex] = false;
            }
        }
    }





    const transformData = (data) => {
        return {
            tasks: data?.map(group => {
                const taskTitle = group.find(item => item.type === 'text')?.value || '';
                const uploadImage = group.find(item => item.type === 'file')?.value || '';
                const targetDate = group.find(item => item.type === 'date')?.value || '';

                return {
                    taskTitle,
                    uploadImage,
                    targetDate
                };
            })
        };
    };

    const handleAddClick = () => {
        // Validate the existing input fields
        const isValid = validateFields();

        if (!isValid) {
            toast.error('Please fill out all required fields before adding new ones.');
            return;
        }

        // If validation passes, add new fields
        const lastGroupId = inputGroups[inputGroups.length - 1][0]?.id || 0;
        const newInputGroups = [...inputGroups];
        const newGroup = [
            { id: lastGroupId + 1, type: "text", value: "" },
            { id: lastGroupId + 2, type: "file", value: null },
            { id: lastGroupId + 3, type: "date", value: null },
        ];
        newInputGroups.push(newGroup);
        setInputGroups(newInputGroups);

        setError(prev => ({
            ...prev,
            taskTitle: false,
            targetDate: false,
            taskImage: false,
        }));
    };
    const validateFields = () => {
        let isValid = true;


        inputGroups.forEach(group => {
            group.forEach(input => {
                if (input.type === 'text' && !input.value) {
                    isValid = false;
                } else if (input.type === 'file' && !input.value) {
                    isValid = false;
                } else if (input.type === 'date' && !input.value) {
                    isValid = false;
                }
            });
        });

        return isValid;
    };


    function handleRemoveClick(groupId) {
        const newInputGroups = inputGroups.filter(
            (group) => group[0].id !== groupId
        );

        setInputGroups(newInputGroups);

        // Remove the corresponding error for the removed group
        setError(prev => ({
            ...prev,
            taskTitle: false, // Reset to false
            targetDate: false, // Reset to false
            taskImage: false, // Reset to false
        }));
    }



    const convertToDepartmentFormat = (deptid, deptName, tags, task) => {
        return {
            meetingId: meetingId,
            meetingTopic: meetingTopic,
            department: deptid?.map((id, index) => ({
                dep_id: id,
                dep_name: deptName[index],
                tag: tags,
                tasks: task.tasks
            }))
        };
    };

    function validateForm() {
        let isValid = true;
        let newError = {
            personName: false,
            taskTitle: false,
            tagName: false,
            targetDate: false,
            taskImage: false,
        };

        if (!personName[0]) {
            newError.personName = true;
            isValid = false;
        }

        inputGroups.forEach((group, index) => {
            if (!group.find(item => item.type === 'text').value) {
                newError.taskTitle = true;
                isValid = false;
            }

            if (!group.find(item => item.type === 'date').value) {
                newError.targetDate = true;
                isValid = false;
            }

            if (!group.find(item => item.type === 'file').value) {
                newError.taskImage = true;
                isValid = false;
            }
        });

        if (!tagName.length > 0) {
            newError.tagName = true;
            isValid = false;
        }

        setError(newError);
        if (!isValid) {
            toast.error("Please Check the fields with Red Outlines.");
        }
        return isValid;
    }






    async function handleSubmit() {
        setIsSubmitting(true);
        if (validateForm()) {
            try {

                if (taskId) {
                    const data = {
                        department: departmentData,
                        task_id: taskId,
                        task_title: updateTaskTitle,
                        target_date: updateSelectedDate,
                        task_image: updateTaskFile,
                        tag: tagName
                    };
                    console.log(data);


                    await updateData(data);
                } else {

                    const taskData = transformData(inputGroups);
                    const transformedData = convertToDepartmentFormat(deptId, personName, tagName, taskData);
                    console.log(transformedData, 'final data');
                    setdataforval(transformedData);
                    setIsLoading(true);
                    const saveData = await handleAddTask(transformedData);
                    setIsLoading(false);
                    if (saveData) {
                        toast.success("Task Added Successfully", { autoClose: 2000 });
                        navigate("/tasks");
                    }
                }
            } catch (error) {
                console.error("Error occurred:", error);

                toast.error("An error occurred. Please try again later.");
            }
        } else {
            setIsSubmitting(false);
        }
    }

    /**
     * 
     * All Handle change for image 
     */
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleChangeForImage = async (groupId, id, e) => {
        const file = e.target.files[0];
        let imageValue = '';
        if (file) {

            if (!file.type.startsWith('image/')) {
                setError({ taskImage: true });
                return;
            }

            imageValue = await convertToBase64(file);
            const newInputGroups = [...inputGroups];
            const groupIndex = newInputGroups.findIndex(
                (group) => group[0].id === groupId
            );
            if (groupIndex !== -1) {
                const inputIndex = newInputGroups[groupIndex].findIndex(
                    (input) => input.id === id
                );
                if (inputIndex !== -1) {
                    newInputGroups[groupIndex][inputIndex].value = imageValue;
                    setInputGroups(newInputGroups);
                }

                if (inputGroups[0].find(item => item.type === 'file').value) {

                    error.taskImage = false;

                }
            }
            setBase64Image(imageValue);
        }
    };

    async function updateData(data) {
        setIsLoading(true)
        const updateData = await parentTaskEdit(data);

        if (updateData) {
            setIsLoading(false)
            toast.success("Task Edit Successfully", {
                autoClose: 2000,
            });
            navigate("/tasks");
        }
    }

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
                                    <Grid item xs={12} md={6}>
                                        <InputLabel>Department / Government Organisation</InputLabel>
                                        <Select
                                            fullWidth
                                            value={personName}
                                            onChange={handleChange}
                                            size="small"
                                            input={<OutlinedInput />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected?.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                            error={error.personName}
                                            sx={{ borderColor: error.personName ? 'red' : '' }}

                                        >
                                            {allDepartmentData?.map((value) => (
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
                                        <Select
                                            labelId="tag"
                                            id="tag"
                                            fullWidth
                                            name="tag"
                                            multiple
                                            value={tagName.map(tag => reverseTagMapping[tag])}
                                            onChange={handleTagChange}
                                            size="small"
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected?.map((value) => (
                                                        <Chip key={value} label={value} />
                                                    ))}
                                                </Box>
                                            )}

                                            error={error.tagName}
                                            sx={{ borderColor: error.tagName ? 'red' : '' }}
                                        >
                                            {Object.keys(tagMapping).map((displayValue) => (
                                                <MenuItem key={displayValue} value={displayValue}>
                                                    {displayValue}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    {meetingId && (
                                        <Grid item xs={12} md={6}>
                                            <label>Meeting Id</label>
                                            <TextField
                                                id="outlined-basic"
                                                //label="Meeting Id"
                                                variant="outlined"
                                                fullWidth
                                                value={meetingId}
                                                name="dep_name"
                                                size="small"
                                                disabled
                                            />
                                        </Grid>
                                    )}
                                    {meetingTopic && (
                                        <Grid item xs={12} md={6}>
                                            <label>Meeting Topic</label>
                                            <TextField
                                                id="outlined-basic"
                                                // label="Meeting Topic"
                                                variant="outlined"
                                                fullWidth
                                                name="dep_name"
                                                size="small"
                                                value={meetingTopic}
                                                onChange={(e) => setMeetingTopic(e.target.value)}
                                                disabled
                                            />
                                        </Grid>
                                    )}
                                </Grid>

                                {!taskId && inputGroups?.map((group, index) => (
                                    <Grid container key={group[0].id} spacing={2} sx={{ marginBottom: '20px' }}>
                                        {group?.map((input) => (
                                            <React.Fragment key={input.id}>
                                                {input.type === 'file' ? (
                                                    <Grid item xs={6} md={6}>
                                                        <InputLabel sx={{ mb: 1 }}>Upload Images</InputLabel>
                                                        <Box display={'flex'} gap={2}>
                                                            <TextField
                                                                variant="outlined"
                                                                fullWidth
                                                                placeholder="Choose Image"
                                                                name="uploadImage"
                                                                size="small"
                                                                type="file"
                                                                onChange={(e) => handleChangeForImage(group[0].id, input.id, e)}
                                                                error={error.taskImage}
                                                                sx={{ borderColor: error.taskImage ? 'red' : '' }}
                                                            />
                                                            <Box width={'40px'} height={'40px'} minWidth={'40px'} borderRadius={'6px'} backgroundColor='#ebebeb'>
                                                                {base64Image && (
                                                                    <img
                                                                        alt=""
                                                                        width={'100%'}
                                                                        height={'100%'}
                                                                        className="smallImageInTask"
                                                                        src={input.value}
                                                                    />
                                                                )}
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                ) : input.type === 'date' ? (
                                                    <Grid item xs={6} md={6}>
                                                        <InputLabel sx={{ mb: 1 }}>Target Date</InputLabel>
                                                        <Controller
                                                            name="date"
                                                            control={control}
                                                            render={({ field: { onChange, value } }) => (
                                                                <TextField
                                                                    type="date"
                                                                    name="date"
                                                                    fullWidth
                                                                    size="small"
                                                                    value={input.value} // Ensuring the initial value is used
                                                                    placeholder="dd-mm-yyyy"
                                                                    onChange={(e) => {
                                                                        onChange(e);
                                                                        handleInputChange(group[0].id, input.id, e);
                                                                    }}
                                                                    id="date"
                                                                    variant="outlined"
                                                                    InputLabelProps={{
                                                                        shrink: true
                                                                    }}
                                                                    error={error.targetDate}
                                                                    sx={{ borderColor: error.targetDate ? 'red' : '' }}

                                                                    InputProps={{
                                                                        inputProps: { min: getTodayDate() }
                                                                    }}
                                                                />
                                                            )}
                                                        />

                                                    </Grid>
                                                ) : (
                                                    <Grid item xs={12} md={12}>
                                                        <InputLabel sx={{ mb: 1 }}>Task Title</InputLabel>
                                                        <TextField
                                                            variant="outlined"
                                                            placeholder="Enter task title"
                                                            type={input.type}
                                                            value={input.value}
                                                            onChange={(e) => handleInputChange(group[0].id, input.id, e)}
                                                            fullWidth
                                                            size="small"
                                                            error={error.taskTitle}
                                                            sx={{ borderColor: error.taskTitle ? 'red' : '' }}

                                                        />
                                                    </Grid>
                                                )}
                                            </React.Fragment>
                                        ))}
                                        {index >= 1 && (
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    sx={{
                                                        color: 'white', marginTop: '2%', backgroundColor: '#f32f53', '&:hover': {
                                                            backgroundColor: '#f32f53',
                                                        },
                                                    }}
                                                    onClick={() => handleRemoveClick(group[0].id)}
                                                >
                                                    Remove Task
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}

                                {taskId && (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <InputLabel sx={{ mb: 1 }}>Task Title</InputLabel>
                                            <TextField
                                                variant="outlined"
                                                fullWidth
                                                placeholder="Enter task title"
                                                name="taskTitle"
                                                size="small"
                                                value={updateTaskTitle}
                                                onChange={(e) => setUpdateTaskTitle(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <InputLabel sx={{ mb: 1 }}>Upload Image</InputLabel>
                                            <Box display={'flex'} gap={2}>
                                                <TextField
                                                    variant="outlined"
                                                    fullWidth
                                                    placeholder="Enter task title"
                                                    name="uploadImage"
                                                    size="small"
                                                    type="file"
                                                    accept="image/*"
                                                    // value={updateTaskFile || ''}
                                                    onChange={handleUpdateFileChange}
                                                />
                                                <Box width={'40px'} height={'40px'} minWidth={'40px'} borderRadius={'6px'} backgroundColor='#ebebeb'>
                                                    {updateTaskFile && (
                                                        <img
                                                            alt="" width={'100%'} height={'100%'} className="smallImageInTask"
                                                            src={updateTaskFile}
                                                        />
                                                    )}
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <InputLabel sx={{ mb: 1 }}>Target Date</InputLabel>
                                            <Controller
                                                name="task_date"
                                                control={control}
                                                render={({ field: { onChange, value } }) => (
                                                    <TextField
                                                        type="date"
                                                        name="task_date"
                                                        fullWidth
                                                        size="small"
                                                        placeholder="dd-mm-yyyy"
                                                        onChange={(e) => {
                                                            setUpdateSelectedDate(e.target.value);
                                                        }}

                                                        value={updateSelectedDate || ''}
                                                        id="task_date"
                                                        variant="outlined"
                                                        InputLabelProps={{
                                                            shrink: true
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                )}

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
                                        {!taskId && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                sx={{ color: 'white', marginTop: '2%', mr: '10px', fontWeight: 'bold' }}
                                                onClick={handleAddClick}
                                            >
                                                <PlusCircleOutlined />
                                            </Button>
                                        )}
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ color: 'white', marginTop: '2%' }}
                                            onClick={handleSubmit}
                                        >
                                            {taskId ? 'Update' : 'Submit'}
                                        </Button>
                                    </Grid>
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


}
