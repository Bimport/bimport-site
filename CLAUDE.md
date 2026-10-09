# Bimport サイト：作業ルール

- **作業を始める前に、必ずGitHubの最新の `main` を取り込む**（`git fetch origin main` → 最新の `main` から作業ブランチを作る、または `main` を取り込む）。
  別のチャット・別のパソコンで公開した変更を含めた状態から始めるため。手元に未コミットの変更がある場合は、消さずにユーザーに確認する。
- 車種別買取LPの制作・確認・公開は、必ず [docs/vehicle-lp-workflow.md](docs/vehicle-lp-workflow.md) の運用ルールに従う。
  技術仕様は [docs/vehicle-lp.md](docs/vehicle-lp.md)、車種データのひな形は [docs/vehicle-template.json](docs/vehicle-template.json)。
- 「○○の買取LPを作って」程度の依頼でも、上記ルールに従って `"draft": true` の下書き完成まで自分で進める。
  確認質問は、事実情報が不足していて推測すると危険な場合だけにする。
- 買取価格・年式・走行距離・地域・他社との差額・Google評価点・口コミ件数などの実績の数字は、捏造しない。
- 通知先メールアドレスなどの秘密情報を、リポジトリや公開HTMLに書かない（GASのスクリプトプロパティで管理）。
- 本番の査定フォーム（GAS）への送信は、ユーザーが承認した公開時の確認の1件だけ。二重送信・再送はしない。
  テスト送信は `scripts/send-production-test.mjs` で `testToken` を付けて送り、通知は個人のアドレス（GASの TEST_NOTIFY_TO）にだけ届き、件名に「【テスト送信】」が付く（トークンはキーチェーンにだけ置き、リポジトリやURLに書かない）。
- トップページ・プライバシーポリシー・公開中の車種LPに意図しない変更を入れない。
- ブランド表記は「Bimport」。
- ビルド：`npm run build`（本番）／`npm run build:preview`（下書きも含めた確認用）。
