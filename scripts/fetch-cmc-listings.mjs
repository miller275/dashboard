import fs from "node:fs";
import path from "node:path";

const API = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
const KEY = process.env.CMC_PRO_API_KEY;

if (!KEY) {
  console.error("Missing CMC_PRO_API_KEY");
  process.exit(1);
}

const OUT_DIR = path.resolve("data/cmc/listings");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PAGE_SIZE = 200;      // matches frontend
const TOTAL_TARGET = 5000;  // adjust if you want more/less
const PAGES = Math.ceil(TOTAL_TARGET / PAGE_SIZE);

async function fetchPage(page) {
  const start = (page - 1) * PAGE_SIZE + 1;
  const url = new URL(API);
  url.searchParams.set("start", String(start));
  url.searchParams.set("limit", String(PAGE_SIZE));
  url.searchParams.set("convert", "USD");

  const res = await fetch(url, {
    headers: {
      "X-CMC_PRO_API_KEY": KEY,
      "Accept": "application/json"
    }
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`CMC HTTP ${res.status}: ${txt.slice(0, 200)}`);
  }
  const json = await res.json();

  const data = (json.data || []).map(x => {
    const q = x.quote?.USD || {};
    return {
      id: x.id,
      name: x.name,
      symbol: x.symbol,
      slug: x.slug,
      rank: x.cmc_rank,
      price: q.price,
      mcap: q.market_cap,
      vol24h: q.volume_24h,
      chg1h: q.percent_change_1h,
      chg24h: q.percent_change_24h,
      chg7d: q.percent_change_7d
    };
  });

  const updatedAt = new Date().toISOString();

  const out = { updatedAt, page, pageSize: PAGE_SIZE, data };
  fs.writeFileSync(path.join(OUT_DIR, `page-${page}.json`), JSON.stringify(out, null, 2));
  return updatedAt;
}

(async () => {
  let updatedAt = new Date().toISOString();

  for (let p = 1; p <= PAGES; p++) {
    updatedAt = await fetchPage(p);
    console.log(`Saved page ${p}/${PAGES}`);
  }

  const idx = { updatedAt, pageSize: PAGE_SIZE, pages: PAGES, total: TOTAL_TARGET };
  fs.writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(idx, null, 2));
  console.log("Saved listings index");
})();
