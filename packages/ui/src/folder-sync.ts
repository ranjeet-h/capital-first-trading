// Optional: keep a copy of the journal in a folder you pick (for example one your cloud app syncs).
// Uses the File System Access API, which only some desktop browsers have. Everything stays on your device.
interface DirHandle {
  name: string;
  queryPermission?(o: { mode: "readwrite" }): Promise<PermissionState>;
  requestPermission?(o: { mode: "readwrite" }): Promise<PermissionState>;
  getFileHandle(name: string, o: { create: boolean }): Promise<{ createWritable(): Promise<{ write(d: string): Promise<void>; close(): Promise<void> }> }>;
}
export type SyncState = "none" | "ok" | "needs-permission" | "error";
const META = "syncDir";

export const folderSyncSupported = () => typeof (window as unknown as { showDirectoryPicker?: unknown }).showDirectoryPicker === "function";

export class FolderSync {
  handle: DirHandle | null = null;
  state: SyncState = "none";
  lastAt: number | undefined;
  error = "";
  constructor(private meta: { get(k: string): Promise<unknown>; set(k: string, v: unknown): Promise<void> }) {}

  async restore() {
    if (!folderSyncSupported()) return;
    try {
      const h = (await this.meta.get(META)) as DirHandle | undefined;
      if (!h) return;
      this.handle = h;
      this.state = (await h.queryPermission?.({ mode: "readwrite" })) === "granted" ? "ok" : "needs-permission";
    } catch { this.state = "none"; this.handle = null; }
  }
  async choose() {
    const pick = (window as unknown as { showDirectoryPicker: (o: { mode: "readwrite" }) => Promise<DirHandle> }).showDirectoryPicker;
    this.handle = await pick.call(window, { mode: "readwrite" });
    try { await this.meta.set(META, this.handle); } catch { /* kept for this visit only */ }
    this.state = "ok";
  }
  async allowAgain() {
    if (!this.handle) return;
    this.state = (await this.handle.requestPermission?.({ mode: "readwrite" })) === "granted" ? "ok" : "needs-permission";
  }
  async stop() { this.handle = null; this.state = "none"; await this.meta.set(META, undefined); }

  /** Write the newest copy and a copy for today. Never throws: a failure only shows in the status line. */
  async write(text: string, day: string): Promise<boolean> {
    if (!this.handle || this.state !== "ok") return false;
    try {
      for (const name of ["capital-first-journal-latest.json", `capital-first-journal-${day}.json`]) {
        const w = await (await this.handle.getFileHandle(name, { create: true })).createWritable();
        await w.write(text); await w.close();
      }
      this.lastAt = Date.now(); this.error = ""; return true;
    } catch (e) { this.state = "error"; this.error = (e as Error).message || "The folder could not be written."; return false; }
  }
}
