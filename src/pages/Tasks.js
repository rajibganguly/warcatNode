import * as React from "react";
import { useState } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";
import Dropdowns from "../components/Dropdowns";
import Stack from "@mui/material/Stack";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import IconButton from "@mui/material/IconButton";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import { CloseOutlined } from '@mui/icons-material';
import TableNew from "../components/TableNew";
import { TextField, Dialog, DialogContent, DialogContentText } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import ApiConfig from '../config/ApiConfig'

import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { TaskChartData } from '../constant/taskChartData';
import { useNavigate } from "react-router-dom";


const drawerWidth = 240;
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

const dropdownData = [
  {
    label: "Select",
    items: [
      { label: "All Department", value: "All Department" },
      { label: "Agriculture", value: "Agriculture" },
      { label: "Forest", value: "Forest" },
      { label: "Labour", value: "Labour" },
    ],
  },
  {
    label: "Select",
    items: [
      { label: "ALL Tasks", value: "ALL Tasks" },
      { label: "Assigned", value: "Assigned" },
      { label: "In Progress", value: "In Progress" },
      { label: "Completed", value: "Completed" },
    ],
  },
];
const handleDropdownChange = (value) => {
  console.log("Selected value:", value);
};

const progressData = TaskChartData;



export default function Tasks() {
  const [open, setOpen] = React.useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [data, setData] = useState([]);
  const localSt = JSON.parse(localStorage.getItem("user"));
  const currentRoleType = localSt.role_type;
  const [file, setFile] = useState();
  const [chartData, setChartData] = useState(progressData);
  const navigate = useNavigate();

  const column = [
    { text: 'Assigned Date', dataField: 'timestamp' },
    { text: "Assigned Title", dataField: 'task_title' },
    { text: "Department", dataField: 'department[0].dep_name' },
    { text: "Tag", dataField: 'department[0].tag' },
    { text: "Target Date", dataField: 'target_date' },
    { text: "Status", dataField: 'status' },
    { text: "Sub Task", dataField: 'subtask' },
    { text: "Operations", dataField: 'taskoperation' },
    { text: "Varified Status", dataField: '' },
    { text: "Action", dataField: 'action' },
  ];
  const icons = {
    see: <EyeOutlined />,
    edit: <EditOutlined />,
    delete: <DeleteOutlined />,
  };

  React.useEffect(() => {
    fetchTasksChart()
    fetchTasksData();
  }, []);

  /**
   * @description Private function for fetch Task data
   */
  const fetchTasksData = async () => {
    if (!toast.isActive("loading")) {
      toast.loading("Loading Tasks data...", { autoClose: false, toastId: "loading" });
    }
    const localData = localStorage.getItem("user");
    const userObj = JSON.parse(localData)
    try {
      const localObj = { userId: userObj._id, role_type: userObj.role_type };

      const params = {
        userId: localObj.userId,
        role_type: localObj.role_type
      };
      const tasksData = await ApiConfig.requestData('get', '/tasks', params, null);
      setData(tasksData.tasks);
      toast.dismiss("loading");
    } catch (error) {
      console.error("Error fetching Tasks data:", error);
      toast.dismiss("loading");
      toast.error("Failed to fetch Tasks data");
    }
  };

  /**
   * @description Private function for fetch Task Chart
   */
  const fetchTasksChart = async () => {
    if (!toast.isActive("loading")) {
      toast.loading("Loading Tasks Chart data...", { autoClose: false, toastId: "loading" });
    }
    const localData = localStorage.getItem("user");
    const userObj = JSON.parse(localData)
    try {
      const localObj = { userId: userObj._id, role_type: userObj.role_type };

      const params = {
        userId: localObj.userId,
        role_type: localObj.role_type
      };
      const tasksChartData = await ApiConfig.requestData('get', '/task-status-percentages', params, null);
      const updateTaskCahrtValues = chartData;
      if (updateTaskCahrtValues[0]['label'] === 'Total Assigned') {
        updateTaskCahrtValues[0].percentage = tasksChartData.totalAssigned
      }
      if (updateTaskCahrtValues[1]['label'] === 'Not Initiated') {
        updateTaskCahrtValues[1].percentage = tasksChartData.initiated.percentage
      }
      if (updateTaskCahrtValues[2]['label'] === 'In Progress') {
        updateTaskCahrtValues[2].percentage = tasksChartData.inProgress.percentage
      }
      if (updateTaskCahrtValues[3]['label'] === 'Completed') {
        updateTaskCahrtValues[3].percentage = tasksChartData.completed.percentage
      }
      setChartData(updateTaskCahrtValues)
      //setData(tasksData.tasks);
      toast.dismiss("loading");
    } catch (error) {
      console.error("Error fetching Tasks Chart data:", error);
      toast.dismiss("loading");
      toast.error("Failed to fetch Tasks data");
    }
  };



  const handleViewOperationTask = (row) => {
    // setModalContent(row);
    // setModalVisible(true);
  };

  const handleEditOperationTask = (row) => {
     const encodedTaskId = window.btoa(row?.task_id);
     navigate(`/edit-tasks?taskId=${encodeURIComponent(encodedTaskId)}`);

  };

  const closeModal1 = () => {
    setModalVisible1(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
  };


  const handleAddNoteClick = (record) => {
    console.info("Edit clicked for:", record);
    navigate('/task-note')
    // Implement logic for editing
  };

  const handleUploadClick = (record) => {
    console.info("Edit clicked for:", record);
    navigate('/task-upload')
    // Implement logic for editing
  };

  const handleAddSubTaskClick = (record) => {
    console.info("Edit clicked for:", record);
    // Implement logic for editing
  };

  const handleViewSubTask = (record) => {
    console.info("Delete clicked for:", record);
    // Implement logic for deleting
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
                    All Tasks
                  </div>
                  <div>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="/">
                        WARCAT
                      </Link>
                      <Typography color="text.primary">Tasks</Typography>
                    </Breadcrumbs>
                  </div>
                </div>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Card sx={{ maxWidth: 100 + "%" }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 2,
                          borderBottom: "1px solid #eff2f7",
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            All Tasks
                          </Typography>
                          {currentRoleType === "admin" && (
                            <Button
                              variant="contained"
                              sx={{
                                bgcolor: "#6fd088",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "#5eb174",
                                },
                              }}
                              component={Link}
                              to="/add-tasks"
                            >
                              Add Task
                            </Button>)}
                          {currentRoleType === "admin" && (
                            <Button
                              variant="contained"
                              sx={{
                                bgcolor: "#6fd088",
                                color: "white",
                                "&:hover": {
                                  bgcolor: "#5eb174",
                                },
                              }}
                              component={Link}
                              to="/tasks-list"
                            >
                              Task list
                            </Button>
                          )}
                        </Stack>

                        <Dropdowns
                          dropdownData={dropdownData}
                          onChange={handleDropdownChange}
                        />
                      </Box>

                      <Grid container spacing={2} sx={{ py: 3, px: 2 }}>
                        {chartData.map((item) => (
                          <Grid item xs={3} key={item.id}>
                            <Card sx={{ maxWidth: "100%" }}>
                              <Card sx={{ maxWidth: "100%", p: 2 }}>
                                <CardContent
                                  sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <div style={{ width: 130, height: 130 }}>
                                    <CircularProgressbar
                                      value={item.percentage}
                                      text={`${item.percentage}%`}
                                      styles={item.styles}
                                    />
                                  </div>
                                </CardContent>
                                <span
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    fontWeight: "bolder",
                                  }}
                                >
                                  {item.label}
                                </span>
                              </Card>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                      <CardContent>
                        <TableNew
                          data={data}
                          column={column}
                          icons={icons}
                          tableHeading={'Task list'}
                          handleAddSubTaskClick={handleAddSubTaskClick}
                          handleViewSubTask={handleViewSubTask}
                          handleViewOperationTask={handleViewOperationTask}
                          handleEditOperationTask={handleEditOperationTask}
                          handleAddNoteClick={handleAddNoteClick}
                          handleUploadClick={handleUploadClick}
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
                                  <CardContent>
                                    <Typography variant="h5" color="text.secondary">
                                      Subtask
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {modalContent.task_title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Target Date:  {modalContent.target_date}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Attachment.png
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

                        <Dialog
                          open={modalVisible1}
                          onClose={closeModal1}
                          aria-labelledby="modal-title"
                          aria-describedby="modal-description"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <DialogContent sx={{ p: 2, width: '600px' }}>
                            <DialogContentText id="modal-description">
                              <Typography variant="h4" id="modal-title">
                                Task Title: Website Issue
                              </Typography>
                              <Card sx={{ width: '100%', maxWidth: 900, maxHeight: 600, overflowY: 'auto' }}>
                                <IconButton
                                  aria-label="close"
                                  onClick={closeModal1}
                                  sx={{ position: 'absolute', right: '5px', top: '0', color: 'gray' }}
                                >
                                  <CloseOutlined />
                                </IconButton>
                                <CardContent>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                      <TextField
                                        id="outlined-basic"
                                        name="subtasktitle"
                                        label="Enter Subtask Title"
                                        variant="outlined"
                                        fullWidth
                                        value={null}
                                        onChange={null}
                                      />
                                    </Grid>

                                    <Grid item xs={12}>
                                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DemoContainer
                                          components={['DatePicker', 'TimePicker']}
                                        >
                                          <Grid item xs={4}>
                                            <DemoItem label="">
                                              <DatePicker
                                                value={null}
                                                onChange={null}
                                              />
                                            </DemoItem>
                                          </Grid>



                                          <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Button
                                              component="label"
                                              variant="contained"
                                              startIcon={<CloudUploadIcon />}
                                              sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                                            >
                                              Upload file
                                              <VisuallyHiddenInput
                                                type="file"
                                                onChange={(e) => setFile(e.target.files[0])}
                                              />
                                            </Button>
                                          </Grid>
                                        </DemoContainer>
                                      </LocalizationProvider>
                                    </Grid>
                                  </Grid>

                                </CardContent>
                                <CardActions sx={{ justifyContent: 'flex-start' }}>
                                  <Button size="small" variant="contained" color="primary" >
                                    Enter Subtask Title
                                  </Button>

                                </CardActions>
                              </Card>
                            </DialogContentText>
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