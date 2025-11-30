const base = 'https://api.coingecko.com/api/v3';

export async function loadMarkets({ page, perPage, order, currency='usd' }) {
  const url = `${base}/coins/markets?vs_currency=${currency}&order=${order}&per_page=${Math.min(perPage,250)}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function loadGlobal() {
  const res = await fetch(`${base}/global`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}

export async function loadCoinDetail(id) {
  const res = await fetch(`${base}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=true`);
  if (!res.ok) throw new Error('API error');
  return res.json();
}
