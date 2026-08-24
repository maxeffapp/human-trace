import { readFile } from "node:fs/promises";
import { GoogleGenAI } from "@google/genai";
import { readEnv } from "./env.mjs";
import { searchWeb } from "./search-exa.mjs";
import { entityTypes, normalizeWithSources, normalizeUrl } from "./trace-schema.mjs";

const basePromptUrl = new URL("../../prompts/human-trace-system-prompt.md", import.meta.url);
const DEFAULT_MODEL = "gemini-3.6-flash";

export class GeminiConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeminiConfigurationError";
  }
}

const answerSchema = {
  type: "object",
  properties: {
    language: { type: "string" },
    title: { type: "string" },
    answer: {
      type: "array",
      items: {
        type: "object",
        properties: { id: { type: "string" }, text: { type: "string" } },
        required: ["id", "text"],
      },
    },
    traceStatus: { type: "string", enum: ["available", "none"] },
    traceReason: { type: "string" },
    searchQueries: { type: "array", items: { type: "string" } },
  },
  required: ["language", "title", "answer", "traceStatus", "traceReason", "searchQueries"],
};

const contributorSchema = {
  type: "object",
  properties: {
    acknowledgement: { type: "string" },
    contributors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          entityType: { type: "string", enum: entityTypes },
          role: { type: "string" },
          summary: { type: "string" },
          story: { type: "string" },
          relationshipToPrevious: { type: "string" },
          paragraphIds: { type: "array", items: { type: "string" } },
          sourceUrls: { type: "array", items: { type: "string" } },
        },
        required: [
          "id", "name", "entityType", "role", "summary",
          "story", "relationshipToPrevious", "paragraphIds", "sourceUrls",
        ],
      },
    },
  },
  required: ["acknowledgement", "contributors"],
};

const answerInstructions = `
Answer the question, then decide whether a Human Trace would genuinely add to it.

- Answer in the same language as the question.
- Split the answer into paragraph objects with ids answer-1, answer-2, and so on.
- The answer must be complete and useful on its own, with no trace attached.
- Set traceStatus to "available" only when the human history behind this subject would add something the answer lacks. Otherwise set "none".
- When "available", give two to four web search queries that would find primary sources, universities, museums, academic institutions or reliable historical organizations about the people, teams, communities or traditions behind this subject. Write the queries in the language most likely to surface good sources.
- When "none", return an empty searchQueries array.
`;

const contributorInstructions = `
You are given an answer and a set of web search results. Identify the human contributions behind the answer, using only these results.

- Every sourceUrl must be copied verbatim from the provided results. Never write a URL that is not in the list.
- A contributor may be a person, team, community, tradition or unnamed group. Do not promote a famous individual over a collective when the evidence points to the collective.
- paragraphIds must reference the given answer paragraph ids, and only those the contributor materially helps explain.
- relationshipToPrevious describes how this contribution connects to the one before it.
- acknowledgement is one restrained sentence. It must not romanticize exploitation, speak for a living community, or imply feeling the sources do not support.
- If the results do not support any contribution, return an empty contributors array and an empty acknowledgement.
`;

/**
 * Retry the two transient failures this API actually produces.
 *
 * 503 is load and clears in a moment. 429 is a rate limit, and on this account it recovers
 * on a scale of tens of minutes rather than seconds — measured: models that refused for
 * over two minutes of backoff answered again roughly twenty minutes later, well before the
 * daily reset at midnight Pacific. Which of the three published limits that is, the error
 * does not say. The waits below are sized to the observed recovery, not to a theory about it.
 */
const BACKOFF_MS = {
  server: [400, 800, 1600],
  rate: [60_000, 300_000, 900_000],
};

async function withRetry(operation) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const message = error?.message ?? "";
      const status = error?.status ?? Number(/\b(\d{3})\b/.exec(message)?.[1]);
      const kind = status === 429 || message.includes("RESOURCE_EXHAUSTED")
        ? "rate"
        : status >= 500 && status < 600
          ? "server"
          : null;
      const wait = kind ? BACKOFF_MS[kind][attempt] : undefined;
      if (wait === undefined) throw error;
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  }
}

async function generateJson(ai, model, system, user, schema) {
  const response = await withRetry(() =>
    ai.models.generateContent({
      model,
      contents: user,
      config: {
        systemInstruction: system,
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    }),
  );
  const text = response.text;
  if (!text) throw new Error("Gemini yapılandırılmış bir yanıt döndürmedi.");
  return JSON.parse(text);
}

/**
 * Two stages, with the search between them.
 *
 * The model never runs the search itself, so the sources the verifier checks against are
 * ours rather than the provider's. A question that does not warrant a trace stops after
 * the first call and costs no search at all.
 */
export async function generateWithGemini(question, options = {}) {
  const apiKey = options.apiKey ?? readEnv("GEMINI_API_KEY");
  if (!apiKey) {
    throw new GeminiConfigurationError(
      "GEMINI_API_KEY tanımlı değil. Canlı Human Trace üretimi için sunucu ortamına bir API anahtarı ekleyin.",
    );
  }

  const model = options.model ?? readEnv("GEMINI_MODEL") ?? DEFAULT_MODEL;
  const basePrompt = await readFile(basePromptUrl, "utf8");
  const ai = options.client ?? new GoogleGenAI({ apiKey });

  const draft = await generateJson(
    ai,
    model,
    `${basePrompt}\n\n${answerInstructions}`,
    question,
    answerSchema,
  );

  const empty = {
    ...draft,
    question,
    acknowledgement: "",
    contributors: [],
  };

  if (draft.traceStatus !== "available" || draft.searchQueries.length === 0) {
    return normalizeWithSources(empty, new Map(), model);
  }

  const results = await searchWeb(draft.searchQueries, options);
  if (results.length === 0) return normalizeWithSources(empty, new Map(), model);

  const researched = await generateJson(
    ai,
    model,
    `${basePrompt}\n\n${contributorInstructions}`,
    [
      `<question>\n${question}\n</question>`,
      `<answer>\n${draft.answer.map((p) => `[${p.id}] ${p.text}`).join("\n\n")}\n</answer>`,
      `<search_results>\n${results
        .map((r, index) => `[${index + 1}] ${r.title}\nURL: ${r.url}\n${r.text}`)
        .join("\n\n")}\n</search_results>`,
    ].join("\n\n"),
    contributorSchema,
  );

  const sources = new Map();
  for (const result of results) {
    const normalized = normalizeUrl(result.url);
    if (normalized) sources.set(normalized, { url: result.url, title: result.title });
  }

  return normalizeWithSources(
    { ...draft, question, ...researched },
    sources,
    model,
  );
}
