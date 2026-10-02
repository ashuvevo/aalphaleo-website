(function () {
  const header = document.querySelector('[data-header]');
  const mobileToggle = document.querySelector('[data-mobile-toggle]');
  const mobileClose = document.querySelector('[data-mobile-close]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const megaTriggers = document.querySelectorAll('[data-mega-trigger]');

  if (header) {
    const onScroll = Aalphaleo.debounce(() => {
      const scrolled = window.scrollY > 24;
      header.classList.toggle('site-header--scrolled', scrolled);
      header.classList.toggle('shadow-soft', scrolled && !header.classList.contains('site-header--overlay'));
    }, 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileClose?.focus();
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('mobile-menu--open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    mobileToggle?.focus();
  }

  mobileToggle?.addEventListener('click', openMobileMenu);
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobileMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  megaTriggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();
      const menu = trigger.parentElement?.querySelector('[data-mega-menu]');
      if (!menu) return;
      const isOpen = menu.classList.contains('visible');
      document.querySelectorAll('[data-mega-menu]').forEach(item => {
        item.classList.remove('visible', 'opacity-100');
        item.classList.add('invisible', 'opacity-0');
      });
      megaTriggers.forEach(item => item.setAttribute('aria-expanded', 'false'));
      if (!isOpen) {
        menu.classList.remove('invisible', 'opacity-0');
        menu.classList.add('visible', 'opacity-100');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  document.addEventListener('click', event => {
    if (!event.target.closest('[data-mega-trigger]') && !event.target.closest('[data-mega-menu]')) {
      document.querySelectorAll('[data-mega-menu]').forEach(menu => {
        menu.classList.remove('visible', 'opacity-100');
        menu.classList.add('invisible', 'opacity-0');
      });
      megaTriggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
    }
  });
})();
