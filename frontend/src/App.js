import './App.css';
import LogIn from './pages/Login';
import Dashboard from './pages/Dashboard';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  // const [ isLoggedIn, setIsLoggedIn] = useState({login: false})

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
