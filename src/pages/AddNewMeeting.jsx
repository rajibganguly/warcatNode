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
import { Link, useNavigate } from "react-router-dom";
import { addMeetings, fetchTaskData, getTodayDate } from './common';
import Footer from "../components/Footer";
import Header from "../components/header";
import Sidebar from "../components/Sidebar";
import MuiAppBar from "@mui/material/AppBar";
import { DepartmentContext } from '../context/DepartmentContext';
import { toast } from "react-toastify";
import LoadingIndicator from "../components/loadingIndicator";


const styles = {
  labelAsterisk: {
    color: "red"
  }
};





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
const tagMapping = {
  'Head Office': 'head_of_office',
  'Secretary': 'secretary'
};

const reverseTagMapping = {
  'head_of_office': 'Head Office',
  'secretary': 'Secretary'
};
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


  const [error, setError] = useState({
    departmentIds: false,
    tagName: false,
    meetingTopic: false,
    selectDate: false,
    selectTime: false,
    base64Image: false,
  });

  const validateForm = () => {
    let isValid = true;
    let newError = {
      departmentIds: false,
      tagName: false,
      meetingTopic: false,
      selectDate: false,
      selectTime: false,
      base64Image: false,
    };

    if (departmentIds.length === 0) {
      newError.departmentIds = true;
      isValid = false;
    }

    if (tagName.length === 0) {
      newError.tagName = true;
      isValid = false;
    }

    if (!meetingTopic) {
      newError.meetingTopic = true;
      isValid = false;
    }

    if (!meetingDate) {
      newError.selectDate = true;
      isValid = false;
    }

    if (!meetingTime) {
      newError.selectTime = true;
      isValid = false;
    }

    if (!base64Image) {
      newError.base64Image = true;
      isValid = false;
    }

    setError(newError);

    return isValid;
  };



  /**
   * 
   * All Handle change except image 
   */

  const handleChange = (event) => {
    const {
      target: { value, name },
    } = event;

    if (name === "tag") {
      setTagName([...value]);
      if (value.length > 0) {
        setError(prev => ({ ...prev, tagName: false }));
      }
    }
    if (name === "department") {
      // Find the department objects with the matching _ids
      const selectedDepts = allDepartmentData.filter((dept) =>
        value.includes(dept._id)
      );

      // Update the departmentIds state
      setDepartmentIds(value);
      if (value.length > 0) {
        setError(prev => ({ ...prev, departmentIds: false }));
      }

      // Update the personName state with the names of selected departments
      setPersonName(selectedDepts.map((dept) => dept.department_name));
    }
  };



  // In the handleRemoveDepartment function
  const handleRemoveDepartment = (event, departmentId) => {
    event.preventDefault();
    const updatedPersonName = personName.filter((deptId) => deptId !== departmentId);
    const updatedDeptIds = departmentIds.filter((id) => id !== departmentId);
    setPersonName(updatedPersonName);
    setDepartmentIds(updatedDeptIds);
  };
  const handleRemoveTag = (tag) => {
    const updatedTags = tagName.filter((t) => t !== tag);
    setTagName(updatedTags);
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

  const navigate = useNavigate();

  /**
   * handleAddMeeting POST call
   */
  const handleAddMeeting = async () => {
    if (!validateForm()) {
      toast.error("Please check the fields with red outlines.");
      return;
    }

    const mappedTags = tagName.map(tag => tagMapping[tag]);

    const formDataSend = {
      departmentIds: departmentIds,
      tag: mappedTags,
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
      if (setAllTaskListsData) {
        toast.success("Meeting Added Successfully", {
          autoClose: 2000,
        });
        navigate('/meetings');
      }
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

  const getMeetingValue = (e) => {
    const { name, value } = e.target;
    if (name === 'date') {
      setMeetingDate(value);
      if (value) {
        setError(prev => ({ ...prev, selectDate: false }));
      }
    }
    if (name === 'time') {
      setMeetingTime(value);
      if (value) {
        setError(prev => ({ ...prev, selectTime: false }));
      }
    }
  };

  const handleMeetingTopicChange = (event) => {
    setMeetingTopic(event.target.value);
    if (event.target.value) {
      setError(prev => ({ ...prev, meetingTopic: false }));
    }
  };

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
        if (reader.result) {
          setError(prev => ({ ...prev, base64Image: false }));
        }
      };
      reader.readAsDataURL(file);
    }
  };


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
                          <InputLabel sx={{ mb: 1 }}> <span>
                            Department / Government Organisation
                            <span style={styles.labelAsterisk}> *</span>
                          </span>
                          </InputLabel>
                          <FormControl fullWidth>
                            <Select
                              fullWidth
                              name="department"


                              value={departmentIds}
                              onChange={handleChange}
                              size="small"
                              multiple
                              input={<OutlinedInput />}
                              renderValue={(selected) => (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 0.5,
                                  }}
                                >
                                  {selected.map((deptId) => (
                                    <Chip
                                      key={deptId}
                                      label={allDepartmentData.find((dept) => dept._id === deptId)?.department_name}
                                      onDelete={(event) => handleRemoveDepartment(event, deptId)}
                                      onMouseDown={(event) => event.stopPropagation()}
                                    />

                                  ))}
                                </Box>
                              )}
                              MenuProps={MenuProps}
                              error={error.departmentIds}
                              sx={{ borderColor: error.departmentIds ? 'red' : '' }}
                            >
                              {allDepartmentData.map((value) => (
                                <MenuItem
                                  key={value?._id}
                                  value={value?._id}
                                  style={getStyles(value?._id, departmentIds, theme)}
                                >
                                  {value?.department_name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>

                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel sx={{ mb: 1 }}><span>
                            Tag
                            <span style={styles.labelAsterisk}> *</span>
                          </span></InputLabel>


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
                                    <Chip
                                      key={value}
                                      label={value}
                                      onDelete={() => handleRemoveTag(value)} // Attach onDelete event
                                      onMouseDown={(event) => event.stopPropagation()}
                                    />
                                  ))}
                                </Box>
                              )}
                              error={error.tagName}
                              sx={{ borderColor: error.tagName ? 'red' : '' }}
                            >
                              {Object.keys(tagMapping).map((displayValue) => (
                                <MenuItem key={displayValue} value={displayValue}>
                                  {displayValue}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        {/* <Grid item xs={12} md={6}>
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
                        </Grid> */}
                        <Grid item xs={12} md={12}>


                          <InputLabel sx={{ mb: 1 }}> <span>
                            Meeting Topic
                            <span style={styles.labelAsterisk}> *</span>
                          </span>
                          </InputLabel>
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
                            error={error.meetingTopic}
                            sx={{ borderColor: error.meetingTopic ? 'red' : '' }}
                            aria-readonly
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>

                          <InputLabel sx={{ mb: 1 }}> <span>
                            Select date
                            <span style={styles.labelAsterisk}> *</span>
                          </span>
                          </InputLabel>
                          <TextField
                            type="date"
                            name="date"
                            fullWidth
                            size="small"
                            onChange={getMeetingValue}
                            InputProps={{
                              inputProps: { min: getTodayDate() }
                            }}
                            error={error.selectDate}
                            sx={{ borderColor: error.selectDate ? 'red' : '' }}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>

                          <InputLabel sx={{ mb: 1 }}> <span>
                            Select time
                            <span style={styles.labelAsterisk}> *</span>
                          </span>
                          </InputLabel>
                          <TextField
                            type="time"
                            name="time"
                            fullWidth
                            size="small"
                            onChange={getMeetingValue}
                            error={error.selectTime}
                            sx={{ borderColor: error.selectTime ? 'red' : '' }}
                          />
                        </Grid>

                        <Grid item xs={6} md={6}>

                          <InputLabel sx={{ mb: 1 }}> <span>
                            Upload Images
                            <span style={styles.labelAsterisk}> *</span>
                          </span>
                          </InputLabel>
                          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} border={error.base64Image ? '1px solid red' : '1px solid rgb(133, 133, 133)'} gap={2}>
                            <input
                              variant="outlined"
                              fullWidth
                              placeholder="Enter task title"
                              name="uploadImage"
                              size="small"
                              type="file"
                              accept="image/png, image/jpeg"
                              onChange={handleChangeForImage}
                              className="inputfile inputfile-6"


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
