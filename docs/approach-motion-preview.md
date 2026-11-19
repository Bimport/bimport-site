# 「査定へのこだわり」動きの確認3案

2026-11-17。ユーザー依頼により、Porscheの写真を大きく見せる表現と、Appleのスクロールによる説明展開を参考に制作。公開未承認。

## ベースと保存先

- 最新 `origin/main` (`fa62b86`) から `codex/approach-motion-three` を作成し、「LP分析と修正」で確認中の `codex/home-motion-preview` (`d31ff7e`) を fast-forward で取り込んだ。
- 作業ツリー：`/private/tmp/bimport-approach-motion-work`
- 原稿：`design-previews/approach-motion/`。Eleventy の入力 `src/` の外に置き、本番ビルドに出力しない。
- 他チャットの作業ファイル、既存ホーム確認案、車種LPは変更していない。

## 確認URL

既存のローカルサーバー（8094、ルート `/private/tmp/bimport-home-motion-dist`）を利用。

- A：<http://localhost:8094/approach-review/?idea=a>
- B：<http://localhost:8094/approach-review/?idea=b>
- C：<http://localhost:8094/approach-review/?idea=c>

ページ上部のA/B/Cでも切り替え可能。ホーム全体の確認案へ戻るリンク付き。

更新したら `node scripts/prepare-approach-motion-preview.mjs` を実行する。コピー先は `approach-review/` のみ。既存ホームのファイルは上書きしない。CSS/JSの内容ハッシュをURLに付ける。

## 3案

| 案 | 動き | ねらい |
| --- | --- | --- |
| A シネマ | 6秒ごとの写真フェード、緩やかなズーム、説明の浮き上がり。下部ボタンで選択すると自動送りを止める | 写真の印象と落ち着き |
| B スクロール | 写真を固定し、スクロールで説明・写真・番号・下線が切り替わる。スマホは写真を上部に残す | 査定を任せる理由を順に読んでもらう |
| C 横ストーリー | PCでは縦スクロールに連動して写真が横に展開。スマホはネイティブ横スクロールと矢印ボタン | 次の写真への興味をつなぐ |

全案に「動きを停止／再生」を用意。`prefers-reduced-motion` では停止状態から開始。Cの停止状態は手動横送りとなり、内容は引き続き読める。通常スクロールやタッチの標準操作を奪うイベント処理は使わない。

3案の説明は既存ホーム `#approach` の「装備」「相場」「同じ担当」の内容を共用。価格・実績・評価等の新しい数値は加えていない。写真は既存のAI画像（内装・ホイール・海沿いの911）を再利用し、イメージ表記を付けた。実際の査定作業・担当者の写真として扱わない。

参考：<https://www.porsche.com/japan/jp/models/taycan/taycan-models/taycan/> / <https://www.apple.com/jp/airpods-pro/>

## 確認結果

- PC 1440×900、スマホ幅375px・320pxで3案をブラウザー確認。ページ全体の横はみ出しなし、画像読み込み・見出し折り返しを確認。
- Aの自動切替、手動選択、停止・再開を確認。
- Bのスクロール連動による写真・番号・見出し切替をPC／スマホで確認。
- CのPCスクロール連動、スマホの次へボタンによる3枚の移動、停止中の手動操作を確認。実機の指によるスワイプは未実施。
- ブラウザーのerror/warnログなし。`node --check design-previews/approach-motion/preview.js` 成功。
- `npm run build` 成功。追加前後の生成物3,068ファイルのSHA-256比較で差分0件。確認ページが本番出力に含まれないことも確認。
- フォームへのリンクは既存確認案の `#estimate`。送信テスト・公開・push・PRは実施していない。

採用案が決まったら、ホームの前後のセクションとつながるよう高さ・余白・CTAを調整して組み込む。公開は別途ユーザー指示後。
