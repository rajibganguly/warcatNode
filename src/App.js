import React, { useState, useEffect } from 'react';
import './App.css';
import LogIn from './pages/Login';
import Dashboard from './pages/Dashboard';
import Departments from './pages/Departments';
import Meetings from './pages/Meetings';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';
import AddDepartment from './pages/AddDepartment';
import AddNewMeeting from './pages/AddNewMeeting';
import AddTask from './pages/AddTasks';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleType, setRoleType] = useState(null);

  useEffect(() => {
    // Check if token exists in local storage
    const token = localStorage.getItem('token');
    if (token) {
      // Token exists, set isLoggedIn to true
      setIsLoggedIn(true);
      // Extract role_type from token and set it in state
      const decodedToken = decodeToken(token);
      setRoleType(decodedToken.role_type);
    } else {
      // Token doesn't exist, set isLoggedIn to false
      setIsLoggedIn(false);
    }
  }, []);

  // Function to decode JWT token and return payload
  const decodeToken = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <LogIn />} />

        {isLoggedIn && roleType === 'admin' && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/meetings" element={<Meetings />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/add_department" element={<AddDepartment />} />
            <Route path="/addnewmeetings" element={<AddNewMeeting />} />
            <Route path="/addtasks" element={<AddTask />} />
            {/* Add more admin routes as needed */}
          </>
        )}
        {isLoggedIn && roleType === 'secretary' && (
          <>
            {/* Render secretary routes */}
          </>
        )}
        {isLoggedIn && roleType === 'head_of_Office' && (
          <>
            {/* Render head of office routes */}
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
