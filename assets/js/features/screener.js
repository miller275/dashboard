const $ = (sel) => document.querySelector(sel);

function fmtNum(n) {
  if (n == null || !isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e12) return (n / 1e12).toFixed(2) + "T";
  if (abs >= 1e9)  return (n / 1e9).toFixed(2) + "B";
  if (abs >= 1e6)  return (n / 1e6).toFixed(2) + "M";
  if (abs >= 1e3)  return (n / 1e3).toFixed(2) + "K";
  return String(Math.round(n));
}
function fmtMoney(n) {
  if (n == null || !isFinite(n)) return "—";
  if (Math.abs(n) >= 1000) return "$" + fmtNum(n);
  return "$" + n.toFixed(6).replace(/0+$/,"").replace(/\.$/,"");
}
function fmtPct(n) {
  if (n == null || !isFinite(n)) return "—";
  return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
}
function debounce(fn, ms=150){
  let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); };
}

async function fetchJson(url) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

export async function initScreener({ basePath, pageSizeFallback=200, els }) {
  const el = {
    q: $(els.q),
    sort: $(els.sort),
    minMcap: $(els.minMcap),
    minVol: $(els.minVol),
    reset: $(els.reset),
    meta: $(els.meta),
    body: $(els.body),
    prev: $(els.prev),
    next: $(els.next),
    page: $(els.page),
  };

  let state = {
    page: 1,
    pages: 1,
    pageSize: pageSizeFallback,
    updatedAt: null,
    rows: [],
    filtered: []
  };

  async function loadIndex() {
    try {
      const idx = await fetchJson(`${basePath}/index.json`);
      state.pages = idx.pages || 1;
      state.pageSize = idx.pageSize || pageSizeFallback;
      state.updatedAt = idx.updatedAt || null;
    } catch {
      state.pages = 1;
    }
  }

  async function loadPage(page) {
    const p = Math.max(1, Math.min(state.pages, page));
    const data = await fetchJson(`${basePath}/page-${p}.json`);
    state.page = data.page || p;
    state.updatedAt = data.updatedAt || state.updatedAt;
    state.rows = Array.isArray(data.data) ? data.data : [];
  }

  function applyFilters() {
    const q = (el.q.value || "").trim().toLowerCase();
    const minM = Number(el.minMcap.value || 0);
    const minV = Number(el.minVol.value || 0);

    let arr = state.rows.filter(x => {
      if (minM && (x.mcap ?? 0) < minM) return false;
      if (minV && (x.vol24h ?? 0) < minV) return false;
      if (!q) return true;
      return (
        (x.name || "").toLowerCase().includes(q) ||
        (x.symbol || "").toLowerCase().includes(q) ||
        (x.slug || "").toLowerCase().includes(q)
      );
    });

    const sort = el.sort.value;
    const cmp = {
      "mcap_desc": (a,b)=> (b.mcap??0)-(a.mcap??0),
      "vol_desc":  (a,b)=> (b.vol24h??0)-(a.vol24h??0),
      "chg24h_desc": (a,b)=> (b.chg24h??-1e9)-(a.chg24h??-1e9),
      "price_desc": (a,b)=> (b.price??0)-(a.price??0),
      "rank_asc": (a,b)=> (a.rank??1e9)-(b.rank??1e9),
    }[sort] || ((a,b)=> (a.rank??1e9)-(b.rank??1e9));

    arr.sort(cmp);
    state.filtered = arr;
  }

  function render() {
    el.body.innerHTML = "";

    const frag = document.createDocumentFragment();
    for (const x of state.filtered) {
      const tr = document.createElement("tr");
      const coinLabel = `${x.name ?? "?"} (${x.symbol ?? "?"})`;

      // If you already have coin.html: adapt this to your routing (id/slug/symbol).
      const href = `./coin.html?id=${encodeURIComponent(x.id ?? "")}`;

      tr.innerHTML = `
        <td>${x.rank ?? "—"}</td>
        <td><a href="${href}">${coinLabel}</a></td>
        <td>${fmtMoney(x.price)}</td>
        <td>${fmtPct(x.chg1h)}</td>
        <td>${fmtPct(x.chg24h)}</td>
        <td>${fmtPct(x.chg7d)}</td>
        <td>${fmtMoney(x.vol24h)}</td>
        <td>${fmtMoney(x.mcap)}</td>
      `;
      frag.appendChild(tr);
    }
    el.body.appendChild(frag);

    el.page.textContent = `Page ${state.page}/${state.pages}`;
    const upd = state.updatedAt ? ` • Updated: ${new Date(state.updatedAt).toLocaleString()}` : "";
    el.meta.textContent = `Rows: ${state.filtered.length}/${state.rows.length}${upd}`;

    el.prev.disabled = state.page <= 1;
    el.next.disabled = state.page >= state.pages;
  }

  async function reload(page = state.page) {
    await loadPage(page);
    applyFilters();
    render();
  }

  // events
  const onInput = debounce(() => { applyFilters(); render(); }, 120);
  el.q.addEventListener("input", onInput);
  el.minMcap.addEventListener("input", onInput);
  el.minVol.addEventListener("input", onInput);
  el.sort.addEventListener("change", () => { applyFilters(); render(); });

  el.reset.addEventListener("click", () => {
    el.q.value = "";
    el.minMcap.value = "";
    el.minVol.value = "";
    el.sort.value = "mcap_desc";
    applyFilters(); render();
  });

  el.prev.addEventListener("click", () => reload(state.page - 1));
  el.next.addEventListener("click", () => reload(state.page + 1));

  // init
  await loadIndex();
  await reload(1);
}
