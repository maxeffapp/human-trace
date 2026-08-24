/**
 * Read an environment variable, treating blank as absent.
 *
 * A `.env` file written from a template has lines like `GEMINI_MODEL=`, which arrive as
 * empty strings rather than undefined. `??` does not fall through on those, so defaults
 * silently lose to the blank value.
 */
export function readEnv(name) {
  const value = process.env[name];
  const trimmed = typeof value === "string" ? value.trim() : "";
  return trimmed === "" ? undefined : trimmed;
}
