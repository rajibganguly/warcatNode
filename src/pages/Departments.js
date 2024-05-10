import * as React from "react";
import { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CustomTable from '../components/CustomTable';
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton"; import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "../components/listitems";
import LogoBlack from "../components/logoblack";
import ProfileSidePane from "../components/profileSidepane";
import MuiDrawer from "@mui/material/Drawer";
import { Button, ButtonGroup, TextField } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import SearchIcon from '@mui/icons-material/Search';
import { toast } from "react-toastify";
import TableNew from "../components/TableNew";
import axiosInstance from "../apiConfig/axoisSetup";
import Sidebar from "../components/Sidebar";


const column = [
  { text: 'Department', dataField: 'department.department_name' },
  { text: "Secretary", dataField: 'secretary.name' },
  { text: "Head Of Office", dataField: 'headOffice.name' },
  { text: "Operations", dataField: 'Operations' },

];
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



export default function Departments() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [loadingData, setLoadingData] = useState(false);


  useEffect(() => {

    fetchDepartmentData();
  }, []);

  const fetchDepartmentData = async () => {

    if (!toast.isActive("loading")) {

      toast.loading("Loading departments data...", { autoClose: false, toastId: "loading" });
    }

    try {
      const response = await axiosInstance.get('/api/departments');

      if (!response || !response.data) {
        throw new Error("Failed to fetch department data");
      }

      const departmentData = response.data;
      setData(departmentData);
      toast.dismiss("loading");
    } catch (error) {
      console.error("Error fetching department data:", error);

      toast.dismiss("loading");

      toast.error("Failed to fetch department data");
    }
  };





  const handleSeeClick = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };


  const handleEditClick = (record) => {
    console.log('Edit clicked for:', record);
    navigate('/edit-departments');

  };

  const handleDeleteClick = (record) => {
    console.log('Delete clicked for:', record);

  };



  const icons = {
    see: <EyeOutlined />,
    edit: <EditOutlined />,
    delete: <DeleteOutlined />,
  };


  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };


  const handleClickAddDepartment = () => {
    navigate('/add_department')
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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={2} >
              <Grid item xs={12} >
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
                    Department
                  </div>
                  <div>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" >
                        WARCAT
                      </Link>
                      <Typography color="text.primary">Department</Typography>
                    </Breadcrumbs>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Card sx={{ maxWidth: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 2,
                      borderBottom: '1px solid #eff2f7',

                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>All Departments</Typography>
                    <Button variant="contained" sx={{
                      backgroundColor: 'green',
                      '&:hover': {
                        backgroundColor: 'darkgreen',
                      },

                    }} onClick={handleClickAddDepartment}>
                      Add Department
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 2,


                    }}
                  >
                    <ButtonGroup variant="contained" aria-label="Basic button group"  >
                      <Button sx={{
                        backgroundColor: '#6c757d',
                        borderColor: '1px solid #6c757d',

                        '&:hover': {
                          backgroundColor: '#5c636a',
                          borderColor: '#5c636a'
                        },

                      }}>Copy</Button>
                      <Button sx={{
                        backgroundColor: '#6c757d',
                        borderColor: '1px solid #6c757d',
                        '&:hover': {
                          backgroundColor: '#5c636a',
                          borderColor: '#5c636a'
                        },

                      }}>Excel</Button>
                      <Button sx={{
                        backgroundColor: '#6c757d',
                        borderColor: '#6c757d',
                        '&:hover': {
                          backgroundColor: '#5c636a',
                          borderColor: '#5c636a'
                        },

                      }}>PDF</Button>
                      <Button sx={{
                        backgroundColor: '#6c757d',
                        borderColor: '#6c757d',
                        '&:hover': {
                          backgroundColor: '#5c636a',
                          borderColor: '#5c636a'
                        },

                      }}>Column Visibility</Button>
                    </ButtonGroup>
                    <TextField
                      id="outlined-textarea"
                      label="Search"
                      variant="outlined"
                      placeholder="Enter search"
                      size="small"
                      InputProps={{
                        endAdornment: (
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        ),
                      }}
                    />
                  </Box>
                  <CardContent>
                    <TableNew
                      data={data}
                      column={column}
                      icons={icons}
                      handleSeeClick={handleSeeClick}
                      handleEditClick={handleEditClick}
                      handleDeleteClick={handleDeleteClick}
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Box
              component="footer"
              sx={{
                width: "100%",
                paddingBottom: "20px",
              }}
            >
              <Footer />
            </Box>
          </Container>


        </Box>
      </Box>
    </ThemeProvider>
  );
}
