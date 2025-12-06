import axios from 'axios';

const client = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  timeout: 15000
});

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  sparkline_in_7d?: { price: number[] };
}

export interface TrendingResponse {
  coins: {
    item: {
      id: string;
      name: string;
      symbol: string;
      market_cap_rank: number;
      thumb: string;
      small: string;
      large: string;
      slug: string;
      price_btc: number;
      score: number;
    };
  }[];
}

export const coinGeckoApi = {
  async getMarkets(): Promise<CoinMarket[]> {
    const res = await client.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        price_change_percentage: '24h',
        sparkline: true
      }
    });
    return res.data;
  },

  async getTrending(): Promise<TrendingResponse> {
    const res = await client.get('/search/trending');
    return res.data;
  }
};
