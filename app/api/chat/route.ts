import { InferenceClient } from "@huggingface/inference";
import { getKnowledgeBase } from "@/lib/knowledge";
import { getSystemPrompt } from "@/lib/prompt";

export const maxDuration = 30;

const client = new InferenceClient(process.env.HF_TOKEN);

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

    const sanitizedMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content
    }));

    const hfMessages = [
      { role: "system", content: systemPrompt },
      ...sanitizedMessages
    ];

    let stream;
    try {
      stream = await client.chatCompletionStream({
        model: "Qwen/Qwen3.8-27B:novita",
        messages: hfMessages,
        temperature: 0.1,
      });
    } catch (apiError) {
      console.error("HuggingFace API initialization error:", apiError);
      return new Response(
        JSON.stringify({ error: "Failed to initialize chat stream with the AI provider." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              // Encode stream chunk in Vercel AI SDK Data Stream protocol
              controller.enqueue(
                new TextEncoder().encode(`0:${JSON.stringify(content)}\n`)
              );
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(readableStream, {
      headers: { 
        "Content-Type": "text/plain; charset=utf-8", 
        "x-vercel-ai-data-stream": "v1" 
      }
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(JSON.stringify({ error: "Sorry, I'm having trouble responding right now. Please try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
