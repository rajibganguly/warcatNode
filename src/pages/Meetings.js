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
//import axiosInstance from "../apiConfig/axoisSetup";
import ApiConfig from "../config/ApiConfig";
import { Button } from "@mui/material";
import { EyeOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import TableNew from "../components/TableNew";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";




const column = [
  { text: '#Meeting Id', dataField: 'meetingId' },
  { text: 'Meeting Topic', dataField: 'meetingTopic' },
  { text: 'Departments', dataField: 'departmentNames' },
  { text: 'Tag', dataField: 'tag' },
  { text: 'Date', dataField: 'selectDate' },
  { text: 'Time', dataField: 'selectTime' },
  { text: 'Attachment', dataField: 'imageUrl' },
  { text: 'Tasks', dataField: '' },
  { text: 'Operation', dataField: '' },


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
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const localUser = JSON.parse(localStorage.getItem('user'));
  const currentRoleType = localUser.role_type;

  useEffect(() => {
    fetchMeetingData();
  }, []);

  /**
   * @description Private function for fetch Meeting data
   */
  const fetchMeetingData = async () => {
    if (!toast.isActive("loading")) {
        toast.loading("Loading meetings data...", { autoClose: false, toastId: "loading" });
      }
    const localData = localStorage.getItem("user");
    const userObj = JSON.parse(localData)    
    try {
      const localObj = { userId: userObj._id, role_type: userObj.role_type }; 
      
      const params = {
        userId: localObj.userId,
        role_type: localObj.role_type
      };
      const meetingData = await ApiConfig.requestData('get', '/meetings', params, null);
      setData(meetingData.meetings);
      toast.dismiss("loading");
    } catch (error) {
      console.error("Error fetching meeting data:", error);
      toast.dismiss("loading");
      toast.error("Failed to fetch meeting data");
    }    
  };



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
            <Grid container spacing={3} style={{height: "560px", overflowY: "scroll", overflowX: "hidden"}}>
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
                        { currentRoleType === 'admin' && (<Button variant="contained" sx={{
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
                          data={data}
                          column={column}

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
