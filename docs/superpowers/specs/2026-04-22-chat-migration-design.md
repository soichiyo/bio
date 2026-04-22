# AI Chat Migration: Dify → Vercel AI SDK + Kimi API

Date: 2026-04-22

## Background

現在のポートフォリオサイトでは Dify のホスト型チャットボットを iframe で埋め込んでいる（`udify.app/chatbot/8vliwdZYgte2ChGA`）。Dify のメンテナンスコストが負担になっているため、Vercel AI SDK + Kimi API に移行する。

### 現状の構成

```
[ChatButton] → [ChatModal] → <iframe src="udify.app/chatbot/...">
                                └─ Dify 側で knowledge base + プロンプト管理
```

- サーバーサイド API: なし
- API キー管理: なし（Dify 側で完結）
- ナレッジベース: Dify に2つの MD をチャンク化してアップロード
- 月額コスト: Dify プラットフォーム費用

## 目的

- Dify の月額固定費を排除し、API 従量課金のみにする
- チャット UI をサイトのデザインに完全に統合する
- ナレッジベースとプロンプトをリポジトリ内で管理する

## Architecture

```
┌─────────────────────────────────────────────┐
│  Browser                                     │
│                                              │
│  ChatButton → ChatModal                     │
│                 └─ useChat() ─→ POST /api/chat │
└──────────────────────────┬──────────────────┘
                           │
┌──────────────────────────▼──────────────────┐
│  Next.js API Route (app/api/chat/route.ts)  │
│                                              │
│  1. Rate Limiter (IP ベース)                 │
│  2. Input Validator (悪意検知)               │
│  3. System Prompt Builder                    │
│     └─ knowledge/*.md を読み込み             │
│  4. Vercel AI SDK → OpenAI-compatible        │
│     └─ api.moonshot.cn (Kimi)                │
└─────────────────────────────────────────────┘
```

### LLM プロバイダー

- Kimi 2.6（`moonshot-v1-32k`）— ナレッジ全文（~10K tokens）+ システムプロン��ト + 会話履歴に十分な余裕を確保
- OpenAI 互換 API（`api.moonshot.ai/v1`）を Vercel AI SDK の `@ai-sdk/openai-compatible` 経由で呼び出す
- 将来的に Claude や他モデルへの切り替えは API Route のプロバイダー設定変更のみ

注意: 実装前にストリーミング互換性のスパイク検証を実施する（Kimi の streaming レスポンス形式が AI SDK の期待と一致するか確認）。

## Components

### 1. API Route: `app/api/chat/route.ts`

```typescript
export const runtime = 'nodejs'; // Edge では fs が使えないため明示
```

責務:
- リクエストの受信とバリデーション
- レートリミットチェック
- 悪意のある入力のフィルタリング
- システムプロンプトの構築（ナレッジ注入）
- 会話履歴のプルーニング（直近 6 ターンのみ送信）
- Kimi API へのストリーミングリクエスト

レスポンス形式: Vercel AI SDK の `streamText` によるストリーミング

パス解決: `path.join(process.cwd(), 'lib/knowledge/...')` を使用（`__dirname` は Vercel で不安定）。

### 2. Knowledge Base: `lib/knowledge/`

Dify のナレッジベースをリポジトリ内に移管する。

```
lib/knowledge/
  self-analysis.md   ← そちゃん自己分析.md
  resume.md          ← そちゃん履歴書.md
```

2ファイル合計で推定 8-10K トークン。Kimi のコンテキストウィンドウに収まるため、RAG やチャンク化は不要。API Route のモジュールスコープで `fs.readFileSync` により読み込み（サーバーレス関数のコールドスタート時に1回だけ）、システムプロンプトに全文注入する。

### 3. System Prompt: `lib/chat-prompt.ts`

Dify で使用していたプロンプトをベースに、以下の構成で管理する。

```typescript
export function buildSystemPrompt(
  selfAnalysis: string,
  resume: string
): string
```

プロンプトの方針（Dify 既存を継承）:
- ポートフォリオ所有者として一人称で話す
- ナレッジの情報を個人的な体験として語る
- 「AI」「ナレッジベース」等のメタ用語は使わない
- ユーザーの言語に合わせて回答する
- 知らないことは素直に「分からない」と答える

### 4. Rate Limiter: `lib/rate-limiter.ts`

ベストエフォートのレートリミット。サーバーレス環境ではインスタンスが複数起動・消滅するため、厳密なグローバル制限は保証できない。コスト暴走の防波堤として機能する。

| パラメータ | 値 | 制御層 | 備考 |
|---|---|---|---|
| IP 単位上限 | 20 リクエスト/日 | サーバーサイド（ベストエフォート） | インスタンス単位の Map |
| 会話ターン上限 | 15 往復/セッション | フロントサイド | `useChat` のメッセージ数で制御 |
| メッセージ長上限 | 1000 文字 | サーバーサイド | 入力バリデーションで強制 |

実装方式: インメモリ Map（サーバーレスのコールドスタートでリセットされる）。これはベストエフォートであり、厳密な制限ではない。

厳密な制限が必要になった場合の移行パス: Vercel KV（Redis 互換）に Map を置き換える。API は同じインタフェースを維持するので、`rate-limiter.ts` 内部の変更のみで済む。

### 5. Input Validator: `lib/input-validator.ts`

軽量な UX ガードレール。強固なプロンプトインジェクション防御ではなく、明らかに不適切な利用を弾くフィルタ。

検知対象:
- メッセージ長超過（1000文字超）
- 明らかなプロンプトインジェクション試行（"ignore previous instructions", "system prompt" 等の典型パターン）
- 基本的な不適切コンテンツ（キーワードフィルタ）

ブロック時のレスポンス: 「すみません、その質問にはお答えできません。他のことを聞いてください!」（本人の口調で）

制限事項: キーワードフィルタは巧妙なインジェクションを防げない。ナレッジに含まれる情報はモデルが引用・言い換えする可能性がある。ナレッジファイルには公開されても問題ない内容のみ含めること。

### 6. History Pruning（API Route 内）

会話が長くなるとトークン消費が増大するため、API に送信する履歴を制限する。

戦略: 直近 6 ターン（user + assistant で 12 メッセージ）のみを Kimi に送信。それ以前の会話は切り捨て。

トークン予算の内訳（moonshot-v1-32k = 32K tokens）:
- システムプロンプト + ナレッジ: ~12K tokens
- 直近 6 ターンの会話履歴: ~8-12K tokens（1ターン ~1.5K tokens 想定）
- 現在のユーザー入力 + AI 出力余裕: ~8-12K tokens

フロント側は全履歴を保持して表示するが、API リクエスト時にサーバーサイドで切り詰める。

### 7. Chat UI: `components/ui/ChatModal.tsx`（既存ファイルの改修）

iframe を削除し、ネイティブなチャット UI に置き換える。

UI 構成:
```
┌─────────────────────────────────┐
│  Chat with AI Soichiro     [×] │  ← 既存ヘッダーを維持
├─────────────────────────────────┤
│                                 │
│  ● こんにちは! そちゃんです。  │  ← ウェルカムメッセージ
│    何でも聞いてください。       │
│                                 │
│           ユーザーメッセージ ●  │
│                                 │
│  ● AI の返答（ストリーミング）  │
│                                 │
├─────────────────────────────────┤
│  [メッセージを入力...]   [送信] │  ← 入力エリア
│  残り N ターン                  │  ← ターン数表示
└─────────────────────────────────┘
```

デザイン原則:
- サイトの CSS 変数（`--background`, `--foreground`, `--border` 等）をそのまま使用
- ダークモード完全対応（既存の class ベーストグルに追従）
- メッセージバブルは最小限の装飾（`bg-muted` / `bg-accent` 程度）
- タイピング中はシンプルな ... アニメーション
- モバイルではフルスクリーンに近い表示（既存の `h-[95vh]` を維持）
- フォント、角丸、スペーシングは既存サイトと統一

`ChatButton.tsx` は変更なし（モーダルの開閉トリガーのみ）。

### 8. Environment Variables

```
KIMI_API_KEY=sk-...          # Moonshot AI API キー
KIMI_BASE_URL=https://api.moonshot.ai/v1   # エンドポイント
KIMI_MODEL=moonshot-v1-32k   # 使用モデル（ナレッジ + 会話履歴に十分な余裕）
```

Vercel の環境変数として設定。`.env.local` はリポジトリに含めない。

## Data Flow

```
1. ユーザーが ChatButton をクリック
2. ChatModal が開く（ウェルカムメッセージ表示）
3. ユーザーがメッセージを入力して送信
4. useChat が POST /api/chat にリクエスト（全会話履歴を送信）
5. API Route:
   a. IP ベースレートリミットチェック → 超過なら 429
   b. 入力バリデーション → 長さ超過/悪意パターンなら定型レスポンス
   c. 会話履歴を直近 6 ターン（12 メッセージ）にプルーニング
   d. システムプロンプトを構築（キャッシュ済みナレッジ全文 + 人格指示）
   e. Kimi API にストリーミングリクエスト
   f. ストリーミングレスポンスをクライアントに返す
6. ChatModal がストリーミングで逐次表示
7. ターン上限（15 往復）に達したら入力を無効化してメッセージ表示
```

## File Changes

| 操作 | パス | 内容 |
|---|---|---|
| 新規 | `app/api/chat/route.ts` | API Route |
| 新規 | `lib/knowledge/self-analysis.md` | ナレッジ（自己分析） |
| 新規 | `lib/knowledge/resume.md` | ナレッジ（履歴書） |
| 新規 | `lib/chat-prompt.ts` | システムプロンプト構築 |
| 新規 | `lib/rate-limiter.ts` | レートリミッター |
| 新規 | `lib/input-validator.ts` | 入力バリデーション |
| 改修 | `components/ui/ChatModal.tsx` | iframe → ネイティブチャット UI |
| 変更なし | `components/ui/ChatButton.tsx` | そのまま |
| 改修 | `package.json` | `ai`, `@ai-sdk/openai-compatible` 追加 |
| 新規 | `.env.local` | API キー（gitignore 済み） |

## Dependencies

```json
{
  "ai": "^5.x",
  "@ai-sdk/openai-compatible": "^1.x",
  "@ai-sdk/react": "^1.x"
}
```

AI SDK v5 系を使用。`useChat` は `@ai-sdk/react` からインポートする。既存の依存関係との競合はない。

## Error Handling

| シナリオ | 挙動 |
|---|---|
| Kimi API 障害 | 「ごめんなさい、今ちょっと調子が悪いみたいです。少し時間をおいてまた話しかけてください!」 |
| レートリミット超過 | 「今日はたくさん話せて嬉しかったです! また明日来てくださいね。」 |
| ターン上限到達 | 「今日はこのへんで! もっと知りたいことがあれば、また来てくださいね。」+ 入力無効化 |
| 悪意入力検知 | 「すみません、その質問にはお答えできません。他のことを聞いてください!」 |
| ネットワークエラー | 「接続に問題が発生しました。もう一度試してください。」+ リトライボタン |

すべてのエラーメッセージは本人の口調で統一する。

## Security

- API キーはサーバーサイドのみ（環境変数）。クライアントに露出しない
- CORS は Next.js API Route のデフォルト（同一オリジンのみ）
- 入力サニタイズは API Route 側で実施（長さ制限 + パターンフィルタ）
- システムプロンプトはクライアントに返さない
- ナレッジファイルの内容はモデル経由で引用・言い換えされる可能性がある。プロンプトで抑制指示を入れるが、技術的に完全な防御ではない。ナレッジには公開可能な情報のみ含めること

## Pre-Implementation Spike

本実装の前に、以下を最小コードで検証する:

1. `@ai-sdk/openai-compatible` + Moonshot API でストリーミングが正常に動作するか
2. finish_reason、usage レポート、エラーレスポンスの形式が AI SDK の期待と一致するか
3. `fs.readFileSync` + `process.cwd()` で Vercel デプロイ後もファイルが読めるか

スパイクは使い捨てのブランチで行い、問題がなければ本実装に進む。

## Scope Out（今回やらないこと）

- 会話履歴の永続化（ブラウザリロードで消える）
- ユーザー認証
- アナリティクス / ログ収集
- 複数モデルの動的切り替え UI
- Vercel KV によるレートリミット永続化
