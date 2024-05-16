
import React, { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import InputFileUpload from "../components/InputFileUpload";
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
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useTheme } from '@mui/material/styles';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from 'react-redux';



function Label({ componentName, valueType }) {

}
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
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
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



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AddTasks() {
    const [open, setOpen] = React.useState(true);
    const [personName, setPersonName] = React.useState([]);
    const theme = useTheme();

    const departments = useSelector(state => state.departments.data);
    const departmentNames = departments.map((dept) => dept.department.department_name);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }
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
        }
    }

    function handleFileInputChange(groupId, id, e) {
        const newInputGroups = [...inputGroups];
        const groupIndex = newInputGroups.findIndex(
            (group) => group[0].id === groupId
        );
        if (groupIndex !== -1) {
            const inputIndex = newInputGroups[groupIndex].findIndex(
                (input) => input.id === id
            );
            if (inputIndex !== -1) {
                newInputGroups[groupIndex][inputIndex].value = e.target.files[0];
                setInputGroups(newInputGroups);
            }
        }
    }

    function handleAddClick() {
        const lastGroupId = inputGroups[inputGroups.length - 1][0]?.id || 0;
        const newInputGroups = [...inputGroups];
        const newGroup = [
            { id: lastGroupId + 1, type: "text", value: "" },
            { id: lastGroupId + 2, type: "file", value: null },
            { id: lastGroupId + 3, type: "date", value: null },
        ];
        newInputGroups.push(newGroup);
        setInputGroups(newInputGroups);
    }

    function handleRemoveClick(groupId) {
        const newInputGroups = inputGroups.filter(
            (group) => group[0].id !== groupId
        );
        setInputGroups(newInputGroups);
    }

    function handleSubmit() {
        console.log(inputGroups);
    }


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
                                <Typography variant="body1">Add Tasks</Typography>

                            </Box>
                            <CardContent>

                                <Grid container spacing={2} sx={{ mb: 4, borderBottom: '1px solid #eff2f7', pb: 2 }}>
                                    <Grid item xs={6}>
                                    <InputLabel id="demo-multiple-chip-label1">Department / Government Organisation</InputLabel>
                                        <Select
                                            labelId="demo-multiple-chip-label2"
                                            id="demo-multiple-chip"
                                            fullWidth
                                            multiple
                                            value={personName}
                                            onChange={handleChange}
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
                                            {departmentNames.map((name) => (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                    style={getStyles(name, personName, theme)}
                                                >
                                                    {name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <label>Tag</label>
                                        <TextField
                                            id="outlined-basic"
                                            label="Tag"
                                            variant="outlined"
                                            fullWidth
                                            name="dep_name"

                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <label>Meeting ID</label>
                                        <TextField
                                            id="outlined-basic"
                                            label="Meeting ID"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                            name="dep_name"

                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <label>Meeting Topic</label>
                                        <TextField
                                            id="outlined-basic"
                                            label="Meeting Topic"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                            name="dep_name"

                                        />
                                    </Grid>
                                </Grid>

                                {inputGroups.map((group, index) => (
                                    <Grid container key={group[0].id} spacing={2} sx={{ marginBottom: '20px' }}>
                                        {group.map((input) => (
                                            <Grid item xs={12} sm={6} key={input.id}>
                                                {input.type === 'file' ? (
                                                    <Grid container >
                                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                                            <InputFileUpload
                                                                groupId={group[0].id}
                                                                inputId={input.id}
                                                                handleFileInputChange={handleFileInputChange}
                                                                sx={{ minWidth: '100%', width: '100%' }}
                                                                fullWidth
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                ) : input.type === 'date' ? (
                                                    <Grid container justifyContent="start" alignItems="center">
                                                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
                                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                <DatePicker
                                                                    label="Select Date"
                                                                    selectedDate={input.value}
                                                                    handleDateChange={(date) => handleInputChange(group[0].id, input.id, date)}
                                                                    fullWidth
                                                                    sx={{ minWidth: '100%', width: '100%' }}
                                                                />
                                                            </LocalizationProvider>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <TextField
                                                        id="outlined-basic"
                                                        label="Enter Task Title"
                                                        variant="outlined"
                                                        type={input.type}
                                                        value={input.value}
                                                        onChange={(e) => handleInputChange(group[0].id, input.id, e)}
                                                        fullWidth
                                                    />
                                                )}
                                            </Grid>
                                        ))}
                                        {index >= 1 && (
                                            <Grid item xs={12}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    sx={{ color: 'white', marginTop: '2%',backgroundColor: '#f32f53','&:hover': {
                                                        backgroundColor: '#f32f53', 
                                                    }, }}
                                                    onClick={() => handleRemoveClick(group[0].id)}
                                                >
                                                    Remove Task
                                                </Button>
                                            </Grid>
                                        )}
                                    </Grid>
                                ))}





                                <Grid container spacing={2}>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ color: 'white', marginTop: '2%', mr: '10px', fontWeight: 'bold' }} // Added left margin for spacing
                                            onClick={handleAddClick}
                                        >
                                            <PlusCircleOutlined />
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            sx={{ color: 'white', marginTop: '2%' }}
                                            onClick={handleSubmit}
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Box>
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
