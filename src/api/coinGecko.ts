import axios from 'axios';

const coinGeckoAPI = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 10000,
});

export const cryptoAPI = {
  getCoins: (page = 1, perPage = 100) =>
    coinGeckoAPI.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: true,
        price_change_percentage: '24h',
      },
    }),

  getFearGreedIndex: () =>
    axios.get('https://api.alternative.me/fng/?limit=1'),

  getCoinDetails: (id: string) =>
    coinGeckoAPI.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: true,
      },
    }),

  getTrendingCoins: () =>
    coinGeckoAPI.get('/search/trending'),
};
