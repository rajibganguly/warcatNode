import './App.css';
import react, { useContext, useEffect, useState} from 'react'
import LogIn from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddDepartment from './pages/AddDepartment';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import Departments from './pages/Departments';
import Meetings from './pages/Meetings';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';
import AddNewMeeting from './pages/AddNewMeeting';
import AddTask from './pages/AddTasks';
import EditDepartment from './pages/EditDepartment';
import EditMeeting from './pages/EditMeeting';


function App() {
  // const [ isLoggedIn, setIsLoggedIn] = useState({login: false})
  // const [token, setToken] = useState('');
  //const [tokenContx, setToken] = useContext('');
  let authtoken = localStorage.getItem('token');
  let isLogin = (authtoken) ? true: false;
  
  useEffect(() => {
    let authtoken = localStorage.getItem('token');
    let isLogin = (!authtoken) ? true: false;
    console.log(authtoken, isLogin)
    
  }, [])
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />

        <Route path="/dashboard" element={!isLogin ? <Navigate to="/" /> : <Dashboard />} />
        <Route path="/departments" element={!isLogin ? <Navigate to="/" /> : <Departments />} />
        <Route path="/meetings" element={!isLogin ? <Navigate to="/" /> : <Meetings />} />
        <Route path="/tasks" element={!isLogin ? <Navigate to="/" /> : <Tasks />} />
        <Route path="/reports" element={!isLogin ? <Navigate to="/" /> : <Reports />} />   
        <Route path="/add_department" element={!isLogin ? <Navigate to="/" /> : <AddDepartment />} />  
        <Route path="/add-new-meetings" element={!isLogin ? <Navigate to="/" /> : <AddNewMeeting />} /> 
        <Route path="/add-tasks" element={!isLogin ? <Navigate to="/" /> : <AddTask />} /> 
        <Route path="/edit-departments" element={!isLogin ? <Navigate to="/" /> : <EditDepartment />} /> 
        <Route path="/edit-meeting" element={!isLogin ? <Navigate to="/" /> : <EditMeeting />} />  
        <Route path="*" element={<Navigate to="/" />} />               
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
