# AIプロフィール設計と実装の照合

Date: 2026-11-17

設計書の主要機能は公開済み。残っているのは、ロゴ・コンテンツ追加機能の仕上げ、操作性の不足、Cursorの手動取り込みである。次の[計画5](../plans/2026-11-17-profile-finish.md)ではbio側を仕上げる。Cursorは実CSVの確認を先に行う別作業として残す。

## 照合した範囲

- 正本: [AIプロフィールの設計書](../specs/2026-11-16-ai-profile-redesign-design.md)。計画3・4で具体化した決定を優先し、初期の提案と区別した。
- bio: [計画4のマージ時点](https://github.com/soichiyo/bio/commit/3587a85c229a389ec6fec2ef052ec0f8cefdc0e6)。調査開始時に手元mainとGitHubのmainの一致、変更がないことを確認。
- ai-usage: M1のソースを読んだうえでGitHubのmainと比較。差分は `machines/air.json`、`machines/m1.json`、`usage.json` だけで、確認したコードに差分はなかった。
- 本番: https://www.soichiroyoshimura.com 。ロゴ列、チャットのキーボード操作、両テーマの配色、公開メタ情報を今回確認。
- 既存の検証結果: [計画3の公開PR #23](https://github.com/soichiyo/bio/pull/23)、[計画4の公開PR #25](https://github.com/soichiyo/bio/pull/25)。138テスト・型確認・lint・build・本番RSS照合は#25の結果を参照し、今回改めて実行したとは扱わない。

この照合はアプリの変更を含まない。チャットへのメッセージ送信、非公開ログの収集、CursorのCSV取得、定期実行の変更も行っていない。

## 設計に対して実装済みのもの

| 設計の項目 | 現在の実装・根拠 | 判定 |
|---|---|---|
| 通常表示をAIプロフィールへ置換、旧画面は残す | `app/page.tsx`、`lib/design-variant.ts`。新ページのみusage/RSSを取得。別名・環境変数・並列開始を入口テストで確認 | 実装済み |
| 名前・アイコン・5指標・更新日 | `AIHero.tsx`、`StatStrip.tsx`、`UsageStatus.tsx`。公開JSONから計算し、欠損と0を区別 | 実装済み |
| activeのLongest run | `lib/usage/metrics.ts`。rawへ切り替えず、activeだけ表示 | 決定どおり |
| 53週、JST、日曜始まり、四分位の点、ツール絞り込み、月別表 | `lib/usage/heatmap.ts`、`UsageHeatmap.tsx`、`UsageMonthTable.tsx`。Cursorを含む入力の受け口もある | 実装済み。Cursor実データは別項目 |
| 利用データの取得・前回値・控え・遅延表示 | `lib/usage/load.ts`、`load-core.ts`、`metrics.ts`。1時間のアクセス時再検証、36時間のcollector遅延判定 | 実装済み |
| Claude Code/Codexの集計とデータ専用repo | ai-usageの `src/ledger.mjs`、`src/runs.mjs`、`src/merge.mjs`。日別最大値の保持、2台の合算、30分の空白判定、手修正、公開スキーマ検証を実装。公開JSONに両ツールの値がある | 実装・公開済み。今回、launchdやスリープ復帰後の実行は再検証していない |
| StackのAgents / Harness、Delegation、初期Latest | `content/stack.ts`、`StackSection.tsx`。指定された名前と申告日を保持 | 表示は実装済み。自動選択は未実装 |
| Pluginsの公開名と出典付き統計 | `content/plugins.ts`、`PluginsSection.tsx`。承認済みモック由来の7名称、入力にある統計だけ表示 | 実装済み。ロゴは未実装 |
| WritingのRSS更新 | `lib/writing/`、`WritingSection.tsx`。新着6件、媒体別6時間キャッシュ、部分失敗・正常空フィードの区別 | 計画4で公開済み |
| 人間の側面を残す | `BeyondAISection.tsx`。Career、Coaching、証拠リンク付き資格3件、写真拡大、Family、Life | 実装済み。Careerの実績行は未実装 |
| 新ページの固定能力グラフ・件数・重複の削除 | `AIProfilePage.tsx`。旧ダッシュボードはGit履歴へ残し、公開する第3画面は作っていない | 実装済み |
| コンテンツ分割、テスト、CI | `content/`、`lib/usage/`、`lib/writing/`、`.github/workflows/ci.yml` | 実装済み |
| 初期の掃除 | Vite用ファイル・未使用部品の削除、ESLint一本化、`next lint`廃止、ignore、`CLAUDE.md`から正本参照、JPEG名修正、年の自動表示、写真alt | 実装済み。残存部品は使用先で判断 |

## 残っている作業

優先度は現在の公開サイトへの影響と、入力が揃っているかで決める。設計の記載順そのものを依存関係にはしない。

| 項目 | 確認した事実と影響 | 次の扱い |
|---|---|---|
| チャットのキーボード・読み上げ対応 | 本番で入力欄からEscapeを押しても閉じない。Tabで背面の「数字の内訳と出典」へ移動した。dialogの役割がなく、閉じる・送信ボタンの名前もない。`ChatModal.tsx:51–108`など | 計画5 Task 1。共有部品なので新旧両画面を検証 |
| 未取得の点の視認性 | `app/globals.css`のunknownは不透明度0.5。本番の計算済み色から求める隣接背景との比は暗いテーマ約2.53:1、明るいテーマ約2.11:1 | 計画5 Task 2。状態の意味を伝える点として3:1を目標に直す |
| ロゴ | `content/logos.ts`は空。Stack/Pluginsの本番画像数はどちらも0。Writingは媒体名、Contactは文字リンク。公式素材の調査・登録が残る | 計画5 Task 3。確認できない個別素材は名前表示を維持し、未確認として残す |
| Latestの自動選択 | `ToolEntry`に追加日がなく、`stackNotes.latest`が固定文字列。ツール追加では更新されない | 計画5 Task 4。初期申告を保ち、実際の追加日がある項目から選ぶ |
| Showcaseの追加機能 | 空なら本体とナビを隠す機能はあるが、全体の公開スイッチと使用ツールのフィールド・表示がない。画像は任意。`content/showcase.ts`、`ShowcaseSection.tsx` | 計画5 Task 5。公開用配列は空のまま、合成入力で確認 |
| コンテンツ検証の不足 | 未登録ロゴ名は検知するが、Showcase画像の実在確認はない。ロゴ画像確認は大文字小文字を厳密には比べない。`content/ai-profile.test.ts:18–29` | 計画5 Task 3・5。既存の厳密なパス検査に揃える |
| Careerの実績1行 | 会社名・役職・期間だけ表示。`BeyondAISection.tsx:11–13`。LINE/Lovegraphの既存公開情報は `content/projects.ts` にある | 計画5 Task 6。既存の情報を移し、他社の実績は推測しない |
| 共有リンクのメタ情報 | 本番の `og:url` は `https://soichiyo.dev`。共有画像は1638×1092だが宣言は1200×630。`app/layout.tsx`。設計の営業用途に関わる追加の修正項目 | 計画5 Task 6。現在の本番URLと実画像に合わせる |
| 設定と説明の古い記載 | VitestのaliasがURLのpathnameをそのまま使う。ESLint/Tailwindに既存警告2件。AGENTSにはRSSローダーの説明がない | 計画5 Task 7。軽微な保守として同時に整理 |
| Cursorの月次取り込み | ai-usageにCSV importer・import用の保存層がない。`src/merge.mjs`はmachinesとoverridesを扱うだけ。schemaはcursor/importを受け入れるが、実データは未掲載 | 後続のデータ側作業。下記の入力確認から始める |
| Pluginsの残り3統計 | 公開JSONはSkills triedの1件のみ。Skill runs / Top reasoning level / Fast modeの値・基準日は未提供 | 実装漏れではなくデータ待ち。数値を補わない |
| 公開するShowcase作品 | 公開用配列は空。本人が公開を選んだ作品は未提供 | 決定どおり非表示。機能の完成と作品の公開を分ける |
| クラウド実行分・追加Mac | 設計書で未確認のまま。今回のコード・公開サイト確認では確定できない | 別の収集範囲調査。bioの仕上げを止めない |

コントラスト値は、取得した背景色と前景色へ不透明度を合成して計算した値。全ページのWCAG適合を判定したものではない。通常文字・他の点・フォーカス・操作対象の大きさ・拡大表示は計画5で確認する。

## 削除しないものと、設計文書の読み替え

- `ProfileHeader`、旧画面の各Section、`PhotoGallery`と`react-masonry-css`は使用中。設計の「刷新後に未使用なら削除」を、旧デザインごと消す指示として扱わない。旧画面のMBTI・資格・Projectsも保持する。
- 初期設計の「固定表示したい記事」は計画4では採用していない。Writingは新着6件であり、既存3件は旧画面と媒体別の控え。
- 草の初期色は提案だった。現在の配色を直ちに不一致として差し戻さず、計画5では識別性・コントラストを優先する。ツール色を追加するだけで集計対象が増えるわけではない。公開スキーマの対応も要る。
- 「Cursorを含む1年分」は目標。現在は取得済みのClaude Code/Codexを表示し、Cursor未取得を明示している。欠損を0で埋めない。
- 以前のモック照合はPR #22・#23に記録がある。今回モックとの再比較はしていない。計画5は新しいレイアウトを決め直す作業ではない。

## Cursor取り込みの後続作業

実装先は `soichiyo/ai-usage`。bioへCSV解析や生データを持ち込まない。現在の公開 `usage.json` はClaude Code/Codexのみで、更新日時は2026-11-17 13:22:22 JST。画面側にはcursor/importを扱う型・計算・フィルターがある。

次の順に調べてから、データ側の実装計画を確定する。

1. 本人が提供した個人用CSVについて、列名、時刻のタイムゾーン、指定した期間、全件を取得できているかをローカルで確認する。CSVの実体、正式な列、取得可能期間は今回未確認。公式ドキュメントの候補URLは404で、個人用エクスポートの仕様を確認できなかった。
2. 入力・出力・キャッシュの内訳、totalの意味、キャッシュの二重計上、失敗・キャンセル・Autoなどの行の意味を確かめる。値のない行を0とみなさない。
3. JSTへ日別集計し、同じ期間のダッシュボードまたはCSVの独立計算と一致させる。選択期間の完全性が分からなければ、行がない日を利用ゼロとして公開しない。
4. 現在の `overrides.json` と別のimport層を設計する。優先順位は手修正 > import > 自動。再取込で二重加算せず、重複・期間の重なり・訂正版の置換を定義する。CursorをMac別に二重加算しない。
5. `src/merge.mjs`、`src/schema.mjs`、`bin/build-usage.mjs`、Build usageの起動対象へ接続する。生CSVを公開repoへ保存しない。今のignoreにはCSV用の保護がないので、入力はrepo外で読む構成にする。
6. 同じ入力の再実行、月境界、未取得/0、上書き優先、許可キーだけの公開をテストしてから、公開JSONとbioの集計・表示を突き合わせる。

足りない入力の持ち主は本人。再開条件は、対象期間が明確な個人用CSVと、ローカルでの内容確認が可能になること。公開する日別集計と生CSVを分け、公開前に既存のRisk Tiersを適用する。CSVがない間も計画5は進められる。

## 参照

- [WAI-ARIAのmodal dialogパターン](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): Escape、フォーカスの保持と復帰を確認する基準。
- [WCAG 2.2の文字コントラスト](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)、[非テキストのコントラスト](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html): 計画5の検証基準。今回公式ページの取得を確認。
- [ai-usageのmerge実装](https://github.com/soichiyo/ai-usage/blob/main/src/merge.mjs)、[schema](https://github.com/soichiyo/ai-usage/blob/main/src/schema.mjs)、[build workflow](https://github.com/soichiyo/ai-usage/blob/main/.github/workflows/build-usage.yml)。
