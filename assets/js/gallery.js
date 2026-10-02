(function () {
  const lightbox = document.getElementById('gallery-lightbox');
  if (!lightbox) return;

  const img = document.getElementById('gallery-lightbox-img');
  const title = document.getElementById('gallery-lightbox-title');
  const style = document.getElementById('gallery-lightbox-style');
  const link = document.getElementById('gallery-lightbox-link');
  let lastFocus = null;

  function openLightbox(trigger) {
    lastFocus = trigger;
    img.src = trigger.dataset.gallerySrc || '';
    img.alt = `${trigger.dataset.galleryTitle || 'Shopify'} homepage design preview`;
    title.textContent = trigger.dataset.galleryTitle || '';
    style.textContent = trigger.dataset.galleryStyle || '';
    link.href = trigger.dataset.galleryUrl || '#';
    lightbox.classList.remove('hidden');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.gallery-lightbox-close')?.focus();
  }

  function closeLightbox() {
    lightbox.classList.add('hidden');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    img.src = '';
    lastFocus?.focus();
  }

  document.querySelectorAll('.gallery-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => openLightbox(trigger));
  });

  lightbox.querySelectorAll('[data-gallery-close]').forEach(el => {
    el.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
      closeLightbox();
    }
  });
})();
