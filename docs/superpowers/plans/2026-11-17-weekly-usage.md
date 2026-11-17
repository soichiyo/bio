# 計画7: Token usage を週別・合算にし、日別データを非公開にする Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Token usage を全ツール合算・週別・直近26週・丸1個5億トークンの表示に変え、日別の値がサイトにも公開リポジトリにも出ない状態にする。

**Architecture:** `ai-usage` の GitHub Actions が、日別の `usage.json` に加えて週別・合算の `weekly.json` を作る。bio は `weekly.json` だけを GitHub の API から読み、日別を扱うコードと控えを消す。そのあと `ai-usage` を非公開にし、サイトは Vercel の環境変数の鍵で読む。

**Tech Stack:** ai-usage は Node 22.15 以上・依存なし・`node:test`。bio は Next.js 15 / React 19 / TypeScript / Tailwind / Vitest。

**Spec:** `docs/superpowers/specs/2026-11-17-weekly-usage-design.md`（親は `2026-11-16-ai-profile-redesign-design.md`）

計画6（コンテンツ追加の検証とロゴ）とは別の作業。触るファイルが重なるのは `README.md` と親の設計書だけなので、どちらを先にしてもよい。日別データの公開を止める作業なので、こちらを先にすることを勧める。

## Global Constraints

- 丸1個 = 500,000,000 トークン。丸の数は `tokens === 0 ? 0 : Math.ceil(tokens / 500_000_000)`。
- 表示は直近26週。週は日曜始まり、日付の区切りは Asia/Tokyo。
- bio のコード・控え・ブラウザに届く HTML に、日別・ツール別のトークン数を残さない。
- 鍵の値を、コード・テスト・ログ・エラー文・PR・報告に出さない。環境変数名は `AI_USAGE_TOKEN`。
- 旧デザイン（`?design=legacy`）の表示を変えない。RSS、チャット、Stack、Showcase を変えない。
- `ai-usage` の集計（launchd、ccusage、`machines/*.json`、`usage.json`）の動きを変えない。
- 作業ブランチは `codex/*`、日本語の PR。コミットと PR にAIの署名を入れない。
- Task 7 と Task 8 は、鍵の作成とリポジトリの公開範囲の変更を含む。本人の操作と明示の確認を待つ。Task 1〜6 はそれを待たずに進める。

## Review Focus

1. 鍵が無い・期限切れ・権限不足のとき、ページが落ちず、控えの表示になるべき。エラーに鍵や応答の本文が混ざらないべき。→ Task 3
2. データの最後の週が古い（集計が止まっている）とき、今週の柱を 0 として描いたり、連続を 0 にしたりせず、「更新待ち」にするべき。→ Task 4
3. 9個以上の丸が要る週（40億超）が出ても、柱が切れたりはみ出したりしないべき。→ Task 4、Task 5
4. 年またぎと、日曜ちょうど・土曜の深夜（JST）の週の区切りが正しいべき。→ Task 1、Task 4
5. 非公開化のあと、サイトが控えの表示に落ちたまま気づかれない、を避ける。→ Task 8

---

## A. ai-usage リポジトリ

### Task 1: 週別・合算の `weekly.json` を作る

**Files:**
- Create: `src/weekly.mjs`, `src/weekly.test.mjs`
- Modify: `src/schema.mjs`, `src/schema.test.mjs`, `bin/build-usage.mjs`, `.github/workflows/build-usage.yml`, `README.md`

**Interfaces:**
- Consumes: `buildUsage` の戻り値（日別の `usage`）、`TOOLS`
- Produces:
  - `sundayOf(date: string): string` — `YYYY-MM-DD` を、その週の日曜の `YYYY-MM-DD` にする。
  - `buildWeekly(usage): Weekly` — 設計書「データ」の形を返す。返す前に `validateWeekly` を通す。
  - `validateWeekly(obj): void` — 知らないキー、欠けた週、日曜でない `week`、負や小数の値を拒否する。

決まり:
- `coverage.from` は `usage.sources` の中でいちばん古い `coverage.from` の週、`coverage.to` はいちばん新しい `coverage.to` の週。
- `weeks` はその間を1週1行、昇順。`tokens` は、その週に入る `usage.daily` の全ツールの値の合計。行の無い日と、キーの無いツールは 0 として足す。
- `tools` は `usage.sources` のキーを `TOOLS` の順に並べたもの。
- `longestRun` は `usage.longestRun.rule === "active"` のときだけ `{ seconds, tool, week: sundayOf(date) }`。
- `generatedAt`、`collectors`、`snapshots` は `usage` のものをそのまま。

- [ ] **Step 1: `src/weekly.test.mjs` を書く**

```js
test("sundayOf", () => {
  assert.equal(sundayOf("2026-11-15"), "2026-11-15"); // 日曜
  assert.equal(sundayOf("2026-11-21"), "2026-11-15"); // 土曜
  assert.equal(sundayOf("2026-01-01"), "2025-12-28"); // 年またぎ（木曜）
});
test("週ごとに全ツールを合算する", () => {
  const w = buildWeekly(usage({
    sources: { "claude-code": cov("2026-11-10", "2026-11-17"), codex: cov("2026-11-03", "2026-11-17") },
    daily: [
      { date: "2026-11-03", tokens: { codex: 5 } },
      { date: "2026-11-14", tokens: { "claude-code": 10, codex: 20 } },
      { date: "2026-11-15", tokens: { "claude-code": 1, codex: 2 } },
      { date: "2026-11-17", tokens: { codex: 4 } },
    ],
  }));
  assert.deepEqual(w.coverage, { from: "2026-11-01", to: "2026-11-15" });
  assert.deepEqual(w.weeks, [
    { week: "2026-11-01", tokens: 5 }, { week: "2026-11-08", tokens: 30 }, { week: "2026-11-15", tokens: 7 },
  ]);
  assert.deepEqual(w.tools, ["claude-code", "codex"]);
});
test("使っていない週も 0 で1行出す", () => { /* 3週のうち中の週に行が無い → tokens: 0 の行がある */ });
test("longestRun は active のときだけ、週で出す", () => {
  /* { seconds: 47175, tool: "codex", date: "2026-09-09", rule: "active" } → { seconds: 47175, tool: "codex", week: "2026-09-06" }
     rule: "raw" → longestRun キーなし */
});
test("日別・ツール別の値が出力に残らない", () => {
  const text = JSON.stringify(buildWeekly(usage()));
  assert.ok(!/"daily"|"sources"|"date"/.test(text));
});
test("validateWeekly は知らないキー・欠けた週・日曜でない週を拒否する", () => { /* 3つの否定例 */ });
```

- [ ] **Step 2: 落ちることを確かめる** — Run: `npm test`
- [ ] **Step 3: 実装する** — `bin/build-usage.mjs` は `usage.json` を書いたあと、同じ `usage` から `weekly.json` を書く。`build-usage.yml` の `git add` に `weekly.json` を足す。
- [ ] **Step 4: 実データで確かめる**

Run: `npm test && node bin/build-usage.mjs && node -e "const w=require('./weekly.json');const m=Object.fromEntries(w.weeks.map(x=>[x.week,x.tokens]));console.log(w.weeks.length,m['2026-09-06'],m['2026-11-08'])"`
Expected: 全テスト PASS。`2026-09-06` の週が 3,923,689,427、`2026-11-08` の週が 975,651,766（2026-11-17 13時の集計時点の値。過去の週なので変わらないはず）。週の数は62以上。

- [ ] **Step 5: README の公開項目の説明を直し、PR を作ってマージする**

マージ後、Actions が `weekly.json` を `main` に作ることを確かめる。

---

## B. bio リポジトリ

### Task 2: 型・検証・控えを週別に替える

**Files:**
- Modify: `lib/usage/types.ts`, `lib/usage/schema.ts`, `lib/usage/schema.test.ts`, `lib/usage/__fixtures__/usage.ts`, `content/usage-fallback.json`

**Interfaces:**
- Produces:
  - `type WeeklyUsage = { schemaVersion: 1; generatedAt: string; collectors: { machine: MachineId; collectedAt: string }[]; tools: ToolId[]; coverage: { from: string; to: string }; weeks: { week: string; tokens: number }[]; longestRun?: { seconds: number; tool: "claude-code" | "codex"; week: string }; snapshots: … }`
  - `type UsageResult = { data: WeeklyUsage; origin: "remote-cache" | "bundled" } | { data: null; origin: "unavailable" }`
  - `parseUsage(value: unknown): WeeklyUsage` — 既存の名前のまま、週別の形だけを受け付ける。日別の形（`daily` を持つ）は拒否する。
- `content/usage-fallback.json` は、Task 1 でできた `weekly.json` をそのまま保存したもの。

- [ ] **Step 1: テストを書く** — 設計書の例が通る。`daily` や `sources` を持つ古い形、知らないキー、日曜でない `week`、昇順でない・欠けた `weeks`、負の値をそれぞれ拒否する。`content/usage-fallback.json` が `parseUsage` を通り、文字列 `"daily"` を含まない。
- [ ] **Step 2: 落ちることを確かめる**
- [ ] **Step 3: 実装する**
- [ ] **Step 4: `npm test -- lib/usage/schema` が通ることを確かめてコミット**

### Task 3: 取得先を `weekly.json` にし、鍵に対応する

**Files:**
- Modify: `lib/usage/tools.ts`, `lib/usage/load-core.ts`, `lib/usage/load.ts`, `lib/usage/load.test.ts`

**Interfaces:**
- Produces:
  - `USAGE_URL = "https://api.github.com/repos/soichiyo/ai-usage/contents/weekly.json"`
  - `fetchValidatedUsage(fetcher = fetch, token = process.env.AI_USAGE_TOKEN): Promise<WeeklyUsage>` — ヘッダーは `Accept: application/vnd.github.raw+json` と `X-GitHub-Api-Version: 2022-11-28`。`token` が空でないときだけ `Authorization: Bearer <token>` を足す。
  - キャッシュのキーを `bio-usage-weekly-v1` に変える。再取得は3600秒のまま。

- [ ] **Step 1: `lib/usage/load.test.ts` を書き換える**

```ts
it("鍵があれば Authorization を付ける", async () => {
  const spy = vi.fn(async () => Response.json(weekly()));
  await fetchValidatedUsage(spy, "t0ken");
  const init = spy.mock.calls[0][1];
  expect(spy.mock.calls[0][0]).toBe(USAGE_URL);
  expect(new Headers(init.headers).get("authorization")).toBe("Bearer t0ken");
  expect(new Headers(init.headers).get("accept")).toBe("application/vnd.github.raw+json");
});
it("鍵が無ければ Authorization を付けない", async () => {
  const spy = vi.fn(async () => Response.json(weekly()));
  await fetchValidatedUsage(spy, "");
  expect(new Headers(spy.mock.calls[0][1].headers).has("authorization")).toBe(false);
});
it.each([401, 403, 404])("%i のときは鍵や本文を含まないエラーにする", async status => {
  const spy = vi.fn(async () => new Response("secret body t0ken", { status }));
  const error = await fetchValidatedUsage(spy, "t0ken").catch(e => e);
  expect(String(error.message)).toBe("USAGE_FETCH_FAILED");
  expect(JSON.stringify(error, Object.getOwnPropertyNames(error))).not.toContain("t0ken");
});
it("取得に失敗したら週別の控えを返す", async () => {
  const result = await resolveUsage(async () => { throw new Error("x"); }, bundled);
  expect(result.origin).toBe("bundled");
});
```

- [ ] **Step 2: 落ちることを確かめる**
- [ ] **Step 3: 実装する**
- [ ] **Step 4: 通ることを確かめてコミット**

### Task 4: 週別の計算

**Files:**
- Create: `lib/usage/weekly.ts`, `lib/usage/weekly.test.ts`
- Delete: `lib/usage/daily.ts`, `lib/usage/heatmap.ts`, `lib/usage/heatmap.test.ts`, `lib/usage/metrics.ts`, `lib/usage/metrics.test.ts`

**Interfaces:**
- Consumes: `WeeklyUsage`、`sundayOf`・`addDays`（`lib/usage/dates.ts`）
- Produces:
  - `DOT_TOKENS = 500_000_000`、`CHART_WEEKS = 26`、`MIN_ROWS = 8`
  - `dotsFor(tokens: number): number`
  - `buildChart(usage: WeeklyUsage, today: string): { columns: { week: string; tokens: number | null; dots: number; inProgress: boolean }[]; rows: number }` — `sundayOf(today)` を右端にした26週。データに無い週は `tokens: null`・`dots: 0`。`inProgress` は右端の週で、かつデータがあるときだけ `true`。`rows` は `Math.max(8, 丸の数の最大)`。
  - `summarizeUsage(usage: WeeklyUsage, today: string, now: Date): { totalTokens: number; peak: { week: string; tokens: number } | null; longestRun: WeeklyUsage["longestRun"] | null; longestStreak: number; currentStreak: number | null; stale: boolean }`
  - `collectorsAreStale(usage, now)` は今の実装をそのままここへ移す。

連続の数え方: `tokens > 0` の週が続いた数。`currentStreak` は、今週の `tokens > 0` なら今週から、そうでなければ先週から遡る。データの最後の週が先週より古いとき、または `stale` のときは `null`。

- [ ] **Step 1: `lib/usage/weekly.test.ts` を書く**

```ts
it("丸は5億ごとに切り上げる", () => {
  expect(dotsFor(0)).toBe(0);
  expect(dotsFor(1)).toBe(1);
  expect(dotsFor(300_000_000)).toBe(1);
  expect(dotsFor(500_000_000)).toBe(1);
  expect(dotsFor(500_000_001)).toBe(2);
  expect(dotsFor(1_100_000_000)).toBe(3);
  expect(dotsFor(3_923_689_427)).toBe(8);
});
it("右端は今週で26本、古い順に並ぶ", () => {
  const chart = buildChart(weeklyFrom("2025-09-14", "2026-11-15"), "2026-11-17");
  expect(chart.columns).toHaveLength(26);
  expect(chart.columns[0].week).toBe("2026-05-24");
  expect(chart.columns[25]).toMatchObject({ week: "2026-11-15", inProgress: true });
});
it("土曜の深夜と日曜の0時（JST）で右端が切り替わる", () => {
  expect(buildChart(data, "2026-11-14").columns[25].week).toBe("2026-11-08");
  expect(buildChart(data, "2026-11-15").columns[25].week).toBe("2026-11-15");
});
it("データが古いとき、無い週は null で、0 として描かない", () => {
  const chart = buildChart(weeklyFrom("2026-01-04", "2026-11-01"), "2026-11-17");
  expect(chart.columns[25]).toMatchObject({ week: "2026-11-15", tokens: null, dots: 0, inProgress: false });
  expect(chart.columns[23].tokens).not.toBeNull();
});
it("9個以上の週があれば rows が伸びる", () => {
  expect(buildChart(withWeek("2026-11-08", 4_600_000_000), "2026-11-17").rows).toBe(10);
  expect(buildChart(withWeek("2026-11-08", 100), "2026-11-17").rows).toBe(8);
});
it("合計・最大の週・連続", () => {
  // 週: 11-01=5, 11-08=0, 11-15=7 ／ today 2026-11-17
  expect(s.totalTokens).toBe(12);
  expect(s.peak).toEqual({ week: "2026-11-15", tokens: 7 });
  expect(s.longestStreak).toBe(1);
  expect(s.currentStreak).toBe(1);
});
it("今週が 0 なら先週から数える", () => { /* 11-01=5, 11-08=3, 11-15=0 → currentStreak 2 */ });
it("データの最後が先週より古ければ currentStreak は null", () => { /* 最後の週 2026-11-01、today 2026-11-17 */ });
```

- [ ] **Step 2: 落ちることを確かめる**
- [ ] **Step 3: 実装し、消すファイルを消す** — 消したファイルを import している箇所は Task 5 で直すので、このタスクのコミットは Task 5 とまとめてよい。

### Task 5: 画面を替える

**Files:**
- Create: `components/sections/UsageWeekly.tsx`, `components/sections/UsageWeekly.test.ts`
- Delete: `components/sections/UsageHeatmap.tsx`, `components/usage/UsageDayDetail.tsx`, `components/usage/UsageMonthTable.tsx`
- Modify: `components/sections/StatStrip.tsx`, `components/usage/UsageStatus.tsx`, `components/pages/AIProfilePage.tsx`, `lib/usage/tools.ts`, `lib/usage/format.ts`, `app/globals.css`、これらのテスト

**Interfaces:**
- Consumes: `buildChart`、`summarizeUsage`、`dotsFor`
- Produces: `UsageWeekly({ usage, today })` — サーバー側で描く部品（`"use client"` を付けない）。

画面の決まり（見た目はモックに合わせる）:

- 見出し「Token usage」、右に「Last 26 weeks · Weekly · All tools」。
- 26本の柱。各柱は下から `dots` 個の丸、残りは空き。丸の色は `hsl(var(--foreground))`、今週（`inProgress`）は `hsl(var(--muted-foreground))`。`tokens: null` の柱は空のまま。
- 柱の下に月の名前。月が変わる最初の柱にだけ出す。
- 凡例は「● = 5億 tokens」と、今週の色の「集計中」。
- 図全体は `role="img"` で、`aria-label` に期間・最大の週・その値を入れる。各柱の `title` は「2026-09-06の週: 3,923,689,427 tokens」の形。
- `<details>` で「週別の表」を開ける。列は、週の開始日・Tokens・丸の数。今週の行に「集計中」、`null` の週に「未取得」。
- 幅390pxでは図だけを横スクロールにし、ページ全体は横に動かさない。
- `StatStrip` の5項目と補足は設計書「数字の帯」の表の通り。Longest run の補足は `Codex · 2026-09` の形（`week` の年月）。
- `UsageStatus`: 「当日分は途中の値です」を「今週分は途中の値です」に。ツール別の取得期間と「公開データを見る」のリンクを消す。内訳の説明は「`tools` の名前を並べたもの + の合算です」と、全体の `coverage`、Mac ごとの最終集計。「1日の最大」を「週の最大」に。
- `lib/usage/tools.ts` からツールの色を消し、`app/globals.css` の `--usage-codex` などの変数と、使わなくなった `.usage-*` のクラスを消す。

- [ ] **Step 1: テストを書く** — 既存の部品テストと同じやり方で、次を確かめる。丸の合計が `columns` の `dots` の合計と一致する。`inProgress` の柱だけ今週の色のクラスを持つ。ツールの絞り込みボタンが無い。出力に「日」単位の日付の一覧や `claude-code` 別の値が無い。`rows` が10のとき、10個の丸が1本の柱に入る。データが無いときは「利用データを取得できません。」だけを出す。
- [ ] **Step 2: 落ちることを確かめる**
- [ ] **Step 3: 実装する**
- [ ] **Step 4: 確かめる**

Run: `npm run type-check && npm run lint && npm test && npm run build`
Expected: すべて成功。

Run: `grep -rnE "daily|UsageHeatmap|UsageDayDetail|UsageMonthTable|usage-codex" app components lib content --include=*.ts --include=*.tsx --include=*.css --include=*.json | grep -v "lib/writing"`
Expected: 出力なし（RSS 側に `daily` という語があれば、それだけ残ってよい）。

本番モード（`npm run build && npm run start`）で、幅1280pxと390px、暗い・明るいテーマを確かめる。モックと並べて、柱の数（26）、丸の数（2026-09-06 の週が8個）、今週の色、凡例、数字の帯（Total 407.8億前後、Peak week 39.2億、Longest streak 44週以上）を見る。旧デザインが変わっていないことも見る。

- [ ] **Step 5: コミット**

### Task 6: 文書を揃えて本番に出す

**Files:**
- Modify: `README.md`, `docs/superpowers/specs/2026-11-16-ai-profile-redesign-design.md`

- [ ] **Step 1:** README の利用データの節を書き直す。取得先（`weekly.json`）、環境変数 `AI_USAGE_TOKEN`、鍵が無いときの動き、控えの更新手順（`weekly.json` を検証して `content/usage-fallback.json` に保存）、鍵の期限を書く欄。
- [ ] **Step 2:** 親の設計書の「4. Token usage」「数字の帯」「草の決まりごと」「利用データの仕組み」の先頭に、「2026-11-17 に `2026-11-17-weekly-usage-design.md` で置き換えた」と1行ずつ足す。本文は消さない。
- [ ] **Step 3:** 日本語の PR を作り、CI と Vercel のプレビューが通ることを確かめる。プレビューで Task 5 Step 4 の目視をもう一度行う。
- [ ] **Step 4:** マージし、本番が Ready になったら公開 URL で同じ点を確かめる。この時点では `ai-usage` は公開のままで、鍵なしで取得できている。鍵なしの取得は GitHub 側の回数制限で失敗することがあり、その場合は控えの表示になる。Task 7 で解消するので、ここでは原因の切り分けだけ行う。

---

## C. 切り替え

### Task 7: 鍵を入れる（本人の操作）

エージェントは鍵の値を受け取らない・表示しない。

- [ ] **Step 1: 本人が鍵を作る** — GitHub の Fine-grained personal access token。Repository access は `soichiyo/ai-usage` だけ、Permissions は Contents の Read-only だけ。期限は選べる最長にする。
- [ ] **Step 2: 本人が Vercel に入れる** — プロジェクト `bio` の環境変数 `AI_USAGE_TOKEN`。Production と Preview の両方。
- [ ] **Step 3: 再デプロイする** — 本番が Ready になり、ページの表示が変わらないこと。README の鍵の期限の欄を埋める。

### Task 8: `ai-usage` を非公開にして確かめる

- [ ] **Step 1: 直前の状態を記録する** — 公開 URL の「更新」の時刻と、`weekly.json` の `generatedAt`。
- [ ] **Step 2: 非公開にする（本人の確認のあと）**

Run: `gh repo edit soichiyo/ai-usage --visibility private --accept-visibility-change-consequences`

Run: `curl -s -o /dev/null -w "%{http_code}\n" https://raw.githubusercontent.com/soichiyo/ai-usage/main/usage.json`
Expected: `404`。

- [ ] **Step 3: 集計を1回動かす**

Run: `launchctl kickstart -p gui/$(id -u)/com.soichiyo.ai-usage`
Expected: 数分以内に Actions が `weekly.json` を作り直し、`generatedAt` が新しくなる。非公開でも push と Actions が通ること。

- [ ] **Step 4: サイトが新しい値を読めていることを確かめる**

Vercel の Data Cache を消すか、1時間待ってから公開 URL を開く。
Expected: 「更新」の時刻が Step 3 の `generatedAt` と一致し、「保存データを表示しています。」が出ていない。

2時間たっても更新されない場合は、鍵で読めていない。`gh repo edit soichiyo/ai-usage --visibility public --accept-visibility-change-consequences` で公開に戻し、原因（鍵の権限、環境変数の適用先、再デプロイ漏れ）を報告する。

- [ ] **Step 5: M1 側の集計も通ることを確かめる** — 次の定時実行（03:22 または 13:22）のあと、`weekly.json` の `collectors` で `m1` の `collectedAt` が進んでいること。
- [ ] **Step 6: `ai-usage` の README に、非公開であること、サイトが読むのは `weekly.json` だけであることを書く。**

報告に含めるもの: 本番の Total tokens・Peak week・連続の週数、非公開化の前後の「更新」の時刻、Review Focus の5点の結果、鍵の期限。
