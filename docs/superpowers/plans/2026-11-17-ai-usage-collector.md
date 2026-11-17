# AI利用データの集計（ai-usage リポジトリ）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 2台の Mac のログから日別・ツール別のトークン数と最長の実行時間を毎日集計し、公開リポジトリ `soichiyo/ai-usage` の `usage.json` として出す。

**Architecture:** 集計のコードとデータを同じリポジトリに置く。各 Mac は launchd で毎日 `bin/collect.mjs` を動かし、自分の `machines/<id>.json` だけを更新して push する。`usage.json` は GitHub Actions が全 Mac 分を足して作るので、2台が同じファイルを書き合うことはない。トークン数の解析は版を固定した ccusage に任せ、最長の実行時間だけログを直接読む。

**Tech Stack:** Node 22.15 以上（依存パッケージなし、ESM の `.mjs`）、`node:test`、ccusage 20.0.51（`npx` で実行）、launchd、GitHub Actions

**Spec:** bio リポジトリの `docs/superpowers/specs/2026-11-16-ai-profile-redesign-design.md`（「利用データの仕組み」）。調査結果は同 `docs/superpowers/research/2026-11-17-usage-log-probe.md`。

この計画は設計書の段階2にあたる。サイト側で `usage.json` を読んで表示する部分は計画3で扱う。

## Global Constraints

- 作業するリポジトリは新しく作る `soichiyo/ai-usage`（公開）。bio リポジトリのコードは変えない。
- 依存パッケージを足さない。`package.json` に `dependencies` と `devDependencies` を作らない。
- リポジトリに書いてよいのは、スキーマにある項目だけ。プロジェクト名、パス、セッションID、モデル名、会話内容を、データ・テスト用の見本・ログ出力のどこにも入れない。
- 対象ツールは `claude-code` と `codex` の2つ。Mac の id は `air`（手元）と `m1`（m1-runner-01）。
- ccusage は 20.0.51 に固定する。日付の区切りは Asia/Tokyo。
- コードの変更は `codex/*` ブランチと PR で行う。launchd からのデータのコミットだけ `main` に直接 push する。
- コミットと PR にAIの署名を入れない。
- 各タスクの最後に `npm test` が通ること。

## Review Focus

1. ccusage が Codex の圧縮済みログ（`.jsonl.zst`、手元では4,209件中4,143件）を読まない場合、古い日の履歴が黙って欠ける。最古の日付が調査の値と合うべき。→ Task 7 Step 2
2. `npx` や ccusage が失敗したとき（オフライン、形式の変更）に、ゼロや小さい値で上書きしてはいけない。何も書かずに失敗で終わるべき。→ Task 6 Step 1
3. ccusage の出力にはモデル名やパスのキーが含まれる。それらが出力ファイルに漏れてはいけない。→ Task 2 Step 1、Task 3 Step 1
4. 同じ日に何度実行しても、Mac がスリープして実行が遅れても、結果が変わらないべき。→ Task 3 Step 1
5. 書き込み途中のログは最後の行が壊れていることがある。その行を飛ばして続行するべき。→ Task 4 Step 1

---

### Task 1: リポジトリの作成と土台

**Files:**
- Create: `package.json`, `.gitignore`, `README.md`, `.github/workflows/ci.yml`, `src/config.mjs`, `src/config.test.mjs`

**Interfaces:**
- Produces: `src/config.mjs` が次を export する。
  - `TOOLS = [{ id: "claude-code", ccusage: "claude" }, { id: "codex", ccusage: "codex" }]`
  - `MACHINES = ["air", "m1"]`
  - `CCUSAGE_VERSION = "20.0.51"`、`TIMEZONE = "Asia/Tokyo"`、`GAP_SECONDS = 1800`、`SCHEMA_VERSION = 1`
  - `tokyoDate(ms: number): string`（`YYYY-MM-DD`）

- [ ] **Step 1: リポジトリを作る**

Run: `gh repo create soichiyo/ai-usage --public --clone --description "Daily token usage across my coding agents"`

- [ ] **Step 2: `src/config.test.mjs` を書く**

```js
import test from "node:test";
import assert from "node:assert/strict";
import { tokyoDate, TOOLS, MACHINES } from "./config.mjs";

test("tokyoDate は UTC ではなく Asia/Tokyo で日付を区切る", () => {
  assert.equal(tokyoDate(Date.parse("2026-11-16T14:59:59Z")), "2026-11-16");
  assert.equal(tokyoDate(Date.parse("2026-11-16T15:00:00Z")), "2026-11-17");
});
test("対象は2ツール・2台", () => {
  assert.deepEqual(TOOLS.map((t) => t.id), ["claude-code", "codex"]);
  assert.deepEqual(MACHINES, ["air", "m1"]);
});
```

- [ ] **Step 3: 土台のファイルを書く**

`package.json`: `"private": true`、`"type": "module"`、`"engines": { "node": ">=22.15" }`、scripts は `"test": "node --test"` と `"collect": "node bin/collect.mjs"`。
`.gitignore`: `node_modules`、`.DS_Store`、`*.log`。
`ci.yml`: push と pull_request で、Node 22 を入れて `npm test` を実行するジョブ `test`。
`README.md`: 何を集計しているか、公開している項目、公開していない項目を各1〜2行。

- [ ] **Step 4: 確かめてコミット**

Run: `npm test`
Expected: 2テスト PASS。

```bash
git add -A && git commit -m "chore: scaffold ai-usage" && git push -u origin main
```

---

### Task 2: スキーマと検証

**Files:**
- Create: `src/schema.mjs`, `src/schema.test.mjs`

**Interfaces:**
- Produces:
  - `validateMachineFile(obj): void`、`validateUsage(obj): void`、`validateOverrides(obj): void`、`validateSnapshots(obj): void`。違反があれば、どのキーが悪いかを含む `Error` を投げる。
  - 形は設計書の「データの形」の通り。日付は `YYYY-MM-DD`、トークン数と秒数は0以上の整数。
  - Mac ごとのファイルの `longestRun` は任意。`rawSeconds` と `rawDate` は必須、`activeSeconds` と `activeDate` は2つ揃って有るか、2つとも無いか。
  - `overrides.json`: `{ schemaVersion, daily: [{ date, tool, tokens }] }`。`snapshots.json`: `{ schemaVersion, snapshots: [{ key, value, asOf, source }] }`。`key` は `skillsTried` `skillRuns` `topReasoningShare` `fastModeShare` のどれか、`source` は `chatgpt-profile` か `manual`。

- [ ] **Step 1: `src/schema.test.mjs` を書く**

設計書の2つの例をそのまま正しい入力として使い、次を確かめる。

```js
test("設計書の例は通る", () => { validateMachineFile(machine()); validateUsage(usage()); });
test("知らないキーは、どの階層でも拒否する", () => {
  assert.throws(() => validateMachineFile({ ...machine(), projectPath: "x" }), /projectPath/);
  const m = machine(); m.tools["claude-code"].modelsUsed = ["x"];
  assert.throws(() => validateMachineFile(m), /modelsUsed/);
  const u = usage(); u.daily[0].sessionId = "x";
  assert.throws(() => validateUsage(u), /sessionId/);
});
test("知らないツール・Mac・snapshot の key は拒否する", () => {
  const m = machine(); m.tools["cursor-x"] = m.tools["claude-code"];
  assert.throws(() => validateMachineFile(m), /cursor-x/);
  assert.throws(() => validateMachineFile({ ...machine(), machine: "laptop" }), /machine/);
  assert.throws(() => validateSnapshots({ schemaVersion: 1, snapshots: [{ key: "note", value: 1, asOf: "2026-11-16", source: "manual" }] }), /key/);
});
test("負の数・小数・日付でない文字列は拒否する", () => {
  const m = machine(); m.tools["claude-code"].daily["2026-11-16"] = -1;
  assert.throws(() => validateMachineFile(m));
  const n = machine(); n.tools["claude-code"].daily["11/16"] = 1;
  assert.throws(() => validateMachineFile(n));
});
test("active は2つ揃っているときだけ通る", () => {
  const m = machine(); delete m.tools["claude-code"].longestRun.activeDate;
  assert.throws(() => validateMachineFile(m), /active/);
});
```

`usage.json` の `sources` は `cursor` も受け付ける（計画4で使う）。`mode` は `auto` か `import`。

- [ ] **Step 2: テストが落ちることを確かめる** — Run: `npm test` / Expected: FAIL（関数が無い）
- [ ] **Step 3: `src/schema.mjs` を実装する** — 手書きの検証で足りる。ライブラリは使わない。
- [ ] **Step 4: 通ることを確かめてコミット** — `git commit -m "feat: strict schema for machine files and usage.json"`

---

### Task 3: ccusage の読み取りと、最大値での更新

**Files:**
- Create: `src/ccusage.mjs`, `src/ccusage.test.mjs`, `src/ledger.mjs`, `src/ledger.test.mjs`, `fixtures/ccusage-daily.json`

**Interfaces:**
- Consumes: Task 1 の `TOOLS` `CCUSAGE_VERSION` `TIMEZONE`
- Produces:
  - `parseDaily(json: unknown): Record<string, number>` — ccusage の日別出力から `{ "YYYY-MM-DD": totalTokens }` だけを取り出す。`daily` 配列が無い、`date` を `YYYY-MM-DD` にできない、`totalTokens` が0以上の整数でない場合は投げる。
  - `runDaily(ccusageArg: string): Promise<Record<string, number>>` — `npx --yes ccusage@20.0.51 <arg> daily --json --offline --timezone Asia/Tokyo` を `shell: false` で実行して `parseDaily` に渡す。終了コードが0以外なら投げる。
  - `mergeDaily(saved: Record<string, number>, fresh: Record<string, number>): Record<string, number>` — 日付ごとに大きいほう。
  - `coverageOf(daily: Record<string, number>, today: string): { from: string, to: string } | null` — `from` はいちばん古い日付、`to` は `today`。

- [ ] **Step 1: テストを書く**

`fixtures/ccusage-daily.json` は、実際に `runDaily` と同じコマンドを1回実行した出力から2日分を残し、`date` と `totalTokens` 以外の値を見本の値（モデル名は `"model-x"`）に置き換えたもの。`date` の実際の書式をここで確かめ、`YYYY-MM-DD` でなければ `parseDaily` で変換する。

```js
test("parseDaily は日付と合計だけを返す", () => {
  const out = parseDaily(fixture);
  assert.deepEqual(Object.keys(out).length, 2);
  for (const [d, n] of Object.entries(out)) { assert.match(d, /^\d{4}-\d{2}-\d{2}$/); assert.ok(Number.isInteger(n)); }
  assert.ok(!JSON.stringify(out).includes("model-x"));
});
test("parseDaily は形が違えば投げる", () => {
  assert.throws(() => parseDaily({}));
  assert.throws(() => parseDaily({ daily: [{ date: "2026-11-16" }] }));
});
test("mergeDaily は減らさない・足さない・新しい日は入れる", () => {
  const saved = { "2026-08-01": 1000, "2026-11-16": 500 };
  const fresh = { "2026-11-16": 700, "2026-11-17": 30 };
  assert.deepEqual(mergeDaily(saved, fresh), { "2026-08-01": 1000, "2026-11-16": 700, "2026-11-17": 30 });
  assert.deepEqual(mergeDaily(saved, { "2026-11-16": 100 }), saved);
});
test("mergeDaily は同じ入力で何度やっても同じ", () => {
  const once = mergeDaily({ a: 1 }, { a: 5, b: 2 });
  assert.deepEqual(mergeDaily(once, { a: 5, b: 2 }), once);
});
test("coverageOf", () => {
  assert.deepEqual(coverageOf({ "2026-08-01": 1, "2026-11-16": 2 }, "2026-11-17"), { from: "2026-08-01", to: "2026-11-17" });
  assert.equal(coverageOf({}, "2026-11-17"), null);
});
```

- [ ] **Step 2: 落ちることを確かめる** — Run: `npm test`
- [ ] **Step 3: 実装する** — `runDaily` は `node:child_process` の `execFile`。標準出力の上限を 64MB にする。
- [ ] **Step 4: 通ることを確かめてコミット** — `git commit -m "feat: read ccusage daily totals and keep per-day maximum"`

---

### Task 4: 最長の実行時間

**Files:**
- Create: `src/runs.mjs`, `src/runs.test.mjs`

**Interfaces:**
- Consumes: `GAP_SECONDS`、`tokyoDate`
- Produces:
  - `scanLines(lines: Iterable<string>, tool: "claude-code" | "codex"): { rawSeconds, rawDate, activeSeconds?, activeDate? } | null` — 1つのログファイルの行を読み、そのファイル内の最大値を返す。指示が1つも無ければ `null`。
  - `scanTool(tool, { sinceMs?: number }): Promise<同上 | null>` — そのツールのログ置き場を走査して全ファイルの最大を返す。`sinceMs` があれば、更新時刻がそれより新しいファイルだけ読む。
  - `maxRun(a, b)` — 2つの結果の `raw` と `active` をそれぞれ大きいほうにする。どちらかが `null` なら他方を返す。

読み方:

| ツール | 置き場 | 指示の完了を示す行 | 長さ |
|---|---|---|---|
| claude-code | `~/.claude/projects/**/*.jsonl` | `type === "system"` かつ `subtype === "turn_duration"` | `durationMs` |
| codex | `~/.codex/sessions/**` と `~/.codex/archived_sessions/*` の `.jsonl` と `.jsonl.zst` | `type === "event_msg"` かつ `payload.type === "task_complete"` | `payload.duration_ms` |

- 完了の時刻は、その行の `timestamp`。開始は「完了の時刻 − 長さ」。日付は完了の時刻を `tokyoDate` にしたもの。
- `active` の条件: 同じファイルの中で、開始から完了までにある行の `timestamp`（開始と完了を両端に含める）を並べ、隣り合う間隔がすべて `GAP_SECONDS` 以下。
- JSON として読めない行、`timestamp` の無い行は飛ばす。
- `.zst` は `node:zlib` の `zstdDecompressSync` で展開する。
- 秒はミリ秒を四捨五入する。

- [ ] **Step 1: `src/runs.test.mjs` を書く**

行は、テストの中で組み立てた見本だけを使う（本物のログを見本にしない）。

```js
const T = (iso) => Date.parse(iso);
const codexDone = (iso, ms) => JSON.stringify({ timestamp: iso, type: "event_msg", payload: { type: "task_complete", duration_ms: ms } });
const tick = (iso) => JSON.stringify({ timestamp: iso, type: "event_msg", payload: { type: "token_count" } });

test("10分おきに記録がある2時間の指示は active", () => {
  const lines = []; for (let m = 10; m < 120; m += 10) lines.push(tick(new Date(T("2026-11-16T01:00:00Z") + m * 60000).toISOString()));
  lines.push(codexDone("2026-11-16T03:00:00Z", 7200000));
  assert.deepEqual(scanLines(lines, "codex"), { rawSeconds: 7200, rawDate: "2026-11-16", activeSeconds: 7200, activeDate: "2026-11-16" });
});
test("途中に9時間の空白がある15時間の指示は raw だけ", () => {
  const lines = [tick("2026-06-18T16:00:00Z"), tick("2026-06-19T01:00:00Z"), tick("2026-06-19T01:20:00Z"), codexDone("2026-06-19T06:30:00Z", 55800000)];
  const r = scanLines(lines, "codex");
  assert.equal(r.rawSeconds, 55800); assert.equal(r.rawDate, "2026-06-19"); assert.equal(r.activeSeconds, undefined);
});
test("raw と active は別の指示から取れる", () => { /* 上の2つを1ファイルに並べ、raw=55800、active=7200 を確かめる */ });
test("壊れた最終行と timestamp の無い行は飛ばす", () => {
  const lines = [codexDone("2026-11-16T03:00:00Z", 60000), '{"timestamp":"2026-11-16T03:0', JSON.stringify({ type: "x" })];
  assert.equal(scanLines(lines, "codex").rawSeconds, 60);
});
test("Claude Code の turn_duration を読む", () => {
  const lines = [JSON.stringify({ timestamp: "2026-11-16T03:00:00Z", type: "system", subtype: "turn_duration", durationMs: 90000 })];
  assert.equal(scanLines(lines, "claude-code").rawSeconds, 90);
});
test("指示が無ければ null", () => { assert.equal(scanLines([tick("2026-11-16T03:00:00Z")], "codex"), null); });
test("maxRun", () => {
  assert.deepEqual(maxRun({ rawSeconds: 10, rawDate: "2026-01-01" }, { rawSeconds: 5, rawDate: "2026-02-01", activeSeconds: 5, activeDate: "2026-02-01" }),
    { rawSeconds: 10, rawDate: "2026-01-01", activeSeconds: 5, activeDate: "2026-02-01" });
  assert.equal(maxRun(null, null), null);
});
```

- [ ] **Step 2: 落ちることを確かめる**
- [ ] **Step 3: 実装する**
- [ ] **Step 4: 通ることを確かめてコミット** — `git commit -m "feat: longest run from turn completion records, with a 30-minute gap rule"`

---

### Task 5: 全 Mac 分を足して `usage.json` を作る

**Files:**
- Create: `src/merge.mjs`, `src/merge.test.mjs`, `bin/build-usage.mjs`, `overrides.json`, `snapshots.json`, `.github/workflows/build-usage.yml`

**Interfaces:**
- Consumes: Task 2 の検証関数
- Produces: `buildUsage({ machines: MachineFile[], overrides, snapshots, now: Date }): Usage`
  - `daily`: いちばん古い `coverage.from` からいちばん新しい `coverage.to` まで、1日1行。全 Mac の `tools[tool].daily` を「日付 × ツール」で足す。日付の昇順。各 Mac の `coverage` に入っている日は、行が無ければ 0 として扱う。どの Mac の `coverage` にも入らない「日付 × ツール」はキーを出さない。
  - `sources[tool].coverage`: `from` は Mac の中でいちばん古い日、`to` はいちばん新しい日。`mode` は `auto`。
  - `overrides.daily` の値は、足したあとの値を置き換える。
  - `longestRun`: 全 Mac・全ツールの `activeSeconds` の最大を `rule: "active"` で出す。`active` がどこにも無ければ `rawSeconds` の最大を `rule: "raw"` で出す。どちらも無ければキーを出さない。
  - `collectors`: Mac ごとの `collectedAt`。
  - 返す前に `validateUsage` を通す。

- [ ] **Step 1: `src/merge.test.mjs` を書く**

```js
test("2台の同じ日を足す", () => { /* air codex 11/10=35882349、m1 codex 11/10=55791066 → 91673415 */ });
test("coverage 内で行が無い日は 0、coverage 外はキー無し", () => {
  /* air claude coverage 7/27〜、m1 claude coverage 10/17〜。8/1 は air に行なし → tokens["claude-code"] === 0。
     codex は両方 coverage 9/17〜 とし、2025-09-16 の行は出ない */
});
test("overrides は合計を置き換える", () => { /* {date:"2026-11-10", tool:"codex", tokens: 1} → 1 */ });
test("longestRun は active を優先し、無ければ raw", () => {
  /* air claude raw=156565 active 無し、air codex raw=55788 active=7200 → { seconds: 7200, tool: "codex", rule: "active" }
     active を全部消すと → { seconds: 156565, tool: "claude-code", rule: "raw" } */
});
test("結果は validateUsage を通る", () => { validateUsage(buildUsage(input())); });
```

- [ ] **Step 2: 落ちることを確かめる**
- [ ] **Step 3: 実装する** — `bin/build-usage.mjs` は `machines/*.json`・`overrides.json`・`snapshots.json` を読み、すべて検証し、`buildUsage` の結果を `usage.json` に2スペースの JSON で書く。`overrides.json` の初期値は `{"schemaVersion":1,"daily":[]}`、`snapshots.json` は設計書の例の1件。
- [ ] **Step 4: `build-usage.yml` を書く**

`main` への push のうち、`machines/**`・`overrides.json`・`snapshots.json`・`src/**`・`bin/**` が変わったときに動く。`permissions: contents: write`。`node bin/build-usage.mjs` を実行し、`usage.json` に差分があれば `data: rebuild usage.json` でコミットして push する。同時実行は `concurrency: build-usage` で1本にする。

- [ ] **Step 5: 通ることを確かめてコミット** — `git commit -m "feat: merge machine files into usage.json"`

---

### Task 6: 集計コマンド

**Files:**
- Create: `bin/collect.mjs`, `src/collect.mjs`, `src/collect.test.mjs`

**Interfaces:**
- Consumes: `runDaily`、`mergeDaily`、`coverageOf`、`scanTool`、`maxRun`、`validateMachineFile`
- Produces:
  - `nextMachineFile({ saved: MachineFile | null, machine, now: Date, fresh: Record<toolId, { daily, run }> }): MachineFile` — 純粋な関数。ツールごとに `mergeDaily` と `maxRun` を当て、`coverage` を付け、検証して返す。
  - `bin/collect.mjs` の動き:
    1. 環境変数 `AI_USAGE_MACHINE` が `MACHINES` に無ければ、終了コード2で終わる。
    2. `--dry-run` でなければ `git pull --rebase` する。
    3. ツールごとに `runDaily` と `scanTool` を実行する。`scanTool` の `sinceMs` は、保存済みファイルの `collectedAt` の48時間前（保存済みファイルが無ければ指定しない）。
    4. どれか1つでも失敗したら、何も書かずに終了コード1で終わる。
    5. `nextMachineFile` の結果を `machines/<id>.json` に書く。`--dry-run` なら標準出力に出して終わる。
    6. 差分があれば `data: <machine> <YYYY-MM-DD>` でコミットして push する。push が拒否されたら `git pull --rebase` して1回だけやり直す。
    7. 標準出力には、ツールごとの日数と最新日の合計だけを出す。

- [ ] **Step 1: `src/collect.test.mjs` を書く**

```js
test("初回は fresh をそのまま入れ、coverage を付ける", () => { /* saved: null */ });
test("保存済みより小さい fresh では減らない（ログが消えた場合）", () => {
  /* saved claude {"2026-07-27": 900}、fresh {"2026-11-17": 5} → 両方残り、coverage.from は 2026-07-27 */
});
test("longestRun は保存済みと大きいほう", () => { /* saved raw=100、fresh raw=50 active=50 → raw=100、active=50 */ });
test("fresh にツールが無ければ投げる（一部だけ成功した結果で書かない）", () => {
  assert.throws(() => nextMachineFile({ saved: null, machine: "air", now, fresh: { "claude-code": ok } }), /codex/);
});
test("結果に ccusage の余分なキーが入らない", () => { assert.ok(!JSON.stringify(result).match(/model|path|session/i)); });
```

- [ ] **Step 2: 落ちることを確かめる**
- [ ] **Step 3: 実装する**
- [ ] **Step 4: 通ることを確かめてコミット** — `git commit -m "feat: collect command that updates this machine's file"`

---

### Task 7: 手元の Mac で初回の集計

**Files:**
- Create: `machines/air.json`（集計の結果）

- [ ] **Step 1: 実行前の確認**

Run: `node --version && node -e "if (!require('node:zlib').zstdDecompressSync) process.exit(1)" && AI_USAGE_MACHINE=air node bin/collect.mjs --dry-run > /tmp/air.json; echo "exit=$?"`
Expected: Node が 22.15 以上、`exit=0`。

- [ ] **Step 2: 調査の値と突き合わせる**

`/tmp/air.json` が次と一致すること（過去の日なので値は変わらないはず。大きい分には可、小さければ止めて報告する）。

| 日付 | claude-code | codex |
|---|---:|---:|
| 2026-11-10 | 465,013,502 | 35,882,349 |
| 2026-11-11 | 14,146,697 | 3,838,743 |
| 2026-11-12 | 10,332,599 | 15,712,755 |
| 2026-11-13 | 91,786,295 | 52,313,503 |
| 2026-11-14 | 0 または行なし | 6,051,637 |
| 2026-11-15 | 0 または行なし | 1,839,532 |
| 2026-11-16 | 100,962,003 | 80,141,318 |

`coverage.from` は claude-code が 2026-07-27 前後、codex が 2026-04-09 前後であること。

codex の `coverage.from` が 2026-04-09 より大幅に新しい場合、ccusage が圧縮済みログを読んでいない。そのときは実装を足さずに止め、次の2点を報告する。読めている最古の日付と、`CODEX_HOME` を展開済みのコピーに向けて実行した場合の最古の日付。

`longestRun` の `rawSeconds` は、claude-code が 156,565、codex が 55,788 であること。`activeSeconds` の値を報告に含める（画面に出す値を決める材料になる）。

- [ ] **Step 3: 本番の実行**

Run: `AI_USAGE_MACHINE=air node bin/collect.mjs`
Expected: `machines/air.json` がコミット・push され、数分以内に GitHub Actions が `usage.json` を作る。`https://raw.githubusercontent.com/soichiyo/ai-usage/main/usage.json` が取得でき、`validateUsage` を通る。

---

### Task 8: 2台での毎日の実行

launchd の登録は Mac の常駐設定を変える。Workspaces の Risk Tiers に従い、必要なら実行前にそちゃんの確認を取る。

**Files:**
- Create: `launchd/com.soichiyo.ai-usage.plist.template`, `docs/install.md`

- [ ] **Step 1: テンプレートと手順書を書く**

- `Label`: `com.soichiyo.ai-usage`
- `ProgramArguments`: `{{NODE}}`、`{{REPO_DIR}}/bin/collect.mjs`
- `WorkingDirectory`: `{{REPO_DIR}}`
- `EnvironmentVariables`: `AI_USAGE_MACHINE={{MACHINE}}`、`PATH` に `node`・`npx`・`git` のある場所
- `StartCalendarInterval`: `air` は毎日 03:07 と 13:07、`m1` は毎日 03:22 と 13:22
- `StandardOutPath` と `StandardErrorPath`: `~/Library/Logs/ai-usage.log`

`docs/install.md` には、専用の取得先（`~/.local/share/ai-usage`）への clone、テンプレートの3か所の置き換え、`launchctl bootstrap`、手動で1回動かす方法、止め方を書く。開発用の clone とは別の場所に置く。

- [ ] **Step 2: 手元の Mac に入れて確かめる**

Run: `launchctl kickstart -p gui/$(id -u)/com.soichiyo.ai-usage; sleep 90; tail -5 ~/Library/Logs/ai-usage.log`
Expected: ツールごとの日数が出ていて、エラーが無い。launchd から `git push` が通っている（認証を求めて止まっていない）。

- [ ] **Step 3: m1-runner-01 に入れて確かめる**

同じ手順を SSH で行う。`AI_USAGE_MACHINE=m1`。初回の結果が次を満たすこと。claude-code の 2026-11-10 が 241,699、codex の 2026-11-10 が 55,791,066、codex の `coverage.from` が 2025-09-17 前後。

- [ ] **Step 4: 合算を確かめる**

`usage.json` の 2026-11-10 が、claude-code 465,255,201、codex 91,673,415 であること。`collectors` に `air` と `m1` の両方があること。

- [ ] **Step 5: コミットして、結果を報告する**

```bash
git add launchd docs && git commit -m "docs: launchd template and install steps"
```

報告に含めるもの: 2台それぞれの `coverage`、`usage.json` の累計トークン数（ツール別）、`longestRun` の `raw` と `active`（ツール別・Mac別）、Review Focus の5点の結果。
