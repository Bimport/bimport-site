# Numbers入力分の下書き（2026-11-01）

## 制作範囲

- 最新main（e6b4de9）から `codex/lp-numbers-20261101` で制作。
- 新規42車種のLPを `draft: true` で作成。Eクラスは実績2件追加の確認用差し替え案。
- Numbersの表示値ではなく、保存されている元の金額を使用。万円単位の端数も保持。
- 実績の装備文は非公開準備表の入力内容をそのまま使用。
- 車体番号・未公開の準備表・出品票はリポジトリに含めない。
- ティグアンのユーザー指定車両は仕入金額0円のため実績対象から除外。除外理由はMac側の非公開CSVに記録。
- 古い下書きブランチは再取り込みしていない。従来のB3・Q3・Q7の地域確認待ちも今回とは別扱い。

## 確認待ち

- フィアット500 バイ グッチ、パナメーラGTS、AMG GT S：出品票の登録ナンバー欄が空欄。地域回答待ちで実績カードは保留。
- ハマーH3 タイプG：準備表の走行距離に不確かというメモがあり、出品票はマイル表記。掲載表記の回答待ちで実績カードは保留。
- これら以外の実績から下書きを進める。価格0の実績を埋め合わせで作らない。

## グレードの根拠

一次資料を確認できた選択肢だけフォームに設定。確認できない車種は「限定車・特別仕様車」「その他・わからない」で受ける。実績カードの仕様名は当該出品票・準備表に基づく。

| 車種 | 資料 | 選択肢 |
| --- | --- | --- |
| フィアット500/500C | https://suginami.fiat-abarth-dealer.jp/fiat/blog/ipkb1x905/ | 500C 60th |
| ハイエースバン | https://toyota.jp/hiacevan/grade/equipment/?left=56_6&right=56_1 | DX、スーパーGL |
| ハリアー | https://toyota.jp/harrier/grade/ | Z、Z レザーパッケージ |
| ハリアーハイブリッド | https://toyota.jp/ucar/catalog/brand-TOYOTA/car-HARRIER/ | プレミアム |
| プリウス | https://www.ck-toyota.co.jp/eventinfo/prius/spec/pdf_002.pdf | Aプレミアム |
| プリウスα | https://toyota.jp/ucar/catalog/brand-TOYOTA/car-PRIUS_ALPHA/ | S、Sツーリングセレクション、G、Gツーリングセレクション |
| ライズ | https://toyota.jp/raize/grade/ | Z、G |
| ランドクルーザー80 | https://toyota.jp/ucar/catalog/brand-TOYOTA/car-LAND_CRUISER_80/199501/1006883/ | VXリミテッド |
| ランドクルーザープラド | https://toyota.jp/ucar/catalog/brand-TOYOTA/car-LAND_CRUISER_PRADO/ | TX、TX Lパッケージ、TZ-G |

## 公開済みLPの修正案

`src/_data/vehicleDraftOverrides/` は公開済み車種の確認用データ置き場。`LP_PREVIEW=1` のときだけ同名車種に差し替え、必ず `draft: true` として出力する。通常の本番ビルドは既存の車種データを使用する。公開承認後に差し替え案を本体へ反映してから、この確認用データを取り除く。

## 確認

- 本番ビルドの既存573ファイルは作業前と一致。
- 下書きビルドで43車種の確認用一覧を生成。
- PC 1440px・スマホ375px・320pxの表示、3STEPフォームを外部送信なしで確認。
- 実績写真70台分とLINE写真42枚を配置。元写真と編集結果を照合。
- 本番フォームへの実送信は行わない。
- 公開・PR・マージは未実施。ユーザーの公開承認後に進める。

## 車種一覧

| 車種 | 確認パス | 実績数 |
| --- | --- | --- |
| ハマーH3 | `/hummer-h3/` | 1 |
| フィアット500 | `/fiat-500/` | 1 |
| フェラーリ488GTB | `/ferrari-488-gtb/` | 1 |
| フェラーリローマ | `/ferrari-roma/` | 1 |
| フォルクスワーゲンゴルフ | `/volkswagen-golf/` | 1 |
| フォードエクスプローラー | `/ford-explorer/` | 4 |
| フォードマスタング | `/ford-mustang/` | 1 |
| プジョー208 | `/peugeot-208/` | 1 |
| プジョー408 | `/peugeot-408/` | 1 |
| ボルボV90 | `/volvo-v90/` | 1 |
| ボルボXC40 | `/volvo-xc40/` | 1 |
| ポルシェ718ボクスター | `/porsche-718-boxster/` | 1 |
| ポルシェカイエン | `/porsche-cayenne/` | 1 |
| ポルシェケイマン（718含む） | `/porsche-cayman/` | 2 |
| ポルシェタイカン | `/porsche-taycan/` | 1 |
| ポルシェパナメーラ | `/porsche-panamera/` | 2 |
| ポルシェマカン | `/porsche-macan/` | 5 |
| マセラティギブリ | `/maserati-ghibli/` | 1 |
| マセラティクアトロポルテ | `/maserati-quattroporte/` | 1 |
| マセラティグランカブリオ | `/maserati-grancabrio/` | 1 |
| マセラティグラントゥーリズモ | `/maserati-granturismo/` | 1 |
| マセラティグレカーレ | `/maserati-grecale/` | 1 |
| メルセデス・ベンツAMGGT | `/mercedes-amg-gt/` | 1 |
| メルセデス・ベンツAクラス | `/mercedes-benz-a-class/` | 2 |
| メルセデス・ベンツCLAクラス | `/mercedes-benz-cla-class/` | 2 |
| メルセデス・ベンツCLSクラス | `/mercedes-benz-cls-class/` | 1 |
| メルセデス・ベンツCクラス | `/mercedes-benz-c-class/` | 7 |
| メルセデス・ベンツEQESUV | `/mercedes-benz-eqe-suv/` | 1 |
| メルセデス・ベンツGLAクラス | `/mercedes-benz-gla-class/` | 2 |
| メルセデス・ベンツGLB | `/mercedes-benz-glb/` | 3 |
| トヨタハイエースバン | `/toyota-hiace-van/` | 4 |
| トヨタハリアー | `/toyota-harrier/` | 1 |
| トヨタハリアーハイブリッド | `/toyota-harrier-hybrid/` | 1 |
| トヨタプリウス | `/toyota-prius/` | 1 |
| トヨタプリウスα | `/toyota-prius-alpha/` | 4 |
| トヨタライズ | `/toyota-raize/` | 1 |
| トヨタランドクルーザー80 | `/toyota-land-cruiser-80/` | 1 |
| トヨタランドクルーザープラド | `/toyota-land-cruiser-prado/` | 1 |
| ホンダCR-V | `/honda-cr-v/` | 1 |
| ホンダシビック | `/honda-civic/` | 1 |
| ホンダヴェゼル | `/honda-vezel/` | 1 |
| マツダCX-5 | `/mazda-cx-5/` | 1 |
| メルセデス・ベンツEクラス（実績追加案） | `/mercedes-benz-e-class/` | 既存1件＋追加2件 |
