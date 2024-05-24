// Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear local storage
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