import { InferenceClient } from "@huggingface/inference";
import { getKnowledgeBase } from "@/lib/knowledge";
import { getSystemPrompt } from "@/lib/prompt";

export const maxDuration = 30;

const client = new InferenceClient(process.env.HF_TOKEN);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const knowledgeBase = await getKnowledgeBase();
    const systemPrompt = getSystemPrompt(knowledgeBase);

    const hfMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const stream = await client.chatCompletionStream({
      model: "Qwen/Qwen3.8-27B:novita",
      messages: hfMessages,
      temperature: 0.1,
    });

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
