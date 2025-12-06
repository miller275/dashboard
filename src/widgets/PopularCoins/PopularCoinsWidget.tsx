import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { coinGeckoApi, TrendingResponse } from '../../api/coinGecko';
import styles from './PopularCoinsWidget.module.css';

const PopularCoinsWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery<TrendingResponse>({
    queryKey: ['trending'],
    queryFn: () => coinGeckoApi.getTrending(),
    refetchInterval: 5 * 60_000
  });

  return (
    <section className={`card ${styles.widget}`}>
      <h3 className={styles.title}>{t('popular.title')}</h3>
      {isLoading && <div>{t('common.loading')}</div>}
      {error && <div>{t('common.error')}</div>}
      {!isLoading && !error && (
        <ul className={styles.list}>
          {data?.coins.map(({ item }) => (
            <li
              key={item.id}
              className={`clickable ${styles.item}`}
              onClick={() =>
                window.open(`https://www.coingecko.com/en/coins/${item.id}`, '_blank')
              }
            >
              <div className={styles.left}>
                <img src={item.small} alt={item.name} />
                <div>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.symbol}>{item.symbol.toUpperCase()}</div>
                </div>
              </div>
              <span className="badge badge-blue">#{item.market_cap_rank}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default PopularCoinsWidget;
