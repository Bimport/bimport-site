"use strict";

const collator = new Intl.Collator("ja", { numeric: true, sensitivity: "base" });
const plain = (v, label) => {
  if (typeof v !== "string" || !v.trim() || v.length > 200 || /[\u0000-\u001f\u007f]/.test(v)) throw new Error(`[vehicleCatalog] ${label} must be public plain text`);
  return v.trim();
};
function jsonScript(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

/** A derived catalogue of already-public LPs. It is neither a price list nor a new vehicle database. */
function createCatalog(vehicles, site, preview = false) {
  const published = site.catalogEnabled === true;
  if (!published && !preview) return { enabled: false, published: false, preview: false, total: 0, groups: [], structuredData: "" };
  if (!Array.isArray(vehicles) || !vehicles.length || vehicles.length > 5000) throw new Error("[vehicleCatalog] invalid source size");
  if (site.siteUrl !== "https://bimport.jp") throw new Error("[vehicleCatalog] confirm the destination origin before enabling");
  const seen = new Set(), groups = new Map();
  for (const v of vehicles) {
    if (v.draft) continue;
    const slug = plain(v.slug, "slug");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || ["cars", "assets", "api", "admin"].includes(slug) || seen.has(slug)) throw new Error("[vehicleCatalog] invalid, reserved or duplicate public route");
    seen.add(slug);
    const maker = plain(v.maker, "maker"), key = maker === "CITROËN" ? "CITROEN" : maker;
    const makerJa = maker === "MERCEDES-AMG" ? "メルセデスAMG" : plain(v.makerJa, "makerJa");
    const model = plain(v.model, "model"), name = plain(v.nameJa, "nameJa");
    const current = groups.get(key) || { maker: key, label: makerJa, items: [] };
    // Existing CITROEN/CITROËN spellings share the same group; all links and names remain distinct.
    current.items.push({ slug, name, model, search: `${makerJa} ${key} ${maker} ${name} ${model}` });
    groups.set(key, current);
  }
  const ordered = [...groups.values()].sort((a, b) => collator.compare(a.label, b.label) || collator.compare(a.maker, b.maker));
  ordered.forEach((group, index) => {
    group.id = `maker-${index + 1}`;
    group.items.sort((a, b) => collator.compare(a.name, b.name) || collator.compare(a.slug, b.slug));
  });
  const items = ordered.flatMap(g => g.items), url = `${site.siteUrl}/cars/`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [{ "@type": "CollectionPage", "@id": `${url}#webpage`, url, name: "車種から査定・売却を相談｜Bimport",
      description: "公開中の車種別ページから、査定ポイントと相談方法を確認できます。",
      inLanguage: "ja", breadcrumb: { "@id": `${url}#breadcrumb` },
      mainEntity: { "@type": "ItemList", numberOfItems: items.length,
        itemListElement: items.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.name, url: `${site.siteUrl}/${v.slug}/` })) } },
    { "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bimport", item: `${site.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "車種から相談", item: url },
    ] }],
  };
  return { enabled: true, published, preview: !published, total: items.length, groups: ordered, structuredData: jsonScript(structuredData) };
}
module.exports = { createCatalog, jsonScript };
