# 計画5: AIプロフィールの操作性とコンテンツ追加機能を仕上げる

Date: 2026-11-17

このPRは設計との照合結果と実装計画だけを追加する。アプリ実装・マージ・本番公開は、実装の依頼を受けてから行う。

## 目的と優先順位

公開済みのAIプロフィールを維持しながら、キーボードで使えるチャット、判別できる表示、ロゴ、Latest・Showcaseの追加機能、Careerと共有リンクの不足を仕上げる。

正本は[設計書](../specs/2026-11-16-ai-profile-redesign-design.md)。今回の[照合結果](../research/2026-11-17-design-implementation-audit.md)に、実装済み・残作業・未確認を分けて記した。設計の段階5にはCursorも含まれるが、実CSVの形式・完全性が未確認で、実装先も別repoである。計画5はbio側に絞り、Cursorを待たずに使い勝手を改善する。

優先順は、実際に再現した操作の不足、視認性、ロゴとデータ追加機能、公開情報・保守の仕上げ。本番で確認した「Escapeで閉じない」「Tabで背面へ移る」を最初に直す。

## 基点・担当・境界

- 作業先: bio。現在のホスト設定ではローカル例外。開始時に最新main・未コミット変更・適用されるホスト設定を再確認する。今回の基点は[計画4を含むmain](https://github.com/soichiyo/bio/commit/3587a85c229a389ec6fec2ef052ec0f8cefdc0e6)。
- 実装と検証はこのrepoを担当するセッションが行う。新旧画面の入口は `app/page.tsx` と `lib/design-variant.ts`。公開は既存のGitHub/Vercel経路を使う。
- 利用データとRSSは公開済みの契約を維持する。集計式、取得元、再検証間隔、控えの値、公開用JSONを変えない。
- 旧デザインの本文・記事3件・順序・画像・レイアウトは保持する。共有ChatModalの操作改善と、サイト共通のメタ情報だけは旧画面にも適用し、両画面で確かめる。
- Cursor importer、ai-usageの編集、定期実行、秘密・認証・課金、チャットAPI・プロンプト・モデル、新しい実績や統計、Showcase作品の公開は対象外。
- UIフレームワークは追加しない。ロゴは確認できた公式素材をローカルへ置く。取得先や利用条件が不明な素材を推測で採用しない。
- 小さな作業ブランチで進め、実装は原則1本の日本語PRにまとめる。コミットとPRにAI署名を入れない。

## 完成時の扱い

### ロゴ

共通の小さな表示部品を用意し、Stack・Plugins・Writing・新ページContactに使う。文字の名前・リンクを残し、ロゴだけで対象を区別させない。表示名と同じ意味の画像は装飾として扱い、読み上げを重複させない。

登録は名前からローカル画像への対応とする。暗い背景と明るい背景で公式の別素材が必要なら両方を登録する。任意の色変換でブランドの形・色を作り替えない。HTML・スクリプト・外部参照を含むSVGは採用しない。

`docs/assets/logos.md` に採用名、公式の取得元、利用条件の参照先、確認日、ローカルパス、テーマ別の扱いを記録する。素材不明・製品同定ができない項目は、理由付きで文字表示のまま残す。Muse Code・Grok Bot・Harnessの名称から別製品のロゴを勝手に割り当てない。ロゴの未確認を「全ロゴ対応済み」と報告しない。

### Latest

既存の「Gemini 4.0・本人申告2026-11-16」を初期値として残す。Geminiを新しいStack行へ追加したり、既存ツールの利用開始日を推測したりしない。

Stackの項目へ任意の `addedAt: YYYY-MM-DD` を持たせる。ここでの日付は実際に追加した日で、日付が分かるものだけ記入する。表示対象のツールのうち、初期申告日より新しく、今日以下の日付で最も新しい項目をLatestにする。該当なしなら初期申告を使う。同日の同率は配列順で安定させる。

`hidden: true`、日付なし、未来の日付は候補にしない。不正日付はコンテンツ検査で失敗させる。選択関数にはJSTの今日を引数で渡し、テストで時刻を固定できるようにする。本文には「追加日」か「本人申告」を区別して示す。

### Showcase

`content/showcase.ts` に全体の公開スイッチを置き、初期値はfalse、公開用配列は空のままにする。全体スイッチがfalse、または表示できる項目が0なら、本体とナビの両方を隠す。

項目には題名、一言、URL、使用ツール、任意の画像、個別のhiddenを持たせる。使用ツールは共通の `ToolEntry[]` で、明示した名前と任意の登録済みロゴを持つ。空名・重複・未登録ロゴを検知する。画像なしは既存の文字カードを維持し、画像を指定したときだけ実在と大文字小文字を検査する。画像置き場は `public/assets/showcase/`。

有効なHTTPS URLであることも検証する。`https://`で始まるだけの不正URLや認証情報入りURLを通さない。個人の作品が選ばれるまでは、合成項目だけで表示・非表示を検証する。

### Careerと共有リンク

LINE・Lovegraphの実績は、すでに `content/projects.ts` で公開している情報を新ページのCareerに1行ずつ添える。新しい成果数値や担当範囲を足さない。旧画面が読む配列・export・スナップショットは変えず、新ページ用の補足データへ分ける。

既存情報だけでは書けない会社の実績は省略し、本人の追記待ちとして残す。全行を埋めるための創作はしない。

共有用メタ情報の正規URLを `https://www.soichiroyoshimura.com` に揃える。既存画像を使い、画像サイズの宣言を実寸へ合わせる。タグラインは現在の公開プロフィールから使い、別の経歴紹介を新しく書かない。

## 実装タスク

各TaskのExpectedを確認してから次へ進む。個別の公式素材や実績の不足は、その項目だけを保留し、独立した作業を進める。

### Task 1: チャットのフォーカスと操作名を直す

**Files:** Modify `components/ui/ChatModal.tsx`, `components/ui/ChatButton.tsx`。必要に応じてCreate `components/ui/ChatModal.test.ts`。

1. 現状の本番モードで、Hero・Contact・旧画面の入口から開いた状態を記録する。入力を送信せずEscapeとTabの不足を再現する。
2. ネイティブdialogなど、既存環境でモーダルの意味と背面の操作禁止を満たせる方式へ変える。見出しとの関連、入力欄の名前、閉じる・送信・再試行の操作名を与える。
3. 開いたときに入力へフォーカスし、Tab / Shift+Tabを内部に保つ。Escape、閉じるボタン、既存の背景クリックで同じ終了処理を通し、開いたボタンへフォーカスを戻す。複数の入口から開閉できることを確かめる。
4. 既存の会話・入力・回数のリセットと15回制限を維持する。日本語変換中のEnterは送信しない。送信処理の確認はローカルの代替transportで行い、公開APIへ検証用の会話を送らない。

**Run:** `npm run type-check && npm run lint && npm test`。続いて `npm run build && npm run start` で実ブラウザ確認。

**Expected:** Escapeで閉じる。フォーカスが背面へ出ず、閉じたら元の入口へ戻る。名前のない操作ボタンがない。新旧画面から使え、入力・送信中・エラー・上限の状態でも閉じられる。送信先やAPI契約は変わらない。

### Task 2: 両テーマの視認性と操作を検証する

**Files:** Modify `app/globals.css`。必要な場合だけ `components/sections/UsageHeatmap.tsx`, `components/usage/UsageDayDetail.tsx`, `components/usage/UsageMonthTable.tsx` とTask 1の部品。

1. 本番モードで暗い/明るいテーマ、1280px/390pxを確認する。通常文字、ラベル、各ツールの点、未取得・一部未取得・0、フォーカスの計算済み色を測る。
2. 通常文字4.5:1、大きな文字3:1、意味を伝える点・状態・操作の識別に必要な境界3:1を基準に、実際に不足した箇所を修正する。現在unknownにある不透明度も合成後の色で評価する。新しい色指定は原則 `.ai-profile` の内側に置く。
3. Tabの順、草の矢印キー・Home・End・Enter・Escape、フィルター、月別表、RSS詳細、写真拡大、チャットを通して確認する。拡大200%でも内容・操作を失わず、ヒートマップ以外のページ全体を横へはみ出させない。
4. 色だけで状態を伝えず、既存の文字・詳細・表を維持する。小さい操作対象は間隔も含めて確認する。reduced-motion時の移動とアニメーションも実ブラウザで確かめる。

**Run:** `npm run type-check && npm run lint && npm test` とブラウザ検証。UIの単体テストだけでコントラストやフォーカスの実確認を済ませない。

**Expected:** unknownを含む状態を両テーマで識別できる。キーボード操作・フォーカス・拡大表示の確認結果を残す。新旧の本文・画像・データ計算が変わらない。全体のアクセシビリティ適合認証をしたとは表現しない。

### Task 3: 公式ロゴを登録して新ページへ表示する

**Files:** Modify `content/logos.ts`, `content/stack.ts`, `content/plugins.ts`, `content/ai-profile.test.ts`, `components/ToolNames.tsx`, `components/sections/WritingSection.tsx`, `components/pages/AIProfilePage.tsx`。Create `components/ui/LogoTile.tsx`, `docs/assets/logos.md`, `public/assets/logos/*`。必要に応じてCreate `components/ui/LogoTile.test.ts`。

1. 現在の公開名だけを対象に公式素材・利用条件・製品との対応を確認する。StackとPlugins、Zennとnote、新ページContactで共通するブランドは同じ登録を使う。ローカルのスキル・接続先一覧を収集して公開項目を増やさない。
2. 採用できる素材をローカルへ置き、ロゴの登録と文字へのフォールバックを実装する。空・不正なキーを通さず、画像の存在とパスの大文字小文字も検査する。未確認素材は文書へ分ける。
3. 名前があるロゴ画像は空altとし、リンクやボタンの操作名を文字から読めるようにする。暗い/明るい背景で正しく見える公式素材を選ぶ。無理な色反転は使わない。
4. Stack・Plugins・Writing・Contactへ適用する。媒体・SNSリンクのURLと記事の並びは維持する。旧デザインのWritingsSectionとContactSectionへは広げない。

**Run:** `npm test -- content components/sections/WritingSection.test.ts`、ロゴ用テストを追加した場合はそのテスト、型・lint・build、両テーマのブラウザ確認。

**Expected:** 採用素材の出所を追え、未登録キー・欠損画像・パスの大小文字違いで検査が失敗する。画像がない項目も名前で分かる。確認できたロゴと文字のままの項目をPRで区別する。

### Task 4: Latestを追加日から選べるようにする

**Files:** Modify `content/stack.ts`, `content/logos.ts`, `content/ai-profile.test.ts`, `components/sections/StackSection.tsx`, `components/pages/AIProfilePage.tsx`。Create `lib/stack/latest.ts`, `lib/stack/latest.test.ts`。

1. 任意の追加日と、現在の初期申告を別の情報として定義する。既存ツールの日付は空欄のままにし、初期値を保つ。
2. 上のLatestの選択規則を純粋な関数へ分け、AIProfilePageがすでに持つJSTのtodayを渡す。
3. 新規1件で更新、初期値へ戻る、hidden、未来、日付なし、同日、不正日付を合成入力で確認する。ツールがすべてhiddenの役割見出しも隠す。

**Run:** `npm test -- lib/stack content`、型・lint。日付の選択テストは `TZ=UTC` と `TZ=Asia/Tokyo` の両方で実行。

**Expected:** 現在の表示はGemini 4.0と申告日のまま。以後は実際の追加日を持つツールを1件足せばLatestが変わる。架空の日付や現在の利用事実を追加しない。

### Task 5: Showcaseの公開スイッチと使用ツールを揃える

**Files:** Modify `content/showcase.ts`, `content/ai-profile.test.ts`, `components/sections/ShowcaseSection.tsx`, `components/AIProfileHeader.tsx`。Create `components/sections/ShowcaseSection.test.ts`。必要なら `public/assets/showcase/.gitkeep`。

1. 全体スイッチ・個別hidden・使用ツールを追加し、ナビと本文で同じ可視性の判定を使う。
2. 項目追加後の題名・説明・使用ツール・画像・リンクを合成データで確認する。使用ツールは明示した名前だけを表示する。
3. 全体off、on+空、on+全件hidden、on+1件、画像なし、画像指定だが不在、未知ロゴ名、不正URLを検証する。画像がある場合の厳密なパス検査を足す。
4. 公開用配列にテスト用作品を残さず、全体スイッチはfalseで維持する。

**Run:** `npm test -- content components/sections/ShowcaseSection.test.ts`、型・lint・build。合成1件のブラウザ表示はローカルだけで確認し、その差し替えを戻す。

**Expected:** 公開用データではShowcase本体もナビも出ない。スイッチを有効にして正しい1件を足せば両方が表示される。画像やリンクを壊した項目は検査で発見できる。

### Task 6: Careerの既存実績と共有メタ情報を反映する

**Files:** Modify `content/ai-profile.ts`, `content/ai-profile.test.ts`, `components/sections/BeyondAISection.tsx`, `app/layout.tsx`。必要に応じてCreate `components/sections/BeyondAISection.test.ts`, `app/layout.test.ts`。

1. LINE・Lovegraphについて `content/projects.ts` の公開情報から実績の補足を作り、対応するCareer行へ1行表示する。新ページ用データに会社との対応・表示文・既存の出典URLを明示し、配列順だけで対応付けない。
2. 他の会社の実績を補わない。旧画面のprojects/workExperiencesは変更しない。追加文で新しい数値・担当範囲を主張していないことを差分で確かめる。
3. metadataBase・OG URL・canonicalを現在の本番URLへ揃え、design/viewの切替パラメータを正規URLへ持ち込まない。共有画像は既存ファイルの実寸を取得して宣言を合わせる。
4. ページの表示と公開HTMLのmetaを別々に確認する。SNS側のキャッシュ更新までは完了条件に含めない。

**Run:** 関連テスト、`npm run type-check && npm run lint && npm run build`。ローカル本番モードで通常表示・旧画面のHTMLと画像の寸法を確認。

**Expected:** 確認できる既存実績だけがCareerへ出る。旧デザインのスナップショットはそのまま通る。metaのURL・画像寸法・タグラインが現在の公開内容に一致する。

### Task 7: 設定・設計・運用説明を揃える

**Files:** Modify `vitest.config.ts`, `eslint.config.mjs`, `tailwind.config.mjs`, `README.md`, `DESIGN_DIRECTION.md`, `AGENTS.md`, `docs/superpowers/specs/2026-11-16-ai-profile-redesign-design.md`。

1. VitestのURL→ファイルパス変換を `fileURLToPath` にする。空白・日本語を含む一時ディレクトリに最小の設定とimport対象を置き、既存の依存を参照してaliasが解決することを確認する。
2. ESLint/Tailwindの匿名default export警告2件を、設定値を変えずに解消する。今回触らない依存や古いCSSを一括で削除しない。
3. READMEにロゴの登録と文字表示、Latestの追加日、Showcaseの公開スイッチと使用ツール、実績の追記方法を記す。DESIGN_DIRECTIONに採用した配色・操作・ロゴの扱いを反映する。
4. 設計書の初期状態と現在を区別する。固定記事を採用していないこと、Showcase画像の任意性、初期Latestの維持、Cursorが別作業であることを揃える。過去の決定を消さない。
5. AGENTSでは既存説明を短く置き換えてRSSと現行部品を反映する。手順やルールを追加で積み上げない。未確認素材・実績・CSV入力は一か所へまとめる。

**Run:** `npm run type-check && npm run lint && npm test && npm run build`、`git diff --check`、文書リンク確認と日本語検査。

**Expected:** aliasがパス名によらず解決し、対象のlint警告2件が消える。実装と文書が一致する。利用データ/RSSの既存テストを削ったり期待値を書き換えたりして通さない。

### Task 8: 新旧画面の最終検証、日本語PR、本番確認

**Files:** 実装の差分と公開確認の記載。検証だけの入力・ルート・スクリーンショットを公開コードへ残さない。

1. 最新mainの差分を確認し、型・lint・全テスト・buildを通す。1280px/390px、両テーマ、新旧画面でTask 1〜6を通して確認する。横はみ出し・hydration不一致・console error、名前のない操作、背面へのフォーカス移動がないことを確かめる。
2. 利用データとRSSの表示が変更前の契約を保つことを確認する。実データの更新による数値・記事の変化を固定値で抑えず、同じ入力で比較する。旧画面の本文・記事3件・順序・画像を比較し、旧画面で両ローダーが呼ばれない入口テストも通す。
3. 日本語PRに各TaskのExpected、採用ロゴと文字表示の残り、Careerの記載範囲、Cursorなど別作業の残りを記す。CIとVercelプレビューを確認する。
4. 実装・公開まで依頼された場合は、正常な本番の切り戻し先を確認してマージする。本番Readyとソースの一致を確認し、公開URLでチャット開閉、ロゴ、Latest、Showcase非表示、Career、meta、新旧画面を確認する。チャットへ検証用メッセージを送る必要はない。

**Run:** `npm run type-check && npm run lint && npm test && npm run build`、プレビューと本番のブラウザ確認、GitHubとVercelの公開結果確認。

**Expected:** 計画5の実装範囲が本番で使える。ローカル・プレビュー・マージ済み・本番確認を区別して報告する。Cursorの実データ、未確認の個別素材、新しい作品や実績を完成したことにしない。

## 未確認と停止条件

| 項目 | 持ち主・必要な入力 | 止める範囲・再開条件 |
|---|---|---|
| 一部製品の公式ロゴ・利用条件 | 実装担当が公式情報を調査。名称だけでは製品を特定できない場合は本人 | 該当素材の採用だけ保留。確定するまで名前表示を維持 |
| 既存公開情報にないCareer実績 | 本人が公開してよい文と根拠を提示 | 該当行の追記だけ保留。既存の役職・期間は表示 |
| Cursorの実CSV | 本人が対象期間を指定して提供。後続担当が形式・合計・欠損を確認 | データ側の取り込みだけ保留。bioの計画5は進める |
| 新しい統計・Showcase作品 | 本人が公開する情報を選ぶ | 公開データへの追記だけ保留。仕組みは合成入力で検証 |
| 新旧画面の回帰、集計結果の変化、キーボード操作の失敗 | 実装担当 | 原因を直すまで公開を止める。未確認のままExpectedを完了にしない |
| 新しい認証・課金・非公開データ送信が必要になった | 本人の対象を限定した承認 | 該当操作を止め、既存のRisk Tiersで扱う。今回の仕上げへ黙って追加しない |

## 今回の計画作成の完了条件

照合結果とこの計画をコミットし、1本の日本語PRを作成する。アプリコードは変更せず、計画PRをマージ・デプロイしない。実装時の完了条件は各TaskのExpectedと、依頼された場合の本番確認である。
