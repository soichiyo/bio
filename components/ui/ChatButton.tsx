"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatModal } from "./ChatModal";

type ChatButtonProps = {
  variant?: "floating" | "inline";
};

export function ChatButton({ variant = "floating" }: ChatButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (variant === "inline") {
    return (
      <>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity duration-200 hover:opacity-80"
        >
          <MessageCircle size={20} />
          Chat with AI Me!
        </button>

        <ChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex min-w-[178px] items-center gap-3 border border-border bg-card px-4 py-3 text-left text-foreground transition-colors duration-200 hover:border-[var(--border-visible)] hover:bg-accent sm:bottom-5 sm:right-5"
        aria-label="そちゃんAIとChatする"
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center border border-border">
          <MessageCircle size={17} strokeWidth={1.5} />
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2 font-data text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
            <span className="led-dot h-1.5 w-1.5" />
            AI Chat / Live
          </span>
          <span className="mt-0.5 block text-sm font-medium tracking-[-0.01em]">
            そちゃんAIと話す
          </span>
        </span>
      </button>

      <ChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
