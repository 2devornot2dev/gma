// components/chat/chat-message.tsx
"use client";

import { cn } from "@/lib/utils";
import { ChatMarkdown } from "./chat-markdown";
import type { ChatMessage } from "./types";

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function ChatMessageBubble({
  message,
  isStreaming = false,
}: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        isUser ? "items-end" : "items-start"
      )}
    >
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-steel">
        {isUser ? "You" : "GMA Sales Desk"}
      </span>

      <div
        className={cn(
          "max-w-[88%] rounded-sm px-4 py-3 text-sm shadow-xs",
          isUser
            ? "bg-navy font-medium leading-relaxed whitespace-pre-wrap text-white"
            : "border border-steel-200 border-l-4 border-l-knicks bg-steel-50/80 text-steel-900"
        )}
      >
        {isUser ? (
          message.content
        ) : message.content ? (
          <ChatMarkdown content={message.content} />
        ) : isStreaming ? (
          <span className="text-steel">Checking catalog &amp; freight specs...</span>
        ) : null}

        {isStreaming && message.content.length > 0 && (
          <span
            className="mt-1 inline-block h-3.5 w-1.5 animate-pulse bg-knicks align-middle"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}