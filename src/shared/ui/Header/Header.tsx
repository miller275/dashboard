import React from 'react';
import { useTheme } from '../../../features/theme/ThemeContext';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const handleLanguageChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold">
            ₿
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t('header.title')}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200"
          >
            {t('header.theme')}: {theme === 'light' ? '☀️' : '🌙'}
          </button>
          <select
            onChange={handleLanguageChange}
            defaultValue={i18n.language}
            className="px-3 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            <option value="en">EN</option>
            <option value="ru">RU</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
