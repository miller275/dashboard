import React from 'react';
import './i18n';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
