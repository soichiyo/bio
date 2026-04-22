"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
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
  const [inputText, setInputText] = useState("");

  const {
    messages,
    sendMessage,
    status,
    error,
    regenerate,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish: () => {
      setTurnCount((prev) => prev + 1);
    },
    onError: () => {
      // Error is handled via the error state
    },
  });

  const isLoading = status === "submitted" || status === "streaming";
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
    setInputText("");
    onClose();
  }

  function handleSend() {
    if (!inputText.trim() || isLoading || isAtLimit) return;
    const text = inputText.trim();
    setInputText("");
    sendMessage({ text });
  }

  // Handle Enter to submit (Shift+Enter for newline)
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
    return message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("");
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
                {getMessageText(message)}
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
                onClick={() => regenerate()}
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
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
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
              type="button"
              onClick={handleSend}
              disabled={!inputText.trim() || isLoading || isAtLimit}
              className="shrink-0 p-2.5 rounded-xl bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
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
