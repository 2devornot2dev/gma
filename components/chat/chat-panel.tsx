// components/chat/chat-panel.tsx
"use client";

import * as React from "react";
import { ArrowRight, ArrowUp, RotateCcw, Sparkles, Square, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessageBubble } from "./chat-message";
import type { ChatMessage } from "./types";

const STARTER_PROMPTS = [
  "Show me all beef cuts under $100 CAD",
  "How do volume discount tiers work for bulk export?",
  "Compare portion specs and prices for lobster tails",
  "What are the cold-chain shipping lead times & dry ice options?",
];

interface ChatPanelProps {
  className?: string;
  onClose?: () => void;
}

export function ChatPanel({ className, onClose }: ChatPanelProps) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const abortRef = React.useRef<AbortController | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming]);

  const sendMessage = React.useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      setInput("");

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: trimmed,
      };
      const assistantId = crypto.randomUUID();
      const assistantPlaceholder: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      const nextHistory = [...messages, userMsg];
      setMessages([...nextHistory, assistantPlaceholder]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            messages: nextHistory.map(({ role, content }) => ({
              role,
              content,
            })),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          throw new Error(errData?.error || `Server responded with ${res.status}`);
        }

        if (!res.body) throw new Error("No response body received from server");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const msg = (err as Error).message || "Connection failed";
          setError(msg);
          setMessages((prev) =>
            prev.filter((m) => m.id !== assistantId || m.content.length > 0)
          );
        }
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [isStreaming, messages]
  );

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleReset() {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden bg-white shadow-2xl sm:border sm:border-navy sm:shadow-2xl",
        className
      )}
    >
      {/* Header */}
      <div className="shrink-0 bg-navy text-white">
        <div className="h-1 w-full bg-knicks" />
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-knicks text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-sm font-black uppercase tracking-[0.16em] text-white">
                  Wholesale Inquiries
                </h2>
                <span className="border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-knicks">
                  CAD
                </span>
              </div>
              <p className="text-xs text-white/70">
                Live Pricing • Cold-Chain Logistics • Catalog Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                title="Reset conversation"
                className="flex h-8 w-8 items-center justify-center rounded-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                title="Close"
                className="flex h-8 w-8 items-center justify-center rounded-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-color:var(--color-steel-300)_transparent] [scrollbar-width:thin]"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-between gap-6 py-2">
            <div className="space-y-3 border-l-2 border-knicks pl-4">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-knicks">
                Direct Wholesale Support
              </p>
              <p className="text-sm leading-relaxed text-steel-700">
                Ask about pricing on any of GMA’s 137 wholesale protein cuts,
                pallet specifications, container minimums, and worldwide cold-chain transport.
              </p>
            </div>

            <div className="space-y-2.5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-steel">
                Recommended Queries
              </p>
              <div className="divide-y divide-steel-100 border border-steel-200 bg-steel-50/60">
                {STARTER_PROMPTS.map((prompt, idx) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-xs font-bold text-navy transition-colors hover:bg-navy hover:text-white"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[11px] text-steel-300 group-hover:text-knicks">
                        0{idx + 1}
                      </span>
                      <span>{prompt}</span>
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-steel-300 transition-transform group-hover:translate-x-1 group-hover:text-knicks" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {messages.map((msg, idx) => (
              <ChatMessageBubble
                key={msg.id}
                message={msg}
                isStreaming={
                  isStreaming &&
                  idx === messages.length - 1 &&
                  msg.role === "assistant"
                }
              />
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 border-l-4 border-destructive bg-destructive/10 p-3.5 text-xs font-semibold text-destructive">
            <p className="font-bold uppercase tracking-wide">Error</p>
            <p className="mt-1 font-mono">{error}</p>
          </div>
        )}
      </div>

      {/* Input Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
        className="shrink-0 border-t border-steel-200 bg-steel-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-3 border-2 border-steel-300 bg-white px-3.5 py-2.5 transition-colors focus-within:border-navy">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about cuts, CAD pricing, volume tiers, or freight..."
            disabled={isStreaming}
            className="max-h-32 flex-1 resize-none bg-transparent text-sm leading-relaxed text-steel-900 placeholder:text-steel-300 focus:outline-none disabled:opacity-60"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-steel-900 text-white transition-colors hover:bg-navy"
              title="Stop generating"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-knicks text-white transition-colors hover:bg-knicks-600 disabled:bg-steel-200 disabled:text-steel-300"
              title="Send inquiry"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}