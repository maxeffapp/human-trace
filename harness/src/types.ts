export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export interface Case {
  slug: string;
  question: string;
  /** Whether the gold set says this question warrants a Human Trace. */
  expectTrace: boolean;
}

export interface Usage {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
}

export interface Generation {
  text: string;
  stopReason: string | null;
  /** Populated only when the model declined the request. */
  refusalCategory: string | null;
  usage: Usage;
}

export type FailureMode =
  | "encyclopedic"
  | "false_hero"
  | "dramatized"
  | "generic"
  | "tacked_on"
  | "uplifted_harm";

export interface Verdict {
  tracePresent: boolean;
  traceText: string;
  sentenceCount: number;
  grounded: boolean;
  specific: boolean;
  restrained: boolean;
  connected: boolean;
  failureModes: FailureMode[];
  rating: "good" | "acceptable" | "bad";
  reasoning: string;
}

export interface CaseResult {
  slug: string;
  question: string;
  expectTrace: boolean;
  generation: Generation;
  verdict: Verdict | null;
  judgeUsage: Usage | null;
  error: string | null;
}
