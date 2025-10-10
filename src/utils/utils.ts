export interface EduMCQData {
  img?: string; 
  question: string;
  hint?: string;
  options: string[];
  correctOptions: string[];
}

export const $ = <T extends Element>(sel: string, r: HTMLElement): T | null => 
  r.querySelector<T>(sel);

/**
 * Different than applying a theme, this one creates a style element directly into the
 * target element
 */
export function injectStyle(id: string, css: string): void {
    if (typeof document === "undefined") return;
    if (!document.getElementById(id)) {
        const element = document.createElement("style");
        element.id = id;
        element.textContent = css;
        document.head.appendChild(element);
    }
}

/**
 * Take an array of whatever and randomize its order. This is needed by most exercises
 * since always rendering in the same ordern makes it easier to pass by just memorizing order.
 */
export function shuffle<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * This section element is expected to be the root element to all components no matter
 * their type.
 */
export function createSection(cn: string, ariaLabel: string): HTMLElement {
    const root = document.createElement("section");
    root.className = cn;
    root.setAttribute("role", "region");
    root.setAttribute("aria-label", ariaLabel);

    return root;
}

/**
 * Example expected string:
 * ...
 * @EXTRA = [I | am | you];
 */
export function removeDistractors(s: string): {
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

// Takes the grammar of an exercise and extracts the title metadata 
// Looks for a @TITLE = ... ; pattern to return. Returns cleaned string
export function extractTitleAndStrip(source: string): { title?: string; rest: string } {  
  const re = /@TITLE\s*=\s*([^;]+);?/i;
  const m = source.match(re);
  if (!m) return { rest: source };
  const title = m[1].trim();
  const rest = source.replace(m[0], "").trim();
  return { title, rest };
}

// Takes a block (usually parts of an exercise after splitting by ';') and 
// looks for a # or -> label, which indicate either instruction or hint. 
// Returns it alongside the cleaned string. 
export function takeOptionalLabel(block: string): { label: string; cleaned: string } {
  const firstLine = block.split(/\r?\n/, 1)[0]?.trim() ?? "";
  // formats supported: "-> Label" or "# Label"
  const arrow = /^->\s*(.+)$/;
  const hash = /^#\s*(.+)$/;

  if (arrow.test(firstLine)) {
    const label = firstLine.replace(arrow, "$1").trim();
    const cleaned = block.replace(/^[^\n]*\n?/, ""); // drop first line
    return { label, cleaned: cleaned.trim() };
  }
  if (hash.test(firstLine)) {
    const label = firstLine.replace(hash, "$1").trim();
    const cleaned = block.replace(/^[^\n]*\n?/, "");
    return { label, cleaned: cleaned.trim() };
  }
  return { label: "", cleaned: block.trim() };
}

export function splitBlocksOutsideParens(source: string): string[] {
  const out: string[] = [];
  let buf = "";
  let depth = 0;

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];

    if (ch === "(") depth++;
    if (ch === ")") depth = Math.max(0, depth - 1);

    if (ch === ";" && depth === 0) {
      const piece = buf.trim();
      if (piece) out.push(piece);
      buf = "";
    } else {
      buf += ch;
    }
  }

  const tail = buf.trim();
  if (tail) out.push(tail);

  return out;
}

export function extractImage(block: string): { img?: string; cleaned: string } {
  // Matches: <data:...> or <http(s)://...>
  const m = block.match(/<\s*(data:[^>\s]+|https?:\/\/[^>\s]+)\s*>/i);
  if (!m) return { cleaned: block.trim() };

  const cleaned = block.replace(m[0], "").trim();
  return { img: m[1], cleaned };
}

export function splitPipes(s: string): string[] {
  return s.split("|").map(t => t.trim()).filter(Boolean);
}
export function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

// function createLiFromList() {}

/**
function createElFromRecord(obj: Record<string, string[]>): HTMLDivElement {
  const container = document.createElement("div");
  Object.entries(obj).forEach([k, v] => {
    const q = document.createElement("small");
    q.textContent = k;

    const ul = document.createElement("ul");
    v.forEach(val => {
      const li = document.createElement("li");
      li.textContent = val; 
      ul.appendChild(li);
    });
    
    container.append(q, ul);
  });

  return container; 
}
*/

// ...
export function getResultEl(

  score: number, 
  correct: number, 
  total: number, 
  timestamp: string,
  wrong: string[],
  // feedbackEl: 'obj' | 'ul' = 'ul';
  
): HTMLDivElement {

    const ul = document.createElement("ul");
    wrong.forEach(upload => {
      const li = document.createElement("li");
      li.textContent = upload;
      ul.appendChild(li);
    });

    const winningContainer = document.createElement("div");      
    winningContainer.innerHTML = `            
      <header>
        <h4>${correct} of ${total} correct! ${String(score).slice(0, 4)}/100</h4>
        <small>${String(timestamp).slice(0, 4)} seconds</small>
        <p>${correct !== total ? "Better luck next time" : "Very nice job!"}</p>          
      </header>        
      <p>Wrong Answers: </p>    
    `;
    if (correct < total) winningContainer.appendChild(ul);
    else winningContainer.innerHTML += '<p>0 wrong answers 🥳</p>';

    return winningContainer;
    
}
