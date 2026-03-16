// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("loggedInUser");

  if (!isLoggedIn || isLoggedIn === "undefined" || isLoggedIn === "null") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
