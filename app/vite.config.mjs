import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { humanTraceApiPlugin } from "./server/vite-plugin.mjs";

export default defineConfig(({ mode }) => {
  // The engine runs inside this process and reads process.env, but Vite only exposes
  // VITE_-prefixed variables and only to the client. Load the rest here so the documented
  // workflow — fill in .env, run dev — actually reaches the server.
  //
  // These values are never passed to `define`, so no key can reach the browser bundle.
  const env = loadEnv(mode, process.cwd(), "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }

  return {
    test: {
      include: ["server/**/*.test.mjs"],
    },
    build: {
      outDir: "dist/client",
    },
    optimizeDeps: {
      include: ["react", "react-dom/client"],
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: ["terminal.local"],
      warmup: {
        clientFiles: ["./src/main.jsx"],
      },
    },
    plugins: [react(), humanTraceApiPlugin()],
  };
});
