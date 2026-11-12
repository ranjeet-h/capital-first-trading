// Launcher inside the repo: bundles main.ts with esbuild (already a dev dependency) and runs it.
import { build } from "esbuild";
import { mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url)), outfile = join(here, ".dist", "forward-test.mjs");
mkdirSync(dirname(outfile), { recursive: true });
await build({ entryPoints: [join(here, "main.ts")], outfile, bundle: true, platform: "node", format: "esm", logLevel: "error" });
process.exit(spawnSync(process.execPath, [outfile, ...process.argv.slice(2)], { stdio: "inherit" }).status ?? 1);
