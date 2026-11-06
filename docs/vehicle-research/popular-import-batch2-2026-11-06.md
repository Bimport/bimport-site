# 人気輸入車：追加8車種の下書き（2026-11-06）

全8車種はdraft:true・cases:[]の実績未掲載版。公開承認はまだ受けていない。FVとLINE用は別の色・場所・角度の生成画像各1枚。AI注記、FV上下のフェード、実績欄は案内文のみ。実績ができたら実車の白壁写真と確認済みのデータを追加する。

## 選定

[JAIA「日本の輸入車市場2025」p.31](https://www.jaia-jp.org/cms/wp-content/uploads/2025iamj-1.pdf)の過去の国内登録上位にあるT-Cross・T-Roc、60シリーズを優先。60シリーズはV60単独の台数ではない。アウディの主要コンパクト・ミドルクラスも追加し、販売順位をLP本文には載せない。全車種の厳密な最新人気順位を意味しない。

準備表を照合。今回の8車種でティグアンのみ車両が存在するが、ユーザー指定で実績対象外のため掲載しない。ほかの7車種には掲載できる実績なし。車体番号等はこのメモに記載しない。

## 国内グレードの裏付け

| 車種 | 主な選択肢 | 根拠 |
|---|---|---|
| VW T-Cross | TSI Active / Style / R-Line | [VW国内価格表](https://www.volkswagen.co.jp/idhub/content/dam/onehub_pkw/importers/jp/pc/_models/pdf/vw_pricelist_202601.pdf) |
| VW T-Roc | TSI・TDI・R | 同上。国内確認済みの主要グレードのみ |
| VW ティグアン | eTSI・TDI・旧型 | 同上。除外指定の車両は実績に載せない |
| アウディQ2 | TFSI・TDI・旧仕様 | [国内公式発表](https://www.audi-press.jp/press-releases/2024/s5n52g0000001udk.html)。TDIは表記の揺れを避け、具体的グレードを列挙せずフォールバックで受ける |
| ボルボV60 | MHEV・PHEV・旧型 | [国内公式ラインナップ](https://www.volvocars.com/jp/l/v60/)。Cross Countryは別車種扱い |
| アウディA4 | B9・旧型 | [国内公式発表](https://audi-press.jp/press-releases/2020/b7rqqm000000wx82.html)。本文はセダン・Avantを対象、S4/RS4は別モデル |
| アウディA5 | 新型・従来型 | [国内公式発表](https://www.audi-press.jp/press-releases/2025/s5n52g0000002avz.html)。旧型クーペ等はフォールバック、新型A5/Avantと区別 |
| アウディA1 | GB・8X | [国内公式発表](https://www.audi-press.jp/press-releases/2020/b7rqqm000000w9di.html)、[国内諸元](https://www.audi-press.jp/presskits/b7rqqm000000ue9z-att/b7rqqm000000uib7.pdf)。旧型の具体的グレードは列挙しない |

未確認の旧型・限定車・特別仕様は「その他・わからない」で受ける。年式・世代・装備の全仕様を網羅するリストではない。

## 画像

built-in imagegenを使用。全16枚をsrc/assets/images/<slug>/へJPEG1536px・WebP1536px・WebP1000pxで保存。正確なプロンプトと保存先は[プロンプト一覧](popular-import-batch2-prompts-2026-11-06.json)。公開済みの最新mainから新規作成。

## A3 型式フォームの確認版

ユーザーは全体変更の前に1件だけ確認することを指定。/audi-a3-form-review/はdraft:trueの比較確認専用。公開中の/audi-a3/は変更していない。見出しを「型式」とし、GY・8V・8P・わからないを選択。8Yは海外の世代呼称のため、国内車検証の型式の先頭に合わせGYを採用。

根拠：[国内A3公式カタログ](https://media.audi.com/is/content/audi/country/jp/ja/assets/catalogue/a3/my26/MY26_A3_S3_Product_Information_251017_02.pdf)、[国土交通省の型式資料](https://www.mlit.go.jp/common/001015894.pdf)、[Audi純正リコール資料](https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3A190f7fdd-bc04-4e53-8d44-733b7fdf1998/original/as/G3035.pdf)。8Vと8Pは裏付け済み1.4 TFSIのみ列挙。表にない初代や不明な仕様は「わからない」で受ける。型式と世代・ボディ分類を混同して一括置換しない。

## 検証

- 新規8車種＋A3比較版を1440/375/320pxの27画面で確認。横スクロール・見出しや選択ボタンのはみ出しなし。
- 各ページの必須エラー、分類とグレードの連動、確認画面・ローカル模擬完了を通過。9件の模擬送信はローカル8086だけ。本番へ送信していない。
- 16枚の生成画像を目視確認し、Web用48ファイルの寸法・参照を確認。
- 本番ビルドで9確認ページは非出力・サイトマップ未掲載。公開中LPを含む1568ファイルは作業前のmainビルドとバイト単位で同一。
- A3・ポロ・XC60の公開はPR #35で完了。Actions 42141711375のbuild/deploy成功、本番3ページ・sitemap・robotsは承認ビルドと完全一致。A3の本番フォームは確認画面までブラウザ検証後、専用スクリプトで個人テスト通知先に1件のみ送信し、ok:true/test:trueを確認。再送しない。
