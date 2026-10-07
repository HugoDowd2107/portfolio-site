// Pill that floats beside the cursor over [data-cursor] elements: "View" on project
// cards, "Copy" on the email link (clicking copies the address instead of opening mail).
// Mouse/trackpad only; touch devices keep the plain link behaviour.
(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  var pill = document.querySelector('.cursor-pill');
  if (!pill) return;

  var OFFSET_X = 16;
  var OFFSET_Y = 16;
  // Fraction of the remaining distance covered each frame — a gentle trailing float
  var EASE = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.2;

  var target = { x: 0, y: 0 };
  var current = { x: 0, y: 0 };
  var visible = false;
  var raf = null;

  function place() {
    pill.style.transform = 'translate3d(' + current.x + 'px,' + current.y + 'px,0)';
  }

  function tick() {
    current.x += (target.x - current.x) * EASE;
    current.y += (target.y - current.y) * EASE;
    place();
    if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
      raf = requestAnimationFrame(tick);
    } else {
      raf = null;
    }
  }

  function show(x, y) {
    target.x = x + OFFSET_X;
    target.y = y + OFFSET_Y;
    if (!visible) {
      // Appear at the cursor rather than gliding in from wherever it last was
      current.x = target.x;
      current.y = target.y;
      place();
      pill.classList.add('is-visible');
      visible = true;
    }
    if (raf === null) raf = requestAnimationFrame(tick);
  }

  function hide() {
    if (!visible) return;
    pill.classList.remove('is-visible');
    visible = false;
  }

  var last = null;

  var copiedTimer = null;
  var copiedTarget = null;

  function clearCopied() {
    clearTimeout(copiedTimer);
    copiedTarget = null;
  }

  function update(x, y, el) {
    var hovered = el && el.closest('[data-cursor]');
    if (!hovered) {
      hide();
      clearCopied();
      return;
    }
    // Keep showing "Copied" while the cursor stays on the link it was copied from
    if (hovered !== copiedTarget) {
      clearCopied();
      pill.dataset.variant = hovered.dataset.cursor;
    }
    show(x, y);
  }

  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    last = { x: e.clientX, y: e.clientY };
    update(e.clientX, e.clientY, e.target);
  }, { passive: true });

  // Scrolling moves cards under a still cursor without firing pointermove
  window.addEventListener('scroll', function () {
    if (last) update(last.x, last.y, document.elementFromPoint(last.x, last.y));
  }, { passive: true });

  // Mouse clicks on a copy target copy instead of following the link. Keyboard
  // activation (detail 0) has no pill for feedback, so it keeps the mailto link.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-copy]');
    if (!link || e.detail === 0 || !navigator.clipboard) return;
    e.preventDefault();
    navigator.clipboard.writeText(link.dataset.copy).then(function () {
      clearCopied();
      copiedTarget = link;
      pill.dataset.variant = 'copied';
      copiedTimer = setTimeout(function () {
        copiedTarget = null;
        pill.dataset.variant = link.dataset.cursor;
      }, 1500);
    }, function () {
      window.location.href = link.href;
    });
  });

  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
})();
