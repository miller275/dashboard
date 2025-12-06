import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../features/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import styles from './FearGreedWidget.module.css';

interface FearGreedApiResponse {
  data: {
    value: string;
    timestamp: string;
  }[];
}

const FearGreedWidget: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<FearGreedApiResponse>({
    queryKey: ['fear-greed'],
    queryFn: () =>
      fetch('https://api.alternative.me/fng/?limit=1').then(res => res.json()),
    refetchInterval: 3600000,
  });

  const getIndexData = (value: number) => {
    if (value >= 75) return { label: t('fearGreed.extremeGreed'), color: '#ef4444' };
    if (value >= 55) return { label: t('fearGreed.greed'), color: '#f59e0b' };
    if (value >= 45) return { label: t('fearGreed.neutral'), color: '#10b981' };
    if (value >= 25) return { label: t('fearGreed.fear'), color: '#3b82f6' };
    return { label: t('fearGreed.extremeFear'), color: '#8b5cf6' };
  };

  if (isLoading) return <div>Loading...</div>;

  const indexValueRaw = data?.data?.[0]?.value ?? '50';
  const indexValue = Number(indexValueRaw);
  const indexData = getIndexData(indexValue);

  return (
    <div className={`${styles.widget} ${theme === 'dark' ? styles.dark : ''}`}>
      <h3 className={styles.title}>{t('fearGreed.title')}</h3>
      <div className={styles.content}>
        <div className={styles.circleContainer}>
          <div
            className={styles.circle}
            style={{
              background: `conic-gradient(${indexData.color} ${indexValue * 3.6}deg, ${
                theme === 'dark' ? '#374151' : '#e5e7eb'
              } 0deg)`,
            }}
          >
            <div className={`${styles.innerCircle} ${theme === 'dark' ? styles.dark : ''}`}>
              <span className={styles.indexValue}>{indexValue}</span>
            </div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.label} style={{ color: indexData.color }}>
            {indexData.label}
          </div>
          <div className={styles.updateTime}>
            {t('fearGreed.lastUpdate')}:{' '}
            {data?.data?.[0]?.timestamp
              ? new Date(Number(data.data[0].timestamp) * 1000).toLocaleTimeString()
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FearGreedWidget;
