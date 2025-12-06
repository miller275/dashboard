import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import styles from './FearGreedWidget.module.css';

interface FearGreedResponse {
  data: {
    value: string;
    value_classification: string;
    timestamp: string;
  }[];
}

const FearGreedWidget: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading, error } = useQuery<FearGreedResponse>({
    queryKey: ['fear-greed'],
    queryFn: async () => {
      const res = await fetch('https://api.alternative.me/fng/?limit=1&format=json');
      if (!res.ok) throw new Error('Network error');
      return res.json();
    },
    refetchInterval: 60 * 60 * 1000
  });

  const value = Number(data?.data?.[0]?.value ?? 50);
  const classification = data?.data?.[0]?.value_classification ?? 'Neutral';
  const angle = (value / 100) * 180;

  let moodClass = styles.neutral;
  if (value >= 75) moodClass = styles.extremeGreed;
  else if (value >= 55) moodClass = styles.greed;
  else if (value <= 25) moodClass = styles.extremeFear;
  else if (value <= 45) moodClass = styles.fear;

  return (
    <section className={`card ${styles.widget}`}>
      <div className={styles.header}>
        <h2>{t('fearGreed.title')}</h2>
      </div>
      {isLoading && <div>{t('common.loading')}</div>}
      {error && <div>{t('common.error')}</div>}
      {!isLoading && !error && (
        <div className={styles.content}>
          <div className={styles.gauge}>
            <div className={styles.gaugeInner}>
              <div
                className={styles.needle}
                style={{ transform: `rotate(${angle - 90}deg)` }}
              />
              <div className={`${styles.value} ${moodClass}`}>{value}</div>
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.mood}>{classification}</div>
            <div className={styles.timestamp}>
              {t('fearGreed.lastUpdate')}:&nbsp;
              {data?.data?.[0]?.timestamp
                ? new Date(Number(data.data[0].timestamp) * 1000).toLocaleString()
                : '—'}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FearGreedWidget;
