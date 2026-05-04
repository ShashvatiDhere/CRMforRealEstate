import React from 'react';
import styles from './LoadingSpinner.module.css';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className={styles.fullScreenOverlay}>
        <Loader2 className={styles.spinnerIcon} />
        <p className={styles.spinnerText}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.spinnerContainer}>
      <Loader2 className={styles.spinnerIconSmall} />
    </div>
  );
};

export default LoadingSpinner;
