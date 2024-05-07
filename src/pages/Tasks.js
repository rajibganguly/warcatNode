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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dropdowns from '../components/Dropdowns';
import Stack from '@mui/material/Stack';
import ButtonGroup from '@mui/material/ButtonGroup';
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton"; import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "../components/listitems";
import LogoBlack from "../components/logoblack";
import ProfileSidePane from "../components/profileSidepane";
import MuiDrawer from "@mui/material/Drawer";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Reporttable from '../components/Reporttable';
import { EyeOutlined, PlusCircleOutlined } from '@ant-design/icons';
import StaticModel from "../components/StaticModel";
import Sidebar from "../components/Sidebar";


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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const dropdownData = [
  {
    label: 'Select',
    items: [
      { label: 'All Department', value: "All Department" },
      { label: 'Agriculture', value: "Agriculture" },
      { label: 'Forest', value: "Forest" },
      { label: 'Labour', value: "Labour" },
    ],
  },
  {
    label: 'Select',
    items: [
      { label: 'ALL Tasks', value: 'ALL Tasks' },
      { label: 'Assigned', value: 'Assigned' },
      { label: 'In Progress', value: 'In Progress' },
      { label: 'Completed', value: 'Completed' },
    ],
  },
];
const handleDropdownChange = (value) => {
  console.log('Selected value:', value);

};


const progressData = [
  {
    id: 1, percentage: 66, label: "Total Assigned",
    styles: {
      root: {},
      path: {
        stroke: `rgba(15, 156, 243, ${66 / 100})`,
        strokeLinecap: 'butt',
        transition: 'stroke-dashoffset 0.5s ease 0s',
        transform: 'rotate(0.25turn)',
        transformOrigin: 'center center',
        strokeWidth: 6,
      },
      text: {
        fill: "#000000",
        fontSize: "16px",
        fontWeight: "bold"
      },
      trail: {
        stroke: '#E5E0DF',
        strokeWidth: 6,
      },
    },
  },
  {
    id: 2, percentage: 45, label: "Not Initiated",
    styles: {
      root: {},
      path: {
        stroke: `rgba(255, 52, 0, ${66 / 100})`,
        strokeLinecap: 'butt',
        transition: 'stroke-dashoffset 0.5s ease 0s',
        transform: 'rotate(0.25turn)',
        transformOrigin: 'center center',
        strokeWidth: 6,
      },
      text: {
        fill: "#000000",
        fontSize: "16px",
        fontWeight: "bold"
      },
      trail: {
        stroke: '#E5E0DF',
        strokeWidth: 6,
      },
    },
  },
  {
    id: 3, percentage: 80, label: "In Progress",
    styles: {
      root: {},
      path: {
        stroke: `rgba(255, 195, 0, ${66 / 100})`,
        strokeLinecap: 'butt',
        transition: 'stroke-dashoffset 0.5s ease 0s',
        transform: 'rotate(0.25turn)',
        transformOrigin: 'center center',
        strokeWidth: 6,
      },
      text: {
        fill: "#000000",
        fontSize: "16px",
        fontWeight: "bold"
      },
      trail: {
        stroke: '#E5E0DF',
        strokeWidth: 6,
      },
    },
  },
  {
    id: 4, percentage: 80, label: "Completed",
    styles: {
      root: {},
      path: {
        stroke: `rgba(0, 255, 29, ${66 / 100})`,
        strokeLinecap: 'butt',
        transition: 'stroke-dashoffset 0.5s ease 0s',
        transform: 'rotate(0.25turn)',
        transformOrigin: 'center center',
        strokeWidth: 6,
      },
      text: {
        fill: "#000000",
        fontSize: "16px",
        fontWeight: "bold"
      },
      trail: {
        stroke: '#E5E0DF',
        strokeWidth: 6,
      },
    },
  },
];

const data = [
  {
    key: '1',
    assigneddate: '01 Feb, 2024',
    tasktitle: 'Website Issue 5',
    department: 'Forest Department',
    tag: 'Secretary',
    targetdate: '21 Mar, 2024',
    status: 'Assigned',
    description: 'Response Rate --',
  },
  {
    key: '2',
    assigneddate: '01 Feb, 2024',
    tasktitle: 'Website Issue 5',
    department: 'Forest Department',
    tag: 'Secretary,Head of Office',
    targetdate: '30 Mar, 2024',
    status: 'In Progress',
  }
];

export default function Tasks() {
  const [open, setOpen] = React.useState(true);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    console.log('Edit clicked for:', record);
    // Implement logic for editing
  };

  const handleDeleteClick = (record) => {
    console.log('Delete clicked for:', record);
    // Implement logic for deleting
  };

  const columns = [
    {
      title: 'Assigned Date',
      dataIndex: 'assigneddate',
      key: 'assigneddate',
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      
    },
    {
      title: 'Task Title',
      dataIndex: 'tasktitle',
      key: 'tasktitle',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
      
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filteredInfo.city || null,
      onFilter: (value, record) => record.city.includes(value),
      sorter: (a, b) => a.city.length - b.city.length,
      sortOrder: sortedInfo.columnKey === 'city' ? sortedInfo.order : null,
      
    },

    {
      title: 'Target Date',
      dataIndex: 'targetdate',
      key: 'targetdate',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filteredInfo.city || null,
      onFilter: (value, record) => record.city.includes(value),
      sorter: (a, b) => a.city.length - b.city.length,
      sortOrder: sortedInfo.columnKey === 'city' ? sortedInfo.order : null,
      
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filteredInfo.city || null,
      onFilter: (value, record) => record.city.includes(value),
      sorter: (a, b) => a.city.length - b.city.length,
      sortOrder: sortedInfo.columnKey === 'city' ? sortedInfo.order : null,
      
    },
    {
      title: 'Sub Task',
      key: 'subtask',
      render: (text, record) => (
        <>

          <div style={{ backgroundColor: 'transparent', width: 'fit-content', display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" onClick={handleOpenModal} style={{ padding: '6px', margin: '1px', minWidth: '40px', width: 'auto !important', backgroundColor: '#6fd088', color: '#fff' }}>
              <PlusCircleOutlined />
            </Button>
            
            <Button type="primary" onClick={() => handleSeeClick(record)} style={{ padding: '6px', margin: '1px', minWidth: '40px', width: 'auto !important', backgroundColor: '#fb4', color: '#fff' }}>
              <EyeOutlined />
            </Button>
           
           
          </div>

        </>
      ),
    },
  ];

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
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: 2,
                          borderBottom: '1px solid #eff2f7',

                        }}
                      >
                        <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', alignItems: 'center' }}>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>All Tasks</Typography>
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: '#6fd088',
                              color: 'white',
                              '&:hover': {
                                bgcolor: '#5eb174',
                              },
                            }}
                            component={Link} to="/add-tasks"
                          >
                            Add Task
                          </Button>
                        </Stack>



                        <Dropdowns dropdownData={dropdownData} onChange={handleDropdownChange} />
                      </Box>

                      <Grid container spacing={2} sx={{ py: 3, px: 2 }} >
                        {progressData.map((item) => (
                          <Grid item xs={3} key={item.id}>
                            <Card sx={{ maxWidth: '100%' }} >
                              <Card sx={{ maxWidth: '100%', p: 2 }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
                                  <div style={{ width: 130, height: 130 }}>
                                    <CircularProgressbar value={item.percentage} text={`${item.percentage}%`} styles={item.styles} />
                                  </div>

                                </CardContent>
                                <span style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bolder' }}>{item.label}</span>
                              </Card>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
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
                        <TextField id="outlined-basic"
                          label="Search"
                          size="small" variant="outlined" />
                      </Box>
                      <CardContent>
                        <Reporttable
                          data={data}
                          columns={columns}
                          filteredInfo={filteredInfo}
                          sortedInfo={sortedInfo}
                          setFilteredInfo={setFilteredInfo}
                          setSortedInfo={setSortedInfo}
                          modalVisible={modalVisible}
                          setModalVisible={setModalVisible}
                          selectedRecord={selectedRecord}
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
