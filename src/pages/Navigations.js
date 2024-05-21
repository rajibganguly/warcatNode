/* eslint-disable react-hooks/exhaustive-deps */
import "../App.css";
import LogIn from "./Login";
import Dashboard from "./Dashboard";
import AddDepartment from "./AddDepartment";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Departments from "./Departments";
import Meetings from "./Meetings";
import Reports from "./Reports";
import Tasks from "./Tasks";
import AddNewMeeting from "./AddNewMeeting";
import AddTask from "./AddTasks";
import EditDepartment from "./EditDepartment";
import EditMeeting from "./EditMeeting";
import { useAuth } from "../providers/AuthProvider";
import TaskList from "./TaskList";
import TaskNote from "./TaskNote";
import TaskUpload from "./TaskUpload";
import TaskApproval from "./TaskApproval";
import { useContext, useEffect } from "react";
import { fetchDepartmentData, fetchMeetingData } from "./common";
import { DepartmentContext } from "../context/DepartmentContext";
import { MeetingContext } from "../context/MeetingContext";


const Navigations = () => {
  const { authToken } = useAuth();
  const { setAllDepartmentList } = useContext(DepartmentContext);
  const { setAllMeetingLists } = useContext(MeetingContext);

  useEffect(() => {
    const fetchData = async () => {
      const fetchDepdata = await fetchDepartmentData();
      setAllDepartmentList(fetchDepdata);
      const fetchMeetingsData = await fetchMeetingData();
      setAllMeetingLists(fetchMeetingsData);
    };
    fetchData();
  }, [setAllDepartmentList]);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LogIn />} />
        <Route
          path="/dashboard"
          element={!authToken ? <Navigate to="/" /> : <Dashboard />}
        />
        <Route
          path="/departments"
          element={!authToken ? <Navigate to="/" /> : <Departments />}
        />
        <Route
          path="/meetings"
          element={!authToken ? <Navigate to="/" /> : <Meetings />}
        />
        <Route
          path="/tasks"
          element={!authToken ? <Navigate to="/" /> : <Tasks />}
        />
        <Route
          path="/reports"
          element={!authToken ? <Navigate to="/" /> : <Reports />}
        />
        <Route
          path="/add_department"
          element={!authToken ? <Navigate to="/" /> : <AddDepartment />}
        />
        <Route
          path="/add-new-meetings"
          element={!authToken ? <Navigate to="/" /> : <AddNewMeeting />}
        />
        <Route
          path="/add-tasks"
          element={!authToken ? <Navigate to="/" /> : <AddTask />}
        />
        <Route
          path="/tasks-list"
          element={!authToken ? <Navigate to="/" /> : <TaskList />}
        />
        <Route
          path="/edit-departments/:id"
          element={!authToken ? <Navigate to="/" /> : <EditDepartment />}
        />
        <Route
          path="/edit-meeting/:id"
          element={!authToken ? <Navigate to="/" /> : <EditMeeting />}
        />
        <Route
          path="/task-note"
          element={!authToken ? <Navigate to="/" /> : <TaskNote />}
        />
        <Route
          path="/task-upload"
          element={!authToken ? <Navigate to="/" /> : <TaskUpload />}
        />
        <Route
          path="/task-approval"
          element={!authToken ? <Navigate to="/" /> : <TaskApproval />}
        />
        <Route path="*" element={<Navigate to="/" />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default Navigations;
