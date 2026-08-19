import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Case } from "./types";

const SKIP = new Set(["README.md", "TEMPLATE.md"]);

/** Pull one `## Heading` block out of a markdown file. */
export function section(markdown: string, heading: string): string | null {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return null;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n").trim() || null;
}

function load(dir: string, expectTrace: boolean): Case[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md") && !SKIP.has(name))
    .sort()
    .map((name) => {
      const path = join(dir, name);
      const question = section(readFileSync(path, "utf8"), "Question");
      if (!question) throw new Error(`${path} has no "## Question" section`);
      return { slug: name.replace(/\.md$/, ""), question, expectTrace };
    });
}

/** The gold set: subjects that should produce a Trace, and questions that should not. */
export function loadCases(repoRoot: string): Case[] {
  return [
    ...load(join(repoRoot, "examples"), true),
    ...load(join(repoRoot, "examples", "negative"), false),
  ];
}
