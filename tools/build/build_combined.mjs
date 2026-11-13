// Builds the deploy-shape site: English at the root, Marathi in mr/, then runs the same
// post-build language step and the two service workers. Used by `make e2e`, the local
// preview and `make deploy`.
//
//   node tools/build/build_combined.mjs --out .e2e-combined
//   node tools/build/build_combined.mjs --out .pages-build
//   node tools/build/build_combined.mjs --out .dev-combined --work .build/dev
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT, assemble } from "./assemble_lang.mjs";

function run(cmd, args, cwd = ROOT) {
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit" });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")} failed`);
}

function parseArgs(argv) {
  const args = { out: join(ROOT, ".e2e-combined"), work: join(ROOT, ".build") };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") args.out = argv[++i];
    else if (argv[i] === "--work") args.work = argv[++i];
    else if (argv[i].startsWith("--")) throw new Error(`Unknown argument ${argv[i]}`);
  }
  args.out = resolve(args.out);
  args.work = resolve(args.work);
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!existsSync(join(ROOT, "mdbook", "theme", "dist", "labs.js"))) {
    run("node", [join(ROOT, "tools", "build", "bundle.mjs")]);
  }

  assemble({ lang: "en", out: join(args.work, "en"), site: "combined" });
  assemble({ lang: "mr", out: join(args.work, "mr"), site: "combined" });
  run("mdbook", ["build"], join(args.work, "en"));
  run("mdbook", ["build"], join(args.work, "mr"));

  rmSync(args.out, { recursive: true, force: true });
  mkdirSync(args.out, { recursive: true });
  cpSync(join(args.work, "en", "book"), args.out, { recursive: true });
  cpSync(join(args.work, "mr", "book"), join(args.out, "mr"), { recursive: true });

  run("node", [
    join(ROOT, "tools", "build", "postprocess_lang.mjs"),
    "--root", args.out, "--lang", "en", "--site", "combined",
    "--status", join(args.work, "en", "i18n-status.json"),
    "--strings", join(ROOT, "mdbook", "i18n", "strings.en.json"),
    "--other-root", join(args.out, "mr"),
    "--other-status", join(args.work, "mr", "i18n-status.json"),
    "--skip", "mr",
  ]);
  run("node", [
    join(ROOT, "tools", "build", "postprocess_lang.mjs"),
    "--root", join(args.out, "mr"), "--lang", "mr", "--site", "combined",
    "--status", join(args.work, "mr", "i18n-status.json"),
    "--strings", join(ROOT, "mdbook", "i18n", "mr", "strings.json"),
    "--other-root", args.out,
    "--other-status", join(args.work, "en", "i18n-status.json"),
  ]);
  run("node", [join(ROOT, "tools", "build", "gen_sw.mjs"), "--root", args.out, "--lang", "en", "--exclude", "mr"]);
  run("node", [join(ROOT, "tools", "build", "gen_sw.mjs"), "--root", join(args.out, "mr"), "--lang", "mr"]);

  writeFileSync(join(args.out, ".nojekyll"), "");
  console.log(`combined site -> ${args.out}`);
}

try { main(); } catch (err) { console.error(err.message); process.exit(1); }
