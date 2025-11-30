window.Pagination = (() => {
  const render = (state, onChange) => {
    const node = dom.el(`
      <div class="pagination">
        <button class="btn" data-action="prev">${state.labels.back}</button>
        <div class="chip">${state.labels.page} ${state.page}</div>
        <button class="btn" data-action="next">${state.labels.next}</button>
        <select class="select" data-action="perPage">
          <option value="10" ${state.perPage===10?'selected':''}>10</option>
          <option value="25" ${state.perPage===25?'selected':''}>25</option>
          <option value="50" ${state.perPage===50?'selected':''}>50</option>
          <option value="100" ${state.perPage===100?'selected':''}>100</option>
        </select>
      </div>
    `);
    dom.on(node, 'click', (e) => {
      const act = e.target.getAttribute('data-action');
      if (act === 'prev' && state.page > 1) { onChange({ page: state.page - 1 }); }
      if (act === 'next') { onChange({ page: state.page + 1 }); }
    });
    dom.on(node, 'change', (e) => {
      if (e.target.getAttribute('data-action') === 'perPage') {
        const perPage = parseInt(e.target.value, 10);
        onChange({ page: 1, perPage });
      }
    });
    return node;
  };
  return { render };
})();
