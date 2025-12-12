type ColorItem = {
    name: string;
    hex: string;
};
type PaletteMap = Record<string, ColorItem[]>;
export declare class ColorPicker extends HTMLElement {
    static get observedAttributes(): string[];
    private _palettes;
    private _activePaletteKey;
    private _value;
    private $wrap;
    private $swatch;
    private $tooltip;
    private $name;
    private $chip;
    private $grid;
    private $tabs;
    constructor();
    get palettes(): PaletteMap;
    set palettes(obj: PaletteMap);
    get activePaletteKey(): string;
    set activePaletteKey(k: string);
    get value(): ColorItem;
    set value(v: ColorItem);
    attributeChangedCallback(name: string, _old: string | null, val: string | null): void;
    connectedCallback(): void;
    private render;
    private renderTabs;
    private renderGrid;
    private updateHeader;
    private updateSwatch;
    private markSelected;
    private toggle;
    private close;
    private dispatch;
}
export {};
