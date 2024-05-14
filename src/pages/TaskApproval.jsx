
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
import { Button, TextField } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
//import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import { Input as BaseInput } from '@mui/base/Input';
import Sidebar from "../components/Sidebar";
import ReactPlayer from "react-player";
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

export default function TaskApproval() {
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
                                        Approval
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
                                                Task Approval
                                            </Link>

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
                                        <Typography variant="body1">Task Approval</Typography>
                                    </Box>
                                    <CardContent>
                                        <Box
                                            component="form"

                                            noValidate
                                            autoComplete="off"
                                            sx={{ marginTop: 2 }}
                                        >

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={4}>
                                                    <h5 style={{marginBottom: '0px'}}>Name</h5>
                                                    <p style={{marginTop: '0px'}}>Rishi Kumar</p>
                                                    <h5 style={{marginBottom: '0px'}}>Role</h5>
                                                    <p style={{marginTop: '0px'}}>Secratary</p>
                                                    <h5 style={{marginBottom: '0px'}}>Date</h5>
                                                    <p style={{marginTop: '0px'}}>15-12-2023</p>
                                                    
                                                </Grid>

                                                <Grid item xs={12} sm={4}>
                                                    <InputLabel id="demo-multiple-chip-label1" sx={{ marginBottom: '1%' }}>Note</InputLabel>
                                                    <span>noteId</span>
                                                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that</p>
                                                    <Grid item xs={12} sx={{ borderBottom: '1px solid #eff2f7', pb: 2 }} />

                                                    <InputLabel id="demo-multiple-chip-label1" sx={{ marginBottom: '1%' }}>Description</InputLabel>
                                                    <span>noteId</span>
                                                    <p>It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.</p>
                                                    <Grid item xs={12} sx={{ borderBottom: '1px solid #eff2f7', pb: 2 }} />
                                                </Grid>

                                                <Grid item xs={12} sm={4}>
                                                    <ReactPlayer
                                                        url={"https://www.youtube.com/watch?v=668nUCeBHyY"}
                                                        controls
                                                        width="100%"
                                                        height="100%"
                                                    />
                                                </Grid>





                                            </Grid>
                                            <Box sx={{ marginTop: 2 }}>
                                                <Button variant="contained" color="success" onClick={null}>
                                                    Approve
                                                </Button>
                                                <Button variant="contained" color="error" onClick={null} sx={{ marginLeft: 2 }}>
                                                    Reject
                                                </Button>
                                            </Box>
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