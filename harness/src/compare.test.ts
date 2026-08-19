import assert from "node:assert/strict";
import { test } from "node:test";
import { parseWorksheet } from "./compare";

const sheet = (body: string) => `# Scoring worksheet\n\n\`\`\`scoring\n${body}\n\`\`\`\n`;

test("parses a filled-in block", () => {
  const [score] = parseWorksheet(sheet("slug: coffee\ntrace: yes\nrating: good"));
  assert.deepEqual(score, { slug: "coffee", trace: true, rating: "good" });
});

test("an unfilled trace field stays null so it can be skipped", () => {
  const [score] = parseWorksheet(sheet("slug: coffee\ntrace: \nrating: "));
  assert.equal(score?.trace, null);
  assert.equal(score?.rating, null);
});

test("na means there is no Trace to rate, not a rating of 'na'", () => {
  const [score] = parseWorksheet(sheet("slug: percent-of-240\ntrace: no\nrating: na"));
  assert.equal(score?.trace, false);
  assert.equal(score?.rating, null);
});

test("values are case-insensitive", () => {
  const [score] = parseWorksheet(sheet("slug: kant\ntrace: YES\nrating: Bad"));
  assert.equal(score?.trace, true);
  assert.equal(score?.rating, "bad");
});

test("blocks without a slug are ignored", () => {
  assert.equal(parseWorksheet(sheet("trace: yes\nrating: good")).length, 0);
});

test("reads every block in a multi-case worksheet", () => {
  const md = ["a", "b", "c"]
    .map((slug) => `## ${slug}\n\n\`\`\`scoring\nslug: ${slug}\ntrace: yes\nrating: good\n\`\`\`\n`)
    .join("\n");
  assert.deepEqual(parseWorksheet(md).map((s) => s.slug), ["a", "b", "c"]);
});
