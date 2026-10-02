(function () {
  document.querySelectorAll('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const panel = trigger.nextElementSibling;
      const icon = trigger.querySelector('[data-lucide="chevron-down"]');
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      document.querySelectorAll('.faq-trigger').forEach(item => {
        if (item !== trigger) {
          item.setAttribute('aria-expanded', 'false');
          item.nextElementSibling?.classList.add('hidden');
          item.querySelector('[data-lucide="chevron-down"]')?.classList.remove('rotate-180');
        }
      });

      trigger.setAttribute('aria-expanded', String(!isOpen));
      panel?.classList.toggle('hidden');
      icon?.classList.toggle('rotate-180');
    });
  });
})();
