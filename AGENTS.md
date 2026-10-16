# Bimport サイト：作業ルール（Codex など AI エージェント向け）

Bimport（輸入車買取）の車種別買取LPサイト。Eleventy で静的サイトを作り、GitHub の `main` へのマージで GitHub Actions「Deploy B import LP」が本番（https://bimport.jp/）に公開する。
`CLAUDE.md` と同じ内容をもとにしたルールです。詳しい手順は docs を正とする。

## 必ず読むもの
- [docs/vehicle-lp-workflow.md](docs/vehicle-lp-workflow.md)：車種LPの制作・確認・公開の運用ルール（最重要）
- [docs/vehicle-lp.md](docs/vehicle-lp.md)：技術仕様（車種データの項目・テンプレート）
- [docs/vehicle-template.json](docs/vehicle-template.json)：車種データのひな形
- [docs/image-generation.md](docs/image-generation.md)：FV画像・実績写真の作り方

## 基本ルール
- 作業を始める前に、必ず GitHub の最新の `main` を取り込む（`git fetch origin main` → 最新の `main` から作業ブランチを作る）。手元に未コミットの変更があれば消さずにユーザーに確認する。
- 「○○の買取LPを作って」程度の依頼でも、運用ルールに従って `"draft": true` の下書き完成まで自分で進める。確認質問は、事実情報が不足していて推測すると危険な場合だけ。
- 公開（`"draft": false`・PR・マージ）は、ユーザーが「公開して」と言ってから。
- トップページ・プライバシーポリシー・公開中の車種LPに意図しない変更を入れない。共通テンプレート・CSS・JSを変えたら、既存ページのビルド結果が変わらないことを確認する。
- ブランド表記は「Bimport」。
- ビルド：`npm run build`（本番）／`npm run build:preview`（下書きも含めた確認用）。

## 事実・数字
- 買取価格・年式・走行距離・地域・他社との差額・Google評価点・口コミ件数などの実績の数字は**捏造しない**。準備表と出品票の内容だけを使う。
- 買取金額は**万円**で表示（`cases[].price` は万円の数、`priceUnit` は `"万円"`。端数は `46.5` の形）。
- 実績カードの装備（details）は、準備表でユーザーが書いた内容をそのまま使う（勝手に足したり削ったりしない）。
- フォームのグレードは、**国内で販売されたことを資料で確認できたものだけ**並べる。確認できないものは並べず「その他・わからない」で受ける。
- 世代・型式のボタンの表記は短く（例：「JL」「F40」「G20/G21」）。スマホ320pxでボタンからはみ出さないこと。

## 表示のルール
- 買取実績が2件以上の車種は、横にスライドするパネル表示（共通テンプレートで自動）。
- LINE写真査定用の写真は、その車種の実績写真（加工済み）から人気の仕様・色の1枚を使う。
- 確認は PC 1440px・スマホ 375px・320px で、横スクロールなし・画像切れなし・文字のはみ出しなし。

## 準備表（車種・車両のデータ）
- ユーザーのMacの `~/Desktop/Bimport Google投稿/準備表データ/`（CSV・JSON・画像）が正。車体番号・未公開の金額を含むため、**リポジトリ（公開）には入れない**。
- 出品票：`~/Desktop/Bimport Google投稿/未処理/`、実車の正面写真：`~/Desktop/Bimport Google投稿/正面写真/`。

## 秘密情報・フォーム送信
- 通知先メールアドレスなどの秘密情報を、リポジトリや公開HTMLに書かない（GASのスクリプトプロパティで管理）。
- 本番の査定フォーム（GAS）への送信は、ユーザーが承認した**公開時の確認の1件だけ**。二重送信・再送はしない。
- テスト送信は `node scripts/send-production-test.mjs <slug>`（確認）→ `--send`（1回だけ）。トークンはMacのキーチェーン（サービス名 `bimport-test-submit-token`）にだけ置き、表示・リポジトリ・URLに書かない。応答が `{"ok":true,"test":true}` なら成功。`test_cooldown` が返ったら時間を空けて、ユーザーに確認してから1回だけ送り直す。

## 作業中の下書き（2026-10-16 時点）
GitHub に push 済みのブランチ（未マージ・`draft: true`）：
- `claude/lp-drafts-batch`：23車種（BMW M5・M6・X1・X3・X4・X5・X6・X7・Z4、アルピナ B3、MINI、アウディ A7・Q3・Q5・Q7・Q8・S5スポーツバック・SQ5・e-tronスポーツバック、アバルト 500e、アルファロメオ ステルヴィオ、オペル アストラ、メルセデス・ベンツ Sクラス）
- `claude/bmw-8-series-lp`：BMW 8シリーズ
- `claude/bmw-m3-lp`：BMW M3

公開前に、車種ごとにグレードの裏付けを確認すること（上の「事実・数字」）。
