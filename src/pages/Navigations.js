import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { getItem } from "../config/storage";
import { useEffect } from "react";
import { fetchDepartments } from "../redux/slices/departmentSlice/departmentsSlice";
import { useDispatch } from "react-redux";

// Import your components
import LogIn from "./Login";
import Dashboard from "./Dashboard";
import Departments from "./Departments";
import Meetings from "./Meetings";
import Reports from "./Reports";
import Tasks from "./Tasks";
import AddDepartment from "./AddDepartment";
import AddNewMeeting from "./AddNewMeeting";
import AddTask from "./AddTasks";
import EditDepartment from "./EditDepartment";
import EditMeeting from "./EditMeeting";
import TaskList from "./TaskList";
import TaskNote from "./TaskNote";
import TaskUpload from "./TaskUpload";
import TaskApproval from "./TaskApproval";

const Navigations = () => {
  const { authToken } = useAuth();
  const localData = getItem("user");
  const dispatch = useDispatch();

  useEffect(() => {
    const userId = localData?._id;
    const roleType = localData?.role_type;
    dispatch(fetchDepartments({ userId, roleType }));
  }, []);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LogIn />} />
        {authToken && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/add_department" element={<AddDepartment />} />
            <Route path="/add-new-meetings" element={<AddNewMeeting />} />
            <Route path="/add-tasks" element={<AddTask />} />
            <Route path="/tasks-list" element={<TaskList />} />
            <Route path="/edit-departments/:id" element={<EditDepartment />} />
            <Route path="/edit-meeting" element={<EditMeeting />} />
            <Route path="/task-note" element={<TaskNote />} />
            <Route path="/task-upload" element={<TaskUpload />} />
            <Route path="/task-approval" element={<TaskApproval />} />
          </>
        )}
        {!authToken && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
};

export default Navigations;
