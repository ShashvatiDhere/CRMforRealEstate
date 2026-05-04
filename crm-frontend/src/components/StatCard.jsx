import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  // Define color map based on our theme variables
  const colorMap = {
    blue: { bg: 'var(--color-primary-light)', text: 'var(--color-primary)' },
    green: { bg: 'var(--color-success-light)', text: 'var(--color-success-dark)' },
    red: { bg: 'var(--color-danger-light)', text: 'var(--color-danger-dark)' },
    orange: { bg: 'var(--color-warning-light)', text: 'var(--color-warning-dark)' },
    purple: { bg: '#f3e8ff', text: '#7e22ce' },
  };

  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <div>
          <p className={styles.title}>{title}</p>
          <h3 className={styles.value}>{value}</h3>
        </div>
        <div 
          className={styles.iconContainer} 
          style={{ 
            backgroundColor: selectedColor.bg, 
            color: selectedColor.text 
          }}
        >
          {Icon && <Icon size={24} />}
        </div>
      </div>
      <div className={styles.decoration} style={{ backgroundColor: selectedColor.text }}></div>
    </div>
  );
};

export default StatCard;
