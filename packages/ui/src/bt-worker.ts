// Runs the slow experiments off the page, so the screen stays responsive. No network, no storage.
import { computeExperiment, type ExpArgs, type ExpKey } from "../../core/src/backtest/compute";
const ctx = self as unknown as { onmessage: ((e: MessageEvent) => void) | null; postMessage(m: unknown): void };
ctx.onmessage = (e: MessageEvent<{ id: number; key: ExpKey; args: ExpArgs }>) => {
  try { ctx.postMessage({ id: e.data.id, result: computeExperiment(e.data.key, e.data.args) }); }
  catch (err) { ctx.postMessage({ id: e.data.id, error: (err as Error).message }); }
};
