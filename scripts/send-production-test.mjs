#!/usr/bin/env node
/**
 * send-production-test.mjs
 * ------------------------------------------------------------------
 * 車種別買取LPの本番公開後に行う「公開確認テスト送信」を、GASへ1件だけ送る。
 *
 * - 送信内容は LP のフォーム（src/assets/js/estimate-form.js）と同じ形式。
 *   それに、公開確認テスト用のフラグ（testToken）を1つだけ足す。
 * - GAS（v3）はスクリプトプロパティ TEST_SUBMIT_TOKEN と一致した場合だけ「テスト送信」として扱い、
 *   通知先を TEST_NOTIFY_TO（個人のメールアドレス）に切り替え、件名の先頭に「【テスト送信】」を付ける。
 *   一致しなければ通常の依頼として NOTIFY_TO（お店の通知先）に届くので、GAS の設定が済んでから実行する。
 * - テストトークンはリポジトリ・公開HTML・URLに置かない。
 *   このMacのキーチェーン（サービス名 bimport-test-submit-token）か、
 *   環境変数 BIMPORT_TEST_TOKEN から読み込む。
 * - 二重送信を防ぐため、--send を付けたときだけ送信する。失敗しても自動で再送しない。
 *
 * 使い方：
 *   node scripts/send-production-test.mjs <slug>          … 送信内容の確認だけ（送信しない）
 *   node scripts/send-production-test.mjs <slug> --send   … 1件だけ送信する
 */
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [slug, flag] = process.argv.slice(2);
if (!slug) {
  console.error("使い方: node scripts/send-production-test.mjs <slug> [--send]");
  process.exit(1);
}

const site = JSON.parse(readFileSync(path.join(root, "src/_data/site.json"), "utf8"));
const v = JSON.parse(readFileSync(path.join(root, "src/_data/vehicles", `${slug}.json`), "utf8"));
if (v.draft) {
  console.error(`${slug} は draft: true です。公開後のテスト送信は draft: false の車種だけに行います。`);
  process.exit(1);
}

// 代表的な分類・グレード（最初の分類と、そのグレードの先頭）を使う
const bodyTypes = (v.form && v.form.bodyTypes) || [];
const body = bodyTypes.find((b) => b.grades && b.grades.length);
const grade = body ? body.grades[0] : (v.form.grades && v.form.grades[0]) || v.form.gradeFallback;

const payload = {
  maker: v.maker,
  model: v.model,
  bodyType: body ? body.label : "指定なし",
  bodyTypeLabel: (v.form && v.form.bodyTypeLabel) || "ボディタイプ",
  grade,
  year: "わからない",
  mileage: "わからない",
  name: `テスト送信（${v.nameJa}公開確認）`,
  phone: "09000000000",
  prefecture: "岡山県",
  pageUrl: `${site.siteUrl}/${slug}/`,
  submittedAt: new Date().toISOString(),
  tracking: { utm_source: "production_test" },
  website: "",
  // フォームを人が操作した場合と同じく、送信時間チェックを通る値にする
  elapsedMs: 30000
};

function readToken() {
  if (process.env.BIMPORT_TEST_TOKEN) return process.env.BIMPORT_TEST_TOKEN.trim();
  try {
    return execFileSync("security", ["find-generic-password", "-s", "bimport-test-submit-token", "-w"], { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

console.log("送信先:", site.estimateEndpoint ? "estimateEndpoint（site.json）" : "（未設定）");
console.log("送信内容（testToken は表示しません）:");
console.log(JSON.stringify(payload, null, 2));

if (flag !== "--send") {
  console.log("\n確認のみで終了しました。送信する場合は --send を付けて1回だけ実行してください。");
  process.exit(0);
}

const token = readToken();
if (!token) {
  console.error("テストトークンが見つかりません（キーチェーン bimport-test-submit-token または BIMPORT_TEST_TOKEN）。送信しません。");
  process.exit(1);
}
if (!site.estimateEndpoint) {
  console.error("site.json に estimateEndpoint がありません。送信しません。");
  process.exit(1);
}

const res = await fetch(site.estimateEndpoint, {
  method: "POST",
  headers: { "Content-Type": "text/plain;charset=utf-8" },
  body: JSON.stringify({ ...payload, testToken: token }),
  redirect: "follow"
});
const text = await res.text();
console.log(`\nHTTP ${res.status}`);
console.log("GASの応答:", text.slice(0, 200));
let result = null;
try { result = JSON.parse(text); } catch {}
if (result && result.ok === true && result.test === true) {
  console.log("テスト送信として受け付けられました（通知先：TEST_NOTIFY_TO、件名に【テスト送信】）。");
} else if (result && result.ok === true) {
  console.log("注意：通常の依頼として受け付けられました（テスト送信として認証されていません）。お店の通知先に届いた可能性があります。GAS の TEST_SUBMIT_TOKEN とキーチェーンの値を確認してください。");
} else {
  console.log("送信は受け付けられませんでした。");
}
console.log("※ 失敗しても自動で再送しません。");
