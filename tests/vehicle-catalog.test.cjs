const { test } = require("node:test");
const assert = require("node:assert/strict");
const { createCatalog, jsonScript } = require("../lib/vehicle-catalog.cjs");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");
const site = { siteUrl: "https://bimport.jp", catalogEnabled: false };
const vehicle = (slug, maker = "BMW", makerJa = "BMW", nameJa = "BMW X1") => ({ slug, maker, makerJa, nameJa, model: slug, draft: false });

test("disabled default keeps the existing output independent from catalogue validation", () => {
  assert.deepEqual(createCatalog([], site), { enabled: false, published: false, preview: false, total: 0, groups: [], structuredData: "" });
});
test("local review is noindex-only, while approval flag makes a distinct published state", () => {
  const a = createCatalog([vehicle("bmw-x1")], site, true), b = createCatalog([vehicle("bmw-x1")], { ...site, catalogEnabled: true });
  assert.equal(a.preview, true); assert.equal(a.published, false); assert.equal(b.preview, false); assert.equal(b.published, true);
});
test("catalogue derives public links only and never copies source price/case/photo/customer fields", () => {
  const data = [Object.assign(vehicle("bmw-x1"), { cases: [{ price: 99999999, customer: "SYNTHETIC_PRIVATE" }], images: { src: "SYNTHETIC_IMAGE" }, form: { testToken: "SYNTHETIC_TOKEN" } }), { ...vehicle("secret-draft"), draft: true }];
  const result = createCatalog(data, site, true), text = JSON.stringify(result);
  assert.equal(result.total, 1); assert.ok(!/99999999|SYNTHETIC|secret-draft|testToken/.test(text));
  assert.equal(data[0].cases[0].price, 99999999);
});
test("all public routes stay distinct even when display names repeat", () => {
  const result = createCatalog([vehicle("bmw-x1"), vehicle("bmw-x1-special")], site, true);
  assert.equal(result.total, 2); assert.deepEqual(result.groups[0].items.map(v => v.slug), ["bmw-x1", "bmw-x1-special"]);
});
test("source list and group order are deterministic without mutating input", () => {
  const source = [vehicle("x-10", "X", "メーカーX", "X 10"), vehicle("x-2", "X", "メーカーX", "X 2"), vehicle("a", "A", "メーカーA", "A")];
  const before = JSON.stringify(source), result = createCatalog(source, site, true);
  assert.equal(JSON.stringify(source), before); assert.deepEqual(result, createCatalog([...source].reverse(), site, true));
  assert.deepEqual(result.groups[1].items.map(v => v.name), ["X 2", "X 10"]);
});
test("CITROEN spelling and Mercedes-AMG display follow existing form aliases", () => {
  const result = createCatalog([vehicle("c-one", "CITROEN", "シトロエン", "シトロエン C1"), vehicle("c-two", "CITROËN", "シトロエン", "シトロエン C2"), vehicle("amg", "MERCEDES-AMG", "メルセデス・ベンツ", "AMG")], site, true);
  assert.equal(result.groups.length, 2); assert.equal(result.groups.find(g => g.maker === "CITROEN").items.length, 2);
  assert.equal(result.groups.find(g => g.maker === "MERCEDES-AMG").label, "メルセデスAMG");
});
for (const slug of ["../admin", "cars", "assets", "admin", "api", "UPPER", "a?phone=SYNTHETIC", "a/b", "a--b"]) test(`reject invalid or reserved route ${slug}`, () => {
  assert.throws(() => createCatalog([vehicle(slug)], site, true));
});
test("reject duplicate slugs and an unconfirmed destination, without reading draft-only values", () => {
  assert.throws(() => createCatalog([vehicle("bmw-x1"), vehicle("bmw-x1")], site, true));
  assert.throws(() => createCatalog([vehicle("bmw-x1")], { ...site, siteUrl: "https://unowned.invalid" }, true));
  assert.equal(createCatalog([{ draft: true, slug: "invalid" }, vehicle("bmw-x1")], site, true).total, 1);
});
test("structured data matches visible source order and does not invent offers, ratings, addresses or opening hours", () => {
  const result = createCatalog([vehicle("bmw-x1"), vehicle("bmw-x2", "BMW", "BMW", "BMW X2")], site, true);
  const data = JSON.parse(result.structuredData), page = data["@graph"][0], crumbs = data["@graph"][1];
  assert.equal(page["@type"], "CollectionPage"); assert.equal(page.mainEntity.numberOfItems, result.total);
  assert.deepEqual(page.mainEntity.itemListElement.map(v => v.url), result.groups.flatMap(g => g.items).map(v => `https://bimport.jp/${v.slug}/`));
  assert.deepEqual(page.mainEntity.itemListElement.map(v => v.position), [1, 2]);
  assert.equal(crumbs.itemListElement[1].item, "https://bimport.jp/cars/");
  assert.ok(!/Offer|Product|AggregateRating|openingHours|address|telephone/.test(result.structuredData));
});
test("script serialization escapes closing-script payloads and JS line separators", () => {
  const value = { label: "</script><script>throw 1</script>&\u2028\u2029" }, text = jsonScript(value);
  assert.ok(!text.includes("<") && !text.includes("&") && !text.includes("\u2028")); assert.deepEqual(JSON.parse(text), value);
});

const script = fs.readFileSync(path.join(__dirname, "../src/assets/js/vehicle-catalog.js"), "utf8");
function dom() {
  const d = new JSDOM(`<div class="catalog-search" role="search" hidden><input id="catalog-query"><select id="catalog-maker"><option value="">all</option><option value="maker-1">BMW</option><option value="maker-2">Citroen</option></select><button id="catalog-reset" type="button">clear</button></div><p id="catalog-count">公開中の3ページ</p><div id="catalog-empty" hidden>not found</div><details class="catalog-group" data-maker="maker-1" open><summary>BMW <span class="catalog-group-count">2車種</span></summary><ul><li data-catalog-row data-search="BMW BMW X1"><a href="../bmw-x1/">BMW X1</a></li><li data-catalog-row data-search="BMW BMW X2"><a href="../bmw-x2/">BMW X2</a></li></ul></details><details class="catalog-group" data-maker="maker-2"><summary>シトロエン <span class="catalog-group-count">1車種</span></summary><ul><li data-catalog-row data-search="CITROËN シトロエン C3"><a href="../citroen-c3/">シトロエン C3</a></li></ul></details>`, { url: "https://bimport.jp/cars/", runScripts: "outside-only" });
  const w = d.window; let requests = 0, analytics = 0, storage = 0;
  w.fetch = () => { requests++; throw Error("No external requests allowed"); }; w.BimportAnalytics = { track: () => analytics++ };
  Object.defineProperty(w, "localStorage", { get() { storage++; throw Error("No persistent query"); } });
  Object.defineProperty(w, "sessionStorage", { get() { storage++; throw Error("No persistent query"); } });
  w.eval(script);
  const query = w.document.querySelector("#catalog-query"), maker = w.document.querySelector("#catalog-maker"), groups = [...w.document.querySelectorAll(".catalog-group")];
  return { w, query, maker, groups, run(text, key = "") { query.value = text; maker.value = key; query.dispatchEvent(new w.Event("input")); }, visible() { return [...w.document.querySelectorAll("[data-catalog-row]")].filter(r => !r.hidden).map(r => r.textContent); }, state: () => ({ requests, analytics, storage }) };
}
test("without running JavaScript, every car remains a native accessible link", () => {
  const d = new JSDOM('<details open><summary>BMW</summary><a href="../bmw-x1/">BMW X1</a></details>');
  assert.equal(d.window.document.querySelector("a").getAttribute("href"), "../bmw-x1/"); d.window.close();
});
test("query and manufacturer filter handle fullwidth/space/diacritic variants without inventing matches", () => {
  const d = dom(); try {
    assert.equal(d.w.document.querySelector(".catalog-search").hidden, false);
    d.run("ｂｍｗ　Ｘ１"); assert.deepEqual(d.visible(), ["BMW X1"]);
    d.run("citroen"); assert.deepEqual(d.visible(), ["シトロエン C3"]); assert.equal(d.groups[1].open, true);
    d.run("", "maker-1"); assert.deepEqual(d.visible(), ["BMW X1", "BMW X2"]);
    d.run("X1", "maker-2"); assert.deepEqual(d.visible(), []); assert.equal(d.w.document.querySelector("#catalog-empty").hidden, false);
  } finally { d.w.close(); }
});
test("clearing restores pre-filter native disclosure state, all links and keyboard focus", () => {
  const d = dom(); try {
    d.run("C3"); assert.equal(d.groups[1].open, true);
    d.w.document.querySelector("#catalog-reset").click();
    assert.equal(d.visible().length, 3); assert.equal(d.groups[0].open, true); assert.equal(d.groups[1].open, false);
    assert.equal(d.w.document.activeElement, d.query); assert.equal(d.w.document.querySelector("#catalog-count").textContent, "公開中の3ページ");
  } finally { d.w.close(); }
});
test("typed private strings never enter URL/storage/analytics/HTML, and no match preserves consultation choices", () => {
  const d = dom(); try {
    d.run('<img src=x onerror="SYNTHETIC_PRIVATE">');
    assert.equal(d.visible().length, 0); assert.equal(d.w.document.querySelectorAll("img").length, 0);
    assert.equal(d.w.location.href, "https://bimport.jp/cars/"); assert.deepEqual(d.state(), { requests: 0, analytics: 0, storage: 0 });
  } finally { d.w.close(); }
});
test("a missing script prerequisite leaves existing links usable", () => {
  const d = new JSDOM('<a href="../bmw-x1/">BMW X1</a>', { runScripts: "outside-only" });
  assert.doesNotThrow(() => d.window.eval(script)); assert.equal(d.window.document.querySelectorAll("a").length, 1); d.window.close();
});
