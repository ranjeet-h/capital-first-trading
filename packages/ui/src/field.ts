import { h, nextId } from "./util";

export interface TextField { root: HTMLElement; input: HTMLInputElement; error: (msg: string) => void; }
export function textField(label: string, value: string, opts: { hint?: string; prefix?: string; suffix?: string; name: string; optional?: boolean; whole?: boolean }): TextField {
  const id = nextId("f"), hintId = id + "-h", errId = id + "-e";
  const input = h("input", { id, name: opts.name, type: "text", inputMode: opts.whole ? "numeric" : "decimal", autocomplete: "off", value, "aria-describedby": `${hintId} ${errId}` });
  const err = h("div", { class: "lab-err", id: errId, role: "alert" });
  const root = h("div", { class: "lab-field" },
    h("label", { for: id }, label, opts.optional ? h("span", { class: "lab-opt" }, " (optional)") : null),
    h("div", { class: "lab-input" }, opts.prefix ? h("span", { class: "lab-affix" }, opts.prefix) : null, input, opts.suffix ? h("span", { class: "lab-affix" }, opts.suffix) : null),
    h("div", { class: "lab-hint", id: hintId }, opts.hint ?? ""), err);
  return { root, input, error: (m) => { err.textContent = m; input.setAttribute("aria-invalid", m ? "true" : "false"); } };
}

export function segmented<T extends string>(label: string, name: string, options: [T, string][], value: T, onChange: (v: T) => void) {
  const group = h("div", { class: "lab-seg", role: "radiogroup", "aria-label": label });
  const btns = options.map(([v, text]) => {
    const b = h("button", { type: "button", role: "radio", class: "lab-seg-btn", "data-value": v, "aria-checked": String(v === value), onclick: () => select(v) }, text);
    return b;
  });
  function select(v: T) { btns.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.value === v))); current = v; onChange(v); }
  let current = value;
  group.append(...btns);
  return { root: h("div", { class: "lab-field" }, h("span", { class: "lab-label", id: name + "-l" }, label), group), get: () => current, set: (v: T) => select(v) };
}

export function checkbox(label: string, checked: boolean, onChange: (v: boolean) => void) {
  const id = nextId("c");
  const input = h("input", { id, type: "checkbox", checked, onchange: () => onChange(input.checked) });
  return { root: h("div", { class: "lab-check" }, input, h("label", { for: id }, label)), input };
}
