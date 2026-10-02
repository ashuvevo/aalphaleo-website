(function () {
  if (typeof AOS !== 'undefined' && document.querySelector('[data-aos]') && !Aalphaleo.prefersReducedMotion()) {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: 'phone',
    });
  }

  if (typeof gsap !== 'undefined' && !Aalphaleo.prefersReducedMotion()) {
    document.querySelectorAll('.float-element, .hero-float-card').forEach((element, index) => {
      gsap.to(element, {
        y: -14,
        duration: 2.4 + index * 0.25,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    const heroContent = document.querySelector('[data-hero-content]');
    if (heroContent) {
      gsap.from(heroContent.children, {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.15,
      });
    }

    const heroVisual = document.querySelector('[data-hero-visual]');
    if (heroVisual) {
      gsap.from(heroVisual, {
        x: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.35,
      });
    }
  }

  if (!Aalphaleo.prefersReducedMotion() && 'IntersectionObserver' in window) {
    document.querySelectorAll('.reveal-blur').forEach(el => {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      observer.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-blur').forEach(el => el.classList.add('is-visible'));
  }
})();
