#!/usr/bin/env node
// Measures whether Gemini can serve as the Human Trace provider.
//   node --env-file=.env scripts/check-gemini.mjs
//
// The decisive question is the last one: the engine needs grounded search AND a
// structured response in a single call. If those cannot be combined, the engine
// needs two calls and the design changes.

import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set. Put it in app/.env and pass --env-file=.env.");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });
console.log(`key ${apiKey.slice(0, 6)}…${apiKey.slice(-4)}\n`);

let model = process.env.GEMINI_MODEL;
if (!model) {
  const names = [];
  for await (const m of await ai.models.list()) names.push(m.name?.replace(/^models\//, ""));

  // Older Gemini versions are withdrawn from new accounts, so pick the highest
  // numbered stable flash model rather than the first one the list happens to return.
  const scored = names
    .map((name) => {
      const match = /^gemini-(\d+(?:\.\d+)?)-flash$/.exec(name ?? "");
      if (!match) return null;
      return { name, version: Number(match[1]) };
    })
    .filter(Boolean)
    .sort((a, b) => b.version - a.version);

  model = scored[0]?.name ?? names.find((n) => n === "gemini-flash-latest") ?? names[0];
  console.log(`stable flash models: ${scored.map((s) => s.name).join(", ") || "(none)"}`);
  console.log(`using: ${model}\n`);
}

const question = "Search the web: who first described the magnetic compass for navigation? Name two sources.";

const traceSchema = {
  type: "object",
  properties: {
    answer: { type: "string" },
    contributors: {
      type: "array",
      items: {
        type: "object",
        properties: { name: { type: "string" }, sourceUrls: { type: "array", items: { type: "string" } } },
        required: ["name", "sourceUrls"],
      },
    },
  },
  required: ["answer", "contributors"],
};

function groundingUris(response) {
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
  return chunks.map((c) => c.web?.uri).filter(Boolean);
}

async function step(label, config) {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: question,
      config,
    });
    const uris = groundingUris(response);
    const text = (response.text ?? "").slice(0, 60).replace(/\s+/g, " ");
    console.log(`OK    ${label.padEnd(34)} grounding uris: ${uris.length.toString().padEnd(3)} text: ${text}…`);
    return { uris, response };
  } catch (error) {
    console.log(`FAIL  ${label.padEnd(34)} ${error?.status ?? ""} ${(error?.message ?? "").slice(0, 160)}`);
    return null;
  }
}

await step("bare", {});
const grounded = await step("+ googleSearch tool", { tools: [{ googleSearch: {} }] });
await step("+ responseSchema only", {
  responseMimeType: "application/json",
  responseSchema: traceSchema,
});
const both = await step("+ googleSearch AND responseSchema", {
  tools: [{ googleSearch: {} }],
  responseMimeType: "application/json",
  responseSchema: traceSchema,
});

console.log("\n— verdict —");
if (!grounded || grounded.uris.length === 0) {
  console.log("Grounding returned no source URIs. Without them the trace verifier filters out every");
  console.log("contributor and the app returns 'no trace' for every question.");
  process.exitCode = 2;
} else if (both && both.uris.length > 0) {
  console.log("Usable as a drop-in: one call gives both grounded sources and a structured response.");
  console.log("Sample sources:");
  for (const uri of grounded.uris.slice(0, 3)) console.log(`  - ${uri}`);
} else {
  console.log("Grounding works, but not together with responseSchema in one call.");
  console.log("The engine needs two calls: research grounded, then structure the result,");
  console.log("carrying the source URIs from the first call into the verifier.");
  process.exitCode = 3;
}
