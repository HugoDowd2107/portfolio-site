(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.IntersectionObserver) return;

  var STAGGER_MS = 50;
  var MAX_DELAY_MS = 150;

  var selectors = [
    // Case study — sections (the hero and navigation animate on load in CSS)
    '.cs-section-label',
    '.cs-section h2',
    '.cs-section .cs-image',
    '.cs-section .cs-image-grid',
    '.cs-section .cs-metrics-grid',
    '.cs-section .cs-stat-grid',
    '.cs-section .cs-icon-cards',
    '.cs-section .cs-learning-cards',
    '.cs-section .cs-detail-row',
    '.cs-section .cs-container > p',
  ];

  // Elements entering together are revealed in reading order with a short
  // cascade, rather than all at once or in whatever order the observer fires.
  var pending = [];
  var flushScheduled = false;

  function flush() {
    flushScheduled = false;
    pending.sort(function (a, b) {
      var ra = a.getBoundingClientRect();
      var rb = b.getBoundingClientRect();
      return (ra.top - rb.top) || (ra.left - rb.left);
    });
    pending.forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', Math.min(i * STAGGER_MS, MAX_DELAY_MS) + 'ms');
      el.classList.add('is-visible');
    });
    pending = [];
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      pending.push(entry.target);
    });
    if (pending.length && !flushScheduled) {
      flushScheduled = true;
      requestAnimationFrame(flush);
    }
  }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

  // Once revealed, drop the animation styles so they don't hold a compositor
  // layer or interfere with hover transforms.
  function cleanup(e) {
    var el = e.target;
    if (e.target !== e.currentTarget || e.propertyName !== 'opacity' || !el.classList.contains('is-visible')) return;
    el.classList.remove('scroll-reveal', 'is-visible');
    el.style.removeProperty('--reveal-delay');
    el.removeEventListener('transitionend', cleanup);
  }

  function collect() {
    var els = [];
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (els.indexOf(el) === -1) els.push(el);
      });
    });
    // Skip elements nested inside another animated element so offsets don't compound
    return els.filter(function (el) {
      return !els.some(function (other) { return other !== el && other.contains(el); });
    });
  }

  function start() {
    collect().forEach(function (el) {
      // Already scrolled past (e.g. restored scroll position) — leave as-is
      if (el.getBoundingClientRect().bottom < 0) return;
      el.classList.add('scroll-reveal');
      el.addEventListener('transitionend', cleanup);
      observer.observe(el);
    });
  }

  // The homepage stays hidden until its background images load; hold off so
  // the hero animation plays when it can actually be seen.
  function whenPageVisible(cb) {
    var root = document.documentElement;
    if (!root.classList.contains('bg-waiting')) return cb();
    var mo = new MutationObserver(function () {
      if (root.classList.contains('bg-waiting')) return;
      mo.disconnect();
      cb();
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  }

  function init() {
    whenPageVisible(start);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
