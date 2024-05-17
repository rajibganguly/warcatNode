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
import ApiConfig from "../config/ApiConfig";
import { Button } from "@mui/material";
import TableNew from "../components/TableNew";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { CardActions } from '@mui/material';
import { Dialog, DialogContent, DialogContentText } from "@mui/material";
import { CloseOutlined } from '@mui/icons-material';
import IconButton from "@mui/material/IconButton";

const column = [
  { text: '#Meeting Id', dataField: 'meetingId' },
  { text: 'Meeting Topic', dataField: 'meetingTopic' },
  { text: 'Departments', dataField: 'departmentNames' },
  { text: 'Tag', dataField: 'tag' },
  { text: 'Date', dataField: 'selectDate' },
  { text: 'Time', dataField: 'selectTime' },
  { text: 'Attachment', dataField: 'imageUrl' },
  { text: 'Tasks', dataField: 'taskicon' },
  { text: 'Operation', dataField: 'operationicon' },
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
  const [modalContent, setModalContent] = useState(null);
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

  const handleSeeTask = (row) => {
    setModalContent(row);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
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
            <Grid container spacing={3} style={{ height: "560px", overflowY: "scroll", overflowX: "hidden" }}>
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
                          data={data}
                          column={column}
                          handleSeeTask={handleSeeTask}

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
                                  Meeting Name:
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
                                      Tasks
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Tasks
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      10 Feb 2024
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Website Issue
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Forest Department (Dr. Avinash Kanfade IFS)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Target Date: 30 Mar 2024
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      attachment.png
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Assigned
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      19 Feb 2024
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Website Issue 2
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Forest Department (Dr. Avinash Kanfade IFS)
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Target Date: 21 Mar 2024
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      attachment.png
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
