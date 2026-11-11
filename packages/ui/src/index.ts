import { LabCosts } from "./costs-lab";
import { LabPositionSize } from "./sizing-lab";

if (!customElements.get("lab-costs")) customElements.define("lab-costs", LabCosts);
if (!customElements.get("lab-position-size")) customElements.define("lab-position-size", LabPositionSize);
