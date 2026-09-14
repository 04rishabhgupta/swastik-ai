const { streamText } = require("ai");
const { createOpenAI } = require("@ai-sdk/openai");

const hfOpenAI = createOpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: "hf_dummy",
});

async function run() {
  const result = streamText({
    model: hfOpenAI("Qwen/Qwen3.8-27B:preferred"),
    messages: [{role: "user", content: "hello"}],
  });
  console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(result)));
}
run().catch(console.error);
