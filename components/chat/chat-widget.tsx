// components/chat/chat-widget.tsx
"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatPanel } from "./chat-panel";

export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);

  // Lock background scroll on mobile when full screen
  React.useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (mq.matches) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Close when clicking outside the chat panel or pressing Escape
  React.useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: PointerEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);


  return (
    <>
      {/* Chat Panel (stays mounted so chat history is preserved on close) */}
      <div
        ref={panelRef}
        aria-hidden={!open}
        inert={!open}
        className={cn(
          "fixed inset-0 z-50 flex flex-col origin-bottom-right transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none sm:inset-auto sm:bottom-6 sm:right-6 sm:block",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-[0.97] opacity-0"
        )}
      >
        <ChatPanel
          onClose={() => setOpen(false)}
          className="h-full w-full sm:h-[720px] sm:max-h-[88vh] sm:w-[520px]"
        />
      </div>

      {/* Floating Launcher Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open GMA Sales Desk"
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
        className={cn(
          "group fixed bottom-6 right-6 z-40 flex items-center gap-3.5 border border-white/20 bg-navy-950 px-5 py-3.5 text-white shadow-2xl transition-all duration-200 ease-out hover:border-knicks hover:bg-navy hover:shadow-knicks/20 motion-reduce:transition-none",
          open
            ? "pointer-events-none translate-y-2 scale-95 opacity-0"
            : "pointer-events-auto translate-y-0 scale-100 opacity-100"
        )}
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-knicks opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-knicks" />
        </span>
        <MessageSquare className="h-4 w-4 text-knicks" />
        <span className="font-display text-xs font-black uppercase tracking-[0.2em] text-white">
          Wholesale Inquiries
        </span>
      </button>
    </>
  );
}