# 利用ログの事前調査

調査日: 2026-11-17。日付は特記しない限りAsia/Tokyo。

照合期間: 2026-11-10〜2026-11-16の7日間。進行中の2026-11-17は含めない。以下の数値は保存されている記録の集計であり、保存されなかった利用分を含むかは未確認。

会話本文、実際の作業先名、セッションIDの値、認証情報は記載しない。保存先の`*`は可変部分。アプリケーションコード、集計処理、定期実行の設定は変更していない。

## 1. マシン

| 区分 | 接続・確認 | ログの確認 |
|---|---|---|
| 手元のMac | 確認済み | Claude Code、Codex、Cursor、Muse Code、Grok、opencode |
| m1-runner-01 | SSHで確認済み | Claude Code、Codex、Cursor、opencode |
| その他 | 未確認 | 未確認 |

M1ではMuse Codeの実行ファイルと標準保存先を確認できなかった。Grokは設定用ディレクトリがあるが、下記のセッションログは確認できなかった。ファイルの存在だけで、そのマシン上の実行履歴すべてを証明できるかは未確認。

## 2. 保存先・保持期間・最古の日付

最古の日付はファイルの更新日時ではなく、ログ内の日時または保存されたメタデータから取得した。保持期間の「未確認」は、無期限保存という意味ではない。

| マシン | ツール | ホーム以下の保存先 | 保持期間の設定 | 最古の日付 |
|---|---|---|---|---|
| 手元 | Claude Code | `~/.claude/projects/**/*.jsonl` | `cleanupPeriodDays = 90` | 2026-07-27 |
| M1 | Claude Code | `~/.claude/projects/**/*.jsonl` | `cleanupPeriodDays = 90` | 2026-10-17 |
| 手元 | Codex | `~/.codex/sessions/**/*.jsonl`、`~/.codex/sessions/**/*.jsonl.zst`、`~/.codex/archived_sessions/*.jsonl`、`~/.codex/archived_sessions/*.jsonl.zst` | 未確認 | 2026-04-09 |
| M1 | Codex | 同上 | 未確認 | 2025-09-17 |
| 手元 | Cursor | `~/Library/Application Support/Cursor/User/globalStorage/state.vscdb` | 未確認 | 2026-04-07（`composerData`の`createdAt`） |
| M1 | Cursor | 同上 | 未確認 | 2024-11-29（`composerData`の`createdAt`） |
| 手元 | Muse Code | `~/.local/share/muse/sessions/**/session.jsonl`、`~/.local/share/muse/session-index.db` | 未確認 | 2026-10-19 |
| M1 | Muse Code | 未確認 | 未確認 | 未確認 |
| 手元 | Grok系 | `~/.grok/logs/unified.jsonl`、`~/.grok/sessions/session_search.sqlite` | 未確認 | 2026-10-19（診断ログ） |
| M1 | Grok系 | 未確認 | 未確認 | 未確認 |
| 手元 | opencode | `~/.local/share/opencode/opencode.db` | 未確認 | 2026-04-15 |
| M1 | opencode | 同上 | 未確認 | 2026-01-20 |

補足:

- Claude Codeの対象JSONLは手元285ファイル、M1は23ファイル。手元には設定の90日より古い記録も残っている。設定値だけで保存済みイベントの期間を限定できるかは未確認。
- Codexの対象は手元4,209ファイル（うち圧縮済み4,143）、M1は538ファイル（うち圧縮済み472）。最古日と実行時間の最大値は圧縮済みログも読んで確認した。今回の7日分の通常トークン記録は、非圧縮ログに含まれていた。
- Cursor CLIには`~/.cursor/chats/**/store.db`形式の保存がある。`meta.value`を16進文字列からJSONへ復号すると`createdAt`がある。確認したDBは手元217、M1は16。M1ではメタデータを読めたのは7で、9は該当テーブルを確認できなかった。CLI側の最古日は手元2026-07-10、M1は2025-09-03。
- Cursorの`~/.cursor/projects/**/agent-transcripts/**/*.jsonl`形式も確認した。手元で調べた12,579レコードの上位キーは`role`、`message`で、利用日時・トークン数・実行時間は未確認。
- Grokの診断ログは利用量の台帳ではない。ccusageが読む`~/.grok/sessions/**/updates.jsonl`は、両マシンとも0ファイル。Grok Botなど別の実行環境の保存先は未確認。

## 3. セッション × 日付のトークン数

| ツール | 判定 | 保存場所の中で使うキー |
|---|---|---|
| Claude Code | 取得可 | JSONLの`sessionId`、`timestamp`、`message.id`、`requestId`、`message.usage.input_tokens`、`output_tokens`、`cache_creation_input_tokens`、`cache_read_input_tokens` |
| Codex | 取得可 | JSONLの`session_meta.payload.id`、`timestamp`、`event_msg.payload.info.total_token_usage`、`last_token_usage`。加えて`token_usage_record.payload.usage`、`response_id`、`thread_token_usage`と`compacted.payload.compaction_response_id` |
| Cursor | 一部取得可。完全性は未確認 | `state.vscdb`の`cursorDiskKV`、`bubbleId:*`のキー、JSON値の`createdAt`、`tokenCount.inputTokens`、`tokenCount.outputTokens` |
| Muse Code | 未確認 | `session.jsonl`の`children[].record_json`をJSONとして読む形式と、`recorded_at`、`payload_type`は確認。トークン数の記録は未確認 |
| Grok系 | 未確認 | 診断ログの`ts`は確認。セッション別のトークン数は未確認 |
| opencode | 取得可 | `opencode.db`の`session_message.session_id`、`type`、`time_created`、`data.time.created`、`data.tokens.input`、`output`、`reasoning`、`total`、`cache.read`、`cache.write`。旧形式は`message`テーブル |

Claude Codeでは`message.id`と`requestId`による同じ記録の重複除外が必要。Codexでは累計を各行で足さず、累計が進んだ記録の`last_token_usage`、または累計の差分を使う。圧縮による追加利用を含める際も、`response_id`で同じ利用を二重に足さない。

opencodeには旧形式の`message`と新形式の`session_message`が併存する。移行済みの同じ履歴があるため、両方の全行を単純に足すことはできない。直近7日の記録は新形式にあった。

Cursorの実測:

| 項目 | 手元 | M1 |
|---|---:|---:|
| `bubbleId:*`のJSONレコード | 118,875 | 93,503 |
| `tokenCount.inputTokens`が正のレコード | 0 | 3,084 |
| `tokenCount.outputTokens`が正のレコード | 0 | 3,084 |
| 正のトークン数と有効な`createdAt`が揃うレコード | 0 | 2,407 |
| 上記のセッション × 日付の組 | 0 | 480 |

M1の正の記録677件は日付を確認できなかった。手元の全件ゼロを「利用がなかった」と解釈できるかも未確認。`contextTokensUsed`と`contextTokenLimit`は確認できたが、期間中の消費トークン数として使えるかは未確認。M1の`usageData`には`costInCents`、`amount`もあるが、これらをトークン数へ変換できるかは未確認。

## 4. ccusageと生ログの照合

### 版と実行条件

- 今回使用した版: `ccusage 20.0.51`。両マシンで同じ版を使用。
- 調査前に確認できたキャッシュ: M1に`ccusage 18.0.5`。手元では該当キャッシュを確認できなかった。常設の`ccusage`コマンドは両方とも未確認。
- `@ccusage/codex 19.0.0`は実行時に`ccusage`への移行案内を出して終了した。今回の数値には使っていない。
- ツール指定: `claude`、`codex`、`opencode`、`grok`。それぞれ`daily`と`session`を別に実行した。全ツールをまとめた出力は使っていない。
- 引数: `json = true`、`offline = true`、`since = 20261110`、`until = 20261116`、`timezone = Asia/Tokyo`。
- この版のコマンド一覧にCursor、Muse Codeはない。両者のccusageによる照合は未確認。

### JSONのキー

全ツールで上位キーは日別が`daily`、`totals`、セッション別が`sessions`、`totals`。

| ツール | 日別の行キー |
|---|---|
| Claude Code | `date`、`inputTokens`、`outputTokens`、`cacheCreationTokens`、`cacheReadTokens`、`totalTokens`、`totalCost`、`modelsUsed`、`modelBreakdowns` |
| Codex | `date`、`inputTokens`、`outputTokens`、`cacheCreationTokens`、`cacheReadTokens`、`reasoningOutputTokens`、`totalTokens`、`costUSD`、`models` |
| opencode | `date`、`inputTokens`、`outputTokens`、`cacheCreationTokens`、`cacheReadTokens`、`totalTokens`、`totalCost`、`modelsUsed`、`modelBreakdowns` |
| Grok | 0行。行キーは実データでは未確認 |

| ツール | セッション別の行キー |
|---|---|
| Claude Code | `sessionId`、`projectPath`、`firstActivity`、`lastActivity`、`inputTokens`、`outputTokens`、`cacheCreationTokens`、`cacheReadTokens`、`totalTokens`、`totalCost`、`modelsUsed`、`modelBreakdowns` |
| Codex | `sessionId`、`sessionFile`、`directory`、`lastActivity`、`inputTokens`、`outputTokens`、`cacheCreationTokens`、`cacheReadTokens`、`reasoningOutputTokens`、`totalTokens`、`costUSD`、`models` |
| opencode | `sessionId`、`inputTokens`、`outputTokens`、`cacheCreationTokens`、`cacheReadTokens`、`totalTokens`、`totalCost`、`modelsUsed`、`modelBreakdowns` |
| Grok | 0行。行キーは実データでは未確認 |

`totals`のキーはClaude Code・opencode・Grokが`inputTokens`、`outputTokens`、`cacheCreationTokens`、`cacheReadTokens`、`totalTokens`、`totalCost`。Codexは`totalCost`の代わりに`costUSD`があり、さらに`reasoningOutputTokens`がある。作業先やセッションを識別するキーの値は記載しない。

### 合計に含まれるもの

| ツール | 今回確認した合計 |
|---|---|
| Claude Code | `input_tokens + output_tokens + cache_creation_input_tokens + cache_read_input_tokens` |
| Codex | 入力と出力の合計。生ログの`input_tokens`にはキャッシュ分が含まれる。ccusageの`inputTokens`はキャッシュ分を除いた値で、`cacheReadTokens`・`cacheCreationTokens`を別表示する。`reasoningOutputTokens`は出力の内数なので、`totalTokens`へもう一度足さない |
| opencode | 今回の記録では`input + output + reasoning + cache.read + cache.write`。7日間の`tokens.total`は0だったが、ccusageは他の内訳から合計を出した |
| Grok | 実データがないため未確認 |

opencodeの7日分は入力20,950、出力8,720、推論44,237、キャッシュ0、合計73,907。JSONに独立した`reasoningTokens`列はないため、表示される入力・出力・キャッシュの4列だけを足すと合計と一致しない。

### 日別照合

各セルは「ccusage / 生ログ」。該当記録がない日は記録上の0を示す。ログ外の実行まで0だったかは未確認。

| 日付 | 手元 Claude Code | M1 Claude Code | 手元 Codex | M1 Codex |
|---|---:|---:|---:|---:|
| 2026-11-10 | 465,013,502 / 465,013,502 | 241,699 / 241,699 | 35,882,349 / 35,882,349 | 55,791,066 / 55,791,066 |
| 2026-11-11 | 14,146,697 / 14,146,697 | 0 / 0 | 3,838,743 / 3,838,743 | 0 / 0 |
| 2026-11-12 | 10,332,599 / 10,332,599 | 0 / 0 | 15,712,755 / 15,712,755 | 0 / 0 |
| 2026-11-13 | 91,786,295 / 91,786,295 | 0 / 0 | 52,313,503 / 52,313,503 | 0 / 0 |
| 2026-11-14 | 0 / 0 | 0 / 0 | 6,051,637 / 6,051,637 | 0 / 0 |
| 2026-11-15 | 0 / 0 | 0 / 0 | 1,839,532 / 1,839,532 | 0 / 0 |
| 2026-11-16 | 100,962,003 / 100,962,003 | 0 / 0 | 80,141,318 / 80,141,318 | 0 / 0 |
| 7日合計 | 682,241,096 / 682,241,096 | 241,699 / 241,699 | 195,779,837 / 195,779,837 | 55,791,066 / 55,791,066 |

手元Codexは`token_count`だけでは192,574,677だった。`token_usage_record`と`compacted`が対応する追加分12件、3,205,160を含めると一致した。追加分は11月10日747,789、12日250,750、13日249,961、15日254,179、16日1,702,481。

opencodeは手元の11月16日が73,907 / 73,907、ほかの6日は0 / 0。M1は7日すべて0 / 0。Grokは両方とも7日間の対象ファイル0、出力0行で、利用量の照合は未確認。

セッション別JSONの行数は、手元がClaude Code 23、Codex 27、opencode 11、Grok 0。M1はClaude Code 2、Codex 29、opencode 0、Grok 0。それぞれのセッション別合計は日別合計と一致した。

## 5. 1回の指示の経過時間

直近7日だけでなく、今回読めた保存済み記録全体の最大値。日時は完了記録の日時を使う。Cursorは同じレコードの`createdAt`であり、完了日であるかは未確認。

| ツール | キー | 手元: 最大値 / 日付 | M1: 最大値 / 日付 |
|---|---|---|---|
| Claude Code | `type = system`、`subtype = turn_duration`の`durationMs` | 156,564,985 ms / 2026-07-30 | 5,676 ms / 2026-11-10 |
| Codex | `type = event_msg`、`payload.type = task_complete`の`payload.duration_ms` | 55,787,807 ms / 2026-06-19 | 2,458,525 ms / 2026-10-02 |
| Cursor | `state.vscdb`の`bubbleId:*`の`turnDurationMs` | 7,523,472 ms / 2026-08-05 | 1,442,890 ms / 2026-02-03 |
| Muse Code | 未確認 | 未確認 | 未確認 |
| Grok系 | 未確認 | 未確認 | 未確認 |
| opencode | 1指示全体の完了時間キーは未確認 | 未確認 | 未確認 |

確認できた時間レコード数は、Claude Codeが手元79・M1 1、Codexが手元23,411・M1 498、Cursorの`turnDurationMs`が手元617・M1 672。

長い値が待機・中断・再開をどこまで含むかは未確認。値が記録されていることだけで、連続稼働した時間とは判断できない。

opencodeの`session_message.data.time.completed - time.created`はassistantメッセージ単位では取れる。最大値は手元7,762,493 ms（2026-06-19）、M1 2,419,364,744 ms（2026-01-20）。複数メッセージをまたぐ1指示の時間とは区別し、Longest runへの使用可否は未確認とする。

Muse Codeにも`duration_ms`は6件あるが、確認できたのは起動処理などの計測だった。1指示の完了時間としては使っていない。Cursorの`thinkingDurationMs`も`turnDurationMs`とは別の値で、ここには含めていない。

## 6. タイムゾーン

| ツール | 確認した表現 | Asia/Tokyoの日別区切り |
|---|---|---|
| Claude Code | `timestamp`: ISO 8601、`Z` | 可 |
| Codex | `timestamp`: ISO 8601、`Z` | 可。追加トークンも記録日時で区切る |
| Cursor | GUIの`createdAt`: ISO 8601、`Z`。CLIの`meta.value.createdAt`: Unixミリ秒 | 有効な日時がある行では可。日時のない行は未確認 |
| Muse Code | `recorded_at`: Unixマイクロ秒 | 診断・起動記録では可。利用量の時刻は未確認 |
| Grok系 | 診断ログの`ts`: ISO 8601、`Z` | 診断ログの日付は変換可。利用量の時刻は未確認 |
| opencode | `time_created`、`time.created`、`time.completed`: Unixミリ秒 | 可 |

ccusageと生ログの照合では、両方をAsia/Tokyoに揃えた。UTCの文字列の先頭10文字だけで日別集計していない。

## 7. クラウド側の実行分

全ツールで未確認。クラウド実行の既知の1件と、その取り込み後のローカル記録を突き合わせる確認はしていない。

Codexの確認した非圧縮ログには`source = vscode`、`exec`などがあり、これだけでクラウド実行分の有無や網羅性は判断できない。Cursorには`createdFromBackgroundAgent`というキーがあるが、確認した値はクラウド由来の利用量を証明するものではなかった。ローカルの数値とクラウドの数値が同じ範囲を数えているかは未確認。

## 8. 既存の定期実行

手元は`launchd`の`~/Library/LaunchAgents/*.plist`を使用。29件中、`StartCalendarInterval`が8件、`StartInterval`が5件あり、新たな設定はしていない。

M1も同じ保存先で`launchd`を使用。18件中、`StartCalendarInterval`が3件、`StartInterval`が4件。
