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

  // ---- Formspree ajax submit ----
  // Works automatically on any form with [data-formspree].
  // Set the form's `action` to your Formspree endpoint:
  //   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" data-formspree>
  document.querySelectorAll('form[data-formspree]').forEach(function (form) {
    var success = document.querySelector(form.getAttribute('data-success') || '#formSuccess');
    var errorBox = form.querySelector('[data-form-error]');

    form.addEventListener('submit', async function (e) {
      var action = form.getAttribute('action') || '';
      if (action.indexOf('YOUR_FORM_ID') !== -1) {
        e.preventDefault();
        if (errorBox) {
          errorBox.hidden = false;
          errorBox.textContent = 'Form not yet connected. Add your Formspree endpoint to the form action attribute.';
        }
        return;
      }

      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (errorBox) errorBox.hidden = true;

      try {
        var data = new FormData(form);
        var res = await fetch(action, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: data
        });
        if (res.ok) {
          form.hidden = true;
          if (success) {
            success.hidden = false;
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } else {
          var body = await res.json().catch(function () { return {}; });
          throw new Error((body && body.errors && body.errors[0] && body.errors[0].message) || 'Something went wrong');
        }
      } catch (err) {
        if (errorBox) {
          errorBox.hidden = false;
          errorBox.textContent = (err && err.message) || 'Network error — please try again.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText || 'Send';
        }
      }
    });
  });

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
