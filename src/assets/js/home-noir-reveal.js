(() => {
 const root = document.querySelector('.appraisal-reveal');
 if (!root) return;
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 let frame = 0;
 const active = () => document.body.classList.contains('motion-enabled') && !document.body.classList.contains('motion-paused') && !reduced.matches;
 function update() {
  frame = 0;
  if (!active()) { root.style.setProperty('--reveal-progress', '1'); return; }
  const rect = root.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
  root.style.setProperty('--reveal-progress', progress.toFixed(4));
 }
 function schedule() { if (!frame) frame = requestAnimationFrame(update); }
 root.classList.add('is-enhanced');
 new MutationObserver(schedule).observe(document.body, {attributes:true,attributeFilter:['class']});
 addEventListener('scroll', schedule, {passive:true});
 addEventListener('resize', schedule, {passive:true});
 addEventListener('load', schedule, {once:true});
 reduced.addEventListener('change', schedule);
 update();
})();
