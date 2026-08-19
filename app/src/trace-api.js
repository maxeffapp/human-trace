export async function requestHumanTrace(question, { preview = false, signal } = {}) {
  const response = await fetch("/api/human-trace", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ question, preview }),
    signal,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || "Human Trace üretilemedi.");
    error.code = payload.code;
    throw error;
  }

  return payload;
}
