import React, { useContext } from 'react';
import { LanguageContext } from './I18nProvider';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useContext(LanguageContext);

  return (
    <div className={styles.switcher}>
      <button
        className={language === 'en' ? styles.active : ''}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button
        className={language === 'ru' ? styles.active : ''}
        onClick={() => setLanguage('ru')}
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;
