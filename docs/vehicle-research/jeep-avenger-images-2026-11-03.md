# アベンジャー：実績未掲載版の生成画像

2026-11-03、ユーザー指定の2枚構成をまず1車種で確認するため、アベンジャーの下書きだけに追加。残り9車種はまだ生成していない。公開はしない。

生成方法：Codex組み込み画像生成（image_gen）。実際の買取車両ではなく車種イメージ。車体を加工した実績写真ではない。

| 用途 | 内容 | 最終保存先 |
|---|---|---|
| FV | 黄色・黒ルーフ、左向きの前方斜め、山と湖の屋外 | `src/assets/images/jeep-avenger/hero-ai-1536.jpg` |
| LINE査定 | 青緑・黒ルーフ、右向きの後方斜め、紅葉とロッジ | `src/assets/images/jeep-avenger/line-image-ai-1536.jpg` |

各画像に1536px・1000pxのWebPを用意。車体全体が見えるように配置。FV・LINEそれぞれの近くにAI生成の注記を表示。`cases` は空のままで、実績には使用しない。

## FVの最終プロンプト

```text
Use case: ads-marketing. Generate ONE photorealistic automotive landscape photograph, 3:2 aspect ratio, for a Japanese car buying website hero. Subject: production Jeep Avenger compact five-door electric SUV, correct recognizable 2024 European/Japanese Avenger body proportions, seven-slot closed EV grille, slim headlamps, black plastic wheel arches, factory alloy wheels, vivid sun yellow paint with a black roof. Front three-quarter view with the nose pointing to the LEFT of the image. Parked on a tasteful stone turnout beside a serene turquoise alpine lake with distant green mountains, crisp soft morning light. Premium realistic car photography, grounded natural reflections, no people. Entire car including both wheels, bumper and roof fully inside frame, generous 15 percent margins around car so responsive cropping is safe. Car occupies about 65 percent of frame width centered horizontally. No invented body kit, no oversized wheels, no textual overlays, no advertising copy, no watermarks, no readable scenery signage, blank license plate. This is an illustrative generated vehicle, not an actual purchase case. Natural photographic detail, not a poster or collage.
```

## LINE用の最終プロンプト

```text
Use case: ads-marketing. Generate ONE photorealistic automotive landscape photograph, 3:2 aspect ratio, for a Japanese car buying website LINE photo appraisal section. Subject: production Jeep Avenger compact five-door electric SUV with correct recognizable 2024 Avenger proportions, factory alloy wheels, black wheel arch trim, pale lake blue-green metallic paint and black roof. Different shot from a yellow car at a lake: rear three-quarter view, camera sees rear and right-side body, the front of the car points toward the RIGHT side of the frame. Parked on a quiet paved lane beside a contemporary stone-and-timber mountain lodge at the edge of a sunlit autumn forest; warm late-afternoon light, golden trees, tasteful natural architecture, no lake. Premium realistic automotive photography with natural tire shadows and reflections. Entire vehicle including bumpers, all visible wheels and roof inside frame, generous 15 percent margins, vehicle about 65 percent of frame width. No people, no added logos or advertising text, no watermarks, no readable signs, license plate blank. Do not turn the car into a Wrangler or a larger Jeep. This is a generated illustrative vehicle, not a real purchase case. One photograph only, not a collage.
```
