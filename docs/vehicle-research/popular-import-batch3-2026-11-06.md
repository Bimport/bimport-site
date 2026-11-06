# 主要輸入車6車種の追加下書きと型式統一（2026-11-06）

## 今回の完成分

Bクラス・Vクラス・GLS・アウディA6・TT・VWザ・ビートルの6車種。すべてdraft:true、cases:[]。国内の主要な実用車・SUV・流通する販売終了モデルを補完する選定で、厳密な販売順位ではない。公開は未承認。準備表を検索し、今回6車種の掲載実績は見つからなかった。準備表のGLSは別車種のメルセデス・マイバッハGLSであり、通常GLSの実績へ流用しない。

全車種を型式選択に統一し、国内資料で裏付けた主要グレードだけを対応。古い型式・新型・特別仕様で未列挙のものは「わからない」「その他・わからない」で受ける。全型式・全グレードの網羅ではない。BMW/Mercedes等の通称型式と国内認定型式の表記差はFAQで説明する。

| 車種・slug | 型式 | 国内グレードの根拠 |
|---|---|---|
| Bクラス / mercedes-benz-b-class | W247（車検証247系） | [国内公式Data Information](https://www.mercedes-benz.co.jp/content/dam/japan/passengercars/Model/catalog/b-class/B-Class_DI_MP202602_251210.pdf) p.1を画像として照合。B 180 Urban Stars・B 200 d Urban Stars |
| Vクラス / mercedes-benz-v-class | W447（車検証447系） | [国内公式Data Information](https://www.mercedes-benz.co.jp/content/dam/japan/passengercars/Model/catalog/v-class/V-Class_DI_MP202701_260908.pdf) p.1を画像として照合。V 220 d・V 220 d long |
| GLS / mercedes-benz-gls | X167（車検証167系） | [国内公式Data Information](https://www.mercedes-benz.co.jp/content/dam/japan/passengercars/Model/catalog/gls/GLS_DI_MP202602_260717.pdf) p.1を画像として照合。通常GLSの2仕様を列挙。GLクラス・マイバッハGLSは既存の別LP |
| アウディA6 / audi-a6 | F2 | [国内公式カタログ](https://media.audi.com/is/content/audi/country/jp/ja/assets/catalogue/a6/my25/A6_S6_Product_Information_241209.pdf)、[国内公式発表](https://audi-press.jp/press-releases/2023/pdhl9j0000001a1v.html)。セダン・Avantを対象。S6/RS6とは区別 |
| アウディTT / audi-tt | FV（通称8S） | [国内公式諸元](https://www.audi.co.jp/dam/nemo/jp/catalogue/tt/my20/my20_tt_tts_di_191212.pdf)、[国内公式発表](https://www.audi-press.jp/press-releases/2019/b7rqqm000000rilp.html)。Coupé・Roadsterをグレードで区別。TTS/TT RSは含めない |
| VWザ・ビートル / volkswagen-the-beetle | 16 | [国内公式装備・諸元](https://www.volkswagen.co.jp/idhub/content/dam/onehub_pkw/importers/jp/pc/catalog/equipment_pdf/TheBeetle_Equipment_catalog.pdf)、[国交省型式資料](https://www.mlit.go.jp/common/001015899.pdf)。ニュービートル・旧来のビートルとは区別 |

## 既存の未公開8車種も型式選択へ変更

画像と実績配列を維持し、フォーム分類と矛盾するFAQだけを更新。

| 車種 | 型式 | 追加で確認した資料 |
|---|---|---|
| T-Cross | C1 | [VW国内価格表](https://www.volkswagen.co.jp/idhub/content/dam/onehub_pkw/importers/jp/pc/_models/pdf/vw_pricelist_202601.pdf) |
| T-Roc | A1 | 同上。TSI・TDI・Rをグレード欄へ統合。Rは「T-Roc R TSI 4MOTION」と明示 |
| ティグアン | CT・5N | 同上、[国交省旧型資料](https://www.mlit.go.jp/common/001015899.pdf)。CTで国内確認済みeTSI/TDIグレード、5Nはフォールバック |
| Q2 | GA | [Audi国内純正アクセサリー適合](https://audionlineshop.jp/products/detail.php?product_id=1395)、[国交省型式資料](https://www.mlit.go.jp/common/001015894.pdf) |
| V60 | ZB・FB | [国内公式諸元](https://jp.volvocars.com/pressrelease/wp-content/uploads/2022/06/V60.pdf)、[国交省旧型資料](https://www.mlit.go.jp/common/001015900.pdf)。ZBへ既存MHEV/PHEVグレードを統合 |
| A4 | 8W・8K | [国内公式資料](https://www.audi.co.jp/dam/nemo/jp/catalogue/a4/my20/my20_a4s4_di_201002.pdf)、[国交省型式資料](https://www.mlit.go.jp/common/001015894.pdf)。既存B9のグレードを8Wへ移す |
| A5 | FU・F5・8T | [現行純正アクセサリー適合](https://audionlineshop.jp/products/detail.php?product_id=1155)、[国内公式型式表](https://media.audi.com/is/content/audi/country/jp/ja/accessory_service/info_top/recycle/assets/pdf/newcar_ajhp_my21_20210712.pdf)、[国交省旧型資料](https://www.mlit.go.jp/common/001015894.pdf)。FUへ新型グレードを対応 |
| A1 | GB・8X | 既存の型式選択を維持し、説明を追加。国内型式資料は前回メモ参照 |

## 画像・保存先

built-in imagegenで12枚を生成。各車種のFVは屋外・正面左向き、LINEは別の色・場所・後方角度。全画像を目視確認し、車両全体・車種・角度・文字なしを確認。FV上下のフェードとAI注記を維持。実績欄には画像を使わない。

各車種のsrc/assets/images/<slug>/へJPEG1536px、WebP1536px・1000px、計36ファイルとして保存。[正確な生成プロンプトと最終保存先](popular-import-batch3-prompts-2026-11-06.json)。

## 検証

- 新規6＋既存8の14車種×1440/375/320px、計42画面。横スクロール・見出し・フォームボタンのはみ出しなし。
- 全14フォームで必須エラー、全型式のグレード連動、不明時のフォールバック、確認画面とローカル模擬完了を確認。bodyTypeLabelは型式、送信先はローカル8086のみ。本番送信0件。
- 6車種のLINE画像はブラウザで読み込み・contain表示を確認。12枚×3形式のファイル整合を確認。
- 本番ビルドで全新規下書きは非出力、サイトマップ未掲載。公開中LPを含む1568ファイルは最新mainの承認済み公開ビルドとバイト単位で同一。
- 以前の公開LP7車種の型式修正案はvehicleDraftOverridesで維持。今回それらを公開していない。共通テンプレート・CSS・JSも未変更。
