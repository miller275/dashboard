import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { coinGeckoApi } from '../../api/coinGecko';
import styles from './TopLosersWidget.module.css';

const TopLosersWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery({
    queryKey: ['markets'],
    queryFn: () => coinGeckoApi.getMarkets(),
    refetchInterval: 60_000
  });

  const losers = data
    ?.filter((c) => c.price_change_percentage_24h != null)
    ?.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  return (
    <section className={`card ${styles.widget}`}>
      <h3 className={styles.title}>{t('losers.title')}</h3>
      {isLoading && <div>{t('common.loading')}</div>}
      {error && <div>{t('common.error')}</div>}
      {!isLoading && !error && (
        <ul className={styles.list}>
          {losers?.map((coin) => (
            <li
              key={coin.id}
              className={`clickable ${styles.item}`}
              onClick={() =>
                window.open(`https://www.coingecko.com/en/coins/${coin.id}`, '_blank')
              }
            >
              <span className={styles.name}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </span>
              <span className="badge badge-red">
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TopLosersWidget;
