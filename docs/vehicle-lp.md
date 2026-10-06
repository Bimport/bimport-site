# 車種別買取LP 共通テンプレート

`https://bimport.jp/<slug>/` の車種別買取LP（例：`/defender/`）は、
**共通テンプレート ＋ 車種データ（JSON） ＋ 車種画像** から自動生成されます。
新しい車種を追加するときに、HTML／Nunjucks を書く必要はありません。

この文書は**技術仕様**（ファイル構成・車種データの項目・テンプレートの動き）です。
制作の進め方・確認項目・公開手順は [docs/vehicle-lp-workflow.md](vehicle-lp-workflow.md)（制作・公開運用ガイド）を参照してください。

## ファイル構成

```
src/
├── vehicle-lp.njk                    ← 車種データ1件につき1ページ（/<slug>/）を生成する入口
├── sitemap.njk                       ← sitemap.xml（トップ＋公開中の車種LPを自動掲載）
├── robots.njk                        ← robots.txt（サイトマップURL入り）
├── _data/
│   ├── site.json                     ← 共通設定（LINE URL・Google口コミURL・サイトURL・GAS送信先・店舗情報など）
│   ├── vehiclePages.js               ← 車種データの読み込み・必須項目チェック・下書き(draft)の除外
│   ├── vehicles/
│   │   ├── defender.json             ← 車種データ（1車種1ファイル。ファイル名は slug と同じにする）
│   │   └── porsche-911.json
│   ├── reviews.json                  ← Google口コミ3件（全車種共通）
│   └── estimateForm.json             ← フォーム共通の選択肢（走行距離・都道府県）
├── _includes/vehicle-lp/
│   ├── page.njk                      ← ページ全体（head・SEO・OGP・各セクションの読み込み）
│   ├── macros.njk                    ← アイコン・LINEマーク
│   └── sections/                     ← セクションごとの部品
│       ├── header.njk                    ヘッダー・スマホメニュー
│       ├── hero.njk                      ファーストビュー
│       ├── estimate-form.njk             3STEP概算査定フォーム（確認画面・完了画面・ハニーポット含む）
│       ├── reasons.njk                   Bimportが選ばれる理由（共通）
│       ├── reviews.njk                   お客様の声（共通・reviews.json）
│       ├── cases.njk                     買取実績（実績がない車種はセクションごと非表示）
│       ├── line.njk                      LINE写真査定
│       ├── points.njk                    車種の査定ポイント
│       ├── flow.njk                      買取の流れ（共通）
│       ├── faq.njk                       FAQ（共通5問 ＋ 車種固有FAQ）
│       ├── final.njk                     最終CTA
│       └── footer.njk                    フッター・スマホ固定CTA（共通）
└── assets/
    ├── css/vehicle-lp.css            ← 全車種共通のCSS（レスポンシブ含む）
    ├── css/themes/<theme>.css        ← 車種専用の配色・装飾（車種データの "theme" で読み込む。例：porsche.css）
    ├── js/estimate-form.js           ← フォーム（STEP切り替え・入力チェック・GAS送信・GA4イベント）
    ├── js/vehicle-lp.js              ← スマホメニュー・固定CTA
    └── images/<slug>/                ← 車種ごとの画像（新しい車種はこの形で置く）
docs/
├── vehicle-lp.md                     ← この説明書（技術仕様）
├── vehicle-lp-workflow.md            ← 制作・公開運用ガイド
└── vehicle-template.json             ← 車種データのひな形（ビルド対象外）
```

## 新しい車種LPを追加する手順

（技術的な最小手順です。コピー・SEO・写真・確認項目・公開手順のルールは [vehicle-lp-workflow.md](vehicle-lp-workflow.md) に従います）

1. **車種データを作る**
   `docs/vehicle-template.json` をコピーして `src/_data/vehicles/<slug>.json` を作ります（例：`porsche-911.json`）。
   最初は `"draft": true` のままにしておくと、本番には公開されません。
2. **画像を置く**
   `src/assets/images/<slug>/` に画像を置き、車種データの `images` にパスを書きます。
   画像がなくてもページは崩れません（下の「画像がない場合」を参照）。
3. **買取実績を入れる（ある場合のみ）**
   実在する実績だけを `cases` に入れます。架空の実績は入れません。空なら買取実績セクションは表示されません。
4. **確認用にビルドする**
   `npm run build:preview` で、下書きを含めてビルドします（`dist/<slug>/index.html`）。
   `npm run serve` で表示確認する場合は `LP_PREVIEW=1 npm run serve` とします。
5. **公開する**
   確認できたら `"draft": false` にして、main にマージします（GitHub Actions が自動でデプロイ）。

通常の `npm run build`（本番デプロイ）では、`draft: true` の車種は出力されません。

## 車種データの項目

| 項目 | 必須 | 内容 |
|---|---|---|
| `slug` | ○ | URL（`/<slug>/`）。半角小文字・数字・ハイフンのみ |
| `draft` | | `true` の間は本番に出力しない |
| `maker` | ○ | 英字メーカー名（ファーストビュー・フォーム・通知メールに使用） |
| `makerJa` | ○ | 日本語メーカー名 |
| `model` | ○ | 英字車種名（ファーストビュー・見出し・フォーム・通知メールに使用）。11文字以上は自動で一段小さく表示 |
| `modelShort` | | セクション見出し用の短い英字表記（長い車種名のとき） |
| `nameJa` | ○ | 日本語車種名（「今の〇〇、いくらになる？」などに使用） |
| `seo.title` / `seo.description` | ○ | title・meta description（OGPにも使用）。canonical・og:url は slug から自動 |
| `seo.ogTitle` / `seo.ogDescription` | | OGPだけ変えたい場合 |
| `images.hero` | | ファーストビュー画像 `{src, alt, width, height}`。OGP画像（`images.og` 未指定時）にも使用 |
| `images.og` | | OGP画像を別にする場合のパス |
| `images.line` | | LINE写真査定の画像 `{webp:[{src,width}], fallback, alt, width, height}` |
| `images.final` | | 最終CTAの背景画像 `{src}`（未指定ならファーストビュー画像） |
| `hero.label` / `hero.catch` / `hero.lead` / `hero.buy` | | ファーストビューの文言（未指定なら共通の文言） |
| `form.bodyTypes` | | ボディタイプ（型式など）とグレード一覧。未指定ならボディタイプ欄は出さない |
| `form.bodyTypeLabel` | | ボディタイプ欄の見出し（例：「世代」「型式」）。既定は「ボディタイプ」。通知メールの項目名にも使われる（20文字まで） |
| `form.grades` | | ボディタイプがない車種のグレード一覧 |
| `form.gradeFallback` | ○ | グレードの最後の選択肢（例：「その他・わからない」） |
| `form.yearFrom` / `form.yearOlderLabel` | ○ / | 年式の選択肢（今年〜yearFrom、＋それ以前、＋わからない） |
| `form.mileageOptions` | | 走行距離の選択肢（未指定なら共通の選択肢） |
| `cases` | | 買取実績（実在のもののみ）。`image` がなければ代わりのタイルを表示 |
| `points.lead` / `points.items` / `points.more` / `points.close` | | 査定ポイント。`items` は `{key, title, text, image, icon, tone, placeholderLabel}` |
| `faq` | | 車種固有FAQ `[{q, a}]`（共通5問の後に表示） |
| `line.title` / `line.lead` / `line.ctaText` | | LINE写真査定の文言 |
| `final.label` / `final.title` / `final.lead` / `final.lineText` | | 最終CTAの文言 |
| `theme` | | 車種専用の配色・装飾。`src/assets/css/themes/<theme>.css` を読み込み、`<body class="lp-theme-<theme>">` になる（例：`"porsche"`）。未指定なら共通デザイン |
| `hero.cta` | | ファーストビュー内にCTAボタンを出す場合の文言（例：「60秒で概算査定」） |
| `images.hero.position` / `positionPc` | | テーマ側でファーストビュー写真を切り抜く場合の `object-position`（スマホ／PC） |
| `images.hero.webp` | | ファーストビュー画像のWebP版 `[{src, width}]`。指定すると `<picture>` で配信し、`src` はフォールバックになる |
| `images.line.position` / `positionPc` | | LINE写真査定の画像の `object-position`（スマホ／PC）。未指定なら共通の位置 |
| `cases[].compare` | | 実在の比較結果がある場合の表示（例：「2位の会社より15万円高く買取」） |
| `sitemap.lastmod` | | サイトマップの最終更新日（例：`"2026-10-05"`）。内容を大きく更新したときだけ書く。未指定なら出力しない |

- 査定ポイントの `icon` に使えるもの：`car` `seat` `wheel` `badge` `search` `star` `chart` `map` `form` `chat` `check` `camera` `yen` `truck` `doc`。
  `tone: "dark"` で黒いタイルになります。
- `<br>` を使える項目：`hero.catch`、`hero.lead`、`points.lead`、`points.close`、`line.title`、`line.lead`、`final.title`、`final.lead`、`faq[].a`。

## サイトマップ・robots.txt（手作業での編集は不要）

- `npm run build` で `dist/sitemap.xml` と `dist/robots.txt` が自動で作られます（`src/sitemap.njk`・`src/robots.njk`）。
- サイトマップには、トップページ（`https://bimport.jp/`）と、`draft: false` の車種LPが自動で載ります。
  車種LPのURLは canonical と同じ式（`site.siteUrl` ＋ `/<slug>/`）で作るので、必ず一致します。
- `draft: true` の車種は、確認用ビルド（`npm run build:preview`）でもサイトマップに載りません。
  確認用ビルドで出力される下書きページには `noindex` が付きます。
- プライバシーポリシーは検索流入を狙わないページのため、サイトマップには載せていません（リンクからは通常どおり辿れます）。
- robots.txt にはサイトマップのURL（`https://bimport.jp/sitemap.xml`）が自動で入ります。

## 共通設定（車種データに書かないもの）

LINE URL・Google口コミURL・サイトURL・GAS送信先（`estimateEndpoint`）・電話番号・店舗情報・GA4 は、
すべて `src/_data/site.json` から読み込みます。車種データに重複して書かないでください。
通知先メールアドレスなどの秘密情報は Google Apps Script のスクリプトプロパティで管理し、リポジトリには入れません。

## 画像がない場合

| 画像 | ない場合の表示 |
|---|---|
| ファーストビュー | 文字とバッジだけのファーストビュー |
| LINE写真査定 | ファーストビュー画像を使用。それもなければ黒背景 |
| 最終CTA | ファーストビュー画像を使用。それもなければ黒背景 |
| 買取実績 | 車のアイコンのタイル |
| 査定ポイント | アイコン（＋任意の英字ラベル）のタイル |

## 問い合わせの流入LPの見分け方

通知メールには、メーカー・車種（件名と本文）と、送信元の「ページ」URL（例：`https://bimport.jp/defender/`）が入るので、
どのLPからの依頼かが分かります。UTM・gclid・fbclid も「流入元」として入ります。
ボディタイプ欄の項目名は `form.bodyTypeLabel`（未指定なら「ボディタイプ」）が LP の見出し・確認画面・通知メールで共通に使われます
（例：DEFENDER は「ボディタイプ：90」、911 は「世代：992」、型式で分ける車種は「型式：○○」）。
ボディタイプ欄がない車種では、「ボディタイプ：指定なし」として送信されます。
