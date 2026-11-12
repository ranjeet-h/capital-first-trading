// Bundles packages/ui into mdbook/theme/dist/labs.js (one file, no network at runtime).
// Also makes the downloads the Forward test page offers: the one-file script and the sample price files.
import { build } from "esbuild";
import { mkdirSync, cpSync } from "node:fs";
await build({
  entryPoints: ["packages/ui/src/index.ts"], bundle: true, format: "iife", target: "es2020",
  minify: true, sourcemap: false, outfile: "mdbook/theme/dist/labs.js", logLevel: "info",
});
await build({ entryPoints: ["tools/forward-test/main.ts"], bundle: true, platform: "node", format: "esm", outfile: "mdbook/src/labs/downloads/forward-test.mjs", logLevel: "error" });
mkdirSync("mdbook/src/labs/downloads/sample-prices", { recursive: true });
cpSync("tools/forward-test/sample/prices", "mdbook/src/labs/downloads/sample-prices", { recursive: true });
// Runs the strategy tester's slow experiments off the page. It sits next to the page that starts it.
await build({ entryPoints: ["packages/ui/src/bt-worker.ts"], bundle: true, format: "iife", target: "es2020", minify: true, outfile: "mdbook/src/labs/bt-worker.js", logLevel: "error" });
