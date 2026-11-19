# トップページ：写真とモーションの確認案

2026-11-15。ユーザー指定の参考サイト https://bimport-design-study-1114.z156833k.chatgpt.site/ を参考に、Bimportのトップページだけを変更。公開は未承認。

- 外観／内装の2場面を8秒ごとに切り替え。写真の移動、ズーム、縦パネルの転換。手動選択後は自動切替を止める。
- 横に流れる英字、スクロール連動の背景文字、実績写真のワイプ、内装とホイールの重なり、段階表示。
- 相談手順はPCの番号・円形目盛りと連動。スマホは縦のステップ表示。
- フォーム、価格・実績データ、車種LPのソースは変更しない。動きの停止ボタン、OSの動きを減らす設定に対応。
- プレビューは http://localhost:8094/ 。ソースは codex/home-motion-preview ブランチ。

## 追加画像

内蔵 image_gen を使用。実際の買取車両ではないため、画面にAI生成のイメージと明記。実績カードには使用しない。

- `src/assets/images/home/interior-motion-1536.jpg`、`interior-motion-1000.webp`、`interior-motion-1536.webp`
- `src/assets/images/home/detail-motion-1536.jpg`、`detail-motion-1000.webp`、`detail-motion-1536.webp`
- 屋外写真は既存の `src/assets/images/bmw-8-series/hero-*` を使用。

### 内装画像の生成指示

Use case: ads-marketing. Asset type: editorial photograph for Bimport, a premium imported-car buying website. Generate ONE landscape 3:2 photorealistic automotive advertising photo, not a collage. Subject: a beautiful modern European grand touring car interior, rich cognac leather passenger seat and door, contrast stitching, brushed aluminium and dark open-pore wood center console. View from open passenger door slightly above seat, wide enough to see both front seats but no instrument text or branded steering wheel. Soft golden late-afternoon natural light raking across the leather, dark forest green foliage and soft distant light through windows. Understated premium editorial photography, realistic leather grain, understated cinematic charcoal shadows, warm highlights, no excessively orange filter. No people, no writing, no logos, no signage, no watermark. This will be labeled an AI concept image, not an actual customer car. Balanced composition that works in both landscape and portrait CSS crops, main seat centered. Deliver only photograph.

### ディテール画像の生成指示

Use case: ads-marketing. Asset type: detail photograph for a premium imported-car buying website. Generate ONE landscape 3:2 photorealistic automotive editorial photograph, not a collage. Close three-quarter view of a dark graphite metallic European luxury sports coupe's front wheel and fender, finely machined silver multi-spoke alloy wheel, clean black tire, a hint of headlight at left edge. Car on dark smooth stone at blue hour, soft golden architectural reflections running over paint, naturally detailed metal and paint. Exquisite but realistic, sophisticated and calm, crisp wheel details with shallow depth of field behind, expensive automotive magazine style. No visible badge or brand logo, no license plate, no letters, no numbers, no text, no people or watermark. Wheel centered in composition with breathing space around all tire edges. This is a conceptual image and will not be used as a purchase case. Deliver only photograph.

## 確認記録

- `npm run build -- --output=/tmp/bimport-home-motion-dist` 成功。JavaScript構文・Git差分の空白チェック成功。
- 変更前の生成出力352件と比較し、変更はトップのindex.htmlのみ。他351件（車種LP、プライバシー、サイトマップ、robotsなど）は同一。
- 実測1440px / 375px / 320pxでページ幅のはみ出しなし。スマホメニュー、実績の次へ、写真の手動切替、動きの停止を確認。
- フォームは未入力エラー、BMWの連動車種、STEP 1→2→3の確認画面までを確認。実送信なし。ブラウザのJSエラーなし。
- OSの動きを減らす設定にはCSS・JSで対応（OS設定を切り替えた実機確認は未実施）。
- 確認用サーバーは既存の8094番を継続使用。公開、PR作成、通知送信は未実施。

## グループ店舗の4案と名古屋店追加（2026-11-16）

ユーザー指定で、既存のトップページ案と4つの比較案にオートディーラー名古屋を追加。所在地は公式会社概要の愛知県名古屋市東区、開店時期はユーザー提供の2026年11月を使用。正式開業日の断定はしていない。

- 比較URL： http://localhost:8094/group-stores-review/
- ソース：`design-previews/group-stores/`。Eleventyの`src/`外に保存し、本番ビルドには出力しない。ローカル確認用出力へ手動コピーする。
- A：写真が大きく切り替わる。6.5秒の自動切り替え、手動選択後は自動停止。
- B：横スクロールの店舗ギャラリー。段違いの写真、背景文字、写真のズーム。
- C：日本地図。線が描かれ、店舗選択に応じて地域が光る。2026-11-16の追加指定で、地図の左上に店舗写真が浮かぶ案へ更新。
- D：写真なしの大きな地名。スクロール表示、文字移動、ラインの変化。
- 全案に名古屋を含めた主な7店舗を表示。グループ全店数を7店と断定しない。
- 動きを止めるボタン、OSの動きを減らす設定、キーボードでのタブ操作・ギャラリー移動に対応。
- 名古屋・福島・岡山の写真は未確認と明示。別店舗の写真や生成画像による代用はしない。

### 出典

- 店舗情報： https://auto-dealer.jp/company/
- 東京： https://www.goo-net.com/usedcar_shop/0509313/detail.html （画像： https://picture1.goo-net.com/shop/050/0509313/L/0509313_Det_1.jpg ）
- 春日井B auto： https://www.goo-net.com/usedcar_shop/0207072/detail.html （画像： https://picture1.goo-net.com/shop/020/0207072/L/0207072_Det_1.jpg ）
- 岐阜セントラル： https://www.goo-net.com/usedcar_shop/0209111/detail.html （画像： https://picture1.goo-net.com/shop/020/0209111/L/0209111_Det_1.jpg ）
- 福岡： https://www.goo-net.com/usedcar_shop/9510082/detail.html （画像： https://picture1.goo-net.com/shop/951/9510082/L/9510082_Det_3.jpg ）
- 地図輪郭：Natural Earth（public domain）、 https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson 。日本の輪郭を簡略表示、店舗エリアの点は概略位置。
- 名古屋のカーセンサー掲載には旧セントラル店の文言・画像が混在しているため、その写真は不採用。

### 確認

- 本番ビルド成功。変更前352件と比較し、index.htmlのみ変更。他351件は同一。
- PC1440pxで4案を表示確認。A店舗切替・B次へ・C名古屋選択・D名古屋選択が動作。
- 375pxでD、320pxでA/Dを実機ブラウザ確認。320pxのFUKUSHIMA文字切れを修正し、再確認で解消。
- 中断でブラウザ操作ツールが利用不可になったため、B/Cのスマホ最終確認、Aの店舗名折り返しの最終調整後の再撮影は未実施。公開前に補完すること。
- 公開、PR作成、フォーム送信は未実施。

再表示：`npm run build -- --output=/tmp/bimport-home-motion-dist` のあと、`node scripts/prepare-group-stores-preview.mjs` を実行し、8094番の静的サーバーで開く。JS・CSSの変更後もこのスクリプトを使い、内容のハッシュ付きURLに更新する。

### C案：拠点の写真をホバー表示（2026-11-16）

- ユーザー指定：拠点にカーソルを合わせると、地図左上の余白に写真が浮かぶ。
- 右側の7店舗と地図の地域点の両方に対応。写真はフェード・せり上がり・わずかな傾きで表示し、店舗を変えるとクロスフェードする。
- 地図の愛知の点は選択済みの愛知店舗を表示（初回はB auto）。名古屋は店舗一覧から独立して選択できる。
- クリック／タップで保持。閉じるボタンとEscapeで消せる。キーボードのフォーカスでも表示し、地図の点はEnter／Spaceで選択できる。
- モバイルは地図の上に余白を確保し、写真が地図の点に重ならない配置。店舗一覧をタップし写真が画面外にある場合は写真まで戻す。
- 4店舗の既存写真を使用。名古屋・福島・岡山は引き続き写真確認中の表示。
- 構文、参照ID、画像ファイル、HTTP 200を確認。今回はブラウザ操作ツールが利用不可のため、hoverの実画面確認と320px／375px／1440pxでの再確認は未実施。公開前に補完する。
- 変更は比較ページのみ。本番用src/は今回変更していない。公開未承認。

### ホバー写真が出ないとの報告への修正（2026-11-16）

- HTTPログで、新しいHTMLを取得した際もpreview.jsが再取得されていないことを確認。古いJSがキャッシュで再利用されていた可能性が高い。ブラウザ内の実際の読み込み内容はツール未提供のため未取得。
- CSS・店舗データ・JSのURLに内容ハッシュを付与。以後の変更でも忘れず更新するため、確認用ファイルの準備スクリプトを追加。
- 一時フォルダに隔離したLinkeDOMで実際のHTML／JSを実行。東京リストのホバー、岐阜地図点のホバー、名古屋のクリック、閉じる操作を検証し、期待した写真・表示状態に切り替わることを確認。
- HTTPでハッシュ付きURLの実体が各ソースと一致することを確認。実画面の確認は引き続き未実施。

### 接続復旧と実画面確認（2026-11-16）

- 8094番に待受プロセスがなく、接続拒否になっていた。静的サーバーを127.0.0.1限定・独立プロセスで再起動。ログは`/tmp/bimport-home-preview-server.log`、PIDは`/tmp/bimport-home-preview-server.pid`。
- CUAが再利用可能になり、ハッシュ付きの修正版を実際のブラウザで再読み込み。東京・岐阜・福岡の写真、地図点・店舗一覧からの選択、閉じる操作を確認。
- 小さいデスクトップパネルもスマホ同様の縦配置になるため、写真が画面外のときはクリックでも写真位置へ移動するよう修正。移動中に別店舗のホバーが割り込まないよう抑制。
- 実測1440px・375px・320pxで横はみ出しなし。375px・320pxでは選択後の写真が画面内へ戻ることを確認。写真の自然幅640pxを確認し、読み込みエラーなし。
- ホバーイベントは前項のDOMテスト、ブラウザでは選択後の実表示を確認。公開はしていない。

### C案のフェード調整（2026-11-16）

- ユーザー指定の「フェードイン、フェードアウトで浮かび上がる感じ」へ変更。カードの移動・回転・拡大、画像ズームを除去。
- 表示は0.7秒、非表示は0.55秒で透明度を変える。写真切り替えは0.5秒のクロスフェード。
- 拠点からカーソルが離れた時点で非表示を予約（140ms）。隣の拠点や写真へ移った場合はキャンセルし、細かい移動で点滅しないようにした。クリック／タップ固定、キーボード表示、閉じるボタンは維持。
- ブラウザで表示途中のopacity 0.616672→1、非表示途中のopacity 0.0598276を確認。transformはnone。動きを減らす設定は従来のCSSで対応。
- 確認用ページだけの変更。本番未反映。

## C案をトップページへ採用（2026-11-16）

ユーザーが「Cがいい」と選択したため、トップページのグループ店舗紹介にC案を統合。公開指示ではないため、引き続きローカル確認のみ。

- 最新main `fa62b86`（第16弾40車種公開）を作業ブランチへマージし、公開済みLPを保持。
- `src/_includes/home/group-stores.njk`、`src/_data/homeNetwork.json`、トップ専用の`home-network.css`・`home-network.js`を追加。
- 7店舗の名称・地域・開店時期はHTMLに静的出力。写真と地図のインタラクションのみJSで追加。
- 写真は`src/assets/images/home/group-stores/`。名古屋・福島・岡山は写真確認中の表示を維持。
- 地図の描画開始と点滅を画面内表示に連動させた。既存トップページの「動きを停止」・動きを減らす設定に対応。
- 既存の会社概要リンクを保持。個別のB autoサイトリンクは追加していない。
- ビルド成功。統合前392出力のうちindex.htmlだけ変更、他391出力は同一。全トップ画像・CSS・JSの参照先が存在。
- 実測1440px／375px／320pxで横はみ出しなし。東京・福岡の写真、名古屋のプレースホルダー、閉じる操作、全体の動き停止／再開をブラウザで確認。375pxで写真の画面内への移動を確認、320pxで長い店舗名の文字切れなし。
- ブラウザのJavaScriptエラーなし。実送信なし。
- 確認URL： http://localhost:8094/?v=network-c#group-stores 。4案の比較ページも引き続き保持。

## 5台の輸入車スライド（2026-11-17）

ユーザーが提案した5台を承認。「YOUR NEXT CHAPTER.」の写真を、911カレラ → Gクラス → X1 → MINIクーパー3ドア → ゴルフの順で切り替えるギャラリーに変更。公開指示ではないためローカル確認のみ。

- 約5秒ごとに1秒のフェードで切り替え。メーカー・車名、01〜05の手動選択、停止／再生ボタンを追加。
- 手動選択・キーボードフォーカス時は自動切り替えを停止。全体の動き停止、OSの動きを減らす設定、別タブ表示中、画面外での停止に対応。JSなしでは先頭の写真を表示。
- シルバーの911と海岸、黒いGクラスと現代建築、白いX1と緑の丘、濃緑のMINIと石畳、青いゴルフと田園。built-in image_genで各1枚、計5枚を新規生成。実績写真ではなく「AI生成の車種イメージ」と明示。
- 指示文全文は`docs/home-journey-image-prompts.json`。原本はMacのCodex generated_images内に保持。サイト用は`src/assets/images/home/journey/`へ保存。640／1000／1536pxのWebPと1536pxのJPEGを用意。
- トップ専用の`home-journey.css`・`home-journey.js`と`home/journey.njk`を追加。フォーム・各車種LPのソースは変更していない。
- 本番ビルド成功。392出力中index.htmlのみ変更、他391出力は同一。全20画像ファイルの存在確認済み。
- 実ブラウザで1440／375／320pxの横はみ出しなし、車体全体・見出し・操作ボタンの収まりを確認。5台すべて読み込み成功。
- 自動切り替えを1周確認、実測間隔は約5.02秒。各切り替えで中間の透明度を確認。手動選択、再生、全体停止の連動を確認。JavaScriptエラーなし。OS設定を変更した実機確認は未実施。
- 確認URL： http://localhost:8094/?v=journey-1#journey 。公開・フォーム送信は未実施。
