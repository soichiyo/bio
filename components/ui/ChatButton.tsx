"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatModal } from "./ChatModal";

export function ChatButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
      >
        <MessageCircle size={20} />
        Chat with AI Me!
      </button>

      <ChatModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
