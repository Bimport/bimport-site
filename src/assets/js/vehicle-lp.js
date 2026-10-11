/*
 * 車種別LP 共通UI（ヘッダーメニュー・スマホ固定CTA・買取実績のスライド）
 */
(function () {
  "use strict";

  /* ---------- ヘッダーメニュー（スマホ） ---------- */
  var menuBtn = document.querySelector(".lp-menu-btn");
  var nav = document.getElementById("lp-nav");
  var header = document.getElementById("lp-header");

  function setMenu(open) {
    header.classList.toggle("is-menu-open", open);
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  }
  if (menuBtn && nav && header) {
    menuBtn.addEventListener("click", function () {
      setMenu(!header.classList.contains("is-menu-open"));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMenu(false);
    });
  }

  /* ---------- スマホ固定CTA：ファーストビューとフォームが見えている間は隠す ---------- */
  var sticky = document.getElementById("lp-sticky");
  var hero = document.querySelector(".lp-hero");
  var formCard = document.getElementById("estimate-app");
  if (sticky && hero && formCard && "IntersectionObserver" in window) {
    var heroVisible = true;
    var formVisible = false;
    var update = function () {
      var show = !heroVisible && !formVisible;
      sticky.classList.toggle("is-visible", show);
      sticky.setAttribute("aria-hidden", show ? "false" : "true");
      sticky.querySelectorAll("a").forEach(function (a) { a.tabIndex = show ? 0 : -1; });
    };
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting; update();
    }, { rootMargin: "0px 0px -40% 0px" }).observe(hero);
    new IntersectionObserver(function (entries) {
      formVisible = entries[0].isIntersecting; update();
    }, { rootMargin: "-15% 0px -15% 0px" }).observe(formCard);
  }
  /* ---------- 買取実績（2件以上）：横スライドのドット・前後ボタン ---------- */
  document.querySelectorAll("[data-cases-slider]").forEach(function (track) {
    var section = track.parentNode;
    var cards = track.querySelectorAll(".lp-case");
    var dots = section.querySelectorAll(".lp-cases__dots span");
    var prev = section.querySelector("[data-cases-prev]");
    var next = section.querySelector("[data-cases-next]");
    var current = 0;
    var go = function (i) {
      i = Math.max(0, Math.min(cards.length - 1, i));
      track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
    };
    var sync = function () {
      var x = track.scrollLeft, best = 0, bestD = Infinity;
      cards.forEach(function (c, i) {
        var d = Math.abs(c.offsetLeft - cards[0].offsetLeft - x);
        if (d < bestD) { bestD = d; best = i; }
      });
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 2) best = cards.length - 1;
      current = best;
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === best); });
      if (prev) prev.disabled = best === 0;
      if (next) next.disabled = best === cards.length - 1;
    };
    track.addEventListener("scroll", function () { window.requestAnimationFrame(sync); }, { passive: true });
    if (prev) prev.addEventListener("click", function () { go(current - 1); });
    if (next) next.addEventListener("click", function () { go(current + 1); });
    sync();
  });
})();
