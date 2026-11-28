/*
 * 車種別LP 概算査定フォーム（3STEP）
 * 車種ごとの選択肢（ボディタイプ・グレード・年式範囲）は
 * ページ内の <script type="application/json" id="estimate-config"> から読み込む。
 * 送信先（config.endpoint：Google Apps Script のウェブアプリURL）へ入力内容を送り、
 * 受け付けられた（{"ok":true} が返った）場合だけ完了画面を表示する。
 * 送信先が未設定の場合は外部へは送信しない。
 */
(function () {
  "use strict";

  var configEl = document.getElementById("estimate-config");
  var form = document.getElementById("estimate-form");
  if (!configEl || !form) return;

  var config = JSON.parse(configEl.textContent);
  var unknown = config.unknownLabel || "わからない";
  var optionalDetails = form.getAttribute("data-details-optional") === "true";
  var contactFirst = optionalDetails && form.getAttribute("data-contact-first") === "true";
  var currentStep = 1;
  var pageShownAt = Date.now();
  var sending = false;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var scrollBehavior = reduceMotion ? "auto" : "smooth";

  var app = document.getElementById("estimate-app");
  var gradeSelect = document.getElementById("f-grade");
  // ボディタイプ欄は車種データに bodyTypes がある場合だけ表示される（見出しは車種ごとに変更可）
  var bodyTypeField = form.querySelector('[data-field="bodyType"]');
  var hasBodyType = !!bodyTypeField;
  var bodyTypeLabel = hasBodyType ? bodyTypeField.querySelector(".lp-label").firstChild.textContent.trim() : "";
  var stepNum = document.getElementById("estimate-step-num");
  var yearSelect = document.getElementById("f-year");
  var confirmBox = document.getElementById("estimate-confirm");
  var submitBtn = document.getElementById("estimate-submit");
  var doneBox = document.getElementById("estimate-done");
  var submitLabel = submitBtn.textContent;

  function track(name, params) {
    if (window.BimportAnalytics) window.BimportAnalytics.track(name, params);
  }

  /* ---------- 年式の選択肢（今年 → config.yearFrom） ---------- */
  function eraLabel(y) {
    if (y >= 2019) return "令和" + (y === 2019 ? "元" : y - 2018) + "年";
    if (y >= 1989) return "平成" + (y === 1989 ? "元" : y - 1988) + "年";
    return "";
  }
  function addOption(select, value, label) {
    var o = document.createElement("option");
    o.value = value;
    o.textContent = label || value;
    select.appendChild(o);
  }
  var thisYear = new Date().getFullYear();
  for (var y = thisYear; y >= config.yearFrom; y--) {
    addOption(yearSelect, y + "年（" + eraLabel(y) + "）");
  }
  if (config.yearOlderLabel) addOption(yearSelect, config.yearOlderLabel);
  addOption(yearSelect, unknown);

  /* ---------- ボディタイプに応じたグレード ---------- */
  function renderGrades(bodyKey) {
    var body = null;
    config.bodyTypes.forEach(function (b) { if (b.value === bodyKey) body = b; });
    var grades = body && body.grades ? body.grades.slice()
      : (!hasBodyType && config.grades ? config.grades.slice() : []);
    grades.push(config.gradeFallback);

    gradeSelect.innerHTML = "";
    gradeSelect.disabled = false;
    if (grades.length > 1) addOption(gradeSelect, "", "選択してください");
    grades.forEach(function (g) { addOption(gradeSelect, g); });
    // 「わからない」の場合はグレードも「その他・わからない」を選択済みにする
    gradeSelect.value = grades.length === 1 ? grades[0] : "";
    if (grades.length === 1) clearError(fieldEl("grade"));
  }

  if (!hasBodyType) renderGrades(null);

  // 選択式は change、テキスト入力は input のタイミングでエラー表示を消す
  // （テキストの change はボタン押下後に遅れて発火することがあり、直後のエラー表示を消してしまうため）
  function clearOnEdit(e) {
    var t = e.target;
    var isText = t.tagName === "INPUT" && t.type !== "radio";
    if ((e.type === "input") !== isText) return;
    var field = t.closest(".lp-field");
    if (field && field.classList.contains("is-invalid")) clearError(field);
  }
  form.addEventListener("input", clearOnEdit);
  form.addEventListener("change", function (e) {
    if (e.target.name === "bodyType") renderGrades(e.target.getAttribute("data-body"));
    clearOnEdit(e);
  });

  /* ---------- 入力チェック ---------- */
  function val(name) {
    var el = form.elements[name];
    if (!el) return "";
    if (typeof RadioNodeList !== "undefined" && el instanceof RadioNodeList) return el.value || "";
    if (el.type === "radio") return el.checked ? el.value : "";
    return (el.value || "").trim();
  }
  function fieldEl(name) { return form.querySelector('[data-field="' + name + '"]'); }
  function setError(name, msg) {
    var f = fieldEl(name);
    f.classList.add("is-invalid");
    f.querySelector(".lp-error").textContent = msg;
    if (contactFirst) {
      var error = f.querySelector(".lp-error");
      error.id = "estimate-error-" + name;
      f.querySelectorAll("input, select").forEach(function (control) {
        control.setAttribute("aria-invalid", "true");
        var descriptions = (control.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
        if (descriptions.indexOf(error.id) < 0) descriptions.push(error.id);
        control.setAttribute("aria-describedby", descriptions.join(" "));
      });
      var details = f.closest(".lp-optional-details");
      if (details) details.open = true;
    }
  }
  function clearError(f) {
    f.classList.remove("is-invalid");
    var err = f.querySelector(".lp-error");
    if (err) err.textContent = "";
    if (contactFirst) f.querySelectorAll("input, select").forEach(function (control) {
      control.removeAttribute("aria-invalid");
      if (err) {
        var descriptions = (control.getAttribute("aria-describedby") || "").split(/\s+/).filter(function (id) { return id && id !== err.id; });
        if (descriptions.length) control.setAttribute("aria-describedby", descriptions.join(" "));
        else control.removeAttribute("aria-describedby");
      }
    });
  }
  function normalizePhone(s) {
    return s.replace(/[０-９]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); })
            .replace(/[ー－‐―−\-\s()（）]/g, "");
  }

  // An explicit per-page pilot only: missing details remain unknown, never invented.
  function chooseUnknown(select, value) {
    if (!select || select.value || select.disabled) return;
    for (var i = 0; i < select.options.length; i++) {
      if (select.options[i].value === value) { select.value = value; return; }
    }
  }
  function fillMissingDetails() {
    if (!optionalDetails) return;
    if (hasBodyType && !val("bodyType")) {
      var radios = form.querySelectorAll('input[name="bodyType"]');
      for (var i = 0; i < radios.length; i++) {
        if (radios[i].getAttribute("data-body") === "unknown" && radios[i].value === unknown) {
          radios[i].checked = true;
          renderGrades("unknown");
          break;
        }
      }
    }
    chooseUnknown(gradeSelect, config.gradeFallback);
    chooseUnknown(yearSelect, unknown);
    chooseUnknown(form.elements.mileage, unknown);
  }

  function validate(step) {
    var errors = [];
    form.querySelectorAll('[data-step="' + step + '"] .lp-field').forEach(clearError);
    if (step === 2 || (contactFirst && step === 1)) {
      if (!val("name")) errors.push(["name", "お名前を入力してください（名字だけでも大丈夫です）"]);
      var phone = normalizePhone(val("phone"));
      if (!phone) errors.push(["phone", "電話番号を入力してください"]);
      else if (!/^0\d{9,10}$/.test(phone)) errors.push(["phone", "電話番号をご確認ください（例：090-1234-5678）"]);
    }
    if (step === 1 && (!contactFirst || errors.length === 0)) {
      fillMissingDetails();
      if (hasBodyType && !val("bodyType")) errors.push(["bodyType", bodyTypeLabel + "を選択してください"]);
      if (!val("grade")) errors.push(["grade", (!hasBodyType || val("bodyType")) ? "グレードを選択してください" : bodyTypeLabel + "を選択すると、グレードを選べます"]);
      if (!val("year")) errors.push(["year", "年式を選択してください（不明な場合は「わからない」）"]);
      if (!val("mileage")) errors.push(["mileage", "走行距離を選択してください"]);
    }
    errors.forEach(function (e) { setError(e[0], e[1]); });
    if (errors.length) {
      var first = fieldEl(errors[0][0]);
      first.scrollIntoView({ behavior: scrollBehavior, block: "center" });
      var focusable = first.querySelector("input, select");
      if (focusable) focusable.focus({ preventScroll: true });
    }
    return errors.length === 0;
  }

  /* ---------- STEP切り替え ---------- */
  function showStep(n) {
    if (contactFirst && n === 2) n = 1;
    currentStep = n;
    form.querySelectorAll(".lp-step").forEach(function (s) {
      s.hidden = Number(s.getAttribute("data-step")) !== n;
    });
    app.querySelectorAll("[data-step-indicator]").forEach(function (li) {
      var i = Number(li.getAttribute("data-step-indicator"));
      li.classList.toggle("is-current", i === n);
      li.classList.toggle("is-done", i < n);
      if (contactFirst) {
        if (i === n) li.setAttribute("aria-current", "step");
        else li.removeAttribute("aria-current");
      }
    });
    if (stepNum) stepNum.textContent = contactFirst && n === 3 ? 2 : n;
    if (n === 3) renderConfirm();
    app.scrollIntoView({ behavior: scrollBehavior, block: "start" });
    if (contactFirst) {
      var legend = form.querySelector('[data-step="' + n + '"] legend');
      if (legend) legend.focus({ preventScroll: true });
    }
    track("estimate_step", { estimate_step: n });
  }

  form.addEventListener("click", function (e) {
    var t = e.target;
    if (t.hasAttribute("data-next")) {
      if (currentStep === 1 && optionalDetails) track("estimate_start");
      if (validate(currentStep)) showStep(contactFirst && currentStep === 1 ? 3 : currentStep + 1);
    } else if (t.hasAttribute("data-prev")) {
      showStep(contactFirst && currentStep === 3 ? 1 : currentStep - 1);
    } else if (t.hasAttribute("data-goto")) {
      showStep(Number(t.getAttribute("data-goto")));
      if (contactFirst && t.getAttribute("data-edit-details") === "true") {
        var details = document.getElementById("optional-vehicle-details");
        if (details) {
          details.open = true;
          var first = details.querySelector("input, select:not([disabled])");
          if (first) first.focus({ preventScroll: true });
          details.scrollIntoView({ behavior: scrollBehavior, block: "center" });
        }
      }
    }
  });

  // Enterキーで意図せず送信されないようにする（STEP3以外）
  form.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.tagName === "INPUT" && currentStep !== 3) {
      e.preventDefault();
      var next = form.querySelector('[data-step="' + currentStep + '"] [data-next]');
      if (next) next.click();
    }
  });

  /* ---------- 確認画面 ---------- */
  function collect() {
    return {
      maker: config.maker,
      model: config.model,
      bodyType: hasBodyType ? val("bodyType") : "指定なし",
      // 通知メールの項目名（車種データの form.bodyTypeLabel。例：ボディタイプ／世代／型式）
      bodyTypeLabel: bodyTypeLabel || "ボディタイプ",
      grade: val("grade"),
      year: val("year"),
      mileage: val("mileage"),
      name: val("name"),
      phone: val("phone"),
      prefecture: val("prefecture")
    };
  }

  function renderConfirm() {
    var d = collect();
    var rows = [
      { group: "お車について", step: 1 },
      ["車種", d.maker + " " + d.model],
      hasBodyType ? [bodyTypeLabel, d.bodyType] : null,
      ["グレード", d.grade],
      ["年式", d.year],
      ["走行距離", d.mileage],
      { group: "お客様情報", step: 2 },
      ["お名前", d.name],
      ["電話番号", normalizePhone(d.phone)],
      ["都道府県", d.prefecture || "未選択"]
    ];
    if (contactFirst) rows = rows.slice(6).concat(rows.slice(0, 6));
    confirmBox.innerHTML = "";
    rows.filter(Boolean).forEach(function (r) {
      var row = document.createElement("div");
      if (r.group) {
        row.className = "lp-confirm__group";
        var title = document.createElement("span");
        title.textContent = contactFirst && r.step === 2 ? "ご連絡先" : r.group;
        var edit = document.createElement("button");
        edit.type = "button";
        edit.className = "lp-confirm__edit";
        edit.setAttribute("data-goto", contactFirst ? 1 : r.step);
        if (contactFirst && r.step === 1) edit.setAttribute("data-edit-details", "true");
        if (contactFirst) edit.setAttribute("aria-label", r.step === 1 ? "車両情報を修正" : "ご連絡先を修正");
        edit.textContent = "修正する";
        row.appendChild(title);
        row.appendChild(edit);
      } else {
        var dt = document.createElement("dt");
        var dd = document.createElement("dd");
        dt.textContent = r[0];
        dd.textContent = r[1];
        row.appendChild(dt);
        row.appendChild(dd);
      }
      confirmBox.appendChild(row);
    });
  }

  /* ---------- 送信 ---------- */
  function utmParams() {
    var out = {};
    var q = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach(function (k) {
      if (q.get(k)) out[k] = q.get(k);
    });
    return out;
  }

  // Content-Type を text/plain にして、Apps Script が対応していない事前確認（CORSプリフライト）を起こさない
  function sendEstimate(payload) {
    if (!config.endpoint) return Promise.reject(new Error("missing intake destination"));
    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = controller ? setTimeout(function () { controller.abort(); }, 20000) : null;
    return fetch(config.endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (data) {
      if (!data || data.ok !== true) throw new Error((data && data.error) || "rejected");
      return data;
    }).finally(function () {
      if (timer) clearTimeout(timer);
    });
  }

  // Received GAS v3 silently drops elapsed<5s or >24h while returning ok:true.
  // Wait the real remaining time for every form; never fabricate elapsedMs or lower server limits.
  function prepareEstimate(payload) {
    return new Promise(function (resolve, reject) {
      var elapsed = Date.now() - pageShownAt;
      if (!isFinite(elapsed) || elapsed < 0 || elapsed > 24 * 60 * 60 * 1000) {
        reject(new Error("form clock outside accepted window")); return;
      }
      var remaining = Math.max(0, 5000 - elapsed);
      function deliver() {
        var actual = Date.now() - pageShownAt;
        if (!isFinite(actual) || actual < 5000 || actual > 24 * 60 * 60 * 1000) {
          reject(new Error("form clock outside accepted window")); return;
        }
        payload.elapsedMs = actual;
        payload.submittedAt = new Date().toISOString();
        submitBtn.textContent = "送信中…";
        sendEstimate(payload).then(resolve, reject);
      }
      if (remaining) {
        submitBtn.textContent = "送信準備中…";
        setTimeout(deliver, remaining);
      } else deliver();
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (currentStep !== 3 || sending) return; // 送信中の二重送信を防ぐ
    if (!validate(1)) {
      showStep(1);
      if (contactFirst) {
        var invalid = form.querySelector('[data-step="1"] .is-invalid input, [data-step="1"] .is-invalid select');
        if (invalid) invalid.focus({ preventScroll: true });
      }
      return;
    }
    if (!contactFirst && !validate(2)) { showStep(2); return; }

    var payload = collect();
    payload.phone = normalizePhone(payload.phone);
    payload.pageUrl = location.origin + location.pathname;
    payload.submittedAt = new Date().toISOString();
    payload.tracking = utmParams();
    payload.website = form.elements.website ? form.elements.website.value : "";
    payload.elapsedMs = Date.now() - pageShownAt;

    sending = true;
    var errBox = form.querySelector(".lp-error--submit");
    errBox.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "送信中…";

    prepareEstimate(payload).then(function (result) {
      form.hidden = true;
      app.querySelector(".lp-progress").hidden = true;
      app.querySelector(".lp-form-card__title").hidden = true;
      doneBox.hidden = false;
      doneBox.focus({ preventScroll: true });
      app.scrollIntoView({ behavior: scrollBehavior, block: "start" });
      if (config.endpoint && result && result.ok === true && result.test !== true && !payload.website) track("generate_lead");
    }).catch(function () {
      track("estimate_error");
      sending = false;
      submitBtn.disabled = false;
      submitBtn.textContent = submitLabel;
      errBox.textContent = "送信を確認できませんでした。入力内容は残っています。再送する前に、LINE・電話でご相談ください。";
      var fallback = document.getElementById("estimate-contact-fallback");
      if (contactFirst && fallback) fallback.hidden = false;
    });
  });
  // Keep native inputs inert until every setup step and the submit handler are ready.
  // A failed/absent script leaves the existing telephone/LINE alternatives available.
  form.querySelectorAll("fieldset[data-init-locked]").forEach(function (step) {
    step.disabled = false;
    step.removeAttribute("data-init-locked");
  });
  var initFallback = document.getElementById("estimate-init-fallback");
  if (initFallback) initFallback.hidden = true;
})();
