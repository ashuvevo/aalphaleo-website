/**
 * Aalphaleo Digital Solution — Custom Cookie Consent
 * Google Consent Mode v2 · GTM · GA4 · Google Ads · Meta Pixel · Microsoft Clarity
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'cookieConsent';
  var EXPIRY_DAYS = 180;
  var focusableSelector = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  var state = {
    banner: null,
    modal: null,
    overlay: null,
    lastFocused: null,
    loadedScripts: { clarity: false, metaPixel: false },
  };

  var config = window.AalphaleoConsentConfig || {
    ga4MeasurementId: 'G-VMW63X6QVV',
    metaPixelId: '',
    clarityProjectId: '',
    expiryDays: EXPIRY_DAYS,
  };

  function $(id) {
    return document.getElementById(id);
  }

  function dispatchEvent(name, detail) {
    document.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
  }

  function defaultConsent() {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
      timestamp: new Date().toISOString(),
    };
  }

  function acceptAllConsent() {
    return {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: new Date().toISOString(),
    };
  }

  function rejectAllConsent() {
    return defaultConsent();
  }

  function isConsentExpired(consent) {
    if (!consent || !consent.timestamp) return true;
    var expiryMs = (config.expiryDays || EXPIRY_DAYS) * 24 * 60 * 60 * 1000;
    return Date.now() - new Date(consent.timestamp).getTime() >= expiryMs;
  }

  function loadCookiePreferences() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (isConsentExpired(parsed)) {
        localStorage.removeItem(STORAGE_KEY);
        dispatchEvent('consentExpired', parsed);
        return null;
      }
      return parsed;
    } catch (e) {
      return null;
    }
  }

  function saveCookiePreferences(consent) {
    var payload = Object.assign({}, consent, {
      necessary: true,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return payload;
  }

  function resetCookiePreferences() {
    localStorage.removeItem(STORAGE_KEY);
    unloadThirdPartyScripts();
    updateGoogleConsent(rejectAllConsent());
    showCookieBanner();
    dispatchEvent('consentUpdated', rejectAllConsent());
  }

  function consentToGoogle(consent) {
    return {
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
      functionality_storage: consent.preferences ? 'granted' : 'denied',
      personalization_storage: consent.preferences ? 'granted' : 'denied',
      security_storage: 'granted',
    };
  }

  function updateGoogleConsent(consent) {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = window.gtag || gtag;

    var googleConsent = consentToGoogle(consent);
    gtag('consent', 'update', googleConsent);

    window.dataLayer.push({
      event: 'consent_updated',
      consent_analytics: consent.analytics,
      consent_marketing: consent.marketing,
      consent_preferences: consent.preferences,
    });

    if (consent.analytics) {
      loadClarity();
    } else {
      unloadClarity();
    }

    if (consent.marketing) {
      loadMetaPixel();
    } else {
      unloadMetaPixel();
    }

    dispatchEvent('consentUpdated', consent);
  }

  function loadClarity() {
    var id = config.clarityProjectId;
    if (!id || state.loadedScripts.clarity) return;

    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
      t = l.createElement(r);
      t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', id);

    state.loadedScripts.clarity = true;
  }

  function unloadClarity() {
    if (typeof window.clarity === 'function') {
      try {
        window.clarity('stop');
      } catch (e) { /* noop */ }
    }
    document.querySelectorAll('script[src*="clarity.ms"]').forEach(function (s) {
      s.remove();
    });
    state.loadedScripts.clarity = false;
  }

  function loadMetaPixel() {
    var id = config.metaPixelId;
    if (!id || state.loadedScripts.metaPixel) return;

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('init', id);
    window.fbq('track', 'PageView');
    state.loadedScripts.metaPixel = true;
  }

  function unloadMetaPixel() {
    if (typeof window.fbq === 'function') {
      try {
        window.fbq('consent', 'revoke');
      } catch (e) { /* noop */ }
    }
    document.querySelectorAll('script[src*="fbevents.js"]').forEach(function (s) {
      s.remove();
    });
    delete window.fbq;
    delete window._fbq;
    state.loadedScripts.metaPixel = false;
  }

  function unloadThirdPartyScripts() {
    unloadClarity();
    unloadMetaPixel();
  }

  function showCookieBanner() {
    if (!state.banner) return;
    state.banner.hidden = false;
    requestAnimationFrame(function () {
      state.banner.classList.add('is-visible');
    });
    state.banner.setAttribute('aria-hidden', 'false');
  }

  function hideCookieBanner() {
    if (!state.banner) return;
    state.banner.classList.remove('is-visible');
    state.banner.setAttribute('aria-hidden', 'true');
    setTimeout(function () {
      state.banner.hidden = true;
    }, 500);
  }

  function getFocusableElements(container) {
    return Array.prototype.slice.call(container.querySelectorAll(focusableSelector)).filter(function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
  }

  function trapFocus(e) {
    if (!state.modal || state.modal.hidden) return;
    var card = state.modal.querySelector('.cookie-card');
    if (!card) return;

    var focusable = getFocusableElements(card);
    if (!focusable.length) return;

    var first = focusable[0];
    var last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openPreferenceModal() {
    if (!state.modal || !state.overlay) return;

    var saved = loadCookiePreferences();
    setToggleState('cookie-toggle-analytics', saved ? saved.analytics : false);
    setToggleState('cookie-toggle-marketing', saved ? saved.marketing : false);
    setToggleState('cookie-toggle-preferences', saved ? saved.preferences : false);

    state.lastFocused = document.activeElement;
    hideCookieBanner();

    state.overlay.hidden = false;
    state.modal.hidden = false;
    state.overlay.setAttribute('aria-hidden', 'false');
    state.modal.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(function () {
      state.overlay.classList.add('is-visible');
      state.modal.classList.add('is-visible');
    });

    document.body.style.overflow = 'hidden';
    var closeBtn = $('cookie-modal-close');
    if (closeBtn) closeBtn.focus();

    dispatchEvent('reopenPreferences');
  }

  function closePreferenceModal() {
    if (!state.modal || !state.overlay) return;

    state.modal.classList.remove('is-visible');
    state.overlay.classList.remove('is-visible');
    state.modal.setAttribute('aria-hidden', 'true');
    state.overlay.setAttribute('aria-hidden', 'true');

    setTimeout(function () {
      state.modal.hidden = true;
      state.overlay.hidden = true;
      document.body.style.overflow = '';

      if (state.lastFocused && typeof state.lastFocused.focus === 'function') {
        state.lastFocused.focus();
      }
    }, 500);
  }

  function setToggleState(id, checked) {
    var toggle = $(id);
    if (!toggle) return;
    toggle.setAttribute('aria-checked', checked ? 'true' : 'false');
  }

  function getToggleState(id) {
    var toggle = $(id);
    return toggle ? toggle.getAttribute('aria-checked') === 'true' : false;
  }

  function toggleSwitch(id) {
    var el = $(id);
    if (!el || el.disabled) return;
    var next = el.getAttribute('aria-checked') !== 'true';
    setToggleState(id, next);
  }

  function applyConsent(consent, eventName) {
    var saved = saveCookiePreferences(consent);
    updateGoogleConsent(saved);
    hideCookieBanner();
    closePreferenceModal();
    dispatchEvent(eventName || 'consentUpdated', saved);
  }

  function acceptAllCookies() {
    applyConsent(acceptAllConsent(), 'acceptAll');
  }

  function rejectAllCookies() {
    applyConsent(rejectAllConsent(), 'rejectAll');
  }

  function saveCookiePreferencesFromModal() {
    var consent = {
      necessary: true,
      analytics: getToggleState('cookie-toggle-analytics'),
      marketing: getToggleState('cookie-toggle-marketing'),
      preferences: getToggleState('cookie-toggle-preferences'),
      timestamp: new Date().toISOString(),
    };
    applyConsent(consent, 'savePreferences');
  }

  function bindEvents() {
    $('cookie-accept-all')?.addEventListener('click', acceptAllCookies);
    $('cookie-reject-all')?.addEventListener('click', rejectAllCookies);
    $('cookie-customize')?.addEventListener('click', openPreferenceModal);
    $('cookie-modal-accept-all')?.addEventListener('click', acceptAllCookies);
    $('cookie-modal-reject-all')?.addEventListener('click', rejectAllCookies);
    $('cookie-save-preferences')?.addEventListener('click', saveCookiePreferencesFromModal);
    $('cookie-modal-close')?.addEventListener('click', closePreferenceModal);

    state.overlay?.addEventListener('click', closePreferenceModal);

    ['cookie-toggle-analytics', 'cookie-toggle-marketing', 'cookie-toggle-preferences'].forEach(function (id) {
      var el = $(id);
      if (el) {
        el.addEventListener('click', function () {
          toggleSwitch(id);
        });
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && state.modal && !state.modal.hidden) {
        closePreferenceModal();
      }
      trapFocus(e);
    });

    document.querySelectorAll('[data-cookie-preferences]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openPreferenceModal();
      });
    });
  }

  function injectCookieUI() {
    if ($('cookie-consent-root')) return;

    var root = document.createElement('div');
    root.id = 'cookie-consent-root';
    root.setAttribute('aria-live', 'polite');
    root.innerHTML = document.getElementById('cookie-consent-template')?.innerHTML || '';

    if (!root.querySelector('#cookie-banner')) {
      fetchTemplateFallback(root);
    }

    document.body.appendChild(root);
    state.banner = $('cookie-banner');
    state.modal = $('cookie-modal');
    state.overlay = $('cookie-overlay');
  }

  function fetchTemplateFallback(root) {
    root.innerHTML = [
      '<div class="cookie-overlay" id="cookie-overlay" hidden aria-hidden="true"></div>',
      '<div class="cookie-banner" id="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-desc" hidden>',
      '  <div class="cookie-card">',
      '    <h2 class="cookie-title" id="cookie-banner-title">🍪 Cookie Preferences</h2>',
      '    <p class="cookie-description" id="cookie-banner-desc">We use cookies to improve your browsing experience, analyze website traffic, personalize content, and enhance marketing performance. You can accept all cookies, reject optional cookies, or customize your preferences.</p>',
      '    <div class="cookie-buttons">',
      '      <button type="button" class="cookie-accept" id="cookie-accept-all" aria-label="Accept all cookies">Accept All</button>',
      '      <button type="button" class="cookie-reject" id="cookie-reject-all" aria-label="Reject optional cookies">Reject All</button>',
      '      <button type="button" class="cookie-customize" id="cookie-customize" aria-label="Customize cookie preferences">Customize</button>',
      '    </div>',
      '  </div>',
      '</div>',
      '<div class="cookie-modal" id="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" hidden>',
      '  <div class="cookie-card">',
      '    <div class="cookie-modal-header">',
      '      <h2 class="cookie-title" id="cookie-modal-title">🍪 Cookie Preferences</h2>',
      '      <button type="button" class="cookie-modal-close" id="cookie-modal-close" aria-label="Close cookie preferences dialog"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>',
      '    </div>',
      '    <div class="cookie-toggle"><div class="cookie-toggle-info"><span class="cookie-toggle-label">Necessary</span><p class="cookie-toggle-desc">Required for website functionality. Always enabled. Cannot be disabled.</p></div>',
      '      <button type="button" class="cookie-switch" id="cookie-toggle-necessary" role="switch" aria-checked="true" aria-label="Necessary cookies" disabled><span class="cookie-switch-thumb"></span></button></div>',
      '    <div class="cookie-toggle"><div class="cookie-toggle-info"><span class="cookie-toggle-label">Analytics</span><p class="cookie-toggle-desc">Used by Google Analytics 4 and Microsoft Clarity.</p></div>',
      '      <button type="button" class="cookie-switch" id="cookie-toggle-analytics" role="switch" aria-checked="false" aria-label="Analytics cookies"><span class="cookie-switch-thumb"></span></button></div>',
      '    <div class="cookie-toggle"><div class="cookie-toggle-info"><span class="cookie-toggle-label">Marketing</span><p class="cookie-toggle-desc">Used by Google Ads and Meta Pixel.</p></div>',
      '      <button type="button" class="cookie-switch" id="cookie-toggle-marketing" role="switch" aria-checked="false" aria-label="Marketing cookies"><span class="cookie-switch-thumb"></span></button></div>',
      '    <div class="cookie-toggle"><div class="cookie-toggle-info"><span class="cookie-toggle-label">Preferences</span><p class="cookie-toggle-desc">Stores UI preferences.</p></div>',
      '      <button type="button" class="cookie-switch" id="cookie-toggle-preferences" role="switch" aria-checked="false" aria-label="Preferences cookies"><span class="cookie-switch-thumb"></span></button></div>',
      '    <div class="cookie-modal-actions">',
      '      <button type="button" class="cookie-save" id="cookie-save-preferences" aria-label="Save cookie preferences">Save Preferences</button>',
      '      <button type="button" class="cookie-accept" id="cookie-modal-accept-all" aria-label="Accept all cookies">Accept All</button>',
      '      <button type="button" class="cookie-reject" id="cookie-modal-reject-all" aria-label="Reject optional cookies">Reject All</button>',
      '    </div>',
      '  </div>',
      '</div>',
    ].join('');
  }

  function initializeCookieConsent() {
    state.banner = $('cookie-banner');
    state.modal = $('cookie-modal');
    state.overlay = $('cookie-overlay');

    if (!state.banner) {
      injectCookieUI();
      state.banner = $('cookie-banner');
      state.modal = $('cookie-modal');
      state.overlay = $('cookie-overlay');
    }

    bindEvents();

    var saved = loadCookiePreferences();
    if (saved) {
      updateGoogleConsent(saved);
      return;
    }

    showCookieBanner();
  }

  window.AalphaleoCookieConsent = {
    initializeCookieConsent: initializeCookieConsent,
    showCookieBanner: showCookieBanner,
    hideCookieBanner: hideCookieBanner,
    openPreferenceModal: openPreferenceModal,
    closePreferenceModal: closePreferenceModal,
    acceptAllCookies: acceptAllCookies,
    rejectAllCookies: rejectAllCookies,
    saveCookiePreferences: saveCookiePreferencesFromModal,
    loadCookiePreferences: loadCookiePreferences,
    updateGoogleConsent: updateGoogleConsent,
    resetCookiePreferences: resetCookiePreferences,
    isConsentExpired: isConsentExpired,
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCookieConsent);
  } else {
    requestAnimationFrame(initializeCookieConsent);
  }
})();
