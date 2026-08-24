#!/usr/bin/env node
// Makes one live request and reports whether this provider returns web-search sources
// in the shape the trace verifier expects. Run before trusting a new provider:
//   node --env-file=.env scripts/check-provider.mjs
//
// A provider can answer perfectly and still be unusable here: if the citation shape
// differs, collectSearchSources() finds nothing, every contributor is filtered out,
// and the app returns "no trace" forever without erroring.

import OpenAI from "openai";
import { collectSearchSources } from "../server/trace-schema.mjs";

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || undefined;
const model = process.env.OPENAI_MODEL || "gpt-5.5";

if (!apiKey) {
  console.error("OPENAI_API_KEY is not set. Put it in .env and pass --env-file=.env.");
  process.exit(1);
}

console.log(`provider  ${baseURL ?? "https://api.openai.com/v1 (default)"}`);
console.log(`model     ${model}`);
console.log(`key       ${apiKey.slice(0, 7)}…${apiKey.slice(-4)}\n`);

const client = new OpenAI({ apiKey, baseURL });

const input = [
  {
    role: "user",
    content: "Search the web for one page about the magnetic compass. Reply with just its URL.",
  },
];

const request = {
  model,
  tools: [{ type: "web_search", search_context_size: "medium" }],
  tool_choice: "auto",
  max_output_tokens: 600,
  input,
};

async function attempt(body, label) {
  try {
    return { response: await client.responses.create(body), label };
  } catch (error) {
    return { error, label };
  }
}

// `include` is an OpenAI Responses feature. Gateways may reject it, so fall back
// without it rather than reporting a total failure — the response can still carry
// citations as annotations.
let { response, error, label } = await attempt(
  { ...request, include: ["web_search_call.action.sources"] },
  "with include",
);

if (error?.status === 400) {
  console.log("note: provider rejected include:[web_search_call.action.sources] — retrying without it\n");
  ({ response, error, label } = await attempt(request, "without include"));
}

if (error) {
  console.error(`REQUEST FAILED (${label})\n`);
  console.error(`  ${error.status ?? ""} ${error.error?.message ?? error.message}`);
  console.error("\nCommon causes:");
  console.error("  401  the key does not belong to the base URL it was sent to");
  console.error("  402  the account has no credit; nothing here works until it does");
  console.error("  404  this provider does not expose /v1/responses");
  console.error("  400  this provider does not accept the hosted web_search tool");
  process.exit(1);
}

console.log(`request accepted: ${label}\n`);

const itemTypes = (response.output ?? []).map((item) => item.type);
console.log(`output item types: ${itemTypes.join(", ") || "(none)"}`);

const searchCalls = (response.output ?? []).filter((i) => i.type === "web_search_call");
console.log(`web_search_call items: ${searchCalls.length}`);
for (const call of searchCalls) {
  console.log(`  action.sources: ${call.action?.sources?.length ?? "absent"}`);
}

const annotations = (response.output ?? [])
  .filter((i) => i.type === "message")
  .flatMap((i) => i.content ?? [])
  .flatMap((c) => c.annotations ?? []);
console.log(`annotations: ${annotations.length}`);
if (annotations.length > 0) {
  const sample = annotations[0];
  console.log(`  first annotation keys: ${Object.keys(sample).join(", ")}`);
  console.log(`  url at annotation.url:            ${sample.url ?? "absent"}`);
  console.log(`  url at annotation.url_citation.url: ${sample.url_citation?.url ?? "absent"}`);
}

const collected = collectSearchSources(response);
console.log(`\ncollectSearchSources() extracted: ${collected.size} source(s)`);

if (collected.size > 0) {
  console.log("\nVERDICT: compatible. The verifier can match contributor URLs against this run.");
  for (const [, source] of collected) console.log(`  - ${source.title} · ${source.url}`);
} else {
  console.log("\nVERDICT: NOT compatible as-is.");
  console.log("The model may have searched, but no source URL reached the verifier.");
  console.log("Every contributor would be filtered out and the app would always return 'no trace'.");
  const searched = (response.output ?? []).some((i) => i.type === "web_search_call");
  if (searched) {
    console.log("A web_search_call was returned, so the search ran — the citations are what is missing.");
  }
  console.log("Either use a provider that returns sources, or adapt collectSearchSources() to this one's shape.");
  process.exitCode = 2;
}
