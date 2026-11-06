# ボディ選択を型式選択へ統一（2026-11-06）

ユーザーがA3の型式フォーム確認版を確認し、「型式に統一」と指定。フォーム先頭が「ボディ／ボディタイプ」となっていた7車種を対象に、見出しと選択肢・連動グレード・FAQを修正。

公開中LPの修正案は既存の`src/_data/vehicleDraftOverrides/`に保存し、LP_PREVIEW=1のビルドだけに適用する。全7件draft:true。公開中の車種データと画像・実績は維持。公開承認後に各overrideのform/faqを本体へ反映し、overrideを取り除く。A3の/audi-a3-form-review/は比較用として残す。

| 車種 | 型式の選択肢（ほかに「わからない」） | 根拠 |
|---|---|---|
| アウディA3 | GY・8V・8P | [国内公式A3カタログ](https://media.audi.com/is/content/audi/country/jp/ja/assets/catalogue/a3/my26/MY26_A3_S3_Product_Information_251017_02.pdf)、[国交省型式資料](https://www.mlit.go.jp/common/001015894.pdf)。A3確認版と同じ |
| アバルト500e | FA1AB | [国内公式仕様](https://www.abarth.jp/500e/)。両ボディは同じ型式。既存のグレードをまとめて連動 |
| MINI | F56・F55・F60・F54・F57・R56・R55・R57・R60 | [MINI国内公式アクセサリー](https://www.mini.jp/ja_JP/home/accessories/tv-tuner.html)、[MINI純正資料](https://www.mini.com/content/dam/MINI/common/ilp/childseats/Fahrzeugliste_Junior%20Seat_2017_08.pdf)。国内販売グレードは以前の[確認記録](draft-batch-2026-10-17.md)から該当するF系へ移す。旧型グレードは捏造せずフォールバック。通称型式と車検証の認定型式は異なる旨をFAQに明記 |
| BMW i5 | G60・G61 | [BMW公式歴代資料](https://www.bmw.co.jp/ja/all-models/5-series.html/1000)、[国内公式冬タイヤ資料](https://www.bmw.co.jp/content/dam/bmw/marketJP/bmw_co_jp/pdf/topics/service-and-accessory/Wintercomplete/2026/2026_BMW_wintercomplete_202603-ver01.pdf.asset.1774946874760.pdf)。セダン/ツーリングの既存グレードを各コードへ移す |
| BMW i8 | I12・I15 | [BMW Japan公式発表](https://www.press.bmwgroup.com/japan/article/detail/T0279926JA/)。クーペ/ロードスターの既存グレードを各コードへ移す |
| BMW 8シリーズ | G15・G16・G14・E31 | 既存FAQにもコードが記載。[カブリオレ国内発表](https://www.press.bmwgroup.com/japan/article/detail/T0292063JA/)、[グランクーペ国内発表](https://www.press.bmwgroup.com/japan/article/detail/T0302087JA/)、国内グレードは[以前の確認記録](draft-batch-2026-10-17.md)。各ボディのグレードを移す |
| ディフェンダー | LE | [国交省国内型式資料](https://www.mlit.go.jp/report/press/content/001869373.pdf)。90/110/130を型式として扱わず、LEを選択し、グレードで「90 S」「110 S」等のボディを合わせて選ぶ。旧型はわからないで受ける |

BMW/MINIは従来のサイトで使われている通称型式（開発コード）単位。車検証の認定型式とは別表記であることを説明し、無理に選ばせない。列挙のない初代・最新型・特別仕様は「わからない」「その他・わからない」で受ける。車種や国内グレードを推測して追加しない。

## 検証

- 7車種×1440/375/320px。フォームの横スクロール・ボタンのはみ出しなし。ディフェンダーの画面外の実績カルーセルは従来のまま。
- 必須エラー、全型式のグレード連動、「わからない」でのフォールバック、確認画面の「型式」、模擬完了を確認。
- 全7件の送信先はローカル8086の模擬応答のみ。送信payloadのbodyTypeLabel=型式を確認。本番送信0件。
- 実績配列・画像は変更前と同一。本番ビルドの1568ファイルはmainの承認済み公開ビルドと完全一致。
- 共通テンプレート・CSS・JSは変更なし。
