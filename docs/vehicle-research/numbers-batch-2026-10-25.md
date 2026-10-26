# Numbers入力分のLP下書き（2026-10-25）

最新のNumbers表を管理IDでCSVに照合し、新規入力の10車種・20台を反映。全車種 `draft: true`。公開中の31車種・共通テンプレートは変更しない。

2026-10-27：ユーザーが10車種の公開を承認。`draft: false`、サイトマップの更新日を2026-10-27として公開へ移行。10ページのcanonical・og:url・サイトマップが一致し、noindexが除去されたことを確認。既存のページと資産はサイトマップ以外すべてバイト一致。原稿・実績・写真・共通フォームは確認済みの下書きを維持。

| 車種 | slug | 実績数 |
|---|---|---:|
| キャデラック XT4 | cadillac-xt4 | 1 |
| キャデラック エスカレード | cadillac-escalade | 1 |
| クライスラー 300 | chrysler-300 | 1 |
| シトロエン C6 | citroen-c6 | 1 |
| シボレー カマロ | chevrolet-camaro | 3 |
| シボレー コルベット | chevrolet-corvette | 2 |
| ジャガー Fタイプ | jaguar-f-type | 3 |
| ジャガー XE | jaguar-xe | 1 |
| ジープ グランドチェロキー | jeep-grand-cherokee | 6 |
| ジープ レネゲード | jeep-renegade | 1 |

## 事実確認

- 年式・走行距離・登録地名は元の出品票を目視照合。価格と買取時期は最新Numbersの入力を使用。装備欄はCSVの入力を維持。
- 登録ナンバー空欄だった300・C5コルベット・グランドチェロキー アルティテュードの地域は、ユーザーが東京・神奈川・岡山と回答（2026-10-25）。
- グランドチェロキーLの富士山ナンバーは、ユーザーが静岡と確認（2026-10-25）。
- エスカレードは出品票のメーター改ざん車の注記を確認。ユーザーの承認に従い「走行距離不明（メーター改ざん車）」と表示し、メーター表示を実走行距離として扱わない。
- Fタイプの3.0クーペはグレード名が未記載のため推測せず省略。グランドチェロキーLの実績はLと明記。
- 写真は実車の正面写真を内蔵画像編集で白壁化。生成車両で実績を代用しない。壁に文字・ロゴなし、ナンバー無地化。原本・確認情報はMac内の非公開準備表フォルダに保存。

## フォームの国内仕様の裏付け

資料で国内販売を確認したグレードだけを並べる。年式・世代別の連動は設けず、確認範囲外の旧仕様・並行輸入仕様は「その他・わからない」、限定車は「限定車・特別仕様車」で受ける。

- XT4：プレミアム・プラチナム・スポーツ。[GM Japan 2022-01-20](https://news.cadillacjapan.com/jp/cadillac/newsroom.detail.html/Pages/news/jp/ja/2022/jan/0120_Cadillac_CT5-XT4.html)
- エスカレード：プレミアム・プラチナム・スポーツ。[GM Japan 2024-01-22](https://news.cadillacjapan.com/jp/cadillac/newsroom.detail.html/Pages/news/jp/ja/2024/jan/0122_Cadillac.html)。ESVは正規グレードとしてフォームに追加しない。
- 300：300S・SRT8。[FCA Japan公式販売資料 2017-04](https://chrysler-jeep.jp/_image/co/10009/103/00013_1.pdf)
- C6：エクスクルーシブ。[シトロエン日本公式カタログ](https://web.citroen.jp/brand/gallery/catalog/pdf/c6/citroen_c6.pdf)
- カマロ：LT RS・SS・コンバーチブル。[GM Japan 2022-05-26](https://news.chevroletjapan.com/jp/chevrolet/newsroom.detail.html/Pages/news/jp/ja/2022/May/0526_Camaro.html)。旧SS RSは[GM Japan 2014-01-07](https://news.chevroletjapan.com/jp/chevrolet/newsroom.detail.html/Pages/news/jp/ja/2014/Jan/0107_GMJChev.html)。
- コルベット：2LT・3LT・コンバーチブル・Z06。[GM Japan 2024-12-19](https://news.chevroletjapan.com/jp/chevrolet/newsroom.detail.html/Pages/news/jp/ja/2024/dec/1219_Chevrolet.html)。Z51は[GM Japan 2014-11-04](https://news.chevroletjapan.com/jp/chevrolet/newsroom.detail.html/Pages/news/jp/ja/2014/Nov/1104_GMJChev.html)。
- Fタイプ：R-DYNAMIC・75・R75。[ジャガー日本公式モデル一覧](https://www.jaguar.com/ja-jp/jdx/jaguar-range/f-type/models/index.html)。旧仕様のグレードはその他で受ける。
- XE：ピュア・プレステージ・Rスポーツ・ポートフォリオ・S。[日本向け2019モデル仕様書](https://www.jaguar.co.jp/content/dam/jdx/pdfs/jp/XE_19MY_Option-Pricing.pdf)。R-DYNAMIC SE・300 SPORTは[日本公式XE](https://www.jaguar.com/ja-jp/jdx/jaguar-range/xe/index.html)。
- グランドチェロキー：ラレード・リミテッドは[Jeep日本公式2020モデル仕様書](https://www.jeep-japan.com/content/dam/cross-regional/apac/jeep/ja_jp/spec/pdf/MY20_Grand%20Cherokee_BG_1026.pdf)。Lリミテッド・Lサミット リザーブは[Stellantis 2021-12-13](https://www.stellantis.jp/news/pr_20211213_jeep_grand_cherokee_l_final-1)。4xeの2仕様は[Stellantis 2022-10-24仕様書](https://www.stellantis.jp/hubfs/release/20221024_Jeep_Grand_Cherokee/PR_20221024_Jeep%20Grand%20Cherokee.final.pdf)。
- レネゲード：ロンジチュード・リミテッド・トレイルホーク。[Jeep日本公式2017仕様書](https://www.jeep-japan.com/content/dam/cross-regional/apac/jeep/ja_jp/special-models/renegade-safety-edition/pdf/Renegade_Safety_Edition_SpecSheet_BU_Safty_Edition.pdf)

## 画像編集の共通指示

内蔵image_genで実車ごとに編集。背景と床だけを、ロゴ・文字・看板・装飾のない白壁のショールームへ変更。光沢床と自然な影・反射、ダウンライト、左奥の植物と窓。車体の色・形・ホイール・ライト・グリル・キズや損傷、向きとアングルを維持し、修理や美化をしない。乗員と車内の物を除去、ナンバーを無地の白にする。車体全体と余白を確保。実績は4:3の枠に車体を切らず配置、LINEは加工済みの同車種実績から1枚を使用。

## 検証

`npm run build:preview` とPC1440px・スマホ375px・320pxの計30パターンで、横スクロール・画像読み込み・見出しとボタンのはみ出し・JSエラー・noindex・canonicalを確認。全グレード選択、未入力エラー、フォーム3STEPと完了画面、メーカー・車種の送信値を検証した。本番GASへは送信せず、送信先をブラウザ内の模擬応答へ置き換えた。

クリーンな本番ビルドで、新規10ページとサイトマップへの掲載がないこと、作業前の275ファイル（公開ページ・共通資産・サイトマップなど）が全件バイト一致することを確認。確認後は下書きを表示できるpreviewビルドに戻す。
