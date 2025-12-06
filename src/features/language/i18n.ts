import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      header: {
        subtitle: 'Real-time crypto market overview',
        lastUpdate: 'Last update'
      },
      common: {
        loading: 'Loading...',
        error: 'Something went wrong',
        openNewTab: 'Open in new tab'
      },
      coinList: {
        title: 'Cryptocurrency prices',
        name: 'Name',
        price: 'Price',
        change24h: '24h change',
        marketCap: 'Market cap',
        chart: '7d chart'
      },
      fearGreed: {
        title: 'Fear & Greed index',
        lastUpdate: 'Last update'
      },
      gainers: {
        title: 'Top gainers 24h'
      },
      losers: {
        title: 'Top losers 24h'
      },
      popular: {
        title: 'Trending coins'
      },
      news: {
        title: 'Market news',
        viewAll: 'View all news'
      }
    }
  },
  ru: {
    translation: {
      header: {
        subtitle: 'Онлайн‑обзор рынка криптовалют',
        lastUpdate: 'Обновлено'
      },
      common: {
        loading: 'Загрузка...',
        error: 'Что‑то пошло не так',
        openNewTab: 'Открыть в новой вкладке'
      },
      coinList: {
        title: 'Курсы криптовалют',
        name: 'Монета',
        price: 'Цена',
        change24h: 'Изм. 24ч',
        marketCap: 'Капитализация',
        chart: 'График 7д'
      },
      fearGreed: {
        title: 'Индекс страха и жадности',
        lastUpdate: 'Последнее обновление'
      },
      gainers: {
        title: 'Рост за 24ч'
      },
      losers: {
        title: 'Падение за 24ч'
      },
      popular: {
        title: 'Популярные монеты'
      },
      news: {
        title: 'Новости рынка',
        viewAll: 'Все новости'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
