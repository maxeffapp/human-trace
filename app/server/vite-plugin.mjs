import { generateHumanTrace, HumanTraceConfigurationError } from "./human-trace-engine.mjs";
import { previewTrace } from "./preview-fixture.mjs";

async function readJson(request) {
  let body = "";
  for await (const chunk of request) body += chunk;
  return body ? JSON.parse(body) : {};
}

function sendJson(response, status, payload) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.end(JSON.stringify(payload));
}

export function humanTraceApiPlugin() {
  return {
    name: "human-trace-api",
    configureServer(server) {
      server.middlewares.use("/api/human-trace", async (request, response) => {
        if (request.method !== "POST") {
          sendJson(response, 405, { error: "Yalnızca POST istekleri destekleniyor." });
          return;
        }

        try {
          const body = await readJson(request);

          if (body.preview === true && process.env.HUMAN_TRACE_PREVIEW === "1") {
            sendJson(response, 200, previewTrace);
            return;
          }

          const trace = await generateHumanTrace(body.question);
          sendJson(response, 200, trace);
        } catch (error) {
          if (error instanceof HumanTraceConfigurationError) {
            sendJson(response, 503, { code: "missing_api_key", error: error.message });
            return;
          }

          if (error instanceof TypeError || error instanceof RangeError || error instanceof SyntaxError) {
            sendJson(response, 400, { code: "invalid_request", error: error.message });
            return;
          }

          console.error("Human Trace generation failed", error);
          sendJson(response, 500, {
            code: "generation_failed",
            error: "Human Trace şu anda üretilemedi. Lütfen biraz sonra tekrar deneyin.",
          });
        }
      });
    },
  };
}
