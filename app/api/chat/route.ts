// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/actions/get-products";
import { buildGmaSystemPrompt } from "@/lib/business-logic";
import { createGroqChatStream, type GroqMessage } from "@/lib/groq";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages?: IncomingMessage[] };
    const incoming = Array.isArray(body.messages) ? body.messages : [];

    // Keep last 20 messages and strip extra keys (Groq rejects unknown fields like `name`)
    const history: GroqMessage[] = incoming
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-20)
      .map((m) => ({
        role: m.role,
        content: m.content.trim(),
      }));

    if (history.length === 0) {
      return NextResponse.json(
        { error: "At least one message is required." },
        { status: 400 }
      );
    }

    // Load cached catalog for grounded pricing answers (fail-open if DB/cache unavailable)
    let products: Awaited<ReturnType<typeof getProducts>> = [];
    try {
      products = await getProducts();
    } catch (err) {
      console.warn("[Chat] Could not load products for prompt context:", err);
    }

    const systemMessage: GroqMessage = {
      role: "system",
      content: buildGmaSystemPrompt(products),
    };

    const groqStream = await createGroqChatStream([systemMessage, ...history]);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of groqStream) {
            const delta = chunk.choices[0]?.delta?.content;
            if (delta) {
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (err) {
    console.error("[Chat API] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate response." },
      { status: 500 }
    );
  }
}