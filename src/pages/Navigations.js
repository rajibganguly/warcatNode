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
import Taskbox from "./Taskbox";
import { useAuth } from "../providers/AuthProvider";
import TaskList from "./TaskList";

const Navigations = () => {
  const { authToken } = useAuth();

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
          path="/edit-departments"
          element={!authToken ? <Navigate to="/" /> : <EditDepartment />}
        />
        <Route
          path="/edit-meeting"
          element={!authToken ? <Navigate to="/" /> : <EditMeeting />}
        />

<Route
          path="/add_task_detail"
          element={!authToken ? <Navigate to="/" /> : <Taskbox />}
        />
        <Route path="*" element={<Navigate to="/" />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
};

export default Navigations;
