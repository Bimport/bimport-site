(() => {
  const root = document.querySelector('.journey-carousel');
  if (!root || !window.IntersectionObserver) return;
  const slides = [...root.querySelectorAll('.journey-slide')];
  const buttons = [...root.querySelectorAll('[data-journey-slide]')];
  const pause = root.querySelector('.journey-pause');
  const status = root.querySelector('.journey-status');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let userPaused = false;
  let visible = false;
  let timer;
  let request = 0;
  const blocked = () => reduced.matches || document.body.classList.contains('motion-paused');
  const canPlay = () => visible && !userPaused && !blocked() && !document.hidden;

  function sync() {
    clearTimeout(timer);
    const playing = canPlay();
    root.classList.remove('journey-is-playing');
    root.classList.toggle('journey-is-paused', !playing);
    // A fresh five-second interval follows every resumed or manually selected scene.
    if (playing) {
      void root.offsetWidth;
      root.classList.add('journey-is-playing');
      timer = setTimeout(() => show((current + 1) % slides.length, true), 5000);
    }
    pause.hidden = blocked();
    pause.setAttribute('aria-pressed', String(userPaused));
    pause.setAttribute('aria-label', `車の写真の自動切り替えを${userPaused ? '再生' : '停止'}`);
    pause.querySelector('span').textContent = userPaused ? '▶' : 'Ⅱ';
  }

  async function show(index, automatic = false) {
    const id = ++request;
    const image = slides[index].querySelector('img');
    image.loading = 'eager';
    try {
      if (image.decode) await image.decode();
    } catch {
      // Keep the current photograph on screen if the next asset fails to load.
      if (id === request && automatic) sync();
      return;
    }
    if (id !== request || (automatic && !canPlay())) return;
    current = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.setAttribute('aria-hidden', String(i !== current));
    });
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
    if (!automatic) status.textContent = slides[current].getAttribute('aria-label');
    sync();
  }

  buttons.forEach((button, index) => button.addEventListener('click', () => {
    userPaused = true;
    sync();
    show(index);
  }));
  pause.addEventListener('click', () => { userPaused = !userPaused; sync(); });
  root.addEventListener('focusin', event => {
    if (event.target.matches(':focus-visible')) { userPaused = true; sync(); }
  });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  let globalPaused = blocked();
  new MutationObserver(() => {
    const next = blocked();
    if (next !== globalPaused) { globalPaused = next; sync(); }
  }).observe(document.body, {attributes:true, attributeFilter:['class']});

  // Fetch the remaining images only as the gallery approaches the viewport.
  const preload = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    slides.forEach(slide => { slide.querySelector('img').loading = 'eager'; });
    preload.disconnect();
  }, {rootMargin:'500px'});
  preload.observe(root);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, {threshold:.2}).observe(root);
  root.querySelector('.journey-select').hidden = false;
  sync();
})();
