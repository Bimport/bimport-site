(() => {
  'use strict';
  const root = document.body;
  if (!root.classList.contains('lp-motion-enabled') || !window.IntersectionObserver || !Element.prototype.animate) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Set();
  let paused = preference.matches;
  let observer;
  let frame;
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'lp-motion-toggle';
  document.querySelector('.lp-hero__inner')?.append(toggle);
  const word = document.createElement('div');
  word.className = 'lp-motion-word';
  word.setAttribute('aria-hidden', 'true');
  word.textContent = 'BIMPORT QUALITY';
  document.querySelector('#reasons')?.prepend(word);
  function animate(el, from, duration = 800, delay = 0) {
    if (!el || paused || document.hidden || el.contains(document.activeElement)) return;
    const animation = el.animate([from, {opacity:1, transform:'none', clipPath:'inset(0)'}], {
      duration, delay, easing:'cubic-bezier(.16,1,.3,1)', fill:'backwards'
    });
    active.add(animation);
    animation.finished.then(() => active.delete(animation), () => active.delete(animation));
  }
  function stop() {active.forEach(animation => animation.cancel());active.clear();}
  function sync() {
    root.classList.toggle('lp-motion-stopped', paused);
    toggle.textContent = paused ? '動きを再開' : '動きを停止';
    toggle.setAttribute('aria-pressed', String(paused));
    if (paused) {stop();word.style.transform = 'none';}
  }
  toggle.addEventListener('click', () => {paused = !paused;sync();});
  preference.addEventListener('change', event => {paused = event.matches;sync();});
  document.addEventListener('visibilitychange', () => {if(document.hidden) stop();});
  sync();
  const hero = document.querySelector('.lp-hero');
  if (hero && hero.getBoundingClientRect().bottom > 0 && !location.hash) {
    document.querySelectorAll('.lp-hero__copy > :not(a)').forEach((el,i) => animate(el,{opacity:0,transform:'translateY(40px)'},1100,i*140));
    animate(document.querySelector('.lp-hero__photo img'),{opacity:1,transform:'scale(1.13)'},6500);
  }
  observer = new IntersectionObserver(entries => {
    entries.forEach(({target,isIntersecting}) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      if (target.matches('.lp-line__photo,.lp-final__bg')) {
        animate(target,{opacity:.2,clipPath:'inset(0 35% 0 0)',transform:'scale(1.08)'},1900);
      } else if (target.matches('.lp-case')) {
        // Never transform a scroll-snap card: keep slide offsets stable.
        target.querySelectorAll('.lp-case__photo,.lp-case__info,.lp-case__price,.lp-case__spec,.lp-case__details').forEach((el,i) => animate(el,{opacity:0,transform:'translateY(22px)'},1000,i*100));
      } else {
        const distance = target.matches('.lp-point') ? 32 : target.matches('.lp-review,.lp-flow > li,.lp-reasons__list > li') ? 16 : 22;
        animate(target,{opacity:0,transform:`translateY(${distance}px)`},distance===16?650:900);
      }
    });
  },{threshold:.1,rootMargin:'-70px 0px -65px 0px'});
  document.querySelectorAll('#cases h2,.lp-case,#reasons h2,#reviews h2,.lp-reasons__list > li,.lp-review,.lp-point,.lp-flow > li,.lp-store-review__layout > div,#points h2,#flow h2,#line h2,#faq h2,.lp-line__photo,.lp-final__bg,.lp-final__title,.lp-points__close').forEach(el => observer.observe(el));
  function update() {
    frame = null;
    if(paused || document.hidden || !word.parentElement) return;
    const rect = word.parentElement.getBoundingClientRect();
    if(rect.bottom > 0 && rect.top < innerHeight) word.style.transform = `translateX(${Math.max(-100,Math.min(100,(rect.top-innerHeight/2)*.16))}px)`;
  }
  addEventListener('scroll', () => {if(!frame&&!paused) frame=requestAnimationFrame(update);},{passive:true});
})();
