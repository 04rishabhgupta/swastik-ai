import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getKnowledgeBase } from "@/lib/knowledge";
import { getSystemPrompt } from "@/lib/prompt";

export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.AI_API_KEY || "dummy-key",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const knowledgeBase = await getKnowledgeBase();
    const systemPrompt = getSystemPrompt(knowledgeBase);
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    const result = streamText({
      model: openai(model),
      system: systemPrompt,
      messages,
      temperature: 0.1, // Keep temperature low for factual accuracy
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Sorry, I'm having trouble responding right now. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
