import OpenAI from "openai";

// DeepSeek's API is OpenAI-compatible, so the official OpenAI SDK works
// against it directly by pointing baseURL at DeepSeek instead.
let client: OpenAI | null = null;

export function getDeepSeekClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: "https://api.deepseek.com",
    });
  }
  return client;
}
