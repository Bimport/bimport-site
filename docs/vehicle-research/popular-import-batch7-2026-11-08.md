# フォルクスワーゲン追加3車種（2026-11-08）

ユーザーのLP追加依頼により、利用枠を残して3車種で区切る。準備表CSVの車種・モデル欄に該当実績なし。draft:true、cases:[]、実績未掲載案内、型式フォーム、AIイメージ各2枚。公開未承認。

|車種|slug|型式と国内確認済みの一部グレード|
|---|---|---|
|パサート（セダン・ヴァリアント）|volkswagen-passat|3CDPC：TSI Elegance/TSI Elegance Advance、3CDFH：TDI Elegance/TDI Elegance Advance/Variant TDI R-Line|
|ゴルフトゥーラン|volkswagen-golf-touran|1TDPC：TSI Trendline/Comfortline/Highline/R-Line、1TDFG：TDI Comfortline/Highline|
|シャラン|volkswagen-sharan|7NCZD：TSI Trendline/Comfortline/Highline|

型式は車検証の排出ガス識別記号を省いた表記。国内確認できた一部のみを掲載し、他世代・別型式・ディーゼル等は「わからない」「その他・わからない」で受ける。パサートTDI R-Lineはヴァリアント専用と明示。セダン・ヴァリアント共通のグレード名は共通選択肢とし、写真から形状を確認する。トゥーランの海外呼称5Tと国内登録型式1Tは区別し、フォームは国内登録型式を使う。

## 国内資料

- [国土交通省・VWの国内型式とグレード表（2021-07-28）](https://www.mlit.go.jp/common/001321880.pdf)：別紙5に1TDPC/1TDFGと各グレード、別紙7/8に3CDPC/3CDFHとセダン・ヴァリアントのグレード。
- [VW・2021年パサート国内発表](https://prtimes.jp/main/html/rd/p/000000014.000058804.html)：TSI/TDIの各グレードとVariantのR-Lineを確認。
- [VW・2021年トゥーラン仕様変更](https://prtimes.jp/main/html/rd/p/000000015.000058804.html)：各グレード、室内装備・運転支援・ルーフの確認補助。
- [VW・2015年シャラン国内発表](https://www.volkswagen.co.jp/idhub/content/dam/onehub_pkw/importers/jp/pc/volkswagen/news/2015/001221_web.pdf)：TSI3グレード、全車1.4L新エンジン、スライドドア・シート・ルーフ等。
- [国内届出・シャラン7NCZD](https://www.mlit.go.jp/common/001233538.pdf)：上記2015年以降の国内1.4L型式を補助照合。未照合の別型式へグレードを流用しない。
- [VWパサートヴァリアント諸元](https://www.volkswagen.co.jp/idhub/content/dam/onehub_pkw/importers/jp/pc/catalog/equipment_pdf/passatvariant/passatvariant_equipment_catalog.pdf)：3CDPC/3CDFHとグレードの対応を補助確認。

## 画像

組み込みimage_genで6枚。FVは左向きの屋外、LINEは別色・別背景・後方。パサートはFVヴァリアント・LINEセダンとし車種内の形も変える。実績欄へ画像を入れず、FV/LINE付近にAI注記。上下フェードを維持。プロンプトと保存先は同日prompts JSON参照。

## 確認完了

- 1440/375/320pxの9画面で横スクロール・見出し/型式ボタンのはみ出し・FV不良なし。全6画像を目視し車種・色・構図・余白を確認。LINE画像3件とも読み込み成功、containで車体全体を表示。
- 全3フォームで未入力の4項目エラー、全型式のグレード連動とfallback、確認画面の型式、模擬送信後の完了表示を確認。送信データも一致。本番送信0件。
- preview/productionビルド成功。下書きはnoindex付きで、本番HTML・サイトマップに含まれない。既存1751ファイルは作業前とバイト単位で一致。
