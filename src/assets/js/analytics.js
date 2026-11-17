/* GA4: published pages only. Never send form values or arbitrary URL parameters. */
(function () {
  "use strict";
  var script = document.currentScript;
  var id = script && script.getAttribute("data-ga4-id");
  var optOutKey = "bimport_analytics_opt_out";
  var query = new URLSearchParams(location.search);
  var optOut = query.get("analytics") === "off";
  var storageAvailable = true;
  try {
    if (query.get("analytics") === "off") localStorage.setItem(optOutKey, "1");
    if (query.get("analytics") === "on") localStorage.removeItem(optOutKey);
    optOut = localStorage.getItem(optOutKey) === "1";
  } catch (_) { storageAvailable = false; }

  var status = document.getElementById("analytics-status");
  if (status) status.textContent = optOut
    ? (storageAvailable ? "このブラウザからのアクセスは計測対象から除外されています。" : "今回は計測対象から除外されています。ブラウザに設定を保存できませんでした。")
    : "このブラウザではアクセス解析が有効です。";

  window.BimportAnalytics = { track: function () {} };
  if (!/^G-[A-Z0-9]+$/.test(id || "") || id === "G-XXXXXXXXXX") return;
  if (optOut) window["ga-disable-" + id] = true;
  if (window["ga-disable-" + id] === true || location.protocol !== "https:" || !/^(www\.)?bimport\.jp$/.test(location.hostname)
      || script.getAttribute("data-draft") === "true") return;

  var canonical = document.querySelector('link[rel="canonical"]');
  var pageUrl = canonical ? canonical.href : location.origin + location.pathname;
  var cleanUrl = new URL(pageUrl);
  cleanUrl.search = "";
  cleanUrl.hash = "";
  var pageType = script.getAttribute("data-page-type") || "other";
  var slug = script.getAttribute("data-vehicle-slug") || (pageType === "home" ? "home" : "other");
  var debug = query.get("analytics_debug") === "1";
  var referrer = "";
  try {
    var ref = new URL(document.referrer);
    // The external domain is enough for organic/referral attribution; omit search queries.
    referrer = ref.origin + (/^(www\.)?bimport\.jp$/.test(ref.hostname) ? ref.pathname : "/");
  } catch (_) {}

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied"
  });
  window.gtag("js", new Date());
  var config = {
    page_location: cleanUrl.href,
    page_referrer: referrer,
    page_type: pageType,
    vehicle_slug: slug,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  };
  if (debug) config.debug_mode = true;
  window.gtag("config", id, config); // Exactly one automatic page_view per document.

  var once = {};
  var allowedEvents = ["estimate_start", "estimate_step", "generate_lead", "estimate_error", "cta_click"];
  window.BimportAnalytics.track = function (name, params) {
    // Analytics must never interrupt form delivery or its success UI.
    try {
      if (allowedEvents.indexOf(name) === -1) return;
      params = params || {};
      var data = { page_type: pageType, vehicle_slug: slug, form_id: "estimate-form" };
      if (name === "estimate_step") {
        var step = Number(params.estimate_step);
        if ([1, 2, 3].indexOf(step) === -1) return;
        data.estimate_step = step;
      }
      if (name === "cta_click") {
        if (["estimate", "line", "tel"].indexOf(params.cta_type) === -1) return;
        data.cta_type = params.cta_type;
        data.cta_location = /^[a-z-]{1,40}$/.test(params.cta_location || "") ? params.cta_location : "content";
      }
      var key = name + (data.estimate_step || "");
      if (["estimate_start", "estimate_step", "generate_lead"].indexOf(name) !== -1) {
        if (once[key]) return;
        once[key] = true;
      }
      if (debug && name === "generate_lead") name = "estimate_test_complete";
      window.gtag("event", name, data);
    } catch (_) {}
  };

  var form = document.getElementById("estimate-form");
  if (form) {
    var start = function (event) {
      var target = event.target;
      if (!target || !target.name || target.name === "website" || target.type === "hidden") return;
      window.BimportAnalytics.track("estimate_start");
    };
    form.addEventListener("input", start);
    form.addEventListener("change", start);
  }
  document.addEventListener("click", function (event) {
    var target = event.target.closest && event.target.closest("a[data-cta]");
    if (!target) return;
    window.BimportAnalytics.track("cta_click", {
      cta_type: target.getAttribute("data-cta-type") || "estimate",
      cta_location: target.getAttribute("data-cta")
    });
  });
  var tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(tag);
})();
