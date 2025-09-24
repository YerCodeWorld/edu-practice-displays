type ParseError = { pos: number; msg: string };
type ParseResult = {
    ok: Boolean;
    html: string;
    errors: ParseError[];
}

const grammar = {
    tx: parseTX,
    nm: parseNM,
    sl: parseSL
} as const;

// id and answer management
let elsCounter = 0;
let answerMap = new Map<string, any>();

function parseCode(code: string): ParseResult {

    const errors: ParseError[] = [];

    let i = 0;
    let textBuf = "";

    while (i < code.length) {

        const ch = code[i];

        if (ch === "@" && code[i+1] === "@") { textBuf += "@"; i += 2; continue; }
        if (ch !== "@") { textBuf += ch; i++; continue; }

        // ...

        const currentPos = i;
        i++;  // skips current '@'

        let fn = '';
        while (i < code.length && /[a-z]/i.test(code[i])) { fn += code[i++]; }
        if (!fn) {
            errors.push({ pos: currentPos, msg: "Expected a function id after '@' (e.g., @tx, @nm, @sl)." });
            textBuf += '@'; // turn it back
            continue;
        }
        if (code[i] !== '(') {
            errors.push({ pos: currentPos, msg: `Expected '(' after @${fn.substring(0, 2)}.` });
            textBuf += `@${fn}`; // turn it back
            continue;
        }
        i++; // skip current '('

        // reading until closing bracket ')'
        const startContent = i;
        let content = "";
        let closed = false;
        while (i < code.length) {
            if (code[i] === ')') { closed = true; i++; break; }
            content += code[i++];
        }

        if (!closed) {
            errors.push({ pos: currentPos, msg: `Unclosed parentheses for @${fn}(...).` });
            textBuf += `@${fn}({$content})`;
            continue;
        }

        const parser = (grammar as any)[fn];
        if (!parser) {
            errors.push({ pos: currentPos, msg: `Unknown input type '@${fn}'. Allowed: ${Object.keys(grammar).join(", ")}.` });
            textBuf += `@${fn}(${content})`;
            continue;
        }

        try {
            const part = parser(content.trim(), currentPos);
            textBuf += (part);
        } catch (e: any) {
            errors.push({ pos: currentPos, msg: String(e?.message ?? e) });
            textBuf += `@${fn}(${content})`;
        }

    }

    if (errors.length > 0) return { ok: false, html: '', errors: errors };
    return { ok: true, html: textBuf, errors: errors }
}

function checkAnswers() {}

/* -------------------- Grammars Parsers -------------------- */

/**
 * Accepts the following grammar:
 *
 * am | 'm | is  or single: am
 **/
function parseTX(content: string, pos: number): string {

    const tokens = splitPipes(content);

    if (tokens.length === 0 || tokens.some(t => !t)) {
        throw new Error('@tx: provide at least one non-empty answer. Pos ${pos}.');
    }

    const answers = dedupe(tokens);
    const id = `id-${elsCounter}`;
    answerMap.set(id, answers);

    elsCounter++;
    return `<input type="text" id='id-${id}'>`;
}

/**
 * Accepts the following grammar:
 *
 * 2 | 5..8 | 12 | 20..34
 *
 * Single are unique answers, .. union is range
 **/
function parseNM(content: string, pos: number) {

    const tokens = splitPipes(content);
    if (tokens.length === 0) throw new Error(`@nm: empty content. Pos ${pos}.`);

    const values: number[] = [];
    const ranges: Array<{ min: number; max: number }> = [];

    for (const t of tokens) {
        // AI-generated regex
        const m = t.match(/^\s*(-?\d+)\s*(\.\.)\s*(-?\d+)\s*$/);

        if (m) {
            const min = parseInt(m[1], 10);
            const max = parseInt(m[3], 10);

            if (Number.isNaN(min) || Number.isNaN(max)) {
                throw new Error(`@nm: invalid range '${t}'. Pos ${pos}.`);
            }

            // logic gate error
            if (min > max) throw new Error(`@nm: range min > max in '${t}'. Pos ${pos}.`);
            ranges.push({ min, max });
        } else {
            const n = Number(t.trim());
            if (!Number.isInteger(n)) throw new Error(`@nm: '${t}' is not an integer. Pos ${pos}.`);
            values.push(n);
        }

    }

    const id = `id-${elsCounter}`;
    // ranges need overlapping values error checking though
    answerMap.set(id, { single: dedupe(values), ranges: ranges });
    elsCounter++;

    return `<input type='number' id=${id} >`;
}

/**
 * Accepts the following grammar:
 *
 * [correct1 | correctN] | incorrec1 | incorrecN
 **/
function parseSL(content: string, pos: number) {

    const bracketMatches = [...content.matchAll(/\[([^\]]+)\]/g)];
    const correct = bracketMatches.flatMap(m => splitPipes(m[1]));
    // remove [] correct options syntax from string
    const cleaned = content.replace(/\[|\]/g, "");
    // add deault empty option and shuffle actual options
    const options = [' ', ...shuffle(dedupe(splitPipes(cleaned)))];

    if (options.length === 0) throw new Error(`@sl: provide at least one option. Pos ${pos}.`);
    if (correct.length === 0) throw new Error(`@sl: mark correct option(s) in [brackets]. Pos ${pos}.`);
    for (const c of correct) {
        if (!options.includes(c)) throw new Error(`@sl: correct '${c}' not present among options. Pos ${pos}.`);
    }

    const id = `id-${elsCounter}`;
    answerMap.set(id, { correct: correct, options: options.filter(o => !correct.includes(o)) });
    const optsHTML = options.map(o => `<option>${o}</option>`);

    elsCounter++;

    return `<select id='${id}'>${optsHTML}</select>`;
}

/* --------------------Helpers -------------------- */

function splitPipes(s: string): string[] {
    return s.split("|").map(t => t.trim()).filter(Boolean);
}

function dedupe<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

/* -------------------- Test -------------------- */

function testSystem() {
    const code = `
    I @tx(am|'m) your best friend.
    I am @tx(21|20) years old.
    We @tx(are|'re) a family. I am @nm(11 | 15 | 20..24)
    years old. She @sl([is|'s] | are | am) a great person.    
    `;

    const parsed = parseCode(code);

    if (!parsed.ok) {
        console.log(parsed.errors);
    } else {
        const p = `<p>${parsed.html}</p>`;
        console.log(p);
        // document.body.innerHTML = p;
    }
}

// ------------------------

function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex !== 0) {
        
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}

export const parserContract = {

    dslParser: parseCode,
    grammarParsers: grammar,
    checkAnswers: checkAnswers,
    test: testSystem

}


