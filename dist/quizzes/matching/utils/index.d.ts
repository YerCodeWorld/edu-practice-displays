import { MatchData } from "../types";
export declare const items: (data: MatchData, column: "right" | "left") => string[];
export declare const distractors: (data: MatchData) => string[];
export declare const answerKey: (data: MatchData) => {
    [k: string]: string;
};
export { parseMatching } from "./parser";
