// ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AppContext from '../context/AppContext';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useContext(AppContext);

  // Check if user exists and if their role is included in allowedRoles
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Redirect to login if unauthorized
  }

  return element; // Render the specified element if authorized
};

export default ProtectedRoute;
