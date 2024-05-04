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
import { Link } from 'react-router-dom';
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton"; import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems, secondaryListItems } from "../components/listitems";
import LogoBlack from "../components/logoblack";
import ProfileSidePane from "../components/profileSidepane";
import MuiDrawer from "@mui/material/Drawer";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CustomTable from '../components/CustomTable';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";

import { Button } from "@mui/material";
//import SidePane from "../components/sidepane";
import { EyeOutlined, EditOutlined,PlusCircleOutlined } from '@ant-design/icons';


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

const Meetingdata = [
  {
    key: '1',
    meetingid: 'KCD0034',
    meetingtopic: 'Meeting 1',
    departments: '	Labour Department',
    tag: 'Secretary, Head of Office',
    date: '2024-03-07',
    time: '12:00 PM',
    attachments: 'meeting.jpeg',
    tasks: '',
    operation: ''

  },
  {
    key: '2',
    meetingid: 'KCD0034',
    meetingtopic: 'Meeting 1',
    departments: 'Forest Department, Agriculture & Fermers Department',
    tag: 'Secretary, Head of Office',
    date: '2024-03-07',
    time: '12:00 PM',
    attachments: 'meeting.jpeg',
    tasks: '',
    operation: ''

  },
  
];


export default function Meetings() {
  const [open, setOpen] = React.useState(true);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const navigate = useNavigate();

  const handleSeeClick = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };


  const handleplusClick = (record) => {
    console.log('Edit clicked for:', record);
    navigate('/add-tasks')
    // Implement logic for editing
  };
  const handleEditClick = (record) => {
    console.log('Edit clicked for:', record);
    navigate('/edit-meeting')
    // Implement logic for editing
  };


  const columns = [
    {
      title: '#Meeting Id',
      dataIndex: 'meetingid',
      key: 'meetingid',
     
      sorter: (a, b) => a.department.localeCompare(b.department),
      sortOrder: sortedInfo.columnKey === 'department' ? sortedInfo.order : null,
     
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    {
      title: 'Meeting Topic',
      dataIndex: 'meetingtopic',
      key: 'meetingtopic',
      sorter: (a, b) => a.secretary.localeCompare(b.secretary),
      sortOrder: sortedInfo.columnKey === 'secretary' ? sortedInfo.order : null,
     
    },
    {
      title: 'Departments',
      dataIndex: 'departments',
      key: 'departments',
      sorter: (a, b) => a.headofoffice.localeCompare(b.headofoffice),
      sortOrder: sortedInfo.columnKey === 'headofoffice' ? sortedInfo.order : null,
     
    },
   
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
      sorter: (a, b) => a.headofoffice.localeCompare(b.headofoffice),
      sortOrder: sortedInfo.columnKey === 'headofoffice' ? sortedInfo.order : null,
     
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => a.headofoffice.localeCompare(b.headofoffice),
      sortOrder: sortedInfo.columnKey === 'headofoffice' ? sortedInfo.order : null,
     
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      sorter: (a, b) => a.headofoffice.localeCompare(b.headofoffice),
      sortOrder: sortedInfo.columnKey === 'headofoffice' ? sortedInfo.order : null,
     
    },
    {
      title: 'Attachments',
      dataIndex: 'attachments',
      key: 'attachments',
      sorter: (a, b) => a.headofoffice.localeCompare(b.headofoffice),
      sortOrder: sortedInfo.columnKey === 'headofoffice' ? sortedInfo.order : null,
     
    },


    {
      title: 'Tasks',
      key: 'tasks',
      render: (text, record) => (
        <>

          <div className="d-flex justify-content-center" style={{ backgroundColor: 'transparent', width: 'fit-content' }}>
          <Button type="primary" onClick={() => handleplusClick(record)} style={{ padding: '6px', margin: '1px', minWidth: '40px', width: 'auto !important', backgroundColor: '#0a1832', color: '#fff' }}>
              <PlusCircleOutlined />
            </Button>
            <Button type="primary" onClick={() => handleSeeClick(record)} style={{ padding: '6px', margin: '1px', minWidth: '40px', width: 'auto !important', backgroundColor: '#fb4', color: '#fff' }}>
              <EyeOutlined />
            </Button>
           
           
          </div>

        </>
      ),
    },
    {
      title: 'Operation',
      key: 'operation',
      render: (text, record) => (
        <>

          <div className="d-flex justify-content-center" style={{ backgroundColor: 'transparent', width: 'fit-content' }}>
          <Button type="primary" onClick={() => handleEditClick(record)} style={{ padding: '6px', margin: '1px', minWidth: '40px', width: 'auto !important', backgroundColor: '#0097a7', color: '#fff' }}>
              <EditOutlined />
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

  // const profilePic = "../assets/user/user1.png"



  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Header props={open} onOutput={handleOutput} />
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              background: "#505d69",
              px: [1],
            }}
          >
            <LogoBlack />
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon sx={{ color: "white" }} />
            </IconButton>
          </Toolbar>
          <Divider />
          <Box
            sx={{
              p: 2,
              textAlign: 'center'
            }}
          >
            <ProfileSidePane isopen={open} />
          </Box>
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
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
                        <Button variant="contained" sx={{
                          backgroundColor: 'green',
                          '&:hover': {
                            backgroundColor: 'darkgreen',
                          },

                        }} component={Link} to="/add-new-meetings">
                          Add New Meetings
                        </Button>
                      </Box>
                      <CardContent>
                        <CustomTable
                          data={Meetingdata}
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
