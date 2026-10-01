# B import 売却相談LP - 静的サイト（Eleventy）

現在の「B import 売却相談LP」（index.html / privacy.html）を、Eleventy によるテンプレート構成に移行したものです。
デザイン・文章・画像・リンク・CTA・スマホ表示は一切変更していません。

## 動作環境

- Node.js（推奨 v18 以上。このプロジェクトは v22 で作成・検証しました）
- npm レジストリ（registry.npmjs.org）にアクセスできること

## セットアップ（最初の1回だけ）

```bash
npm install
```

## ローカルで確認する

```bash
npm run serve
```

ブラウザで `http://localhost:8080/` が開きます（TOPページ）。プライバシーポリシーは `http://localhost:8080/privacy.html` です。
ファイルを保存すると自動でブラウザに反映されます。終了は `Ctrl + C`。

## 本番用ファイルを作る（ビルド）

```bash
npm run build
```

`dist/` フォルダに、本番にアップロードする最終的な HTML 一式が生成されます。
**本番サーバーにアップロードするのは `dist/` フォルダの中身だけです。** `src/` は編集用のソースで、サーバーには置きません。

## ファイル構成

```
bimport-site/
├── src/                      ← 編集する場所
│   ├── _includes/
│   │   ├── fonts.njk         ← Googleフォントの読み込みタグ（TOP・プライバシー共通）
│   │   ├── ga4.njk           ← GA4計測タグ（TOP・プライバシー共通）
│   │   └── topbar.njk        ← 上部の黒いバー「輸入車買取専門 ── Bimport／岡山」（共通）
│   ├── _data/
│   │   └── site.json         ← 電話番号・LINE URL・住所・古物商許可番号などの一括管理データ
│   ├── assets/                ← 今後、CSS/JS/画像を分離する場合の置き場所（現時点は空）
│   ├── index.njk              ← TOPページ（売却相談LP）
│   └── privacy.njk            ← プライバシーポリシー（permalinkで privacy.html として出力）
├── dist/                      ← ビルド結果。本番にアップロードするのはこのフォルダの中身だけ
├── scripts/
│   ├── dev-render.js          ← このサンドボックス内でのみ使った検証用の簡易レンダラー（下記「重要な注記」参照）
│   └── one-time-migration.py  ← 元のindex.html/privacy.htmlから今回の構成へ機械的に変換した際の記録用スクリプト（再実行不要）
├── .eleventy.js               ← Eleventyのビルド設定
└── package.json
```

## 重要な注記（このサンドボックス環境について）

このセッションが動いているサンドボックス環境は、セキュリティ上の理由で npm のパッケージレジストリ（registry.npmjs.org）に外部接続できないように制限されていました。
そのため、この環境の中では実際に `npm install` で本物の Eleventy をインストールして `npm run build` を実行することができませんでした。

代わりに、`scripts/dev-render.js` という、このプロジェクトのテンプレートで使っている機能（`{% include %}` と `{{ site.xxx }}` の2つだけ）を再現した、ごく小さい検証専用のスクリプトを作り、それで `dist/` を生成して、現在のLP（index.html・privacy.html）と1バイトも違わず一致することを確認しました。

`npm install` が使えるパソコンやサーバーで `npm run build` を実行すれば、本物の Eleventy が同じ2つの機能だけを使ってビルドするため、`dev-render.js` で確認したものと同じ出力になります。今後の本番ビルドでは `dev-render.js` ではなく、必ず `npm run build`（package.jsonの本来のビルドコマンド）を使ってください。
