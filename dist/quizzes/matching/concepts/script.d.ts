import { RendererOptions, RendererHandle, ContractType } from '../../types';
type Pair = {
    left: string;
    right: string;
};
type MatchData = {
    content: Pair[];
    distractors?: string[];
    leftColumnName?: string;
    rightColumnName?: string;
};
export declare function conceptsExerciseRenderer(mount: HTMLElement, data: MatchData, options?: RendererOptions): RendererHandle;
export declare const ConceptsDefinitionContract: ContractType;
export {};
