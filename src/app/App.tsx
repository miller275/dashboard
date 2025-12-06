import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../features/theme/ThemeContext';
import { I18nProvider } from '../features/language/I18nProvider';
import Header from '../shared/ui/Header/Header';
import CoinListWidget from '../widgets/CoinList';
import FearGreedWidget from '../widgets/FearGreedIndex';
import TopGainersWidget from '../widgets/TopGainers';
import TopLosersWidget from '../widgets/TopLosers';
import PopularCoinsWidget from '../widgets/PopularCoins';
import NewsWidget from '../widgets/NewsWidget';
import '../index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30_000,
      retry: 1
    }
  }
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <div className="app-root">
            <Header />
            <div className="grid grid-3" style={{ marginTop: 16 }}>
              <div className="grid" style={{ gap: 16 }}>
                <CoinListWidget />
                <div className="grid" style={{ gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                  <TopGainersWidget />
                  <TopLosersWidget />
                </div>
              </div>
              <div className="grid" style={{ gap: 16 }}>
                <FearGreedWidget />
                <PopularCoinsWidget />
                <NewsWidget />
              </div>
            </div>
          </div>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
