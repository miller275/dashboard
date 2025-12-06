import React from 'react';
import { useTheme } from '../../../features/theme/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.toggle} onClick={toggleTheme}>
      <span className={styles.thumb} data-theme={theme}>
        {theme === 'light' ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;
