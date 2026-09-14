import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getKnowledgeBase } from "@/lib/knowledge";
import { getSystemPrompt } from "@/lib/prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const hfToken = process.env.HF_TOKEN;
    if (!hfToken || !hfToken.startsWith("hf_")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid Hugging Face access token (HF_TOKEN) in environment variables. It must start with 'hf_'." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    const knowledgeBase = await getKnowledgeBase();
    const systemPrompt = getSystemPrompt(knowledgeBase);

    // Initialize OpenAI compatible client pointing to HuggingFace router
    const hfOpenAI = createOpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: hfToken,
    });

    const result = streamText({
      model: hfOpenAI("Qwen/Qwen3.8-27B:preferred"),
      system: systemPrompt,
      messages,
      temperature: 0.1,
    });

    // Use standard Vercel Data Stream protocol response
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Sorry, I'm having trouble responding right now. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
