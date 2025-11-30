import { loadMarkets, loadGlobal } from './api/coingecko.js';
import { renderGrid } from './components/grid.js';
import { initToolbar } from './components/toolbar.js';
import { initPagination } from './components/pagination.js';
import { initCoinModal } from './components/coin-modal.js';

async function init() {
  initToolbar();
  initPagination();
  initCoinModal();

  const global = await loadGlobal();
  const coins = await loadMarkets({ page: 1, perPage: 50, order: 'market_cap_desc' });
  renderGrid(coins);
}
init();
