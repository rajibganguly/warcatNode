
import { useState } from "react";
import * as React from 'react';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Link, Navigate, useLocation } from "react-router-dom";
import InputFileUpload from "../components/InputFileUpload";

import MuiDrawer from "@mui/material/Drawer";
import { Button, TextField } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import Sidebar from "../components/Sidebar";

import { Input as BaseInput } from '@mui/base/Input';
import { styled } from '@mui/system';
import { toast } from "react-toastify";
import { fetchRoleType, getRoleTypename, handleAddNote } from "./common";
import { useNavigate } from "react-router-dom";




function Label({ componentName, valueType }) {

}
const Input = React.forwardRef(function CustomInput(props, ref) {
    return (
        <BaseInput
            slots={{
                root: RootDiv,
                input: 'input',
                textarea: TextareaElement,
            }}
            {...props}
            ref={ref}
        />
    );
});

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

const RootDiv = styled('div')`
    display: flex;
    max-width: 100%;
  `;

const TextareaElement = styled('textarea', {
    shouldForwardProp: (prop) =>
        !['ownerState', 'minRows', 'maxRows'].includes(prop.toString()),
})(
    ({ theme }) => `
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5rem;
    padding: 8px 12px;
    border-radius: 8px 8px 0 8px;
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
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[700] : blue[200]};
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
);





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

export default function TaskNote() {
    const [open, setOpen] = React.useState(true);
    const [personName, setPersonName] = React.useState([]);
    const theme = useTheme();
    const navigate = useNavigate();
    const [taskNote, setTaskNote] = useState('');
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    }
    const localSt = JSON.parse(localStorage.getItem("user"));
    const currentRoleType = localSt.role_type;
    const userId = localSt?._id;
    const userRoleType = fetchRoleType();
    const userName = localSt?.name;
    const handleOutput = (open) => {
        toggleDrawer();
    };
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskId = queryParams.get('taskId');

    async function handleSubmit() {
        const data = {
            note_description: taskNote,
            note_written_by: userName +' - ('+ getRoleTypename(userRoleType) +')',
            // role_type: 'secretary'
            role_type: currentRoleType
        };
        if (taskId) {
            console.log(data, 'dip')
            const saveData = await handleAddNote(data, taskId);
            console.log(saveData, 'savedata');
            if (saveData) {
                toast.success("Note added Successfully", {
                    autoClose: 2000,
                });
                navigate("/tasks");
            }
        }
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
                        <Typography variant="body1" sx={{ fontWeight: 700 }}> Add Note</Typography>

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
                                    Add Note
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
                            <CardContent>

                                <Grid container spacing={2} sx={{ mb: 4, borderBottom: '1px solid #eff2f7', pb: 2 }}>
                                    
                                    <Grid item xs={12} sx={{borderBottom: '1px solid #eff2f7', pb: 2 }}>
                                    <InputLabel id="demo-multiple-chip-label1"  sx={{  marginBottom: '1%' }}>Add Note</InputLabel>
                                    <Input fullWidth rows={4} aria-label="Demo input"  multiline placeholder="Write Note…"
                                    onChange={(e)=>setTaskNote(e.target.value)} />
                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ color: 'white', marginTop: '2%' }}
                                        onClick={handleSubmit}
                                    >
                                        Add Now
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
