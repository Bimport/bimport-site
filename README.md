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

`dist/` フォルダに、公開される HTML 一式が生成されます（`dist/` は Git 管理外）。
`src/` は編集用のソースです。

## 公開（デプロイ）

`main` ブランチに push（PR をマージ）すると、GitHub Actions「Deploy B import LP」（`.github/workflows/deploy.yml`）が
`npm run build` を実行し、`dist/` を GitHub Pages（https://bimport.jp/）へ自動でデプロイします。手作業でのアップロードは不要です。

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
│   ├── assets/                ← CSS・JS・画像（車種別LP用など）
│   ├── index.njk              ← TOPページ（売却相談LP）
│   └── privacy.njk            ← プライバシーポリシー（permalinkで privacy.html として出力）
├── dist/                      ← ビルド結果（Git管理外。GitHub Actions が同じものを作って公開する）
├── scripts/
│   ├── dev-render.js          ← 初期の移行時に使った簡易レンダラー（記録用。ビルドには使わない）
│   └── one-time-migration.py  ← 元のindex.html/privacy.htmlから今回の構成へ機械的に変換した際の記録用スクリプト（再実行不要）
├── .eleventy.js               ← Eleventyのビルド設定
└── package.json
```

## 注記

- ビルド・確認には必ず本物の Eleventy（`npm run build` / `npm run build:preview`）を使います。`scripts/` のファイルは初期移行時の記録で、ビルドには使いません。
- クラウドの作業環境は、ネットワーク設定によって公開サイト（bimport.jp）に接続できないことがあります。その場合の確認方法は [docs/vehicle-lp-workflow.md](docs/vehicle-lp-workflow.md) の「公開手順」を参照してください。

## 車種別買取LP（/defender/ など）

車種別の買取LPは、共通テンプレート（`src/_includes/vehicle-lp/`）と車種データ（`src/_data/vehicles/<slug>.json`）から自動生成されます。
- 制作・確認・公開の進め方（運用ルール）… [docs/vehicle-lp-workflow.md](docs/vehicle-lp-workflow.md)
- テンプレートと車種データの技術仕様 … [docs/vehicle-lp.md](docs/vehicle-lp.md)

- `npm run build` … 本番用ビルド（`draft: true` の車種は出力しない）
- `npm run build:preview` … 下書きの車種も含めた確認用ビルド
