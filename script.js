/* =========================================
   CryptoHub — Market & Charts
   - CoinGecko API integration
   - TradingView widgets
   - Search, sort, pagination, watchlist, heatmap
   - Theme + language toggles
   - Modal details + side chart panel
   - Ready for GitHub Pages (no server needed)
   ========================================= */

/* -----------------------------------------
   Section 0. App Constants
   ----------------------------------------- */

const APP = {
  version: '1.0.0',
  name: 'CryptoHub',
  author: 'Games & Copilot',
  // Default options
  opts: {
    currency: 'usd',
    perPage: 50,
    sort: 'market_cap_desc',
    page: 1,
    lang: 'ru',
    theme: (typeof document !== 'undefined' ? document.documentElement.dataset.theme : 'dark') || 'dark',
  },
  // Endpoints
  api: {
    base: 'https://api.coingecko.com/api/v3',
    // Market list
    markets: '/coins/markets',
    // Single coin
    coin: (id) => `/coins/${encodeURIComponent(id)}`,
    // Global
    global: '/global',
    // Market chart (prices)
    marketChart: (id, vs, days) => `/coins/${encodeURIComponent(id)}/market_chart?vs_currency=${encodeURIComponent(vs)}&days=${encodeURIComponent(days)}&interval=daily`,
    // Simple price
    simplePrice: '/simple/price',
  },
  // DOM refs
  dom: {},
  // State
  state: {
    coins: [],
    total: 0,
    page: 1,
    perPage: 50,
    sort: 'market_cap_desc',
    currency: 'usd',
    query: '',
    lang: 'ru',
    theme: 'dark',
    watchlist: new Set(),
    selectedCoin: null,
    global: null,
  },
  // i18n dictionary
  i18n: {
    ru: {
      market: 'Рынок',
      watchlist: 'Избранное',
      heatmap: 'Теплокарта',
      global: 'Глобально',
      searchPlaceholder: 'Поиск монеты...',
      clear: 'Очистить',
      currency: 'Валюта',
      perPage: 'На странице',
      sort: 'Сортировка',
      refresh: 'Обновить',
      lastUpdated: 'Обновлено',
      price: 'Цена',
      change24h: 'Изм. 24ч',
      marketCap: 'Капитализация',
      volume24h: 'Объем 24ч',
      circulating: 'Оборот',
      line: 'Линия',
      actions: 'Действия',
      addFav: 'В избранное',
      removeFav: 'Убрать',
      details: 'Детали',
      chart: 'Чарт',
      loading: 'Загрузка...',
      emptyWatchlist: 'Избранное пусто. Добавьте монеты с рынка.',
      globalMcap: 'Глобальная капитализация',
      globalVolume: 'Общий объем 24ч',
      btcDominance: 'Доминантность BTC',
      marketTrend: 'Тренд рынка',
      tvMini: 'TradingView Mini',
      tvFull: 'TradingView Full',
      info: 'Инфо',
      description: 'Описание',
      links: 'Ссылки',
      marketData: 'Рыночные данные',
      errorFetch: 'Ошибка загрузки данных. Попробуйте позже.',
      page: 'Страница',
      open: 'Открыть',
      close: 'Закрыть',
      ru: 'RU',
      en: 'EN',
      growth: 'рост',
      drop: 'падение',
      topVolume: 'Топ по объему',
      dominanceTracker: 'Трекер доминантности',
      globalMetrics: 'Глобальные метрики',
    },
    en: {
      market: 'Market',
      watchlist: 'Watchlist',
      heatmap: 'Heatmap',
      global: 'Global',
      searchPlaceholder: 'Search coin...',
      clear: 'Clear',
      currency: 'Currency',
      perPage: 'Per page',
      sort: 'Sort',
      refresh: 'Refresh',
      lastUpdated: 'Updated',
      price: 'Price',
      change24h: 'Change 24h',
      marketCap: 'Market cap',
      volume24h: 'Volume 24h',
      circulating: 'Circulating',
      line: 'Spark',
      actions: 'Actions',
      addFav: 'Add fav',
      removeFav: 'Remove',
      details: 'Details',
      chart: 'Chart',
      loading: 'Loading...',
      emptyWatchlist: 'Watchlist is empty. Add coins from market.',
      globalMcap: 'Global market cap',
      globalVolume: 'Global volume 24h',
      btcDominance: 'BTC dominance',
      marketTrend: 'Market trend',
      tvMini: 'TradingView Mini',
      tvFull: 'TradingView Full',
      info: 'Info',
      description: 'Description',
      links: 'Links',
      marketData: 'Market data',
      errorFetch: 'Failed to fetch. Try later.',
      page: 'Page',
      open: 'Open',
      close: 'Close',
      ru: 'RU',
      en: 'EN',
      growth: 'growth',
      drop: 'drop',
      topVolume: 'Top by volume',
      dominanceTracker: 'Dominance tracker',
      globalMetrics: 'Global metrics',
    }
  },
  // Symbol mapping for TradingView (simple guess)
  tvSymbols: {
    // Try to map major coins to TradingView symbols
    bitcoin: 'BINANCE:BTCUSDT',
    ethereum: 'BINANCE:ETHUSDT',
    tether: 'CRYPTOCAP:USDT',
    binancecoin: 'BINANCE:BNBUSDT',
    ripple: 'BINANCE:XRPUSDT',
    cardano: 'BINANCE:ADAUSDT',
    dogecoin: 'BINANCE:DOGEUSDT',
    solana: 'BINANCE:SOLUSDT',
    tron: 'BINANCE:TRXUSDT',
    polkadot: 'BINANCE:DOTUSDT',
    litecoin: 'BINANCE:LTCUSDT',
    shiba-inu: 'BINANCE:SHIBUSDT',
    avalanche: 'BINANCE:AVAXUSDT',
    chainlink: 'BINANCE:LINKUSDT',
    polygon: 'BINANCE:MATICUSDT',
    uniswap: 'BINANCE:UNIUSDT',
    cosmos: 'BINANCE:ATOMUSDT',
    toncoin: 'BYBIT:TONUSDT',
    near: 'BINANCE:NEARUSDT',
    aptos: 'BINANCE:APTUSDT',
    arbitrum: 'BINANCE:ARBUSDT',
    pepe: 'BINANCE:PEPEUSDT',
    // fallback added at runtime if unknown
  },
};

/* -----------------------------------------
   Section 1. Utilities
   ----------------------------------------- */

const fmt = {
  /** Format currency */
  money(n, currency = APP.state.currency) {
    const locales = APP.state.lang === 'ru' ? 'ru-RU' : 'en-US';
    try {
      return new Intl.NumberFormat(locales, { style: 'currency', currency: currency.toUpperCase(), maximumFractionDigits: 6 }).format(n ?? 0);
    } catch (e) {
      // Fallback if currency unsupported
      return `${n?.toLocaleString?.(locales) ?? n} ${currency.toUpperCase()}`;
    }
  },
  /** Format compact number */
  num(n) {
    const locales = APP.state.lang === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.NumberFormat(locales, { notation: 'compact', maximumFractionDigits: 2 }).format(n ?? 0);
  },
  /** Format percent with sign */
  perc(n) {
    if (n === null || n === undefined) return '—';
    const s = n >= 0 ? '+' : '';
    return `${s}${n.toFixed(2)}%`;
  },
  /** Date/time */
  time(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString(APP.state.lang === 'ru' ? 'ru-RU' : 'en-US');
  },
  /** HTML escape */
  esc(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  },
  /** Clamp */
  clamp(n, min, max) { return Math.max(min, Math.min(max, n)); },
  /** Random int */
  rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; },
  /** Debounce */
  debounce(fn, ms = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  },
};

/* -----------------------------------------
   Section 2. Persistent storage
   ----------------------------------------- */

const storage = {
  get(key, def) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : def;
    } catch (e) {
      return def;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  },
  getSet(key) {
    const arr = storage.get(key, []);
    return new Set(arr);
  },
  setSet(key, set) {
    storage.set(key, Array.from(set || []));
  }
};

/* -----------------------------------------
   Section 3. DOM references and helpers
   ----------------------------------------- */

function q(sel) { return document.querySelector(sel); }
function qa(sel) { return Array.from(document.querySelectorAll(sel)); }

function initDomRefs() {
  APP.dom.navMarket = q('#navMarket');
  APP.dom.navWatchlist = q('#navWatchlist');
  APP.dom.navHeatmap = q('#navHeatmap');
  APP.dom.navGlobal = q('#navGlobal');

  APP.dom.searchInput = q('#searchInput');
  APP.dom.clearSearch = q('#clearSearch');

  APP.dom.currencySelect = q('#currencySelect');
  APP.dom.perPageSelect = q('#perPageSelect');
  APP.dom.sortSelect = q('#sortSelect');

  APP.dom.themeToggle = q('#themeToggle');
  APP.dom.langToggle = q('#langToggle');

  APP.dom.refreshBtn = q('#refreshBtn');
  APP.dom.lastUpdated = q('#lastUpdated');

  APP.dom.globalMcap = q('#globalMcap .value');
  APP.dom.globalVolume = q('#globalVolume .value');
  APP.dom.btcDominance = q('#btcDominance .value');
  APP.dom.marketTrend = q('#marketTrend .value');

  APP.dom.marketView = q('#marketView');
  APP.dom.watchlistView = q('#watchlistView');
  APP.dom.heatmapView = q('#heatmapView');
  APP.dom.globalView = q('#globalView');

  APP.dom.coinsTbody = q('#coinsTbody');
  APP.dom.prevPage = q('#prevPage');
  APP.dom.nextPage = q('#nextPage');
  APP.dom.pageIndicator = q('#pageIndicator');

  APP.dom.watchlistEmpty = q('#watchlistEmpty');
  APP.dom.watchlistGrid = q('#watchlistGrid');

  APP.dom.heatmapGrid = q('#heatmapGrid');

  APP.dom.globalMetrics = q('#globalMetrics');
  APP.dom.dominanceBars = q('#dominanceBars');
  APP.dom.topVolumeList = q('#topVolumeList');

  APP.dom.chartPanel = q('#chartPanel');
  APP.dom.chartCoinIcon = q('#chartCoinIcon');
  APP.dom.chartCoinName = q('#chartCoinName');
  APP.dom.chartCoinSymbol = q('#chartCoinSymbol');
  APP.dom.chartClose = q('#chartClose');

  APP.dom.chartTabs = qa('.chart-tab');
  APP.dom.sparkTab = q('#sparkTab');
  APP.dom.tvMiniTab = q('#tvMiniTab');
  APP.dom.tvFullTab = q('#tvFullTab');
  APP.dom.infoTab = q('#infoTab');
  APP.dom.sparkCanvas = q('#sparkCanvas');
  APP.dom.tvMiniWidget = q('#tvMiniWidget');
  APP.dom.tvFullWidget = q('#tvFullWidget');
  APP.dom.coinInfoGrid = q('#coinInfoGrid');

  APP.dom.coinModal = q('#coinModal');
  APP.dom.modalClose = q('#modalClose');
  APP.dom.modalCoinIcon = q('#modalCoinIcon');
  APP.dom.modalCoinName = q('#modalCoinName');
  APP.dom.modalCoinSymbol = q('#modalCoinSymbol');
  APP.dom.modalFavToggle = q('#modalFavToggle');
  APP.dom.modalMarketData = q('#modalMarketData');
  APP.dom.modalLinksList = q('#modalLinksList');
  APP.dom.modalDescription = q('#modalDescription');
}

/* -----------------------------------------
   Section 4. API layer
   ----------------------------------------- */

async function apiGet(path, params = {}) {
  const url = new URL(APP.api.base + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
    },
    // mode: 'cors' // default
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return await res.json();
}

async function fetchMarkets({ page, perPage, currency, sort, query }) {
  const orderMap = {
    market_cap_desc: 'market_cap_desc',
    market_cap_asc: 'market_cap_asc',
    price_desc: 'price_desc',
    price_asc: 'price_asc',
    volume_desc: 'volume_desc',
    volume_asc: 'volume_asc',
    change_24h_desc: 'price_change_percentage_24h_desc',
    change_24h_asc: 'price_change_percentage_24h_asc',
  };
  const params = {
    vs_currency: currency,
    order: orderMap[sort] || 'market_cap_desc',
    per_page: perPage,
    page,
    sparkline: 'true',
    price_change_percentage: '1h,24h,7d,30d',
    locale: APP.state.lang === 'ru' ? 'ru' : 'en',
  };
  const data = await apiGet(APP.api.markets, params);
  let filtered = data;
  if (query) {
    const ql = query.toLowerCase();
    filtered = data.filter(c =>
      c.name.toLowerCase().includes(ql) ||
      c.symbol.toLowerCase().includes(ql) ||
      c.id.toLowerCase().includes(ql)
    );
  }
  return filtered;
}

async function fetchGlobal() {
  return await apiGet(APP.api.global);
}

async function fetchCoin(id) {
  return await apiGet(APP.api.coin(id), {
    localization: APP.state.lang === 'ru' ? 'ru' : 'en',
    tickers: 'false',
    market_data: 'true',
    community_data: 'false',
    developer_data: 'false',
    sparkline: 'true',
  });
}

async function fetchMarketChart(id, vs, days = 30) {
  const path = APP.api.marketChart(id, vs, days);
  return await apiGet(path);
}

/* -----------------------------------------
   Section 5. Rendering functions
   ----------------------------------------- */

function renderGlobal(global) {
  const t = APP.i18n[APP.state.lang];
  const mcap = global?.data?.total_market_cap?.[APP.state.currency] ?? null;
  const vol = global?.data?.total_volume?.[APP.state.currency] ?? null;
  const btcDom = global?.data?.market_cap_percentage?.btc ?? null;

  APP.dom.globalMcap.textContent = mcap ? fmt.money(mcap) : '—';
  APP.dom.globalVolume.textContent = vol ? fmt.money(vol) : '—';
  APP.dom.btcDominance.textContent = btcDom ? `${btcDom.toFixed(2)}%` : '—';

  const trendVal = (global?.data?.market_cap_change_percentage_24h_usd ?? 0);
  const trendStr = `${fmt.perc(trendVal)} ${trendVal >= 0 ? t.growth : t.drop}`;
  APP.dom.marketTrend.textContent = trendStr;
}

function renderTableRows(coins) {
  const t = APP.i18n[APP.state.lang];
  const rows = coins.map((c, idx) => {
    const price = c.current_price ?? 0;
    const ch24 = c.price_change_percentage_24h ?? 0;
    const mcap = c.market_cap ?? 0;
    const vol = c.total_volume ?? 0;
    const circ = c.circulating_supply ?? 0;
    const pos = ch24 >= 0 ? 'pos' : 'neg';
    const isFav = APP.state.watchlist.has(c.id);

    return `
      <tr data-id="${fmt.esc(c.id)}" aria-label="${fmt.esc(c.name)}">
        <td class="mono">${fmt.esc(((APP.state.page - 1) * APP.state.perPage) + idx + 1)}</td>
        <td class="td-coin">
          <img src="${fmt.esc(c.image)}" alt="${fmt.esc(c.symbol.toUpperCase())}">
          <div>
            <div class="coin-name">${fmt.esc(c.name)}</div>
            <div class="coin-symbol">${fmt.esc(c.symbol.toUpperCase())}</div>
          </div>
        </td>
        <td class="td-price mono">${fmt.money(price)}</td>
        <td class="td-change ${pos} mono">${fmt.perc(ch24)}</td>
        <td class="mono">${fmt.money(mcap)}</td>
        <td class="mono">${fmt.money(vol)}</td>
        <td class="mono">${fmt.num(circ)}</td>
        <td class="td-spark">
          <canvas class="spark" width="120" height="36" data-series="${(c.sparkline_in_7d?.price ?? []).slice(-40).join(',')}"></canvas>
        </td>
        <td>
          <div class="row-actions">
            <button class="row-btn btn-details">${fmt.esc(t.details)}</button>
            <button class="row-btn btn-chart">${fmt.esc(t.chart)}</button>
            <button class="row-btn btn-fav ${isFav ? 'active' : ''}" title="${isFav ? fmt.esc(t.removeFav) : fmt.esc(t.addFav)}">${isFav ? '★' : '☆'}</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  APP.dom.coinsTbody.innerHTML = rows || `<tr><td colspan="9" style="text-align:center;color:var(--text-dim);padding:16px;">${fmt.esc(t.errorFetch)}</td></tr>`;
  // Draw sparks
  qa('canvas.spark').forEach(drawSparkCanvas);
}

function drawSparkCanvas(cv) {
  try {
    const series = (cv.dataset.series || '')
      .split(',')
      .map(Number)
      .filter(n => Number.isFinite(n));
    if (!series.length) return;

    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);

    // Background baseline
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border').trim();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 1);
    ctx.lineTo(W, H - 1);
    ctx.stroke();

    // Scale
    const min = Math.min(...series);
    const max = Math.max(...series);
    const pad = 0.05 * (max - min || 1);
    const ymin = min - pad, ymax = max + pad;
    const stepX = W / (series.length - 1 || 1);

    // Color gradient
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue('--primary').trim());
    grad.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue('--accent').trim());

    // Line
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    series.forEach((v, i) => {
      const x = i * stepX;
      const y = H - ((v - ymin) / (ymax - ymin)) * H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, H);
    fillGrad.addColorStop(0, 'rgba(78,161,255,0.18)');
    fillGrad.addColorStop(1, 'rgba(78,161,255,0.02)');
    ctx.fillStyle = fillGrad;
    ctx.fill();
  } catch (e) {}
}

function renderPagination() {
  const t = APP.i18n[APP.state.lang];
  APP.dom.pageIndicator.textContent = `${t.page} ${APP.state.page}`;
  APP.dom.prevPage.disabled = APP.state.page <= 1;
  APP.dom.nextPage.disabled = APP.state.coins.length < APP.state.perPage;
}

function renderWatchlist() {
  const t = APP.i18n[APP.state.lang];
  const favIds = Array.from(APP.state.watchlist);
  if (!favIds.length) {
    APP.dom.watchlistEmpty.classList.remove('hidden');
    APP.dom.watchlistGrid.innerHTML = '';
    return;
  }
  APP.dom.watchlistEmpty.classList.add('hidden');

  const list = APP.state.coins.filter(c => favIds.includes(c.id));
  const cards = list.map(c => `
    <div class="card" data-id="${fmt.esc(c.id)}">
      <div class="card-head">
        <div class="card-coin">
          <img src="${fmt.esc(c.image)}" alt="${fmt.esc(c.symbol.toUpperCase())}">
          <div>
            <div class="card-title">${fmt.esc(c.name)}</div>
            <div class="card-subtitle">${fmt.esc(c.symbol.toUpperCase())}</div>
          </div>
        </div>
        <button class="fav-btn ${APP.state.watchlist.has(c.id) ? 'active':''}" title="${APP.state.watchlist.has(c.id)? fmt.esc(t.removeFav):fmt.esc(t.addFav)}">${APP.state.watchlist.has(c.id) ? '★' : '☆'}</button>
      </div>
      <div class="card-body">
        <div><span class="label">${fmt.esc(t.price)}</span> <span class="mono">${fmt.money(c.current_price)}</span></div>
        <div><span class="label">${fmt.esc(t.change24h)}</span> <span class="mono ${c.price_change_percentage_24h>=0?'td-change pos':'td-change neg'}">${fmt.perc(c.price_change_percentage_24h)}</span></div>
        <div><span class="label">${fmt.esc(t.marketCap)}</span> <span class="mono">${fmt.money(c.market_cap)}</span></div>
        <div class="card-actions">
          <button class="actions btn btn-details">${fmt.esc(t.details)}</button>
          <button class="actions btn btn-chart">${fmt.esc(t.chart)}</button>
        </div>
      </div>
    </div>
  `).join('');

  APP.dom.watchlistGrid.innerHTML = cards;
}

function renderHeatmap() {
  const t = APP.i18n[APP.state.lang];
  const tiles = APP.state.coins.map(c => {
    const ch = c.price_change_percentage_24h ?? 0;
    const bg = ch >= 0
      ? `linear-gradient(135deg, rgba(0,208,138,0.2), rgba(0,208,138,0.05))`
      : `linear-gradient(135deg, rgba(255,91,91,0.25), rgba(255,91,91,0.05))`;
    return `
      <div class="heat-tile" data-id="${fmt.esc(c.id)}" style="background:${bg}">
        <div class="tile-head">
          <span>${fmt.esc(c.symbol.toUpperCase())}</span>
          <span>${fmt.money(c.current_price)}</span>
        </div>
        <div class="tile-body ${ch>=0?'pos':'neg'}">${fmt.perc(ch)}</div>
      </div>
    `;
  }).join('');

  APP.dom.heatmapGrid.innerHTML = tiles;
}

function renderGlobalCards(global) {
  const t = APP.i18n[APP.state.lang];

  const metrics = [
    ['Активных криптовалют', global?.data?.active_cryptocurrencies],
    ['Рынков', global?.data?.markets],
    ['Ойк. индекс', global?.data?.updated_at ? new Date(global.data.updated_at*1000).toLocaleString(APP.state.lang === 'ru' ? 'ru-RU' : 'en-US') : '—'],
    ['24ч изменение рынка', fmt.perc(global?.data?.market_cap_change_percentage_24h_usd ?? 0)],
  ];
  APP.dom.globalMetrics.innerHTML = metrics.map(([k,v]) => `<li><span>${fmt.esc(k)}</span><span class="mono">${fmt.esc(v ?? '—')}</span></li>`).join('');

  const btcDom = global?.data?.market_cap_percentage?.btc ?? 0;
  const ethDom = global?.data?.market_cap_percentage?.eth ?? 0;
  const stblDom = (global?.data?.market_cap_percentage?.usdt ?? 0) + (global?.data?.market_cap_percentage?.usdc ?? 0);

  APP.dom.dominanceBars.innerHTML = `
    <div class="dom-bar"><div class="fill" style="width:${fmt.clamp(btcDom,0,100)}%;"></div></div>
    <div class="dom-bar"><div class="fill" style="width:${fmt.clamp(ethDom,0,100)}%;background:linear-gradient(90deg,var(--accent),var(--primary));"></div></div>
    <div class="dom-bar"><div class="fill" style="width:${fmt.clamp(stblDom,0,100)}%;background:linear-gradient(90deg,#999,#ddd);"></div></div>
  `;

  const topVol = [...APP.state.coins]
    .sort((a,b) => (b.total_volume ?? 0) - (a.total_volume ?? 0))
    .slice(0, 10);
  APP.dom.topVolumeList.innerHTML = topVol.map(c => `<li><span>${fmt.esc(c.name)} (${fmt.esc(c.symbol.toUpperCase())})</span> <span class="mono">${fmt.money(c.total_volume)}</span></li>`).join('');
}

/* -----------------------------------------
   Section 6. Chart panel + TradingView
   ----------------------------------------- */

function openChartPanel(coin) {
  APP.state.selectedCoin = coin;
  APP.dom.chartCoinIcon.src = coin.image;
  APP.dom.chartCoinIcon.alt = coin.symbol.toUpperCase();
  APP.dom.chartCoinName.textContent = coin.name;
  APP.dom.chartCoinSymbol.textContent = coin.symbol.toUpperCase();

  APP.dom.chartPanel.classList.add('open');
  switchChartTab('spark'); // default
  renderSparkChart(coin);
  renderInfoTab(coin);
  initTvMini(coin);
  initTvFull(coin);
}

function closeChartPanel() {
  APP.state.selectedCoin = null;
  APP.dom.chartPanel.classList.remove('open');
  APP.dom.tvMiniWidget.innerHTML = '';
  APP.dom.tvFullWidget.innerHTML = '';
}

function switchChartTab(tab) {
  APP.dom.chartTabs.forEach(b => {
    const isActive = b.dataset.tab === tab;
    b.classList.toggle('active', isActive);
  });
  APP.dom.sparkTab.classList.toggle('active', tab === 'spark');
  APP.dom.tvMiniTab.classList.toggle('active', tab === 'tv-mini');
  APP.dom.tvFullTab.classList.toggle('active', tab === 'tv-full');
  APP.dom.infoTab.classList.toggle('active', tab === 'info');
}

async function renderSparkChart(coin) {
  const canvas = APP.dom.sparkCanvas;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  // Fetch market chart
  try {
    const data = await fetchMarketChart(coin.id, APP.state.currency, 60);
    const series = (data?.prices ?? []).map(([ts, price]) => price);
    if (!series.length) return;
    // Draw
    const min = Math.min(...series);
    const max = Math.max(...series);
    const pad = 0.05 * (max - min || 1);
    const ymin = min - pad, ymax = max + pad;
    const stepX = W / (series.length - 1 || 1);

    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    ctx.lineWidth = 2;
    ctx.beginPath();
    series.forEach((v, i) => {
      const x = i * stepX;
      const y = H - ((v - ymin) / (ymax - ymin)) * H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, H);
    fillGrad.addColorStop(0, 'rgba(0,87,255,0.22)');
    fillGrad.addColorStop(1, 'rgba(0,87,255,0.02)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

  } catch (e) {
    // ignore
  }
}

function guessTvSymbol(coin) {
  return APP.tvSymbols[coin.id] || `CRYPTOCAP:${coin.symbol.toUpperCase()}`;
}

function initTvMini(coin) {
  APP.dom.tvMiniWidget.innerHTML = '';
  const symbol = guessTvSymbol(coin);
  // Mini chart widget
  try {
    new TradingView.widget({
      autosize: true,
      symbol: symbol,
      interval: '60',
      timezone: 'Etc/UTC',
      theme: APP.state.theme === 'dark' ? 'dark' : 'light',
      style: '1',
      toolbar_bg: '#f1f3f6',
      hide_top_toolbar: true,
      hide_legend: true,
      container_id: APP.dom.tvMiniWidget,
      save_image: false,
      locale: APP.state.lang === 'ru' ? 'ru' : 'en',
    });
  } catch (e) {
    APP.dom.tvMiniWidget.innerHTML = `<div style="padding:10px;color:var(--text-dim);">TradingView недоступен.</div>`;
  }
}

function initTvFull(coin) {
  APP.dom.tvFullWidget.innerHTML = '';
  const symbol = guessTvSymbol(coin);
  // Advanced chart widget
  try {
    new TradingView.widget({
      autosize: true,
      symbol: symbol,
      interval: '240',
      timezone: 'Etc/UTC',
      theme: APP.state.theme === 'dark' ? 'dark' : 'light',
      style: '3',
      allow_symbol_change: true,
      withdateranges: true,
      studies: ['MACD@tv-basicstudies','RSI@tv-basicstudies'],
      container_id: APP.dom.tvFullWidget,
      locale: APP.state.lang === 'ru' ? 'ru' : 'en',
      save_image: false,
      hide_top_toolbar: false,
      hide_legend: false,
    });
  } catch (e) {
    APP.dom.tvFullWidget.innerHTML = `<div style="padding:10px;color:var(--text-dim);">TradingView недоступен.</div>`;
  }
}

function renderInfoTab(coin) {
  const items = [
    ['Rank', coin.market_cap_rank],
    ['Price', fmt.money(coin.current_price)],
    ['24h', fmt.perc(coin.price_change_percentage_24h)],
    ['7d', fmt.perc(coin.price_change_percentage_7d_in_currency ?? 0)],
    ['30d', fmt.perc(coin.price_change_percentage_30d_in_currency ?? 0)],
    ['Market cap', fmt.money(coin.market_cap)],
    ['Volume 24h', fmt.money(coin.total_volume)],
    ['Circulating', fmt.num(coin.circulating_supply)],
    ['Ath', fmt.money(coin.ath)],
    ['Ath change', fmt.perc(coin.ath_change_percentage)],
  ];
  APP.dom.coinInfoGrid.innerHTML = items.map(([k,v]) => `
    <div class="info-item">
      <div class="label">${fmt.esc(k)}</div>
      <div class="value mono">${fmt.esc(v ?? '—')}</div>
    </div>
  `).join('');
}

/* -----------------------------------------
   Section 7. Modal details
   ----------------------------------------- */

async function openCoinModal(id) {
  try {
    const coin = await fetchCoin(id);
    APP.dom.modalCoinIcon.src = coin.image?.small || coin.image?.thumb || '';
    APP.dom.modalCoinName.textContent = coin.name || '—';
    APP.dom.modalCoinSymbol.textContent = coin.symbol?.toUpperCase() || '—';

    const md = coin.market_data || {};
    const kv = [
      ['Rank', coin.market_cap_rank],
      ['Price', fmt.money(md.current_price?.[APP.state.currency])],
      ['24h', fmt.perc(md.price_change_percentage_24h || 0)],
      ['7d', fmt.perc(md.price_change_percentage_7d || 0)],
      ['30d', fmt.perc(md.price_change_percentage_30d || 0)],
      ['Market cap', fmt.money(md.market_cap?.[APP.state.currency])],
      ['Volume 24h', fmt.money(md.total_volume?.[APP.state.currency])],
      ['Circulating', fmt.num(md.circulating_supply)],
      ['FDV', fmt.money(md.fully_diluted_valuation?.[APP.state.currency])],
      ['ATH', fmt.money(md.ath?.[APP.state.currency])],
      ['ATH change', fmt.perc(md.ath_change_percentage?.[APP.state.currency] || 0)],
      ['ATL', fmt.money(md.atl?.[APP.state.currency])],
    ];
    APP.dom.modalMarketData.innerHTML = kv.map(([k,v]) => `<li><span>${fmt.esc(k)}</span><span class="mono">${fmt.esc(v ?? '—')}</span></li>`).join('');

    const links = coin.links || {};
    const homepage = links.homepage?.[0];
    const repos = links.repos_url?.github || [];
    const twitter = links.twitter_screen_name ? `https://twitter.com/${links.twitter_screen_name}` : null;
    const reddit = links.subreddit_url;
    const explorers = links.blockchain_site?.filter(Boolean).slice(0, 5) || [];
    const linkItems = []
      .concat(homepage ? [`<li><a href="${fmt.esc(homepage)}" target="_blank" rel="noopener">Website</a></li>`] : [])
      .concat(twitter ? [`<li><a href="${fmt.esc(twitter)}" target="_blank" rel="noopener">Twitter</a></li>`] : [])
      .concat(reddit ? [`<li><a href="${fmt.esc(reddit)}" target="_blank" rel="noopener">Reddit</a></li>`] : [])
      .concat(explorers.map(u => `<li><a href="${fmt.esc(u)}" target="_blank" rel="noopener">Explorer</a></li>`))
      .concat(repos.slice(0,3).map(u => `<li><a href="${fmt.esc(u)}" target="_blank" rel="noopener">GitHub</a></li>`));
    APP.dom.modalLinksList.innerHTML = linkItems.join('') || `<li style="color:var(--text-dim);">—</li>`;

    const desc = (coin.description?.[APP.state.lang] || coin.description?.en || '').trim();
    APP.dom.modalDescription.innerHTML = desc ? sanitizeDescription(desc) : '—';

    // Fav toggle state
    APP.dom.modalFavToggle.classList.toggle('active', APP.state.watchlist.has(coin.id));
    APP.dom.modalFavToggle.onclick = () => toggleFav(coin.id);

    APP.dom.coinModal.setAttribute('aria-hidden', 'false');
  } catch (e) {
    alert(APP.i18n[APP.state.lang].errorFetch);
  }
}

function closeCoinModal() {
  APP.dom.coinModal.setAttribute('aria-hidden', 'true');
}

function sanitizeDescription(html) {
  // Simple sanitizer: allow <p>, <a>, <br>, <ul>, <li>, <strong>, <em>
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const allowed = ['P','A','BR','UL','LI','STRONG','EM','B','I'];
  const walker = document.createTreeWalker(tmp, NodeFilter.SHOW_ELEMENT, null);
  const toRemove = [];
  while (walker.nextNode()) {
    const el = walker.currentNode;
    if (!allowed.includes(el.tagName)) {
      toRemove.push(el);
    } else {
      // scrub attributes except href for A
      [...el.attributes].forEach(attr => {
        if (el.tagName === 'A' && attr.name === 'href') return;
        el.removeAttribute(attr.name);
      });
      if (el.tagName === 'A') {
        el.setAttribute('target','_blank');
        el.setAttribute('rel','noopener');
      }
    }
  }
  toRemove.forEach(el => {
    const span = document.createElement('span');
    span.textContent = el.textContent;
    el.replaceWith(span);
  });
  return tmp.innerHTML;
}

/* -----------------------------------------
   Section 8. Interactions
   ----------------------------------------- */

function bindEvents() {
  // Navigation
  [APP.dom.navMarket, APP.dom.navWatchlist, APP.dom.navHeatmap, APP.dom.navGlobal].forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Search
  APP.dom.searchInput.placeholder = APP.i18n[APP.state.lang].searchPlaceholder;
  APP.dom.searchInput.addEventListener('input', fmt.debounce(() => {
    APP.state.query = APP.dom.searchInput.value.trim();
    refreshMarket();
  }, 250));
  APP.dom.clearSearch.addEventListener('click', () => {
    APP.dom.searchInput.value = '';
    APP.state.query = '';
    refreshMarket();
  });

  // Filters
  APP.dom.currencySelect.value = APP.state.currency;
  APP.dom.currencySelect.addEventListener('change', () => {
    APP.state.currency = APP.dom.currencySelect.value;
    storage.set('currency', APP.state.currency);
    refreshGlobal();
    refreshMarket();
  });

  APP.dom.perPageSelect.value = String(APP.state.perPage);
  APP.dom.perPageSelect.addEventListener('change', () => {
    APP.state.perPage = parseInt(APP.dom.perPageSelect.value, 10) || 50;
    APP.state.page = 1;
    storage.set('perPage', APP.state.perPage);
    refreshMarket();
  });

  APP.dom.sortSelect.value = APP.state.sort;
  APP.dom.sortSelect.addEventListener('change', () => {
    APP.state.sort = APP.dom.sortSelect.value;
    storage.set('sort', APP.state.sort);
    refreshMarket();
  });

  // Theme
  APP.dom.themeToggle.addEventListener('click', () => {
    APP.state.theme = APP.state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = APP.state.theme;
    storage.set('theme', APP.state.theme);
    // Rerender tradingview with new theme
    if (APP.state.selectedCoin) {
      initTvMini(APP.state.selectedCoin);
      initTvFull(APP.state.selectedCoin);
    }
  });

  // Language
  APP.dom.langToggle.textContent = APP.i18n[APP.state.lang].ru;
  APP.dom.langToggle.addEventListener('click', () => {
    APP.state.lang = APP.state.lang === 'ru' ? 'en' : 'ru';
    storage.set('lang', APP.state.lang);
    applyLang();
    refreshGlobal();
    refreshMarket();
    if (APP.state.selectedCoin) {
      initTvMini(APP.state.selectedCoin);
      initTvFull(APP.state.selectedCoin);
    }
  });

  // Refresh
  APP.dom.refreshBtn.addEventListener('click', () => {
    refreshGlobal();
    refreshMarket();
  });

  // Pagination
  APP.dom.prevPage.addEventListener('click', () => {
    if (APP.state.page > 1) {
      APP.state.page--;
      refreshMarket();
    }
  });
  APP.dom.nextPage.addEventListener('click', () => {
    APP.state.page++;
    refreshMarket();
  });

  // Table row actions
  APP.dom.coinsTbody.addEventListener('click', (e) => {
    const tr = e.target.closest('tr[data-id]');
    if (!tr) return;
    const id = tr.dataset.id;
    const coin = APP.state.coins.find(c => c.id === id);
    if (!coin) return;

    if (e.target.classList.contains('btn-details')) {
      openCoinModal(id);
    } else if (e.target.classList.contains('btn-chart')) {
      openChartPanel(coin);
    } else if (e.target.classList.contains('btn-fav')) {
      toggleFav(id);
      renderTableRows(APP.state.coins);
      renderWatchlist();
    } else {
      // click row selects + opens chart
      qa('.coins-table tbody tr').forEach(r => r.classList.remove('selected'));
      tr.classList.add('selected');
      openChartPanel(coin);
    }
  });

  // Watchlist interactions
  APP.dom.watchlistGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.card[data-id]');
    if (!card) return;
    const id = card.dataset.id;
    const coin = APP.state.coins.find(c => c.id === id);
    if (!coin) return;

    if (e.target.classList.contains('fav-btn')) {
      toggleFav(id);
      renderWatchlist();
      renderTableRows(APP.state.coins);
    } else if (e.target.classList.contains('btn-details')) {
      openCoinModal(id);
    } else if (e.target.classList.contains('btn-chart')) {
      openChartPanel(coin);
    } else {
      openChartPanel(coin);
    }
  });

  // Heatmap tile clicks
  APP.dom.heatmapGrid.addEventListener('click', (e) => {
    const tile = e.target.closest('.heat-tile[data-id]');
    if (!tile) return;
    const id = tile.dataset.id;
    const coin = APP.state.coins.find(c => c.id === id);
    if (coin) openChartPanel(coin);
  });

  // Chart panel
  APP.dom.chartClose.addEventListener('click', closeChartPanel);
  APP.dom.chartTabs.forEach(btn => {
    btn.addEventListener('click', () => switchChartTab(btn.dataset.tab));
  });

  // Modal
  APP.dom.modalClose.addEventListener('click', closeCoinModal);
  APP.dom.coinModal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) closeCoinModal();
  });
}

function switchView(view) {
  qa('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  qa('.view').forEach(v => v.classList.toggle('active', v.id === `${view}View`));
}

/* -----------------------------------------
   Section 9. Language application
   ----------------------------------------- */

function applyLang() {
  const t = APP.i18n[APP.state.lang];
  // Update nav labels
  APP.dom.navMarket.textContent = t.market;
  APP.dom.navWatchlist.textContent = t.watchlist;
  APP.dom.navHeatmap.textContent = t.heatmap;
  APP.dom.navGlobal.textContent = t.global;
  // Search placeholder
  APP.dom.searchInput.placeholder = t.searchPlaceholder;
  APP.dom.clearSearch.title = t.clear;
  // Toggles
  APP.dom.langToggle.textContent = APP.state.lang === 'ru' ? t.ru : t.en;
}

/* -----------------------------------------
   Section 10. Watchlist
   ----------------------------------------- */

function toggleFav(id) {
  if (APP.state.watchlist.has(id)) {
    APP.state.watchlist.delete(id);
  } else {
    APP.state.watchlist.add(id);
  }
  storage.setSet('watchlist', APP.state.watchlist);
}

/* -----------------------------------------
   Section 11. App bootstrap and refresh
   ----------------------------------------- */

async function refreshGlobal() {
  try {
    const g = await fetchGlobal();
    APP.state.global = g;
    renderGlobal(g);
    renderGlobalCards(g);
    APP.dom.lastUpdated.textContent = `${APP.i18n[APP.state.lang].lastUpdated}: ${fmt.time(Date.now())}`;
  } catch (e) {
    APP.dom.lastUpdated.textContent = APP.i18n[APP.state.lang].errorFetch;
  }
}

async function refreshMarket() {
  const params = {
    page: APP.state.page,
    perPage: APP.state.perPage,
    currency: APP.state.currency,
    sort: APP.state.sort,
    query: APP.state.query,
  };
  try {
    const coins = await fetchMarkets(params);
    APP.state.coins = coins;
    renderTableRows(coins);
    renderPagination();
    renderWatchlist();
    renderHeatmap();
  } catch (e) {
    APP.dom.coinsTbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-dim);padding:16px;">${fmt.esc(APP.i18n[APP.state.lang].errorFetch)}</td></tr>`;
  }
}

function loadState() {
  APP.state.currency = storage.get('currency', APP.opts.currency);
  APP.state.perPage = storage.get('perPage', APP.opts.perPage);
  APP.state.sort = storage.get('sort', APP.opts.sort);
  APP.state.lang = storage.get('lang', APP.opts.lang);
  APP.state.theme = storage.get('theme', APP.opts.theme);
  APP.state.watchlist = storage.getSet('watchlist');
  document.documentElement.dataset.theme = APP.state.theme;
}

async function bootstrap() {
  initDomRefs();
  loadState();
  applyLang();
  bindEvents();
  await refreshGlobal();
  await refreshMarket();
}

// Init
document.addEventListener('DOMContentLoaded', bootstrap);

/* -----------------------------------------
   Section 12. Extended functionality and helpers
   - Extra sorting, client-side cache, retries
   - Accessibility tweaks
   - Long code section with robust capabilities
   ----------------------------------------- */

// Simple in-memory cache for coin details
const cache = {
  coins: new Map(), // id -> details
  charts: new Map(), // id -> series
};

async function getCoinCached(id) {
  if (cache.coins.has(id)) return cache.coins.get(id);
  const c = await fetchCoin(id);
  cache.coins.set(id, c);
  return c;
}

async function getChartCached(id, vs, days) {
  const key = `${id}:${vs}:${days}`;
  if (cache.charts.has(key)) return cache.charts.get(key);
  const c = await fetchMarketChart(id, vs, days);
  cache.charts.set(key, c);
  return c;
}

// Retry wrapper
async function withRetry(fn, attempts = 2, delayMs = 500) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

// Keyboard accessibility for modal & panel
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (APP.dom.coinModal.getAttribute('aria-hidden') === 'false') {
      closeCoinModal();
    } else if (APP.dom.chartPanel.classList.contains('open')) {
      closeChartPanel();
    }
  }
});

// Advanced sorting (client-side) if needed
function clientSortCoins(coins, sortKey) {
  const map = {
    market_cap_desc: (a,b) => (b.market_cap ?? 0) - (a.market_cap ?? 0),
    market_cap_asc: (a,b) => (a.market_cap ?? 0) - (b.market_cap ?? 0),
    price_desc: (a,b) => (b.current_price ?? 0) - (a.current_price ?? 0),
    price_asc: (a,b) => (a.current_price ?? 0) - (b.current_price ?? 0),
    volume_desc: (a,b) => (b.total_volume ?? 0) - (a.total_volume ?? 0),
    volume_asc: (a,b) => (a.total_volume ?? 0) - (b.total_volume ?? 0),
    change_24h_desc: (a,b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0),
    change_24h_asc: (a,b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0),
  };
  const cmp = map[sortKey] || map.market_cap_desc;
  return [...coins].sort(cmp);
}

/* -----------------------------------------
   Section 13. Long-form enhancements
   - Extended heatmap gradient logic
   - Extra UI micro-interactions
   - Detailed error banners
   ----------------------------------------- */

function renderErrorBanner(target, msg) {
  const div = document.createElement('div');
  div.style.background = 'linear-gradient(90deg, var(--danger), rgba(255,77,79,0.2))';
  div.style.border = '1px solid var(--danger)';
  div.style.color = '#fff';
  div.style.padding = '10px';
  div.style.borderRadius = '8px';
  div.style.margin = '10px 0';
  div.textContent = msg;
  target.innerHTML = '';
  target.appendChild(div);
}

function enhanceHeatmapColors() {
  qa('.heat-tile').forEach(tile => {
    const id = tile.dataset.id;
    const c = APP.state.coins.find(x => x.id === id);
    if (!c) return;
    const ch = c.price_change_percentage_24h ?? 0;
    const intensity = fmt.clamp(Math.abs(ch) / 10, 0, 1); // 0..1
    const base = ch >= 0
      ? [0, 208, 138] // green
      : [255, 91, 91]; // red
    const bg = `linear-gradient(135deg, rgba(${base[0]},${base[1]},${base[2]},${0.15 + 0.35*intensity}), rgba(${base[0]},${base[1]},${base[2]},0.04))`;
    tile.style.background = bg;
  });
}

/* -----------------------------------------
   Section 14. Tooltips and micro UX
   ----------------------------------------- */

function attachRowTooltips() {
  qa('.row-actions .row-btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = btn.title || btn.textContent;
    });
    btn.addEventListener('mouseleave', () => {
      if (btn.dataset.originalText) {
        btn.textContent = btn.dataset.originalText;
      }
    });
  });
}

/* -----------------------------------------
   Section 15. Language-sensitive labels refresh
   ----------------------------------------- */

function refreshHeadersText() {
  const t = APP.i18n[APP.state.lang];
  const ths = qa('.coins-table thead th');
  if (ths.length >= 9) {
    ths[1].textContent = APP.state.lang === 'ru' ? 'Монета' : 'Coin';
    ths[2].textContent = t.price;
    ths[3].textContent = t.change24h;
    ths[4].textContent = t.marketCap;
    ths[5].textContent = t.volume24h;
    ths[6].textContent = t.circulating;
    ths[7].textContent = APP.state.lang === 'ru' ? 'Линия' : 'Spark';
    ths[8].textContent = APP.state.lang === 'ru' ? 'Действия' : 'Actions';
  }
}

/* -----------------------------------------
   Section 16. Extra: synthetic sparkline for missing data
   ----------------------------------------- */

function ensureSparklines() {
  qa('canvas.spark').forEach(cv => {
    const data = (cv.dataset.series || '').trim();
    if (!data) {
      // synth series
      const series = Array.from({
