// letter-picker.ts
import innerHtml from "./html/letter-picker.html";

type Mode = "simple" | "grid";

export class LetterPicker extends HTMLElement {
  static get observedAttributes() {
    return ["value", "mode", "placeholder", "disabled"] as const;
  }

  private _open = false;
  private _display!: HTMLElement;
  private _picker!: HTMLElement;

  // Bound handlers so add/removeEventListener use the same fn refs
  private _onDocClick = (e: Event) => {
    const path = (e.composedPath && e.composedPath()) || [];
    if (!path.includes(this)) this.close();
  };

  private _onDocKey = (e: KeyboardEvent) => {
    if (!this._open) return;
    if (e.key === "Escape") {
      e.stopPropagation();
      this.close();
      (this._display as HTMLElement).focus?.();
      return;
    }
    // Quick type-to-select: A–Z picks and closes
    if (/^[a-z]$/i.test(e.key)) {
      const letter = e.key.toUpperCase();
      const btn = this._picker.querySelector<HTMLButtonElement>(`button[data-letter="${letter}"]`);
      if (btn) {
        this.value = letter;
        this.close();
        this.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  };

  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = innerHtml;

    this._display = root.getElementById("display") as HTMLElement;
    this._picker = root.getElementById("picker") as HTMLElement;

    // Build A–Z once
    for (let i = 65; i <= 90; i++) {
      const letter = String.fromCharCode(i);
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = letter;
      b.dataset.letter = letter;
      b.setAttribute("role", "option");
      b.addEventListener("click", () => {
        this.value = letter;
        this.close();
        this.dispatchEvent(new Event("change", { bubbles: true }));
      });
      this._picker.appendChild(b);
    }

    // Toggle/open/close
    this._display.addEventListener("click", () => this.toggle());

    // Base ARIA
    this.setAttribute("role", "combobox");
    this._display.setAttribute("aria-expanded", "false");
    this._display.setAttribute("tabindex", "0");

    this._syncDisplay();
  }

  // Attributes ↔ properties
  get placeholder(): string | null {
    return this.getAttribute("placeholder");
  }
  set placeholder(v: string | null) {
    if (v == null) this.removeAttribute("placeholder");
    else this.setAttribute("placeholder", v);
  }

  get mode(): Mode {
    return (this.getAttribute("mode") as Mode) ?? "simple";
  }
  set mode(v: Mode) {
    this.setAttribute("mode", v ?? "simple");
  }

  get value(): string {
    return (this.getAttribute("value") || "").toUpperCase();
  }
  set value(v: string) {
    const clean = (v || "").toUpperCase().replace(/[^A-Z]/g, "");
    this.setAttribute("value", clean);
  }

  get disabled(): boolean {
    return this.hasAttribute("disabled");
  }
  set disabled(v: boolean) {
    if (v) this.setAttribute("disabled", "");
    else this.removeAttribute("disabled");
    this._display.setAttribute("aria-disabled", v ? "true" : "false");
  }

  connectedCallback() {
    // Upgrade pre-defined properties
    this._upgradeProperty("placeholder");
    this._upgradeProperty("mode");
    this._upgradeProperty("value");
    this._upgradeProperty("disabled");

    if (!this.hasAttribute("mode")) this.mode = "simple";
    this._syncDisplay();

    // Keyboard support on the host
    this.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  disconnectedCallback() {
    this.close();
  }

  attributeChangedCallback(name: string) {
    if (name === "value" || name === "placeholder") this._syncDisplay();
    if (name === "disabled" && this.disabled) this.close();
  }

  // Public API
  open() {
    if (this._open || this.disabled) return;
    this._picker.style.display = "grid";
    this._display.setAttribute("aria-expanded", "true");
    document.addEventListener("click", this._onDocClick, true);
    document.addEventListener("keydown", this._onDocKey);
    this._open = true;
  }

  close() {
    if (!this._open) return;
    this._picker.style.display = "none";
    this._display.setAttribute("aria-expanded", "false");
    document.removeEventListener("click", this._onDocClick, true);
    document.removeEventListener("keydown", this._onDocKey);
    this._open = false;
  }

  toggle() {
    this._open ? this.close() : this.open();
  }

  // Helpers
  private _syncDisplay() {
    const val = this.value;
    const ph = this.placeholder || "Pick a letter";
    this._display.textContent = val || ph;
    this._display.classList.toggle("placeholder", !val);
  }

  private _upgradeProperty(prop: keyof LetterPicker) {
    
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      
      const value = this[prop];
      
      delete this[prop];
      // @ts-expect-error: restore via setter
      this[prop] = value;
    }
  }
}

customElements.define("letter-picker", LetterPicker);

