import rawRates from "../../../data/rates/zerodha-equity.json";
import { computeCosts, ratesAreStale, type Exchange, type Product, type Rates, type CostResult } from "../../core/src/costs";
import { h, fmtInr, fmtRs, fmtPct, parseRupees, parseNum, store } from "./util";
import { textField, segmented, checkbox } from "./field";

const R = rawRates as unknown as Rates;
const KEY = "cft-lab-costs-v1";
const pct = (perCrore: number) => (perCrore / 100_000).toString().replace(/(\.\d*?)0+$/, "$1") + "%";

function rateText(key: string, p: Product, ex: Exchange): string {
  switch (key) {
    case "brokerage": return p === "cnc" ? "Rs 0 on delivery" : `Lower of Rs ${R.brokerage.mis.flatPaise / 100} or ${pct(R.brokerage.mis.percentPerCrore)} per order`;
    case "stt": { const s = R.sttPerCrore[p]; return p === "cnc" ? `${pct(s.buy)} on buy and sell` : `${pct(s.sell)} on sell only`; }
    case "exchange": return `${pct(R.exchangePerCrore[ex])} of turnover (${ex})`;
    case "sebi": return `Rs ${R.sebiPerCrore} per crore of turnover`;
    case "stamp": return `${pct(R.stampPerCrore[p])} on buy only`;
    case "gst": return `${R.gstPercent}% of brokerage + exchange + SEBI`;
    case "dp": return "Per share-name, on each delivery sell";
    default: return "";
  }
}

export class LabCosts extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready) return;
    this.dataset.ready = "1";
    const saved = store.get(KEY) ?? {};
    const f = {
      buy: textField("Buy price", saved.buy ?? "1000", { name: "buy", prefix: "Rs", hint: "Price per share" }),
      sell: textField("Sell price", saved.sell ?? "1010", { name: "sell", prefix: "Rs", hint: "Price per share" }),
      qty: textField("Quantity", saved.qty ?? "50", { name: "qty", suffix: "shares", hint: "Whole shares", whole: true }),
    };
    let product: Product = (saved.product as Product) || "cnc";
    let exchange: Exchange = (saved.exchange as Exchange) || "NSE";
    let dp = saved.dp !== "0";
    const out = h("div", { class: "lab-out", "aria-live": "polite" });
    const productSeg = segmented<Product>("Product", "product", [["cnc", "Delivery (CNC)"], ["mis", "Intraday (MIS)"]], product, (v) => { product = v; run(); });
    const exchSeg = segmented<Exchange>("Exchange", "exchange", [["NSE", "NSE"], ["BSE", "BSE"]], exchange, (v) => { exchange = v; run(); });
    const dpBox = checkbox("Include the DP charge on the sell (delivery only)", dp, (v) => { dp = v; run(); });
    const stale = ratesAreStale(R, new Date());
    const banner = h("div", { class: "lab-banner" + (stale ? " lab-warn" : ""), role: stale ? "alert" : undefined },
      stale ? h("strong", {}, "These rates may be out of date. ") : null,
      `Rates read from `, h("a", { href: R.source, target: "_blank", rel: "noopener" }, "Zerodha's charges page"),
      " on ", h("span", { class: "lab-nowrap" }, R.verifiedOn), ".", stale ? " Check the page again before relying on these numbers." : "");

    const run = () => {
      const buy = parseRupees(f.buy.input.value), sell = parseRupees(f.sell.input.value), qty = parseNum(f.qty.input.value);
      f.buy.error(isNaN(buy) || buy <= 0 ? "Enter a price above zero, up to 2 decimals." : "");
      f.sell.error(isNaN(sell) || sell <= 0 ? "Enter a price above zero, up to 2 decimals." : "");
      f.qty.error(isNaN(qty) || !Number.isInteger(qty) || qty < 1 ? "Enter a whole number of shares, 1 or more." : "");
      dpBox.root.hidden = product !== "cnc";
      store.set(KEY, { buy: f.buy.input.value, sell: f.sell.input.value, qty: f.qty.input.value, product, exchange, dp: dp ? "1" : "0" });
      out.replaceChildren();
      if (isNaN(buy) || isNaN(sell) || isNaN(qty) || buy <= 0 || sell <= 0 || !Number.isInteger(qty) || qty < 1) {
        out.append(h("p", { class: "lab-empty" }, "Fix the highlighted fields to see the costs."));
        return;
      }
      const res = computeCosts(R, { buyPricePaise: buy, sellPricePaise: sell, quantity: qty, product, exchange, dpCharge: product === "cnc" && dp });
      out.append(result(res, buy, qty), compare(buy, sell, qty));
    };

    const result = (res: CostResult, buy: number, qty: number) => {
      const dpLine = res.lines.find((l) => l.key === "dp")!;
      const main = res.lines.filter((l) => l.key !== "dp");
      const subtotal = main.reduce((s, l) => s + l.paise, 0);
      const rows = main.map((l) => h("tr", {}, h("th", { scope: "row" }, l.label, h("span", { class: "lab-rate-sm" }, rateText(l.key, product, exchange))), h("td", { class: "lab-rate" }, rateText(l.key, product, exchange)), h("td", { class: "lab-num" }, fmtInr(l.paise))));
      const body: HTMLElement[] = [...rows];
      if (product === "cnc" && dp) {
        body.push(h("tr", { class: "lab-sub" }, h("th", { scope: "row" }, "Subtotal (same as Zerodha's calculator)"), h("td"), h("td", { class: "lab-num" }, fmtInr(subtotal))));
        body.push(h("tr", {}, h("th", { scope: "row" }, "DP charge", h("span", { class: "lab-rate-sm" }, rateText("dp", product, exchange))), h("td", { class: "lab-rate" }, rateText("dp", product, exchange)), h("td", { class: "lab-num" }, fmtInr(dpLine.paise))));
      }
      body.push(h("tr", { class: "lab-total" }, h("th", { scope: "row" }, "Total cost"), h("td"), h("td", { class: "lab-num" }, fmtInr(res.totalPaise))));
      const net = res.netPnlPaise;
      return h("div", {},
        h("div", { class: "lab-cards" },
          card("Total cost", fmtRs(res.totalPaise), `${fmtPct((res.totalPaise / (res.buyValuePaise + res.sellValuePaise)) * 100, 3)} of turnover`),
          card("Break-even sell price", fmtRs(res.breakEvenPricePaise), `${fmtPct(res.breakEvenPercent, 3)} above your buy price`),
          card("Profit after costs", fmtRs(net), `Before costs: ${fmtRs(res.grossPnlPaise)}`, net < 0 ? "lab-loss" : "")),
        h("table", { class: "lab-table" }, h("caption", {}, `Itemised for ${qty} shares at ${fmtRs(buy)} (${exchange}, ${product === "cnc" ? "delivery" : "intraday"})`),
          h("thead", {}, h("tr", {}, h("th", { scope: "col" }, "Charge"), h("th", { scope: "col" }, "Rate"), h("th", { scope: "col", class: "lab-num" }, "Rs"))), h("tbody", {}, ...body)),
        h("p", { class: "lab-note" }, "Tax on your profit is not included. Rounding follows what Zerodha's own calculator shows."));
    };

    const compare = (buy: number, sell: number, qty: number) => {
      const other: Product = product === "cnc" ? "mis" : "cnc";
      const a = computeCosts(R, { buyPricePaise: buy, sellPricePaise: sell, quantity: qty, product, exchange, dpCharge: product === "cnc" && dp });
      const b = computeCosts(R, { buyPricePaise: buy, sellPricePaise: sell, quantity: qty, product: other, exchange, dpCharge: other === "cnc" && dp });
      const name = (p: Product) => (p === "cnc" ? "Delivery" : "Intraday");
      return h("div", { class: "lab-compare" }, h("strong", {}, "Same trade, both products: "),
        `${name(product)} costs ${fmtRs(a.totalPaise)}, ${name(other)} costs ${fmtRs(b.totalPaise)}.`);
    };

    [f.buy, f.sell, f.qty].forEach((x) => x.input.addEventListener("input", run));
    this.append(h("section", { class: "lab", "aria-label": "Cost calculator" }, banner,
      h("div", { class: "lab-grid" }, h("form", { class: "lab-form", onsubmit: (e: Event) => e.preventDefault() }, f.buy.root, f.sell.root, f.qty.root, productSeg.root, exchSeg.root, dpBox.root), out)));
    run();
  }
}

function card(label: string, value: string, sub: string, cls = "") {
  return h("div", { class: "lab-card " + cls }, h("div", { class: "lab-card-l" }, label), h("div", { class: "lab-card-v" }, value), h("div", { class: "lab-card-s" }, sub));
}
