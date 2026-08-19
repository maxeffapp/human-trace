import Anthropic from "@anthropic-ai/sdk";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generate, judge } from "./anthropic";
import { loadCases } from "./cases";
import type { Case, CaseResult, Effort } from "./types";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DEFAULT_MODEL = "claude-opus-5";
const CONCURRENCY = 4;
const EFFORTS: Effort[] = ["low", "medium", "high", "xhigh", "max"];

function flag(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function pool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (let i = next++; i < items.length; i = next++) {
      results[i] = await fn(items[i]!);
    }
  });
  await Promise.all(workers);
  return results;
}

async function runCase(
  client: Anthropic,
  model: string,
  systemPrompt: string,
  rubric: string,
  effort: Effort,
  testCase: Case,
): Promise<CaseResult> {
  const base = { slug: testCase.slug, question: testCase.question, expectTrace: testCase.expectTrace };
  try {
    const generation = await generate(client, model, systemPrompt, testCase.question, effort);
    if (generation.refusalCategory !== null) {
      return {
        ...base,
        generation,
        verdict: null,
        judgeUsage: null,
        error: `model declined (${generation.refusalCategory})`,
      };
    }
    const { verdict, usage } = await judge(client, model, rubric, testCase.question, generation.text);
    return { ...base, generation, verdict, judgeUsage: usage, error: null };
  } catch (error) {
    const generation = {
      text: "",
      stopReason: null,
      refusalCategory: null,
      usage: { inputTokens: 0, outputTokens: 0, cacheCreationInputTokens: 0, cacheReadInputTokens: 0 },
    };
    return { ...base, generation, verdict: null, judgeUsage: null, error: String(error) };
  }
}

function rate(hits: number, total: number): string {
  return total === 0 ? "n/a" : `${((hits / total) * 100).toFixed(1)}% (${hits}/${total})`;
}

function summarize(results: CaseResult[]) {
  const positives = results.filter((r) => r.expectTrace);
  const negatives = results.filter((r) => !r.expectTrace);
  const triggered = (rs: CaseResult[]) => rs.filter((r) => r.verdict?.tracePresent).length;

  const ratings = { good: 0, acceptable: 0, bad: 0 };
  const failureModes = new Map<string, number>();
  for (const result of positives) {
    if (!result.verdict?.tracePresent) continue;
    ratings[result.verdict.rating] += 1;
    for (const mode of result.verdict.failureModes) {
      failureModes.set(mode, (failureModes.get(mode) ?? 0) + 1);
    }
  }

  const tokens = results.reduce(
    (acc, r) => ({
      input: acc.input + r.generation.usage.inputTokens + (r.judgeUsage?.inputTokens ?? 0),
      output: acc.output + r.generation.usage.outputTokens + (r.judgeUsage?.outputTokens ?? 0),
      cacheRead:
        acc.cacheRead +
        r.generation.usage.cacheReadInputTokens +
        (r.judgeUsage?.cacheReadInputTokens ?? 0),
    }),
    { input: 0, output: 0, cacheRead: 0 },
  );

  return {
    triggerRate: { hits: triggered(positives), total: positives.length },
    falsePositiveRate: { hits: triggered(negatives), total: negatives.length },
    ratings,
    failureModes: Object.fromEntries([...failureModes].sort((a, b) => b[1] - a[1])),
    errors: results.filter((r) => r.error !== null).map((r) => ({ slug: r.slug, error: r.error })),
    tokens,
  };
}

/** A blind form: the judge's verdicts are deliberately absent so the human scores independently. */
function worksheet(results: CaseResult[]): string {
  const lines = [
    "# Scoring worksheet",
    "",
    "Fill in the `trace` and `rating` fields for each case, then run `npm run compare -- <this run directory>`.",
    "The judge's verdicts are not shown here on purpose — score blind, or the comparison measures nothing.",
    "",
    "`trace`: yes | no — did the response contain a Human Trace?",
    "`rating`: good | acceptable | bad | na — na when there is no Trace to rate.",
    "",
    "---",
    "",
  ];
  for (const result of results) {
    lines.push(
      `## ${result.slug}`,
      "",
      `**Question:** ${result.question}`,
      "",
      "**Response:**",
      "",
      result.error ? `_(error: ${result.error})_` : result.generation.text,
      "",
      "```scoring",
      `slug: ${result.slug}`,
      "trace: ",
      "rating: ",
      "```",
      "",
    );
  }
  return lines.join("\n");
}

async function main() {
  const model = flag("model") ?? DEFAULT_MODEL;
  const effort = (flag("effort") ?? "high") as Effort;
  if (!EFFORTS.includes(effort)) {
    throw new Error(`--effort must be one of ${EFFORTS.join(", ")}`);
  }
  const only = flag("only");

  const promptPath =
    flag("prompt") ?? join(REPO_ROOT, "prompts", "human-trace-system-prompt.md");
  const systemPrompt = readFileSync(promptPath, "utf8");
  const rubric = readFileSync(join(REPO_ROOT, "docs", "quality-rubric.md"), "utf8");
  const promptHash = createHash("sha256").update(systemPrompt).digest("hex").slice(0, 8);

  let cases = loadCases(REPO_ROOT);
  if (only) cases = cases.filter((c) => c.slug.includes(only));
  if (cases.length === 0) throw new Error("no cases matched");

  const runDir = join(
    REPO_ROOT,
    "harness",
    "runs",
    `${new Date().toISOString().replace(/[:.]/g, "-")}-${effort}`,
  );
  mkdirSync(runDir, { recursive: true });

  // Every run carries the exact inputs it was produced from, so a result stays interpretable
  // after the prompt or the rubric has moved on.
  writeFileSync(join(runDir, "prompt.md"), systemPrompt);
  writeFileSync(join(runDir, "rubric.md"), rubric);

  console.log(`model ${model} · effort ${effort} · prompt ${promptHash} · ${cases.length} cases`);
  console.log(`→ ${runDir}\n`);

  const client = new Anthropic();
  const run = (testCase: Case) => runCase(client, model, systemPrompt, rubric, effort, testCase);

  // A cache entry is only readable once the first response has started. Running one case
  // to completion before fanning out means the other 39 read the prompt instead of rewriting it.
  const [first, ...rest] = cases;
  const results: CaseResult[] = [await run(first!)];
  console.log(`  ${first!.slug} — cache primed`);

  results.push(
    ...(await pool(rest, CONCURRENCY, async (testCase) => {
      const result = await run(testCase);
      const mark = result.error
        ? "!"
        : result.verdict?.tracePresent === testCase.expectTrace
          ? "."
          : "x";
      console.log(`  ${mark} ${testCase.slug}`);
      return result;
    })),
  );

  for (const result of results) {
    writeFileSync(join(runDir, `${result.slug}.json`), JSON.stringify(result, null, 2));
  }

  const summary = {
    model,
    effort,
    promptPath: relative(REPO_ROOT, promptPath),
    promptHash,
    caseCount: cases.length,
    ...summarize(results),
  };
  writeFileSync(join(runDir, "summary.json"), JSON.stringify(summary, null, 2));
  writeFileSync(join(runDir, "worksheet.md"), worksheet(results));

  console.log("\n— judge scores —");
  console.log(`trigger rate        ${rate(summary.triggerRate.hits, summary.triggerRate.total)}`);
  console.log(
    `false-positive rate ${rate(summary.falsePositiveRate.hits, summary.falsePositiveRate.total)}`,
  );
  console.log(`ratings             ${JSON.stringify(summary.ratings)}`);
  if (Object.keys(summary.failureModes).length > 0) {
    console.log(`failure modes       ${JSON.stringify(summary.failureModes)}`);
  }
  if (summary.errors.length > 0) console.log(`errors              ${summary.errors.length}`);
  console.log(
    `tokens              ${summary.tokens.input} in / ${summary.tokens.output} out ` +
      `(${summary.tokens.cacheRead} read from cache)`,
  );
  console.log(`\nScore it yourself blind: ${join(runDir, "worksheet.md")}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
