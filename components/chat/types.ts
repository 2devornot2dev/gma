// components/chat/types.ts
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}