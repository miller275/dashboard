window.throttler = (() => {
  const queue = [];
  let active = 0;
  const limit = 4;       // max parallel
  const delayMs = 250;   // spacing

  const runNext = () => {
    if (!queue.length || active >= limit) return;
    const { fn, resolve, reject } = queue.shift();
    active++;
    Promise.resolve()
      .then(() => fn())
      .then((res) => { resolve(res); })
      .catch((err) => { reject(err); })
      .finally(() => {
        active--;
        setTimeout(runNext, delayMs);
      });
  };

  const push = (fn) => new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    runNext();
  });

  return { push };
})();
