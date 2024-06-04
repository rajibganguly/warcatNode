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
import { fetchRoleType } from "./common";

import Logout from "./Logout";



const Navigations = () => {
  const { authToken } = useAuth();
  const userRoleType = fetchRoleType();



  return (
    <Router>
      <Routes>
        <Route exact
          path="/"
          element={!authToken ? <LogIn /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/logout"
          element={!authToken ? <Navigate to="/" /> : <Logout />}
        />
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
          element={authToken && userRoleType === 'admin' ? <AddTask /> : <Navigate to="/" />}
        />
      
        <Route
          path="/edit-tasks"
          element={authToken && userRoleType === 'admin' ? <AddTask /> : <Navigate to="/" />}
        />
        <Route
          path="/tasks-list"
          element={!authToken ? <Navigate to="/" /> : <TaskList />}
        />
        <Route
          path="/edit-departments/:id"
          element={authToken && userRoleType === 'admin' ? <EditDepartment /> : <Navigate to="/" />}
        />
        <Route
          path="/edit-meeting"
          element={authToken && userRoleType === 'admin' ? <EditMeeting /> : <Navigate to="/" />}
        />

        <Route
          path="/task-note"
          element={authToken && userRoleType !== 'admin' ? <TaskNote /> : <Navigate to="/" />}
        />
        <Route
          path="/task-upload"
          element={authToken && userRoleType !== 'admin' ? <TaskUpload /> : <Navigate to="/" />}
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
