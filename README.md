# Clinic AI Information Assistant

A production-quality AI chatbot for a medical clinic. It acts as an informational/administrative assistant to answer patient questions about the clinic based entirely on a local Markdown knowledge base.

## Features
- **Local RAG Architecture**: Answers are strictly grounded in `/data/knowledge.md`.
- **Stateless & Secure**: Server-side LLM logic prevents API key exposure.
- **Strict Scope Boundaries**: Actively refuses general knowledge queries and medical advice questions.
- **Voice & Text Input**: Seamlessly integrates text and microphone dictation.
- **Modern UI**: Powered by Next.js, Tailwind CSS, and `assistant-ui` for a Perplexity-style chat experience.

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Rename `.env.example` to `.env.local` and add your OpenAI-compatible API key:
   ```env
   AI_API_KEY=your_real_api_key_here
   AI_MODEL=gpt-4o-mini
   ```

3. **Update the Knowledge Base**
   Modify the contents of `/data/knowledge.md` to reflect your clinic's actual information. The AI automatically parses this file and uses it as the sole source of truth.

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to interact with the assistant.

## Configuration
Update `/lib/config.ts` to customize the clinic name, assistant name, and suggested questions.

## Disclaimer
This assistant is strictly for administrative information and is not a substitute for professional medical advice.
