import React from 'react';
import styles from './Dashboard.module.css';

export const Card = ({ children, title, className = '' }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {title && <h3 className={styles.cardTitle}>{title}</h3>}
      <div className={styles.cardContent}>
        {children}
      </div>
    </div>
  );
};

export const Metric = ({ title, value, icon, trend, trendValue }) => {
  const isPositive = trend === 'up';
  
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricHeader}>
        <div className={styles.metricInfo}>
          <span className={styles.metricTitle}>{title}</span>
          <h2 className={styles.metricValue}>{value}</h2>
        </div>
        <div className={styles.metricIconWrapper}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className={styles.metricFooter}>
          <span className={isPositive ? styles.trendUp : styles.trendDown}>
            {isPositive ? '↑' : '↓'} {trendValue}
          </span>
          <span className={styles.trendText}>vs last month</span>
        </div>
      )}
    </div>
  );
};
