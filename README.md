# Soichiro Yoshimura — AI Profile

公開サイト: https://www.soichiroyoshimura.com

AIの利用状況と、仕事・文章・コーチング・写真・家族をまとめたプロフィールです。Next.js 15 App Routerを使っています。

## 開発と検証

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
- `?design=legacy`、`?design=classic` は旧デザインです。利用データの取得は行いません。
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

## コンテンツと公開

公開本文は `content/` にあります。Stackは `stack.ts`、Pluginsは `plugins.ts`、Showcaseは `showcase.ts` に項目を追加します。ロゴ画像がなければ文字で表示します。Showcaseが空ならナビゲーションも非表示です。Writingは手動更新で、RSS連携はまだありません。

GitHubのCIとVercelプレビューを確認してからmainへマージします。本番がReadyになった後に、ソースのコミット一致、新ページ、旧デザイン、公開データとの一致を確認します。問題がある場合はVercelの直前の正常な本番デプロイへ戻します。

詳しい開発方針は [AGENTS.md](AGENTS.md)、表示方針は [DESIGN_DIRECTION.md](DESIGN_DIRECTION.md) を参照してください。
