import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = ["user", "admin", "sub-admin"] }) => {
  const userEmail = localStorage.getItem("userEmail");
  const userRole = (localStorage.getItem("userPosition") || "").trim().toLowerCase();


  const sessionTimeout = localStorage.getItem("sessionTimeout");
  
  if (sessionTimeout) {
    const timeoutTime = parseInt(sessionTimeout);
    

    if (timeoutTime === 0) {
      localStorage.clear();
      return <Navigate to="/" replace />;
      
    } else if (Date.now() >= timeoutTime) {
      localStorage.clear();
      return <Navigate to="/" replace />;
    }
  }

  if (!userEmail || !userRole) {
    return <Navigate to="/" replace />;
  }
  
  if (!Array.isArray(allowedRoles)) {
    return <Navigate to="/not-authorized" replace />;
  }
  
  return allowedRoles.includes(userRole) ? <Outlet /> : <Navigate to="/main/not-authorized" replace />;
};

export default ProtectedRoute;
