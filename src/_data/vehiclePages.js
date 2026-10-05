/*
 * 車種別買取LPの一覧（src/vehicle-lp.njk がこの配列から1車種1ページを生成する）
 *
 * - 車種データは src/_data/vehicles/<slug>.json に1ファイルずつ置く
 * - "draft": true の車種は通常のビルド（本番デプロイ）では出力しない。
 *   確認したいときだけ `LP_PREVIEW=1 npm run build`（または `npm run build:preview`）で出力する
 * - 必須項目が欠けている場合は、ビルドをエラーで止めて分かるようにする
 */
const fs = require("fs");
const path = require("path");

const VEHICLE_DIR = path.join(__dirname, "vehicles");
const REQUIRED = ["slug", "maker", "makerJa", "model", "nameJa", "seo.title", "seo.description", "form.gradeFallback", "form.yearFrom"];
const RESERVED_SLUGS = ["assets", "privacy.html", "index.html"];

function get(obj, keyPath) {
  return keyPath.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

module.exports = function () {
  const preview = process.env.LP_PREVIEW === "1";
  const files = fs.readdirSync(VEHICLE_DIR).filter((f) => f.endsWith(".json")).sort();
  const slugs = new Set();

  return files
    .map((file) => {
      const v = JSON.parse(fs.readFileSync(path.join(VEHICLE_DIR, file), "utf8"));
      const missing = REQUIRED.filter((k) => get(v, k) === undefined || get(v, k) === "");
      if (missing.length) {
        throw new Error(`[vehiclePages] ${file}: 必須項目がありません → ${missing.join(", ")}`);
      }
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(v.slug) || RESERVED_SLUGS.includes(v.slug)) {
        throw new Error(`[vehiclePages] ${file}: slug "${v.slug}" は使えません（半角小文字・数字・ハイフンのみ）`);
      }
      if (slugs.has(v.slug)) throw new Error(`[vehiclePages] slug "${v.slug}" が重複しています`);
      slugs.add(v.slug);
      return v;
    })
    .filter((v) => preview || !v.draft);
};
