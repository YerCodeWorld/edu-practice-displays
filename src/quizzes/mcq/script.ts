// MCQ

import {
  injectStyle,
  createSection,
  extractTitleAndStrip,
  takeOptionalLabel,
  splitBlocksOutsideParens,
  extractImage,
  splitPipes,
  dedupe, 
  shuffle,
  getResultEl,
  EduMCQData,
} from "../../utils/utils";

import { RendererOptions, RendererHandle, ContractType, RendererResult } from '../types';

import baseHTML from './index.html';
import baseCSS from './styles.css';

interface McqFeedback {
  total: number;
  correct: number;
  wrong: string[];
  missed: string[];
}

interface EduMcqElement extends HTMLElement {
  data: EduMCQData;
  showFeedback(): McqFeedback;
}

interface MCQRendererData {
  instruction: string;
  blocks: Array<EduMCQData>;  
};

// ===================================================================// 
//                           MCQ RENDERER                        
// ===================================================================//
function mcqRenderer(

  mount: HTMLElement,
  data: MCQRendererData,
  options: RendererOptions
  
): RendererHandle {

  // base component logic 
  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = '',
    checkBtn = true
  } = options; 

  const root = createSection('edu-mcq-root', ariaLabel);
  injectStyle('edu-mcq-style', baseCSS);    

  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
    r.querySelector<T>(sel);

  // html elements 
  let $title: HTMLHeadingElement;
  let $container: HTMLElement;  
  let $check: HTMLButtonElement;

  // constants 
  const blocks = shuffle(data.blocks);
  const total = data.blocks.length;
  const startTime = Date.now();

  // variables   
  let correct = 0;
  let score: number = 0;

  // let wrong: Record<string, string[]> = {}; 
  let wrong: string[] = [];
  let ids: string[] = [];  
    
  function init() {    

    root.innerHTML = baseHTML;

    $title = $("#mcq-title");
    $container = $("#mcq-container");
    $check = $("#mcq-check");

    if (!options.checkBtn) $check.style.display = "none";

    render();
    $check.addEventListener('click', check);
  }

  function render() {      
    $title.textContent = data.instruction ?? 'No instructions';  
    
    blocks.forEach((block, idx) => {
      const el = document.createElement("edu-mcq") as EduMcqElement;
      el.id = `mcq-pos-${idx}`;      
      el.data = {
        img: block.img ?? '',
        question: block.question ?? '',
        hint: block.hint ?? '',
        options: block.options ?? [],
        correctOptions: block.correctOptions ?? [],        
      }    
      ids.push(el.id);
      $container.append(el);
    });   
  }

  // correct screen 
  function check() {          
  
    ids.forEach(id => {
    
      const el = root.querySelector(`#${id}`) as EduMcqElement;      
      if (!el) return;       
      const r = el.showFeedback();          

      const points = r.correct / r.total;
      score += points;
      if (points === 1) correct++; 

      r.wrong.forEach(w => {
        wrong.push(w); 
      });
      
    });  
    
    root.setAttribute('inert', '');
    finish();
  }

  function finish() {

    const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);
    score = (score / total) * 100;

    const result: RendererResult = { 
      detail: { 
        correct: correct, 
        total: total, 
        score: score          
      }, 
      timestamp: timestamp,
      // create a better showcase that takes an object (string, string[]) to detail
      // wrong answers for each question instead 
      winningEl: getResultEl(score, correct, total, timestamp, wrong)
    };
    
    if (resultHandler) {
        resultHandler(result);
    }
  
  }

  // Initialize and mount to parent element 
  // --------------------------------------
  init();
  mount.appendChild(root);
  
  return {
    destroy(): void { mount.removeChild(root); },    
    check
  }

}

// ===================================================================// 
//                           MCQ PARSER                       
// ===================================================================//

function mcqParser(code: string): { ok: boolean, content: MCQRendererData } {

  const { title, rest } = extractTitleAndStrip(code);
  const rawBlocks = splitBlocksOutsideParens(rest);
  
  let out: EduMCQData[] = [];
  let carryImg: string | undefined; 

  for (let raw of rawBlocks) {

    if (!raw) continue;

    const { label, cleaned: noLabel } = takeOptionalLabel(raw);
    const { img, cleaned: noImg } = extractImage(noLabel); 
    if (img  && !/[=?]/.test(noImg)) {
      carryImg = img;
      continue 
    }

    const working = noImg.trim();

    const eqIdx = working.indexOf("=");
    if (eqIdx === -1) {
      continue;
    }

    const question = working.slice(0, eqIdx).trim().replace(/\s+/g, " ");
    const afterEq = working.slice(eqIdx + 1).trim();

    const bracketMatches = [...afterEq.matchAll(/\[([^\]]+)\]/g)];
    const correct = dedupe(
      bracketMatches.flatMap(m => splitPipes(m[1]))
    );

    const cleaned = afterEq.replace(/\[|\]/g, "");
    const allOptions = dedupe(splitPipes(cleaned));

    const options = shuffle(allOptions);

    out.push({
      img: img ?? carryImg,
      question,
      hint: label,
      options,
      correctOptions: correct
    });

    carryImg = undefined;
  
  }
  
  return { ok: true, content: { instruction: title, blocks: out } }
}

function mcqValidator(data: MCQRendererData): boolean { return true; }

// ===================================================================// 
//                           PARSER                      
// ===================================================================//

const exs = `
@TITLE = Complete the coding questions; 

<https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3Gkx_Z-wbYJRu5xdneezYCSvDO5pbfJOrDw&s>
# Think: compilers or interpreters exist for them
Which of this are programming languages? = 
CSS | HTML | QML | [Typescript | Python];

What language of the following is best for micro-controllers? =
C# | Java | Lua | [C | C++]; 

# Well... The place you are on!
What is Javascript best for? = 
OS development | Desktop Linux Applications | [Web Development];

What is one markup language in the options? = 
[XAML] | CSS | Rust | React;  
`;

export const MCQContract: ContractType = {
    name: "Multiple Choice",
    description: "...",
        
    version: 1.0,
    parserVersion: 1.0,

    category: "",
    tags: ["", "", ""],

    usage: ["...", "..."],
    wrong: ["...", "..."],

    grammarExample: [exs],

    defaultOptions: { shuffle: true, allowRetry: false, ariaLabel: "MCQ Exercise" },
    implementation: { renderer: mcqRenderer, parser: mcqParser, validator: mcqValidator   },

    styleTag: 'edu-mcq-style',
    html: baseHTML,
    css: baseCSS
}; 

