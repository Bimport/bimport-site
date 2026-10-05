/*
 * 車種別LP 共通UI（ヘッダーメニュー・スマホ固定CTA）
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
})();
