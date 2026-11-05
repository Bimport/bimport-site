# 人気輸入車の実績未掲載LP：少数制作

利用枠を残したいというユーザー指定に合わせ、アウディA3・フォルクスワーゲン ポロ・ボルボXC60の3車種、生成画像6枚だけで区切った。すべてdraft:true、cases:[]。公開承認はまだ受けていない。

|車種|下書きURL|
|---|---|
|アウディA3|`/audi-a3/`|
|フォルクスワーゲン ポロ|`/volkswagen-polo/`|
|ボルボXC60|`/volvo-xc60/`|

## グレード確認資料

- [Audi国内公式諸元・装備資料](https://media.audi.com/is/content/audi/country/jp/ja/assets/catalogue/a3/my26/MY26_A3_S3_Product_Information_251017_02.pdf)：A3 Sportback / Sedanの30 TFSI advanced・S line、40 TFSI quattro advanced・S line。S3・RS3をA3のグレードには混ぜない。SBはSportbackの短い表記。
- [Volkswagen国内公式Polo装備資料](https://www.volkswagen.co.jp/idhub/content/dam/onehub_pkw/importers/jp/pc/catalog/equipment_pdf/polo/polo_equipment_catalog.pdf)：TSI Active Basic / Active / Style / R-Line、GTI。
- [Volvo国内公式XC60発表](https://jp.volvocars.com/pressrelease/2026-06-04/)：Plus B5 AWD、Ultra B5 AWD、Ultra B5 AWD Dark Edition。旧型や未確認のPHEVグレードは「その他・わからない」で受ける。

## 画像

組み込みimage_genを使用。FVは屋外の左向き前方カット、LINE用は別の色・場所の後方カット。A3はSportbackとSedanの別ボディ。生成画像と注記し、実績欄には置かない。上下が背景へなじむ既存と同じ表示、車両全体が収まるcontain配置。実績欄は現在未掲載の案内のみ。

保存先：`src/assets/images/<slug>/hero-ai-1536.jpg` と `line-image-ai-1536.jpg`。各1536px・1000px WebPあり。[全プロンプトと最終保存先](popular-import-image-prompts-2026-11-05.json)。画像生成は6枚で終了し、追加量産しない。

## 確認

- 3車種×1440・375・320pxの9画面で横スクロール・見出しやボタンのはみ出しなし。
- 全車種で必須入力エラー・全分類のグレード連動・確認画面・完了画面をMac内の模擬送信で確認。本番への送信は0件。
- プレビュー・本番ビルド成功。既存公開ページとアセットの内容は作業前と一致。3下書きは本番HTML・サイトマップに含まれず、プレビューはnoindex付き。
