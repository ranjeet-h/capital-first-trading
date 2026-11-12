// Entry point for the downloadable single-file script: node forward-test.mjs --config forward.config.json
import { runCli } from "./cli";
process.exit(runCli(process.argv.slice(2), new Date()));
