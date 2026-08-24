#!/usr/bin/env node
// Runs the gold set through the live engine and reports Phase 2's three rates.
//   node --env-file=.env scripts/evaluate.mjs [--limit N] [--only slug] [--concurrency N]
//   node --env-file=.env scripts/evaluate.mjs --resume evaluations/<dir>
//
// A free-tier daily quota will not survive forty cases in one sitting, so a run is
// resumable: --resume reuses a directory and skips cases already recorded there. On the
// first quota refusal the run stops rather than burning the remaining cases on errors
// that teach nothing.
//
// Questions come from examples/ so the evaluation set and the gold set cannot drift.
// No target stories are used: only the question and whether a trace is expected.

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { generateHumanTrace } from "../server/human-trace-engine.mjs";

const REPO_ROOT = resolve(import.meta.dirname, "..", "..");
const SKIP = new Set(["README.md", "TEMPLATE.md"]);

function flag(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

function section(markdown, heading) {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n").trim() || null;
}

function loadCases(dir, expectTrace) {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md") && !SKIP.has(name))
    .sort()
    .map((name) => ({
      slug: name.replace(/\.md$/, ""),
      expectTrace,
      question: section(readFileSync(join(dir, name), "utf8"), "Question"),
    }));
}

async function pool(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      for (let i = next++; i < items.length; i = next++) results[i] = await fn(items[i], i);
    }),
  );
  return results;
}

function rate(hits, total) {
  return total === 0 ? "n/a" : `${((hits / total) * 100).toFixed(1)}% (${hits}/${total})`;
}

let cases = [
  ...loadCases(join(REPO_ROOT, "examples"), true),
  ...loadCases(join(REPO_ROOT, "examples", "negative"), false),
];

const only = flag("only");
if (only) cases = cases.filter((c) => c.slug.includes(only));
const limit = Number(flag("limit", 0));
if (limit > 0) cases = cases.slice(0, limit);

// Pace requests: the per-minute limit is the binding one, and losing a run to it
// costs far more than finishing slowly.
const concurrency = Number(flag("concurrency", 1));
const resume = flag("resume");
const runDir = resume
  ? resolve(REPO_ROOT, "app", resume.replace(/^app\//, ""))
  : join(REPO_ROOT, "app", "evaluations", new Date().toISOString().replace(/[:.]/g, "-"));
mkdirSync(runDir, { recursive: true });

const alreadyDone = new Set(
  readdirSync(runDir)
    .filter((name) => name.endsWith(".json") && name !== "summary.json")
    .map((name) => name.replace(/\.json$/, "")),
);
const pending = cases.filter((c) => !alreadyDone.has(c.slug));
if (alreadyDone.size > 0) console.log(`${alreadyDone.size} already recorded, ${pending.length} to run`);

// A daily quota refusal will not clear within the run; keep going only wastes the log.
let quotaExhausted = false;

console.log(`${cases.length} cases · concurrency ${concurrency}`);
console.log(`→ ${runDir}\n`);

const fresh = await pool(pending, concurrency, async (testCase) => {
  if (quotaExhausted) return { ...testCase, skipped: true };
  const started = Date.now();
  try {
    const trace = await generateHumanTrace(testCase.question);
    const record = {
      ...testCase,
      seconds: (Date.now() - started) / 1000,
      traceStatus: trace.traceStatus,
      traceReason: trace.traceReason,
      contributors: trace.contributors.map((c) => ({ name: c.name, entityType: c.entityType, sourceIds: c.sourceIds })),
      sources: trace.sources,
      meta: trace.meta,
      answerParagraphs: trace.answer.length,
      error: null,
    };
    writeFileSync(join(runDir, `${testCase.slug}.json`), JSON.stringify({ ...record, trace }, null, 2));
    const correct = (trace.traceStatus === "available") === testCase.expectTrace;
    console.log(
      `  ${correct ? "." : "x"} ${testCase.slug.padEnd(26)} ${trace.traceStatus.padEnd(9)} ` +
        `${trace.meta.contributorsKept}/${trace.meta.contributorsProposed} contributors  ${record.seconds.toFixed(0)}s`,
    );
    return record;
  } catch (error) {
    const message = String(error?.message ?? error);
    if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED")) {
      // The engine already waited this out through several backoffs. Still refusing means
      // the daily limit, not the per-minute one, and no amount of waiting inside this run helps.
      if (!quotaExhausted) {
        quotaExhausted = true;
        console.log(`\n  rate limit persisted through backoff at ${testCase.slug} — stopping.`);
        console.log(`  resume later with: --resume evaluations/${runDir.split("/").pop()}\n`);
      }
      return { ...testCase, skipped: true };
    }
    console.log(`  ! ${testCase.slug.padEnd(26)} ${message.slice(0, 70)}`);
    return { ...testCase, seconds: (Date.now() - started) / 1000, error: message };
  }
});

// Fold in anything a previous session already recorded.
const restored = [...alreadyDone]
  .map((slug) => JSON.parse(readFileSync(join(runDir, `${slug}.json`), "utf8")))
  .map(({ trace: _trace, ...record }) => record);
const results = [...restored, ...fresh.filter((r) => !r.skipped)];

const ok = results.filter((r) => !r.error);
const positives = ok.filter((r) => r.expectTrace);
const negatives = ok.filter((r) => !r.expectTrace);
const triggered = (rs) => rs.filter((r) => r.traceStatus === "available").length;

const proposed = positives.reduce((sum, r) => sum + (r.meta?.contributorsProposed ?? 0), 0);
const kept = positives.reduce((sum, r) => sum + (r.meta?.contributorsKept ?? 0), 0);

const entityTypes = {};
for (const record of positives) {
  for (const contributor of record.contributors ?? []) {
    entityTypes[contributor.entityType] = (entityTypes[contributor.entityType] ?? 0) + 1;
  }
}

const skipped = fresh.filter((r) => r.skipped).length;
const summary = {
  ranAt: new Date().toISOString(),
  completed: results.length,
  skippedForQuota: skipped,
  model: ok[0]?.meta?.model ?? null,
  cases: cases.length,
  errors: results.filter((r) => r.error).map((r) => ({ slug: r.slug, error: r.error })),
  triggerRate: { hits: triggered(positives), total: positives.length },
  falsePositiveRate: { hits: triggered(negatives), total: negatives.length },
  contributorSupportRate: { kept, proposed },
  entityTypes,
  medianSeconds: ok.length
    ? [...ok].sort((a, b) => a.seconds - b.seconds)[Math.floor(ok.length / 2)].seconds
    : null,
};
writeFileSync(join(runDir, "summary.json"), JSON.stringify(summary, null, 2));

console.log("\n— rates —");
console.log(`trigger rate            ${rate(summary.triggerRate.hits, summary.triggerRate.total)}`);
console.log(`false-positive rate     ${rate(summary.falsePositiveRate.hits, summary.falsePositiveRate.total)}`);
console.log(`contributor support     ${rate(kept, proposed)}   (survived source verification)`);
console.log(`entity types            ${JSON.stringify(entityTypes)}`);
console.log(`median duration         ${summary.medianSeconds?.toFixed(0) ?? "-"}s`);
if (summary.errors.length) console.log(`errors                  ${summary.errors.length}`);
console.log(`completed               ${results.length}/${cases.length}`);
if (skipped > 0) {
  console.log(`\n${skipped} cases left for quota. Resume with:`);
  console.log(`  pnpm evaluate -- --resume evaluations/${runDir.split("/").pop()}`);
}
