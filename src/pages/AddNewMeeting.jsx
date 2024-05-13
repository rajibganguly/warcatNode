
import * as React from "react";
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
//import { useNavigate } from "react-router-dom";
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

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Sidebar from "../components/Sidebar";

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



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AddNewMeeting() {
    const [open, setOpen] = React.useState(true);

    const [personName, setPersonName] = React.useState([]);
    const theme = useTheme();
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
                            {/* Recent Orders */}
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
                    MEETINGS
                  </div>
                  <div>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="/">
                        WARCAT
                      </Link>
                      <Link
                        underline="hover"
                        color="inherit"
                        href="/meetings"
                      >
                        Meetings
                      </Link>
                      <Typography color="text.primary">
                        Add New Meetings
                      </Typography>
                    </Breadcrumbs>
                  </div>
                </div>                               
                                <Card sx={{ width: 100 + "%", padding: 2 }}>

                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: 2,
                                                borderBottom: '1px solid #eff2f7',

                                            }}
                                        >
                                            <Typography variant="body1">Add Meetings</Typography>
                                        </Box>
                                    <CardContent>
                                        <Box
                                            component="form"

                                            noValidate
                                            autoComplete="off"
                                            sx={{ marginTop: 2 }}
                                        >

                                            <Grid container spacing={2}>
                                                <Grid item xs={6}>
                                                    <FormControl sx={{ width: 100 + '%' }}>
                                                        <InputLabel id="demo-multiple-chip-label1">Department / Government Organisation</InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-chip-label1"
                                                            id="demo-multiple-chip"
                                                            fullWidth
                                                            multiple
                                                            value={personName}
                                                            onChange={handleChange}
                                                            input={<OutlinedInput id="select-multiple-chip1" label="Chip" />}
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
                                                                    key={name}
                                                                    value={name}
                                                                    style={getStyles(name, personName, theme)}
                                                                >
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <FormControl sx={{ width: 100 + '%' }}>
                                                        <InputLabel id="demo-multiple-chip-label2">Tag</InputLabel>
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
                                                            {names.map((name) => (
                                                                <MenuItem
                                                                    key={name}
                                                                    value={name}
                                                                    style={getStyles(name, personName, theme)}
                                                                >
                                                                    {name}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <TextField id="outlined-basic" label="Enter Meeting Topic" variant="outlined" fullWidth />
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer
                                                            components={[
                                                                'DatePicker',
                                                                'TimePicker',
                                                            ]}
                                                        >
                                                            <Grid item xs={4}>
                                                                <DemoItem label={<Label componentName="DatePicker" valueType="date" />}>
                                                                    <DatePicker />
                                                                </DemoItem>
                                                            </Grid>

                                                            <Grid item xs={4}>
                                                                <DemoItem label={<Label componentName="TimePicker" valueType="time" />}>
                                                                    <TimePicker />
                                                                </DemoItem>
                                                            </Grid>

                                                            <Grid item xs={4} sx={{display: 'flex',justifyContent: 'center', alignItems: 'center'}}>
                                                                <Button
                                                                    component="label"
                                                                    role={undefined}
                                                                    variant="contained"
                                                                    tabIndex={-1}
                                                                    startIcon={<CloudUploadIcon />}
                                                                    sx={{display: 'flex',justifyContent: 'center', alignItems: 'center',width: '100%'}}
                                                                >
                                                                    Upload file
                                                                    <VisuallyHiddenInput type="file" />
                                                                </Button>
                                                            </Grid>
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                            </Grid>
                                            <Button variant="contained" color="info" sx={{ color: 'white', marginTop: '2%' }}>Add Meeting</Button>
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
