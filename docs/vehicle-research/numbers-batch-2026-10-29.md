# Numbers入力分：21車種の下書き（2026-10-29）

今回新規入力された24台の金額（万円）・買取年月を使用。全21車種はdraft: true。未公開。

## 照合・例外

- 出品票24台をローカルOCRと原画像で照合。地域は登録ナンバーの地名から都道府県へ対応。
- カムリ・シエンタのナンバー欄は空欄。2026-10-29にユーザーからそれぞれ滋賀県・東京都との回答を受領。
- ダッジ2台は初度登録年ではなく出品票のモデルイヤー（チャレンジャー2016年、チャージャー2017年）を採用。
- モデルSの実績グレードは未確認のため表示しない。
- 装備・不具合は準備表の記載をそのまま読点で分割し、削除・追加しない。
- 既存の小数価格は、Numbersの表示上の丸め値で上書きしない。
- 元の準備表・出品票・車体番号はMacの非公開フォルダで管理。リポジトリには含めない。

## グレードの裏付け

日本向けメーカー公式資料で確認できた主要グレードのみを掲載。世代別の完全な一覧ではなく、未収載の仕様は「限定車・特別仕様車」「その他・わからない」で受ける。ダッジは国内販売を確認できる公式資料がないため具体的なグレード選択肢を列挙しない。

| 車種 | 下書きURLパス | 公式資料 |
|---|---|---|
| フォーフォー | /smart-forfour/ | [SMART公式資料](https://www.mercedes-benz.jp/passenger/estimate/smart/exterior/table.pdf) |
| チャレンジャー | /dodge-challenger/ | 具体的なグレードは未列挙 |
| チャージャー | /dodge-charger/ | 具体的なグレードは未列挙 |
| モデル3 | /tesla-model-3/ | [TESLA公式資料](https://www.tesla.com/ja_jp/model3-performance) |
| モデルS | /tesla-model-s/ | [TESLA公式資料](https://www.tesla.com/ownersmanual/2012_2020_models/ja_jp/Owners_Manual.pdf) |
| モデルY | /tesla-model-y/ | [TESLA公式資料](https://www.tesla.com/ja_jp/modely/design) |
| エブリイ | /suzuki-every/ | [SUZUKI公式資料](https://www.suzuki.co.jp/release/a/2026/0508/index.html) |
| インプレッサ | /subaru-impreza/ | [SUBARU公式資料](https://www.subaru.co.jp/news/archives/12_07_09/12_07_03_3.html) |
| タント | /daihatsu-tanto/ | [DAIHATSU公式資料](https://u-catch.daihatsu.co.jp/catalog/TANTO/MODEL__200712/) |
| ハイゼットトラック | /daihatsu-hijet-truck/ | [DAIHATSU公式資料](https://u-catch.daihatsu.co.jp/catalog/HIJET_TRUCK/GRADE__859243/) |
| ミラジーノ | /daihatsu-mira-gino/ | [DAIHATSU公式資料](https://www.daihatsu.com/jp/news/2005/20051220-01.html) |
| ロッキー | /daihatsu-rocky/ | [DAIHATSU公式資料](https://www.daihatsu.co.jp/lineup/rocky/pdf/equipment_chart.pdf) |
| 86 | /toyota-86/ | [TOYOTA公式資料](https://toyota.jp/ucar/catalog/brand-TOYOTA/car-86/) |
| アルファード | /toyota-alphard/ | [TOYOTA公式資料](https://toyota.jp/ucar/catalog/brand-TOYOTA/car-ALPHARD/) |
| アレックス | /toyota-allex/ | [TOYOTA公式資料](https://toyota.jp/ucar/catalog/brand-TOYOTA/car-ALLEX/) |
| カムリ | /toyota-camry/ | [TOYOTA公式資料](https://toyota.jp/ucar/catalog/brand-TOYOTA/car-CAMRY/) |
| カローラクロス | /toyota-corolla-cross/ | [TOYOTA公式資料](https://toyota.jp/corollacross/grade/) |
| クラウン | /toyota-crown/ | [TOYOTA公式資料](https://toyota.jp/ucar/catalog/brand-TOYOTA/car-CROWN/) |
| シエンタ | /toyota-sienta/ | [TOYOTA公式資料](https://toyota.jp/ucar/catalog/brand-TOYOTA/car-SIENTA/) |
| スペイド | /toyota-spade/ | [TOYOTA公式資料](https://toyota.jp/ucar/catalog/brand-TOYOTA/car-SPADE/) |
| スープラ | /toyota-supra/ | [TOYOTA公式資料](https://toyota.jp/ucar/catalog/brand-TOYOTA/car-SUPRA/) |

## 画像

既存の準備表FVを車種ごとに確認して最適化。実績写真は実車の正面写真をbuilt-in imagegenで背景編集。共通指示は「車体・色・ホイール・形・傷や損傷・向きは保持、背景のみロゴ・文字・看板のない白壁ショールーム、無地の白いナンバー、自然な影と床反射」。LINE写真も同じ実績車両の白壁画像を使用。最終画像はsrc/assets/images/cases/と各車種の画像フォルダに保存。

## 確認結果

- 全21車種 × 1440px / 375px / 320px（63画面）：横スクロール・画像未読込・文字はみ出し・JSエラーなし。
- 各画面で未入力検証、グレード選択、3STEP、確認画面、模擬完了まで通過。外部ネットワークは遮断し、GASはローカルの模擬応答のみ。本番送信0件。
- 金額・時期・装備・地域・画像の24実績整合を確認。Numbersで丸め表示された既存小数価格は保持。
- 通常の本番ビルドで21車種と確認一覧が出力されず、サイトマップにも載らないことを確認。
- 既存の公開ページ・画像・共通ファイル381件は作業前のmainビルドとバイト単位で完全一致。
- `npm run build:preview` 後の `/draft-review/` に下書き一覧を生成。通常ビルドでは一覧も非出力。
