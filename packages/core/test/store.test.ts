import { describe, it, expect } from "vitest";
import { MemoryStore, mergeRecords, type StoredRecord } from "../src/store";
import { exportBackup, encryptBackup, decryptBackup, parseBackup, previewImport, importBackup, BackupError } from "../src/backup";

const rec = (id: string, at: string, extra: Record<string, unknown> = {}): StoredRecord => ({ id, updated_at: at, ...extra });

describe("mergeRecords", () => {
  it("adds new, takes newer, keeps local on tie or older", () => {
    const local = [rec("a", "2026-01-02T00:00:00Z", { v: "local" }), rec("b", "2026-01-02T00:00:00Z", { v: "local" }), rec("c", "2026-01-02T00:00:00Z", { v: "local" })];
    const inc = [rec("a", "2026-01-03T00:00:00Z", { v: "new" }), rec("b", "2026-01-02T00:00:00Z", { v: "tie" }), rec("c", "2026-01-01T00:00:00Z", { v: "old" }), rec("d", "2026-01-01T00:00:00Z")];
    const r = mergeRecords(local, inc);
    expect([r.added, r.updated, r.kept]).toEqual([1, 1, 2]);
    expect(Object.fromEntries(r.merged.map((x) => [x.id, x.v]))).toEqual({ a: "new", b: "local", c: "local", d: undefined });
  });
  it("a newer tombstone removes a record without losing it from history", () => {
    const r = mergeRecords([rec("a", "2026-01-01T00:00:00Z")], [rec("a", "2026-01-02T00:00:00Z", { deleted: true })]);
    expect(r.merged[0]!.deleted).toBe(true);
  });
  it("is the same whichever side is merged first", () => {
    const x = [rec("a", "2026-01-01T00:00:00Z", { v: 1 }), rec("b", "2026-01-05T00:00:00Z", { v: 1 })];
    const y = [rec("a", "2026-01-03T00:00:00Z", { v: 2 }), rec("b", "2026-01-04T00:00:00Z", { v: 2 })];
    const s = (l: StoredRecord[]) => l.map((r) => `${r.id}${r.v}`).sort().join();
    expect(s(mergeRecords(x, y).merged)).toBe(s(mergeRecords(y, x).merged));
  });
});

describe("MemoryStore", () => {
  it("keeps copies, so edits outside do not leak in", async () => {
    const s = new MemoryStore(); const r = rec("a", "2026-01-01T00:00:00Z", { n: 1 });
    await s.put("journal", r); r.n = 2;
    expect((await s.get("journal", "a"))?.n).toBe(1);
  });
});

describe("backup", () => {
  const seeded = async () => { const s = new MemoryStore(); await s.put("journal", rec("t1", "2026-02-01T10:00:00Z", { note: "first" })); await s.put("settings", rec("capital", "2026-02-01T10:00:00Z", { rs: 50000 })); return s; };

  it("round-trips through a plain file", async () => {
    const f = await exportBackup(await seeded(), new Date("2026-02-02T00:00:00Z"));
    const t = new MemoryStore();
    expect(await importBackup(t, parseBackup(JSON.parse(JSON.stringify(f))))).toEqual({ added: 2, updated: 0, kept: 0 });
    expect((await t.get("journal", "t1"))?.note).toBe("first");
  });
  it("round-trips through a passphrase, and a wrong passphrase fails in plain words", async () => {
    const enc = await encryptBackup(await exportBackup(await seeded()), "correct horse");
    expect(JSON.stringify(enc)).not.toContain("first");
    expect((await decryptBackup(enc, "correct horse")).data.journal![0]!.id).toBe("t1");
    await expect(decryptBackup(enc, "wrong passphrase")).rejects.toThrow("Wrong passphrase");
  });
  it("refuses a short passphrase", async () => {
    await expect(encryptBackup(await exportBackup(new MemoryStore()), "short")).rejects.toThrow("at least 8");
  });
  it("preview writes nothing; import never overwrites newer local data", async () => {
    const file = await exportBackup(await seeded());
    const target = new MemoryStore(); await target.put("journal", rec("t1", "2026-03-01T00:00:00Z", { note: "edited later" }));
    expect(await previewImport(target, file)).toEqual({ added: 1, updated: 0, kept: 1 });
    expect(await target.all("settings")).toHaveLength(0);
    await importBackup(target, file);
    expect((await target.get("journal", "t1"))?.note).toBe("edited later");
    expect(await target.all("settings")).toHaveLength(1);
  });
  it("rejects files that are not backups, are too new, or are damaged", () => {
    expect(() => parseBackup({ hello: 1 })).toThrow(BackupError);
    expect(() => parseBackup({ format: "cft-backup", schema: 99, data: {} })).toThrow("newer");
    expect(() => parseBackup({ format: "cft-backup", schema: 1, data: { journal: [{ id: 1 }] } })).toThrow("damaged");
  });
});
