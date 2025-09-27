// edu-mcq.ts
import innerHtml from "./html/edu-mcq.html";

type MCQOption = { id?: string; text: string };
type ComponentLayouts = "grid" | "stack" | "dialog";

type MCQData = {
  id?: string;
  sentence: string;
  options: MCQOption[];
  hint?: string;
  image?: string;
};

type SubmitDetail = {
  id: string | null;
  sentence: string;
  index: number;
  option: { id: string | null; text: string };
};

const template = document.createElement("template");
template.innerHTML = innerHtml;

// Small helper: query & assert
function $(root: ParentNode, sel: string): HTMLElement {
  const el = root.querySelector<HTMLElement>(sel);
  if (!el) throw new Error(`EduMCQ: missing element "${sel}" in template`);
  return el;
}

export class EduMCQ extends HTMLElement {
  static get observedAttributes() {
    // "theme" is surfaced for CSS to hook onto; logic here is optional.
    return ["layout", "theme", "disabled", "hide-done"];
  }

  private _data: MCQData = { sentence: "", options: [] };
  private _layout: ComponentLayouts = "grid";
  private selectedIndex: number | null = null;

  private $q!: HTMLElement;
  private $hintWrap!: HTMLElement;
  private $hintBtn!: HTMLButtonElement;
  private $opts!: HTMLElement;
  private $done!: HTMLButtonElement;
  private $open!: HTMLButtonElement;
  private $dlg!: HTMLDialogElement;
  private $dlgTitle!: HTMLElement;
  private $dlgOpts!: HTMLElement;
  private $dlgAccept!: HTMLButtonElement;

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.appendChild(template.content.cloneNode(true));

    this.$q = $(root, "#q");
    this.$hintWrap = $(root, "#hint");
    this.$hintBtn = $(root, ".hint-btn") as HTMLButtonElement;
    this.$opts = $(root, ".options");
    this.$done = $(root, "[data-done]") as HTMLButtonElement;
    this.$open = $(root, "[data-open]") as HTMLButtonElement;
    this.$dlg = $(root, "dialog") as HTMLDialogElement;
    this.$dlgTitle = $(root, ".dlg-title");
    this.$dlgOpts = $(root, ".dlg-options");
    this.$dlgAccept = $(root, "[data-accept]") as HTMLButtonElement;

    // Events
    this.$done.addEventListener("click", () => this.submit());
    this.$open.addEventListener("click", () => this.openDialog());
    $(root, "[data-cancel]").addEventListener("click", () => this.$dlg.close());

    this.$dlgAccept.addEventListener("click", () => {
      const idx = Number(this.$dlg.dataset.sel ?? "-1");
      if (idx >= 0) this.setSelected(idx);
      this.$dlg.close();
    });

    this.$hintBtn.addEventListener("click", () => {
      const showing = this.$hintWrap.hasAttribute("shown");
      this.$hintWrap.toggleAttribute("shown", !showing);
      this.$hintBtn.setAttribute("aria-expanded", String(!showing));
    });
  }

  // Lifecycle
  connectedCallback() {
    if (!this.hasAttribute("layout")) this.setAttribute("layout", this._layout);
    this.syncLayoutButtons();
    this.syncDisabled();
    this.syncHideDone();
    this.render();
  }

  attributeChangedCallback(name: string, _old: string | null, _val: string | null) {
    switch (name) {
      case "layout":
        this._layout = (this.getAttribute("layout") as ComponentLayouts) ?? "grid";
        this.syncLayoutButtons();
        break;
      case "disabled":
        this.syncDisabled();
        break;
      case "hide-done":
        this.syncHideDone();
        break;
      case "theme":
        // Optional: allow CSS to hook via :host([theme="..."])
        break;
    }
  }

  // Public API
  get data(): MCQData {
    return this._data;
  }
  set data(d: MCQData) {
    this._data = d ?? { sentence: "", options: [] };
    this.selectedIndex = null;
    this.render();
  }

  set layout(l: ComponentLayouts) {
    this._layout = l ?? "grid";
    this.setAttribute("layout", this._layout);
  }
  get layout(): ComponentLayouts {
    return (this.getAttribute("layout") as ComponentLayouts) ?? this._layout;
  }

  get value(): MCQOption | null {
    return this.selectedIndex == null ? null : this._data.options[this.selectedIndex] ?? null;
  }

  // Renderers
  private render(): void {
    // Question
    this.$q.textContent = this._data.sentence ?? "";

    // Hint
    const hint = this._data.hint?.trim();
    if (hint) {
      this.$hintWrap.textContent = hint;
      this.$hintBtn.hidden = false;
    } else {
      this.$hintWrap.removeAttribute("shown");
      this.$hintWrap.textContent = "";
      this.$hintBtn.hidden = true;
    }

    // Options (grid/stack)
    this.renderOptions(this.$opts, this._data.options, (i) => this.setSelected(i));

    // Dialog
    this.$dlgTitle.textContent = this._data.sentence || "Choose an answer";
    this.renderOptions(this.$dlgOpts, this._data.options, (i) => {
      this.$dlg.dataset.sel = String(i);
      this.highlightSelected(this.$dlgOpts, i);
      this.$dlgAccept.disabled = false || this.isDisabled();
    });

    // Reset state
    this.selectedIndex = null;
    this.$done.disabled = true || this.isDisabled();
    this.$dlgAccept.disabled = true || this.isDisabled();
    this.$dlg.dataset.sel = "-1";
    this.highlightSelected(this.$opts, null);
    this.syncLayoutButtons();
  }

  private renderOptions(host: HTMLElement, options: MCQOption[], onPick: (i: number) => void) {
    host.innerHTML = "";
    host.setAttribute("role", "radiogroup");
    options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", "false");
      btn.textContent = opt.text;
      btn.disabled = this.isDisabled();
      btn.addEventListener("click", () => onPick(i));
      host.appendChild(btn);
    });
  }

  private highlightSelected(container: HTMLElement, idx: number | null) {
    Array.from(container.children).forEach((el, i) => {
      (el as HTMLElement).setAttribute("aria-checked", String(i === idx));
    });
  }

  private setSelected(i: number) {
    if (this.isDisabled()) return;
    if (i < 0 || i >= this._data.options.length) return;
    this.selectedIndex = i;
    this.highlightSelected(this.$opts, i);
    this.$done.disabled = false;
  }

  private submit() {
    if (this.selectedIndex == null) return;
    const opt = this._data.options[this.selectedIndex];

    const detail: SubmitDetail = {
      id: this._data.id ?? null,
      sentence: this._data.sentence,
      index: this.selectedIndex,
      option: { id: opt?.id ?? null, text: opt?.text ?? "" },
    };

    this.dispatchEvent(
      new CustomEvent<SubmitDetail>("mcq-submit", {
        bubbles: true,
        composed: true,
        detail,
      }),
    );
  }

  private openDialog() {
    if (this.isDisabled()) return;
    if (!this.$dlg.open) this.$dlg.showModal();
  }

  // Attribute helpers
  private syncLayoutButtons() {
    const isDialog = this.layout === "dialog";
    this.$open.hidden = !isDialog;
  }

  private syncDisabled() {
    const disabled = this.isDisabled();
    this.$done.disabled = disabled || this.selectedIndex == null;
    this.$open.disabled = disabled;
    this.$dlgAccept.disabled = disabled || (this.$dlg.dataset.sel ?? "-1") === "-1";

    // Disable option buttons
    [...this.$opts.querySelectorAll<HTMLButtonElement>(".option")].forEach((b) => (b.disabled = disabled));
    [...this.$dlgOpts.querySelectorAll<HTMLButtonElement>(".option")].forEach((b) => (b.disabled = disabled));
    this.toggleAriaDisabled(disabled);
  }

  private syncHideDone() {
    const hide = this.hasAttribute("hide-done");
    this.$done.hidden = hide;
  }

  private isDisabled(): boolean {
    return this.hasAttribute("disabled");
  }

  private toggleAriaDisabled(disabled: boolean) {
    this.$opts.setAttribute("aria-disabled", String(disabled));
    this.$dlgOpts.setAttribute("aria-disabled", String(disabled));
  }
}

// Register if not already
if (!customElements.get("edu-mcq")) {
  customElements.define("edu-mcq", EduMCQ);
}

