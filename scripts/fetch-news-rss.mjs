import fs from "node:fs";
import path from "node:path";
import Parser from "rss-parser";

const OUT_DIR = path.resolve("data/news");
fs.mkdirSync(OUT_DIR, { recursive: true });

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "github-actions-rss-fetcher" }
});

// Add/remove sources here
const FEEDS = [
  { source: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" },
  { source: "Cointelegraph", url: "https://cointelegraph.com/rss" }
];

function clean(s) {
  return String(s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

(async () => {
  const all = [];

  for (const f of FEEDS) {
    try {
      const feed = await parser.parseURL(f.url);
      for (const it of (feed.items || [])) {
        all.push({
          title: (it.title || "").trim(),
          url: (it.link || "").trim(),
          source: f.source,
          publishedAt: it.isoDate || it.pubDate || null,
          summary: clean(it.contentSnippet || it.content || it.summary || "")
        });
      }
      console.log(`Fetched: ${f.source} (${(feed.items||[]).length})`);
    } catch (e) {
      console.warn(`RSS failed: ${f.source} — ${e.message}`);
    }
  }

  // de-dup by url
  const seen = new Set();
  const items = all
    .filter(x => x.title && x.url)
    .sort((a,b)=> new Date(b.publishedAt||0) - new Date(a.publishedAt||0))
    .filter(x => (seen.has(x.url) ? false : (seen.add(x.url), true)))
    .slice(0, 120);

  const out = { updatedAt: new Date().toISOString(), items };
  fs.writeFileSync(path.join(OUT_DIR, "latest.json"), JSON.stringify(out, null, 2));
  console.log(`Saved news: ${items.length}`);
})();
