import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      loading: 'Loading...',
      error: 'Error while loading data',
      coinList: {
        title: 'Cryptocurrency Prices',
        name: 'Name',
        price: 'Price',
        change: '24h Change',
        marketCap: 'Market Cap',
        chart: '7D Chart',
      },
      fearGreed: {
        title: 'Fear & Greed Index',
        extremeGreed: 'Extreme Greed',
        greed: 'Greed',
        neutral: 'Neutral',
        fear: 'Fear',
        extremeFear: 'Extreme Fear',
        lastUpdate: 'Last update',
      },
      topGainers: {
        title: 'Top Gainers 24h',
      },
      topLosers: {
        title: 'Top Losers 24h',
      },
      popularCoins: {
        title: 'Trending Coins',
      },
      news: {
        title: 'Crypto News',
      },
      header: {
        title: 'Crypto Dashboard',
        theme: 'Theme',
        language: 'Language',
      },
    },
  },
  ru: {
    translation: {
      loading: 'Загрузка...',
      error: 'Ошибка при загрузке данных',
      coinList: {
        title: 'Курсы криптовалют',
        name: 'Название',
        price: 'Цена',
        change: 'Изменение 24ч',
        marketCap: 'Капитализация',
        chart: 'График 7Д',
      },
      fearGreed: {
        title: 'Индекс страха и жадности',
        extremeGreed: 'Экстремальная жадность',
        greed: 'Жадность',
        neutral: 'Нейтрально',
        fear: 'Страх',
        extremeFear: 'Экстремальный страх',
        lastUpdate: 'Последнее обновление',
      },
      topGainers: {
        title: 'Топ роста за 24ч',
      },
      topLosers: {
        title: 'Топ падения за 24ч',
      },
      popularCoins: {
        title: 'Популярные монеты',
      },
      news: {
        title: 'Крипто новости',
      },
      header: {
        title: 'Крипто дашборд',
        theme: 'Тема',
        language: 'Язык',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
