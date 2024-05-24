// Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local storage
    logout();
    localStorage.removeItem('token');

    // Optionally, you can clear other storage types as well
    // sessionStorage.clear();
    // Cookies.clear(); // If you are using cookies

    // Redirect to the login page or home page
    navigate('/');
  }, [navigate]);

  return null; // You can return null or a loading indicator
};

export default Logout;