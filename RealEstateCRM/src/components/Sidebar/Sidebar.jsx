import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Briefcase, Calendar, MessageSquare, Settings, LogOut, Grid } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  // Read role from simple localStorage mock
  const role = localStorage.getItem('crm_role') || 'Admin';

  const menuItems = {
    Admin: [
      { path: '/admin', icon: <Home size={20} />, label: 'Overview' },
      { path: '/admin/properties', icon: <Briefcase size={20} />, label: 'All Properties' },
      { path: '/admin/agents', icon: <Users size={20} />, label: 'Agents' },
      { path: '/admin/settings', icon: <Settings size={20} />, label: 'Settings' },
    ],
    Manager: [
      { path: '/manager', icon: <Grid size={20} />, label: 'Dashboard' },
      { path: '/manager/team', icon: <Users size={20} />, label: 'Team Perfomance' },
      { path: '/manager/listings', icon: <Briefcase size={20} />, label: 'Branch Listings' },
    ],
    Agent: [
      { path: '/agent', icon: <Home size={20} />, label: 'My Dashboard' },
      { path: '/agent/leads', icon: <Users size={20} />, label: 'My Leads' },
      { path: '/agent/schedule', icon: <Calendar size={20} />, label: 'Appointments' },
      { path: '/agent/messages', icon: <MessageSquare size={20} />, label: 'Messages' },
    ]
  };

  const currentMenu = menuItems[role] || menuItems['Agent'];

  const handleLogout = () => {
    localStorage.removeItem('crm_role');
    navigate('/');
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}></div>
        <div className={styles.logoText}>
          Real<span>Estate</span>CRM
        </div>
      </div>

      <div className={styles.roleBadge}>
        {role} Panel
      </div>

      <nav className={styles.nav}>
        <ul>
          {currentMenu.map((item, index) => (
            <li key={index}>
              <NavLink 
                to={item.path} 
                end
                className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.bottomMenu}>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
