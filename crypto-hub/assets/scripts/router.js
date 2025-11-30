window.Router = (() => {
  const routes = [];
  const add = (pattern, handler) => routes.push({ pattern, handler });

  const match = (hash) => {
    for (const r of routes) {
      const re = new RegExp('^' + r.pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
      const m = hash.match(re);
      if (m) return { handler: r.handler, params: m.slice(1) };
    }
    return null;
  };

  const start = () => {
    const run = () => {
      const hash = location.hash || '#/';
      const m = match(hash.replace(/^#/, ''));
      if (m) m.handler(...m.params);
    };
    window.addEventListener('hashchange', run);
    run();
  };

  return { add, start };
})();
