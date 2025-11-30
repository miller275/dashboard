export const fmt = {
  money(v) {
    if (v == null) return '—';
    const abs = Math.abs(v);
    const opts = { maximumFractionDigits: abs < 1 ? 6 : abs < 100 ? 4 : 2 };
    return '$' + Number(v).toLocaleString('en-US', opts);
  },
  num(v) { return v == null ? '—' : Number(v).toLocaleString('en-US'); },
  pct(v) { return v == null ? '—' : (v >= 0 ? '+' : '') + v.toFixed(2) + '%'; },
  time(ts) { return ts ? new Date(ts).toLocaleString() : '—'; },
  trimHtml(html, limit=600) {
    if (!html) return '—';
    const s = html.replace(/<[^>]+>/g, '');
    return s.length > limit ? s.slice(0, limit) + '…' : s;
  }
};
