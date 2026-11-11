// Backup file: plain JSON, or the same JSON locked with a passphrase (AES-GCM, key from PBKDF2).
// Uses the browser's Web Crypto, which Node also provides, so the tests run the real thing.
import { SCHEMA_VERSION, mergeRecords, type Store, type StoredRecord } from "./store";

export const BACKUP_COLLECTIONS = ["journal", "settings"] as const;
export interface BackupFile { format: "cft-backup"; schema: number; exported_at: string; data: Record<string, StoredRecord[]> }
export interface EncryptedBackup { format: "cft-backup-encrypted"; schema: number; iter: number; salt: string; iv: string; cipher: string }

const ITER = 250_000;
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export async function exportBackup(store: Store, now = new Date()): Promise<BackupFile> {
  const data: Record<string, StoredRecord[]> = {};
  for (const c of BACKUP_COLLECTIONS) data[c] = await store.all(c);
  return { format: "cft-backup", schema: SCHEMA_VERSION, exported_at: now.toISOString(), data };
}

async function keyFrom(pass: string, salt: Uint8Array, iter: number) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt as BufferSource, iterations: iter, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}

export async function encryptBackup(file: BackupFile, passphrase: string): Promise<EncryptedBackup> {
  if (passphrase.length < 8) throw new Error("Use a passphrase of at least 8 characters.");
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFrom(passphrase, salt, ITER);
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(JSON.stringify(file))));
  return { format: "cft-backup-encrypted", schema: file.schema, iter: ITER, salt: b64(salt), iv: b64(iv), cipher: b64(ct) };
}

export async function decryptBackup(enc: EncryptedBackup, passphrase: string): Promise<BackupFile> {
  try {
    const key = await keyFrom(passphrase, unb64(enc.salt), enc.iter);
    const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(enc.iv) as BufferSource }, key, unb64(enc.cipher) as BufferSource);
    return parseBackup(JSON.parse(new TextDecoder().decode(pt)));
  } catch (e) {
    if (e instanceof BackupError) throw e;
    throw new BackupError("Wrong passphrase, or the file is damaged.");
  }
}

export class BackupError extends Error {}

/** Checks the shape of a parsed file. Throws a plain-English error when it is not a backup we can read. */
export function parseBackup(x: unknown): BackupFile {
  const f = x as BackupFile;
  if (!f || f.format !== "cft-backup" || typeof f.data !== "object") throw new BackupError("This is not a backup file from this book.");
  if (f.schema > SCHEMA_VERSION) throw new BackupError("This backup is from a newer version. Update the book first.");
  for (const c of BACKUP_COLLECTIONS) {
    const rows = f.data[c] ?? [];
    if (!Array.isArray(rows) || rows.some((r) => !r || typeof r.id !== "string" || isNaN(Date.parse(r.updated_at)))) throw new BackupError(`The "${c}" part of this file is damaged.`);
    f.data[c] = rows;
  }
  return f;
}

export interface ImportPreview { added: number; updated: number; kept: number }

/** Dry run: what would change if this file were imported. Nothing is written. */
export async function previewImport(store: Store, file: BackupFile): Promise<ImportPreview> {
  const t = { added: 0, updated: 0, kept: 0 };
  for (const c of BACKUP_COLLECTIONS) { const r = mergeRecords(await store.all(c), file.data[c] ?? []); t.added += r.added; t.updated += r.updated; t.kept += r.kept; }
  return t;
}

/** Merge a backup into the store. Newer records win; nothing is ever deleted by an import. */
export async function importBackup(store: Store, file: BackupFile): Promise<ImportPreview> {
  const t = { added: 0, updated: 0, kept: 0 };
  for (const c of BACKUP_COLLECTIONS) {
    const r = mergeRecords(await store.all(c), file.data[c] ?? []);
    const had = new Map((await store.all(c)).map((x) => [x.id, x.updated_at]));
    for (const rec of r.merged) if (had.get(rec.id) !== rec.updated_at) await store.put(c, rec);
    t.added += r.added; t.updated += r.updated; t.kept += r.kept;
  }
  return t;
}
