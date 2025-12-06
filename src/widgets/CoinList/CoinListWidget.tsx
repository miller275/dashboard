import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../features/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { cryptoAPI } from '../../api';
import styles from './CoinListWidget.module.css';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: { price: number[] };
}

const CoinListWidget: React.FC = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const { data: coins, isLoading, error } = useQuery<Coin[]>({
    queryKey: ['coins'],
    queryFn: () => cryptoAPI.getCoins().then(res => res.data),
    refetchInterval: 60000,
  });

  const handleCoinClick = (coinId: string) => {
    window.open(`/coin/${coinId}`, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toFixed(2)}`;
  };

  if (isLoading) return <div className={`${styles.loading} ${theme === 'dark' ? styles.dark : ''}`}>{t('loading')}</div>;
  if (error || !coins) return <div className={`${styles.error} ${theme === 'dark' ? styles.dark : ''}`}>{t('error')}</div>;

  return (
    <div className={`${styles.widget} ${theme === 'dark' ? styles.dark : ''}`}>
      <h2 className={styles.title}>{t('coinList.title')}</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>{t('coinList.name')}</th>
              <th>{t('coinList.price')}</th>
              <th>{t('coinList.change')}</th>
              <th>{t('coinList.marketCap')}</th>
              <th>{t('coinList.chart')}</th>
            </tr>
          </thead>
          <tbody>
            {coins.slice(0, 10).map((coin, index) => (
              <tr 
                key={coin.id} 
                className={styles.row}
                onClick={() => handleCoinClick(coin.id)}
              >
                <td>{index + 1}</td>
                <td>
                  <div className={styles.coinInfo}>
                    <img src={coin.image} alt={coin.name} className={styles.coinImage} />
                    <div>
                      <div className={styles.coinName}>{coin.name}</div>
                      <div className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td className={styles.price}>{formatPrice(coin.current_price)}</td>
                <td className={coin.price_change_percentage_24h >= 0 ? styles.positive : styles.negative}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td>{formatMarketCap(coin.market_cap)}</td>
                <td>
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width={80} height={40}>
                      <LineChart data={coin.sparkline_in_7d.price.map((p, i) => ({ value: p, idx: i }))}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={coin.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444'}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoinListWidget;
