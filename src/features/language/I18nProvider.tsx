import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

export const LanguageContext = React.createContext<{
  language: 'en' | 'ru';
  setLanguage: (lng: 'en' | 'ru') => void;
}>({ language: 'en', setLanguage: () => {} });

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<'en' | 'ru'>(() => {
    const saved = window.localStorage.getItem('language') as 'en' | 'ru' | null;
    return saved || 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(language);
    window.localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lng: 'en' | 'ru') => setLanguageState(lng);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
};
