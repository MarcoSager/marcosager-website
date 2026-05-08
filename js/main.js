/* ============================================================
   MARCO SAGER CONSULTING — main.js
   ============================================================ */

(function () {
  'use strict';


  /* ---------- NAV SCROLL ---------- */
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 40;

  function onScroll() {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- ACTIVE NAV LINKS ---------- */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    sections.forEach(function (sec) {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + sec.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ---------- HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', function () {
    const open = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  navMenu.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- SCROLL REVEAL ---------- */
  /* Elements are always visible. JS adds subtle fade-in when scrolled into view. */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'none';
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    document.querySelectorAll('.reveal-up').forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      revealObserver.observe(el);
    });
  }

  /* ---------- COUNTER ANIMATION ---------- */
  function animateCounter(el, target, duration) {
    const isFloat = target % 1 !== 0;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;
      el.textContent = isFloat
        ? current.toFixed(1)
        : Math.round(current).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target % 1 === 0
        ? target.toLocaleString()
        : target.toFixed(1);
    }
    requestAnimationFrame(tick);
  }

  /* Observe stat numbers */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        if (raw === '200K') {
          animateCounter(el, 200, 1800);
          const origAfter = 'K';
          const clone = el;
          setTimeout(function () { clone.textContent = '200K'; }, 1900);
        } else {
          const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
          if (!isNaN(num)) animateCounter(el, num, 1600);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(function (el) { counterObserver.observe(el); });

  /* ---------- LANGUAGE TOGGLE ---------- */
  const htmlEl = document.documentElement;

  window.setLang = function (lang) {
    htmlEl.setAttribute('lang', lang);
    htmlEl.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.langSwitch === lang);
    });

    document.querySelectorAll('[data-en][data-de]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang);
      if (val) el.innerHTML = val;
    });

    document.querySelectorAll('[data-en-placeholder]').forEach(function (el) {
      var ph = el.getAttribute('data-' + lang + '-placeholder');
      if (ph) el.setAttribute('placeholder', ph);
    });

    try { localStorage.setItem('ms-lang', lang); } catch (e) {}
  };

  document.querySelectorAll('[data-lang-switch]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.setLang(btn.dataset.langSwitch);
    });
  });

  /* Restore saved lang */
  try {
    var saved = localStorage.getItem('ms-lang');
    if (saved) window.setLang(saved);
  } catch (e) {}

  /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ---------- CHAPTER TRACK ---------- */
  var chapterTrack = document.getElementById('chapterTrack');
  if (chapterTrack) {
    var chapterDots = chapterTrack.querySelectorAll('.chapter-dot');
    var chapterIds = ['home', 'book', 'services', 'story', 'why', 'clients', 'contact'];

    function updateChapterTrack() {
      if (window.scrollY > 200) {
        chapterTrack.classList.add('visible');
      } else {
        chapterTrack.classList.remove('visible');
      }
      var active = 'home';
      chapterIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (!el) return;
        if (window.scrollY >= el.offsetTop - 180) active = id;
      });
      chapterDots.forEach(function (dot) {
        dot.classList.toggle('active', dot.dataset.chapter === active);
      });
    }
    window.addEventListener('scroll', updateChapterTrack, { passive: true });
    updateChapterTrack();

    chapterDots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var target = document.getElementById(dot.dataset.chapter);
        if (!target) return;
        var offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h'), 10) || 72;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      });
    });
  }

  /* ---------- STICKY BAR CLOSE ---------- */
  var waBar = document.getElementById('waBar');
  var waBarClose = document.getElementById('waBarClose');
  if (waBarClose && waBar) {
    waBarClose.addEventListener('click', function () {
      waBar.classList.add('hidden');
    });
  }

  /* ---------- HERO PHOTO LOAD ---------- */
  var heroPhoto = document.querySelector('.hero-photo');
  if (heroPhoto) {
    if (heroPhoto.complete) {
      heroPhoto.classList.add('loaded');
    } else {
      heroPhoto.addEventListener('load', function () { heroPhoto.classList.add('loaded'); });
    }
  }

  /* ---------- CONTACT FORM ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      const lang = htmlEl.getAttribute('data-lang') || 'en';

      btn.textContent = lang === 'de' ? 'Sende...' : 'Sending...';
      btn.disabled = true;

      /* Simulate send (replace with real endpoint / Formspree / EmailJS) */
      setTimeout(function () {
        form.innerHTML =
          '<div class="form-success visible">' +
          '<p>' +
          (lang === 'de'
            ? 'Vielen Dank — ich melde mich innerhalb von 24 Stunden.'
            : 'Thank you — I\'ll be in touch within 24 hours.') +
          '</p></div>';
      }, 900);
    });
  }

})();
