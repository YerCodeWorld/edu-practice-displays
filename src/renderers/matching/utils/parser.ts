import {
  Pair,
  GeneralContent,
  ParseResult
} from "../types";

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

/**
 * Example expected string:
 * ...
 * @EXTRA = [I | am | you];
 */
function removeDistractors(s: string): {
    ok: boolean,
    distractors?: string[],
    resultString?: string,
    errors?: string
} {
    const reSingle: RegExp = /@EXTRA\s*(?:=|::)\s*\[(.*?)\]/;
    const reGlobal: RegExp = /@EXTRA\s*(?:=|::)\s*\[(.*?)\]/g;

    let distractors: string[] = [];
    let replaced: string = "";

    const m = Array.from(s.matchAll(reGlobal), m => m[1]);

    if (m.length === 0) return { ok: true, resultString: s, errors: "no matches for @EXTRA distractors in the provided string" };
    if (m.length > 1) return { ok: false, resultString: s, errors: "More than one @EXTRA distractors identifier found." };

    console.log(m);

    distractors = m[0]
        .split("|")
        .map(x => x.trim())
        .filter(x => x.length > 0);

    const resultString = s.replace(reSingle, "");

    return { ok: true, distractors: distractors, resultString: resultString };
}

