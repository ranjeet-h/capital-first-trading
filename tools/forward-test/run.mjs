// Launcher: bundles cli.ts with esbuild (already a dev dependency) and runs it. No network, no extra packages.
import { build } from "esbuild";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url)), outfile = join(here, ".dist", "cli.mjs");
mkdirSync(dirname(outfile), { recursive: true });
await build({ entryPoints: [join(here, "cli.ts")], outfile, bundle: true, platform: "node", format: "esm", logLevel: "error" });
const { runCli } = await import(pathToFileURL(outfile).href);
process.exit(runCli(process.argv.slice(2), new Date()));
