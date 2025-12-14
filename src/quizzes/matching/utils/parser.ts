import { removeDistractors } from "../../../utils"; 

export type Pair = {
    left: string;
    right: string;    
}

export type MatchData = {
    content: Pair[];
    distractors?: string[];
}


export interface ParseResult {
    ok: boolean;
    content?: MatchData;
    errors?: string;
}

// Build data helpers
export const items = (data: MatchData, column: 'right' | 'left') => data.content.map(i => column === 'right' ? i.right : i.left);

export const distractors = (data: MatchData) => data.distractors;

export const answerKey = (data: MatchData) =>
Object.fromEntries(data.content.map(i => [i.left, i.right]) as [string, string][]);


/**
 * General parser, works for most variations
 */
export function parseMatching(exs: string): ParseResult {

    const r = removeDistractors(exs);
    if (!r.ok) return { ok: false, errors: r.errors };
    const distractors = r.distractors ?? [];
    const exercise = r.resultString ?? exs;

    let pairs: Pair[] = [];

    const chunks = [...exercise.trim().split(";")];

    for (const c of chunks) {

        if (c.trim() === "") continue;

        const hasEq = c.includes("=");
        const hasColon = c.includes("::");

        if (hasEq && hasColon) return { ok: false, errors: `Ambiguous separators in ${c}`};

        let eqCount = c.split("=").length - 1;
        let colonCount = c.split("::").length - 1;
        if ((eqCount || colonCount) > 1) {
            return {
                ok: false,
                errors: `More than one separator found in a single sentence: ${c}`
            };
        }

        if (!hasEq && !hasColon) return { ok: false, errors: `No separators found in ${c}` };

        let sep: string = "";
        if (hasEq) sep = "="; else sep = "::";

        const [left, right] = c.split(sep, 2).map(p => p.trim());
        if (!(left && right)) return { ok: false, errors: `Incomplete pair at: ${c}` };

        pairs.push({left, right});

    }

    return { ok: true, content: { content: pairs, distractors: distractors }};
}

