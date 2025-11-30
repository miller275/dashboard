window.Grid = (() => {
  const sparkline = (canvas, spark) => {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth;
    const h = canvas.height = canvas.clientHeight;
    ctx.clearRect(0,0,w,h);
    if (!spark || !spark.length) {
      ctx.fillStyle = '#999'; ctx.fillRect(0,0,w,h); return;
    }
    const min = Math.min(...spark);
    const max = Math.max(...spark);
    const xStep = w / (spark.length - 1);
    ctx.lineWidth = 2;
    const up = spark[spark.length - 1] >= spark[0];
    const styles = getComputedStyle(document.body);
    ctx.strokeStyle = up ? styles.getPropertyValue('--green').trim() : styles.getPropertyValue('--red').trim();
    ctx.beginPath();
    spark.forEach((v, i) => {
      const x = i * xStep;
      const y = h - ((v - min) / (max - min)) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  };

  const rowTpl = (c, idx, state) => {
    const change24 = c.price_change_percentage_24h;
    const change7d = c.price_change_percentage_7d_in_currency;
    const favorite = state.favorites.includes(c.id);
    return `
      <div class="grid-row" role="row" data-id="${c.id}">
        <div>${(state.page - 1) * state.perPage + idx + 1}</div>
        <div class="coin">
          <img src="${c.image}" alt="${fmt.sanitize(c.name)}" loading="lazy" />
          <div>
            <div style="font-weight:600">${fmt.sanitize(c.name)}</div>
            <div class="chip mono">${fmt.sanitize(c.symbol.toUpperCase())}</div>
          </div>
          <button class="btn" data-fav="${c.id}" title="Favorite">${favorite ? '★' : '☆'}</button>
        </div>
        <div class="hide-md mono">${fmt.currency(c.current_price, state.currency)}</div>
        <div class="mono ${fmt.trendClass(change24)}">${fmt.pct(change24)}</div>
        <div class="hide-md mono">${fmt.compact(c.market_cap)}</div>
        <div class="hide-md mono">${fmt.compact(c.total_volume)}</div>
        <div class="hide-sm mono ${fmt.trendClass(change7d ?? 0)}">${fmt.pct(change7d ?? 0)}</div>
        <div class="hide-md mono">${fmt.pair(c.symbol, state.currency)}</div>
        <div class="spark"><canvas></canvas></div>
      </div>
    `;
  };

  const renderHeader = (labels) => dom.el(`
    <div class="grid-header" role="row">
      <div>#</div>
      <div>${labels.coin}</div>
      <div class="hide-md">${labels.price}</div>
      <div>${labels.change24h}</div>
      <div class="hide-md">${labels.mcap}</div>
      <div class="hide-md">${labels.volume}</div>
      <div class="hide-sm">${labels.change7d}</div>
      <div class="hide-md">${labels.pair}</div>
      <div>${labels.chart}</div>
    </div>
  `);

  const render = (coins, state, onOpen, onFav) => {
    const grid = dom.el(`<div class="grid" role="table" aria-label="Coins grid"></div>`);
    grid.appendChild(renderHeader(state.labels));
    const rows = dom.el(`<div id="rows"></div>`);
    rows.innerHTML = (coins || []).map((c, idx) => rowTpl(c, idx, state)).join('');
    grid.appendChild(rows);

    // events
    dom.qsa('.grid-row', rows).forEach(row => {
      const id = row.getAttribute('data-id');
      row.addEventListener('click', (e) => {
        const target = e.target;
        if (target && target.hasAttribute('data-fav')) return;
        onOpen(id);
      });
      const favBtn = row.querySelector('[data-fav]');
      if (favBtn) {
        favBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          onFav(id);
          favBtn.textContent = state.favorites.includes(id) ? '★' : '☆';
        });
      }
    });

    // sparkline
    dom.qsa('.grid-row', rows).forEach((row, i) => {
      const coin = coins[i];
      const canvas = row.querySelector('canvas');
      if (canvas && coin.sparkline_in_7d?.price) {
        sparkline(canvas, coin.sparkline_in_7d.price);
      }
    });

    return grid;
  };

  return { render };
})();
