import { EduMCQData } from "../utils/utils";
export declare class EduMCQ extends HTMLElement {
    static get observedAttributes(): string[];
    private _$prompt;
    private _$hint;
    private _$media;
    private _$opts;
    private _$hintBtn;
    private _data;
    private _selected;
    private _isChecked;
    constructor();
    set data(v: EduMCQData);
    render(): void;
    private toggleHint;
    clear(): void;
    showFeedback(): {
        total: number;
        correct: number;
        wrong: string[];
        missed: string[];
    };
    syncSelectedUI(): void;
    attributeChangedCallback(name: string): void;
}
