// lib/groq.ts
import OpenAI from "openai";

export const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
export const GROQ_DEFAULT_MODEL = "openai/gpt-oss-120b";

let cachedClient: OpenAI | null = null;

export function getGroqClient(): OpenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable.");
  }

  cachedClient = new OpenAI({
    apiKey,
    baseURL: GROQ_BASE_URL,
  });

  return cachedClient;
}

export function getGroqModel(): string {
  return process.env.GROQ_MODEL ?? GROQ_DEFAULT_MODEL;
}

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function createGroqChatStream(messages: GroqMessage[]) {
  const client = getGroqClient();

  return client.chat.completions.create({
    model: getGroqModel(),
    messages,
    temperature: 0.4,
    max_completion_tokens: 1024,
    stream: true,
  });
}