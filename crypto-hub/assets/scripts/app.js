(() => {
  const state = {
    page: 1,
    perPage: 25,
    sort: 'market_cap_desc',
    currency: localStorage.getItem('currency') || 'usd',
    theme: localStorage.getItem('theme') || 'dark',
    lang: localStorage.getItem('lang') || 'ru',
    query: '',
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    coins: [],
    lastFetched: 0,
    labels: i18n.get(localStorage.getItem('lang') || 'ru').grid,
  };

  const $view = document.getElementById('view');
  const $toolbar = document.getElementById('toolbar');
  const $apiStatus = document.getElementById('apiStatus');
  const $refresh = document.getElementById('refresh');

  const setState = (patch, reFetch = false) => {
    Object.assign(state, patch);
    localStorage.setItem('currency', state.currency);
    localStorage.setItem('theme', state.theme);
    localStorage.setItem('lang', state.lang);
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    state.labels = i18n.get(state.lang).grid;

    syncTheme();
    renderToolbar();
    renderCurrentRoute(reFetch);
  };

  const syncTheme = () => {
    if (state.theme === 'light') document.body.classList.add('theme-light');
    else document.body.classList.remove('theme-light');
  };

  const renderToolbar = () => {
    const node = Toolbar.render(state, (patch) => {
      const needRefetch = !!(patch.currency || patch.sort || patch.perPage);
      setState(patch, needRefetch);
    }, () => location.hash = '#/favorites');
    dom.mount(node, $toolbar);
  };

  const renderHome = async () => {
    // cache-aware
    const key = `markets:${state.currency}:${state.page}:${state.perPage}:${state.sort}`;
    const cached = cache.get(key);
    if (cached) {
      state.coins = cached;
      $apiStatus.textContent = 'OK(cached)';
      mountHome();
      return;
    }
    try {
      $apiStatus.textContent = 'загрузка…';
      const data = await throttler.push(() => CG.markets({
        page: state.page,
        perPage: state.perPage,
        currency: state.currency,
        sort: state.sort
      }));
      state.coins = data;
      cache.set(key, data, 90 * 1000); // TTL 90s
      $apiStatus.textContent = 'OK';
      mountHome();
    } catch (e) {
      console.error(e);
      $apiStatus.textContent = 'ошибка';
      mountError();
    }
  };

  const mountHome = () => {
    const dict = i18n.get(state.lang);
    const filtered = state.query
      ? state.coins.filter(c =>
          c.name.toLowerCase().includes(state.query) ||
          c.symbol.toLowerCase().includes(state.query))
      : state.coins;

    const grid = Grid.render(filtered, { ...state, labels: dict.grid }, (id) => openCoin(id), (id) => toggleFavorite(id));
    const pagination = Pagination.render({ page: state.page, perPage: state.perPage, labels: dict.pagination }, (patch) => setState(patch, true));
    const view = dom.el(`<div class="view-home"></div>`);
    view.appendChild(grid);
    view.appendChild(pagination);
    dom.mount(view, $view);
  };

  const renderFavorites = async () => {
    const dict = i18n.get(state.lang);
    const key = `favorites:${state.currency}:${state.sort}`;
    let favMarkets = cache.get(key);
    if (!favMarkets) {
      try {
        $apiStatus.textContent = 'загрузка…';
        // Fetch multiple pages to find favorites quickly (simple approach)
        const marketsPage1 = await throttler.push(() => CG.markets({ page: 1, perPage: 100, currency: state.currency, sort: state.sort }));
        favMarkets = marketsPage1.filter(c => state.favorites.includes(c.id));
        cache.set(key, favMarkets, 120 * 1000);
        $apiStatus.textContent = 'OK';
      } catch (e) {
        console.error(e);
        $apiStatus.textContent = 'ошибка';
        favMarkets = [];
      }
    }
    const grid = Grid.render(favMarkets, { ...state, labels: dict.grid }, (id) => openCoin(id), (id) => toggleFavorite(id));
    const view = dom.el(`<div class="view-favorites"></div>`);
    view.appendChild(grid);
    dom.mount(view, $view);
  };

  const renderCoinRoute = async (id) => {
    // Open modal and keep route
    await openCoin(id);
    const dict = i18n.get(state.lang);
    const node = dom.el(`<div class="view-coin"><div class="card"><div class="chip">${dict.routes.coin}</div><div class="mono">${fmt.sanitize(id)}</div></div></div>`);
    dom.mount(node, $view);
  };

  const mountError = () => {
    const node = dom.el(`<div class="grid"><div class="grid-header"><div class="skeleton" style="height:32px;width:100%"></div></div></div>`);
    dom.mount(node, $view);
  };

  const openCoin = async (id) => {
    await CoinModal.show(id, state, toggleFavorite);
    // also update hash so direct links open modal
    location.hash = `#/coin/${id}`;
  };

  const toggleFavorite = (id) => {
    const idx = state.favorites.indexOf(id);
    if (idx >= 0) state.favorites.splice(idx, 1);
    else state.favorites.push(id);
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
  };

  const init = async () => {
    syncTheme();
    CoinModal.bind();
    renderToolbar();

    Router.add('/', () => renderHome());
    Router.add('/favorites', () => renderFavorites());
    Router.add('/coin/:id', (id) => renderCoinRoute(id));
    Router.start();

    dom.on($refresh, 'click', (e) => {
      e.preventDefault();
      renderHome();
    });

    // ping API visual
    CG.ping().then(ok => {
      $apiStatus.textContent = ok ? 'OK' : 'ошибка';
    }).catch(() => { $apiStatus.textContent = 'ошибка'; });
  };

  init();
})();
