import { z } from "zod";

export const entityTypes = [
  "person",
  "team",
  "community",
  "tradition",
  "unnamed_group",
];

export const generatedTraceSchema = z.object({
  language: z.string(),
  question: z.string(),
  title: z.string(),
  answer: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
    }),
  ),
  traceStatus: z.enum(["available", "none"]),
  traceReason: z.string(),
  acknowledgement: z.string(),
  contributors: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      entityType: z.enum(entityTypes),
      role: z.string(),
      summary: z.string(),
      story: z.string(),
      relationshipToPrevious: z.string(),
      paragraphIds: z.array(z.string()),
      sourceUrls: z.array(z.string()),
    }),
  ),
});

const publicSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
});

const publicContributorSchema = generatedTraceSchema.shape.contributors.element
  .omit({ sourceUrls: true })
  .extend({ sourceIds: z.array(z.string()) });

export const publicTraceSchema = generatedTraceSchema
  .omit({ contributors: true })
  .extend({
    contributors: z.array(publicContributorSchema),
    sources: z.array(publicSourceSchema),
    meta: z.object({
      model: z.string(),
      researchedAt: z.string(),
      liveSearch: z.boolean(),
    }),
  });

export function normalizeUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.searchParams.sort();
    const normalized = url.toString();
    return normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;
  } catch {
    return null;
  }
}

export function collectSearchSources(response) {
  const byUrl = new Map();

  const addSource = (candidate) => {
    const normalized = normalizeUrl(candidate?.url);
    if (!normalized || !normalized.startsWith("http")) return;

    const previous = byUrl.get(normalized);
    byUrl.set(normalized, {
      url: candidate.url,
      title: candidate.title || previous?.title || new URL(candidate.url).hostname,
    });
  };

  for (const item of response?.output ?? []) {
    if (item.type === "web_search_call") {
      for (const source of item.action?.sources ?? []) addSource(source);
    }

    if (item.type === "message") {
      for (const content of item.content ?? []) {
        for (const annotation of content.annotations ?? []) {
          if (annotation.type === "url_citation") addSource(annotation);
        }
      }
    }
  }

  return byUrl;
}

export function normalizeTraceResult(parsed, response, model) {
  const searchedSources = collectSearchSources(response);
  const usedSources = new Map();
  const knownParagraphIds = new Set(parsed.answer.map((paragraph) => paragraph.id));

  const contributors = parsed.contributors.flatMap((contributor) => {
    const matchedUrls = contributor.sourceUrls
      .map(normalizeUrl)
      .filter((url) => url && searchedSources.has(url));

    const uniqueMatchedUrls = [...new Set(matchedUrls)];
    if (uniqueMatchedUrls.length === 0) return [];

    const sourceIds = uniqueMatchedUrls.map((url) => {
      if (!usedSources.has(url)) {
        const source = searchedSources.get(url);
        usedSources.set(url, {
          id: `source-${usedSources.size + 1}`,
          title: source.title,
          url: source.url,
        });
      }
      return usedSources.get(url).id;
    });

    return [
      {
        ...contributor,
        paragraphIds: contributor.paragraphIds.filter((id) => knownParagraphIds.has(id)),
        sourceIds,
        sourceUrls: undefined,
      },
    ];
  });

  const traceStatus = parsed.traceStatus === "available" && contributors.length > 0
    ? "available"
    : "none";

  return publicTraceSchema.parse({
    ...parsed,
    traceStatus,
    acknowledgement: traceStatus === "available" ? parsed.acknowledgement : "",
    contributors: contributors.map(({ sourceUrls: _sourceUrls, ...contributor }) => contributor),
    sources: [...usedSources.values()],
    meta: {
      model,
      researchedAt: new Date().toISOString(),
      liveSearch: true,
    },
  });
}
