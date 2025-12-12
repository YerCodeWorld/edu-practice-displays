type Mode = "simple" | "grid";
export declare class LetterPicker extends HTMLElement {
    static get observedAttributes(): readonly ["value", "mode", "placeholder", "disabled"];
    private _open;
    private _display;
    private _picker;
    private _onDocClick;
    private _onDocKey;
    constructor();
    get placeholder(): string | null;
    set placeholder(v: string | null);
    get mode(): Mode;
    set mode(v: Mode);
    get value(): string;
    set value(v: string);
    get disabled(): boolean;
    set disabled(v: boolean);
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(name: string): void;
    open(): void;
    close(): void;
    toggle(): void;
    private _syncDisplay;
    private _upgradeProperty;
}
export {};
