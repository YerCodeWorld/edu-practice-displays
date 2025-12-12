import { RendererOptions, RendererHandle, ContractType } from '../../types';
type trueFalseData = Array<{
    q: string;
    a: string;
}>;
export declare function trueFalseRenderer(mount: HTMLElement, data: trueFalseData, options: RendererOptions): RendererHandle;
export declare function parseTrueFalse(code: string): {
    ok: boolean;
    content?: trueFalseData;
    errors?: string[];
};
export declare function validateTrueFalse(data: trueFalseData): boolean;
export declare const TrueFalseContract: ContractType;
export {};
