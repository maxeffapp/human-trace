import assert from "node:assert/strict";
import { resolve } from "node:path";
import { test } from "node:test";
import { loadCases, section } from "./cases";

const REPO_ROOT = resolve(import.meta.dirname, "..", "..");

test("section reads a block that starts after a blank line", () => {
  // Regression: a regex using `$` under the `m` flag terminated on the blank line
  // and returned an empty string, which read as "heading missing".
  const md = "# Title\n\n## Question\n\nWhere does coffee come from?\n\n## Answer\n\nEthiopia.\n";
  assert.equal(section(md, "Question"), "Where does coffee come from?");
});

test("section stops at the next heading", () => {
  const md = "## Question\nfirst\n\nsecond\n## Answer\nnot this\n";
  assert.equal(section(md, "Question"), "first\n\nsecond");
});

test("section reads the final block in a file", () => {
  assert.equal(section("## Question\nlast block\n", "Question"), "last block");
});

test("section returns null for a missing or empty heading", () => {
  assert.equal(section("## Answer\ntext\n", "Question"), null);
  assert.equal(section("## Question\n\n## Answer\ntext\n", "Question"), null);
});

test("section does not match a heading of a different level", () => {
  assert.equal(section("### Question\ntext\n", "Question"), null);
});

test("the gold set loads with the expected shape", () => {
  const cases = loadCases(REPO_ROOT);
  const positive = cases.filter((c) => c.expectTrace);
  const negative = cases.filter((c) => !c.expectTrace);

  assert.equal(positive.length, 25, "expected 25 subjects that should produce a Trace");
  assert.equal(negative.length, 15, "expected 15 questions that should not");

  for (const testCase of cases) {
    assert.ok(testCase.question.length > 10, `${testCase.slug} has a suspiciously short question`);
    assert.ok(!testCase.question.includes("## "), `${testCase.slug} leaked a heading into its question`);
  }

  const slugs = cases.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slugs must be unique across both sets");
});
