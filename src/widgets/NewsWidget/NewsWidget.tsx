import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NewsWidget.module.css';

const mockNews = [
  {
    id: 1,
    title: 'Bitcoin tests new resistance zone',
    source: 'CoinDesk',
    time: '1h'
  },
  {
    id: 2,
    title: 'Ethereum gas fees remain elevated',
    source: 'The Block',
    time: '3h'
  },
  {
    id: 3,
    title: 'Altcoin rotation continues as BTC dominance cools',
    source: 'CryptoSlate',
    time: '6h'
  }
];

const NewsWidget: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className={`card ${styles.widget}`}>
      <div className={styles.header}>
        <h3>{t('news.title')}</h3>
      </div>
      <ul className={styles.list}>
        {mockNews.map((item) => (
          <li key={item.id} className={`clickable ${styles.item}`}>
            <div className={styles.main}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.meta}>
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.time}</span>
              </div>
            </div>
            <div className={styles.chevron}>↗</div>
          </li>
        ))}
      </ul>
      <button className={styles.button}>{t('news.viewAll')}</button>
    </section>
  );
};

export default NewsWidget;
