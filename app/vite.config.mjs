import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { humanTraceApiPlugin } from "./server/vite-plugin.mjs";

export default defineConfig({
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
});
