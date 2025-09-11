import innerHtml from "./html/edu-mcq.html";

type MCQOption = { id?: string; text: string };
type ComponentLayouts = 'grid' | 'stack' | 'dialog';

type MCQData = {
    id?: string;
    sentence: string;
    options: MCQOption[];
    hint?: string;
    image?: string;
}

const template = document.createElement("template");
template.innerHTML = innerHtml;

export class EduMCQ extends HTMLElement {

    // add "diabled" and "hide-done" for better user experience
    static get observedAttributes() { return ["layout", "theme"]; }

    private _data: MCQData = { sentence: "", options: [] };
    private _layout: ComponentLayouts = 'grid';
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
        // HTMLElement
        super();
        const root = this.attachShadow({ mode: "open" });
        root.appendChild(template.content.cloneNode(true));

        this.$q = root.querySelector("#q");
        this.$hintWrap = root.querySelector("#hint")!;
        this.$hintBtn = root.querySelector(".hint-btn") as HTMLButtonElement;
        this.$opts = root.querySelector(".options")!;
        this.$done = root.querySelector('[data-done]') as HTMLButtonElement;
        this.$open = root.querySelector('[data-open]') as HTMLButtonElement;
        this.$dlg = root.querySelector("dialog") as HTMLDialogElement;
        this.$dlgTitle = root.querySelector(".dlg-title") as HTMLElement;
        this.$dlgOpts = root.querySelector(".dlg-options") as HTMLElement;
        this.$dlgAccept = root.querySelector('[data-accept]') as HTMLButtonElement;

        this.$done.addEventListener("click", () => this.submit());
        this.$open.addEventListener("click", () => this.openDialog());

        root.querySelector("[data-cancel]")!.addEventListener("click", () => this.$dlg.close());

        this.$dlgAccept.addEventListener("click", () => {
            const idx = Number(this.$dlg.dataset.sel ?? "-1");
            if (idx >= 0) { this.setSelected(idx); }
            this.$dlg.close();
        });

        this.$hintBtn.addEventListener("click", () => {
           const showing = this.$hintWrap.hasAttribute("shown");
           this.$hintWrap.toggleAttribute("shown", !showing);
           this.$hintBtn.setAttribute("aria-expanded", String(!showing));
        });
    }

    connectedCallback() {
        if (!this.hasAttribute("layout")) this.setAttribute("layout", this._layout);
        this.syncLayoutButtons();
        this.render();
    }

    attributeChangedCallback(name: string) {
        if (name === "layout") this.syncLayoutButtons();

        // CSS is already up
        // if (name === "disabled") {};
        // if (name === "hide-done") {};
    }

    // API
    get data(): MCQData { return this._data; }
    set data(d: MCQData) {
        this._data = d ?? { sentence: "", options: [] };
        this.selectedIndex = null;
        this.render();
    }

    set layout(d: 'grid' | 'dialog' | 'stack') {
        this._layout = d ?? 'grid';
        this.setAttribute("layout", this._layout);
    }

    get value(): MCQOption | null {
        return this.selectedIndex === null
            ? null
            : this._data.options[this.selectedIndex] ?? null;
    }

    private render() {

        this.$q.textContent = this._data.sentence ?? "";

        if (this._data.hint?.trim()) {
            this.$hintWrap.textContent = this._data.hint!;
            this.$hintBtn.hidden = false;
        } else {
            this.$hintWrap.removeAttribute("shown");
            this.$hintWrap.textContent = "";
            this.$hintBtn.hidden = true;
        }

        this.renderOptions(this.$opts, this._data.options, (i) => this.setSelected(i));

        this.$dlgTitle.textContent = this._data.sentence ?? "Choose an answer";
        this.renderOptions(this.$dlgOpts, this._data.options, (i) => {
            this.$dlg.dataset.sel = String(i);
            this.highlightSelected(this.$dlgOpts, i);
            this.$dlgAccept.disabled = false;
        });

        // reset state
        this.selectedIndex = null;
        this.$done.disabled = true;
        this.$dlgAccept.disabled = true;
        this.$dlg.dataset.sel = "-1";

    }

    private renderOptions(host: HTMLElement, options: MCQOption[], onPick: (i: number) => void) {
        host.innerHTML = '';
        options.forEach((opt, i) => {
           const btn = document.createElement("button");
           btn.type = "button";
           btn.className = "option";
           btn.setAttribute("role", "radio");
           btn.setAttribute("aria-checked", "false");
           btn.textContent = opt.text;
           btn.addEventListener("click", () => onPick(i))
           host.appendChild(btn);
        });
    }

    private highlightSelected(container: HTMLElement, idx: number | null) {
        Array.from(container.children).forEach((el, i) => {
            (el as HTMLElement).setAttribute("aria-checked", String(i === idx));
        });
    }

    private setSelected(i: number) {
        // When we watch for disabled state
        // if (this.hasAttribute("disabled")) return;
        this.selectedIndex = i;
        this.highlightSelected(this.$opts, i);
        this.$done.disabled = false;
    }

    private submit() {
        if (this.selectedIndex == null) return;
        const opt = this._data.options[this.selectedIndex];
        this.dispatchEvent(new CustomEvent("mcq-submit", {
            bubbles: true, composed: true,
            detail: {
                id: this._data.id ?? null,
                sentence: this._data.sentence,
                index: this.selectedIndex,
                option: { id: opt?.id ?? null, text: opt?.text ?? "" }
            }
        }));
    }

    private openDialog() {
        if (!this.$dlg.open) this.$dlg.showModal();
    }

    private syncLayoutButtons() {
        const isDialog = this.getAttribute("layout") === "dialog";
        this.$open.hidden = !isDialog;
    }
}


