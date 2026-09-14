import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { getKnowledgeBase } from "@/lib/knowledge";
import { getSystemPrompt } from "@/lib/prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const nvidiaKey = process.env.NVIDIA_API_KEY;
    if (!nvidiaKey || !nvidiaKey.startsWith("nvapi-")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid NVIDIA API key (NVIDIA_API_KEY) in environment variables. It must start with 'nvapi-'." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    const knowledgeBase = await getKnowledgeBase();
    const systemPrompt = getSystemPrompt(knowledgeBase);

    // Initialize OpenAI compatible client pointing to NVIDIA NIM
    const nvidiaOpenAI = createOpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: nvidiaKey,
      // @ts-expect-error: compatibility is supported in newer ai-sdk versions but missing in the installed types
      compatibility: "compatible",
    });

    const result = streamText({
      model: nvidiaOpenAI.chat("mistralai/mistral-nemotron"),
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
