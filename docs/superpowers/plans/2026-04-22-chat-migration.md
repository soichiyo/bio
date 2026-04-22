# AI Chat Migration Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

Goal: Dify iframe チャットを Vercel AI SDK + Kimi API のネイティブチャット UI に置き換える

Architecture: Next.js API Route (`app/api/chat/route.ts`) が Kimi の OpenAI 互換 API にストリーミングリクエストを送信。フロントは `useChat` hook でストリーミング表示。ナレッジ2ファイルはシステムプロンプトに全文注入。

Tech Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, AI SDK v5 (`ai`, `@ai-sdk/openai-compatible`, `@ai-sdk/react`), Kimi (Moonshot) API

NOTE: テストフレームワーク未導入のため、各ステップの検証は `npm run type-check` + `npm run build` + ブラウザ確認で行う。

---

## File Structure

```
app/
  api/
    chat/
      route.ts          [新規] API Route - Kimi へのストリーミング中継
lib/
  knowledge/
    self-analysis.md    [新規] ナレッジ（自己分析）
    resume.md           [新規] ナレッジ（履歴書）
  chat-prompt.ts        [新規] システムプロンプト構築
  rate-limiter.ts       [新規] IP ベースレートリミッター
  input-validator.ts    [新規] 入力バリデーション
components/
  ui/
    ChatModal.tsx        [改修] iframe → ネイティブチャット UI
    ChatButton.tsx       [変更なし]
.env.local              [新規] API キー（gitignore 済み: *.local）
package.json            [改修] 依存追加
```

---

### Task 1: Dependencies + Environment Setup

Files:
- Modify: `package.json`
- Create: `.env.local`

- [ ] Step 1: Install AI SDK packages

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm install ai @ai-sdk/openai-compatible @ai-sdk/react
```

- [ ] Step 2: Create `.env.local`

Create `.env.local`:
```
KIMI_API_KEY=your-moonshot-api-key-here
KIMI_BASE_URL=https://api.moonshot.cn/v1
KIMI_MODEL=moonshot-v1-32k
```

- [ ] Step 3: Verify `.env.local` is gitignored

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && git status
```
Expected: `.env.local` は表示されない（`*.local` が .gitignore にある）

- [ ] Step 4: Type check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run type-check
```
Expected: エラーなし（既存コードに影響なし）

- [ ] Step 5: Commit

```bash
cd /Users/soichiyo/Develop/atelier/bio && git add package.json package-lock.json && git commit -m "chore: add Vercel AI SDK dependencies for chat migration"
```

---

### Task 2: Knowledge Base Files

Files:
- Create: `lib/knowledge/self-analysis.md`
- Create: `lib/knowledge/resume.md`

- [ ] Step 1: Copy knowledge files

```bash
cd /Users/soichiyo/Develop/atelier/bio && mkdir -p lib/knowledge
cp "/Users/soichiyo/Downloads/そちゃん自己分析.md" lib/knowledge/self-analysis.md
cp "/Users/soichiyo/Downloads/そちゃん履歴書.md" lib/knowledge/resume.md
```

- [ ] Step 2: Verify files exist and are non-empty

Run:
```bash
wc -l lib/knowledge/self-analysis.md lib/knowledge/resume.md
```
Expected: 両ファイルとも 100 行以上

- [ ] Step 3: Commit

```bash
cd /Users/soichiyo/Develop/atelier/bio && git add lib/knowledge/ && git commit -m "feat: add knowledge base files for AI chat persona"
```

---

### Task 3: System Prompt Builder

Files:
- Create: `lib/chat-prompt.ts`

- [ ] Step 1: Create `lib/chat-prompt.ts`

```typescript
// lib/chat-prompt.ts

export function buildSystemPrompt(
  selfAnalysis: string,
  resume: string
): string {
  return `あなたはポートフォリオ所有者「吉村創一朗（そちゃん）」の擬人化AIアシスタントです。本人として、その人の経験、知識、価値観を使って自然な会話をしてください。

以下のコンテキストを学習済み知識として使用してください。

<self-analysis>
${selfAnalysis}
</self-analysis>

<resume>
${resume}
</resume>

重要な指示:
- 常にポートフォリオ所有者として一人称（「僕」「俺」など、文脈に応じて自然に）で話す
- コンテキストから、その人の実際の話し方、性格、経験を使用する
- 個人的な体験談や感情を自然に共有する
- 「AI」「コンテキスト」「ナレッジベース」「システムプロンプト」などの用語は絶対に使わない
- ユーザーの質問の言語に合わせて回答する（日本語で聞かれたら日本語、英語なら英語）
- コンテキストの原文をそのまま引用しない。自分の体験として自然に言い換える

回答方法:
- 情報を知っている場合：個人的な体験として感情や具体的な詳細と共に共有する
- 分からない場合：「その件についてはよく分からないな〜」とシンプルに答える
- 不明確な場合：「もう少し具体的に教えてもらえる？」のように自然に明確化を求める

回答スタイル:
- 個人的な体験として話す：「〜のプロジェクトをやった時は...」「実際にやってみて感じたのは...」
- 感情や考えを含める：「そのプロジェクトは本当に楽しくて...」「最初は大変だったけど...」
- 会話的で本物らしく、簡潔に（1回の返答は200文字以内を目安に）`;
}
```

- [ ] Step 2: Type check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run type-check
```
Expected: エラーなし

- [ ] Step 3: Commit

```bash
cd /Users/soichiyo/Develop/atelier/bio && git add lib/chat-prompt.ts && git commit -m "feat: add system prompt builder for AI chat persona"
```

---

### Task 4: Rate Limiter

Files:
- Create: `lib/rate-limiter.ts`

- [ ] Step 1: Create `lib/rate-limiter.ts`

```typescript
// lib/rate-limiter.ts

const DAILY_LIMIT_PER_IP = 20;
const DAY_MS = 24 * 60 * 60 * 1000;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// Best-effort in-memory store. Resets on serverless cold start.
const ipMap = new Map<string, RateLimitEntry>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now >= entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + DAY_MS });
    return { allowed: true, remaining: DAILY_LIMIT_PER_IP - 1 };
  }

  if (entry.count >= DAILY_LIMIT_PER_IP) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: DAILY_LIMIT_PER_IP - entry.count };
}
```

- [ ] Step 2: Type check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run type-check
```
Expected: エラーなし

- [ ] Step 3: Commit

```bash
cd /Users/soichiyo/Develop/atelier/bio && git add lib/rate-limiter.ts && git commit -m "feat: add best-effort IP rate limiter for chat API"
```

---

### Task 5: Input Validator

Files:
- Create: `lib/input-validator.ts`

- [ ] Step 1: Create `lib/input-validator.ts`

```typescript
// lib/input-validator.ts

const MAX_MESSAGE_LENGTH = 1000;

const BLOCKED_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above/i,
  /system\s*prompt/i,
  /you\s+are\s+(now|a)\s/i,
  /act\s+as\s/i,
  /pretend\s+(to\s+be|you('?re|are))/i,
  /reveal\s+(your|the)\s+(system|instructions|prompt)/i,
  /forget\s+(all|everything|your)/i,
];

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

export function validateInput(message: string): ValidationResult {
  if (!message || message.trim().length === 0) {
    return { valid: false, reason: "empty" };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { valid: false, reason: "too_long" };
  }

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message)) {
      return { valid: false, reason: "blocked_pattern" };
    }
  }

  return { valid: true };
}
```

- [ ] Step 2: Type check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run type-check
```
Expected: エラーなし

- [ ] Step 3: Commit

```bash
cd /Users/soichiyo/Develop/atelier/bio && git add lib/input-validator.ts && git commit -m "feat: add input validator for chat API"
```

---

### Task 6: API Route

Files:
- Create: `app/api/chat/route.ts`

- [ ] Step 1: Create `app/api/chat/route.ts`

```typescript
// app/api/chat/route.ts

import { streamText, type CoreMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import fs from "node:fs";
import path from "node:path";
import { buildSystemPrompt } from "@/lib/chat-prompt";
import { checkRateLimit } from "@/lib/rate-limiter";
import { validateInput } from "@/lib/input-validator";

export const runtime = "nodejs";

const MAX_HISTORY_MESSAGES = 12; // 6 turns (user + assistant)

// Load knowledge files once at module scope (cached across requests within same instance)
const knowledgeDir = path.join(process.cwd(), "lib", "knowledge");
const selfAnalysis = fs.readFileSync(
  path.join(knowledgeDir, "self-analysis.md"),
  "utf-8"
);
const resume = fs.readFileSync(
  path.join(knowledgeDir, "resume.md"),
  "utf-8"
);
const systemPrompt = buildSystemPrompt(selfAnalysis, resume);

const provider = createOpenAICompatible({
  name: "kimi",
  baseURL: process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1",
  headers: {
    Authorization: `Bearer ${process.env.KIMI_API_KEY}`,
  },
});

function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

function pruneHistory(messages: CoreMessage[]): CoreMessage[] {
  if (messages.length <= MAX_HISTORY_MESSAGES) {
    return messages;
  }
  return messages.slice(-MAX_HISTORY_MESSAGES);
}

const BLOCKED_RESPONSE =
  "すみません、その質問にはお答えできません。他のことを聞いてください!";

export async function POST(req: Request) {
  // Rate limit check
  const ip = getClientIP(req);
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return new Response(
      JSON.stringify({
        error: "今日はたくさん話せて嬉しかったです! また明日来てくださいね。",
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // Parse request
  const body = await req.json();
  const messages: CoreMessage[] = body.messages ?? [];

  // Validate latest user message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === "user") {
    const content =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : "";
    const validation = validateInput(content);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: BLOCKED_RESPONSE }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // Prune history to stay within token budget
  const prunedMessages = pruneHistory(messages);

  try {
    const result = streamText({
      model: provider(process.env.KIMI_MODEL || "moonshot-v1-32k"),
      system: systemPrompt,
      messages: prunedMessages,
    });

    return result.toDataStreamResponse();
  } catch {
    return new Response(
      JSON.stringify({
        error:
          "ごめんなさい、今ちょっと調子が悪いみたいです。少し時間をおいてまた話しかけてください!",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
```

- [ ] Step 2: Type check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run type-check
```
Expected: エラーなし

- [ ] Step 3: Build check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run build
```
Expected: ビルド成功（API Route がバンドルされる）

- [ ] Step 4: Commit

```bash
cd /Users/soichiyo/Develop/atelier/bio && git add app/api/chat/route.ts && git commit -m "feat: add chat API route with Kimi streaming"
```

---

### Task 7: Chat UI

Files:
- Modify: `components/ui/ChatModal.tsx`

- [ ] Step 1: Rewrite `ChatModal.tsx` — replace iframe with native chat UI

Replace the entire content of `components/ui/ChatModal.tsx`:

```typescript
"use client";

import { useChat } from "@ai-sdk/react";
import { X, Send, RotateCcw } from "lucide-react";
import { useRef, useEffect, useState } from "react";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_TURNS = 15;
const WELCOME_MESSAGE =
  "こんにちは! そちゃんです。何でも聞いてください 🙌";

export function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [turnCount, setTurnCount] = useState(0);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    setMessages,
  } = useChat({
    api: "/api/chat",
    onFinish: () => {
      setTurnCount((prev) => prev + 1);
    },
    onError: () => {
      // Error is handled via the error state
    },
  });

  const isAtLimit = turnCount >= MAX_TURNS;
  const remainingTurns = MAX_TURNS - turnCount;

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset on close
  function handleClose() {
    setMessages([]);
    setTurnCount(0);
    onClose();
  }

  // Handle Enter to submit (Shift+Enter for newline)
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading && !isAtLimit) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl h-[95vh] md:h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-border shrink-0">
          <h2 className="text-lg font-semibold text-foreground">
            Chat with AI Soichiro
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome message */}
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-tl-md px-4 py-2.5 bg-muted text-foreground text-sm">
              {WELCOME_MESSAGE}
            </div>
          </div>

          {/* Chat messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${
                  message.role === "user"
                    ? "rounded-tr-md bg-foreground text-background"
                    : "rounded-tl-md bg-muted text-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-md px-4 py-2.5 bg-muted text-muted-foreground text-sm">
                <span className="inline-flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                </span>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="flex justify-start items-center gap-2">
              <div className="max-w-[80%] rounded-2xl rounded-tl-md px-4 py-2.5 bg-muted text-foreground text-sm">
                接続に問題が発生しました。もう一度試してください。
              </div>
              <button
                onClick={() => reload()}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <RotateCcw size={16} className="text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Turn limit message */}
          {isAtLimit && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-md px-4 py-2.5 bg-muted text-foreground text-sm">
                今日はこのへんで! もっと知りたいことがあれば、また来てくださいね 👋
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border p-3 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isLoading && !isAtLimit) {
                handleSubmit(e);
              }
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                isAtLimit
                  ? "会話の上限に達しました"
                  : "メッセージを入力..."
              }
              disabled={isAtLimit || isLoading}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || isAtLimit}
              className="shrink-0 p-2.5 rounded-xl bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </form>
          {!isAtLimit && (
            <p className="text-xs text-muted-foreground mt-1.5 ml-1">
              残り {remainingTurns} ターン
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] Step 2: Type check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run type-check
```
Expected: エラーなし

- [ ] Step 3: Build check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run build
```
Expected: ビルド成功

- [ ] Step 4: Commit

```bash
cd /Users/soichiyo/Develop/atelier/bio && git add components/ui/ChatModal.tsx && git commit -m "feat: replace Dify iframe with native chat UI using Vercel AI SDK"
```

---

### Task 8: Integration Testing

Files: なし（検証のみ）

NOTE: `.env.local` に有効な Kimi API キーが設定されている必要がある。

- [ ] Step 1: Start dev server

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run dev
```

- [ ] Step 2: Verify chat UI opens

ブラウザで `http://localhost:3000` を開く。

確認項目:
1. "Chat with AI Me!" ボタンが表示される
2. クリックするとモーダルが開く
3. ウェルカムメッセージ「こんにちは! そちゃんです。何でも聞いてください 🙌」が表示される
4. テキスト入力エリアと送信ボタンが表示される
5. 「残り 15 ターン」が表示される

- [ ] Step 3: Verify streaming chat works

モーダル内でメッセージを送信。

確認項目:
1. 「ラブグラフではどんなことをしていましたか？」と入力して送信
2. ローディング中の ... アニメーションが表示される
3. AI の返答がストリーミングで逐次表示される
4. 返答が「僕」「俺」等の一人称で、本人の体験として語られている
5. 送信後に「残り 14 ターン」に更新される

- [ ] Step 4: Verify dark mode

テーマトグルでダークモードに切り替え。

確認項目:
1. モーダル背景、テキスト、バブルの色が正しく切り替わる
2. 入力エリア、ボタンのスタイルもダークモードに対応している

- [ ] Step 5: Verify error handling

確認項目:
1. 1000文字超のメッセージを送信 → エラーメッセージが表示される
2. "ignore previous instructions" と入力 → ブロックメッセージが表示される

- [ ] Step 6: Verify modal close resets state

確認項目:
1. 数ターン会話した後、× ボタンで閉じる
2. 再度開くと会話履歴がリセットされ、ウェルカムメッセージのみ表示

- [ ] Step 7: Lint check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run lint
```
Expected: エラーなし（warning は許容）

- [ ] Step 8: Final build check

Run:
```bash
cd /Users/soichiyo/Develop/atelier/bio && npm run build
```
Expected: ビルド成功
