import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { coinGeckoApi, CoinMarket } from '../../api/coinGecko';
import styles from './CoinListWidget.module.css';

const CoinListWidget: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['markets'],
    queryFn: () => coinGeckoApi.getMarkets(),
    refetchInterval: 60_000
  });

  const formatPrice = (value: number) =>
    new Intl.NumberFormat(i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value < 1 ? 6 : 2
    }).format(value);

  const formatCap = (cap: number) => {
    if (cap >= 1e12) return (cap / 1e12).toFixed(2) + 'T';
    if (cap >= 1e9) return (cap / 1e9).toFixed(2) + 'B';
    if (cap >= 1e6) return (cap / 1e6).toFixed(2) + 'M';
    return cap.toFixed(0);
  };

  const handleRowClick = (coin: CoinMarket) => {
    window.open(`https://www.coingecko.com/en/coins/${coin.id}`, '_blank');
  };

  return (
    <section className={`card ${styles.widget}`}>
      <div className={styles.header}>
        <h2>{t('coinList.title')}</h2>
      </div>
      {isLoading && <div>{t('common.loading')}</div>}
      {error && <div>{t('common.error')}</div>}
      {!isLoading && !error && data && (
        <div className={styles.tableWrap}>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>{t('coinList.name')}</th>
                <th>{t('coinList.price')}</th>
                <th>{t('coinList.change24h')}</th>
                <th>{t('coinList.marketCap')}</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 15).map((coin, idx) => (
                <tr
                  key={coin.id}
                  className={`table-row clickable`}
                  onClick={() => handleRowClick(coin)}
                >
                  <td>{idx + 1}</td>
                  <td>
                    <div className={styles.coinCell}>
                      <img src={coin.image} alt={coin.name} />
                      <div>
                        <div className={styles.coinName}>{coin.name}</div>
                        <div className={styles.coinSymbol}>{coin.symbol.toUpperCase()}</div>
                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(coin.current_price)}</td>
                  <td className={coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td>{formatCap(coin.market_cap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default CoinListWidget;
