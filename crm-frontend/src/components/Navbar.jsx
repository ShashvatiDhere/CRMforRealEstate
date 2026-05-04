import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from './Navbar.module.css';
import { User, Bell } from 'lucide-react';

const Navbar = ({ title }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      
      <div className={styles.right}>
        <button className={styles.iconButton}>
          <Bell size={20} />
          <span className={styles.badge}>3</span>
        </button>
        
        <div className={styles.userInfo}>
          <div className={styles.userDetails}>
            <span className={styles.userEmail}>{user?.email}</span>
            <span className={styles.userRole}>{user?.role}</span>
          </div>
          <div className={styles.avatar}>
            <User size={20} color="#fff" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
