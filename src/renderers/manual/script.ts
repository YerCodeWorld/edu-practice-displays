import {
  injectStyle,  
  createSection
} from '../../utils/utils';

import baseHTML from './index.html';
import baseCSS from './style.css';

import {
  QuizTheme,
  Themes,
  RendererOptions,
  RendererHandle,
  ContractType
} from '../types';

interface ManualData {
  instruction: string;
  words: string[]
}

const styleTag = 'edu-manual-style';

function manualExerciseRenderer(
  mount: HTMLElement,
  data: ManualData,
  options: RendererOptions
): RendererHandle {

  const {    
    allowRetry = true, 
    resultHandler,
    ariaLabel = 'Manual Exercise'
  } = options;  

  const root = createSection('edu-manual', ariaLabel);      
  injectStyle(styleTag, baseCSS);  

  console.log(data);
  const MAX = data.words.length;   

  let chips: HTMLElement; // section 
  let input: HTMLInputElement;
  let addBtn: HTMLButtonElement;
  let checkBtn: HTMLButtonElement;
  let counter: HTMLElement; // small 
  let instruction: HTMLElement;
  
  const palette: string[] = ["#8b5cf6","#d946ef","#9333ea","#facc15","#c084fc","#a855f7","#eab308","#f97316","#14b8a6","#f59e0b"];
  const answers: string[] = data.words;
  
  function init() {
    root.innerHTML = baseHTML; 

    const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
      r.querySelector<T>(sel);

    input = $('#manual-input');
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') addChip();
    });

    chips = $('#manual-chips') as HTMLElement;
    // witchery, idk, it works and ts doesnt cry 
    chips.addEventListener('click', (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;             

      if (t.matches('button[data-x]')) {
        t.closest('.chip')?.remove();                
        updateCounter();
      }
    });
    
    addBtn = $('#manual-add');
    addBtn.addEventListener('click', addChip);
    
    checkBtn = $('#manual-check');
    checkBtn.addEventListener('click', checkAnswers);

    instruction = $('#manual-instruction');
    instruction.textContent = data.instruction ?? 'No Instruction';
    
    counter = $('#manual-counter');

    updateCounter();
  }

  function updateCounter(): void {
      counter.textContent = `${chips.children.length}/${MAX} added`;
  }    
  
  function addChip(): void {
    const raw = input.value.trim();
    if (!raw) return;
    if (chips.children.length >= MAX) return pulse(input);

    // const exists = [...chips.children].some(ch => ch.dataset.value?.toLowerCase() === raw.toLowerCase());
    const exists = Array.from(chips.children as HTMLCollectionOf<HTMLElement>)
      .some(ch => ch.dataset.value?.toLowerCase() === raw.toLowerCase());
      
    if (exists) return pulse(input);

    const chip = document.createElement('label');
    chip.className = 'chip';
    chip.dataset.value = raw;
    chip.style.color = palette[Math.floor(Math.random()*palette.length)];
    chip.innerHTML = `<span>${escapeHtml(raw)}</span><button data-x aria-label="Remove">✕</button>`;
    chips.appendChild(chip);
    input.value = '';
    updateCounter();
    chip.scrollIntoView({behavior:'smooth', inline:'end', block:'nearest'});
  }
  
  function checkAnswers(): void {}  

  function pulse(el){
    el.style.transition = 'box-shadow .15s ease';
    el.style.boxShadow = '0 0 0 6px rgba(239,68,68,.25)';
    setTimeout(() => el.style.boxShadow = 'none', 160);
  }

  function escapeHtml(s: string): string {
    return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }
  
  function finish() {}

  init();
  mount.appendChild(root);  

  return {

    destroy(): void {
      mount.removeChild(root);
    },

    styleTag: styleTag, 

    name: 'Manual',

    finish
  }
}

function parseManual(input: string) {
  const lines = input
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

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

export const ManualContract: ContractType = {
    name: "Manual",
    description: "...",
        
    version: 1.0,
    parserVersion: 1.0,

    category: "open",
    tags: ["Manual Work", "...", "No help"],

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
# Enter the 7 days of the week
Monday;
Tuesday;
Wednesday;
Thursday;
Friday;
Saturday;
Sunday;
       `
    ],

    defaultOptions: {
        shuffle: true,
        allowRetry: false,
        ariaLabel: "Manual Input Exercise"
    },

    implementation: {
        renderer: manualExerciseRenderer,
        parser: parseManual,
        validator: validateManual
    },

    styleTag: styleTag,  

    html: baseHTML,
    css: baseCSS
}; 


