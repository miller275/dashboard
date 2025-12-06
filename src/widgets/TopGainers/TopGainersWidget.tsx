import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cryptoAPI } from '../../api';
import { useTheme } from '../../features/theme/ThemeContext';
import { useTranslation } from 'react-i18next';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

const TopGainersWidget: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ['coins', 'top-gainers'],
    queryFn: () => cryptoAPI.getCoins(1, 100).then(res => res.data as Coin[]),
    refetchInterval: 60000,
  });

  if (isLoading) return <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">{t('loading')}</div>;
  if (error || !data) return <div className="p-4 text-center text-sm text-red-500">{t('error')}</div>;

  const topGainers = [...data]
    .filter(c => typeof c.price_change_percentage_24h === 'number')
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  return (
    <div className={`rounded-xl p-4 shadow-md bg-white dark:bg-gray-800`}>
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {t('topGainers.title')}
      </h3>
      <ul className="space-y-2">
        {topGainers.map((coin) => (
          <li
            key={coin.id}
            className="flex justify-between text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 py-1"
            onClick={() => window.open(`/coin/${coin.id}`, '_blank')}
          >
            <span className="font-medium text-gray-800 dark:text-gray-100">
              {coin.symbol.toUpperCase()}
            </span>
            <span className="text-green-500 font-semibold">
              {coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopGainersWidget;
