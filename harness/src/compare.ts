import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { CaseResult } from "./types";

interface HumanScore {
  slug: string;
  trace: boolean | null;
  rating: string | null;
}

function parseWorksheet(markdown: string): HumanScore[] {
  const scores: HumanScore[] = [];
  for (const [, body] of markdown.matchAll(/```scoring\n([\s\S]*?)```/g)) {
    const fields = new Map<string, string>();
    for (const line of body!.split("\n")) {
      const [key, ...rest] = line.split(":");
      if (key?.trim()) fields.set(key.trim(), rest.join(":").trim());
    }
    const slug = fields.get("slug");
    if (!slug) continue;
    const trace = fields.get("trace")?.toLowerCase();
    const rating = fields.get("rating")?.toLowerCase();
    scores.push({
      slug,
      trace: trace === "yes" ? true : trace === "no" ? false : null,
      rating: rating && rating !== "na" ? rating : null,
    });
  }
  return scores;
}

function pct(hits: number, total: number): string {
  return total === 0 ? "n/a" : `${((hits / total) * 100).toFixed(1)}% (${hits}/${total})`;
}

function main() {
  const runDir = resolve(process.argv[2] ?? "");
  if (!process.argv[2]) throw new Error("usage: npm run compare -- <run directory>");

  const scored = parseWorksheet(readFileSync(join(runDir, "worksheet.md"), "utf8")).filter(
    (score) => score.trace !== null,
  );
  if (scored.length === 0) {
    throw new Error("no filled-in scoring blocks — set `trace:` on at least one case first");
  }

  let traceAgree = 0;
  let ratingAgree = 0;
  let ratingComparable = 0;
  let humanPositiveHits = 0;
  let humanPositiveTotal = 0;
  let humanNegativeHits = 0;
  let humanNegativeTotal = 0;
  const disagreements: string[] = [];

  for (const score of scored) {
    const result: CaseResult = JSON.parse(
      readFileSync(join(runDir, `${score.slug}.json`), "utf8"),
    );
    const judged = result.verdict?.tracePresent ?? false;

    if (result.expectTrace) {
      humanPositiveTotal += 1;
      if (score.trace) humanPositiveHits += 1;
    } else {
      humanNegativeTotal += 1;
      if (score.trace) humanNegativeHits += 1;
    }

    if (score.trace === judged) {
      traceAgree += 1;
    } else {
      disagreements.push(
        `  ${score.slug}: you say ${score.trace ? "trace" : "no trace"}, judge says ${judged ? "trace" : "no trace"}`,
      );
    }

    if (score.rating && result.verdict?.tracePresent) {
      ratingComparable += 1;
      if (score.rating === result.verdict.rating) {
        ratingAgree += 1;
      } else {
        disagreements.push(
          `  ${score.slug}: you rate ${score.rating}, judge rates ${result.verdict.rating}`,
        );
      }
    }
  }

  console.log(`${scored.length} cases scored by hand\n`);
  console.log("— your scores —");
  console.log(`trigger rate        ${pct(humanPositiveHits, humanPositiveTotal)}`);
  console.log(`false-positive rate ${pct(humanNegativeHits, humanNegativeTotal)}`);
  console.log("\n— agreement with the judge —");
  console.log(`trace present       ${pct(traceAgree, scored.length)}`);
  console.log(`rating              ${pct(ratingAgree, ratingComparable)}`);

  if (disagreements.length > 0) {
    console.log("\n— disagreements —");
    console.log(disagreements.join("\n"));
    console.log(
      "\nWhere you disagree, you are the standard. A judge that disagrees often is not measuring the rubric.",
    );
  }
}

main();
