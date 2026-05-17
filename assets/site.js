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
})();
