import { describe, expect, it } from "vitest";
import { collectSearchSources, normalizeTraceResult, normalizeWithSources } from "./trace-schema.mjs";

const parsed = {
  language: "tr",
  question: "Bir fikir nasıl oluştu?",
  title: "Bir fikir nasıl oluştu?",
  answer: [{ id: "answer-1", text: "Ana cevap." }],
  traceStatus: "available",
  traceReason: "Kaynaklı bir insan hikâyesi var.",
  acknowledgement: "Bu yanıt ortak emeğe dayanıyor.",
  contributors: [
    {
      id: "supported",
      name: "Kaynaklı kişi",
      entityType: "person",
      role: "katkı",
      summary: "Doğrulanmış katkı.",
      story: "Doğrulanmış hikâye.",
      relationshipToPrevious: "başlangıç",
      paragraphIds: ["answer-1", "missing-paragraph"],
      sourceUrls: ["https://example.com/source/"],
    },
    {
      id: "unsupported",
      name: "Kaynağı olmayan kişi",
      entityType: "person",
      role: "iddia",
      summary: "Desteklenmeyen katkı.",
      story: "Desteklenmeyen hikâye.",
      relationshipToPrevious: "bilinmiyor",
      paragraphIds: ["answer-1"],
      sourceUrls: ["https://invented.example/source"],
    },
  ],
};

const response = {
  output: [
    {
      type: "web_search_call",
      action: {
        sources: [{ title: "Verified source", url: "https://example.com/source" }],
      },
    },
  ],
};

describe("Human Trace source normalization", () => {
  it("collects web search sources by normalized URL", () => {
    const sources = collectSearchSources(response);
    expect(sources.get("https://example.com/source")?.title).toBe("Verified source");
  });

  it("drops unsupported contributors and invalid paragraph links", () => {
    const result = normalizeTraceResult(parsed, response, "test-model");
    expect(result.traceStatus).toBe("available");
    expect(result.contributors).toHaveLength(1);
    expect(result.contributors[0].id).toBe("supported");
    expect(result.contributors[0].paragraphIds).toEqual(["answer-1"]);
    expect(result.sources).toHaveLength(1);
  });

  it("turns the trace off when no contributor has searched evidence", () => {
    const result = normalizeTraceResult(
      { ...parsed, contributors: [parsed.contributors[1]] },
      response,
      "test-model",
    );
    expect(result.traceStatus).toBe("none");
    expect(result.contributors).toEqual([]);
    expect(result.acknowledgement).toBe("");
  });
});

const sourcesForMeta = new Map([
  ["https://example.com/source", { url: "https://example.com/source/", title: "Verified source" }],
]);

describe("verification against a caller-supplied source map", () => {
  // The Gemini path searches separately and passes its own results in, so this is the
  // code path every Gemini trace goes through.
  const sources = new Map([
    ["https://example.com/source", { url: "https://example.com/source/", title: "Verified source" }],
  ]);

  it("keeps contributors whose URLs came from the caller's search", () => {
    const result = normalizeWithSources(parsed, sources, "test-model");
    expect(result.contributors.map((c) => c.id)).toEqual(["supported"]);
    expect(result.sources[0].title).toBe("Verified source");
  });

  it("drops everything when the search returned nothing", () => {
    const result = normalizeWithSources(parsed, new Map(), "test-model");
    expect(result.traceStatus).toBe("none");
    expect(result.contributors).toEqual([]);
    expect(result.acknowledgement).toBe("");
  });

  it("never exposes raw contributor URLs to the client", () => {
    const result = normalizeWithSources(parsed, sources, "test-model");
    expect(result.contributors[0]).not.toHaveProperty("sourceUrls");
    expect(result.contributors[0].sourceIds).toEqual(["source-1"]);
  });
});

describe("verification is measurable", () => {
  it("reports how many contributors were offered and how many survived", () => {
    const result = normalizeWithSources(parsed, sourcesForMeta, "test-model");
    expect(result.meta.contributorsProposed).toBe(2);
    expect(result.meta.contributorsKept).toBe(1);
    expect(result.meta.sourcesSearched).toBe(1);
  });

  it("reports no live search when nothing was searched", () => {
    const result = normalizeWithSources(parsed, new Map(), "test-model");
    expect(result.meta.liveSearch).toBe(false);
    expect(result.meta.contributorsKept).toBe(0);
  });
});
