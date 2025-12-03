"use strict";

// =============================
// КОНФИГ
// =============================

// CoinGecko бесплатный API без ключа
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Настройки пагинации / бесконечной прокрутки
const COINS_PER_PAGE = 20;

// API новостей — ТЕБЕ НУЖНО ВСТАВИТЬ СВОЙ КЛЮЧ
// Пример: NewsData.io (зарегистрируйся и возьми бесплатный ключ)
// Документация: https://newsdata.io/crypto-news-api
const NEWS_API_KEY = 'YOUR_NEWS_API_KEY_HERE'; // <--- сюда вставь ключ
const NEWS_API_URL = `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=crypto&language=ru&category=business,technology`;

// =============================
// УТИЛИТЫ
// =============================
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    if (num >= 1_000_000_000_000) return (num / 1_000_000_000_000).toFixed(2) + 'T';
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(2) + 'K';
    return num.toFixed(2);
}

function formatPrice(price) {
    if (price === null || price === undefined || isNaN(price)) return '—';
    if (price < 0.01) return '$' + price.toFixed(8);
    if (price < 1) return '$' + price.toFixed(4);
    return (
        '$' +
        price.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    );
}

function formatPercent(num) {
    if (num === null || num === undefined || isNaN(num)) return '—';
    const sign = num > 0 ? '+' : '';
    return sign + num.toFixed(2) + '%';
}

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function stripHtml(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return (div.textContent || div.innerText || '').trim();
}

// =============================
// ГЛОБАЛЬНОЕ СОСТОЯНИЕ
// =============================
let coinsData = [];
let currentFilteredCoins = [];
let currentPage = 1;
let isLoadingMore = false;
let currentFilterType = 'all';
let searchQuery = '';

let btcChartInstance = null;
let ethChartInstance = null;
let coinChartInstance = null;

// =============================
// ЗАГРУЗКА ПРИ СТАРТЕ
// =============================
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();

    const isCoinPage = !!document.getElementById('coin-page-root');

    if (isCoinPage) {
        // Страница отдельной монеты
        initCoinPage();
    } else {
        // Главная страница
        initTableSorting();
        initGlobalSearch();
        initFilters();
        initInfiniteScroll();

        fetchGlobalStats();
        fetchMarketData();
        initCharts();
        fetchNews();
    }
});

// =============================
// ТЕМА
// =============================
function initThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        toggle.textContent = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
    });
}

// =============================
// ГЛОБ. СТАТИСТИКА (только главная страница)
// =============================
async function fetchGlobalStats() {
    const capEl = document.getElementById('global-market-cap');
    if (!capEl) return; // значит, мы не на главной странице

    try {
        const res = await fetch(`${COINGECKO_BASE}/global`);
        if (!res.ok) throw new Error('Ошибка загрузки глобальных данных');

        const json = await res.json();
        const data = json.data || {};

        const marketCapUsd = data.total_market_cap?.usd;
        const vol24Usd = data.total_volume?.usd;
        const btcDom = data.market_cap_percentage?.btc;

        const marketCapChange24h = data.market_cap_change_percentage_24h_usd;

        capEl.textContent = marketCapUsd ? '$' + formatNumber(marketCapUsd) : '—';
        const volEl = document.getElementById('global-volume');
        if (volEl) volEl.textContent = vol24Usd ? '$' + formatNumber(vol24Usd) : '—';
        const btcDomEl = document.getElementById('btc-dominance');
        if (btcDomEl) btcDomEl.textContent = btcDom ? btcDom.toFixed(2) + '%' : '—';

        const capChangeEl = document.getElementById('global-market-cap-change');
        if (capChangeEl && marketCapChange24h !== undefined && !isNaN(marketCapChange24h)) {
            capChangeEl.textContent = formatPercent(marketCapChange24h);
            capChangeEl.classList.toggle('positive', marketCapChange24h >= 0);
            capChangeEl.classList.toggle('negative', marketCapChange24h < 0);
        }
    } catch (err) {
        console.error(err);
    }
}

// =============================
// ТАБЛИЦА КРИПТОВАЛЮТ + ПАГИНАЦИЯ
// =============================
async function fetchMarketData() {
    const tbody = document.getElementById('crypto-table-body');
    if (!tbody) return;

    try {
        const res = await fetch(
            `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=true&price_change_percentage=24h`
        );
        if (!res.ok) throw new Error('Ошибка загрузки списка монет');

        coinsData = await res.json();
        currentFilterType = 'all';
        searchQuery = '';
        applyFiltersAndRender();
    } catch (err) {
        console.error(err);
        tbody.innerHTML =
            '<tr><td colspan="8">Не удалось загрузить данные с CoinGecko. Попробуйте позже.</td></tr>';
    }
}

function applyFiltersAndRender() {
    let filtered = [...coinsData];

    // Фильтр по типу
    if (currentFilterType === 'btceth') {
        filtered = filtered.filter((c) => ['bitcoin', 'ethereum'].includes(c.id));
    } else if (currentFilterType === 'gainers') {
        filtered = filtered.filter((c) => c.price_change_percentage_24h > 0);
    } else if (currentFilterType === 'losers') {
        filtered = filtered.filter((c) => c.price_change_percentage_24h < 0);
    }

    // Поиск
    const q = searchQuery.trim().toLowerCase();
    if (q) {
        filtered = filtered.filter(
            (coin) =>
                coin.name.toLowerCase().includes(q) ||
                coin.symbol.toLowerCase().includes(q)
        );
    }

    currentFilteredCoins = filtered;
    currentPage = 1;
    renderCoinsTablePaged();
}

function renderCoinsTable(coins) {
    const tbody = document.getElementById('crypto-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    coins.forEach((coin) => {
        const tr = document.createElement('tr');

        const priceChange = coin.price_change_percentage_24h;
        const changeClass = priceChange >= 0 ? 'positive' : 'negative';
        const symbolFirst = coin.symbol ? coin.symbol[0]?.toUpperCase() : '?';

        const sparkline =
            '<div style="height: 30px; width: 100px; background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.2)); border-radius: 3px;"></div>';

        tr.innerHTML = `
            <td>${coin.market_cap_rank ?? ''}</td>
            <td>
                <a href="coin.html?id=${coin.id}" class="coin-link">
                    <div class="crypto-info">
                        <div class="crypto-icon" style="background-color: ${
                            coin.image ? 'transparent' : '#8c52ff'
                        }">
                            ${
                                coin.image
                                    ? `<img src="${coin.image}" alt="${coin.name}" style="width:24px;height:24px;border-radius:50%;" />`
                                    : symbolFirst
                            }
                        </div>
                        <div>
                            <span class="crypto-name">${coin.name}</span>
                            <span class="crypto-symbol">${coin.symbol.toUpperCase()}</span>
                        </div>
                    </div>
                </a>
            </td>
            <td>${formatPrice(coin.current_price)}</td>
            <td><span class="price-change ${changeClass}">${formatPercent(priceChange)}</span></td>
            <td>$${formatNumber(coin.total_volume)}</td>
            <td>$${formatNumber(coin.market_cap)}</td>
            <td>${sparkline}</td>
            <td><button class="watchlist-btn" data-id="${coin.id}">☆</button></td>
        `;

        tbody.appendChild(tr);
    });

    initWatchlistButtons();
}

function renderCoinsTablePaged() {
    const tbody = document.getElementById('crypto-table-body');
    if (!tbody) return;

    const total = currentFilteredCoins.length;
    const end = Math.min(currentPage * COINS_PER_PAGE, total);
    const slice = currentFilteredCoins.slice(0, end);

    renderCoinsTable(slice);

    const shownEl = document.getElementById('shown-count');
    const totalEl = document.getElementById('total-count');
    if (shownEl) shownEl.textContent = String(slice.length);
    if (totalEl) totalEl.textContent = String(total);

    isLoadingMore = false;
}

function loadMoreCoins() {
    if (isLoadingMore) return;
    const total = currentFilteredCoins.length;
    if (!total) return;

    if (currentPage * COINS_PER_PAGE >= total) return;

    isLoadingMore = true;
    currentPage += 1;
    renderCoinsTablePaged();
}

function initInfiniteScroll() {
    const tbody = document.getElementById('crypto-table-body');
    if (!tbody) return;

    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const threshold = document.body.offsetHeight - 200;

        if (scrollPosition >= threshold) {
            loadMoreCoins();
        }
    });
}

function initWatchlistButtons() {
    document.querySelectorAll('.watchlist-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            btn.classList.toggle('active');
            btn.textContent = btn.classList.contains('active') ? '★' : '☆';
        });
    });
}

// Сортировка по заголовкам (очень базовая)
function initTableSorting() {
    const headers = document.querySelectorAll('.crypto-table thead th');
    if (!headers.length) return;

    headers.forEach((th, index) => {
        th.addEventListener('click', () => {
            if (!currentFilteredCoins.length) return;
            const keyMap = {
                0: 'market_cap_rank',
                1: 'name',
                2: 'current_price',
                3: 'price_change_percentage_24h',
                4: 'total_volume',
                5: 'market_cap',
            };

            const key = keyMap[index];
            if (!key) return;

            const sorted = [...currentFilteredCoins].sort((a, b) => {
                const va = a[key];
                const vb = b[key];

                if (typeof va === 'string') {
                    return va.localeCompare(vb);
                }
                return (vb || 0) - (va || 0); // по убыванию
            });

            currentFilteredCoins = sorted;
            currentPage = 1;
            renderCoinsTablePaged();
        });
    });
}

// =============================
// ПОИСК И ФИЛЬТРЫ
// =============================
function initGlobalSearch() {
    const input = document.getElementById('globalSearch');
    if (!input) return;

    input.addEventListener('input', () => {
        searchQuery = input.value || '';
        applyFiltersAndRender();
    });
}

function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            buttons.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilterType = btn.dataset.filter || 'all';
            applyFiltersAndRender();
        });
    });
}

// =============================
// ГРАФИКИ BTC / ETH (главная)
// =============================
function initCharts() {
    const btcCanvas = document.getElementById('btcChart');
    const ethCanvas = document.getElementById('ethChart');

    if (btcCanvas) {
        setupChartWithRanges(
            'bitcoin',
            'btcChart',
            'btcChartLoading',
            'btcChartError',
            'btc-range-buttons',
            'btc-price-label',
            (chart) => {
                btcChartInstance = chart;
            }
        );
    }

    if (ethCanvas) {
        setupChartWithRanges(
            'ethereum',
            'ethChart',
            'ethChartLoading',
            'ethChartError',
            'eth-range-buttons',
            'eth-price-label',
            (chart) => {
                ethChartInstance = chart;
            }
        );
    }
}

function setupChartWithRanges(
    coinId,
    canvasId,
    loadingId,
    errorId,
    buttonsContainerId,
    priceLabelId,
    setChartInstance
) {
    const canvas = document.getElementById(canvasId);
    const loadingEl = document.getElementById(loadingId);
    const errorEl = document.getElementById(errorId);
    const buttonsContainer = document.getElementById(buttonsContainerId);
    const priceLabel = document.getElementById(priceLabelId);

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    async function loadChart(days) {
        if (loadingEl) loadingEl.style.display = 'flex';
        if (errorEl) errorEl.textContent = '';

        try {
            const res = await fetch(
                `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
            );
            if (!res.ok) throw new Error('Ошибка загрузки графика');

            const json = await res.json();
            const prices = json.prices || [];

            const labels = prices.map((p) =>
                new Date(p[0]).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                })
            );
            const values = prices.map((p) => p[1]);

            const lastPrice = values[values.length - 1];
            if (priceLabel && lastPrice) {
                priceLabel.textContent = `· Текущая цена: ${formatPrice(lastPrice)}`;
            }

            const chartData = {
                labels,
                datasets: [
                    {
                        label: `${coinId.toUpperCase()} / USD`,
                        data: values,
                        tension: 0.2,
                        borderWidth: 2,
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
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Цена: ${formatPrice(context.parsed.y)}`,
                        },
                    },
                },
            };

            if (canvas._chartInstance) {
                canvas._chartInstance.destroy();
            }

            const chart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: chartOptions,
            });

            canvas._chartInstance = chart;
            if (typeof setChartInstance === 'function') {
                setChartInstance(chart);
            }
        } catch (err) {
            console.error(err);
            if (errorEl) {
                errorEl.textContent =
                    'Не удалось загрузить данные графика. Попробуйте позже.';
            }
        } finally {
            if (loadingEl) loadingEl.style.display = 'none';
        }
    }

    if (buttonsContainer) {
        buttonsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.chart-option');
            if (!btn) return;

            buttonsContainer
                .querySelectorAll('.chart-option')
                .forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            const days = btn.dataset.range || '1';
            loadChart(days);
        });
    }

    loadChart(1);
}

// =============================
// СТРАНИЦА ОТДЕЛЬНОЙ МОНЕТЫ
// =============================
async function initCoinPage() {
    const coinId = getQueryParam('id');
    const nameEl = document.getElementById('coin-name');

    if (!coinId) {
        if (nameEl) nameEl.textContent = 'Не указана монета';
        return;
    }

    await fetchCoinDetails(coinId);
    initCoinChart(coinId);
}

async function fetchCoinDetails(coinId) {
    const logoEl = document.getElementById('coin-logo');
    const nameEl = document.getElementById('coin-name');
    const symbolEl = document.getElementById('coin-symbol');
    const rankEl = document.getElementById('coin-rank');
    const priceEl = document.getElementById('coin-price');
    const changeEl = document.getElementById('coin-change-24h');
    const mcapEl = document.getElementById('coin-market-cap');
    const volEl = document.getElementById('coin-volume');
    const supplyEl = document.getElementById('coin-supply');
    const descEl = document.getElementById('coin-description');
    const chartTitleEl = document.getElementById('coin-chart-title');

    try {
        const res = await fetch(
            `${COINGECKO_BASE}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        if (!res.ok) throw new Error('Ошибка загрузки монеты');

        const data = await res.json();

        if (logoEl && data.image?.large) {
            logoEl.src = data.image.large;
            logoEl.alt = data.name || coinId;
        }

        if (nameEl) nameEl.textContent = data.name || coinId;
        if (symbolEl && data.symbol) symbolEl.textContent = data.symbol.toUpperCase();
        if (rankEl) rankEl.textContent = data.market_cap_rank ? `#${data.market_cap_rank}` : '#—';

        const md = data.market_data || {};
        if (priceEl && md.current_price?.usd != null) {
            priceEl.textContent = formatPrice(md.current_price.usd);
        }

        if (changeEl) {
            const ch = md.price_change_percentage_24h;
            if (ch != null && !isNaN(ch)) {
                changeEl.textContent = formatPercent(ch);
                changeEl.classList.toggle('positive', ch >= 0);
                changeEl.classList.toggle('negative', ch < 0);
            } else {
                changeEl.textContent = '—';
            }
        }

        if (mcapEl && md.market_cap?.usd != null) {
            mcapEl.textContent = '$' + formatNumber(md.market_cap.usd);
        }
        if (volEl && md.total_volume?.usd != null) {
            volEl.textContent = '$' + formatNumber(md.total_volume.usd);
        }
        if (supplyEl && md.circulating_supply != null) {
            supplyEl.textContent = formatNumber(md.circulating_supply);
        }

        let desc =
            data.description?.ru ||
            data.description?.en ||
            'Описание недоступно.';
        desc = stripHtml(desc);
        if (desc.length > 1200) {
            desc = desc.slice(0, 1200) + '...';
        }
        if (descEl) descEl.textContent = desc;

        if (chartTitleEl && data.name && data.symbol) {
            chartTitleEl.textContent = `${data.name} (${data.symbol.toUpperCase()})`;
        }
    } catch (err) {
        console.error(err);
        if (descEl) {
            descEl.textContent =
                'Не удалось загрузить данные монеты. Попробуйте обновить страницу позже.';
        }
    }
}

function initCoinChart(coinId) {
    const canvas = document.getElementById('coinChart');
    if (!canvas) return;

    setupChartWithRanges(
        coinId,
        'coinChart',
        'coinChartLoading',
        'coinChartError',
        'coin-range-buttons',
        'coin-price-label',
        (chart) => {
            coinChartInstance = chart;
        }
    );
}

// =============================
// НОВОСТИ (только главная)
// =============================
async function fetchNews() {
    const statusEl = document.getElementById('news-status');
    const grid = document.getElementById('news-grid');
    const link = document.getElementById('newsSourceLink');

    if (!grid || !statusEl) return;

    if (!NEWS_API_KEY || NEWS_API_KEY === 'YOUR_NEWS_API_KEY_HERE') {
        statusEl.textContent =
            'Чтобы загрузить реальные новости, получи бесплатный API ключ (например, NewsData.io) и вставь его в script.js в переменную NEWS_API_KEY.';
        if (link) {
            link.textContent = 'Как получить ключ NewsData.io';
            link.href = 'https://newsdata.io/crypto-news-api';
        }
        return;
    }

    statusEl.textContent = 'Загружаем новости...';
    if (link) {
        link.textContent = 'NewsData.io';
        link.href = 'https://newsdata.io/';
    }

    try {
        const res = await fetch(NEWS_API_URL);
        if (!res.ok) throw new Error('Ошибка загрузки новостей');

        const json = await res.json();
        const articles = json.results || [];

        if (!articles.length) {
            statusEl.textContent = 'Новости не найдены.';
            return;
        }

        statusEl.textContent = '';
        grid.innerHTML = '';

        articles.slice(0, 9).forEach((article) => {
            const card = document.createElement('article');
            card.className = 'news-card';

            const imgTitle = article.source_id || 'Crypto';

            const pubDate = article.pubDate
                ? new Date(article.pubDate).toLocaleString('ru-RU')
                : '';

            card.innerHTML = `
                <div class="news-image">
                    ${imgTitle.toUpperCase()}
                </div>
                <div class="news-content">
                    <h3 class="news-title">${article.title || 'Без заголовка'}</h3>
                    <p class="news-description">
                        ${
                            article.description
                                ? article.description.slice(0, 160) + '...'
                                : ''
                        }
                    </p>
                    <div class="news-meta">
                        <span>${article.source_id || 'Источник'}</span>
                        <span>${pubDate}</span>
                    </div>
                    ${
                        article.link
                            ? `<a href="${article.link}" target="_blank" rel="noopener noreferrer" class="news-link">Читать полностью →</a>`
                            : ''
                    }
                </div>
            `;

            grid.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        statusEl.textContent =
            'Не удалось загрузить новости. Проверь API ключ или попробуй позже.';
    }
}