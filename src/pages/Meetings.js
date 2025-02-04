import * as React from "react";
import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  styled,
  Button,
  Toolbar,
  Container,
  Typography,
  createTheme,
  CssBaseline,
  Breadcrumbs,
  CardContent,
  ThemeProvider,
} from "@mui/material";
import { toast } from "react-toastify";
import { Link } from 'react-router-dom';
import Footer from "../components/Footer";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import MuiAppBar from "@mui/material/AppBar";
import TableNew from "../components/TableNew";
import { useNavigate } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import TaskViewDialog from "../dialog/TaskViewDialog";
import { MeetingContext } from './../context/MeetingContext'
import { fetchDepartmentData, fetchMeetingData, fetchTaskData } from "./common";
import LoadingIndicator from "../components/loadingIndicator";
import { DepartmentContext } from "../context/DepartmentContext";






const userType = JSON.parse(localStorage.getItem("user"))?.role_type;
const column = [
  { text: 'Meeting Id', dataField: 'meetingId' },
  { text: 'Meeting Topic', dataField: 'meetingTopic' },
  {
    text: 'Departments',
    dataField: 'departmentNames',
    formatter: (cellContent, row) => {
      if (Array.isArray(cellContent)) {
        const departmentNames = cellContent.map(department => department.department_name);
        return departmentNames.filter(Boolean).join(', ');
      } else {
        return cellContent;
      }
    },
  },

  { text: 'Tag', dataField: 'meeting_tag' },
  { text: 'Date', dataField: 'selectDate' },
  { text: 'Time', dataField: 'selectTime' },
  { text: 'Attachment', dataField: 'imageUrl' },
  { text: 'Tasks', dataField: 'tasks' },
];
if (userType === 'admin') {
  column.push({ text: 'Operation', dataField: 'meetingoperation' });
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

export default function Meetings() {
  const [open, setOpen] = React.useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [taskDataView, setTaskDataView] = useState([]);
  const [meetingData, setMeetingData] = useState([]);
  const navigate = useNavigate();
  const { setAllMeetingLists } = React.useContext(MeetingContext);
  const { setAllTaskLists } = React.useContext(TaskContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const { setAllDepartmentList } = React.useContext(DepartmentContext);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const fetchMeetingsData = await fetchMeetingData();
      setAllMeetingLists(fetchMeetingsData);
      const setAllTaskListsData = await fetchTaskData();
      setAllTaskLists(setAllTaskListsData)
      const fetchDepdata = await fetchDepartmentData();
      setAllDepartmentList(fetchDepdata);
      setIsLoading(false)
      // console.log(fetchDepdata)
    };
    fetchData();
  }, []);
  const closeModal = () => {
    setModalVisible(false);
    setTaskDataView([]);
  };

  const localUser = JSON.parse(localStorage.getItem('user'));
  const currentRoleType = localUser.role_type;
  const { allMeetingLists } = React.useContext(MeetingContext);
  const allmeetingData = allMeetingLists?.meetings;
  const { allTaskLists } = React.useContext(TaskContext);
  const allTaskListsData = allTaskLists?.tasks;

  // const VisuallyHiddenInput = styled('input')({
  //   clip: 'rect(0 0 0 0)',
  //   clipPath: 'inset(50%)',
  //   height: 1,
  //   overflow: 'hidden',
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   whiteSpace: 'nowrap',
  //   width: 1,
  // });

  const handleTasksAddInMeeting = (record) => {
    const encodedMeetingId = window.btoa(record?.meetingId);
    const encodedMeetingTopic = window.btoa(record?.meetingTopic);
    navigate(`/add-tasks?meetingId=${encodeURIComponent(encodedMeetingId)}&meetingTopic=${encodeURIComponent(encodedMeetingTopic)}`);
  };

  const handleEditmeeting = (row) => {
    // Check if row and row.meetings are defined
    if (row && row.meetingId) {
      const encodededitMeetingId = window.btoa(row?.meetingId);
      navigate(`/edit-meeting?meetingId=${encodeURIComponent(encodededitMeetingId)}`);
    } else {
      console.error('Invalid row data:', row);
    }
  };

  const findMeetingRows = (meetingId) => {
    return allTaskListsData?.filter(row => row.meetingId && row.meetingId === meetingId);
  };

  const handleTasksViewInMeeting = (data) => {
    toast.dismiss();
    const meetingRows = findMeetingRows(data?.meetingId);

    setTaskDataView(meetingRows);

    if (meetingRows && meetingRows?.length > 0) {
      setMeetingData(data);
      setModalVisible(true);

    } else {
      toast.warning("Task not found.", {
        autoClose: 2000,
      });
    }
  };

  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <LoadingIndicator isLoading={isLoading} />
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
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
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
                          pageName="meeting"
                        />
                        {/* Task view dialog */}
                        <TaskViewDialog
                          open={modalVisible}
                          onClose={closeModal}
                          taskDataView={taskDataView}
                          meetingData={meetingData}
                        />
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
