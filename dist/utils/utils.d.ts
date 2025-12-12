export interface EduMCQData {
    img?: string;
    question: string;
    hint?: string;
    options: string[];
    correctOptions: string[];
}
export declare const $: <T extends Element>(sel: string, r: HTMLElement) => T | null;
/**
 * Different than applying a theme, this one creates a style element directly into the
 * target element
 */
export declare function injectStyle(id: string, css: string): void;
/**
 * Take an array of whatever and randomize its order. This is needed by most exercises
 * since always rendering in the same ordern makes it easier to pass by just memorizing order.
 */
export declare function shuffle<T>(arr: T[]): T[];
/**
 * This section element is expected to be the root element to all components no matter
 * their type.
 */
export declare function createSection(cn: string, ariaLabel: string): HTMLElement;
/**
 * Example expected string:
 * ...
 * @EXTRA = [I | am | you];
 */
export declare function removeDistractors(s: string): {
    ok: boolean;
    distractors?: string[];
    resultString?: string;
    errors?: string;
};
export declare function extractTitleAndStrip(source: string): {
    title?: string;
    rest: string;
};
export declare function takeOptionalLabel(block: string): {
    label: string;
    cleaned: string;
};
export declare function splitBlocksOutsideParens(source: string): string[];
export declare function extractImage(block: string): {
    img?: string;
    cleaned: string;
};
export declare function splitPipes(s: string): string[];
export declare function dedupe<T>(arr: T[]): T[];
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
export declare function getResultEl(score: number, correct: number, total: number, timestamp: string, wrong: string[]): HTMLDivElement;
