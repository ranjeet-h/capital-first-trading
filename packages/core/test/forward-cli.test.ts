import { describe, it, expect } from "vitest";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { runCli } from "../../../tools/forward-test/cli";

const AFTER_CLOSE = new Date("2030-01-01T12:00:00Z");
const fixture = () => { const d = mkdtempSync(join(tmpdir(), "fw-")); cpSync("tools/forward-test/sample", d, { recursive: true }); return d; };
const go = (d: string, now = new Date("2016-12-07T12:00:00Z"), extra: string[] = []) => { const lines: string[] = []; const code = runCli(["--config", join(d, "forward.config.json"), ...extra], now, (s) => lines.push(s)); return { code, text: lines.join("\n") }; };

describe("forward script", () => {
  it("matches the committed expected log, and a second run changes nothing", () => {
    const d = fixture(), a = go(d);
    expect(a.code).toBe(0);
    expect(readFileSync(join(d, "out/forward_pending.csv"), "utf8").split("\n")[0]).toBe("symbol,action,for_day,note");
    expect(a.text).toMatch(/next trading day is 2016-12-07/);
    const log = readFileSync(join(d, "out/forward_log.csv"), "utf8");
    expect(log).toBe(readFileSync("tools/forward-test/sample/expected_forward_log.csv", "utf8"));
    const state = readFileSync(join(d, "out/forward_state.json"), "utf8");
    expect(go(d).code).toBe(0);
    expect(readFileSync(join(d, "out/forward_log.csv"), "utf8")).toBe(log);
    expect(readFileSync(join(d, "out/forward_state.json"), "utf8")).toBe(state);
    expect(existsSync(join(d, "out/forward.lock"))).toBe(false);
    rmSync(d, { recursive: true });
  });
  it("fails closed on bad prices and leaves the log alone", () => {
    const d = fixture(); go(d);
    const before = readFileSync(join(d, "out/forward_log.csv"), "utf8");
    const f = join(d, "prices/AAA.csv"); const t = readFileSync(f, "utf8").trimEnd().split("\n"); t.push("2099-01-01,100,90,99,100,1000");
    writeFileSync(f, t.join("\n") + "\n");
    const r = go(d); expect(r.code).toBe(1); expect(r.text).toMatch(/problem/);
    expect(readFileSync(join(d, "out/forward_log.csv"), "utf8")).toBe(before);
    expect(readFileSync(join(d, "out/forward_warnings.log"), "utf8")).toMatch(/High and low/);
  });
  it("fails closed when a price file is missing", () => {
    const d = fixture(); rmSync(join(d, "prices/AAA.csv"));
    const r = go(d); expect(r.code).toBe(1); expect(existsSync(join(d, "out/forward_log.csv"))).toBe(false);
  });
  it("refuses a damaged state file and offers --rebuild", () => {
    const d = fixture(); go(d); writeFileSync(join(d, "out/forward_state.json"), "{ not json");
    const r = go(d); expect(r.code).toBe(1); expect(r.text).toMatch(/--rebuild/);
    expect(go(d, undefined, ["--rebuild"]).code).toBe(0);
  });
  it("refuses a changed rule, and a second run in parallel", () => {
    const d = fixture(); go(d);
    const sf = join(d, "strategy.json"); const s = JSON.parse(readFileSync(sf, "utf8")); s.riskPct = 2; writeFileSync(sf, JSON.stringify(s));
    expect(go(d).text).toMatch(/one rule/);
    const e = fixture(); writeFileSync(join(e, "out"), ""); // placeholder removed below
    rmSync(join(e, "out"), { force: true }); go(e); writeFileSync(join(e, "out/forward.lock"), "");
    expect(go(e).text).toMatch(/Another run/);
  });
  it("refuses before the market has finished the day", () => {
    const d = fixture();
    const last = readFileSync(join(d, "prices/AAA.csv"), "utf8").trimEnd().split("\n").pop()!.split(",")[0]!;
    const r = go(d, new Date(last + "T09:00:00Z")); expect(r.code).toBe(1); expect(r.text).toMatch(/15:45/);
  });
  it("has no broker packages and no order endpoints", () => {
    const pkg = readFileSync("package.json", "utf8"), src = readFileSync("tools/forward-test/cli.ts", "utf8") + readFileSync("packages/core/src/forward.ts", "utf8");
    expect(pkg).not.toMatch(/kiteconnect|upstox|angel|fyers|dhan|breeze|zerodha/i);
    expect(src).not.toMatch(/fetch\(|XMLHttpRequest|node:https?|api_key|access_token/);
  });
  void AFTER_CLOSE;
});
