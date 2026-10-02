(function () {
  document.querySelectorAll('[data-filter-bar]').forEach(bar => {
    const grid = bar.nextElementSibling || document.querySelector('[data-filter-grid]');
    if (!grid) return;
    const items = grid.querySelectorAll('[data-category]');
    const buttons = bar.querySelectorAll('.filter-btn');

    buttons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.filter === 'all'));
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        buttons.forEach(item => {
          const active = item === button;
          item.classList.toggle('bg-brand-gradient', active);
          item.classList.toggle('text-white', active);
          item.classList.toggle('border-orange', active);
          item.classList.toggle('bg-white', !active);
          item.classList.toggle('text-primary', !active);
          item.setAttribute('aria-pressed', String(active));
        });
        items.forEach(item => {
          item.style.display = filter === 'all' || item.dataset.category === filter ? '' : 'none';
        });
      });
    });
  });
})();
