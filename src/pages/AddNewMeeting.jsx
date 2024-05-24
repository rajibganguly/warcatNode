import React, { useState, useEffect } from "react";
import '../App.css'
import {
  Box,
  Grid,
  Card,
  Chip,
  Select,
  styled,
  Button,
  Toolbar,
  useTheme,
  MenuItem,
  Container,
  TextField,
  InputLabel,
  Typography,
  createTheme,
  FormControl,
  CssBaseline,
  Breadcrumbs,
  CardContent,
  OutlinedInput,
  ThemeProvider,
} from "@mui/material";
import { addMeetings, fetchTaskData } from './common'
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import MuiAppBar from "@mui/material/AppBar";
import { DepartmentContext } from '../context/DepartmentContext';
import LoadingIndicator from "../components/loadingIndicator";

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

const defaultTheme = createTheme();

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function AddNewMeeting() {
  const [open, setOpen] = React.useState(true);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    departmentIds: '',
    tag: '',
    meetingTopic: '',
    selectDate: null,
    selectTime: null,
  });
  const [departmentIds, setDepartmentIds] = useState([]); // Tags Store
  const [tagName, setTagName] = useState([]); // Tags Store
  const [personName, setPersonName] = React.useState([]);
  const [meetingTopic, setMeetingTopic] = React.useState("");
  const [meetingId, setMeetingId] = React.useState("");
  const [meetingDate, setMeetingDate] = React.useState("");
  const [meetingTime, setMeetingTime] = React.useState("");
  const [base64Image, setBase64Image] = React.useState("");

  const theme = useTheme();
  const { allDepartmentList } = React.useContext(DepartmentContext);
  const allDepartmentData = allDepartmentList?.map((dept) => dept.department);

  /**
   * 
   * All Handle change except image 
   */

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    if (event.target.name === "tag") {
      setTagName([...event.target.value]);
    }
    if (event.target.name === "department") {
      // Find the department objects with the matching _ids
      const selectedDepts = allDepartmentData.filter((dept) =>
        value.includes(dept._id)
      );
      // Create a new array to hold the updated personName state
      let updatedPersonName = [...personName];
      let updatedDeptIds = [...departmentIds];

      // Add or remove department names based on the selected value
      selectedDepts.forEach((dept) => {
        const index = updatedPersonName.indexOf(dept.department_name);
        if (index === -1) {
          // If the department name is not already in the array, add it
          updatedPersonName.push(dept.department_name);
          updatedDeptIds.push(dept._id);
        } else {
          // If the department name is already in the array, remove it
          updatedPersonName.splice(index, 1);
          updatedDeptIds.splice(index, 1);
        }
      });

      // Update the personName state with the new array
      setPersonName(updatedPersonName);
      setDepartmentIds(updatedDeptIds);
    }
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      selectDate: date,
    }));
  };

  const handleTimeChange = (time) => {
    setFormData((prevData) => ({
      ...prevData,
      selectTime: time,
    }));
  };

  /**
   * handleAddMeeting POST call
   */
  const handleAddMeeting = async () => {
    const formDataSend = {
      departmentIds: departmentIds,
      tag: tagName,
      meetingTopic: meetingTopic,
      selectDate: meetingDate,
      selectTime: meetingTime,
      imageUrl: base64Image
    }
    try {
      setIsLoading(true);
      const setAllTaskListsData = await addMeetings(formDataSend);
      await fetchTaskData();
      console.log(setAllTaskListsData)
      setIsLoading(false);
    } catch (error) {
      console.error('Error occurred:', error);
      setIsLoading(false);
    }
  };

  const handleOutput = (open) => {
    toggleDrawer();
  };
  const toggleDrawer = () => {
    setOpen(!open);
  };

  function getMeetingValue(e) {
    if (e.target.name === 'date') {
      setMeetingDate(e.target.value);
    }
    if (e.target.name === 'time') {
      setMeetingTime(e.target.value);
    }
  }

/**
 * 
 * All Handle change for image 
 */

  const handleChangeForImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBase64Image(reader.result);
        console.log(reader.result, base64Image)
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      {/* For Loader */}
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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
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
                    Add Meetings
                  </div>
                  <div>
                    <Breadcrumbs aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href="/">
                        WARCAT
                      </Link>
                      <Link underline="hover" color="inherit">
                        Meetings
                      </Link>
                      <Typography color="text.primary">
                        Add Meeting
                      </Typography>
                    </Breadcrumbs>
                  </div>
                </div>
                <Card sx={{ width: 100 + "%", padding: 2 }}>
                  <CardContent>
                    <Box
                      display={'flex'}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      pb={2}
                      borderBottom={"1px solid #eff2f7"}
                    >
                      <Typography variant="body1">Add Meeting</Typography>
                    </Box>
                    <Box
                      component="form"
                      noValidate
                      autoComplete="off"
                      sx={{ marginTop: 2 }}
                    >
                      <Grid
                        container
                        spacing={2}
                        sx={{
                          mb: 4,
                          borderBottom: "1px solid #eff2f7",
                          pb: 2,
                        }}
                      >
                        <Grid item xs={12} md={6}>
                          <InputLabel sx={{ mb: 1 }}>Department / Government Organisation</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              fullWidth
                              name="department"
                              value={personName}
                              onChange={handleChange}
                              size="small"
                              multiple
                              input={
                                <OutlinedInput />
                              }
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                            >
                              {allDepartmentData.map((value) => (
                                <MenuItem
                                  key={value?._id}
                                  value={value?._id}
                                  style={getStyles(
                                    value?._id,
                                    personName,
                                    theme
                                  )}
                                >
                                  {value?.department_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel sx={{ mb: 1 }}>Tag</InputLabel>
                          <FormControl fullWidth>
                            <Select
                              fullWidth
                              name="tag"
                              multiple
                              value={tagName}
                              onChange={handleChange}
                              size="small"
                              renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                  ))}
                                </Box>
                              )}
                            >
                              <MenuItem value="secretary">Secretary</MenuItem>
                              <MenuItem value="head_of_office">Head Office</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel sx={{ mb: 1 }}>Meeting Id</InputLabel>
                          <TextField
                            id="outlined-basic"

                            variant="outlined"
                            fullWidth
                            name="meetingId"
                            value={meetingId}
                            onChange={(event) =>
                              setMeetingId(event.target.value)
                            }
                            size="small"
                            aria-readonly
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel sx={{ mb: 1 }}>Meeting Topic</InputLabel>
                          <TextField
                            id="outlined-basic"

                            variant="outlined"
                            fullWidth
                            name="meetingTopic"
                            value={meetingTopic}
                            onChange={(event) =>
                              setMeetingTopic(event.target.value)
                            }
                            size="small"
                            aria-readonly
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                        <InputLabel sx={{ mb: 1 }}>Select date</InputLabel>
                          <TextField
                            type="date"
                            name="date"
                            fullWidth
                            size="small"
                            onChange={getMeetingValue}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <InputLabel sx={{ mb: 1 }}>Select time</InputLabel>
                          <TextField
                            type="time"
                            name="time"
                            fullWidth
                            size="small"
                            onChange={getMeetingValue}
                          />
                        </Grid>

                        <Grid item xs={6} md={6}>
                          <InputLabel sx={{ mb: 1 }}>Upload Images</InputLabel>
                          <Box display={'flex'} gap={2}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              placeholder="Enter task title"
                              name="uploadImage"
                              size="small"
                              type="file"
                              onChange={handleChangeForImage}
                            />
                            <Box width={'40px'} height={'40px'} minWidth={'40px'} borderRadius={'6px'} backgroundColor='#ebebeb'>
                              {base64Image && (
                                <img
                                  alt=""
                                  width={'100%'}
                                  height={'100%'}
                                  className="smallImageInTask"
                                  src={base64Image}
                                />
                              )}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>

                      <Button
                        variant="contained"
                        color="info"
                        sx={{ color: "white", marginTop: "2%" }}
                        onClick={handleAddMeeting}
                      >
                        Add Meeting
                      </Button>
                    </Box>
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
            }}
          >
            <Footer />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
