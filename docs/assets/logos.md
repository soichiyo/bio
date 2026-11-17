# ロゴの取得元と文字表示の残り

確認日: 2026-11-18。現在の公開名だけを対象に確認した。公式配布ファイルを変更せず保存し、色反転は行わない。Zenn・noteは今回追加し、既存のGitHub・Cursor・Todoistの条件と表示は維持した。ロゴは名前の横の装飾画像（空alt）で、提携・推奨を示すものではない。旧デザインには適用しない。

## 採用した素材

| 名前 | 公式配布元・利用条件 | ローカルパス（public以下） | テーマ |
|---|---|---|---|
| GitHub | [公式ガイドライン](https://brand.github.com/foundations/logo)、[配布ZIP](https://brand.github.com/GitHub_Logos.zip)。プロフィールへのリンクと連携先の紹介に使用。独自ロゴより小さく表示し、改変しない | assets/logos/github-light.svg、github-dark.svg | 公式の黒／白のInvertocat |
| Cursor | [公式ブランドガイド](https://cursor.com/brand)、[配布ZIP](https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/brand/cursor-brand-assets.zip)。製品名をCursorとし、配布されているcubeを使用 | assets/logos/cursor-light.svg、cursor-dark.svg | CUBE_2D_LIGHT／DARK |
| Todoist | [公式プレスページ](https://www.todoist.com/press)、[配布ZIP](https://www.todoist.com/brand-assets/todoist-logo.zip)内の「Todoist Brand Guidelines.pdf」。名前を併記し、最小16px、周囲に高さの半分以上の余白を確保 | assets/logos/todoist-light.svg、todoist-dark.svg | Icon/Color／White。20px表示・上下左右10pxの余白 |
| Zenn | [公式メディアキット](https://zenn.dev/mediakit)、[配布ZIP](https://static.zenn.studio/images/mediakit/zenn-logo.zip)の `logo-only.svg`。紹介用途・マーク単体での利用を確認。変形・装飾なし、原則フルカラー、縦横ともマークの半分程度の余白 | assets/logos/zenn.svg | 両テーマで公式の青。20px表示・上下左右10pxの余白。最小サイズの数値指定なし |
| note | [公式ヘルプのブランドガイドライン](https://www.help-note.com/hc/ja/articles/360000235582)、[配布ZIP](https://www.help-note.com/hc/article_attachments/17204878543513)と同梱PDF（2022-12-21）。小さいソーシャルアイコンでは正方形・正円のnアイコンを使えるため、公式 `app/icon.svg` を採用 | assets/logos/note.svg | 両テーマで公式の白い角丸背景付き素材。40pxのキャンバスに配布時の内側余白を含む。ロゴタイプの最小30px指定を、nアイコンと混同しない。加工なし |

SVGにスクリプト、HTML、イベント属性、外部参照がないことを確認した。検査ではすべてのパス要素の大文字小文字とファイルの存在も確認する。

## 文字表示のまま残す素材

| 名前 | 確認先・理由 |
|---|---|
| Claude Code | [Anthropicの旧ブランドURL](https://www.anthropic.com/brand)は404。公式トップは取得できたが、Claude Code専用の配布素材と利用条件は未確認。製品用の公式配布先と条件が確認できれば再開 |
| Codex | [OpenAIのブランドガイド](https://openai.com/ja-JP/brand/)はブラウザで確認。OpenAIのマークとダウンロード時の同意欄はあるが、Codex専用素材は確認できず。親ブランドで代用せず、製品用の素材・条件の確認待ち |
| Muse Code、Grok Bot、T3 Code、Herdr | 公開名だけでは、採用すべき公式製品・配布元との対応を確定できない。製品同定待ち。本人が公式URLを指定した後に、素材と条件を調べる |
| Notion | [公式ブランドURL](https://www.notion.com/brand)は直接取得401、ブラウザでもページなし。取得不能。現行の公式配布先・条件が確認できれば再開 |
| Gmail、Drive、Calendar | [Googleのブランド案内](https://www.google.com/permissions/)はブランドハブへ移動。一般案内は読めたが、この3製品の配布素材と今回の用途の条件は未確認。各製品の公式配布先・条件が確認できれば再開 |
| Slack | [メディアキット](https://slack.com/media-kit)と[利用条件](https://slack.com/intl/ja-jp/terms-of-service/slack-brand)を確認。旧ブランドセンターは404。条件にはページ上の帰属表示の指定があり、今回の「注記を戻さない」方針に合わせて採用を見送る。適用条件を満たす表示方法が確認できれば再開 |
| X | [ブランドツールキット](https://about.x.com/en/who-we-are/brand-toolkit)は403。取得不能。公式素材と条件を閲覧できれば再開 |
| LinkedIn | [ブランドサイト](https://brand.linkedin.com/)は403。取得不能。公式素材と条件を閲覧できれば再開 |
| Facebook | [公式ロゴガイド](https://www.meta.com/brand/resources/facebook/logo/)を確認。16px以上・余白の指定に加え、ロゴの隣にFacebookと書かない指定がある。現在の「画像と名前を併記する」共通表示との両立を確認できないため文字を維持。配布時の規約同意は行っていない |
| Instagram | [公式ガイド](https://www.meta.com/brand/resources/instagram/instagram-brand/)と配布先を確認。ダウンロードは規約への明示同意を求める画面で、今回は同意を行わず素材を未取得とした。素材内の詳細条件と、採用可能な取得方法の確認待ち |

これらは画像の欠損を意味しない。登録がない項目は、名前と既存のリンクを表示する。媒体の記事順・リンク先は変えない。採用を再開する際は、公式配布先・利用条件・製品との対応を確かめてこの表を更新する。
