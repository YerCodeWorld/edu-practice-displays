import { MatchData } from "../types";
import { RendererOptions, RendererHandle, ContractType } from '../../types';
export declare function matchingSingleRenderer(mount: HTMLElement, data: MatchData, options?: RendererOptions): RendererHandle;
export declare function validateMatchingSingle(data: {}): boolean;
export declare const MatchingSingleContract: ContractType;
