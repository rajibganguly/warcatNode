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
import { Button, Chip, Divider } from "@mui/material";
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
import { formatDate, formatDateWithmonth } from "./common";
import { Link as MuiLink } from '@mui/material';

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
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDataView, setTaskDataView] = useState([]);
  const [meetingData, setMeetingData] = useState([]);
  const navigate = useNavigate();

  const closeModal = () => {
    setModalVisible(false);
    setTaskDataView([]);
  };

  const localUser = JSON.parse(localStorage.getItem('user'));
  const currentRoleType = localUser.role_type;
  const { allMeetingLists } = React.useContext(MeetingContext);
  const allDepartmentListData = allMeetingLists?.meetings;
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

  const handleTasksAddInMeeting = (record) => {
    console.log(record,'record')
    const encodedMeetingId = window.btoa(record?.meetingId);
    const encodedMeetingTopic = window.btoa(record?.meetingTopic);
    navigate(`/add-tasks?meetingId=${encodeURIComponent(encodedMeetingId)}&meetingTopic=${encodeURIComponent(encodedMeetingTopic)}`);
  };

  const handleEditmeeting = (row) => {
    console.log('Edit clicked for:', row);
    // Check if row and row.meetings are defined
    if (row && row.meetingId) {
      navigate(`/edit-meeting/${row.meetingId}`);
    } else {
      // Log an error if any property is undefined
      console.error('Invalid row data:', row);
      // Optionally, handle the error or provide feedback to the user
    }
  };

  const findMeetingRows = (meetingId) => {
    return allTaskListsData.filter(row => row.meetingId && row.meetingId === meetingId);
  };

  const handleTasksViewInMeeting = (data) => {
    setMeetingData(data);
    setTaskDataView(findMeetingRows(data?.meetingId))
    setModalVisible(true);

  };

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
                          data={allDepartmentListData}
                          column={column}
                          handleTasksAddInMeeting={handleTasksAddInMeeting}
                          handleTasksViewInMeeting={handleTasksViewInMeeting}
                          handleEditmeeting={handleEditmeeting}
                        />
                        <Dialog
                          fullWidth
                          open={modalVisible}
                          onClose={closeModal}
                          aria-labelledby="modal-title"
                          aria-describedby="modal-description"
                        >
                          {taskDataView && taskDataView.length > 0 ? (
                            <>
                              <Box
                                p={2}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'space-between'}
                              >
                                <Box>
                                  <Typography variant="h6" color="text.primary">{meetingData?.meetingTopic}</Typography>
                                  <Box
                                    display={'flex'}
                                    gap={2}
                                  >
                                    <Typography color="text.secondary">{formatDate(meetingData?.selectDate)}</Typography>
                                    <Typography color="text.secondary">{meetingData?.selectTime}</Typography>
                                  </Box>
                                </Box>
                                <IconButton
                                  size="small"
                                  aria-label="close"
                                  onClick={closeModal}
                                >
                                  <CloseOutlined />
                                </IconButton>
                              </Box>
                              <Divider/>
                              <DialogContent>
                                <Box mb={2} display={'flex'} gap={4} alignItems={'center'}>
                                  <Typography variant="h6" color="text.primary" className="text-underline">
                                    Tasks
                                  </Typography>
                                  <Button variant="contained" color="primary" className="fs-12">Add New Subtask</Button>
                                </Box>
                                {taskDataView.map((task, index) => (
                                  <Box key={index}>
                                    <Typography fontSize={'12px'} color="text.secondary">
                                      {formatDateWithmonth(task.timestamp)}
                                    </Typography>
                                    <Typography color="text.primary" variant="h6" mb={.5}>
                                      {task.task_title}
                                    </Typography>
                                    <Box display={'flex'} gap={1} alignItems={'center'}>
                                      <Typography color="text.secondary">
                                        Target Date:
                                      </Typography>
                                      <Typography color="error">
                                        {formatDateWithmonth(task.target_date)}
                                      </Typography>
                                    </Box>
                                    <MuiLink component="a" href={task.task_image} download="attachment.png">
                                      attachment.png
                                    </MuiLink>
                                    <Box gap={2} display={'flex'} justifyContent={'right'}>
                                      <Chip label={task.status} className="taskStatusBtn"  sx={{background:'#ffbb44'}} />
                                      <Button variant="contained" style={{ backgroundColor: '#0a1832', color: '#ffffff'}}>Edit</Button>
                                    </Box>
                                    {index < taskDataView.length - 1 && <Divider sx={{my:2}} />}
                                  </Box>
                                ))}
                              </DialogContent>
                            </>
                          ) : (
                            <DialogContent id="modal-description">
                              Task not found.
                            </DialogContent>
                          )}
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
