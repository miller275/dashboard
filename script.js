"use strict";

// =====================
// CONFIG
// =====================

const PAPRIKA_BASE = "https://api.coinpaprika.com/v1";

// News API (опционально, нужно вставить свой ключ)
const NEWS_API_KEY = "YOUR_NEWS_API_KEY_HERE";
const NEWS_API_URL = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=crypto&language=ru,en&category=business,technology`;

// Pagination / infinite scroll
const COINS_PER_PAGE = 20;

// =====================
// I18N
// =====================

const I18N = {
  ru: {
    nav_cryptos: "Криптовалюты",
    nav_charts: "Графики",
    nav_news: "Новости",
    nav_portfolio: "Портфель",
    nav_products: "Продукты",
    search_placeholder: "Поиск по монетам...",
    hero_title: "Отслеживайте криптовалюты в реальном времени",
    hero_subtitle:
      "Получайте актуальные данные о ценах, капитализации и объемах торгов для ведущих криптовалют.",
    hero_cta_primary: "Начать сейчас",
    hero_cta_secondary: "Узнать больше",
    stat_market_cap: "Рыночная капитализация",
    stat_volume_24h: "Объём за 24ч",
    stat_btc_dominance: "Доминирование BTC",
    stat_market_info: "Рынок",
    section_cryptos_title: "Топ криптовалют",
    section_cryptos_shown_prefix: "Показано",
    section_cryptos_of: "из",
    filter_all: "Все",
    filter_btceth: "BTC + ETH",
    filter_gainers: "Рост за 24ч",
    filter_losers: "Падение за 24ч",
    th_rank: "#",
    th_name: "Название",
    th_price: "Цена",
    th_change_24h: "Изменение 24ч",
    th_volume_24h: "Объём 24ч",
    th_market_cap: "Капитализация",
    th_7d: "7д",
    table_note:
      "Данные предоставлены CoinPaprika API. Листайте вниз, чтобы загрузить больше монет.",
    section_charts_title: "Графики цен",
    chart_btc_title: "Bitcoin (BTC)",
    chart_eth_title: "Ethereum (ETH)",
    chart_range_1d: "24ч",
    chart_range_7d: "7д",
    chart_range_30d: "1м",
    chart_range_90d: "3м",
    chart_range_365d: "1г",
    chart_loading: "Загрузка графика...",
    section_news_title: "Новости криптовалют",
    footer_about:
      "Платформа для отслеживания криптовалютных рынков в реальном времени.",
    footer_products: "Продукты",
    footer_exchanges: "Биржи",
    footer_portfolio: "Портфель",
    footer_nft: "NFT",
    footer_company: "Компания",
    footer_about_link: "О нас",
    footer_blog: "Блог",
    footer_data_source: "Данные: CoinPaprika API, новости: внешний API.",
    breadcrumb_back: "← Назад к списку монет",
    coin_market_cap: "Капитализация:",
    coin_volume_24h: "Объём (24ч):",
    coin_supply: "В обращении:",
    coin_chart_title: "График цены",
    coin_description_title: "Описание проекта",
    news_status_need_key:
      "Чтобы загрузить реальные новости, добавь API ключ в script.js в переменную NEWS_API_KEY.",
    news_status_loading: "Загружаем новости...",
    news_status_empty: "Новости не найдены.",
    news_status_error:
      "Не удалось загрузить новости. Проверь API ключ или попробуй позже.",
    news_read_more: "Читать полностью →",
  },
  en: {
    nav_cryptos: "Cryptos",
    nav_charts: "Charts",
    nav_news: "News",
    nav_portfolio: "Portfolio",
    nav_products: "Products",
    search_placeholder: "Search coins...",
    hero_title: "Track cryptocurrencies in real time",
    hero_subtitle:
      "Get up‑to‑date prices, market caps and trading volumes for leading cryptocurrencies.",
    hero_cta_primary: "Get started",
    hero_cta_secondary: "Learn more",
    stat_market_cap: "Market cap",
    stat_volume_24h: "24h volume",
    stat_btc_dominance: "BTC dominance",
    stat_market_info: "Market",
    section_cryptos_title: "Top cryptocurrencies",
    section_cryptos_shown_prefix: "Shown",
    section_cryptos_of: "of",
    filter_all: "All",
    filter_btceth: "BTC + ETH",
    filter_gainers: "24h gainers",
    filter_losers: "24h losers",
    th_rank: "#",
    th_name: "Name",
    th_price: "Price",
    th_change_24h: "24h change",
    th_volume_24h: "24h volume",
    th_market_cap: "Market cap",
    th_7d: "7d",
    table_note:
      "Data from CoinPaprika API. Scroll down to load more coins.",
    section_charts_title: "Price charts",
    chart_btc_title: "Bitcoin (BTC)",
    chart_eth_title: "Ethereum (ETH)",
    chart_range_1d: "24h",
    chart_range_7d: "7d",
    chart_range_30d: "1m",
    chart_range_90d: "3m",
    chart_range_365d: "1y",
    chart_loading: "Loading chart...",
    section_news_title: "Crypto news",
    footer_about:
      "A platform for tracking cryptocurrency markets in real time.",
    footer_products: "Products",
    footer_exchanges: "Exchanges",
    footer_portfolio: "Portfolio",
    footer_nft: "NFT",
    footer_company: "Company",
    footer_about_link: "About",
    footer_blog: "Blog",
    footer_data_source: "Data: CoinPaprika API, news: external API.",
    breadcrumb_back: "← Back to list",
    coin_market_cap: "Market cap:",
    coin_volume_24h: "Volume (24h):",
    coin_supply: "Circulating supply:",
    coin_chart_title: "Price chart",
    coin_description_title: "Project description",
    news_status_need_key:
      "To load real news, add an API key into NEWS_API_KEY in script.js.",
    news_status_loading: "Loading news...",
    news_status_empty: "No news found.",
    news_status_error:
      "Failed to load news. Check API key or try again later.",
    news_read_more: "Read full article →",
  },
};

let currentLang = "ru";

// =====================
// State
// =====================

let coinsData = [];
let filteredCoins = [];
let currentPage = 1;
let isLoadingMore = false;
let currentFilter = "all";
let searchQuery = "";

let btcChartInstance = null;
let ethChartInstance = null;
let coinChartInstance = null;

// =====================
// Helpers
// =====================

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function formatNumber(num) {
  if (num == null || isNaN(num)) return "—";
  if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2) + "T";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(2) + "K";
  return num.toFixed(2);
}

function formatPrice(price) {
  if (price == null || isNaN(price)) return "—";
  if (price < 0.01) return "$" + price.toFixed(8);
  if (price < 1) return "$" + price.toFixed(4);
  return (
    "$" +
    price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function formatPercent(num) {
  if (num == null || isNaN(num)) return "—";
  const sign = num > 0 ? "+" : "";
  return sign + num.toFixed(2) + "%";
}

function stripHtml(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
}

// =====================
// I18N functions
// =====================

function applyI18n() {
  const dict = I18N[currentLang] || I18N.ru;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const text = dict[key];
    if (text) el.textContent = text;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const text = dict[key];
    if (text) el.setAttribute("placeholder", text);
  });

  const labelEl = document.getElementById("currentLangLabel");
  if (labelEl) labelEl.textContent = currentLang.toUpperCase();
}

function initLanguageSwitcher() {
  const toggle = document.getElementById("langToggle");
  const menu = document.getElementById("langMenu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    menu.classList.toggle("open");
  });

  menu.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-lang]");
    if (!btn) return;
    const lang = btn.getAttribute("data-lang");
    currentLang = lang === "en" ? "en" : "ru";
    localStorage.setItem("cw_lang", currentLang);
    menu.classList.remove("open");
    applyI18n();
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove("open");
    }
  });
}

// =====================
// Theme
// =====================

function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
  });
}

// =====================
// Global stats
// =====================

async function fetchGlobalStats() {
  // У CoinPaprika нет /global как у CoinGecko. Сымитируем на основе тикеров.
  try {
    const res = await fetch(PAPRIKA_BASE + "/global");
    if (!res.ok) throw new Error("no global");
    const data = await res.json();

    const dict = {
      market_cap_usd: data.market_cap_usd,
      volume_24h_usd: data.volume_24h_usd,
      bitcoin_dominance_percentage: data.bitcoin_dominance_percentage,
    };

    const capEl = document.getElementById("global-market-cap");
    const volEl = document.getElementById("global-volume");
    const btcDomEl = document.getElementById("btc-dominance");

    if (capEl && dict.market_cap_usd != null)
      capEl.textContent = "$" + formatNumber(dict.market_cap_usd);
    if (volEl && dict.volume_24h_usd != null)
      volEl.textContent = "$" + formatNumber(dict.volume_24h_usd);
    if (btcDomEl && dict.bitcoin_dominance_percentage != null)
      btcDomEl.textContent = dict.bitcoin_dominance_percentage.toFixed(2) + "%";
  } catch (e) {
    // Если /global нет, просто тихо игнорируем
    console.warn("Global stats not available", e);
  }
}

// =====================
// Coins list
// =====================

async function fetchMarketData() {
  const tbody = document.getElementById("crypto-table-body");
  if (!tbody) return;

  try {
    const res = await fetch(PAPRIKA_BASE + "/tickers?quotes=USD");
    if (!res.ok) throw new Error("tickers error");
    const data = await res.json();

    // sort by rank
    data.sort((a, b) => (a.rank || 999999) - (b.rank || 999999));
    coinsData = data;
    currentFilter = "all";
    searchQuery = "";
    applyFiltersAndRender();
  } catch (e) {
    console.error(e);
    tbody.innerHTML =
      '<tr><td colspan="8">Failed to load data from CoinPaprika API.</td></tr>';
  }
}

function applyFiltersAndRender() {
  let arr = [...coinsData];

  if (currentFilter === "btceth") {
    arr = arr.filter((c) => c.id === "btc-bitcoin" || c.id === "eth-ethereum");
  } else if (currentFilter === "gainers") {
    arr = arr.filter(
      (c) => c.quotes && c.quotes.USD && c.quotes.USD.percent_change_24h > 0
    );
  } else if (currentFilter === "losers") {
    arr = arr.filter(
      (c) => c.quotes && c.quotes.USD && c.quotes.USD.percent_change_24h < 0
    );
  }

  const q = searchQuery.trim().toLowerCase();
  if (q) {
    arr = arr.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.symbol && c.symbol.toLowerCase().includes(q))
    );
  }

  filteredCoins = arr;
  currentPage = 1;
  renderCoinsTablePaged();
}

function renderCoinsTablePaged() {
  const total = filteredCoins.length;
  const end = Math.min(total, currentPage * COINS_PER_PAGE);
  const slice = filteredCoins.slice(0, end);
  renderCoinsTable(slice);

  const shownEl = document.getElementById("shown-count");
  const totalEl = document.getElementById("total-count");
  if (shownEl) shownEl.textContent = String(slice.length);
  if (totalEl) totalEl.textContent = String(total);

  isLoadingMore = false;
}

function renderCoinsTable(coins) {
  const tbody = document.getElementById("crypto-table-body");
  if (!tbody) return;
  tbody.innerHTML = "";

  coins.forEach((coin) => {
    const tr = document.createElement("tr");
    const q = coin.quotes && coin.quotes.USD ? coin.quotes.USD : {};
    const price = q.price;
    const volume = q.volume_24h;
    const marketCap = q.market_cap;
    const change24h = q.percent_change_24h;

    const changeClass =
      change24h == null ? "" : change24h >= 0 ? "positive" : "negative";

    const symbolFirst = (coin.symbol || "?").charAt(0).toUpperCase();

    tr.innerHTML = `
      <td>${coin.rank || ""}</td>
      <td>
        <a href="coin.html?id=${coin.id}">
          <div class="crypto-info">
            <div class="crypto-icon">
              ${symbolFirst}
            </div>
            <div>
              <div class="crypto-name">${coin.name || coin.id}</div>
              <div class="crypto-symbol">${(coin.symbol || "").toUpperCase()}</div>
            </div>
          </div>
        </a>
      </td>
      <td>${formatPrice(price)}</td>
      <td><span class="price-change ${changeClass}">${formatPercent(
      change24h
    )}</span></td>
      <td>$${formatNumber(volume)}</td>
      <td>$${formatNumber(marketCap)}</td>
      <td><canvas class="sparkline" width="100" height="30" data-coin-id="${
        coin.id
      }"></canvas></td>
      <td><button class="watchlist-btn" data-id="${coin.id}">☆</button></td>
    `;

    tbody.appendChild(tr);
  });

  initWatchlistButtons();
  initSparklines();
}

function loadMoreCoins() {
  if (isLoadingMore) return;
  const total = filteredCoins.length;
  if (!total) return;
  if (currentPage * COINS_PER_PAGE >= total) return;

  isLoadingMore = true;
  currentPage += 1;
  renderCoinsTablePaged();
}

function initInfiniteScroll() {
  window.addEventListener("scroll", () => {
    const pos = window.scrollY + window.innerHeight;
    const threshold = document.body.offsetHeight - 200;
    if (pos >= threshold) {
      loadMoreCoins();
    }
  });
}

function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter || "all";
      applyFiltersAndRender();
    });
  });
}

function initSearch() {
  const input = document.getElementById("globalSearch");
  if (!input) return;
  input.addEventListener("input", () => {
    searchQuery = input.value || "";
    applyFiltersAndRender();
  });
}

function initTableSorting() {
  const headers = document.querySelectorAll(".crypto-table thead th");
  if (!headers.length) return;
  headers.forEach((th, index) => {
    th.addEventListener("click", () => {
      const keyMap = {
        0: "rank",
        1: "name",
        2: "price",
        3: "change",
        4: "volume",
        5: "market_cap",
      };
      const key = keyMap[index];
      if (!key) return;

      const arr = [...filteredCoins];
      arr.sort((a, b) => {
        const qa = a.quotes?.USD || {};
        const qb = b.quotes?.USD || {};
        let va, vb;
        switch (key) {
          case "rank":
            va = a.rank ?? 999999;
            vb = b.rank ?? 999999;
            break;
          case "name":
            va = a.name || "";
            vb = b.name || "";
            return va.localeCompare(vb);
          case "price":
            va = qa.price ?? 0;
            vb = qb.price ?? 0;
            break;
          case "change":
            va = qa.percent_change_24h ?? 0;
            vb = qb.percent_change_24h ?? 0;
            break;
          case "volume":
            va = qa.volume_24h ?? 0;
            vb = qb.volume_24h ?? 0;
            break;
          case "market_cap":
            va = qa.market_cap ?? 0;
            vb = qb.market_cap ?? 0;
            break;
          default:
            va = 0;
            vb = 0;
        }
        return vb - va;
      });
      filteredCoins = arr;
      currentPage = 1;
      renderCoinsTablePaged();
    });
  });
}

function initWatchlistButtons() {
  document.querySelectorAll(".watchlist-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      btn.textContent = btn.classList.contains("active") ? "★" : "☆";
    });
  });
}

// =====================
// Sparklines
// =====================

async function initSparklines() {
  const canvases = document.querySelectorAll("canvas.sparkline");
  if (!canvases.length) return;

  const now = new Date();
  const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startStr = startDate.toISOString().slice(0, 10);

  canvases.forEach(async (canvas, idx) => {
    const coinId = canvas.dataset.coinId;
    if (!coinId) return;
    // Ограничим число запросов (например, только первые 60 монет)
    if (idx > 60) return;

    try {
      const url =
        PAPRIKA_BASE +
        `/tickers/${coinId}/historical?start=${startStr}&interval=1d&limit=7`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("sparkline error");
      const data = await res.json();
      const prices = (data || []).map((p) => p.price).filter((v) => v != null);
      if (!prices.length) return;
      drawSparkline(canvas, prices);
    } catch (e) {
      // просто не рисуем
      console.warn("sparkline failed", coinId, e);
    }
  });
}

function drawSparkline(canvas, values) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#22c55e";

  ctx.beginPath();
  values.forEach((v, i) => {
    const x = (i / (values.length - 1 || 1)) * (w - 4) + 2;
    const norm = (v - min) / range;
    const y = h - norm * (h - 4) - 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

// =====================
// Charts (BTC / ETH / coin)
// =====================

function initCharts() {
  const btcCanvas = document.getElementById("btcChart");
  const ethCanvas = document.getElementById("ethChart");

  if (btcCanvas) {
    setupChartWithRanges(
      "btc-bitcoin",
      "btcChart",
      "btcChartLoading",
      "btcChartError",
      "btc-range-buttons",
      "btc-price-label",
      (chart) => (btcChartInstance = chart)
    );
  }

  if (ethCanvas) {
    setupChartWithRanges(
      "eth-ethereum",
      "ethChart",
      "ethChartLoading",
      "ethChartError",
      "eth-range-buttons",
      "eth-price-label",
      (chart) => (ethChartInstance = chart)
    );
  }
}

function getIntervalForDays(days) {
  const d = Number(days) || 1;
  if (d <= 2) return "1h";
  if (d <= 7) return "2h";
  if (d <= 30) return "4h";
  if (d <= 90) return "12h";
  return "1d";
}

function setupChartWithRanges(
  coinId,
  canvasId,
  loadingId,
  errorId,
  buttonsId,
  priceLabelId,
  storeInstance
) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const loadingEl = document.getElementById(loadingId);
  const errorEl = document.getElementById(errorId);
  const buttons = document.getElementById(buttonsId);
  const priceLabel = document.getElementById(priceLabelId);
  const ctx = canvas.getContext("2d");

  async function loadChart(days) {
    if (loadingEl) loadingEl.style.display = "flex";
    if (errorEl) errorEl.textContent = "";

    try {
      const now = new Date();
      const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      const startStr = start.toISOString().slice(0, 10);
      const interval = getIntervalForDays(days);

      const url =
        PAPRIKA_BASE +
        `/tickers/${coinId}/historical?start=${startStr}&interval=${interval}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("chart error");
      const data = await res.json();

      const labels = data.map((p) =>
        new Date(p.timestamp).toLocaleDateString(currentLang === "ru" ? "ru-RU" : "en-US", {
          day: "2-digit",
          month: "2-digit",
        })
      );
      const values = data.map((p) => p.price);

      const lastPrice = values[values.length - 1];
      if (priceLabel && lastPrice != null) {
        priceLabel.textContent = "· " + formatPrice(lastPrice);
      }

      const chartData = {
        labels,
        datasets: [
          {
            label: coinId,
            data: values,
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 0,
          },
        ],
      };

      const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              maxTicksLimit: 8,
            },
          },
          y: {
            ticks: {
              callback: (value) => formatNumber(value),
            },
          },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => formatPrice(ctx.parsed.y),
            },
          },
        },
      };

      if (canvas._chartInstance) {
        canvas._chartInstance.destroy();
      }

      const chart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions,
      });

      canvas._chartInstance = chart;
      if (typeof storeInstance === "function") storeInstance(chart);
    } catch (e) {
      console.error(e);
      if (errorEl) {
        const dict = I18N[currentLang] || I18N.ru;
        errorEl.textContent =
          (dict.chart_loading || "Chart loading error") + " (API)";
      }
    } finally {
      if (loadingEl) loadingEl.style.display = "none";
    }
  }

  if (buttons) {
    buttons.addEventListener("click", (e) => {
      const btn = e.target.closest(".chart-btn");
      if (!btn) return;
      buttons.querySelectorAll(".chart-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const days = Number(btn.dataset.range || 1);
      loadChart(days);
    });
  }

  loadChart(1);
}

// Coin page

async function initCoinPage() {
  const coinId = getQueryParam("id");
  if (!coinId) return;

  await fetchCoinDetails(coinId);
  setupChartWithRanges(
    coinId,
    "coinChart",
    "coinChartLoading",
    "coinChartError",
    "coin-range-buttons",
    "coin-price-label",
    (chart) => (coinChartInstance = chart)
  );
}

async function fetchCoinDetails(coinId) {
  const logoEl = document.getElementById("coin-logo");
  const nameEl = document.getElementById("coin-name");
  const symbolEl = document.getElementById("coin-symbol");
  const rankEl = document.getElementById("coin-rank");
  const priceEl = document.getElementById("coin-price");
  const changeEl = document.getElementById("coin-change-24h");
  const capEl = document.getElementById("coin-market-cap");
  const volEl = document.getElementById("coin-volume");
  const supplyEl = document.getElementById("coin-supply");
  const descEl = document.getElementById("coin-description");
  const chartTitleEl = document.getElementById("coin-chart-title");

  try {
    const res = await fetch(
      PAPRIKA_BASE +
        `/coins/${coinId}`
    );
    if (!res.ok) throw new Error("coin meta error");
    const meta = await res.json();

    const tickerRes = await fetch(
      PAPRIKA_BASE + `/tickers/${coinId}?quotes=USD`
    );
    if (!tickerRes.ok) throw new Error("coin ticker error");
    const ticker = await tickerRes.json();
    const q = ticker.quotes && ticker.quotes.USD ? ticker.quotes.USD : {};

    if (logoEl && meta.logo) {
      logoEl.src = meta.logo;
      logoEl.alt = meta.name || coinId;
    }
    if (nameEl) nameEl.textContent = meta.name || coinId;
    if (symbolEl) symbolEl.textContent = (meta.symbol || "").toUpperCase();
    if (rankEl) rankEl.textContent = meta.rank ? "#" + meta.rank : "#—";

    if (priceEl) priceEl.textContent = formatPrice(q.price);
    if (changeEl) {
      const ch = q.percent_change_24h;
      changeEl.textContent = formatPercent(ch);
      changeEl.classList.toggle("positive", ch >= 0);
      changeEl.classList.toggle("negative", ch < 0);
    }
    if (capEl) capEl.textContent = "$" + formatNumber(q.market_cap);
    if (volEl) volEl.textContent = "$" + formatNumber(q.volume_24h);
    if (supplyEl) supplyEl.textContent = formatNumber(ticker.circulating_supply);

    let desc = "";
    if (currentLang === "ru" && meta.description) {
      desc = meta.description;
    } else if (meta.description) {
      desc = meta.description;
    }
    desc = stripHtml(desc);
    if (!desc) {
      desc =
        currentLang === "ru"
          ? "Описание недоступно."
          : "Description is not available.";
    }
    if (desc.length > 1500) desc = desc.slice(0, 1500) + "...";
    if (descEl) descEl.textContent = desc;

    if (chartTitleEl) {
      chartTitleEl.textContent = `${meta.name || coinId} (${(meta.symbol || "").toUpperCase()})`;
    }
  } catch (e) {
    console.error(e);
    if (descEl) {
      descEl.textContent =
        currentLang === "ru"
          ? "Не удалось загрузить данные монеты. Попробуй позже."
          : "Failed to load coin data. Please try again later.";
    }
  }
}

// =====================
// News
// =====================

async function fetchNews() {
  const statusEl = document.getElementById("news-status");
  const grid = document.getElementById("news-grid");
  const link = document.getElementById("newsSourceLink");
  if (!statusEl || !grid) return;

  const dict = I18N[currentLang] || I18N.ru;

  if (!NEWS_API_KEY || NEWS_API_KEY === "YOUR_NEWS_API_KEY_HERE") {
    statusEl.textContent = dict.news_status_need_key;
    if (link) {
      link.textContent = "NewsData.io";
      link.href = "https://newsdata.io/";
    }
    return;
  }

  statusEl.textContent = dict.news_status_loading;
  if (link) {
    link.textContent = "NewsData.io";
    link.href = "https://newsdata.io/";
  }

  try {
    const res = await fetch(NEWS_API_URL);
    if (!res.ok) throw new Error("news error");
    const data = await res.json();
    const articles = data.results || [];
    if (!articles.length) {
      statusEl.textContent = dict.news_status_empty;
      return;
    }
    statusEl.textContent = "";
    grid.innerHTML = "";

    articles.slice(0, 9).forEach((a) => {
      const card = document.createElement("article");
      card.className = "news-card";

      const title = a.title || "—";
      const desc = a.description || "";
      const src = a.source_id || "Source";
      const pub = a.pubDate
        ? new Date(a.pubDate).toLocaleString(
            currentLang === "ru" ? "ru-RU" : "en-US"
          )
        : "";

      card.innerHTML = `
        <div class="news-title">${title}</div>
        <div class="news-description">${desc.slice(0, 160)}${
        desc.length > 160 ? "..." : ""
      }</div>
        <div class="news-meta">
          <span>${src}</span>
          <span>${pub}</span>
        </div>
        ${
          a.link
            ? `<a href="${a.link}" target="_blank" rel="noopener noreferrer" class="news-link">${dict.news_read_more}</a>`
            : ""
        }
      `;
      grid.appendChild(card);
    });
  } catch (e) {
    console.error(e);
    statusEl.textContent = dict.news_status_error;
  }
}

// =====================
// DOMContentLoaded
// =====================

document.addEventListener("DOMContentLoaded", () => {
  // language
  const savedLang = localStorage.getItem("cw_lang");
  if (savedLang === "en" || savedLang === "ru") {
    currentLang = savedLang;
  }
  initLanguageSwitcher();
  applyI18n();

  initThemeToggle();

  const isCoinPage = !!document.getElementById("coin-page-root");
  if (isCoinPage) {
    initCoinPage();
  } else {
    initSearch();
    initFilters();
    initInfiniteScroll();
    initTableSorting();

    fetchGlobalStats();
    fetchMarketData();
    initCharts();
    fetchNews();
  }
});
