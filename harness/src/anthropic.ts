import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import * as z from "zod/v4";
import type { Effort, Generation, Usage, Verdict } from "./types";

const MAX_TOKENS = 16000;

/** The judge runs at a fixed effort so it does not vary while we sweep the model under test. */
const JUDGE_EFFORT: Effort = "high";

const VerdictSchema = z.object({
  trace_present: z
    .boolean()
    .describe("Whether the response contains a Human Trace at all."),
  trace_text: z
    .string()
    .describe("The Trace verbatim, or an empty string if there is none."),
  sentence_count: z
    .number()
    .int()
    .describe("Sentences in the Trace; 0 if there is none."),
  grounded: z.boolean().describe("Every claim traceable; disputes marked as disputed."),
  specific: z.boolean().describe("Detail particular to this subject, not transferable."),
  restrained: z.boolean().describe("States what happened and stops; no adjectives doing the work."),
  connected: z.boolean().describe("Changes how the reader understands the answer."),
  failure_modes: z
    .array(
      z.enum([
        "encyclopedic",
        "false_hero",
        "dramatized",
        "generic",
        "tacked_on",
        "uplifted_harm",
      ]),
    )
    .describe("Failure modes present, using the rubric's names. Empty if none."),
  rating: z.enum(["good", "acceptable", "bad"]),
  reasoning: z.string().describe("Two or three sentences justifying the rating."),
});

function readUsage(usage: Anthropic.Usage): Usage {
  return {
    inputTokens: usage.input_tokens,
    outputTokens: usage.output_tokens,
    cacheCreationInputTokens: usage.cache_creation_input_tokens ?? 0,
    cacheReadInputTokens: usage.cache_read_input_tokens ?? 0,
  };
}

function textOf(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("");
}

/** Stage 1 — the prompt under test answers a question. */
export async function generate(
  client: Anthropic,
  model: string,
  systemPrompt: string,
  question: string,
  effort: Effort,
): Promise<Generation> {
  const response = await client.messages.create({
    model,
    max_tokens: MAX_TOKENS,
    // The prompt is the only large constant across every case, so it is the cache breakpoint.
    system: [
      { type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } },
    ],
    output_config: { effort },
    messages: [{ role: "user", content: question }],
  });

  // A declined request returns 200 with empty content — read stop_reason before content.
  const refused = response.stop_reason === "refusal";
  return {
    text: refused ? "" : textOf(response.content),
    stopReason: response.stop_reason,
    refusalCategory: refused ? (response.stop_details?.category ?? null) : null,
    usage: readUsage(response.usage),
  };
}

/**
 * Stage 2 — a separate call decides whether a Trace is present and how good it is.
 * The judge is not told what the gold set expects, so its trace_present call stays independent.
 */
export async function judge(
  client: Anthropic,
  model: string,
  rubric: string,
  question: string,
  answer: string,
): Promise<{ verdict: Verdict; usage: Usage }> {
  const system = [
    "You are evaluating one response from an AI assistant that has been given a Human Trace instruction.",
    "A Human Trace is a short passage surfacing the human history behind the subject of an answer. It is optional — a response with no Trace is often correct.",
    "Judge only what is in front of you. You are not told whether a Trace was expected.",
    "",
    "Apply this rubric:",
    "",
    rubric,
  ].join("\n");

  const response = await client.messages.parse({
    model,
    max_tokens: MAX_TOKENS,
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    output_config: { effort: JUDGE_EFFORT, format: zodOutputFormat(VerdictSchema) },
    messages: [
      {
        role: "user",
        content: `<question>\n${question}\n</question>\n\n<response>\n${answer}\n</response>`,
      },
    ],
  });

  const parsed = response.parsed_output;
  if (!parsed) throw new Error("judge returned no parsed output");

  return {
    verdict: {
      tracePresent: parsed.trace_present,
      traceText: parsed.trace_text,
      sentenceCount: parsed.sentence_count,
      grounded: parsed.grounded,
      specific: parsed.specific,
      restrained: parsed.restrained,
      connected: parsed.connected,
      failureModes: parsed.failure_modes,
      rating: parsed.rating,
      reasoning: parsed.reasoning,
    },
    usage: readUsage(response.usage),
  };
}
