import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// We intentionally don't reach into the parent package's `src/` via a path
// alias — the playground bundles its own copy of the generation logic to
// keep the deploy footprint small and to avoid having to publish the
// library to npm just to run the demo.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
