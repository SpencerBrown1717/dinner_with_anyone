/* Dinner With Anyone — shared interactive bits */
(function () {
  var topbar = document.querySelector('.topbar');
  var menuBtn = document.querySelector('.menu-btn');
  var mobile = document.querySelector('.mobile');

  if (menuBtn && mobile) {
    var menuId = mobile.id || 'mobile-nav';
    mobile.id = menuId;
    menuBtn.setAttribute('aria-controls', menuId);
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open navigation menu');

    var setOpen = function (open) {
      mobile.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuBtn.addEventListener('click', function () {
      setOpen(!mobile.classList.contains('open'));
    });

    mobile.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1) {
        var el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ---- Avatar demo: simulated state machine ----
  var stage = document.getElementById('avatar-stage');
  if (stage) {
    var stateLabel = stage.querySelector('[data-state-label]');
    var slideNum = document.getElementById('slide-num');
    var slides = document.querySelectorAll('#slide-list .slide');
    var transcript = document.getElementById('transcript');
    var timers = [];
    var responseIdx = 0;

    var responses = [
      {
        slide: 2,
        text: 'Start with the question your students would actually ask each other after class. The math is downstream of curiosity.'
      },
      {
        slide: 3,
        text: 'Strip the problem down until almost nothing is left. The thing that will not go away is the thing worth building the answer around.'
      },
      {
        slide: 4,
        text: 'Tell them: pick a frame of reference you have always trusted. Question it for one week. Write down what changes.'
      }
    ];

    var capitalize = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };

    var setState = function (s) {
      stage.dataset.state = s;
      if (stateLabel) stateLabel.textContent = capitalize(s);
    };

    var clearTimers = function () {
      timers.forEach(function (t) { clearTimeout(t); });
      timers = [];
    };

    var highlightSlide = function (n) {
      slides.forEach(function (el) {
        el.classList.toggle('is-active', el.getAttribute('data-slide') === String(n));
      });
      if (slideNum) slideNum.textContent = n;
    };

    var appendTranscript = function (kind, text, label) {
      if (!transcript) return;
      var defaults = { user: 'Student', avatar: 'Albert Einstein-inspired avatar', system: 'System' };
      var row = document.createElement('div');
      row.className = 't-row ' + kind;
      var who = document.createElement('span');
      who.className = 'who';
      who.textContent = label || defaults[kind] || 'System';
      var p = document.createElement('p');
      p.textContent = text;
      row.appendChild(who);
      row.appendChild(p);
      transcript.appendChild(row);
      row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    var runResponse = function (userText) {
      clearTimers();
      if (userText) appendTranscript('user', userText);
      setState('listening');
      timers.push(setTimeout(function () {
        setState('thinking');
        timers.push(setTimeout(function () {
          var r = responses[responseIdx % responses.length];
          responseIdx += 1;
          setState('speaking');
          highlightSlide(r.slide);
          appendTranscript('avatar', r.text);
          timers.push(setTimeout(function () { setState('ready'); }, 4500));
        }, 1800));
      }, 1800));
    };

    var startBtn = stage.querySelector('[data-action="start"]');
    var textBtn = stage.querySelector('[data-action="text"]');
    var uploadBtn = stage.querySelector('[data-action="upload"]');
    var endBtn = stage.querySelector('[data-action="end"]');
    var regenBtn = document.querySelector('[data-action="regenerate"]');

    if (startBtn) startBtn.addEventListener('click', function () { runResponse(); });
    if (textBtn) textBtn.addEventListener('click', function () {
      runResponse('How would you explain this to my MBA class so they actually feel it?');
    });
    if (uploadBtn) uploadBtn.addEventListener('click', function () {
      appendTranscript('system', 'Uploaded: strategy_601_week_2.pdf · Ingested into professor avatar context.');
    });
    if (endBtn) endBtn.addEventListener('click', function () {
      clearTimers();
      setState('ready');
      appendTranscript('system', 'Session ended. Transcript saved for export.');
    });
    if (regenBtn) regenBtn.addEventListener('click', function () {
      regenBtn.textContent = 'Regenerating…';
      setTimeout(function () { regenBtn.textContent = 'Regenerate'; }, 1100);
    });
  }

  // ---- Pricing: monthly / annual toggle ----
  var toggle = document.querySelector('[data-billing-toggle]');
  if (toggle) {
    var buttons = toggle.querySelectorAll('button[data-period]');
    var setPeriod = function (period) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-period') === period ? 'true' : 'false');
      });
      document.querySelectorAll('[data-price]').forEach(function (el) {
        var v = el.getAttribute('data-' + period);
        if (v != null) el.textContent = v;
      });
      document.querySelectorAll('[data-per]').forEach(function (el) {
        el.textContent = period === 'annual' ? '/mo, billed annually' : '/mo';
      });
    };
    buttons.forEach(function (b) {
      b.addEventListener('click', function () { setPeriod(b.getAttribute('data-period')); });
    });
  }
})();
