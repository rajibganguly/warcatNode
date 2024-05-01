import './App.css';
import LogIn from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddDepartment from './pages/AddDepartment';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Departments from './pages/Departments';
import Meetings from './pages/Meetings';
import Reports from './pages/Reports';
import Tasks from './pages/Tasks';

function App() {
  // const [ isLoggedIn, setIsLoggedIn] = useState({login: false})

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/reports" element={<Reports />} />   
        <Route path="/add_department" element={<AddDepartment />} />        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
