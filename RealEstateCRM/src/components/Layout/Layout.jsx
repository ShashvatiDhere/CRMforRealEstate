import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If not on login page and no role is set, redirect to login
    const role = localStorage.getItem('crm_role');
    if (!role && location.pathname !== '/') {
      navigate('/');
    }
  }, [navigate, location]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="content-area fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
