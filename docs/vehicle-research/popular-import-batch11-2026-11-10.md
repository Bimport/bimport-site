# 輸入車追加下書き・第11弾（2026-11-10）

2026-11-10ユーザー承認により、追加10件を公開対象へ変更。実績未掲載版。

| 車種 | slug | 選択可能な型式と確認済み仕様 |
|---|---|---|
| アウディS3 | audi-s3 | 8VDJHF：Sportback／8VDJHL：Sedan |
| アウディS4 | audi-s4 | 8WCWGF：S4・S4 Avant |
| アウディS6 | audi-s6 | F2DKML：S6・S6 Avant |
| アウディRS 3 | audi-rs3 | 8VDAZF：Sportback／8VDAZL：Sedan |
| アウディRS 4 | audi-rs4 | 8WDECF：RS 4 Avant |
| アウディRS 5 | audi-rs5 | F5DECF：Coupe／F5DECL：Sportback |
| メルセデス・ベンツEQA | mercedes-benz-eqa | 243702C：EQA 250+ |
| メルセデス・ベンツEQB | mercedes-benz-eqb | 243602C：EQB 250+ |
| メルセデス・ベンツEQE | mercedes-benz-eqe | 295121・295121C：EQE 350+（セダン） |
| メルセデス・ベンツEQS | mercedes-benz-eqs | 297123：EQS 450+（セダン系） |

## 国内資料

- [アウディ国内MY20モデルコード・型式表](https://emea-dam.audi.com/adobe/assets/urn%3Aaaid%3Aaem%3A481506a8-78f8-4a00-bef4-69ce19b89631/original/as/newcar_ajhp_my20_20201102.pdf)：S3・S4・S6・RS3・RS4の型式とボディ形状を確認。
- [アウディジャパン届出の新車リスト（国土交通省）](https://www.mlit.go.jp/common/001321871.pdf)：S3 Sedan/Sportback・RS3 Sedan/Sportbackの国内型式を照合。
- [アウディ国内RS 5公式主要諸元](https://media.audi.com/is/content/audi/country/jp/ja/assets/catalogue/a5/my25/RS5_Product_Information_241209.pdf)：F5DECFのCoupeとF5DECLのSportbackを区別。
- [メルセデス・ベンツ日本の国内届出（国土交通省）](https://www.mlit.go.jp/en/jidosha/content/001997723.pdf)：EQA 250+とEQB 250+の型式を照合。
- [メルセデス・ベンツ日本の国内届出（国土交通省）](https://www.mlit.go.jp/en/jidosha/content/001763231.pdf)：EQE 350+の295121/295121C、EQS 450+の297123。SUVの294/296、AMGは選択肢に混ぜない。

型式は国内認定型式から排出ガス識別記号のみ省略。確認済みの一部仕様に絞り、旧型や未収載仕様は「わからない」「その他・わからない」で受ける。全グレード網羅と誤認させないFAQを維持。

## 画像と実績

組み込みimage_genで各2枚を新規生成。FVは屋外・左向き、LINEは別色・別場所・後方アングル。S3/RS3はスポーツバックとセダン、S4/S6はセダンとアバント、RS5はクーペとスポーツバック。実績写真には使わずAI注記を表示。EQE/EQSはSUV画像と混同しない。上下フェード、実績未掲載案内のみの構成を維持。
## 確認完了

- 生成した20枚を目視確認。別色・別背景・アングルと車体全体の余白、ボディ仕様を確認。Web用JPEG/WebPをsrc/assets/images/各slug/に保存。指示文と保存先は同日prompts JSON参照。
- PC1440px・スマホ375/320pxの計30画面で横スクロール・見出しはみ出し・FV読み込み不良なし。スマホ全10件のFVとLINE部分を目視確認。LINE写真は全10件で読み込み成功、contain表示。JSエラーなし。
- 全10フォームで必須4項目エラー、全型式の連動グレードと不明時のフォールバック、確認画面、ローカル模擬送信後の完了表示を確認。送信先はローカル模擬サーバーに限定し、メーカー・車種・型式・グレードを照合。本番送信0件。
- production/previewビルド成功。既存公開1982ファイルは作業前とバイト単位で一致。本番HTML・サイトマップに新規10件なし。previewのcanonicalとnoindex、20枚の画像の非重複を確認。
- 公開承認まではdraft:trueを維持する。

