# 車種一覧の確認用実装（未公開）

公開中の既存車種LPを探せる `/cars/` の案。車種の追加・価格表・別の査定フォームではない。元データは `src/_data/vehicles/*.json` の公開対象だけ。既存フォームの車種継承・電話必須・LINE/電話の連絡方法、受付先や買取実績を変更しない。

## 既定は無効

`site.catalogEnabled` は **false**。通常ビルドでは一覧を出さず、既存870HTML/robots/sitemapなど1,020比較出力が全bytes一致する。新しいCSS/JS2資産だけが加わる。公開側のデプロイ設定は変更していない。

ローカル確認だけなら `LP_CATALOG_PREVIEW=1 npm run build`。一覧はnoindex/nofollow、GA4タグなし、sitemap追加なし。トップと既存LPのfooterから一覧へ進める。これは検査環境でのみ使い、本番配信しない。

公開の承認後に `site.catalogEnabled=true` とすれば一覧を通常出力し、indexを妨げるmetaを付けず、sitemapへ1URLを追加する。このときトップ＋868LPはfooterの一覧リンクだけを意図的に追加する。広い影響範囲なので、実ブラウザの1440/375/320表示、公開担当との競合・配備先・費用・復旧、会社承認を済ませるまで有効化しない。

## 一覧と絞り込み

メーカーごとのnative detailsと、各車種への通常のaリンクを生成する。JavaScriptなしでも全リンクに到達できる。絞り込みは端末内だけで、検索語をURL・storage・analyticsへ入れず、ネットワーク要求もしない。メーカー/車種、全角英数字・空白などの表記差を揃え、該当0件と条件クリアを案内。条件クリアで元の開閉とフォーカスを戻す。

画像、買取金額、顧客情報、グレード、台数/口コミ/営業時間をコピーしない。新しい画像生成や課金サービスは使わない。氏名等の検索用機能でもない。ブランドの表記は既存データを使い、CITROEN/CITROËNとMERCEDES-AMGの表示は既存homeFormVehiclesの扱いと揃える。

CollectionPage/ItemList/BreadcrumbListのJSON-LDは、画面に並ぶ公開名・URL・順序・件数だけから作る。closing-script等をescapeし、価格・Offer・評価・来店可能住所・営業時間は追加しない。構造化データが正しく生成されることと、Googleの登録/順位/リッチリザルト、AI回答への採用は別である。

## 検証と復旧

`HOME_PREVIEW_HTML=<build先>/index.html node --test tests/*.test.cjs`。既存のanalytics/motion/home検査と、catalogue helper/DOMの検査を使う。DOM検査は画面レイアウトや実機を証明しない。

通常（無効）・ローカル確認・公開想定の出力を比較。変更footerリンクを取り除くと869HTMLが元とbytes一致し、受付/form/既存画像/共通JSは不変。公開想定だけsitemapへ一覧URLを追加。現在の画像比較は疎なsourceで、全既存画像の表示・権利を再確認したものではない。

戻す場合は同じsourceでfalseにしてbuildする。ただし静的ホストが古い `/cars/` を削除するかは公開担当が確認する必要がある。設定を戻すだけで残存ファイルが消えると仮定せず、初回配備前のrelease一式・restore手順を用意する。DNSや現行GAS/LINEは切り替えない。
