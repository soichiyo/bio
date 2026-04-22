// app/api/chat/route.ts

import { streamText, type ModelMessage } from "ai";
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

function pruneHistory(messages: ModelMessage[]): ModelMessage[] {
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
  const messages: ModelMessage[] = body.messages ?? [];

  // Validate latest user message
  // AI SDK v5+ sends parts array in raw body; extract text for validation
  const rawMessages: Array<{ role: string; content?: string; parts?: Array<{ type: string; text?: string }> }> = body.messages ?? [];
  const lastRaw = rawMessages[rawMessages.length - 1];
  if (lastRaw?.role === "user") {
    let content = "";
    if (typeof lastRaw.content === "string") {
      content = lastRaw.content;
    } else if (Array.isArray(lastRaw.parts)) {
      content = lastRaw.parts
        .filter((p) => p.type === "text")
        .map((p) => p.text ?? "")
        .join("");
    }
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

    return result.toUIMessageStreamResponse();
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
