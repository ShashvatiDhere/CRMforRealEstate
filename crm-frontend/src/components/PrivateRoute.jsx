import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but role not allowed, redirect to their dashboard
    const dashboardRoute = `/${user.role.toLowerCase()}/dashboard`;
    return <Navigate to={dashboardRoute} replace />;
  }

  // Authorized, return child routes inside Outlet
  return <Outlet />;
};

export default PrivateRoute;
