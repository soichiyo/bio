# Soichiro Yoshimura — AI Profile

公開サイト: https://www.soichiroyoshimura.com

AIの利用状況と、仕事・文章・コーチング・写真・家族をまとめたプロフィールです。Next.js 15 App Routerを使っています。

## 開発と検証

開発環境はNode.js 24.15以降の24系、または22.22.2以降の22系を使います。チャットのDOMテストで使うjsdomの要件に合わせています。

```bash
npm ci
npm run dev
npm run type-check
npm run lint
npm test
npm run build
npm run start
```

## 2つのデザイン

- `/` はAIプロフィール。`?design=telemetry`、`?design=personal-os` も同じ画面です。
- `?design=legacy`、`?design=classic` は旧デザインです。利用データもRSSも取得しません。
- `?view=telemetry`、`?view=legacy` も使えます。両方ある場合は `design`、同じキーが複数ある場合は先頭を優先します。
- `BIO_DESIGN_VARIANT=legacy` で既定表示を旧デザインにできます。環境変数の変更には再デプロイが必要です。

## 利用データ

[公開JSON](https://raw.githubusercontent.com/soichiyo/ai-usage/main/usage.json)だけをサーバーで取得します。生ログ、会話、プロジェクト名、認証情報はbioへ渡しません。入力の正本は [ai-usageのスキーマ](https://github.com/soichiyo/ai-usage/blob/main/src/schema.mjs) です。

`lib/usage/load.ts` は、取得・解析・検証に成功した値をNext.jsのData Cacheへ保存します。再検証の間隔は1時間、取得のタイムアウトは5秒です。アクセスに応じて再検証されるため、定時取得や必ず1時間以内の反映を保証するものではありません。再検証を始めたリクエストには前の値を返し、その後のリクエストで新しい値を表示します。データの変更だけならサイトの再ビルドは不要です。

再検証に失敗した場合は以前の検証済みキャッシュを保持します。キャッシュがない場合は `content/usage-fallback.json` の検証済み控えを表示します。控えも不正なら数値は「—」となり、プロフィールと連絡先は利用できます。モジュール変数だけに前回値を保存しません。

更新日時はデータの `generatedAt` をJSTで表示します。どちらかのMacが36時間以上更新されていない、または必要なcollectorがない場合は遅延を知らせ、Current streakを「—」にします。当日分は途中の値です。

### 控えの更新

1. 公開JSONを一時ファイルへ取得する。
2. `lib/usage/schema.ts` の `parseUsage` で検証する。未知のキーやschemaVersionは受け入れない。
3. 検証済みの内容を `content/usage-fallback.json` へ保存する。`generatedAt` は書き換えない。
4. `npm test -- lib/usage/load.test.ts` を実行し、差分を確認してPRにする。合成データで控えを置き換えない。

### 数字の意味

- Total / Peak tokensは今日までの全履歴の取得分。入力・出力・キャッシュを含みます。欠落を0で補いません。
- Longest runは `rule: active` の値だけを使います。同じ指示の記録間に30分を超える空白がない最大経過時間で、待ち時間を完全に除いた処理時間ではありません。rawしかない場合は表示しません。
- 連続日数は1トークン以上の利用が続いた日数。欠落日で切り、収集停止を0日と断定しません。
- ヒートマップはJST・日曜始まりの53週。ツールの絞り込みはグラフと月別表だけに適用し、上の5指標は変えません。未取得・一部未取得・実測0・未来を分けます。
- Pluginsの統計は `snapshots` にある値だけを基準日付きで表示します。

## Writingの自動更新

新ページは[ZennのRSS](https://zenn.dev/soichiyo/feed)と[noteのRSS](https://note.com/soichiro/rss)をサーバーで取得し、公開日時の新しい順に最大6件を表示します。媒体ごとの枠や固定記事は設けません。URLで重複を除き、未来の公開日時の記事はその時刻まで表示しません。本文・要約・画像は使わず、題名・リンク・公開日時だけを扱います。

`lib/writing/load.ts` は媒体ごとに成功値を6時間キャッシュします。アクセス時に再検証するため、定時更新や6時間以内の反映を保証しません。再検証を始めたリクエストには以前の値を返し、その後に新しい値が見えるようになります。記事更新だけなら再ビルドは不要です。取得は本文の読了まで5秒、最大1MiBで制限します。

片方の取得に失敗しても、もう片方は独立して更新します。再検証失敗時は前回の成功値を保持し、成功キャッシュがない媒体だけ `content/writing.ts` の控えを使います。控えも不正なら取得不能として示します。正常な空フィードは0件として扱い、控えから記事を復活させません。

公開年月はJSTです。「記事の取得状況」には媒体ごとの実際の取得確認日時を表示し、キャッシュを読んだ時刻で上書きしません。成功取得から24時間以上経過した場合と控えを使う場合は、その状態を知らせます。記事の公開日が古いだけで取得遅延とは判定しません。

既存の3記事は旧デザインと控えに残します。旧デザインの題名・年月・順序は変えません。控えの年月しか分からない記事に、架空の公開日や時刻は付けません。正常なRSSに控えを常時追加しないため、新着6件から外れる記事もあります。各媒体へのMoreリンクは残ります。

記事を非公開化しても、成功キャッシュが再検証されるまでは表示に残る場合があります。取得失敗が続けば前回値が残ります。静的な控えと旧デザインからの削除は手動です。

### 記事の控えを手動で更新する

1. `content/writing.ts` の題名・本人の記事URL・媒体・公開年月（`YYYY-MM`）を確認して編集する。旧デザインにも同じ変更が反映されます。
2. `WritingType` とexportを維持する。日時が不明な記事を1日や0時で補わない。
3. `npm test -- content lib/writing/select.test.ts` を実行する。コンテンツのスナップショット差分は、意図した記事変更だけか確認して更新する。
4. 旧デザインと控え使用時の表示を確認し、PR・本番公開へ進める。正常なRSSの表示内容はこの編集では変わりません。

## コンテンツと公開

公開本文は `content/` にあります。Writingの新着はRSS、旧デザインと控えは手動更新です。

### Stack・Pluginsとロゴ

`stack.ts` の役割別配列、または `plugins.ts` に `{ name, logo?, hidden? }` を追加します。公開してよい名前だけを記入します。全ツールがhiddenの役割見出しは表示しません。

ロゴは `logos.ts` の登録キーを指定します。公式の配布元と利用条件を確かめ、画像を `public/assets/logos/` へ置き、[素材台帳](docs/assets/logos.md)に出所を記録します。暗い背景用の公式素材があれば `darkSrc` へ登録します。`logoByName` は公開名の対応表で、PluginsやContactなどで共有します。ロゴを登録しない項目も名前を表示します。画像の色反転は行いません。

Stackの `addedAt` は実際に追加した日が分かる場合だけ `YYYY-MM-DD` で記入します。Latestは、本人申告の2026-11-16より新しく、JSTの今日以下で最も新しい表示対象を選びます。同日は配列順を優先し、hidden・日付なし・未来日は候補にしません。候補がなければ「Gemini 4.0・本人申告2026-11-16」を表示します。既存ツールの追加日を推測で埋めません。

### Showcase

`showcase.ts` の `showcaseEnabled` はfalse、公開用配列は空で始めています。掲載時はtrueにして、`title`・`description`・HTTPSの `url`・使用ツールの `tools: ToolEntry[]` を追加します。作品は配列順で並びます。全体がfalse、または個別hiddenを除いた項目が0なら、本体とナビの両方を隠します。

画像は任意です。指定するときは `image: "/assets/showcase/<slug>.jpg"` とし、実ファイルを置きます。画像なしは文字カードになります。`npm test -- content components/sections/ShowcaseSection.test.ts` で必須項目、ツール名の重複、未登録ロゴ、画像の存在・大小文字、認証情報を含まないHTTPS URLを検査します。公開用配列へ合成作品を残しません。

### Careerの補足

`ai-profile.ts` の `careerHighlights` に会社名を明示して対応付けます。現在は既存の公開データ `projects.ts` のLINE・Lovegraphの説明とURLだけを使っています。公開根拠のない成果・数字・担当範囲を追加しません。旧デザインが読む配列とexportは別に維持します。

### 残っている入力・確認

- ロゴ: 採用済み3ブランドと、文字表示を続ける項目の理由は[素材台帳](docs/assets/logos.md)に集約しています。
- Career・Showcase: ほかの会社の実績と新しい作品は、公開する文章・根拠・URLの選定待ちです。
- Cursor: 実CSVの形式・対象期間・合計・欠損は未確認です。取り込みはai-usage側の別作業で、未取得を0にはしません。

GitHubのCIとVercelプレビューを確認してからmainへマージします。本番がReadyになった後に、ソースのコミット一致、新ページ、旧デザイン、公開データとの一致を確認します。問題がある場合はVercelの直前の正常な本番デプロイへ戻します。

詳しい開発方針は [AGENTS.md](AGENTS.md)、表示方針は [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md) を参照してください。
