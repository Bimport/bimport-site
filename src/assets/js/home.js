(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobile-nav');
  const background = [...document.querySelectorAll('main,.home-footer,.mobile-contact,.home-motion-toggle,.skip-link,.home-header .wordmark')];
  const previousInert = new Map();
  const closeMenu = (restoreFocus = true) => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    nav.hidden = true;
    document.body.classList.remove('menu-open');
    previousInert.forEach((inert, element) => { element.inert = inert; });
    previousInert.clear();
    if (restoreFocus) toggle.focus({preventScroll:true});
  };
  toggle.addEventListener('click', () => {
    if (!nav.hidden) { closeMenu(); return; }
    background.forEach(element => {
      previousInert.set(element, element.inert);
      element.inert = true;
    });
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'メニューを閉じる');
    nav.hidden = false;
    document.body.classList.add('menu-open');
    nav.querySelector('a').focus({preventScroll:true});
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    closeMenu(false);
    const href = link.getAttribute('href');
    const target = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
    if (target) {
      const heading = target.querySelector('h2,h1') || target;
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll:true});
    } else toggle.focus({preventScroll:true});
  }));
  document.addEventListener('keydown', event => {
    if (nav.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(); }
    if (event.key === 'Tab') {
      const controls = [toggle, ...nav.querySelectorAll('a')];
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) {
        event.preventDefault(); controls[controls.length - 1].focus();
      } else if (!event.shiftKey && (index === controls.length - 1 || index === -1)) {
        event.preventDefault(); controls[0].focus();
      }
    }
  });
  const desktop = window.matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', () => {
    if (desktop.matches && !nav.hidden) {
      closeMenu(false);
      document.querySelector('.home-header .wordmark').focus({preventScroll:true});
    }
  });
  const track = document.querySelector('.cases-track');
  const prev = document.querySelector('[data-case-prev]');
  const next = document.querySelector('[data-case-next]');
  const current = document.getElementById('case-current');
  const step = () => track.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const move = direction => track.scrollBy({ left: direction * step(), behavior: reducedMotion.matches || document.body.classList.contains('motion-paused') ? 'instant' : 'smooth' });
  const update = () => {
    prev.disabled = track.scrollLeft < 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    current.textContent = String(Math.round(track.scrollLeft / step()) + 1).padStart(2, '0');
  };
  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
  });
  window.addEventListener('resize', update);
  update();
})();

// Keep the consultation controls clear of the form, even with motion disabled.
(() => {
  const form = document.querySelector('#estimate');
  if (!form) return;
  let pending = false;
  const update = () => {
    pending = false;
    const rect = form.getBoundingClientRect();
    document.body.classList.toggle('form-in-view', rect.top < innerHeight && rect.bottom > 0);
  };
  const schedule = () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(form);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', schedule);
  update();
})();
