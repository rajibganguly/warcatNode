import React, { useState, useEffect } from 'react';
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
import IconButton from "@mui/material/IconButton";
import { Button, Dialog, DialogContent, DialogContentText } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { CloseOutlined } from '@mui/icons-material';
import { DepartmentContext } from '../context/DepartmentContext'

import ApiConfig from "../config/ApiConfig"


import { toast } from "react-toastify";
import TableNew from "../components/TableNew";
//import axiosInstance from "../config/axoisSetup";
import Sidebar from "../components/Sidebar";

import { CardActions } from '@mui/material';

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
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalContent, setModalContent] = React.useState(null);
  //const [loadingData, setLoadingData] = React.useState(false);

  const { selectedDepartmentData, setSelectedDepartmentData } = React.useContext(DepartmentContext);

  const localUser = JSON.parse(localStorage.getItem('user'));
  const currentRoleType = localUser.role_type;

  useEffect(() => {
    fetchDepartmentData();
  }, []);



  /**
   * @description Private function for fetch department data
   */
  const fetchDepartmentData = async () => {
    if (!toast.isActive("loading")) {
      toast.loading("Loading departments data...", { autoClose: false, toastId: "loading" });
    }
    const localData = localStorage.getItem("user");
    const userObj = JSON.parse(localData)
    try {
      const localObj = { userId: userObj._id, role_type: userObj.role_type };

      const params = {
        userId: localObj.userId,
        role_type: localObj.role_type
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



  const handleSeeClick = (row) => {
    setModalContent(row);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };

  const handleEditClick = (record) => {
    console.log(record)
    setSelectedDepartmentData(record)
    navigate(`/edit-departments/${record.department._id}`);
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
            <Grid container spacing={2}>
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
                    {currentRoleType === 'admin' && (<Button variant="contained" sx={{
                      backgroundColor: 'green',
                      '&:hover': {
                        backgroundColor: 'darkgreen',
                      },
                    }} onClick={handleClickAddDepartment}>
                      Add Department
                    </Button>)}
                  </Box>
                  <CardContent>
                    <TableNew
                      data={data}
                      column={column}
                      icons={icons}
                      handleSeeClick={handleSeeClick}
                      handleEditClick={handleEditClick}

                    />
                    <Dialog
                      open={modalVisible}
                      onClose={closeModal}
                      aria-labelledby="modal-title"
                      aria-describedby="modal-description"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <DialogContent sx={{ p: 2, width: '600px' }}>
                        {modalContent && (
                          <DialogContentText id="modal-description">
                            <Typography variant="h4" id="modal-title">
                              <h5 className='textclr'>Department Name: <b className='textclr2'>{modalContent.department.department_name}</b></h5>

                            </Typography>

                            <Typography variant="h5" id="modal-title">
                              <u className='textclr'>Department Name: </u>

                            </Typography>

                            <Typography variant="h4" id="modal-title">
                              <h6 className='textclr'>Secretary Name: <b className='textclr2'>{modalContent.secretary.name}</b></h6>
                            </Typography>

                            <Typography variant="h4" id="modal-title">
                              <h6 className='textclr'> Secretary Phone number: <b className='textclr2'>{modalContent.secretary.phone}</b></h6>
                            </Typography>


                            <Card sx={{ width: '100%', maxWidth: 900, maxHeight: 600, overflowY: 'auto' }}>
                              <IconButton
                                aria-label="close"
                                onClick={closeModal}
                                sx={{ position: 'absolute', right: '5px', top: '0', color: 'gray' }}
                              >
                                <CloseOutlined />
                              </IconButton>
                              <CardContent>
                                <Typography variant="h5" color="text.secondary">
                                  Secretary Details
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Secretary Name: {modalContent.secretary.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Secretary Phone number: {modalContent.secretary.phone}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Secretary Email Id: {modalContent.secretary.email}
                                </Typography>

                                <Typography variant="h5" color="text.secondary" mt={4} py={2}>
                                  Head of Office Details
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Head of Office Name: {modalContent.headOffice.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Head of Office Designation: {modalContent.headOffice.designation}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Head of Office Phone number: {modalContent.headOffice.phone_number}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Head of Office Email Id: {modalContent.headOffice.email}
                                </Typography>
                              </CardContent>
                              <CardActions sx={{ justifyContent: 'flex-end' }}>
                                <Button size="small" variant="contained" color="primary" >
                                  Email
                                </Button>
                                <Button size="small" variant="contained" color="primary" onClick={() => console.log('Share clicked')}>
                                  Sms
                                </Button>
                              </CardActions>
                            </Card>
                          </DialogContentText>
                        )}
                      </DialogContent>
                    </Dialog>
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
            </Box>
          </Container>
          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
