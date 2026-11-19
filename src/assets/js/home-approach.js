(() => {
  const root = document.querySelector('.appraisal-section');
  if (!root || !window.IntersectionObserver) return;
  const story = root.querySelector('.appraisal-story');
  const visual = root.querySelector('.appraisal-visual');
  const steps = [...root.querySelectorAll('.appraisal-step')];
  const pictures = [...root.querySelectorAll('.appraisal-image')];
  const counter = root.querySelector('.appraisal-counter b');
  const label = root.querySelector('.appraisal-label');
  const progress = root.querySelector('.appraisal-progress span');
  const mobile = matchMedia('(max-width: 767px)');
  let current = 0;
  let requested = 0;
  let requestId = 0;
  let visible = false;
  let frame = 0;

  async function show(index) {
    if (requested === index) return;
    requested = index;
    const id = ++requestId;
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    const image = pictures[index].querySelector('img');
    image.loading = 'eager';
    try {
      if (image.decode) await image.decode();
    } catch {
      // Keep the last loaded photograph. All three explanations remain readable.
      if (id === requestId) requested = current;
      return;
    }
    if (id !== requestId) return;
    current = index;
    pictures.forEach((picture, i) => {
      picture.classList.toggle('is-active', i === index);
      picture.setAttribute('aria-hidden', String(i !== index));
    });
    counter.textContent = String(index + 1).padStart(2, '0');
    label.textContent = steps[index].dataset.appraisalLabel;
    progress.style.width = `${(index + 1) / steps.length * 100}%`;
  }

  function update() {
    frame = 0;
    const visualRect = visual.getBoundingClientRect();
    document.body.classList.toggle('appraisal-reading', mobile.matches && visible && visualRect.top <= 24 && visualRect.bottom > 100);
    if (!visible) return;
    const boundary = mobile.matches ? visualRect.bottom + 88 : innerHeight * .56;
    let next = 0;
    steps.forEach((step, i) => { if (step.getBoundingClientRect().top <= boundary) next = i; });
    show(next);
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }

  root.classList.add('appraisal-ready');
  // Photographs are fetched near this section, not ahead of the homepage hero.
  const preload = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    pictures.forEach(picture => { picture.querySelector('img').loading = 'eager'; });
    preload.disconnect();
  }, {rootMargin: '600px'});
  preload.observe(story);
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    schedule();
  }).observe(story);
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule, {passive: true});
  addEventListener('load', schedule, {once: true});
  if (document.fonts) document.fonts.ready.then(schedule);
})();
