# 実績未掲載版10車種（2026-11-09）

ユーザーの「もう10件作成して」により10車種で区切る。draft:true、cases:[]、型式フォーム、AI生成イメージ各2枚。2026-11-09ユーザー承認により公開対象へ変更。準備表CSVの車種・モデル欄に一致する実績は0件。買取履歴自体がないとは断定せず、このページでの実績は現在未掲載と表示する。

|車種|slug|型式と国内確認済みの一部グレード|
|---|---|---|
|メルセデス・ベンツSL|mercedes-benz-sl|231：SL350 / SL550|
|メルセデス・ベンツSLK|mercedes-benz-slk|172：SLK200 / SLK350|
|メルセデス・ベンツSLC|mercedes-benz-slc|172：SLC180 / AMG SLC43|
|メルセデス・ベンツCLK|mercedes-benz-clk|209：CLK200（国内届出の通称名）|
|メルセデス・ベンツCL|mercedes-benz-cl|216：CL550|
|アウディA8|audi-a8|4N/F8：55 TFSI quattro|
|アウディQ4 e-tron|audi-q4-e-tron|FZ：45 e-tron advanced / 45 e-tron S line|
|ボルボC30|volvo-c30|MB：2.0e Aktiv|
|ルノー アルカナ|renault-arkana|LJLH4MH：E-TECH エンジニアード / エスプリ アルピーヌ フルハイブリッド E-TECH、LJLH5HH：R.S. LINE マイルド ハイブリッド / エスプリ アルピーヌ マイルド ハイブリッド|
|フィアット パンダ|fiat-panda|13909：Easy|

全世代・全グレードを網羅しない。国内資料で裏付けた範囲だけ選択肢にし、一覧にない型式・グレードは「わからない」「その他・わからない」で受ける。各型式は車検証表記の共通部分を短縮。A8の4Nはメーカーのモデル区分、F8は国内型式であることをFAQに明記。Q4は通常SUVのグレードだけを載せ、Sportbackは専用グレードを作らずfallbackで受ける。

## 国内資料

- [SLK/SLC国内届出（国土交通省）](https://www.mlit.go.jp/common/001196539.pdf)：日本輸入者、172プラットフォーム、SLK200/350・SLC180・AMG SLC43の国内型式を確認。
- [SL/CL国内届出（国土交通省）](https://www.mlit.go.jp/common/001286642.pdf)と[同メーカー原本](https://www.mercedes-benz.jp/myservice/recall/info/list/2019/pdf/0424_1.pdf)：SL350/550の231、CL550の216。リコール対象範囲を全車両の製造期間と解釈しない。
- [CLK国内燃費届出（国土交通省）](https://www.mlit.go.jp/jidosha/green/mercedesbenz/mercedesbenz0603-f.pdf)：CLK200、DBA-209342。グレード名は資料の通称名に留め、未照合のアバンギャルド等を足さない。
- [Audi Japan純正アクセサリー](https://www.audi.co.jp/ja/accessory_service/genuine_accessories/layer/audi_winter_accessories/)と[国内A8回収マニュアル](https://media.audi.com/is/content/audi/country/jp/ja/accessory_service/info_top/recycle/layer/kanrengyosya/asset/pdf/F8_A8_MHEV48.pdf)：A8 55 TFSI quattroの4N/F8。S8は別車種として追加しない。
- [Audi Q4国内仕様PDF](https://media.audi.com/is/content/audi/country/jp/ja/assets/catalogue/q4-e-tron/my25/Q4e-tron_Product_Information_241209.pdf)：45 e-tron advanced/S line、ZAA-FZEDF（仕様表20頁）。発注コードF4と車検証型式FZを混同しない。[国内発表](https://audi-press.jp/press-releases/2024/s5n52g0000001uxa.html)でも国内導入を確認。PDFは端末に取得し抽出、原本は公開リポジトリへ再配布しない。
- [Volvo公式認定中古車のモデル選択](https://www.v-selektsearch.jp/cgi-bin/WebObjects/VSSearch.woa/wa/SearchAction/searchNewEntry)：国内C30 2.0e Aktivを確認。[国内型式届出](https://www.mlit.go.jp/jidosha/nenpi/nenpikouhyou/gjou/volvo-JC08.pdf)のC30 CBA-MB4204Sと、[メーカー担当者の出演・試乗車記録](https://www.tvk-yokohama.com/kurumaArchive/2010/02/post-310.php)のC30 2.0e Aktiv／1998ccを照合。
- [ルノー国内旧仕様](https://www.renault.jp/car_lineup/arkana/gps_pdf/ARKANA_webspec.pdf)と[エスプリ アルピーヌ国内諸元](https://www.renault.jp/car_lineup/arkana/gps_pdf/ARKANA_ea_webspec.pdf)：型式ごとのフル／マイルドハイブリッドを確認、相互にグレードを流用しない。
- [Panda国内発表](https://www.stellantis.jp/news/20230301_fiat_new_price)、[公式認定中古車](https://fiat.auto-expert.jp/cgi-bin/WebObjects/FCAUsedCar.woa/wa/carDetail?carGlobalKey=fcad1_1a01c57b6dc)、[国内届出](https://www.mlit.go.jp/common/001186799.pdf)：EasyとABA-13909。500の31209と混同しない。

## 画像方針

組み込みimage_genで1車種2枚、計20枚。FVは屋外・前方・左向き、LINEは別色・別場所・後方。SL/SLK/SLCはルーフ開閉で見た目を変え、CLKはクーペとカブリオレを使う。隣接するAI注記を維持、実績欄には画像を使わない。画像は特定グレードや国内仕様の装備を保証するものではない。プロンプトと保存先は同日prompts JSON参照。

## 確認完了

- 20枚の生成画像を目視確認。車種の形状、車体全体の余白、2枚の色・場所・アングルの違いを確認。上下フェードを維持し、LINE画像は全10車種で読み込み成功・contain表示。
- 1440/375/320pxの30画面で横スクロール、見出し・型式ボタンのはみ出し、FV画像不良なし。スマホ画面も目視確認。
- 全10フォームで必須4項目エラー、各型式のグレード連動とfallback、確認画面の型式表示、模擬送信後の完了表示を確認。Mac内の模擬送信データのメーカー・車種・型式・グレードも照合。本番送信0件。
- preview/productionビルド成功。既存1842ファイルは作業前とバイト単位で一致。新規下書きの本番HTML・サイトマップ非出力、previewのcanonical/noindexを確認。
- 下書き一覧に新規10件のリンクあり。従来のA3型式フォーム比較版1件も残るため一覧表示は11件。比較版は今回の追加件数に含めない。
