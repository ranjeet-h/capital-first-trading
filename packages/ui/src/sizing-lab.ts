import rawRates from "../../../data/rates/zerodha-equity.json";
import { ratesAreStale, type Exchange, type Product, type Rates } from "../../core/src/costs";
import { sizePosition, type SizingInput, type SizingResult } from "../../core/src/sizing";
import { h, svg, fmtRs, fmtInr, fmtInt, fmtPct, parseRupees, parseNum, store, draft } from "./util";
import { textField, segmented, checkbox } from "./field";

const R = rawRates as unknown as Rates;
const KEY = "cft-lab-size-v1";

const BIND: Record<string, string> = {
  risk: "Your risk limit sets the size. More shares would risk more than the budget.",
  concentration: "The position cap sets the size. The risk limit would allow more shares.",
  cash: "Your cash sets the size. You cannot buy more than your capital allows.",
  none: "No whole share fits these rules.",
};

export class LabPositionSize extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "1";
    const s = store.get(KEY) ?? {};
    const f = {
      capital: textField("Account capital", s.capital ?? "50000", { name: "capital", prefix: "Rs", hint: "Money in the account" }),
      risk: textField("Risk per trade", s.risk ?? "1", { name: "risk", suffix: "%", hint: "Most rule sets use 1% or less" }),
      entry: textField("Entry price", s.entry ?? "100", { name: "entry", prefix: "Rs", hint: "Where you plan to buy" }),
      stop: textField("Stop-loss price", s.stop ?? "95", { name: "stop", prefix: "Rs", hint: "Must be below entry" }),
      target: textField("Target price", s.target ?? "", { name: "target", prefix: "Rs", optional: true, hint: "Shows reward to risk" }),
      maxpos: textField("Largest single position", s.maxpos ?? "25", { name: "maxpos", suffix: "% of capital", hint: "Cap so one stock cannot dominate" }),
      slip: textField("Slippage on the stop", s.slip ?? "0", { name: "slip", suffix: "%", optional: true, hint: "Extra loss if the exit fills lower" }),
    };
    let product: Product = (s.product as Product) || "cnc";
    let exchange: Exchange = (s.exchange as Exchange) || "NSE";
    let costs = s.costs !== "0";
    const out = h("div", { class: "lab-out", "aria-live": "polite" });
    const pSeg = segmented<Product>("Product", "sp", [["cnc", "Delivery (CNC)"], ["mis", "Intraday (MIS)"]], product, (v) => { product = v; run(); });
    const eSeg = segmented<Exchange>("Exchange", "se", [["NSE", "NSE"], ["BSE", "BSE"]], exchange, (v) => { exchange = v; run(); });
    const cBox = checkbox("Include trading costs in the loss", costs, (v) => { costs = v; run(); });
    const stale = ratesAreStale(R, new Date());
    const banner = h("div", { class: "lab-banner" + (stale ? " lab-warn" : "") },
      stale ? h("strong", {}, "Cost rates may be out of date. ") : null,
      `Costs use rates verified on ${R.verifiedOn}. Long trades in the cash segment only. This tool checks rules. It does not say whether a trade is good.`);

    const read = (): SizingInput | null => {
      const cap = parseRupees(f.capital.input.value), risk = parseNum(f.risk.input.value), entry = parseRupees(f.entry.input.value), stop = parseRupees(f.stop.input.value);
      const maxp = parseNum(f.maxpos.input.value);
      const tgtText = f.target.input.value.trim(), tgt = tgtText === "" ? undefined : parseRupees(tgtText);
      const slipText = f.slip.input.value.trim(), slip = slipText === "" ? 0 : parseNum(slipText);
      f.capital.error(isNaN(cap) || cap <= 0 ? "Enter your capital in rupees." : "");
      f.risk.error(isNaN(risk) || risk <= 0 || risk > 100 ? "Enter a percentage above 0 and up to 100." : "");
      f.entry.error(isNaN(entry) || entry <= 0 ? "Enter a price above zero." : "");
      f.stop.error(isNaN(stop) || stop <= 0 ? "Enter a price above zero." : (!isNaN(entry) && stop >= entry ? "For a long trade the stop must be below the entry price." : ""));
      f.maxpos.error(isNaN(maxp) || maxp <= 0 || maxp > 100 ? "Enter a percentage above 0 and up to 100." : "");
      f.target.error(tgt !== undefined && (isNaN(tgt) || tgt <= entry) ? "Leave blank, or enter a price above the entry." : "");
      f.slip.error(isNaN(slip) || slip < 0 || slip > 50 ? "Enter 0 to 50, or leave blank." : "");
      if ([cap, risk, entry, stop, maxp, slip].some(isNaN) || cap <= 0 || risk <= 0 || risk > 100 || entry <= 0 || stop <= 0 || stop >= entry || maxp <= 0 || maxp > 100 || slip < 0 || slip > 50) return null;
      if (tgt !== undefined && (isNaN(tgt) || tgt <= entry)) return null;
      return { capitalPaise: cap, riskPercent: risk, entryPaise: entry, stopPaise: stop, targetPaise: tgt, product, exchange, maxPositionPercent: maxp, includeCosts: costs, slippagePercent: slip };
    };

    const run = () => {
      const input = read();
      store.set(KEY, { capital: f.capital.input.value, risk: f.risk.input.value, entry: f.entry.input.value, stop: f.stop.input.value, target: f.target.input.value, maxpos: f.maxpos.input.value, slip: f.slip.input.value, product, exchange, costs: costs ? "1" : "0" });
      out.replaceChildren();
      if (!input) { out.append(h("p", { class: "lab-empty" }, "Fix the highlighted fields to see the position size.")); return; }
      const r = sizePosition(R, input);
      out.append(cards(r, input), conflicts(r), r.shares > 0 ? journalLink(input, r) : h("span"), h("div", { class: "lab-vis" }, ladder(input, r), sens(input)));
    };

    const cards = (r: SizingResult, i: SizingInput) => h("div", {},
      h("div", { class: "lab-cards" },
        card("Shares", fmtInt(r.shares), r.shares ? `Position ${fmtRs(r.positionPaise)} (${fmtPct(r.positionPercent, 1)} of capital)` : "Nothing fits these rules"),
        card("Loss if the stop is hit", fmtRs(r.trueLossPaise), `Budget ${fmtRs(r.riskBudgetPaise)}${i.includeCosts && r.shares ? `. Includes ${fmtRs(r.costsAtStopPaise)} costs` : ""}`),
        card("Reward to risk", r.rewardToRisk === undefined ? "n/a" : r.rewardToRisk.toFixed(2), r.rewardToRisk === undefined ? "Add a target to see this" : `Target gain ${fmtRs(Math.round(r.rewardToRisk * r.plannedLossPaise))} before costs`)),
      h("p", { class: "lab-bind" }, h("strong", {}, "What limits the size: "), BIND[r.binding]));

    const journalLink = (i: SizingInput, r: SizingResult) => h("p", { class: "lab-handoff" },
      h("a", { class: "lab-btn lab-btn-primary", href: "journal.html", onclick: () => draft.set({ from: "size", entry: String(i.entryPaise / 100), stop: String(i.stopPaise / 100), target: i.targetPaise === undefined ? "" : String(i.targetPaise / 100), qty: String(r.shares), product: i.product, exchange: i.exchange }) }, "Plan this trade in my journal"),
      h("span", { class: "lab-hint" }, "Opens the journal with these numbers filled in. You can change them."));

    const conflicts = (r: SizingResult) => r.warnings.length
      ? h("div", { class: "lab-conflicts", role: "note" }, h("strong", {}, "Things to check"), h("ul", {}, ...r.warnings.map((w) => h("li", {}, w))))
      : h("p", { class: "lab-clear" }, "No rule conflicts found against the limits you set.");

    const sens = (i: SizingInput) => {
      const rows = [2, 5, 10, 20].filter((d) => i.entryPaise - d * 100 > 0).map((d) => {
        const rr = sizePosition(R, { ...i, stopPaise: i.entryPaise - d * 100 });
        return h("tr", {}, h("th", { scope: "row" }, `Rs ${d} below entry`), h("td", { class: "lab-num" }, fmtInr(i.entryPaise - d * 100)), h("td", { class: "lab-num" }, fmtInt(rr.shares)), h("td", { class: "lab-num" }, fmtInr(rr.positionPaise)));
      });
      return h("table", { class: "lab-table lab-sens" }, h("caption", {}, "How the size changes with a wider or tighter stop"),
        h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Stop distance"), h("th", { scope: "col", class: "lab-num" }, "Stop price"), h("th", { scope: "col", class: "lab-num" }, "Shares"), h("th", { scope: "col", class: "lab-num" }, "Position Rs"))), h("tbody", {}, ...rows));
    };

    Object.values(f).forEach((x) => x.input.addEventListener("input", run));
    this.append(h("section", { class: "lab", "aria-label": "Position size calculator" }, banner,
      h("div", { class: "lab-grid" }, h("form", { class: "lab-form", onsubmit: (e: Event) => e.preventDefault() },
        f.capital.root, f.risk.root, f.entry.root, f.stop.root, f.target.root, f.maxpos.root, f.slip.root, pSeg.root, eSeg.root, cBox.root), out)));
    run();
  }
}

function card(label: string, value: string, sub: string) {
  return h("div", { class: "lab-card" }, h("div", { class: "lab-card-l" }, label), h("div", { class: "lab-card-v" }, value), h("div", { class: "lab-card-s" }, sub));
}

/** Price ladder: stop at the bottom, entry in the middle, target on top. Zones use patterns, not colour alone. */
function ladder(i: SizingInput, r: SizingResult): SVGElement {
  const hasT = i.targetPaise !== undefined;
  const top = hasT ? i.targetPaise! : i.entryPaise + (i.entryPaise - i.stopPaise);
  const lo = i.stopPaise, hi = top, W = 240, H = 190, y0 = 20, y1 = 170;
  const y = (p: number) => y1 - ((p - lo) / (hi - lo)) * (y1 - y0);
  const ye = y(i.entryPaise), yt = y(top), ys = y(lo);
  const label = (yy: number, txt: string, sub: string) => svg("text", { x: 108, y: yy + 4, class: "lab-lad-t" }, document.createTextNode(`${txt}  ${sub}`));
  const s = svg("svg", { viewBox: `0 0 ${W} ${H}`, class: "lab-ladder", role: "img", "aria-label": `Price ladder. Stop ${fmtRs(i.stopPaise)}, entry ${fmtRs(i.entryPaise)}${hasT ? `, target ${fmtRs(top)}` : ""}.` },
    svg("defs", {},
      svg("pattern", { id: "lad-risk", width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }, svg("rect", { width: 8, height: 8, fill: "rgba(192,57,43,.12)" }), svg("line", { x1: 0, y1: 0, x2: 0, y2: 8, stroke: "#c0392b", "stroke-width": 2 })),
      svg("pattern", { id: "lad-gain", width: 8, height: 8, patternUnits: "userSpaceOnUse" }, svg("rect", { width: 8, height: 8, fill: "rgba(30,123,70,.12)" }), svg("circle", { cx: 4, cy: 4, r: 1.4, fill: "#1e7b46" }))),
    svg("rect", { x: 20, y: yt, width: 70, height: ye - yt, fill: "url(#lad-gain)", stroke: "#1e7b46", "stroke-dasharray": hasT ? "0" : "4 3" }),
    svg("rect", { x: 20, y: ye, width: 70, height: ys - ye, fill: "url(#lad-risk)", stroke: "#c0392b" }),
    svg("line", { x1: 10, x2: 100, y1: ye, y2: ye, stroke: "currentColor", "stroke-width": 2 }),
    label(yt, hasT ? "Target" : "Same-size gain", hasT ? fmtRs(top) : "(example)"),
    label(ye, "Entry", fmtRs(i.entryPaise)),
    label(ys, "Stop", fmtRs(i.stopPaise)));
  s.append(svg("text", { x: 55, y: (ye + ys) / 2 + 4, "text-anchor": "middle", class: "lab-lad-z" }, document.createTextNode("risk")));
  s.append(svg("text", { x: 55, y: (yt + ye) / 2 + 4, "text-anchor": "middle", class: "lab-lad-z" }, document.createTextNode("reward")));
  void r;
  return s;
}
