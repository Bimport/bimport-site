(function () {
  "use strict";
  var tools = document.querySelector(".catalog-search"), query = document.getElementById("catalog-query"), maker = document.getElementById("catalog-maker"), reset = document.getElementById("catalog-reset"), count = document.getElementById("catalog-count"), empty = document.getElementById("catalog-empty");
  var groups = Array.from(document.querySelectorAll(".catalog-group"));
  if (!tools || !query || !maker || !reset || !count || !empty || !groups.length) return;
  function normalize(value) { return value.normalize("NFKC").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[\s\-_.・／/]/g, ""); }
  var source = groups.map(function (group) {
    return { element: group, key: group.getAttribute("data-maker"), count: group.querySelector(".catalog-group-count"), rows: Array.from(group.querySelectorAll("[data-catalog-row]")).map(function (row) { return { element: row, text: normalize(row.getAttribute("data-search") || "") }; }) };
  });
  var beforeFilter = null;
  function update() {
    var word = normalize(query.value), selected = maker.value, active = Boolean(word || selected), total = 0;
    if (active && beforeFilter === null) beforeFilter = groups.map(function (group) { return group.open; });
    source.forEach(function (group, index) {
      var matches = 0;
      group.rows.forEach(function (row) {
        var show = (!selected || selected === group.key) && (!word || row.text.indexOf(word) !== -1);
        row.element.hidden = !show; if (show) matches++;
      });
      group.element.hidden = matches === 0;
      group.count.textContent = matches + "車種";
      if (active && matches > 0) group.element.open = true;
      else if (!active && beforeFilter !== null) group.element.open = beforeFilter[index];
      total += matches;
    });
    if (!active) beforeFilter = null;
    count.textContent = active ? "条件に一致するページ：" + total + "件" : "公開中の" + total + "ページ";
    empty.hidden = total !== 0;
  }
  query.addEventListener("input", update); maker.addEventListener("change", update);
  reset.addEventListener("click", function () { query.value = ""; maker.value = ""; update(); query.focus(); });
  // Search text stays in this DOM only: no URL parameters, storage, analytics event or request.
  tools.hidden = false;
})();
