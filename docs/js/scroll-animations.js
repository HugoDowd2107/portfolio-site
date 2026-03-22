(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.IntersectionObserver) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  var selectors = [
    // Portfolio — hero
    '.hero-badges',
    '.title',
    '.hero-subtitle',
    // Portfolio — experience
    '.section-3 .section-title',
    '.experience-row',
    '.footer-group',
    // Case study — hero
    '.cs-hero .cs-label',
    '.cs-hero h1',
    '.cs-hero .cs-image',
    '.cs-hero .cs-metrics-grid',
    // Case study — sections
    '.cs-section-label',
    '.cs-section h2',
    '.cs-section .cs-image',
    '.cs-section .cs-metrics-grid',
    '.cs-section .cs-stat-grid',
    '.cs-section .cs-icon-cards',
    '.cs-section .cs-learning-cards',
    '.cs-section .cs-detail-row',
    '.cs-section .cs-container > p',
  ];

  function init() {
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        el.classList.add('scroll-reveal');
        observer.observe(el);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
