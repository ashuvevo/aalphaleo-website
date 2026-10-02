(function () {
  if (Aalphaleo.prefersReducedMotion()) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const layers = document.querySelectorAll('[data-parallax], [data-parallax-layer]');
  if (!layers.length) return;

  const items = Array.from(layers).map(el => ({
    el,
    speed: parseFloat(el.dataset.parallax || el.dataset.parallaxSpeed || '0.15'),
    max: parseFloat(el.dataset.parallaxMax || '80'),
  }));

  let ticking = false;

  function update() {
    const scrollY = window.scrollY;
    items.forEach(({ el, speed, max }) => {
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight * 0.5;
      const offset = (rect.top + rect.height * 0.5 - viewportCenter) * speed;
      const clamped = Math.max(-max, Math.min(max, offset));
      el.style.transform = `translate3d(0, ${clamped.toFixed(2)}px, 0)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();
