# 計画6に向けた設計と実装の再照合

確認日: 2026-11-17

## 結論

新ページ、利用データ、WritingのRSS、計画5の操作改善は実装済み。次は、作品やツールを正しく追加してもテストが失敗する問題と、ロゴの対応表に残る検証漏れを直す。未採用の公式ロゴは、取得元・条件を確認できた項目から仕上げる。

Cursorの取り込みは未実装。実CSVの形式・対象期間・トークンの意味が未確認なので、bioの作業と分ける。作品・追加の実績・統計は、公開する内容が決まるまで補わない。

次の実装範囲は[計画6](../plans/2026-11-17-content-readiness.md)。

## 照合した基点と確認範囲

- 正本: [AIプロフィール設計書](../specs/2026-11-16-ai-profile-redesign-design.md)。
- bio: [main 38072f2](https://github.com/soichiyo/bio/commit/38072f27e8db1e7fed9a13e3a37e44620a3fb8a7)。[計画5のPR #27](https://github.com/soichiyo/bio/pull/27)はマージ済み。GitHubのmainと手元が一致し、対応するVercel本番はReadyだった。
- ai-usage: [main 73e0350](https://github.com/soichiyo/ai-usage/commit/73e0350256578341ce341be09c3a6d5d05c2fb51)。GitHub上のコード・公開JSONを読み取りのみで確認した。
- bioの既存テストは21ファイル・160件すべて成功。追加時の問題は一時ディレクトリにコピーしたコードで再現し、公開データ・実装ファイルは変更していない。
- 本番の全操作、公式素材の配布サイト、Macの定期実行を今回すべて再検証したわけではない。計画5の確認と今回のコード照合を区別する。

## 設計項目ごとの状況

| 設計項目 | 確認済みの実装 | 残る作業・扱い |
|---|---|---|
| 新ページと旧デザイン | `app/page.tsx` が通常表示をAIProfilePage、legacyをLegacyBioPageへ分岐。旧画面は利用データ・RSSを取得しない | 方針は維持。再構築しない |
| 5指標・草・月別表 | `lib/usage/` と `components/usage/`。JST、53週、ツール別、欠落と0の区別、activeのみの最長時間、控え・遅延表示 | 実データ側のCursorが残る。bioの表示契約は実装済み |
| 利用データ集計 | ai-usageの `src/collect.mjs`、`src/merge.mjs`、`bin/build-usage.mjs`。Claude CodeとCodexを公開 | CursorのCSV取り込みは未実装。実CSVの確認が先 |
| Pluginsの統計 | `components/sections/PluginsSection.tsx` が公開snapshotsを表示 | 現在はskillsTriedのみ。ほかの値・基準日は入力待ち |
| Stack / Latest | `content/stack.ts`、`lib/stack/latest.ts`。追加日・hidden・未来・同率の規則を実装 | 正しい追加後に固定期待値のテストが失敗する。データの書式も整える |
| Showcase | `content/showcase.ts`、ShowcaseSection、AIProfileHeader。公開スイッチ・任意画像・使用ツール・URL検証 | 正しい公開データを足すとテストが失敗する。実作品の選定は別途必要 |
| ロゴ | `content/logos.ts`、LogoTile、ToolNames。Cursor / GitHub / Todoistを採用。未登録は文字表示 | 名前の対応表の検証漏れ、残る公式素材、画像追加時のWritingレイアウト |
| Writing | `lib/writing/`、WritingSection。Zenn/noteを新着順6件、6時間再検証、媒体別の控えと失敗表示 | RSSの再実装は不要。旧デザインの既存3記事を維持 |
| Beyond AI / Career | `content/ai-profile.ts`、BeyondAISection。LINE・Lovegraphの公開済み実績、資格・写真・家族 | ほかの実績は本人の文章と根拠待ち |
| チャット・キーボード・テーマ | ChatModalのdialog、IMEと15回制限のテスト、両テーマの状態色・操作対象を計画5で改善 | 今回、追加の操作不具合は再現していない。変更範囲の回帰確認は継続 |
| メタ情報・設定・CI | canonicalと画像寸法、パス解決、lint設定、型・テスト・buildのCI | 現在の残作業と設計の初期案の区別を明確にする |

## 再現できた追加時の問題

### 1. Showcaseを正しく公開してもテストが失敗する

対象は `content/ai-profile.test.ts` の「visibleShowcaseは空」と、`components/sections/ShowcaseSection.test.ts` の「公開スイッチはfalse、配列は空」という固定期待値。

一時コピーで対象2ファイルを実行すると12件成功した。次に `showcaseEnabled = true` とし、題名・説明・HTTPS URL・使用ツールを持つ合成1件を追加すると、同じ実行で2件失敗・10件成功した。

画面が現在空であることは決定どおり。ただしREADMEの手順で公開しようとすると、正しい追加でもCIが落ちる。表示規則は合成入力で検証し、実データには形式・参照・画像の検証を残す必要がある。公開スイッチを常にfalseとするテストを、作品公開の禁止条件として残さない。

再現コマンド: `npm test -- content/ai-profile.test.ts components/sections/ShowcaseSection.test.ts`（一時コピー内）。

### 2. 正しい追加日付きツールでもLatestのテストが失敗する

`lib/stack/latest.test.ts` は実際のStackを使い、結果をGemini 4.0に固定している。一時コピーの `stack[0].tools` に `{ name: "Fixture", addedAt: "2026-11-17" }` を追加すると、選択関数は正しくFixtureを返すが、テストは1件失敗・4件成功した。

再現コマンド: `npm test -- lib/stack/latest.test.ts`（一時コピー内）。

初期申告に戻る条件は日付なしの合成配列で検証し、実際のStackが今後変わることを許容する。実データの不正日付・重複・未知ロゴは引き続き失敗させる。

また、現在の `stack.ts` は文字列配列をmapしている。READMEが案内する `{ name, logo?, hidden?, addedAt? }` をそのまま1件追加できる形に揃える余地がある。既存の追加日を推測して埋める必要はない。

### 3. Writingだけの不正なロゴ対応が検査を通る

`content/ai-profile.test.ts` はロゴ画像とStack・Pluginsの参照を検査するが、`logoByName` の全対応を検査していない。

一時コピーで `logoByName` に `Zenn: "missing-logo"` を加えても、上記のcontent / Showcaseテスト12件は成功した。WritingとContactはこの対応表を直接使い、LogoTileは未知キーを文字表示へ戻すため、登録ミスが検出されない。

「対応がないので文字だけ」と「対応を登録したがキーが間違っている」を分ける。前者は有効、後者はコンテンツ検査で失敗させる。実行時の文字表示への復帰は維持する。

## 未確認の表示と素材

Writingの媒体欄は `components/sections/WritingSection.tsx` で幅40px。LogoTileは40pxの画像枠に名前と間隔を加える。現在Zenn/noteの画像は未登録なので、画像を追加した場合の重なりは未確認。実際のブラウザで再現してから必要な幅・配置だけを直す。公式素材が未取得でも、ローカル限定の合成入力で確認できる。

[素材台帳](../../assets/logos.md)では、採用済み3ブランドに対し、Claude Code、Codex、Muse Code、Grok Bot、T3 Code、Herdr、Notion、Gmail、Slack、Drive、Calendar、Zenn、note、X、Facebook、Instagram、LinkedInが文字表示のまま。

台帳にある403・404は計画5時点の取得結果であり、利用禁止の証拠ではない。今回その配布元を再取得してはいない。製品を特定できるものから公式情報を再確認し、取得元・利用条件・テーマ別素材が揃ったものだけ採用する。製品が曖昧な名前を親会社のロゴへ置換しない。

## データ側と本人の入力が必要な残作業

| 残作業 | 現在の根拠 | 必要な入力・担当 |
|---|---|---|
| Cursorの実データ | ai-usageのmergeはmachines・overrides・snapshotsを読む構成。CSV importerと専用の取り込み経路はない。公開sourcesはClaude Code / Codexのみ | 本人が対象期間の実CSVを用意し、データ側担当が列・単位・タイムゾーン・欠損・合計を確認 |
| 追加のPlugins統計 | 公開snapshotsはskillsTried=265、asOf=2026-11-16のみ。skillRuns / topReasoningShare / fastModeShareはない | 本人が公開する値・単位・基準日・根拠を決める。欠落を0で補わない |
| Showcase作品 | 公開スイッチfalse、配列空 | 本人が作品・説明・URL・使用ツールを選ぶ。画像は任意 |
| Careerの追加実績 | 既存の公開データで裏付けられる2社だけを表示 | 本人が公開してよい文章と根拠を提示 |
| 製品の同定とロゴ | 素材台帳に理由を記載 | 実装担当が公式情報を調べ、不明な製品名だけ本人へ確認 |
| クラウド実行・追加Mac・定期実行の実運用 | 設計書に確認項目あり。今回は再調査していない | 利用データ側で既知の実行・対象端末を突き合わせる。bioの表示修正は待たない |

公開JSONの確認時点は `generatedAt: 2026-11-17T04:22:22.615Z`。上の値を現在値として固定するための資料ではない。

Cursorの後続作業は、実CSVの確認後にai-usageで計画する。日別の取り込み値をどこに保存するか、手修正 > 取り込み > 自動集計の優先順位、同じ期間の再取り込み、修正版CSV、アカウント全体の値の二重加算防止、公開可能な項目だけの出力を決める。CLI・CIの起動条件・公開JSON・bioまで通して合計を突き合わせる。生CSVや非公開ログを公開repoへ入れない。

## 文書に残る差と計画6の優先順位

設計書には初期ページの説明、配色案、コンテンツ構造案、計画5を未来形で説明する箇所が残る。実装に合わせて、当初案・採用済み・未実装を分ける。Stackへの名前追加だけで利用データの収集対象まで増えるわけではないことも明記する。

1. 正しいコンテンツ追加を妨げるテストを直す。
2. ロゴの名前対応と実ファイルの検査を揃える。
3. 公式素材を確認できた項目から採用し、画像付きWriting / Contactの表示を確認する。
4. 設計書と追加手順を更新し、入力待ちを一か所へ集約する。

これは現在の本番障害の報告ではない。計画5で作った追加機能を、実際の次の追加でも使える状態にするための残作業である。
