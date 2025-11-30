window.dom = (() => {
  const el = (html) => {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const mount = (node, target) => {
    target.innerHTML = '';
    target.appendChild(node);
    return node;
  };
  const on = (node, event, handler, opts) => {
    node.addEventListener(event, handler, opts);
    return () => node.removeEventListener(event, handler, opts);
  };
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  return { el, mount, on, qs, qsa };
})();
