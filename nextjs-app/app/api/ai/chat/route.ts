import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages, system } = body ?? {};

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: Array.isArray(messages) ? messages : [],
      system: typeof system === "string" ? system : undefined,
    });

    return result.toDataStreamResponse();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Chat route failed", details: String(err) }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }
}
