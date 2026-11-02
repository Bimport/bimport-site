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
    const cards = drafts.map((v) => `<article>
      <a class="card" href="/${escape(v.slug)}/">
        <img src="/${escape(v.images.hero.src)}" alt="${escape(v.nameJa)}" loading="lazy">
        <h2>${escape(v.nameJa)}</h2><p>LP全体を見る →</p>
      </a>
      ${v.cases.length ? `<a class="cases" href="/${escape(v.slug)}/#cases">買取実績を見る（${v.cases.length}台）</a>` : '<p class="cases">買取実績は地域の確認待ちです</p>'}
    </article>`).join("");
    return `<!doctype html><html lang="ja"><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="robots" content="noindex,nofollow"><title>LP下書き確認 | Bimport</title>
      <style>body{background:#101318;color:#f4f4f4;font-family:system-ui;margin:0;padding:28px}main{max-width:1100px;margin:auto}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px}.card{display:block;background:#202630;color:inherit;text-decoration:none;border-radius:12px;overflow:hidden}.card img{display:block;width:100%;aspect-ratio:3/2;object-fit:contain}.card h2,.card p{margin:16px}.card h2{font-size:20px}.cases{display:block;padding:14px 4px;color:#cfdfef}.intro{line-height:1.8;margin-bottom:32px}h1{font-size:26px}a:focus-visible{outline:3px solid #cde1ff;outline-offset:4px}</style></head>
      <body><main><h1>Bimport LP下書き確認</h1><p class="intro">${drafts.length}車種・${drafts.reduce((sum,v) => sum + v.cases.length, 0)}台の買取実績<br>すべて未公開の下書きです。画像を押すとLP全体、下のリンクで買取実績が開きます。</p><div class="grid">${cards}</div></main></body></html>`;
  }
};
