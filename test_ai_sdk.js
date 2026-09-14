const { streamText } = require("ai");
const { createOpenAI } = require("@ai-sdk/openai");

const hfOpenAI = createOpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: "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",
});

async function run() {
  try {
    const result = streamText({
      model: hfOpenAI.chat("mistralai/mistral-nemotron"),
      messages: [{role: "user", content: "hello"}],
    });
    for await (const chunk of result.textStream) {
      process.stdout.write(chunk);
    }
  } catch(e) {
    console.error(e);
  }
}
run();
