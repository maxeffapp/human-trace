import { readEnv } from "./env.mjs";

const ENDPOINT = "https://api.exa.ai/search";
const MAX_QUERIES = 4;
const RESULTS_PER_QUERY = 5;
const TEXT_BUDGET = 1200;

export class SearchConfigurationError extends Error {
  constructor(message) {
    super(message);
    this.name = "SearchConfigurationError";
  }
}

/**
 * Run the model's search queries ourselves instead of asking the provider to.
 *
 * This is what makes the verifier provider-independent: the source URLs are ours, so
 * matching a contributor against them never depends on how some provider happens to
 * shape its citations. See docs/providers.md for what that dependency cost us.
 */
export async function searchWeb(queries, options = {}) {
  const apiKey = options.apiKey ?? readEnv("EXA_API_KEY");
  if (!apiKey) {
    throw new SearchConfigurationError(
      "EXA_API_KEY tanımlı değil. Canlı araştırma için sunucu ortamına bir arama anahtarı ekleyin.",
    );
  }

  const wanted = queries.filter((q) => typeof q === "string" && q.trim()).slice(0, MAX_QUERIES);
  if (wanted.length === 0) return [];

  const responses = await Promise.all(
    wanted.map((query) =>
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({
          query,
          numResults: RESULTS_PER_QUERY,
          type: "auto",
          contents: { text: { maxCharacters: TEXT_BUDGET } },
        }),
      }),
    ),
  );

  const byUrl = new Map();
  for (const response of responses) {
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(`Exa search failed: ${response.status} ${body.slice(0, 200)}`);
    }
    const payload = await response.json();
    for (const result of payload.results ?? []) {
      if (!result?.url || byUrl.has(result.url)) continue;
      byUrl.set(result.url, {
        url: result.url,
        title: result.title || new URL(result.url).hostname,
        text: (result.text ?? "").slice(0, TEXT_BUDGET),
        publishedDate: result.publishedDate ?? null,
      });
    }
  }

  return [...byUrl.values()];
}
