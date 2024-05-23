import React, { useState, useEffect } from "react";
import '../App.css'
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";
import { Button, Chip, InputLabel, TextField } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Footer from "../components/Footer";
import Header from "../components/header";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Sidebar from "../components/Sidebar";
import { addMeetings } from './common'

import { DepartmentContext } from '../context/DepartmentContext';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';

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

function Label({ componentName, valueType }) {

}

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
  const allDepartmentData = allDepartmentList.map((dept) => dept.department);



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
      const setAllTaskListsData = await addMeetings(formDataSend);
      console.log(setAllTaskListsData)
    } catch (error) {
      console.error('Error occurred:', error);
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
    const handleChangeForImage = (event) => {
        const file = event.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            setBase64Image(reader.result);
        };
        reader.readAsDataURL(file);
        }
    }
    if (e.target.name === 'time') {
      setMeetingTime(e.target.value);
    }
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

  const dateTimeStyle = {
    width: "100%",
    padding: "11px 10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontFamily: 'Roboto,sans-serif',
    fontSize: "1em"
  }

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
                          <FormControl fullWidth>
                            <label>
                              Department / Government Organisation{" "}
                            </label>
                            <Select
                              labelId="demo-multiple-chip-label2"
                              id="demo-multiple-chip"
                              fullWidth
                              name="department"
                              value={personName}
                              onChange={handleChange}
                              size="small"
                              multiple
                              input={
                                <OutlinedInput
                                  id="select-multiple-chip"
                                  label="Chip"
                                />
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
                          <FormControl fullWidth>
                            <label>Tags</label>
                            <Select
                              labelId="tag"
                              id="tag"
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
                          <label>Meeting Id</label>
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
                          <label>Meeting Topic</label>
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

                          <input
                            type="date"
                          
                            style={dateTimeStyle}
                            name="date"
                            onChange={getMeetingValue}
                          />
                        </Grid>

                        <Grid item xs={12} md={6}>

                          <input
                            type="time"
                            name="time"
                         
                            style={dateTimeStyle}
                            onChange={getMeetingValue}
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          md={6}
                          size="small"
                          sx={{
                            display: "flex",
                            justifyContent: "start",
                            alignItems: "center",
                            mt: '3',
                           
                          }}
                        >

                          <input type="file" className="inputfile" onChange={handleChangeForImage} />



                        </Grid>



                        <Grid
                          item
                          xs={12}
                          md={6}
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {base64Image && (
                            <img src={base64Image} alt="Uploaded" style={{ maxWidth: '100%' }} />
                          )}

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
