# ジープ10車種：実績未掲載版の下書き

2026-11-02、ユーザー依頼により車種一覧の「ジープ・LPなし」10車種を下書き制作。公開承認はまだ受けていない。すべて `draft: true`、`cases: []`。

| 車種 | 専用URL | フォームの扱い |
|---|---|---|
| CJ-7 | `/jeep-cj-7/` | 国内グレードの裏付け未確認のため「その他・わからない」 |
| アベンジャー | `/jeep-avenger/` | EV：Altitude / Launch Edition、4xe：Upland、限定車・特別仕様車 |
| グラディエーター | `/jeep-gladiator/` | Rubicon、限定車・特別仕様車。並行仕様はその他で受ける |
| グランドチェロキーL | `/jeep-grand-cherokee-l/` | Limited / Summit Reserve、限定車・特別仕様車 |
| グランドワゴニア | `/jeep-grand-wagoneer/` | 旧型・新型を区別。国内グレードを推測しない |
| コマンダー | `/jeep-commander/` | 旧型はその他。現行型はLimited / Longitude / Overland、限定車・特別仕様車 |
| コンパス | `/jeep-compass/` | 従来型：Sport / Longitude / Limited、新型HV：Altitude / Summit / Summit Style Package、限定車・特別仕様車 |
| チェロキー | `/jeep-cherokee/` | KL：Longitude / Limited / Trailhawk、限定車・特別仕様車。旧型はその他 |
| パトリオット | `/jeep-patriot/` | 確実な国内グレード資料を今回は絞り込めなかったため「その他・わからない」 |
| ワゴニア | `/jeep-wagoneer/` | 旧型・新型を区別。国内グレードを推測しない |

## 実績・素材・対象の意味

- 「LPなし」は専用URLの有無。グランドチェロキーLの実績は既存 `/jeep-grand-cherokee/` に掲載済みで、買取履歴がないわけではない。この点はユーザーに報告済み。専用下書きでは「このページでの実績が未掲載」と表示し、既存LPや実績は変更しない。
- CJ-7、ワゴニア、グランドワゴニアは旧車・並行輸入などの世代・販売経路を含む。今回の一覧は国内正規販売の全世代が確認済みという意味ではない。海外のグレード名を日本向けフォームに流用しない。
- 準備表に今回10車種の専用FV・実績写真がないため、写真なしのFVとLINE導線で制作。別車種の写真・公式写真の転載・架空の実績写真は使用しない。素材不足はユーザーに報告済み。
- 数字入りの実績カードを作らず、`casesEmpty` で未掲載案内を表示。後日、確認済み実績を `cases` に入れるとカードが優先される。URLは変更しない。

## 主な確認資料

国内販売・グレードはメーカー国内発表・国内正規ディーラーの資料を使用。歴史ページはモデル識別の資料であり、国内導入グレードの根拠としては使わない。

- CJ-7・旧ワゴニア：[Jeep Japan 1970年代](https://www.jeep-japan.com/history/1970s.html)
- 旧グランドワゴニア・チェロキー：[Jeep Japan 1980年代](https://www.jeep-japan.com/history/1980s.html)
- 近年のモデル識別：[Jeep Japan 2020年代](https://www.jeep-japan.com/history/2020s.html)
- アベンジャーEV：[2024-09-26 国内発売](https://www.stellantis.jp/news/20240926_jeep_avenger)、[主要諸元表（Altitude / Launch Edition）](https://www.stellantis.jp/hubfs/release/20240926_Jeep_Avenger/Jeep_Avenger_final.pdf)
- アベンジャー4xe：[2026年3月 国内仕様表（Full Electric Altitude / 4xe Hybrid Upland）](https://dl.stellantisjapan.jp/data/jeep/spec/Avenger_Web_Spec_sheet_260228.pdf)
- グラディエーター：[2021-11-30 Rubicon国内導入](https://www.stellantis.jp/news/pr_20211130_jeep_gladiator_ver03)
- グランドチェロキーL：[2021-12-13 発表・2022-02-19 国内販売](https://www.stellantis.jp/news/pr_20211213_jeep_grand_cherokee_l_final-1)
- コマンダー：[2024-09-19 LongitudeとLimited](https://www.stellantis.jp/news/20240919_jeep_commander_longitude)、[2026-06-09 Overland追加](https://www.stellantis.jp/news/20260609_jeep_commander_overland)
- コンパス従来型：[2021-09-16 Sport / Longitude / Limited](https://www.stellantis.jp/news/pr_20210916_jeep_compass_navigation_iboard)
- コンパス新型：[2026-10-07 国内発売・Altitude / Summit / Summit Style Package](https://www.stellantis.jp/news/20261007_jeep_new_compass)
- チェロキーKL：[2014年 国内発売案内](https://setagaya.jeep-dealer.jp/jeep/blog/tvbjmv70c/)、[2019年 Longitude / Limited / Trailhawk](https://ikebukuro.jeep-dealer.jp/jeep/blog/e98jq29eh/)
- パトリオットの国内取扱：[正規販売店のメンテナンス対象](https://www.chukyo-chrysler.co.jp/carlife-support/maintenance/)。グレード構成の根拠には使わない。

## 確認

- 10車種×1440 / 375 / 320pxの30画面で、横スクロール・見出しとボタンのはみ出し・画像読み込み不良なし。canonical・noindexを確認。
- 10車種で全モデル選択肢とグレード連動、未入力エラー、確認画面、完了画面を確認。フォーム送信先をMac内の模擬サーバーに差し替えた確認専用HTMLを使用し、本番GASへの送信は0件。
- 本番ビルドでは10下書きが出力されず、sitemapにも載らない。既存1170ファイル（トップ・プライバシー・123車種・既存アセット・sitemap・robots等）が作業前と一致。
- `casesEmpty` は指定した10車種だけで使う任意項目。既存LPのバイト列が変わらないことを確認。
