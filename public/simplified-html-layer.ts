type ParseError = { pos: number; msg: string };
type ParseResult = {
  ok: Boolean;
  html: string;
  errors: ParseError[];
}

const grammar = {
  tx: parseTX
} as const;

function parseBlanks(code: string): ParseResult {

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
      errors.push({ pos: currentPos, msg: `Expected '(' after @${fn}.` });
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

function parseTX(content: string, pos: number) {

  const tokens = splitPipes(content);

  if (tokens.length === 0 || tokens.some(t => !t)) {
    throw new Error('@tx: provide at least one non-empty answer. Pos ${pos}.');
  }

  const answers = dedupe(tokens);
  return `<input type="text" data-answer='${attrJSON(answers)}'>`;
}


/* --------------------Helpers -------------------- */

function splitPipes(s: string): string[] {
  return s.split("|").map(t => t.trim()).filter(Boolean);
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// avoid breaking the html when embedding in value attributes 
function escapeAttr(s: string) {
 return s.replace(/["&<>]/g, ch => (
    { 
        '"': "&quot;", 
        "&": "&amp;", 
        "<": "&lt;", 
        ">": "&gt;" 
    }[ch]!)); 
}
function attrJSON(obj: any) {
  return escapeAttr(JSON.stringify(obj));
}

/* --------------------Run -------------------- */
const code = `
I @tx(am|'m) your best friend. 
I am @tx(21|20) years old. 
We @tx(are|'re) a family.
`;

const parsed = parseBlanks(code);

if (!parsed.ok) {
  console.log(parsed.errors);
} else {
  const p = `<p>${parsed}</p>`;
  console.log(p);
  // document.body.innerHTML = p;
}

