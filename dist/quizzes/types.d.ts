export type Result = {
    detail: {
        correct: number;
        total: number;
        score: number;
    };
    timestamp: string;
    winningEl?: HTMLElement | null;
};
export type RendererOptions = {
    shuffle?: boolean;
    allowRetry?: boolean;
    resultHandler?: (r: Result) => void;
    ariaLabel?: string;
    checkBtn?: boolean;
};
export type RendererHandle = {
    destroy(): void;
    check(): void;
};
type Implementation = {
    renderer: (mount: HTMLElement, data: any, options?: RendererOptions) => RendererHandle;
    validator: (data: any) => boolean;
    parser: (code: string) => any;
};
export interface ContractType {
    name: string;
    description: string;
    image?: string;
    version: number;
    parserVersion: number;
    category: string;
    tags: string[];
    usage: string[];
    wrong: string[];
    grammarExample: string[];
    defaultOptions?: any;
    implementation: Implementation;
    styleTag?: string;
    sectionTag?: string;
    html: string;
    css: string;
}
export {};
