// 下書き確認用。通常の本番ビルドではページを生成しない。
module.exports = class {
  data() {
    return {
      permalink: process.env.LP_PREVIEW === "1" ? "draft-review/index.html" : false,
      eleventyExcludeFromCollections: true,
    };
  }

  render({ vehiclePages }) {
    const escape = (value) => String(value).replace(/[&<>"']/g, (s) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[s]);
    const drafts = vehiclePages.filter((v) => v.draft);
    const card = (v) => `<article>
      <a class="card" href="/${escape(v.slug)}/">
        ${v.images?.hero?.src ? `<img src="/${escape(v.images.hero.src)}" alt="${escape(v.nameJa)}" loading="lazy">` : `<div class="no-photo"><span>${escape(v.maker)}</span><strong>${escape(v.model)}</strong></div>`}
        <h2>${escape(v.nameJa)}</h2><p>LP全体を見る →</p>
      </a>
      ${v.cases.length ? `<a class="cases" href="/${escape(v.slug)}/#cases">買取実績を見る（${v.cases.length}台）</a>` : `<a class="cases" href="/${escape(v.slug)}/#cases">${v.casesEmpty ? '買取実績未掲載版を確認する' : '買取実績は確認待ちです'}</a>`}
    </article>`;
    const makers = [...new Set(drafts.map(v => v.makerJa))];
    const cards = makers.map((maker, i) => `<section id="maker-${i}"><h2>${escape(maker)}（${drafts.filter(v => v.makerJa === maker).length}車種）</h2><div class="grid">${drafts.filter(v => v.makerJa === maker).map(card).join("")}</div></section>`).join("");
    const nav = makers.map((maker, i) => `<a href="#maker-${i}">${escape(maker)}</a>`).join(" ");
    return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="robots" content="noindex,nofollow"><title>LP下書き確認 | Bimport</title>
      <style>body{background:#101318;color:#f4f4f4;font-family:system-ui;margin:0;padding:28px}main{max-width:1100px;margin:auto}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}.card{display:block;background:#202630;color:inherit;text-decoration:none;border-radius:12px;overflow:hidden}.card img{display:block;width:100%;aspect-ratio:3/2;object-fit:contain}.card h2,.card p{margin:16px}.card h2{font-size:20px}.no-photo{aspect-ratio:3/2;padding:24px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(130deg,#24352e,#101713);color:#e1e8d2}.no-photo span{font-size:12px;letter-spacing:.3em}.no-photo strong{font-size:25px;overflow-wrap:anywhere}.cases{display:block;padding:14px 4px;color:#cfdfef}.makers{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:32px}.makers a{color:#dce5ef;border:1px solid #667587;padding:10px 16px;border-radius:6px;text-decoration:none}section{margin:40px 0}html{scroll-behavior:smooth}.intro{line-height:1.8;margin-bottom:32px}h1{font-size:26px}a:focus-visible{outline:3px solid #cde1ff;outline-offset:4px}</style></head>
      <body><main><h1>Bimport LP下書き確認</h1><p class="intro">${drafts.length}車種・掲載する買取実績${drafts.reduce((sum,v) => sum + v.cases.length, 0)}件<br>すべて未公開の下書きです。カードを押すとLP全体、下のリンクで実績の掲載状況が開きます。<br>実績未掲載版の画像はAI生成の車種イメージです。実績を追加すると未掲載の案内が実績カードに切り替わります。</p><nav class="makers">${nav}</nav>${cards}</main></body></html>`;
  }
};
