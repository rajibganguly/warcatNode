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
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import StaticModel from "../components/StaticModel";
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import TableNew from "../components/TableNew";


import ApiConfig from '../config/ApiConfig'

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

const progressData = [
  {
    id: 1,
    percentage: 66,
    label: "Total Assigned",
    styles: {
      root: {},
      path: {
        stroke: `rgba(15, 156, 243, ${66 / 100})`,
        strokeLinecap: "butt",
        transition: "stroke-dashoffset 0.5s ease 0s",
        transform: "rotate(0.25turn)",
        transformOrigin: "center center",
        strokeWidth: 6,
      },
      text: {
        fill: "#000000",
        fontSize: "16px",
        fontWeight: "bold",
      },
      trail: {
        stroke: "#E5E0DF",
        strokeWidth: 6,
      },
    },
  },
  {
    id: 2,
    percentage: 45,
    label: "Not Initiated",
    styles: {
      root: {},
      path: {
        stroke: `rgba(255, 52, 0, ${66 / 100})`,
        strokeLinecap: "butt",
        transition: "stroke-dashoffset 0.5s ease 0s",
        transform: "rotate(0.25turn)",
        transformOrigin: "center center",
        strokeWidth: 6,
      },
      text: {
        fill: "#000000",
        fontSize: "16px",
        fontWeight: "bold",
      },
      trail: {
        stroke: "#E5E0DF",
        strokeWidth: 6,
      },
    },
  },
  {
    id: 3,
    percentage: 80,
    label: "In Progress",
    styles: {
      root: {},
      path: {
        stroke: `rgba(255, 195, 0, ${66 / 100})`,
        strokeLinecap: "butt",
        transition: "stroke-dashoffset 0.5s ease 0s",
        transform: "rotate(0.25turn)",
        transformOrigin: "center center",
        strokeWidth: 6,
      },
      text: {
        fill: "#000000",
        fontSize: "16px",
        fontWeight: "bold",
      },
      trail: {
        stroke: "#E5E0DF",
        strokeWidth: 6,
      },
    },
  },
  {
    id: 4,
    percentage: 80,
    label: "Completed",
    styles: {
      root: {},
      path: {
        stroke: `rgba(0, 255, 29, ${66 / 100})`,
        strokeLinecap: "butt",
        transition: "stroke-dashoffset 0.5s ease 0s",
        transform: "rotate(0.25turn)",
        transformOrigin: "center center",
        strokeWidth: 6,
      },
      text: {
        fill: "#000000",
        fontSize: "16px",
        fontWeight: "bold",
      },
      trail: {
        stroke: "#E5E0DF",
        strokeWidth: 6,
      },
    },
  },
];



export default function Tasks() {
  const [open, setOpen] = React.useState(true);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const localSt = JSON.parse(localStorage.getItem("user"));
  const currentRoleType = localSt.role_type;

 

  const column = [
    { text: 'Assigned Date', dataField: 'timestamp' },
    { text: "Assigned Title", dataField: 'task_title'},
    { text: "Department", dataField: 'department[0].dep_name' },
    { text: "Tag", dataField: 'department[0].tag' },
    { text: "Target Date", dataField: 'target_date'},
    { text: "Status", dataField: 'status' },
    { text: "Sub Task", dataField: 'department[0].sub_task'},
    { text: "Operations", dataField: '' },
    { text: "Varified Status", dataField: '' },
    { text: "Action", dataField: '' },
  ];
  const icons = {
    see: <EyeOutlined />,
    edit: <EditOutlined />,
    delete: <DeleteOutlined />,
  };

  React.useEffect(() => {

    fetchTasksData();
  }, []);

  /**
   * @description Private function for fetch Task data
   */
  const fetchTasksData = async () => {
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
      const tasksData = await ApiConfig.requestData('get', '/tasks', params, null);
      console.log(tasksData.tasks[0].department[0].dep_name)
      setData(tasksData.tasks);
      toast.dismiss("loading");
    } catch (error) {
      console.error("Error fetching Tasks data:", error);
      toast.dismiss("loading");
      toast.error("Failed to fetch Tasks data");
    }
  };



  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSeeClick = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleEditClick = (record) => {
    console.log("Edit clicked for:", record);
    // Implement logic for editing
  };

  const handleDeleteClick = (record) => {
    console.log("Delete clicked for:", record);
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
            <StaticModel visible={isModalVisible} onClose={handleCloseModal} />
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
                        {progressData.map((item) => (
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
                          handleSeeClick={handleSeeClick}
                          handleEditClick={handleEditClick}
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
