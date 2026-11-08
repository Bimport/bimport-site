# 実績未掲載版10車種（2026-11-08）

ユーザーの「あと10個LP作成」により10車種で区切る。draft:true、cases:[]、型式フォーム、AI生成イメージ各2枚。公開未承認。準備表CSVの車種・モデル欄に該当する実績は0件。買取履歴自体がないとは断定せず、このページでの実績は現在未掲載と表示する。

|車種|slug|型式と国内確認済みの一部グレード|
|---|---|---|
|VW up!|volkswagen-up|AACHY：move up! / high up!|
|VWアルテオン|volkswagen-arteon|3HDNUF：TSI 4MOTION Elegance / R-Line / R-Line Advance、各Shooting Brake|
|VWトゥアレグ|volkswagen-touareg|7P：V6 / V6 Upgrade Package|
|ボルボV40|volvo-v40|MB：T3 Momentum|
|ボルボS60|volvo-s60|ZB：B5 Inscription / B5 R-Design|
|ボルボS90|volvo-s90|PB：B6 AWD Inscription|
|ルノー メガーヌ|renault-megane|BBH5H：インテンス、KBH5H：スポーツツアラー インテンス、BBM5P1：R.S. / R.S. トロフィー EDC / R.S. トロフィー MT|
|ルノー トゥインゴ|renault-twingo|AHH4B：インテンス EDC / キャンバストップEDC、AHB4D1：インテンス MT|
|アルファロメオ ジュリエッタ|alfa-romeo-giulietta|940：VELOCE|
|シトロエンC5エアクロス|citroen-c5-aircross|C84：SHINE / SHINE BlueHDi / PLUG-IN HYBRID|

一部の型式は国内型式の先頭共通部分を短縮している。全世代・全グレードを網羅しない。未確認の仕様は「わからない」「その他・わからない」で受け、旧型へグレードを流用しない。V40クロスカントリーは別仕様として今回は専用選択肢を追加しない。メガーヌは型式ごとにボディ・グレードを連動し、トゥインゴはMTとEDCを分離。

## 国内資料

- [VW up!公式諸元](https://www.volkswagen.co.jp/idhub/content/dam/onehub_pkw/importers/jp/pc/catalog/equipment_pdf/up%21_Equipment_catalog.pdf)：AACHYとmove/high up!、室内装備を照合。
- [VW国内型式・グレード（国土交通省）](https://www.mlit.go.jp/common/001321880.pdf)：アルテオン3HDNUF、通常ボディとShooting Brakeの各グレード。
- [VWトゥアレグ2015年国内発表](https://www.volkswagen.co.jp/idhub/content/dam/onehub_pkw/importers/jp/pc/volkswagen/news/2015/001161_web_2.pdf)：3.6LのV6/V6 Upgrade Package。
- [トゥアレグ国内7P型式の確認補助](https://www.mlit.go.jp/common/001086892.pdf)：国内7P系の確認のみ。ハイブリッドのグレードは未追加。
- [ボルボV40国内発表](https://prtimes.jp/main/html/rd/p/000000027.000017096.html)と[公式認定中古車のV40](https://www.v-selektsearch.jp/cgi-bin/WebObjects/VSSearch.woa/wa/read/ad1_19cc65e8b29)：国内T3 MomentumとMB4154Tの対応を検索インデックスで確認。直接ページ取得はキャッシュなし。その他の未照合グレードは追加しない。
- [ボルボS60の48Vモデル国内発表](https://jp.volvocars.com/pressrelease/wp-content/uploads/2022/04/vcjpr_201126_01.pdf)：B5 Inscription/R-Design。[公式認定中古車S60](https://www.v-selektsearch.jp/cgi-bin/WebObjects/VSSearch.woa/wa/read/ad1_1a1629468bc)でZB420TMとの対応を補助確認。
- [S90国内再販売](https://jp.volvocars.com/pressrelease/2021-08-19/)と[公式認定中古車のS90](https://www.v-selektsearch.jp/cgi-bin/WebObjects/VSSearch.woa/wa/read/ad2_19cd597608d_0)：B6 AWD InscriptionとPB420TMA。過去のT5/T6等は今回のグレード欄へ補作しない。
- [メガーヌ国内発表](https://prtimes.jp/main/html/rd/p/000000126.000019201.html)、[R.S./トロフィー国内発表](https://prtimes.jp/main/html/rd/p/000000107.000019201.html)、[国土交通省ルノー型式一覧](https://www.mlit.go.jp/jidosha/content/001391322.pdf)：BBH5H/KBH5H/BBM5P1を照合。
- [トゥインゴ国内公式諸元](https://dcms.renault.jp/car_lineup/twingo/gps_pdf/TWINGO_webspec.pdf)：AHH4BとEDC、AHB4D1とMTを照合。
- [ジュリエッタの公式紹介](https://www.alfaromeo-japan.jp/campaign/history_giulietta/)、[国内正規ディーラー発表](https://hakko-andco.co.jp/alfa-romeo-giulietta-veloce-cuorerosso/)、[国内型式940181の届出](https://www.mlit.go.jp/common/001234139.pdf)：2010年代のヴェローチェを確認。別世代はfallback。
- [国土交通省・シトロエン国内型式グレード一覧](https://www.mlit.go.jp/common/001321882.pdf)：C84各SHINE/BlueHDi/PLUG-IN HYBRID。新しいC5エアクロスへ未照合グレードを流用しない。

## 画像

組み込みimage_genで1車種2枚、計20枚。FVは車種に合う屋外・左向き、LINEは別色・別場所・後方。アルテオンとメガーヌはLINE画像を同車種のワゴン仕様にする。全画像に隣接するAI注記あり、実績欄には使用しない。画像は特定グレードの装備を保証するものではない。プロンプトと保存先は同日prompts JSON参照。

## 確認完了

- 10車種×1440/375/320pxの30画面で横スクロール、見出し・型式ボタンのはみ出し、FV画像不良なし。
- 生成画像20枚の車種・向き・余白・色と背景の違いを目視確認。up!のLINE画像は生成結果が実在する3ドア仕様のため、その車種の別形状イメージとして採用。LINE画像は10車種とも読み込み成功、containで車体全体を表示。FVの上下フェードを維持。
- 全10フォームの必須4項目エラー、全型式のグレード連動とfallback、確認画面の型式表示、模擬送信後の完了表示を確認。Mac内送信データも照合。本番送信0件。
- preview/productionビルド成功。canonical/noindexと本番HTML・サイトマップへの下書き非出力を確認。既存1772ファイルは作業前とバイト単位で一致。
