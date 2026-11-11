// Local storage layer. Everything stays on this device.
// `Store` is a tiny interface so the same code runs on IndexedDB in the browser and in memory in tests.

export interface StoredRecord { id: string; updated_at: string; deleted?: boolean; [k: string]: unknown }

export interface Store {
  get(collection: string, id: string): Promise<StoredRecord | undefined>;
  put(collection: string, rec: StoredRecord): Promise<void>;
  /** All records, including deleted ones (tombstones), so they can be merged and backed up. */
  all(collection: string): Promise<StoredRecord[]>;
  clear(collection: string): Promise<void>;
  getMeta(key: string): Promise<unknown>;
  setMeta(key: string, value: unknown): Promise<void>;
}

export const SCHEMA_VERSION = 1;

export class MemoryStore implements Store {
  private data = new Map<string, Map<string, StoredRecord>>();
  private meta = new Map<string, unknown>();
  private col(c: string) { let m = this.data.get(c); if (!m) this.data.set(c, (m = new Map())); return m; }
  async get(c: string, id: string) { const r = this.col(c).get(id); return r && structuredClone(r); }
  async put(c: string, rec: StoredRecord) { this.col(c).set(rec.id, structuredClone(rec)); }
  async all(c: string) { return [...this.col(c).values()].map((r) => structuredClone(r)); }
  async clear(c: string) { this.col(c).clear(); }
  async getMeta(k: string) { return this.meta.get(k); }
  async setMeta(k: string, v: unknown) { this.meta.set(k, v); }
}

const DB_NAME = "cft-local";
const COLLECTIONS = ["journal", "settings"] as const;

export class IndexedDbStore implements Store {
  private db: Promise<IDBDatabase>;
  constructor(factory: IDBFactory = indexedDB, name = DB_NAME) {
    this.db = new Promise((resolve, reject) => {
      const req = factory.open(name, SCHEMA_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        for (const c of COLLECTIONS) if (!db.objectStoreNames.contains(c)) db.createObjectStore(c, { keyPath: "id" });
        if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  private async run<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await this.db;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const req = fn(tx.objectStore(store));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  get(c: string, id: string) { return this.run<StoredRecord | undefined>(c, "readonly", (s) => s.get(id)); }
  async put(c: string, rec: StoredRecord) { await this.run(c, "readwrite", (s) => s.put(rec)); }
  all(c: string) { return this.run<StoredRecord[]>(c, "readonly", (s) => s.getAll()); }
  async clear(c: string) { await this.run(c, "readwrite", (s) => s.clear()); }
  getMeta(k: string) { return this.run<unknown>("meta", "readonly", (s) => s.get(k)); }
  async setMeta(k: string, v: unknown) { await this.run("meta", "readwrite", (s) => s.put(v, k)); }
}

/** Newer `updated_at` wins. Equal timestamps keep the local copy. A tombstone is just a record with deleted: true. */
export function mergeRecords(local: StoredRecord[], incoming: StoredRecord[]): { merged: StoredRecord[]; added: number; updated: number; kept: number } {
  const byId = new Map(local.map((r) => [r.id, r]));
  let added = 0, updated = 0, kept = 0;
  for (const r of incoming) {
    const cur = byId.get(r.id);
    if (!cur) { byId.set(r.id, r); added++; }
    else if (Date.parse(r.updated_at) > Date.parse(cur.updated_at)) { byId.set(r.id, r); updated++; }
    else kept++;
  }
  return { merged: [...byId.values()], added, updated, kept };
}
