import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
}

const fetchNews = async (): Promise<NewsItem[]> => {
  // Простейшая заглушка: вы можете заменить на любой реальный API новостей
  // или подключить свой backend. Пока вернем несколько статических новостей.
  return [
    {
      id: '1',
      title: 'Bitcoin holds above key level amid market volatility',
      url: 'https://www.coindesk.com/',
      source: 'CoinDesk',
      published_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Ethereum gas fees drop to multi-month lows',
      url: 'https://www.theblock.co/',
      source: 'The Block',
      published_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Altcoins rally as traders rotate from majors',
      url: 'https://www.cryptoslate.com/',
      source: 'CryptoSlate',
      published_at: new Date().toISOString(),
    },
  ];
};

const NewsWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">{t('loading')}</div>;
  if (error || !data) return <div className="p-4 text-center text-sm text-red-500">{t('error')}</div>;

  return (
    <div className="rounded-xl p-4 shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {t('news.title')}
      </h3>
      <ul className="space-y-3 text-sm">
        {data.map((item) => (
          <li key={item.id} className="border-b last:border-b-0 border-gray-100 dark:border-gray-700 pb-2">
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {item.title}
            </a>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex justify-between">
              <span>{item.source}</span>
              <span>{new Date(item.published_at).toLocaleTimeString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsWidget;
