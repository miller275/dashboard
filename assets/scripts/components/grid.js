import { fmt } from '../utils/format.js';

export function renderGrid(coins) {
  const tbody = document.createElement('tbody');
  tbody.innerHTML = coins.map(c => `
    <tr>
      <td>${c.market_cap_rank ?? '—'}</td>
      <td><img src="${c.image}" alt="${c.name}" width="24"/> ${c.name} (${c.symbol.toUpperCase()})</td>
      <td>${fmt.money(c.current_price)}</td>
      <td class="${(c.price_change_percentage_24h ?? 0) >= 0 ? 'price-up':'price-down'}">${fmt.pct(c.price_change_percentage_24h)}</td>
      <td>${fmt.money(c.market_cap)}</td>
      <td>${fmt.money(c.total_volume)}</td>
    </tr>
  `).join('');
  const table = document.createElement('table');
  table.appendChild(tbody);
  document.getElementById('coinsPanel').innerHTML = '';
  document.getElementById('coinsPanel').appendChild(table);
}
