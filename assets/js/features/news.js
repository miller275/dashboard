const $ = (sel) => document.querySelector(sel);

function debounce(fn, ms=150){
  let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); };
}
async function fetchJson(url) {
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
  return r.json();
}

export async function initNews({ url, els, limit=60 }) {
  const el = {
    q: $(els.q),
    source: $(els.source),
    meta: $(els.meta),
    list: $(els.list),
  };

  const raw = await fetchJson(url);
  const updatedAt = raw.updatedAt ? new Date(raw.updatedAt) : null;

  let items = Array.isArray(raw.items) ? raw.items : [];
  items = items
    .filter(x => x && x.title && x.url)
    .sort((a,b)=> new Date(b.publishedAt||0) - new Date(a.publishedAt||0))
    .slice(0, limit);

  // sources dropdown
  const sources = Array.from(new Set(items.map(i => i.source).filter(Boolean))).sort();
  for (const s of sources) {
    const opt = document.createElement("option");
    opt.value = s; opt.textContent = s;
    el.source.appendChild(opt);
  }

  function apply() {
    const q = (el.q.value || "").trim().toLowerCase();
    const src = el.source.value || "";

    let arr = items.filter(i => {
      if (src && i.source !== src) return false;
      if (!q) return true;
      return (i.title || "").toLowerCase().includes(q) || (i.summary || "").toLowerCase().includes(q);
    });

    el.list.innerHTML = "";
    const frag = document.createDocumentFragment();

    for (const i of arr) {
      const card = document.createElement("article");
      card.className = "news-item";
      const when = i.publishedAt ? new Date(i.publishedAt).toLocaleString() : "";
      card.innerHTML = `
        <a class="news-title" href="${i.url}" target="_blank" rel="noopener noreferrer">${i.title}</a>
        <div class="news-sub muted">${i.source ?? "—"} • ${when}</div>
        <div class="news-summary">${i.summary ?? ""}</div>
      `;
      frag.appendChild(card);
    }

    el.list.appendChild(frag);

    const upd = updatedAt ? ` • Updated: ${updatedAt.toLocaleString()}` : "";
    el.meta.textContent = `Items: ${arr.length}/${items.length}${upd}`;
  }

  const onInput = debounce(apply, 120);
  el.q.addEventListener("input", onInput);
  el.source.addEventListener("change", apply);

  apply();
}
