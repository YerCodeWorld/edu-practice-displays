import { Pair, GeneralContent, ParseResult } from "../types";
import { removeDistractors } from "../../../utils"; 

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

