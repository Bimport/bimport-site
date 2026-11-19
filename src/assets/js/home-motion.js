(() => {
  // This module is loaded by the homepage only. Never hide content as a prerequisite.
  const hero = document.querySelector('.home-hero');
  const toggle = document.querySelector('.home-motion-toggle');
  if (!hero || !toggle || !window.IntersectionObserver || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const body = document.body;
  const running = new Set();
  const sceneButtons = [...document.querySelectorAll('[data-scene]')];
  const sceneTrack = document.querySelector('.hero-scene-track i');
  const flowSteps = [...document.querySelectorAll('.flow-grid li')];
  const flowNumber = document.querySelector('[data-flow-number]');
  const dial = document.querySelector('.flow-dial');
  const watermark = document.querySelector('.hero-watermark');
  const approach = document.querySelector('#approach');
  const approachWord = document.querySelector('.approach-word');
  const contact = document.querySelector('#contact');
  const contactWord = document.querySelector('.contact-word');
  const bar = document.createElement('div');
  bar.id = 'home-reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  body.append(bar);
  let paused = reduced.matches;
  let scene = 0;
  let autoScenes = true;
  let heroVisible = true;
  let timer;
  let wipeTimer;
  let frame;
  let activeStep = -1;
  const canMove = () => !paused && !reduced.matches && !document.hidden;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function enter(el, from, duration = 1100, delay = 0) {
    if (!canMove() || !el) return;
    const animation = el.animate([from, {opacity:1, transform:'none', clipPath:'inset(0)'}], {
      duration, delay, easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards'
    });
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
  }
  function restartScenes() {
    clearInterval(timer);
    if (canMove() && heroVisible && autoScenes) {
      timer = setInterval(() => switchScene((scene + 1) % 2), 8000);
    }
  }
  function switchScene(index) {
    if (index === scene) return;
    scene = index;
    hero.classList.toggle('scene-two', scene === 1);
    document.querySelector('.hero-scene-count').textContent = `0${scene + 1} / 02`;
    sceneButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === scene)));
    hero.classList.remove('is-switching');
    clearTimeout(wipeTimer);
    if (canMove()) {
      void hero.offsetWidth;
      hero.classList.add('is-switching');
      wipeTimer = setTimeout(() => hero.classList.remove('is-switching'), 1600);
    }
    sceneTrack.style.animation = 'none';
    void sceneTrack.offsetWidth;
    sceneTrack.style.removeProperty('animation');
  }
  sceneButtons.forEach((button, index) => button.addEventListener('click', () => {
    autoScenes = false;
    body.classList.add('motion-manual-scenes');
    switchScene(index);
    restartScenes();
  }));
  // Keyboard users retain the scene they have reached; there is no timed focus movement.
  hero.addEventListener('focusin', () => { clearInterval(timer); });
  hero.addEventListener('focusout', event => {
    if (!hero.contains(event.relatedTarget)) restartScenes();
  });

  function syncPlayback() {
    body.classList.toggle('motion-paused', paused || reduced.matches);
    body.classList.toggle('motion-background-paused', document.hidden);
    toggle.hidden = reduced.matches;
    toggle.textContent = paused ? '▶ 動きを再生' : 'Ⅱ 動きを停止';
    toggle.setAttribute('aria-pressed', String(paused));
    if (!canMove()) {
      running.forEach(animation => animation.cancel());
      hero.classList.remove('is-switching');
    }
    restartScenes();
    schedule();
  }
  toggle.addEventListener('click', () => { paused = !paused; syncPlayback(); });
  reduced.addEventListener('change', () => { paused = reduced.matches; syncPlayback(); });
  document.addEventListener('visibilitychange', syncPlayback);
  body.classList.add('motion-enabled');
  document.querySelector('.hero-scenes').hidden = false;
  syncPlayback();

  if (scrollY < 80) {
    document.querySelectorAll('#hero-title span').forEach((el, i) =>
      enter(el, {opacity:.1, transform:'translateY(65px)', clipPath:'inset(0 0 100% 0)'}, 1300, 150 + i * 180));
    enter(document.querySelector('.hero-subtitle'), {opacity:0, transform:'translateY(25px)'}, 1000, 450);
  }

  const observer = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      if (!isIntersecting) continue;
      observer.unobserve(target);
      target.classList.add('is-arrived');
      const delay = Number(target.dataset.motionDelay || 0);
      if (target.matches('.case-premium')) {
        enter(target, {opacity:0, transform:'translateY(12px)'}, 850, 100);
      } else if (target.matches('.case-image')) {
        enter(target, {clipPath:'inset(0 100% 0 0)'}, 1250, delay);
      } else if (target.matches('.editorial-main-photo,.journey-photo')) {
        enter(target, {clipPath:'inset(12% 18% 12% 18%)', transform:'scale(.88)'}, 1500);
      } else if (target.matches('.editorial-detail-photo')) {
        enter(target, {opacity:0, transform:'translate(70px,100px) rotate(7deg)'}, 1450, 180);
      } else if (target.matches('.approach-grid article')) {
        enter(target, {opacity:.1, transform:'translateY(85px)'}, 1100, delay);
      } else if (target.matches('.flow-grid li')) {
        enter(target, {opacity:.2, transform:'translateX(65px)'}, 950);
      } else if (target.matches('.group-stores-list li')) {
        enter(target, {opacity:.2, transform:'translateY(45px)'}, 950, delay);
      } else {
        enter(target, {opacity:.2, transform:'translateY(55px)'}, 1100);
      }
    }
  }, {threshold:.12});
  document.querySelectorAll('.approach-grid article,.group-stores-list li,.case-image').forEach((el, i) => {
    el.dataset.motionDelay = String((i % 3) * 130);
  });
  document.querySelectorAll('#group h2,#group .group-intro-copy,#cases .section-heading,.case-image,.case-premium,#approach .section-heading,.approach-grid article,.editorial-main-photo,.editorial-detail-photo,.journey-photo,.consultation-layout>div,.flow-intro h2,.flow-grid li,.information-section h2,#faq h2,#company .information-grid>div,.group-stores-heading,.group-stores-list li,#contact h2')
    .forEach(el => observer.observe(el));

  const visibility = new IntersectionObserver(entries => {
    for (const {target, isIntersecting} of entries) {
      target.classList.toggle('is-offscreen', !isIntersecting);
      if (target === hero) { heroVisible = isIntersecting; body.classList.toggle('hero-in-view', isIntersecting); restartScenes(); }
    }
  });
  visibility.observe(hero);

  function update() {
    frame = 0;
    if (!canMove()) return;
    const heroRect = hero.getBoundingClientRect();
    if (heroRect.bottom > 0) watermark.style.transform = `translateX(${-clamp(scrollY * .28, 0, 180)}px)`;
    const ar = approach.getBoundingClientRect();
    if (approachWord && ar.bottom > 0 && ar.top < innerHeight) approachWord.style.transform = `translateX(${clamp((innerHeight / 2 - ar.top) * -.2, -160, 80)}px)`;
    const cr = contact.getBoundingClientRect();
    if (cr.bottom > 0 && cr.top < innerHeight) contactWord.style.transform = `translateX(${clamp((innerHeight - cr.top) * .15, 0, 160)}px)`;
    document.querySelectorAll('[data-photo-parallax]').forEach(el => {
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < innerHeight) {
        el.style.translate = `0 ${clamp((innerHeight / 2 - rect.top - rect.height / 2) * .08, -22, 22)}px`;
      }
    });
    let nextStep = 0;
    flowSteps.forEach((el, index) => { if (el.getBoundingClientRect().top < innerHeight * .56) nextStep = index; });
    if (nextStep !== activeStep) {
      activeStep = nextStep;
      flowSteps.forEach((el, index) => el.classList.toggle('is-current', index === activeStep));
      flowNumber.textContent = String(activeStep + 1).padStart(2, '0');
      dial.style.setProperty('--flow-offset', String(1 - (activeStep + 1) / flowSteps.length));
      enter(flowNumber, {opacity:.3, transform:'translateY(22px)'}, 500);
    }
    const total = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${total > 0 ? clamp(scrollY / total, 0, 1) : 0})`;
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule);
  addEventListener('load', schedule, {once:true});
  schedule();
})();
