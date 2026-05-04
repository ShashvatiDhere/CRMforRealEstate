import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styles from './Layout.module.css';

const Layout = () => {
  const location = useLocation();
  
  // Create title from pathname, e.g., /admin/dashboard -> Dashboard
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const rawTitle = pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : 'Dashboard';
  const title = rawTitle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Navbar title={title} />
        <main className={styles.pageContent}>
          <div className={styles.container}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
