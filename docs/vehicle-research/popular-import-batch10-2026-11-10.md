# 実績未掲載版10車種（2026-11-10）

ユーザーの「買取LP作成10件進めて」により10車種で区切る。draft:true、cases:[]、型式フォーム、AI生成イメージ各2枚。2026-11-10ユーザー承認により公開対象へ変更。準備表CSVの車種・モデル欄に一致する実績は0件。買取履歴そのものがないとは断定せず、このページでの買取実績は現在未掲載と表示する。

|車種|slug|国内確認済みの一部型式・グレード|
|---|---|---|
|フィアット500X|fiat-500x|33413：Club / Cross / Sport|
|アバルト595|abarth-595|31214T：Turismo / Competizione / 595C Turismo|
|スマート フォーツー|smart-fortwo|453344：ターボ、453362：BRABUS|
|ジャガーFペイス|jaguar-f-pace|DC2NC：Standard / S / R-Dynamic SEのD200、DC2XC：Standard / S / R-Dynamic SE / R-Dynamic HSEのP250|
|ジャガーEペイス|jaguar-e-pace|DF2NB：Standard / S / R-Dynamic S / R-Dynamic SEのD200、DF2XB：Standard / S / SEのP200、R-Dynamic S / SE / HSEのP250|
|ジャガーXF|jaguar-xf|JB2ND：S D200 / R-Dynamic SE D200、JBS2ND：各Sportbrake D200|
|ジャガーXJ|jaguar-xj|J12LA：Luxury / Premium Luxury / Portfolio|
|ボルボV70|volvo-v70|BB：T4 / T4 SE|
|ボルボV50|volvo-v50|MB4204S：2.0e Powershift|
|ボルボC70|volvo-c70|MB5254：T5|

型式ボタンは排出ガス識別記号や一部の末尾を省いた短い表記。全世代・全グレードを網羅しない。国内確認できた範囲だけを選択肢にし、一覧にない仕様は「わからない」「その他・わからない」で受ける。フォーツーはフォーフォーと分離し、カブリオやEVは未照合グレードを流用しない。595Cは595の別ルーフ仕様として同じLP内で受ける。695のグレードは追加しない。

## 国内資料

- [500X国内公式諸元・装備表](https://dl.stellantisjapan.jp/data/fiat/catalog/SpecCata_500x_JPN.pdf)、[メーカー国内発表](https://www.stellantis.jp/news/20221129_fiat_500x)、[型式33413国内届出](https://www.mlit.go.jp/common/001293378.pdf)：国内Club/Cross/Sport。海外ハイブリッド等を補作しない。
- [595国内ラインアップのメーカー発表](https://www.stellantis.jp/news/pr_20211026_abarth_595_make-your-scorpion_final)、[国内型式31214Tと595/595Cの届出](https://www.mlit.go.jp/report/press/content/001425700.pdf)：Turismo/Competizione/595C Turismo、通常ルーフとキャンバストップの違いを確認。
- [メルセデス・ベンツ日本のフォーツー国内届出](https://www.mercedes-benz.jp/myservice/recall/info/list/2017/pdf/0928_6.pdf)：DBA-453344 フォーツー ターボ、ABA-453362 フォーツー BRABUS。フォーフォー453044等を混ぜない。
- [ジャガー・ランドローバー・ジャパン国内型式グレード一覧（国土交通省）](https://www.mlit.go.jp/common/001321872.pdf)：E-PACEは別紙2（PDF2頁）、XFは別紙5、F-PACEは別紙6（PDF4頁）。結合セルの対応は原本を画像化して目視照合。ディーゼルとガソリン、セダンとSportbrakeを各型式に分離。
- [XJ国内型式・グレード（国土交通省）](https://www.mlit.go.jp/jidosha/nenpi/nenpikouhyou/gjou/jaguar.pdf)：CBA-J12LAのLuxury/Premium Luxury/Portfolio。別型式のSupersport等は追加しない。
- [Volvo公式認定中古車の国内モデル選択](https://www.v-selektsearch.jp/cgi-bin/WebObjects/VSSearch.woa/wa/SearchAction/searchNewEntry)：V70 T4/T4 SE、V50 2.0e Powershift、C70 T5の国内設定を確認。[国内型式・エンジン資料](https://www.mlit.go.jp/common/000206645.pdf)でV70 BB4164TW、V50 MB4204S、C70 MB5254を照合。[V70国内型式一覧](https://www.mlit.go.jp/jidosha/content/001341032.pdf)も補助確認。V70はBB系の一部グレードとしてのみ表示し、別世代に流用しない。

## 画像方針

組み込みimage_genで1車種2枚、計20枚。FVは屋外・左向き、LINEは別色・別場所・後方。595/フォーツー/C70はルーフ仕様を変え、XFはセダンとSportbrakeを使う。実績欄には使わず、画像の近くにAI生成のイメージと注記。特定グレード・国内装備を保証する画像ではない。指示文と保存先は同日prompts JSON参照。

## 確認完了

- 20枚の生成画像を目視確認。車種、ルーフ・ドア数、車体全体の余白、色と背景の違いを確認。FVの上下フェードを維持、LINE画像は全10車種で読み込み成功・contain表示。
- PC1440px・スマホ375/320pxの計30画面で横スクロール、見出し・型式ボタンのはみ出し、FV画像不良なし。スマホ画面も目視確認。表示確認中のJSエラーなし。
- 全10フォームで必須4項目エラー、全型式のグレード連動とfallback、確認画面の型式表示、模擬送信後の完了表示を確認。Mac内の模擬送信データでメーカー・車種・型式・グレードも照合。本番送信0件。
- preview/productionビルド成功。既存1912ファイルは作業前とバイト単位で一致。新規下書きの本番HTML・サイトマップ非出力、previewのcanonical/noindexを確認。
- 下書き一覧に新規10車種のリンクあり。以前のA3フォーム比較版1件を含め一覧は11件。公開承認まではdraft:trueを維持する。
