(() => {
  'use strict';
  const root = document.querySelector('.home-network');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  const grid = $('.network-grid');
  const preview = $('.map-store-preview');
  const choices = $$('.network-choice');
  const frames = $$('.map-preview-frame');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const narrow = matchMedia('(max-width: 680px)');
  const motionPaused = () => reduced.matches || document.body.classList.contains('motion-paused');
  let index = choices.findIndex(choice => choice.dataset.storeId === 'okayama');
  let pinned = false;
  let source;
  let scrollLock = false;
  let scrollTimer;
  let hideTimer;
  function show(next, trigger, pin = false) {
    clearTimeout(hideTimer);
    index = next;
    source = trigger;
    pinned = pin;
    const region = choices[index].dataset.region;
    choices.forEach((choice, i) => choice.setAttribute('aria-pressed', String(i === index)));
    $$('.map-point,.map-route').forEach(point => {
      const active = point.dataset.region === region;
      point.classList.toggle('active', active);
      if (point.classList.contains('map-point')) point.setAttribute('aria-pressed', String(active));
    });
    frames.forEach((frame, i) => {
      frame.classList.toggle('is-active', i === index);
      frame.setAttribute('aria-hidden', String(i !== index));
    });
    preview.inert = false;
    preview.setAttribute('aria-hidden', 'false');
    preview.classList.add('is-visible');
  }
  function hide() {
    clearTimeout(hideTimer);
    pinned = false;
    preview.classList.remove('is-visible');
    preview.setAttribute('aria-hidden', 'true');
    preview.inert = true;
  }
  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      const focused = document.activeElement;
      const keyboardFocus = grid.contains(focused) && focused?.matches(':focus-visible');
      if (!pinned && !scrollLock && !keyboardFocus && !preview.matches(':hover')) hide();
    }, 140);
  }
  function bind(trigger, getIndex) {
    trigger.setAttribute('aria-controls', 'map-store-preview');
    trigger.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch' && !scrollLock) show(getIndex(), trigger);
    });
    trigger.addEventListener('pointerleave', scheduleHide);
    trigger.addEventListener('focus', () => show(getIndex(), trigger));
    trigger.addEventListener('click', () => {
      show(getIndex(), trigger, true);
      const bounds = preview.getBoundingClientRect();
      if (narrow.matches && (bounds.top < 104 || bounds.bottom > innerHeight - 70)) {
        scrollLock = true;
        clearTimeout(scrollTimer);
        preview.scrollIntoView({ block: 'center', behavior: motionPaused() ? 'instant' : 'smooth' });
        scrollTimer = setTimeout(() => { scrollLock = false; }, motionPaused() ? 50 : 800);
      }
    });
  }
  choices.forEach((choice, i) => bind(choice, () => i));
  $$('.map-point').forEach(point => {
    point.setAttribute('role', 'button');
    point.setAttribute('tabindex', '0');
    point.setAttribute('aria-pressed', String(point.classList.contains('active')));
    bind(point, () => choices[index].dataset.region === point.dataset.region
      ? index : choices.findIndex(choice => choice.dataset.region === point.dataset.region));
    point.addEventListener('keydown', event => {
      if (!['Enter', ' '].includes(event.key)) return;
      event.preventDefault(); point.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  });
  grid.addEventListener('pointerleave', scheduleHide);
  preview.addEventListener('pointerenter', () => clearTimeout(hideTimer));
  preview.addEventListener('pointerleave', scheduleHide);
  grid.addEventListener('focusout', event => {
    if (!pinned && !grid.contains(event.relatedTarget)) hide();
  });
  function dismiss() {
    if (preview.contains(document.activeElement)) source?.focus({ preventScroll: true });
    hide();
  }
  $('.map-preview-close').addEventListener('click', dismiss);
  grid.addEventListener('keydown', event => {
    if (event.key === 'Escape' && preview.classList.contains('is-visible')) {
      event.preventDefault(); dismiss();
    }
  });
  root.classList.add('is-enhanced');
  $('.network-hint').hidden = false;
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => {
      for (const { isIntersecting } of entries) {
        root.classList.toggle('is-offscreen', !isIntersecting);
        if (isIntersecting) root.classList.add('is-arrived');
      }
    });
    visibility.observe(root);
  } else root.classList.add('is-arrived');
})();
