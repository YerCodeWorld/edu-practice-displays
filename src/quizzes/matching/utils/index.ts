export type Pair = {
    left: string;
    right: string;    
}

export type MatchData = {
    content: Pair[];
    distractors?: string[];
}

// Build data helpers
export const items = (data: MatchData, column: 'right' | 'left') => data.content.map(i => column === 'right' ? i.right : i.left);

export const distractors = (data: MatchData) => data.distractors;

export const answerKey = (data: MatchData) =>
Object.fromEntries(data.content.map(i => [i.left, i.right]) as [string, string][]);

export { parseMatching } from "./parser";
