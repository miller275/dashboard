/* ============================================================
   CryptoHub — переписанный script.js
   ============================================================ */

const App = {
  state: {
    coins: [],
    global: null,
    currency: 'usd',
    perPage: 50,
    sort: 'market_cap_desc',
    page: 1,
    query: '',
    lang: 'ru',
    theme: 'dark',
    watchlist: new Set(),
    selectedCoin: null,
  },

  api: {
    base: 'https://api.coingecko.com/api/v3',
    markets: '/coins/markets',
    coin: id => `/coins/${id}`,
    global: '/global',
    marketChart: (id, vs, days) =>
      `/coins/${id}/market_chart?vs_currency=${vs}&days=${days}&interval=daily`,
  },

  /* ---------------- API Layer ---------------- */
  async fetch(path, params = {}) {
    const url = new URL(this.api.base + path);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  },

  async getMarkets() {
    return this.fetch(this.api.markets, {
      vs_currency: this.state.currency,
      order: this.state.sort,
      per_page: this.state.perPage,
      page: this.state.page,
      sparkline: true,
      price_change_percentage: '1h,24h,7d,30d',
    });
  },

  async getGlobal() {
    return this.fetch(this.api.global);
  },

  async getCoin(id) {
    return this.fetch(this.api.coin(id), {
      localization: this.state.lang,
      tickers: false,
      market_data: true,
      sparkline: true,
    });
  },

  async getChart(id, days = 30) {
    return this.fetch(this.api.marketChart(id, this.state.currency, days));
  },

  /* ---------------- Rendering ---------------- */
  renderTable(coins) {
    const tbody = document.querySelector('#coinsTbody');
    tbody.innerHTML = coins.map((c, i) => `
      <tr data-id="${c.id}">
        <td>${(this.state.page - 1) * this.state.perPage + i + 1}</td>
        <td><img src="${c.image}" alt=""> ${c.name} (${c.symbol.toUpperCase()})</td>
        <td>${c.current_price} ${this.state.currency.toUpperCase()}</td>
        <td style="color:${c.price_change_percentage_24h>=0?'green':'red'}">
          ${c.price_change_percentage_24h?.toFixed(2)}%
        </td>
        <td>${c.market_cap}</td>
        <td>${c.total_volume}</td>
        <td>${c.circulating_supply}</td>
        <td><button class="btn-details">Детали</button>
            <button class="btn-chart">Чарт</button>
            <button class="btn-fav">${this.state.watchlist.has(c.id)?'★':'☆'}</button></td>
      </tr>
    `).join('');
  },

  renderGlobal(global) {
    document.querySelector('#globalMcap .value').textContent =
      global.data.total_market_cap[this.state.currency].toLocaleString();
    document.querySelector('#globalVolume .value').textContent =
      global.data.total_volume[this.state.currency].toLocaleString();
    document.querySelector('#btcDominance .value').textContent =
      global.data.market_cap_percentage.btc.toFixed(2) + '%';
  },

  /* ---------------- Events ---------------- */
  bindEvents() {
    document.querySelector('#coinsTbody').addEventListener('click', e => {
      const tr = e.target.closest('tr[data-id]');
      if (!tr) return;
      const id = tr.dataset.id;
      if (e.target.classList.contains('btn-details')) this.openModal(id);
      if (e.target.classList.contains('btn-chart')) this.openChart(id);
      if (e.target.classList.contains('btn-fav')) this.toggleFav(id);
    });

    document.querySelector('#themeToggle').addEventListener('click', () => {
      this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = this.state.theme;
    });
  },

  /* ---------------- Watchlist ---------------- */
  toggleFav(id) {
    if (this.state.watchlist.has(id)) this.state.watchlist.delete(id);
    else this.state.watchlist.add(id);
    this.refresh();
  },

  /* ---------------- Modal & Chart ---------------- */
  async openModal(id) {
    const coin = await this.getCoin(id);
    document.querySelector('#modalCoinName').textContent = coin.name;
    document.querySelector('#modalDescription').innerHTML =
      coin.description[this.state.lang] || coin.description.en || '';
    document.querySelector('#coinModal').setAttribute('aria-hidden', 'false');
  },

  async openChart(id) {
    const coin = await this.getCoin(id);
    this.state.selectedCoin = coin;
    document.querySelector('#chartCoinName').textContent = coin.name;
    document.querySelector('#chartPanel').classList.add('open');
    // TradingView widget
    new TradingView.widget({
      autosize: true,
      symbol: coin.symbol.toUpperCase() + 'USDT',
      interval: '60',
      theme: this.state.theme,
      container_id: 'tvMiniWidget',
    });
  },

  /* ---------------- Refresh ---------------- */
  async refresh() {
    const [global, coins] = await Promise.all([this.getGlobal(), this.getMarkets()]);
    this.state.global = global;
    this.state.coins = coins;
    this.renderGlobal(global);
    this.renderTable(coins);
  },

  /* ---------------- Init ---------------- */
  async init() {
    this.bindEvents();
    await this.refresh();
  },
};

/* ---------------- Bootstrap ---------------- */
document.addEventListener('DOMContentLoaded', () => App.init());
