const Aalphaleo = {
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  debounce(fn, delay = 200) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  },
};
