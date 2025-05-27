// AutoLogout.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      Cookies.remove("authToken");
      navigate("/login");
    }, 24 * 60 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timeout);
  }, [navigate]);

  return null;
};

export default AutoLogout;
