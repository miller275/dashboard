import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../features/theme/ThemeContext';
import LanguageSwitcher from '../../../features/language/LanguageSwitcher';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.logoMark}>₿</div>
        <div>
          <div className={styles.title}>Crypto Dashboard</div>
          <div className={styles.subtitle}>{t('header.subtitle')}</div>
        </div>
      </div>
      <div className={styles.right}>
        <LanguageSwitcher />
        <ThemeToggle />
        <span className={styles.badge}>
          {t('header.lastUpdate')}: {new Date().toLocaleTimeString()}
        </span>
      </div>
      <div className={styles.themeHint}>
        {theme === 'dark' ? 'Dark theme' : 'Light theme'}
      </div>
    </header>
  );
};

export default Header;
