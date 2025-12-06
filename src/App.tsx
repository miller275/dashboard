import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from './features/theme/ThemeContext';
import { I18nProvider } from './features/language/I18nProvider';
import Header from './shared/ui/Header/Header';
import CoinListWidget from './widgets/CoinList/CoinListWidget';
import FearGreedWidget from './widgets/FearGreedIndex/FearGreedWidget';
import TopGainersWidget from './widgets/TopGainers/TopGainersWidget';
import TopLosersWidget from './widgets/TopLosers/TopLosersWidget';
import PopularCoinsWidget from './widgets/PopularCoins/PopularCoinsWidget';
import NewsWidget from './widgets/NewsWidget/NewsWidget';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <CoinListWidget />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TopGainersWidget />
                    <TopLosersWidget />
                  </div>
                </div>
                <div className="space-y-6">
                  <FearGreedWidget />
                  <PopularCoinsWidget />
                  <NewsWidget />
                </div>
              </div>
            </main>
          </div>
        </I18nProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
