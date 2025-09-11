import innerHtml from "./html/letter-picker.html";

export class LetterPicker extends HTMLElement {

    static get observedAttributes() { return ["value", "mode", "placeholder", "disabled"]; }

    private _isOpen: boolean;
    private _display!: HTMLElement;
    private _picker!: HTMLElement;
    private _onDocClick!: (e: Event) => void;
    private _onDocKey!: (e: KeyboardEvent) => void;

    constructor() {

        super();

        this.attachShadow({ mode: "open" });
        this._isOpen = false;

        this.shadowRoot.innerHTML = innerHtml;

        const wrapper =  this.shadowRoot.getElementById("wrap");
        const display =  this.shadowRoot.getElementById("display");
        this._display = display;

        const picker =  this.shadowRoot.getElementById("picker");
        this._picker = picker;

        // append letters to picker
        for (let i = 65; i <= 90; i++) {
            const b = document.createElement("button");

            b.type = "button";
            b.textContent = String.fromCharCode(i);
            b.setAttribute("role", "option");
            b.addEventListener("click", () => {
                this.value = b.textContent;
                this.close();
                this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));

            });
            picker.appendChild(b);
        }

        display.addEventListener("click", () => this.toggle());

        this._onDocClick = (e) => {
            const path = e.composedPath();
            if (!path.includes(this)) this.close();
        };

        this.syncDisplay();
    }

    connectedCallback() {
        if (!this.hasAttribute("mode")) this.setAttribute("mode", "simple");
    }

    disconnectedCallback() { this.close(); }

    attributeChangedCallback(name, _oldV, _newV) {
        if (name === "value" || name === "placeholder") this.syncDisplay();
    }


    open() {
        if (this._isOpen || this.hasAttribute("disabled")) return;
        this._picker.style.display = "grid";
        this._display.setAttribute("aria-expanded", "true");
        document.addEventListener("click", this._onDocClick, true);
        document.addEventListener("keydown", this._onDocKey);
        this._isOpen = true;
    }

    close() {
        if (!this._isOpen) return;
        this._picker.style.display = "none";
        this._display.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", this._onDocClick, true);
        document.removeEventListener("keydown", this._onDocKey);
        this._isOpen = false;
    }

    toggle() {
        this._isOpen ? this.close() : this.open();
    }

    get value() { return (this.getAttribute("value") || "").toUpperCase(); }
    set value(v) {
        const clean = (v || "").toUpperCase().replace(/[^A-Z]/g, "");
        this.setAttribute("value", clean);
    }

    private syncDisplay() {
        const val = this.value;
        const ph = this.getAttribute("placeholder") || ".";
        this._display.textContent = val || ph;
        this._display.classList.toggle("placeholder", !val);
    }
}
