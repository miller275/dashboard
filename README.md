# CryptoBoard — Screener + News (GitHub Pages)

### Key rule
Browser NEVER calls public APIs. It only loads local JSON from `/data/*`.

### Data updates
GitHub Actions runs hourly:
- Fetches CoinMarketCap listings with `CMC_PRO_API_KEY` secret
- Fetches RSS news feeds and writes `data/news/latest.json`
- Commits changes into repo so GitHub Pages serves them

### Setup
1) Add GitHub Secret: `CMC_PRO_API_KEY`
2) Enable Pages: Settings → Pages → GitHub Actions
3) Wait for the `Update data` workflow to run (or run manually).

### Notes
- `coin.html` here is a stub. Replace with your PRO coin page and keep the screener link routing.
