import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/" replace />;
  }

  // Logged in → render the children (dashboard, business, products, etc.)
  return children;
};

export default ProtectedRoute;
