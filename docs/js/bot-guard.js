(function() {
  'use strict';

  var GA_ID = 'G-0L169JQ1XT';

  // Known bot user-agent patterns
  var botPatterns = [
    /bot/i, /crawl/i, /spider/i, /slurp/i, /mediapartners/i,
    /headless/i, /phantom/i, /selenium/i, /puppeteer/i, /playwright/i,
    /wget/i, /curl/i, /httpie/i, /python-requests/i, /axios/i, /node-fetch/i,
    /ahrefs/i, /semrush/i, /mj12bot/i, /dotbot/i, /petalbot/i,
    /bytespider/i, /gptbot/i, /ccbot/i, /claudebot/i, /anthropic/i,
    /dataforseo/i, /screaming frog/i, /lighthouse/i, /pagespeed/i,
    /google-inspectiontool/i, /facebookexternalhit/i, /twitterbot/i,
    /linkedinbot/i, /whatsapp/i, /telegrambot/i, /applebot/i,
    /yandexbot/i, /baiduspider/i, /sogou/i, /exabot/i,
    /ia_archiver/i, /archive\.org_bot/i
  ];

  function isBot() {
    var ua = navigator.userAgent || '';

    // Check user-agent against known bot patterns
    for (var i = 0; i < botPatterns.length; i++) {
      if (botPatterns[i].test(ua)) return true;
    }

    // Headless browser detection
    if (navigator.webdriver) return true;

    // PhantomJS
    if (window._phantom || window.callPhantom) return true;

    // Nightmare.js
    if (window.__nightmare) return true;

    // No plugins (common in headless browsers, rare in real browsers)
    if (navigator.plugins && navigator.plugins.length === 0 && !/mobile|android|iphone|ipad/i.test(ua)) return true;

    // Missing language
    if (!navigator.language && !navigator.languages) return true;

    return false;
  }

  // Honeypot: flag visitors that trigger the hidden link
  window.__botTrapTriggered = false;
  document.addEventListener('DOMContentLoaded', function() {
    var trap = document.getElementById('bot-trap');
    if (trap) {
      trap.addEventListener('click', function(e) {
        e.preventDefault();
        window.__botTrapTriggered = true;
      });
    }
  });

  // If detected as bot immediately, don't load GA at all
  if (isBot()) return;

  // For non-bots: load GA after a real user interaction to filter passive bots
  var gaLoaded = false;

  function loadGA() {
    if (gaLoaded) return;

    // Final check: if honeypot was triggered, this is a bot
    if (window.__botTrapTriggered) return;

    gaLoaded = true;

    // Load gtag.js
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  // Trigger GA on first meaningful user interaction
  var interactionEvents = ['scroll', 'click', 'touchstart', 'keydown', 'mousemove'];
  function onInteraction() {
    for (var i = 0; i < interactionEvents.length; i++) {
      document.removeEventListener(interactionEvents[i], onInteraction);
    }
    loadGA();
  }

  for (var i = 0; i < interactionEvents.length; i++) {
    document.addEventListener(interactionEvents[i], onInteraction, { once: true, passive: true });
  }

  // Fallback: load GA after 5 seconds even without interaction
  // (catches real users who read without interacting)
  setTimeout(function() {
    if (!gaLoaded && !isBot()) loadGA();
  }, 5000);
})();
