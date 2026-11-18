# ロゴの取得元と文字表示の残り

取得・確認日: 2026-11-18。公式ファイルは形・色・比率を変えず使用する。ロゴは名前に添える装飾画像（空alt）とし、画面に但し書きや提携・推奨を示す文言を追加しない。旧デザインには適用しない。

## 採用基準（2026-11-18の本人の判断）

Stack・Connectorsで使っているツールを示す用途では、公式ロゴ・アプリアイコンをそのまま使用する。公式ブランドページ・プレスキットのSVGを優先し、得られなければ公式サイト・公式リポジトリの素材を使う。SVGが得られない場合はPNGとし、第三者のアイコン集は使わない。

Claude CodeにはClaudeのマーク、CodexにはOpenAIのマークを使用する。Grok BotはxAIのGrok、Muse CodeはMetaのコーディングエージェント、T3 Codeはpingdotgg/t3code、Herdrはogulcancelik/herdrに対応する。Herdrのリポジトリは現在herdrdev/herdrへ転送される。

Stack・Connectorsは56pxの角丸タイル、Writingは44pxの角丸タイル、Contactは40px枠を使い、画像を原則20pxで収め、余白と縦横比を保つ。単色素材で暗い背景に沈む場合は公式の明暗素材を使い、なければ中立色のタイルに置く。Cloudflareは白いタイルを使用する。SkillsはSuperpowers・Pstackとも文字だけで統一する。素材の反転・合成・切り抜きは行わない。

## 採用した素材

| 名前 | 公式配布元・利用条件 | ローカルパス（public以下） | テーマ |
|---|---|---|---|
| GitHub | [公式ガイドライン](https://brand.github.com/foundations/logo)、[配布ZIP](https://brand.github.com/GitHub_Logos.zip)。プロフィールへのリンクと連携先の紹介に使用。独自ロゴより小さく表示し、改変しない | assets/logos/github-light.svg、github-dark.svg | 公式の黒／白のInvertocat |
| Cursor | [公式ブランドガイド](https://cursor.com/brand)、[配布ZIP](https://ptht05hbb1ssoooe.public.blob.vercel-storage.com/assets/brand/cursor-brand-assets.zip)。製品名をCursorとし、配布されているcubeを使用 | assets/logos/cursor-light.svg、cursor-dark.svg | CUBE_2D_LIGHT／DARK |
| Todoist | [公式プレスページ](https://www.todoist.com/press)、[配布ZIP](https://www.todoist.com/brand-assets/todoist-logo.zip)内の「Todoist Brand Guidelines.pdf」。名前を併記し、最小16px、周囲に高さの半分以上の余白を確保 | assets/logos/todoist-light.svg、todoist-dark.svg | Icon/Color／White。20px表示・上下左右10pxの余白 |
| Zenn | [公式メディアキット](https://zenn.dev/mediakit)、[配布ZIP](https://static.zenn.studio/images/mediakit/zenn-logo.zip)の `logo-only.svg`。紹介用途・マーク単体での利用を確認。変形・装飾なし、原則フルカラー、縦横ともマークの半分程度の余白 | assets/logos/zenn.svg | 両テーマで公式の青。20px表示・上下左右10pxの余白。最小サイズの数値指定なし |
| note | [公式ヘルプのブランドガイドライン](https://www.help-note.com/hc/ja/articles/360000235582)、[配布ZIP](https://www.help-note.com/hc/article_attachments/17204878543513)と同梱PDF（2022-12-21）。小さいソーシャルアイコンでは正方形・正円のnアイコンを使えるため、公式 `app/icon.svg` を採用 | assets/logos/note.svg | 両テーマで公式の白い角丸背景付き素材。40pxのキャンバスに配布時の内側余白を含む。ロゴタイプの最小30px指定を、nアイコンと混同しない。加工なし |

## 今回追加したStack・Connectorsの素材

全項目の取得日は2026-11-18。保存先は `public/assets/logos/`。PNGも配布ファイルをそのまま保存し、SVGから変換していない。

| 表示名 | 取得元URL・確認した公式ページ | ファイル名・表示 |
|---|---|---|
| Claude Code | [Claude公式サイト](https://claude.com/)が指定する[SVGアイコン](https://claude.com/icon.svg) | claude.svg。公式のオレンジを両テーマで使用 |
| Codex | [OpenAI公式開発者サイト](https://developers.openai.com/)が指定する[PNGアイコン](https://developers.openai.com/favicon.png)。ブランドページの図解SVGはロゴ単体ではなく、favicon.svgは直接取得403だったためPNGを採用 | openai.png。公式の青地・白マークをそのまま使用 |
| Grok Bot | [Grok公式サイト](https://grok.com/)が指定する[PNGアイコン](https://grok.com/images/android-chrome-192x192.png)。同サイトのSVGにはforeignObjectが含まれ、既存の安全検査を維持するためPNGを採用 | grok.png。公式の黒地・白マークをそのまま使用 |
| T3 Code | [公式リポジトリのSVG](https://github.com/pingdotgg/t3code/blob/main/assets/prod/logo.svg)、[取得ファイル](https://raw.githubusercontent.com/pingdotgg/t3code/main/assets/prod/logo.svg) | t3-code.svg。公式の黒地・白文字をそのまま使用 |
| Herdr | [公式リポジトリのSVG](https://github.com/herdrdev/herdr/blob/master/assets/logo.svg)、[取得ファイル](https://raw.githubusercontent.com/herdrdev/herdr/master/assets/logo.svg) | herdr.svg。配布時のグレー背景を含めて使用 |
| Notion | [公式トップページ](https://www.notion.com/)が指定する[PNGアイコン](https://www.notion.com/front-static/logo-ios.png)。ヘッダーのSVGはサイトのCSS変数に依存し単体表示が欠けたため、加工せずPNGへ切り替えた | notion.png。黒白のマークを白いタイル上に置く |
| Gmail | [公式製品ページ](https://workspace.google.com/products/gmail/)内の[製品アイコンSVG](https://www.gstatic.com/images/branding/productlogos/gmail_2026/v2/web/192px.svg) | gmail.svg。公式の色を両テーマで使用 |
| Slack | [公式メディアキット](https://slack.com/media-kit)内の[ロゴSVG](https://a.slack-edge.com/1f40066/marketing/img/nav/logo.svg)。旧ブランドセンターは404のため公式サイトの素材を採用 | slack.svg。公式の色を両テーマで使用 |
| Drive | [公式製品ページ](https://workspace.google.com/products/drive/)内の[製品アイコンSVG](https://www.gstatic.com/images/branding/productlogos/drive_2026/v2/web/192px.svg) | drive.svg。公式の色を両テーマで使用 |
| Calendar | [公式製品ページ](https://workspace.google.com/products/calendar/)内の[製品アイコンSVG](https://www.gstatic.com/images/branding/productlogos/calendar_2026/v2/web/192px.svg) | calendar.svg。公式の色を両テーマで使用 |

SVGにスクリプト、HTML、イベント属性、外部参照がないことを確認した。検査ではすべてのパス要素の大文字小文字とファイルの存在も確認する。

## 文字表示のまま残す素材

| 名前 | 確認先・理由 |
|---|---|
| Muse Code | 製品の同定は完了。[公式製品ページ](https://dev.meta.ai/products/muse-code)と[公式ドキュメント](https://dev.meta.ai/docs/muse-code/)を確認したが、掲載された画像はMetaの企業ロゴ・背景・製品画面で、Muse Code専用のロゴ・アプリアイコンを取得できなかった。Metaの企業ロゴや画面の切り抜きで代用せず、専用素材の公式配布先が見つかるまで文字表示を維持 |
| X | [ブランドツールキット](https://about.x.com/en/who-we-are/brand-toolkit)は403。取得不能。公式素材と条件を閲覧できれば再開 |
| LinkedIn | [ブランドサイト](https://brand.linkedin.com/)は403。取得不能。公式素材と条件を閲覧できれば再開 |
| Facebook | [公式ロゴガイド](https://www.meta.com/brand/resources/facebook/logo/)を確認。16px以上・余白の指定に加え、ロゴの隣にFacebookと書かない指定がある。現在の「画像と名前を併記する」共通表示との両立を確認できないため文字を維持。配布時の規約同意は行っていない |
| Instagram | [公式ガイド](https://www.meta.com/brand/resources/instagram/instagram-brand/)と配布先を確認。ダウンロードは規約への明示同意を求める画面で、今回は同意を行わず素材を未取得とした。素材内の詳細条件と、採用可能な取得方法の確認待ち |

X・LinkedIn・Facebook・Instagramは今回のStack・Connectorsの対象外で、前回の保留状態を維持する。

これらは画像の欠損を意味しない。登録がない項目は、名前と既存のリンクを表示する。媒体の記事順・リンク先は変えない。採用を再開する際は、公式配布先・利用条件・製品との対応を確かめてこの表を更新する。

## Connectorsへの変更（2026-11-18）

取得日: 2026-11-18。Composio・Granola・Figma・Cloudflareを掲載する。Notion・GitHub・Gmail・Slack・Drive・Calendar・Todoistはこの枠から外す。既存素材は残し、GitHubは引き続きContactで使う。画面に出所・日付は表示しない。

| 名前 | 取得元URL・確認した公式ページ | ファイル名（public/assets/logos以下） |
|---|---|---|
| Composio | [公式サイト](https://composio.dev/)が使用する[黒マーク](https://composio.dev/logos/composio-black.svg)と[白マーク](https://composio.dev/logos/composio-white.svg)。独立したブランド配布ページは取得できず、公式サイトのSVGを採用 | composio-light.svg、composio-dark.svg。公式の明暗素材を切り替える |
| Granola | [公式サイト](https://www.granola.ai/)のPressリンク（[grano.la/press](https://grano.la/press)）から辿った[公式配布フォルダ](https://drive.google.com/drive/folders/1GkB2Qs_313r4P8l7f3uZ8deV5j4Flzo1)の[logo-square.svg](https://drive.google.com/file/d/1OWPkmXSl0kpUCbLpJ3uIaTKIfFuvbK-L/view) | granola.svg。公式の背景色を含めて使用 |
| Figma | [公式ブランドページ](https://www.figma.com/using-the-figma-brand/)の[配布ZIP](https://static.figma.com/uploads/4fbf4d754dbbc027ba1530205f8747cd97d532e5)内の `Figma Icon (Full-color).svg` | figma.svg。公式のフルカラーを両テーマで使用。配布SVGの内側余白を保ち、40pxキャンバスで表示 |
| Cloudflare | [公式プレスキット](https://www.cloudflare.com/press/press-kit/)の[Logos.zip](https://cf-assets.www.cloudflare.com/dzlvafdwdttg/2Twekn3xyYyd94qDYAl0ed/9ab649caa40958f195166e0d9f5d9a04/Logos.zip)内の `CF-Logo 1.png`。配布ZIPにSVGがないためPNGを採用 | cloudflare.png。40pxキャンバス内で縦横比を保つ。黒い文字部分を含むため白い中立色タイルに置く |

すべて配布ファイルのまま保存し、色・形・縦横比を変更していない。Stack・Connectorsの56px枠内で、Composio・Granolaは20px、Figma・Cloudflareは40pxの画像領域を使用する。Figmaは素材内に余白があり、Cloudflareは横長のため、このサイズでマークの視認性を確保する。Muse Codeの専用素材は引き続き未取得。Skillsのロゴは探さず、文字表示を維持する。
