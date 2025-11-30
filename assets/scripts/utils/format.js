window.fmt = (() => {
  const fmtCurrency = (n, cur) => {
    if (n == null) return '-';
    const f = new Intl.NumberFormat(undefined, { style: 'currency', currency: cur.toUpperCase(), maximumFractionDigits: 8 });
    return f.format(n);
  };
  const fmtNum = (n, max = 0) => {
    if (n == null) return '-';
    const f = new Intl.NumberFormat(undefined, { maximumFractionDigits: max });
    return f.format(n);
  };
  const fmtPct = (n) => {
    if (n == null) return '-';
    const sign = n >= 0 ? '+' : '';
    return sign + n.toFixed(2) + '%';
  };
  const fmtCompact = (n) => {
    if (n == null) return '-';
    return Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 }).format(n);
  };
  const fmtPair = (symbol, currency) => symbol.toUpperCase() + '/' + currency.toUpperCase();
  const sanitize = (html) => {
    const d = document.createElement('div');
    d.textContent = html;
    return d.innerHTML;
  };
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);
  const trendClass = (n) => n >= 0 ? 'up' : 'down';

  return {
    currency: fmtCurrency,
    num: fmtNum,
    pct: fmtPct,
    compact: fmtCompact,
    pair: fmtPair,
    sanitize,
    clamp,
    trendClass,
  };
})();
