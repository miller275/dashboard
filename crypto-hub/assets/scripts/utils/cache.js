window.cache = (() => {
  const set = (key, value, ttlMs = 2 * 60 * 1000) => {
    const payload = { t: Date.now(), v: value, ttl: ttlMs };
    localStorage.setItem(key, JSON.stringify(payload));
  };
  const get = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { t, v, ttl } = JSON.parse(raw);
      if (!t || !ttl) return null;
      if ((Date.now() - t) > ttl) return null;
      return v;
    } catch {
      return null;
    }
  };
  const del = (key) => localStorage.removeItem(key);
  const putIfStale = (key, next, ttlMs) => {
    const val = get(key);
    if (val) return val;
    set(key, next, ttlMs);
    return next;
  };
  return { set, get, del, putIfStale };
})();
