import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import styles from './Sidebar.module.css';
import { 
  LayoutDashboard, Users, UserPlus, Building, Building2, 
  FileText, LogOut, CheckCircle, Clock, MapPin, List
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Managers', path: '/admin/create-manager', icon: <Users size={20} /> },
          { name: 'Pending Agents', path: '/admin/pending-agents', icon: <UserPlus size={20} /> },
          { name: 'Properties', path: '/admin/properties', icon: <Building size={20} /> },
          { name: 'Reports', path: '/admin/reports', icon: <FileText size={20} /> },
        ];
      case 'MANAGER':
        return [
          { name: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'Leads', path: '/manager/leads', icon: <List size={20} /> },
          { name: 'Assign Lead', path: '/manager/assign-lead', icon: <UserPlus size={20} /> },
          { name: 'Assign Property', path: '/manager/assign-property', icon: <Building2 size={20} /> },
          { name: 'Agent Tracking', path: '/manager/agent-tracking', icon: <Users size={20} /> },
          { name: 'Reports', path: '/manager/reports', icon: <FileText size={20} /> },
        ];
      case 'AGENT':
        return [
          { name: 'Dashboard', path: '/agent/dashboard', icon: <LayoutDashboard size={20} /> },
          { name: 'My Leads', path: '/agent/my-leads', icon: <Users size={20} /> },
          { name: 'Follow Ups', path: '/agent/follow-ups', icon: <Clock size={20} /> },
          { name: 'Site Visits', path: '/agent/site-visits', icon: <MapPin size={20} /> },
          { name: 'My Properties', path: '/agent/my-properties', icon: <Building size={20} /> },
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <Building size={24} color="#fff" />
        </div>
        <h2 className={styles.logoText}>Real Estate CRM</h2>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {links.map((link) => (
            <li key={link.path} className={styles.navItem}>
              <NavLink
                to={link.path}
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <span className={styles.navIcon}>{link.icon}</span>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.logoutContainer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          <LogOut size={20} className={styles.navIcon} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
