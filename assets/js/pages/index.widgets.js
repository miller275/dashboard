import { initScreener } from "../features/screener.js";
import { initNews } from "../features/news.js";

initScreener({
  basePath: "./data/cmc/listings",
  pageSizeFallback: 200,
  els: {
    q: "#scr-q",
    sort: "#scr-sort",
    minMcap: "#scr-min-mcap",
    minVol: "#scr-min-vol",
    reset: "#scr-reset",
    meta: "#screener-meta",
    body: "#screener-body",
    prev: "#scr-prev",
    next: "#scr-next",
    page: "#scr-page"
  }
});

initNews({
  url: "./data/news/latest.json",
  els: {
    q: "#news-q",
    source: "#news-source",
    meta: "#news-meta",
    list: "#news-list"
  },
  limit: 60
});
