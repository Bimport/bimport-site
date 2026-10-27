(() => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mobile-nav');
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    nav.hidden = true;
    document.body.classList.remove('menu-open');
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !nav.hidden) { closeMenu(); toggle.focus(); }
  });
  const desktop = window.matchMedia('(min-width: 768px)');
  desktop.addEventListener('change', () => { if (desktop.matches) closeMenu(); });
  const track = document.querySelector('.cases-track');
  const prev = document.querySelector('[data-case-prev]');
  const next = document.querySelector('[data-case-next]');
  const current = document.getElementById('case-current');
  const step = () => track.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const move = direction => track.scrollBy({ left: direction * step(), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
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
  document.querySelectorAll('[data-cta]').forEach(el => el.addEventListener('click', () => {
    if (typeof gtag === 'function') gtag('event', 'cta_click', { cta_location: el.dataset.cta, cta_type: el.dataset.ctaType });
  }));
})();
