window.CG = (() => {
  const base = 'https://api.coingecko.com/api/v3';

  const headers = { 'accept': 'application/json' };
  const orderMap = {
    market_cap_desc: 'market_cap_desc',
    market_cap_asc: 'market_cap_asc',
    volume_desc: 'volume_desc',
    volume_asc: 'volume_asc',
    price_desc: 'price_desc',
    price_asc: 'price_asc',
    change_desc: 'price_change_percentage_desc',
    change_asc: 'price_change_percentage_asc',
  };

  const markets = async ({ page, perPage, currency, sort }) => {
    const url = `${base}/coins/markets?vs_currency=${currency}&order=${orderMap[sort]}&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h,7d`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('CG markets ' + res.status);
    return res.json();
  };

  const coin = async (id) => {
    const url = `${base}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error('CG coin ' + res.status);
    return res.json();
  };

  const ping = async () => {
    const res = await fetch(`${base}/ping`, { headers });
    return res.ok;
  };

  return { markets, coin, ping };
})();
