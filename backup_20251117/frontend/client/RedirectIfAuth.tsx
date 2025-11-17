import { Navigate } from "react-router-dom";

const RedirectIfAuth = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("jwt_token");

  if (token) {
    // Optional: decode & check expiry with jwt-decode
    const userType = localStorage.getItem("userType"); // save this at login
    return userType === "developer" 
      ? <Navigate to="/developer-dashboard" replace /> 
      : <Navigate to="/entrepreneur-dashboard" replace />;
  }

  return children;
};

export default RedirectIfAuth;
