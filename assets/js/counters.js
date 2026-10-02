(function () {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  let animated = false;
  function animateCounters() {
    if (animated) return;
    const section = counters[0]?.closest('section');
    if (!section || !Aalphaleo.isInViewport(section)) return;
    animated = true;

    counters.forEach(counter => {
      const target = Number.parseInt(counter.dataset.target, 10);
      const suffix = counter.dataset.suffix || '';
      const duration = Aalphaleo.prefersReducedMotion() ? 0 : 2000;
      const start = performance.now();
      const update = now => {
        const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
        counter.textContent = `${Math.round((1 - Math.pow(1 - progress, 3)) * target)}${suffix}`;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    });
  }

  window.addEventListener('scroll', Aalphaleo.debounce(animateCounters, 50), { passive: true });
  animateCounters();
})();
