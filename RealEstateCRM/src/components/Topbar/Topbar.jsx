import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import styles from './Topbar.module.css';

const Topbar = () => {
  const role = localStorage.getItem('crm_role') || 'Admin';

  return (
    <header className={styles.topbar}>
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} size={18} />
        <input 
          type="text" 
          placeholder="Search properties, leads, or agents..." 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.iconBtn}>
          <Bell size={20} />
          <span className={styles.badge}></span>
        </button>
        
        <div className={styles.profile}>
          <div className={styles.avatar}>
            <User size={18} />
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>John Doe</span>
            <span className={styles.userRole}>{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
