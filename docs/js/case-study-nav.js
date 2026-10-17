// Marks the section nav link for the section being read (case study pages)
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.cs-nav-link'));
  if (!links.length) return;
  var sections = links.map(function (link) {
    return document.getElementById(link.getAttribute('href').slice(1));
  });
  var currentIndex = -1;
  var queued = false;

  function update() {
    queued = false;
    // A section counts as current once its top passes the upper third of the window
    var scrollPos = window.scrollY + window.innerHeight / 3;
    var current = 0;
    sections.forEach(function (section, i) {
      if (section && section.offsetTop <= scrollPos) current = i;
    });
    // A short last section can't scroll to the top, so it takes over at the bottom
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections.length - 1;
    }
    // Only touch the DOM when the section actually changes
    if (current === currentIndex) return;
    currentIndex = current;
    links.forEach(function (link, i) {
      link.classList.toggle('is-current', i === current);
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  // At most once per frame, however fast scroll events arrive
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  update();
})();
