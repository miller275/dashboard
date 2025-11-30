window.CoinModal = (() => {
  const els = {};
  const getEls = () => {
    els.backdrop = document.getElementById('modalBackdrop');
    els.icon = document.getElementById('modalIcon');
    els.title = document.getElementById('modalTitle');
    els.sub = document.getElementById('modalSubtitle');
    els.price = document.getElementById('modalPrice');
    els.change = document.getElementById('modalChange');
    els.mc = document.getElementById('modalMC');
    els.vol = document.getElementById('modalVol');
    els.supply = document.getElementById('modalSupply');
    els.links = document.getElementById('modalLinks');
    els.close = document.getElementById('closeModal');
    els.favToggle = document.getElementById('favToggle');
    els.tv = document.getElementById('tvWidget');
    els.openCG = document.getElementById('openOnCG');
    els.openTV = document.getElementById('openOnTV');
    return els;
  };

  const show = async (id, state, toggleFav) => {
    const $ = getEls();
    try {
      const market = state.coins.find(c => c.id === id);
      const coin = await throttler.push(() => CG.coin(id));

      $.icon.src = coin.image?.small || market?.image || '';
      $.icon.alt = coin.name;
      $.title.textContent = coin.name;
      $.sub.textContent = (coin.symbol || '').toUpperCase();

      const price = market?.current_price ?? coin.market_data?.current_price?.[state.currency];
      const change24 = market?.price_change_percentage_24h ?? coin.market_data?.price_change_percentage_24h ?? 0;
      $.price.textContent = fmt.currency(price, state.currency);
      $.change.textContent = fmt.pct(change24);
      $.change.className = 'mono ' + fmt.trendClass(change24);

      $.mc.textContent = fmt.compact(coin.market_data?.market_cap?.[state.currency] ?? market?.market_cap ?? null);
      $.vol.textContent = fmt.compact(coin.market_data?.total_volume?.[state.currency] ?? market?.total_volume ?? null);
      $.supply.textContent = fmt.compact(coin.market_data?.circulating_supply ?? market?.circulating_supply ?? null);

      const homepage = (coin.links?.homepage || []).filter(Boolean)[0] || '';
      const twitter = coin.links?.twitter_screen_name ? 'https://twitter.com/' + coin.links.twitter_screen_name : '';
      const github = (coin.links?.repos_url?.github || [])[0] || '';
      $.links.innerHTML = [homepage, twitter, github].filter(Boolean).map(url => `<a class="link" href="${url}" target="_blank" rel="noopener">${fmt.sanitize(url)}</a>`).join(' | ');

      $.openCG.onclick = () => window.open(`https://www.coingecko.com/coins/${coin.id}`, '_blank');
      const tvSymbol = (coin.symbol || 'BTC').toUpperCase() + (state.currency === 'usd' ? 'USD' : state.currency.toUpperCase());
      $.openTV.onclick = () => window.open(`https://www.tradingview.com/symbols/${tvSymbol}/`, '_blank');

      $.backdrop.style.display = 'flex';
      TV.renderWidget(tvSymbol, $.tv, state.theme, state.lang);
      $.favToggle.textContent = state.favorites.includes(id) ? (state.lang==='ru'?'Убрать из избранного':'Remove from favorites') : (state.lang==='ru'?i18n.get(state.lang).modal.addFav:'Add to favorites');
      $.favToggle.onclick = () => {
        toggleFav(id);
        $.favToggle.textContent = state.favorites.includes(id) ? (state.lang==='ru'?'Убрать из избранного':'Remove from favorites') : (state.lang==='ru'?i18n.get(state.lang).modal.addFav:'Add to favorites');
      };
    } catch (e) {
      console.error(e);
      alert('Ошибка загрузки данных монеты.');
    }
  };

  const close = () => {
    const $ = getEls();
    $.backdrop.style.display = 'none';
    $.tv.innerHTML = '';
  };

  const bind = () => {
    const $ = getEls();
    $.close.addEventListener('click', close);
    els.backdrop.addEventListener('click', (e) => {
      if (e.target === els.backdrop) close();
    });
  };

  return { show, close, bind };
})();
