// BLANKS SINGLE 

import { injectStyle, createSection, getResultEl } from "./../../../utils/utils";
import { RendererOptions, RendererHandle, ContractType, Result } from '../../types';

import baseHTML from './index.html';
import baseCSS from './styles.css';  

type BlanksSingleData = {
  hint: string;
  word: string;
  blanks: number[];
};

// ===================================================================// 
//                           RENDERER                       
// ===================================================================//

function blanksSingleRenderer(
  mount: HTMLElement,
  data: BlanksSingleData[],
  options: RendererOptions
): RendererHandle {
  
  // BASE COMPONENT UTILITIES 
  // -------------------
  
  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = 'Blanks Single Exercise',
    checkBtn = false 
  } = options; 

  const root = createSection('blanks-single', ariaLabel);
  injectStyle('edu-blanks-single-style', baseCSS);    
  
  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
    r.querySelector<T>(sel);

  // CONSTANTS 
  // ---------
  
  const total: number = data.length; 
  const startTime = Date.now();  

  // HTML ELEMENTS 
  // -------------
  
  let $word: HTMLElement;
  let $instruction: HTMLElement;
  let $progress: HTMLElement;
  let $prev: HTMLButtonElement;
  let $next: HTMLButtonElement;
  let $checkBtn: HTMLButtonElement;   

  // VARIABLES
  // ---------
  
  let state = {};    
  let checked = new Set<number>();      
  let idx = 0;
  let slideMap = {};

  let score = 0;
  let correct = 0;  
  let wrong: string[] = [];  

  type SlideNode = HTMLElement;
  const slideDom = new Map<number, SlideNode>();

  // RENDERER FUNCTIONS 
  // ------------------
  
  function buildSlide(i: number): SlideNode {
    const item: BlanksSingleData = data[i];
    const answer = [...item.word];
    const blanks = new Set(item.blanks || []);

    const wrap = document.createElement('div'); // container for this slide
    wrap.className = "word";

    for (let pos = 1; pos <= answer.length; pos++) {
      const ch = answer[pos - 1];

      if (blanks.has(pos)) {
        const lp = document.createElement('letter-picker') as HTMLElement;
        lp.setAttribute('mode', 'box');
        lp.setAttribute('placeholder', '💬');
        lp.dataset.pos = String(pos);
        lp.id = `lp-${i}-${pos}`;

        const saved = state[lp.id];
        if (saved != null) lp.setAttribute('value', saved);

        lp.addEventListener('change', () => {
          updateState(lp.id); // persists the state map
        });

        wrap.append(lp);
      } else {
        const div = document.createElement('div');
        div.className = 'letter';
        div.textContent = ch;
        wrap.append(div);
      }
    }

    slideDom.set(i, wrap);
    return wrap;
  }

  function renderSlide(i: number) {
    const item: BlanksSingleData = data[i];

    $instruction.textContent = item.hint;
    $progress.innerHTML = `${i + 1} / <strong style="color: rgb(var(--edu-first-accent))">${data.length}</strong>`;

    const node = slideDom.get(i) ?? buildSlide(i);
    $word.replaceChildren(node); // move the cached node; listeners preserved

    $prev.disabled = (i === 0);
    $next.disabled = (i === data.length - 1);
    $checkBtn.disabled = !(i === data.length - 1);
  }
    
  function updateState(id) {    
    let val: string;    
    const el = document.getElementById(id);    
    val = el.getAttribute('value');
    if (!val) return;

    state[id] = val;           
  }

  // CHECK FUNCTION 
  // --------------

  // still need to add logic to stop check in case there are non-completed blocks
  function check() {    
    // We could add a couple state variables to pass the word + wrong letters specifically
    // in the result handler 
    data.forEach((item, i) => {             
      
      const word: string = item.word; 
      const blanks = new Set(item.blanks || []); // numbers
      const r = slideDom.get(i) ?? null;           
      if (!r) return;        

      // for the scoring, we will divide for each word the amout of spot-on letters by the total of blanks.
      // so for example, we get 4 good answers in 6 blanks, we do 4 / 6 which gives 0.66, which we then 
      // sum to the score. We always sum to the score a number between 0 to 1 for each word.
      const all = blanks.size;          
      let good = 0; 
      
      let isCorrect = true;
        
      for (let pos of blanks) {                    
      
        const lp = r.querySelector<HTMLElement>(`#lp-${i}-${pos}`);          
        if (!lp) continue;

        const selected = lp.getAttribute('value')?.trim().toLowerCase();
        if (!selected) { 
          alert('You still have blocks to fill up.'); 
          return; 
        } 
        
        const expected = word[pos - 1].toLowerCase();
        
        lp.setAttribute("data-state", selected === expected ? "correct" : "wrong");       

        if (selected !== expected) isCorrect = false;          
        else good++;
        
      }            
      
      if (!isCorrect) wrong.push(word);
      else correct++;

      score += good / all;      
      
      checked.add(i);
    });               

    finish();
  }  

  // INIT FUNCTION 
  // -------------

  function init() {    
      
    root.innerHTML = baseHTML;    
    
    $word = $('#blanks-single-word');
    $instruction = $('#blanks-single-instruction');
    $progress = $('#blanks-single-progress');
    $prev = $('#blanks-single-prev');
    $next = $('#blanks-single-next');
    $checkBtn = $('#bls-single-check');   
    $checkBtn.disabled = true;        

    // only add the event listener if we are going to use the button
    if (!options.checkBtn) {
      const $container = $("#bls-check-container") as HTMLDivElement;
      $container.style.display = "none";
    } else $checkBtn.addEventListener('click', check);

    $prev.addEventListener('click', () => { idx = Math.max(0, idx-1); renderSlide(idx); });
    $next.addEventListener('click', () => { idx = Math.min(data.length-1, idx+1); renderSlide(idx); });    
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { $next.click(); }
      else if (e.key === 'ArrowLeft') { $prev.click(); }
    });

    renderSlide(idx);
  }

  // RESULT HANDLER BRIDGE
  // ---------------------

  function finish() {

    const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);
    // now, since the score is probably a number between 0 and the total number of 
    // blanks (let's say 4.7 from 6), we just divide 4.7 * 6 and multiply by 100.
    score = (score / total) * 100;
                  
    const result: Result = { 
      detail: { 
        correct: correct, 
        total: total, 
        score: score          
      }, 
      timestamp: timestamp,
      winningEl: getResultEl(score, correct, total, timestamp, wrong)
    };
    
    if (resultHandler) {
        resultHandler(result);
    }    

   // allow only navigation, no correcting the exercise again 
   const container = $("#bls-check-container");
   container.setAttribute("inert", "");
  }

  // Initialize and mount
  // ---------------------

  init();
  mount.appendChild(root);

  return {

    destroy(): void { mount.removeChild(root); },

    check
  }

}

// ===================================================================// 
//                           PARSER and VALIDATOR                     
// ===================================================================//

function extractBlanks(raw: string): { word: string; blanks: number[] } {
  const blanks: number[] = [];
  let word = "";
  let inBlank = false;
  let outIdx = 0;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === "[") { inBlank = true; continue; }
    if (ch === "]") { inBlank = false; continue; }    
    word += ch;
    if (inBlank) blanks.push(outIdx+1);
    outIdx++;
  }
  return { word, blanks };
}


function blanksSingleParser(code: string) {
  const data: BlanksSingleData[] = [];
  // Matches: `# ...\n...;` (semicolon optional)
  const re = /#\s*([^\n]+?)\s*\n\s*([^\n;]+);?/g;
  let m: RegExpExecArray | null;

  while ((m = re.exec(code)) !== null) {
    const hint = m[1].trim();
    const rawWord = m[2].trim();
    const { word, blanks } = extractBlanks(rawWord);
    data.push({ hint, word, blanks });
  }
  return { ok: true, content: data };
}

function BlanksSingleValidator(data: BlanksSingleData): boolean { return true; }


// ===================================================================// 
//                           CONTRACT                        
// ===================================================================//

const exs = `
# A day of the week... 
M[on]da[y];

# A month of the year... 
[De]cem[ber];

# A part of the day
[Mor]n[ing];

# Saturday and Sunday?
We[eken]d

# 100% Frequency
[Al]wa[ys];

# The Cold Season 
[Winter]; 
`;

export const BlanksSingleContract: ContractType = {
    name: "Blanks Single",
    description: "...",        
    version: 1.0,
    parserVersion: 1.0,

    category: "input",
    tags: ["Complete", "...", "Missing Information"],

    usage: [ "Vocabulary Practice", "Guessing Games", "Spelling Practice", "Single-Answer questions"],
    wrong: [ "Multiple possible answers questions"],

    grammarExample: [exs],
    defaultOptions: { shuffle: true, allowRetry: false, ariaLabel: "Blanks Single Exercise" },
    implementation: { renderer: blanksSingleRenderer, parser: blanksSingleParser, validator: BlanksSingleValidator },

    styleTag: 'edu-blanks-single-style',
    html: baseHTML,
    css: baseCSS
}; 

