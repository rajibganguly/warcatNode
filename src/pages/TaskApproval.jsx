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
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import report from '../assets/Screenshot_2024-05-19_171305.png';
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import TableNew from "../components/TableNew";
import { TaskContext } from "../context/TaskContext.js";
import { fetchDepartmentData, fetchTaskData, formatPercentage, mapKeysToValues } from '../pages/common.js'
import { DepartmentContext } from "../context/DepartmentContext.js";
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
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    city: 'delhi',
    description: 'Response Rate --',

  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    city: 'delhi',
    description: 'Response Rate --',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    city: 'delhi',
    description: 'Response Rate --',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
    city: 'delhi',
    description: 'Response Rate --',
  },
];

export default function TaskApproval() {
  const [open, setOpen] = React.useState(true);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const { allTaskLists } = React.useContext(TaskContext);
  const allTaskListsData = allTaskLists?.tasks;
  const { setAllTaskLists } = React.useContext(TaskContext);
  const { setAllDepartmentList } = React.useContext(DepartmentContext);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // const [modalVisible, setModalVisible] = React.useState(false);
  // const [selectedRecord, setSelectedRecord] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const setAllTaskListsData = await fetchTaskData();
        setAllTaskLists(setAllTaskListsData);
        const fetchDepdata = await fetchDepartmentData();
        setAllDepartmentList(fetchDepdata);
      } catch (error) {
        console.error('Error fetching task data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  
  }, []);

  


  const column = [
    { text: 'Assigned Date', dataField: 'timestamp' },
    { text: "Assigned Title", dataField: 'tasks_title' },
    { text: "Department", dataField: 'tasks_dept' },
    { text: "Tag", dataField: 'tasks_tag' },
    { text: "Target Date", dataField: 'target_date' },
    { text: "Status", dataField: 'status' },
    // { text: "Sub Task", dataField: 'subtask' },
    // { text: "Operations", dataField: 'taskoperation' }
  ];

  let filteredData = allTaskListsData; // 10

  console.log(filteredData);
  // department filter
  if(selectedDept){
    if(selectedDept === 'ALL'){
      if(selectedStatus === 'ALL' || selectedStatus === ''){
        filteredData = allTaskListsData;
      }else{
        filteredData = filteredData.filter(task => task.status === selectedStatus);
      }
    }else{
      filteredData = filteredData.filter(task => task.department?.[0]?.dep_id === selectedDept);
    }
  }
  // status filter
  if(selectedStatus){
    if(selectedStatus === 'ALL'){
      if(selectedDept === 'ALL' || selectedDept === ''){
        filteredData = allTaskListsData;
      }else{
        filteredData = filteredData.filter(task => task.department?.[0]?.dep_id === selectedDept);
      }
    }else{
      filteredData = filteredData.filter(task => task.status === selectedStatus);
    }
  }
  // search box filter
  const matchesSearchText = (obj, searchText) => {
    if (Array.isArray(obj)) {
      return obj.some(item => matchesSearchText(item, searchText));
    }
    if (typeof obj === 'object' && obj !== null) {
      return Object.values(obj).some(value => matchesSearchText(value, searchText));
    }
    return typeof obj === 'string' && obj.toLowerCase().includes(searchText.toLowerCase());
  };
  if (searchText) {
    filteredData = filteredData.filter(task => matchesSearchText(task, searchText));
  }

  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }


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
                    All Reports
                  </div>
                  <div>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="/">
                        WARCAT
                      </Link>
                      <Typography color="text.primary">Reports</Typography>
                    </Breadcrumbs>
                  </div>
                </div>
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      paddingLeft: "15px",
                      paddingBottom: "15px",
                      borderBottom: "1px solid #eee",
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>Departments wise report</div>
                  </div>
                  <hr />
                  <Box sx={{ width: "100%" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                      >
                        <Tab label="Provisional" {...a11yProps(0)} />
                        <Tab label="Disapproved" {...a11yProps(1)} />
                        <Tab label="Approved" {...a11yProps(2)} />

                      </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                      <TableNew
                        data={filteredData}
                        column={column}
                        icons={null}
                        exportButton={true}
                        searchBar={true}
                        tableHeading={'Tasks list'}
                        handleAddSubTaskClick={null}
                        handleViewSubTask={null}
                        handleViewParentOperationTask={null}
                        handleEditOperationTask={null}
                        // handleEditOperationTaskNew={handleEditOperationTaskNew}
                        handleAddNoteClick={null}
                        handleUploadClick={null}
                        handleAcceptRejectClick={null}
                        setSearchText={setSearchText}
                      />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                      Disapproved Table
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                      Approved Table
                    </CustomTabPanel>

                  </Box>


                </Paper>
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
