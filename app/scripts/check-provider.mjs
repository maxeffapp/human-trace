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

let response;
try {
  response = await client.responses.create({
    model,
    reasoning: { effort: "low" },
    tools: [{ type: "web_search", search_context_size: "medium" }],
    tool_choice: "auto",
    include: ["web_search_call.action.sources"],
    input: [
      {
        role: "user",
        content:
          "Search the web and name two sources describing who first described the magnetic compass. Cite them.",
      },
    ],
  });
} catch (error) {
  console.error("REQUEST FAILED\n");
  console.error(`  ${error.status ?? ""} ${error.message}`);
  console.error("\nCommon causes:");
  console.error("  401  the key does not belong to the base URL it was sent to");
  console.error("  404  this provider does not expose /v1/responses");
  console.error("  400  this provider does not accept the hosted web_search tool or the include field");
  process.exit(1);
}

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
  console.log("An adapter in collectSearchSources() is needed for this provider's citation shape.");
  process.exitCode = 2;
}
