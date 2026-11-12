import { LabCosts } from "./costs-lab";
import { LabPositionSize } from "./sizing-lab";

if (!customElements.get("lab-costs")) customElements.define("lab-costs", LabCosts);
if (!customElements.get("lab-position-size")) customElements.define("lab-position-size", LabPositionSize);

import { LabJournal } from "./journal-lab";
if (!customElements.get("lab-journal")) customElements.define("lab-journal", LabJournal);

import { LabBacktest } from "./backtest-lab";
if (!customElements.get("lab-backtest")) customElements.define("lab-backtest", LabBacktest);

import { LabForward } from "./forward-lab";
if (!customElements.get("lab-forward")) customElements.define("lab-forward", LabForward);
