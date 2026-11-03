# BMW・ランドローバー・ポルシェ：実績未掲載版43車種

2026-11-03、ユーザー依頼でジープと同じ構成の下書きを制作。BMW27車種、ランドローバー5車種、ポルシェ11車種。すべて draft:true、cases:[]。公開はまだ承認されていない。

一覧の「国内カタログ」枠で専用公開URLがない車種を対象とした。旧車・別名確認枠の候補を重複追加しない。ボクスターは既存718とは別の歴代モデル向け。買取履歴がないとは断定せず、このページでは現在未掲載と記載する。

|メーカー|車種|下書きURL|
|---|---|---|
|BMW|2002シリーズ|`/bmw-2002/`|
|BMW|4シリーズ|`/bmw-4-series/`|
|BMW|5シリーズ|`/bmw-5-series/`|
|BMW|M1|`/bmw-m1/`|
|BMW|M2|`/bmw-m2/`|
|BMW|M4|`/bmw-m4/`|
|BMW|M8|`/bmw-m8/`|
|BMW|X2|`/bmw-x2/`|
|BMW|X3M|`/bmw-x3-m/`|
|BMW|X4M|`/bmw-x4-m/`|
|BMW|X5M|`/bmw-x5-m/`|
|BMW|X6M|`/bmw-x6-m/`|
|BMW|XM|`/bmw-xm/`|
|BMW|Z1|`/bmw-z1/`|
|BMW|Z3|`/bmw-z3/`|
|BMW|Z3M|`/bmw-z3-m/`|
|BMW|Z4M|`/bmw-z4-m/`|
|BMW|Z8|`/bmw-z8/`|
|BMW|i3|`/bmw-i3/`|
|BMW|i4|`/bmw-i4/`|
|BMW|i5|`/bmw-i5/`|
|BMW|i7|`/bmw-i7/`|
|BMW|i8|`/bmw-i8/`|
|BMW|iX|`/bmw-ix/`|
|BMW|iX1|`/bmw-ix1/`|
|BMW|iX2|`/bmw-ix2/`|
|BMW|iX3|`/bmw-ix3/`|
|ポルシェ|356|`/porsche-356/`|
|ポルシェ|912|`/porsche-912/`|
|ポルシェ|914|`/porsche-914/`|
|ポルシェ|918|`/porsche-918/`|
|ポルシェ|924|`/porsche-924/`|
|ポルシェ|928|`/porsche-928/`|
|ポルシェ|944|`/porsche-944/`|
|ポルシェ|959|`/porsche-959/`|
|ポルシェ|968|`/porsche-968/`|
|ポルシェ|カレラGT|`/porsche-carrera-gt/`|
|ポルシェ|ボクスター|`/porsche-boxster/`|
|ランドローバー|ディスカバリー|`/land-rover-discovery/`|
|ランドローバー|ディスカバリースポーツ|`/land-rover-discovery-sport/`|
|ランドローバー|フリーランダー|`/land-rover-freelander/`|
|ランドローバー|レンジローバーイヴォーク|`/land-rover-range-rover-evoque/`|
|ランドローバー|レンジローバーヴェラール|`/land-rover-range-rover-velar/`|

## 画像・デザイン

組み込みimage_genで1画像ずつ計86枚生成。FVは前方斜め・左向き、LINE用は別の色・場所の後方斜め。両方にAI生成注記を表示し、実績欄に生成画像は置かない。FVは従来同様の上下の透過グラデーションで背景になじませる。

保存先は `src/assets/images/<slug>/hero-ai-1536.jpg` と `line-image-ai-1536.jpg`。1536px・1000px WebPも保存。[全プロンプト・保存先](bmw-landrover-porsche-image-prompts-2026-11-03.json)。元画像はCodexのgenerated_images内に保持。3メーカーのテーマCSSを新規ファイルに隔離し、公開中の車種には適用しない。

## グレードと参照資料

国内メーカー資料・正規販売店・国内の発表記事で確認できた25車種に選択肢を設定。[グレードの根拠](bmw-landrover-porsche-grade-proof-2026-11-03.json)。未確認の旧車・希少車など18車種は海外グレードを流用せず「その他・わからない」で受ける。未収載の仕様も同じ項目で受ける。画像は特定年式の正確な仕様を保証する実車写真ではなく車種イメージ。

- [BMW Japan モデル一覧](https://www.bmw.co.jp/ja/all-models.html)
- [BMW Group Classic](https://www.bmwgroup-classic.com/en/models/bmw-classics.html)
- [BMW Z4ボディとMモデル識別](https://www.bmwgroup-classic.com/en/models/bmw-classics/product-description-page.ad-1307-1.bmw-z4-e85-e86.html)
- [Porsche Classicモデル一覧](https://www.porsche.com/usa/accessoriesandservice/classic/models/)
- [Land Rover公式のモデル識別](https://accessories-instructions.landrover.com/jaJPN)

海外の歴史資料はモデル識別の補助だけに使い、国内販売グレードの根拠には使わない。

## 確認

- プレビュー・本番ビルド成功。43車種×1440・375・320pxの129画面で横スクロール・見出しやボタンのはみ出しなし。i8のボタンは狭い画面向けに「オープン」と短縮。
- 全43車種で必須入力エラー・分類とグレードの連動・確認画面・完了画面をMac内の模擬サーバーで確認。本番GASへの送信は0件。
- 生成画像86枚のJPEG・WebP全形式を検証。下書きはnoindex付き。本番HTML・サイトマップには含めない。
- 公開中133車種、トップ、プライバシー、共通アセット、サイトマップなど既存ファイルは開始時と一致。
