import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import { getItem } from '../config/storage';
import { useAuth } from '../providers/AuthProvider';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Sidebar from "../components/Sidebar";
import { toast } from "react-toastify";
import ApiConfig from "../config/ApiConfig";
import { BarChart } from '@mui/x-charts/BarChart';
import { fetchDepartmentData, fetchMeetingData, fetchTaskData } from "./common";
import { DepartmentContext } from "../context/DepartmentContext";
import { MeetingContext } from "../context/MeetingContext";
import { TaskContext } from "../context/TaskContext";
import LoadingIndicator from "../components/loadingIndicator";


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



export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [currUser, setCurrUser] = React.useState({});
  const [statistics, setStatistics] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const { setAllDepartmentList } = React.useContext(DepartmentContext);
  const { setAllMeetingLists } = React.useContext(MeetingContext);
  const { setAllTaskLists } = React.useContext(TaskContext);
  const [cardDataState, setCardDataState] = React.useState([
    { id: 1, title: 'Total Department', value: 5, icon: <AccountBalanceIcon /> },
    { id: 2, title: 'Completed Tasks', value: 1, icon: <PeopleIcon /> },
    { id: 3, title: 'Total Meeting', value: 3, icon: <MonetizationOnIcon /> },
    { id: 4, title: 'Assigned Task', value: 0, icon: <MonetizationOnIcon /> },
  ]);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      const fetchDepdata = await fetchDepartmentData();
      setAllDepartmentList(fetchDepdata);
      const fetchMeetingsData = await fetchMeetingData();
      setAllMeetingLists(fetchMeetingsData);
      const setAllTaskListsData = await fetchTaskData();
      setAllTaskLists(setAllTaskListsData)
      setIsLoading(false)
    };
    fetchData();
  }, []);


  const token = useAuth()
  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    // Local stored data
    setUpMyLocalUserData().then((result) => {
      const userSetUp = result;
      fetchDashboardData(userSetUp._id, userSetUp.role_type, token.authToken);


    });

  }, []);


  /**
   * @description Private function for fetch Dashboard data
   */
  const setUpMyLocalUserData = async () => {
    const localData = getItem("user");
    if (localData !== null) {
      setCurrUser(localData);
      return localData
    }
  }

  /**
   * @description Private function for fetch Dashboard data
  */
  const fetchDashboardData = async (usId, type, authTokenId) => {
    //  if (!toast.isActive("loading")) {
    //    toast.loading("Loading dashbaord data...", { autoClose: false, toastId: "loading" });
    //   }  

    const reactAppHostname = process.env.REACT_APP_HOSTNAME;
    const response = await fetch(`${reactAppHostname}/api/statistics?userId=${usId}&role_type=${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + authTokenId
      }
    });
    try {
      if (response.status === 200) {
        if (response.ok && response.body) {
          const resData = await response.json();
          if (resData) {
            cardDataChart(resData)
          }
          setStatistics(resData);

          //toast.dismiss("loading");
        } else {
          toast.error(`API response error: ${response.status}`, { autoClose: 2000 });
        }

      } else {
        // toast.error(`Login Failed! ${response.message}`, {
        //   autoClose: 2000,
        // });
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  };


  /**
   * @description Setup Chat card data for following summary
  */
  const cardDataChart = async (data) => {
    const updatedCardData = cardDataState.map((card) => {
      switch (card.title) {
        case 'Total Department':
          return { ...card, value: data.totalDepartments };
        case 'Completed Tasks':
          return { ...card, value: data.completedTasks };
        case 'Total Meeting':
          return { ...card, value: data.totalMeetings };
        case 'Assigned Task':
          return { ...card, value: data.assignedTasks };
        default:
          return card;
      }
    });
    setCardDataState(updatedCardData);
  };

  return (
    <>
      {/* For Loader */}
      <LoadingIndicator isLoading={isLoading} />
      {/*  */}
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
                <Grid item xs={12} md={12} lg={12}>
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
                      Dashboard
                    </div>
                    <div>
                      <Breadcrumbs aria-label="breadcrumb">
                        <Link underline="hover" color="inherit" href="/">
                          WARCAT
                        </Link>
                        <Typography color="text.primary">Dashboard</Typography>
                      </Breadcrumbs>
                    </div>
                  </div>
                </Grid>
              </Grid>


              <Grid container spacing={2} >
                {cardDataState.map((cardItems, index) => (
                  <Grid item xs={12} sm={3} key={cardItems.id}>
                    <Card sx={{ maxWidth: 345 }}>
                      <CardContent>
                        <Stack spacing={2} direction="row" alignItems="center">
                          <Stack spacing={1} direction="column" alignItems="flex-start">
                            <Typography variant="body1" component="span">
                              {cardItems.title}
                            </Typography>
                            <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
                              {cardItems.value}
                            </Typography>
                          </Stack>
                          <Box flexGrow={1} />
                          {cardItems.icon}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ my: 3 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{ maxWidth: 100 + "%" }}>
                    <CardContent>
                      <h5 style={{ textAlign: 'center' }}>Status Overview ['Initiated','Inprogress', 'Completed']</h5>
                      <BarChart
                        xAxis={[{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], name: 'Status' }]}
                        yAxis={[{ name: 'Number of Tasks' }]}
                        series={[{ data: [4, 1, 2, 3, 5, 7, 2, 3, 2, 1, 3, 3] }, { data: [1, 3, 4, 4, 2, 2, 5, 7, 1, 3, 4, 6] }, { data: [3, 1, 2, 2, 3, 4, 5, 6, 7, 8, 2, 1] }]}
                        width={1100}
                        height={300}
                        title="Status Overview"
                      />
                    </CardContent>
                  </Card>
                </Grid>

              </Grid>
            </Container>
            <Box
              component="footer"
              sx={{
                width: "100%",
                paddingBottom: "20px",
                textAlign: "left"
              }}
            >
              <Footer />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </>

  );
}
