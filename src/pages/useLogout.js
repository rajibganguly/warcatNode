import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");
    // Navigate to the login page
    navigate("/");
    // Optionally, display a logout success message
    toast.success("Logged out successfully");
  };

  return handleLogout;
};

export default useLogout;
