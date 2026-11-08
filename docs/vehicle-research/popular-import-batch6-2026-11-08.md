# 実績未掲載版6車種（2026-11-08）

ユーザー指定「あと6つ」により6車種で区切る。draft:true、cases:[]、実績未掲載案内と型式選択。公開未承認。CSV車種/モデル欄に該当する掲載対象実績なし。308に一致した数字は他車のデータであり採用しない。

|車種|slug|型式と一部の国内確認済みグレード|
|---|---|---|
|プジョー308|peugeot-308|P51：Allure/GT BlueHDi/GT HYBRID、P52：SW Allure/SW GT BlueHDi/SW GT HYBRID|
|プジョー508|peugeot-508|R85：GT/GT BlueHDi/GT HYBRIDと各SW|
|シトロエン ベルランゴ|citroen-berlingo|K9：FEEL/SHINE/SHINE XTR PACK|
|ルノー ルーテシア|renault-lutecia|BJA：ゼン/インテンス/インテンス テックパック|
|ルノー キャプチャー|renault-captur|HJB：インテンス/インテンス テックパック|
|アルファロメオ ジュリア|alfa-romeo-giulia|95220：2.0 TURBO VELOCE、95229：2.9 V6 BI-TURBO QUADRIFOGLIO|

全世代・全仕様を網羅しない。旧型・新型・ハイブリッドなど未照合のものは「わからない」「その他・わからない」で受ける。上記グレードを未確認の別型式へ流用しない。型式は共通部分を短縮した旨をFAQに説明する。

## 国内根拠

- [308の2022年国内発表](https://www.stellantis.jp/news/20220413-new-peugeot-308)：HB/SWと各グレード表を確認。
- [国内型式・308](https://www.mlit.go.jp/en/jidosha/content/001760025.pdf)：P51/P52各ガソリン・ディーゼル・PHEVを照合。
- [メーカーの型式識別補助](https://public.servicebox.peugeot.com/APddb/Battery_Report_20241203_Peugeot.pdf)：308 SW=P52。海外向けグレードを流用しない。
- [国土交通省・国内型式グレード表](https://www.mlit.go.jp/common/001321882.pdf)：508のR85各GTとSW、ベルランゴのK9PYH01各FEEL/SHINE/XTR PACKを確認。
- [ベルランゴ国内発表](https://www.stellantis.jp/hubfs/release/20200826_CITROEN_BERLINGO/20200826_CITROEN_BERLINGO_Final.pdf)：室内収納・ドア等の確認補助。
- [ルノー・ジャポンのルーテシア国内発表](https://prtimes.jp/main/html/rd/p/000000098.000019201.html)：ゼン/インテンス/テックパック。
- [同キャプチャー国内発表](https://prtimes.jp/main/html/rd/p/000000114.000019201.html)：インテンス/テックパック。
- [国内型式・ルノー](https://www.mlit.go.jp/jidosha/content/001391322.pdf)：BJAH5H/HJBH5H。今回はガソリンの国内販売済みグレードのみ。
- [ジュリアの国内発表と諸元](https://newsroom.groupepsajapan.jp/hubfs/PR_20210628_Alfa-Romeo-Stelvio_Veloce_Giulia_FCAJ/PR_20210628_Alfa-Romeo-Stelvio_Veloce_Giulia_FCAJ.pdf)：Veloce/Quadrifoglio。
- [Veloceの国内型式](https://www.stellantis.jp/hubfs/release/20250724_Alfa_Romeo_Giulia_SPRINT/20250724_Alfa_Romeo_Giulia_SPRINT.pdf)と[95220/95229の国内届出](https://www.mlit.go.jp/en/jidosha/content/001991024.pdf)を照合。

## 画像

imagegenスキル・組み込みimage_genで各2枚、計12枚。FVは屋外の左前、LINEは別色・別場所の後方。308/508はLINE画像をSWとし、車種内の形の違いも付ける。AI注記を各画像付近に表示し、実績欄へ画像や架空の実績を入れない。プロンプトと保存先は同日prompts JSONを参照。

## 検証完了

- 6車種×1440/375/320pxの18画面で横スクロール、見出し・型式ボタンのはみ出し、FV画像不良なし。
- 全12生成画像の車種・色・形状・余白・背景の違いを目視確認。LINE画像は6車種とも読み込み成功、containで車体全体を表示。FV上下のフェードを維持。
- 全6フォームの必須4項目エラー、全型式のグレード連動とfallback、確認画面の型式、模擬送信後の完了表示を確認。送信データも照合。本番送信0件。
- preview/productionビルド成功。canonical/noindexと、本番HTML・サイトマップに下書きが含まれないことを確認。既存1709ファイルは作業前とバイト単位で一致。
