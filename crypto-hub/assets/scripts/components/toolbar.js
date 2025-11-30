window.Toolbar = (() => {
  const render = (state, onChange, onFavoritesRoute) => {
    const dict = i18n.get(state.lang);
    const node = dom.el(`
      <div class="toolbar">
        <input id="search" class="input" type="search" placeholder="${dict.toolbar.searchPlaceholder}" aria-label="Search coins" />
        <select id="sort" class="select" aria-label="Sort">
          <option value="market_cap_desc">${dict.toolbar.sort.market_cap_desc}</option>
          <option value="market_cap_asc">${dict.toolbar.sort.market_cap_asc}</option>
          <option value="volume_desc">${dict.toolbar.sort.volume_desc}</option>
          <option value="volume_asc">${dict.toolbar.sort.volume_asc}</option>
          <option value="price_desc">${dict.toolbar.sort.price_desc}</option>
          <option value="price_asc">${dict.toolbar.sort.price_asc}</option>
          <option value="change_desc">${dict.toolbar.sort.change_desc}</option>
          <option value="change_asc">${dict.toolbar.sort.change_asc}</option>
        </select>
        <select id="currency" class="select" aria-label="Currency">
          <option value="usd">USD</option>
          <option value="eur">EUR</option>
          <option value="rub">RUB</option>
          <option value="ron">RON</option>
        </select>
        <button id="toggleTheme" class="btn">${dict.toolbar.theme}</button>
        <button id="toggleLang" class="btn">${dict.toolbar.lang}</button>
        <button id="favoritesBtn" class="btn btn-icon"><img src="assets/icons/star.svg" alt="" />${dict.toolbar.favorites}</button>
      </div>
    `);
    const $search = node.querySelector('#search');
    const $sort = node.querySelector('#sort');
    const $currency = node.querySelector('#currency');
    const $toggleTheme = node.querySelector('#toggleTheme');
    const $toggleLang = node.querySelector('#toggleLang');
    const $fav = node.querySelector('#favoritesBtn');

    $sort.value = state.sort;
    $currency.value = state.currency;
    $search.value = state.query;

    dom.on($search, 'input', (e) => onChange({ query: e.target.value.trim().toLowerCase() }));
    dom.on($sort, 'change', (e) => onChange({ sort: e.target.value }));
    dom.on($currency, 'change', (e) => onChange({ currency: e.target.value }));
    dom.on($toggleTheme, 'click', () => onChange({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
    dom.on($toggleLang, 'click', () => onChange({ lang: state.lang === 'ru' ? 'en' : (state.lang === 'en' ? 'ro' : 'ru') }));
    dom.on($fav, 'click', () => onFavoritesRoute());

    return node;
  };

  return { render };
})();
