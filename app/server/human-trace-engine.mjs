import { readFile } from "node:fs/promises";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { generatedTraceSchema, normalizeTraceResult } from "./trace-schema.mjs";
import { GeminiConfigurationError, generateWithGemini } from "./gemini-engine.mjs";
import { SearchConfigurationError } from "./search-exa.mjs";

const basePromptUrl = new URL("../../prompts/human-trace-system-prompt.md", import.meta.url);

export class HumanTraceConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "HumanTraceConfigurationError";
  }
}

/**
 * Pick the provider. Gemini runs a separate search step, so it needs both keys; OpenAI
 * searches inside its own call. `HUMAN_TRACE_PROVIDER` forces one explicitly.
 */
function selectProvider() {
  const forced = process.env.HUMAN_TRACE_PROVIDER;
  if (forced) return forced;
  return process.env.GEMINI_API_KEY && process.env.EXA_API_KEY ? "gemini" : "openai";
}

export async function generateHumanTrace(question, options = {}) {
  const provider = options.provider ?? selectProvider();

  if (provider === "gemini") {
    try {
      return await generateWithGemini(question, options);
    } catch (error) {
      // Keep one configuration-error type so the API boundary answers 503 either way.
      if (error instanceof GeminiConfigurationError || error instanceof SearchConfigurationError) {
        throw new HumanTraceConfigurationError(error.message);
      }
      throw error;
    }
  }

  return generateWithOpenAI(question, options);
}

async function generateWithOpenAI(question, options = {}) {
  const apiKey = options.apiKey ?? process.env.OPENAI_API_KEY;
  const model = options.model ?? process.env.OPENAI_MODEL ?? "gpt-5.5";
  // Set OPENAI_BASE_URL to route through an OpenAI-compatible gateway such as OpenRouter.
  // Leave it unset for OpenAI itself. See docs/providers.md before switching: hosted web
  // search and citation shapes differ between providers, and a mismatch silently yields no trace.
  const baseURL = options.baseURL ?? process.env.OPENAI_BASE_URL ?? undefined;

  if (!apiKey) {
    throw new HumanTraceConfigurationError(
      "OPENAI_API_KEY tanımlı değil. Canlı Human Trace üretimi için sunucu ortamına bir API anahtarı ekleyin.",
    );
  }

  const cleanQuestion = String(question ?? "").trim();
  if (!cleanQuestion) throw new TypeError("Bir soru gerekli.");
  if (cleanQuestion.length > 2000) throw new RangeError("Soru 2000 karakterden kısa olmalı.");

  const basePrompt = await readFile(basePromptUrl, "utf8");
  const client = options.client ?? new OpenAI({ apiKey, baseURL });

  const response = await client.responses.parse({
    model,
    reasoning: { effort: "low" },
    tools: [
      {
        type: "web_search",
        search_context_size: "medium",
      },
    ],
    tool_choice: "auto",
    include: ["web_search_call.action.sources"],
    input: [
      {
        role: "system",
        content: `${basePrompt}\n\n${integrationInstructions}`,
      },
      {
        role: "user",
        content: cleanQuestion,
      },
    ],
    text: {
      format: zodTextFormat(generatedTraceSchema, "human_trace_response"),
    },
  });

  if (!response.output_parsed) {
    throw new Error("Model yapılandırılmış bir Human Trace yanıtı döndürmedi.");
  }

  return normalizeTraceResult(response.output_parsed, response, model);
}

const integrationInstructions = `
You are producing a complete answer and an optional, natively integrated Human Trace for a reusable product surface.

Output rules:
- Answer in the same language as the user's question.
- Split the main answer into stable paragraph objects. Use simple ids such as answer-1, answer-2.
- The main answer must be useful and complete even when Human Trace is hidden.
- Search the web whenever you identify a potential Human Trace. Prefer primary sources, universities, museums, academic institutions, peer-reviewed work, and reliable historical organizations.
- A contributor may be a person, team, community, tradition, or unnamed group. Do not force a famous individual.
- Every contributor must include one or more exact source URLs actually consulted during web search. Unsupported contributors must be omitted.
- paragraphIds must point to the answer paragraphs that the contributor materially helps explain.
- relationshipToPrevious describes how this contribution connects to the preceding contribution. Keep it concise.
- acknowledgement is a restrained sentence of recognition or thanks. It must not romanticize exploitation, speak on behalf of a living community, or imply emotion the system cannot substantiate.
- When the human history is not genuinely useful, set traceStatus to none, keep contributors empty, and keep acknowledgement empty.
- Never expose confidence scores, contribution percentages, hidden reasoning, or a bibliography dump in the main answer.
`;
