import {
  injectStyle,
  createSection
} from "./../../../utils/utils";

import {
  RendererOptions,
  RendererHandle,
  ContractType
} from '../../types';

import baseHTML from './index.html';
import baseCSS from './styles.css';

type BlanksSingleData = {
  hint: string;
  word: string;
  blanks: number[];
};

function blanksSingleRenderer(
  mount: HTMLElement,
  data: BlanksSingleData[],
  options: RendererOptions
): RendererHandle {

  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = 'Blanks Single Exercise'
  } = options; 

  const root = createSection('blanks-single', ariaLabel);
  injectStyle('edu-blanks-single-style', baseCSS);    
  
  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
    r.querySelector<T>(sel);

  let $word: HTMLElement;
  let $instruction: HTMLElement;
  let $progress: HTMLElement;
  let $prev: HTMLButtonElement;
  let $next: HTMLButtonElement;
  let $reveal: HTMLButtonElement;   

  let state = {};    
  let checked = [];    
  // let correct = 0;    
  let idx = 0;

  function renderSlide(i) {
  
      const item: BlanksSingleData = data[i];      
      
      const answer = [...item.word];          
      const blanks = new Set(item.blanks || []); // 1-based indices     

      $instruction.textContent = item.hint;
      $progress.innerHTML = `${i+1} / <strong style="color: rgb(var(--edu-first-accent))">${data.length}</strong>`;
      $word.innerHTML = '';

      for (let pos = 1; pos <= answer.length; pos++) {
      
        const ch = answer[pos-1];

        if (blanks.has(pos)) {
        
          const lp = document.createElement('letter-picker');          
          lp.setAttribute('mode','box');
          lp.setAttribute('placeholder','💬');
          lp.dataset.pos = String(pos);
          lp.id = `lp-${i}-${pos}`;

          if (Object.keys(state).includes(lp.id)) {            
            lp.setAttribute('value', state[lp.id]);            
          }
          
          lp.addEventListener('change', () => updateState(lp.id));

          $word.appendChild(lp);
          
        } else {
          const div = document.createElement('div');
          div.className = 'letter';
          div.textContent = ch;
          $word.appendChild(div);
        }
        
      }

      // this keeps the correct/wrong state updated
      if (checked.includes(i)) {        
        checkSlide(idx)
      };      

      $prev.disabled = (i === 0);
      $next.disabled = (i === data.length - 1);
  }

  // keep the check functionality only after all blanks have been completed 
  function checkCompleted(i) {
    
      const item = data[i];
      const word = item.word; 
      const blanks = new Set(item.blanks || []);        

      let isCompleted = true;

      for (let pos of blanks){      
      
        const lp = $(`#lp-${i}-${pos}`);        
        
        const selected = lp.getAttribute('value');
        
        if (!selected) isCompleted = false;                
        
      }

      $reveal.disabled = !isCompleted;
      
  }
  
  function updateState(id) {    
  
    let val: string;    
    const el = document.getElementById(id);    
    val = el.getAttribute('value');
    if (!val) return;

    state[id] = val;       

    checkCompleted(idx);
  }

  function checkSlide(i: number) {
  
      const item: BlanksSingleData = data[i];
      const word: string = item.word; 
      const blanks = new Set(item.blanks || []); // numbers
        
      for (let pos of blanks){      
      
        const lp = document.getElementById(`lp-${i}-${pos}`);
        const selected = lp.getAttribute('value');
        if (!selected) continue;        
        
        if (selected.toLowerCase().trim() === word[pos-1].toLowerCase()) {          
          lp.setAttribute('data-state', 'correct');          
        } else {
          lp.setAttribute('data-state', 'wrong');
        }        
        
      }      
    
      checked.push(i);
  }

  function init() {    
      
    root.innerHTML = baseHTML;    
    
    $word = $('#blanks-single-word');
    $instruction = $('#blanks-single-instruction');
    $progress = $('#blanks-single-progress');
    $prev = $('#blanks-single-prev');
    $next = $('#blanks-single-next');
    $reveal = $('#blanks-single-reveal');   
    $reveal.disabled = true;         

    $prev.addEventListener('click', () => { idx = Math.max(0, idx-1); renderSlide(idx); });
    $next.addEventListener('click', () => { idx = Math.min(data.length-1, idx+1); renderSlide(idx); });
    $reveal.addEventListener('click', () => checkSlide(idx));
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { $next.click(); }
      else if (e.key === 'ArrowLeft') { $prev.click(); }
    });

    renderSlide(idx);
  }

  function finish() {}

  init();
  mount.appendChild(root);

  return {

    destroy(): void { mount.removeChild(root); },
  
    styleTag: BlanksSingleContract.styleTag,

    name: BlanksSingleContract.name,

    finish 
  }

}

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

export const BlanksSingleContract: ContractType = {
    name: "Blanks Single",
    description: "...",
        
    version: 1.0,
    parserVersion: 1.0,

    category: "input",
    tags: ["Complete", "...", "Missing Information"],

    usage: [
        "...",
        "...",
        "..."
    ],
    wrong: [
        "...",
        "...",
        "..."
    ],

    grammarExample: [
      `
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
       `
    ],

    defaultOptions: {
        shuffle: true,
        allowRetry: false,
        ariaLabel: "Manual Input Exercise"
    },

    implementation: {
        renderer: blanksSingleRenderer,
        parser: blanksSingleParser,
        validator: BlanksSingleValidator
    },

    html: baseHTML,
    css: baseCSS
}; 

