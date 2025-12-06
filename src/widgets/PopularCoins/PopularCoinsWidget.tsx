import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cryptoAPI } from '../../api';
import { useTranslation } from 'react-i18next';

interface TrendingCoin {
  item: {
    id: string;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
  };
}

const PopularCoinsWidget: React.FC = () => {
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ['trending'],
    queryFn: () => cryptoAPI.getTrendingCoins().then(res => res.data as { coins: TrendingCoin[] }),
    refetchInterval: 300000,
  });

  if (isLoading) return <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">{t('loading')}</div>;
  if (error || !data) return <div className="p-4 text-center text-sm text-red-500">{t('error')}</div>;

  return (
    <div className="rounded-xl p-4 shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
        {t('popularCoins.title')}
      </h3>
      <ul className="space-y-2">
        {data.coins.slice(0, 7).map(({ item }) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 py-1"
            onClick={() => window.open(`/coin/${item.id}`, '_blank')}
          >
            <div className="flex items-center gap-2">
              <img src={item.thumb} alt={item.name} className="w-5 h-5 rounded-full" />
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {item.symbol.toUpperCase()}
              </span>
            </div>
            {item.market_cap_rank && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                #{item.market_cap_rank}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularCoinsWidget;
