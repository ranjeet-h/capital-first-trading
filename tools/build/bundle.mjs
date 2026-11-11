// Bundles packages/ui into mdbook/theme/dist/labs.js (one file, no network at runtime).
import { build } from "esbuild";
await build({
  entryPoints: ["packages/ui/src/index.ts"], bundle: true, format: "iife", target: "es2020",
  minify: true, sourcemap: false, outfile: "mdbook/theme/dist/labs.js", logLevel: "info",
});
