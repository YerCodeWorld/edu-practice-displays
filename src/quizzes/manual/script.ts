// MANUAL

import { injectStyle, createSection, getResultEl } from '../../utils/utils';
import { RendererOptions, RendererHandle, ContractType, Result } from '../types';

import baseHTML from './index.html';
import baseCSS from './style.css';

interface ManualData {
  $instruction: string;
  words: string[]
}

const styleTag = 'edu-manual-style';

// ===================================================================// 
//                           RENDERER                        
// ===================================================================//
function manualExerciseRenderer(

  mount: HTMLElement,
  data: ManualData,
  options: RendererOptions
  
): RendererHandle {

  // BASE COMPONENT UTILITIES 
  // ------------------------
  const {    
    allowRetry = true, 
    resultHandler,
    ariaLabel = 'Manual Exercise',
    checkBtn = true
  } = options;  

  const root = createSection('edu-manual', ariaLabel);      
  injectStyle(styleTag, baseCSS);    

  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
    r.querySelector<T>(sel);

  // HTML ELEMENTS 
  // -------------
  let $chips: HTMLElement; // section 
  let $input: HTMLInputElement;
  let $addBtn: HTMLButtonElement;
  let $checkBtn: HTMLButtonElement;
  let $counter: HTMLElement; // small 
  let $instruction: HTMLElement;
  let $containerMessage: HTMLParagraphElement;

  // CONSTANTS 
  // ---------     
  const total = data.words.length;
  const startTime = Date.now();
  
  const palette: string[] = ["#8b5cf6","#d946ef","#9333ea","#facc15","#c084fc","#a855f7","#eab308","#f97316","#14b8a6","#f59e0b"];
  const answers: string[] = data.words;  

  const escapeHtml = (s: string): string => { return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }  

  // VARIABLES 
  // ---------   
  let correct = 0;
  let wrong: string[] = [];  
  let isEmpty = true;

  // INITIALIZER 
  // -----------   
  function init() {
    root.innerHTML = baseHTML; 

    // assign 
    $input = $('#manual-input');
    $chips = $('#manual-chips') as HTMLElement;            
    $addBtn = $('#manual-add');
    $checkBtn = $('#manual-check');
    $instruction = $('#manual-instruction');
    $containerMessage = $("#manual-container-message");    
    $counter = $('#manual-counter');

    const $btnContainer = $("#manual-check-container") as HTMLElement;
    if (!options.checkBtn) $btnContainer.style.display = "none";        

    $instruction.textContent = data.instruction ?? 'No Instruction';

    /* event listeners */
    $input.addEventListener('keydown', e => { if (e.key === 'Enter') addChip(); });    
    $addBtn.addEventListener('click', addChip);
    $checkBtn.addEventListener('click', check);    
    $chips.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;             
      if (t.matches('button[data-x]')) { t.closest('.chip')?.remove(); updateCounter(); }            
      // count coded-in p
      if ($chips.children.length === 1) {        
        isEmpty = true;
        $containerMessage.style.display = "flex";
      };
    });
    
    updateCounter();
  }

  // ---------------------------
  // RENDERER-SPECIFIC FUNCTIONS 
  // ---------------------------
  
  function updateCounter(): void {
      // reduce coded-in p
      $counter.textContent = `${$chips.children.length - 1}/${total} added`;
  }    

  /*
   *
   *
   */
  function addChip(): void {
      
    const raw = $input.value.trim();
    if (!raw) return; // ->    
    // avoid changing state before checking if word is empty 
    if (isEmpty) {
      $containerMessage.style.display = "none";
      isEmpty = false;
    };
    
    if (($chips.children.length - 1) >= total) return pulse($input);

    // const exists = [...$chips.children].some(ch => ch.dataset.value?.toLowerCase() === raw.toLowerCase());
    const exists = Array.from($chips.children as HTMLCollectionOf<HTMLElement>)
      .some(ch => ch.dataset.value?.toLowerCase() === raw.toLowerCase());
      
    if (exists) return pulse($input);

    const chip = document.createElement('label');
    chip.className = 'chip';
    chip.dataset.value = raw;
    chip.style.color = palette[Math.floor(Math.random()*palette.length)];
    chip.innerHTML = `<span class="chip-span">${escapeHtml(raw)}</span><button data-x aria-label="Remove">✕</button>`;
    $chips.appendChild(chip);
    $input.value = '';
    updateCounter();
    chip.scrollIntoView({behavior:'smooth', inline:'end', block:'nearest'});
  }

  /* Fire animation utilility     
   * I should try to create a more broad helper in the utils instead
   */
  function pulse(el) {
    el.style.transition = 'box-shadow .15s ease';
    el.style.boxShadow = '0 0 0 6px rgba(239,68,68,.25)';
    setTimeout(() => el.style.boxShadow = 'none', 160);
  }

  // CHECK FUNCTION 
  // --------------
  function check(): void {

      const amount = $chips.children.length - 1;
      
      if (amount < total) {
        $counter.textContent = `You are still missing ${total - amount} words`; 
        $counter.style.color = "rgb(var(--edu-error))";

        root.classList.remove("shake-animation");
        void root.offsetWidth;
        root.classList.add("shake-animation");
        
        return;      
      }
    
      [...$chips.children].forEach((child: HTMLElement, idx) => {
        if (idx === 0) return; 
        const answer = child.textContent.slice(0, -1).toLowerCase();
        const isCorrect = [...data.words.map(w => w.toLowerCase())].includes(answer);
        child.dataset.state = isCorrect ? "correct" : "wrong";
        if (isCorrect) correct++;
        else wrong.push(answer);
      });

      const allCorrect = correct === total;
      $counter.textContent = allCorrect ? "Well done!" : `Oops... ${correct}/${total}`;
      $counter.style.color = allCorrect ? "rgb(var(--edu-success))" : "rgb(var(--edu-error))";
    
      root.setAttribute("inert", "");
      finish();
  }  

  // RESULT HANDLER BRIDGE
  // ---------------------
  function finish() {     
      const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);
      const score = (correct / total) * 100;
                
      const result: Result = { 
        detail: { correct: correct, total: total, score: score }, 
        timestamp: timestamp,
        winningEl: getResultEl(score, correct, total, timestamp, wrong)
      };
      
      if (resultHandler) { resultHandler(result); }
  }

  // Initialize and Mount 
  // --------------------
  init();
  mount.appendChild(root);  

  return {
    destroy(): void { mount.removeChild(root); },
    check 
  }
}

// ===================================================================// 
//                           PARSER                        
// ===================================================================//

function parseManual(code: string) {  

  const lines = code.split("\n").map(l => l.trim()).filter(Boolean);
  let instruction = "";
  const words: string[] = [];
  for (const line of lines) {
    if (line.startsWith("#")) {
      instruction = line.replace(/^#\s*/, "");
    } else {      
      line.split(";")
        .map(w => w.trim())
        .filter(Boolean)
        .forEach(w => words.push(w));
    }
  }  

  return {ok: true, content: { instruction, words } };
}

function validateManual(data: ManualData): boolean { return true; }

// ===================================================================// 
//                           CONTRACT                         
// ===================================================================//

const exs = [`
# Enter the 7 days of the week
Monday; Tuesday; Wednesday; Thursday; Friday; Saturday; Sunday;
`];

export const ManualContract: ContractType = {
    name: "Manual",
    description: "...",        
    version: 1.0,
    parserVersion: 1.0,

    category: "open",
    tags: ["Manual Work", "...", "No help"],

    usage: ["...", "..."],
    wrong: ["...", "..."],

    grammarExample: [exs[0]],

    defaultOptions: { shuffle: true, allowRetry: false, ariaLabel: "Manual Input Exercise" },
    implementation: { renderer: manualExerciseRenderer, parser: parseManual, validator: validateManual },

    styleTag: styleTag,  
    html: baseHTML,
    css: baseCSS
}; 
