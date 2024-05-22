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
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
//import axiosInstance from "../apiConfig/axoisSetup";
import ApiConfig from "../config/ApiConfig";
import { Button } from "@mui/material";
import TableNew from "../components/TableNew";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { TextField, Dialog, DialogContent, DialogContentText } from "@mui/material";
import CardActions from "@mui/material/CardActions";
// import ApiConfig from '../config/ApiConfig'
import IconButton from "@mui/material/IconButton";
import { CloseOutlined } from '@mui/icons-material';
import { MeetingContext } from './../context/MeetingContext'
import { TaskContext } from "../context/TaskContext";

const column = [
  { text: 'Meeting Id', dataField: 'meetingId' },
  { text: 'Meeting Topic', dataField: 'meetingTopic' },
  { text: 'Departments', dataField: 'departmentNames' },
  { text: 'Tag', dataField: 'tag' },
  { text: 'Date', dataField: 'selectDate' },
  { text: 'Time', dataField: 'selectTime' },
  { text: 'Attachment', dataField: 'imageUrl' },
  { text: 'Tasks', dataField: 'tasks' },
  { text: 'Operation', dataField: 'meetingoperation' },
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




export default function Meetings() {
  const [open, setOpen] = React.useState(true);
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [file, setFile] = useState();
  const navigate = useNavigate();

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };
  const closeModal1 = () => {
    setModalVisible1(false);
  };

  const localUser = JSON.parse(localStorage.getItem('user'));
  const currentRoleType = localUser.role_type;
  const { allMeetingLists } = React.useContext(MeetingContext);
  const allmeetingData = allMeetingLists?.meetings;
  const { allTaskLists } = React.useContext(TaskContext);
  const allTaskListsData = allTaskLists?.tasks;

  

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



  /**
   * @description DEFINED CLICK EVENTS:
   * @click to view details about the meeting
   */
  const handleTasksViewInMeeting = (record) => {
    console.log('View clicked for view meetings:', record);
  };


  const handleTasksAddInMeeting = (record) => {
    navigate('/add-tasks')
  };

  const handleEditmeeting = (row) => {
    console.log('Edit clicked for:', row);
    if (row && row.meetingId) {
      navigate(`/edit-meeting/${row.meetingId}`);
    } else {
      console.error('Invalid row data:', row);

    }
  };


  const findMeetingRows = (meetingId) => {
    return allTaskListsData.filter(row => row.meetingId && row.meetingId === meetingId);
  };

  const handleTaskView = (data) => {
    setModalContent(findMeetingRows(data?.meetingId))
    setModalVisible1(true);

  };





  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // const profilePic = "../assets/user/user1.png"



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
                    Meetings
                  </div>
                  <div>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="/">
                        WARCAT
                      </Link>
                      <Typography color="text.primary">Meetings</Typography>
                    </Breadcrumbs>
                  </div>
                </div>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card sx={{ maxWidth: 100 + "%" }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 2,
                          borderBottom: '1px solid #eff2f7',

                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>Meetings</Typography>
                        {currentRoleType === 'admin' && (<Button variant="contained" sx={{
                          backgroundColor: 'green',
                          '&:hover': {
                            backgroundColor: 'darkgreen',
                          },
                        }} component={Link} to="/add-new-meetings">
                          Add New Meetings
                        </Button>)}
                      </Box>
                      <CardContent>
                        <TableNew
                          data={allmeetingData}
                          column={column}
                          handleTasksAddInMeeting={handleTasksAddInMeeting}
                          handleTasksViewInMeeting={handleTasksViewInMeeting}
                          handleEditmeeting={handleEditmeeting}
                          handleTaskView={handleTaskView}
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
                            {modalContent ? (
                              <DialogContentText id="modal-description">
                                <Typography variant="h4" id="modal-title">
                                  Website Issue
                                </Typography>
                                <Card sx={{ width: '100%', maxWidth: 900, maxHeight: 600, overflowY: 'auto' }}>
                                  <IconButton
                                    aria-label="close"
                                    onClick={closeModal}
                                    sx={{ position: 'absolute', right: '5px', top: '0', color: 'gray' }}
                                  >
                                    <CloseOutlined />
                                  </IconButton>
                                  <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                      <Typography variant="h5" color="text.secondary">
                                        Subtask
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {modalContent.task_title}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Target Date: {modalContent.target_date}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        Attachment.png
                                      </Typography>
                                    </div>
                                    <Button variant="contained" color="primary">Add Subtask</Button>
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
                            ) : (
                              <DialogContentText id="modal-description">
                                No record found.
                              </DialogContentText>
                            )}
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
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
