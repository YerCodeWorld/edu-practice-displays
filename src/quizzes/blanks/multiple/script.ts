// Blanks Multiple 

import {
  injectStyle, 
  createSection, 
  extractTitleAndStrip, 
  takeOptionalLabel, 
  splitBlocksOutsideParens, 
  getResultEl
} from "./../../../utils/utils";

import { RendererOptions, RendererHandle, ContractType, RendererResult } from '../../types';
import { createDSLParser } from "../parser";

import baseHTML from './index.html';
import baseCSS from './styles.css';

type BlanksMultipleData = {
  instruction?: string; 
  blocks: Array<{
    label: string; 
    html: string;
    answerMap: Map<string, any>;
  }>  
};

const dsl = createDSLParser();

// ===================================================================// 
//                           RENDERER                       
// ===================================================================//

function blanksMultipleRenderer(

  mount: HTMLElement,
  data: BlanksMultipleData,
  options: RendererOptions
  
): RendererHandle {

  // BASE COMPONENT UTILITIES 
  // ---------------------  
  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = 'Blanks Multiple Exercise'
  } = options; 

  const root = createSection('blanks-multiple', ariaLabel);
  injectStyle('blanks-multiple-style', baseCSS);    

  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
  r.querySelector<T>(sel);

  // HTML ELEMENTS 
  // ---------------------
  
  let $title: HTMLHeadingElement;
  let $instruction: HTMLParagraphElement;    
  let $container: HTMLElement;    
  let $finish: HTMLButtonElement;  

  // CONSTANTS 
  // ---------------------
  const startTime = Date.now();
  const total = data.blocks.length;

  // VARIABLES  
  // ---------------------
  let correct = 0;
  let score = 0;
  let wrong: string[] = [];

  // INITIALIZER FUNCTION 
  // ---------------------

  function init() {    

    root.innerHTML = baseHTML;

    $title = $("#bm-title-id");
    $instruction = $("#bm-instruction-id");        
    $container = $("#bm-main-id");
    $finish = $("#bm-check-id");

    $title.textContent = data.instruction ?? 'Fill Blanks Exercise';        
    createBlocks();

    $finish.addEventListener('click', check);
    
  }
    
  function createBlocks() {    
  
    const blocks = data.blocks; 

    blocks.forEach(block => {
    
      const p = document.createElement("p");
      p.className = "bm-block";      
      
      const html = block.label ? block.html + `<span class="bm-badge">${block.label}</span>` : block.html;                 
      p.innerHTML = html;      
      
      $container.appendChild(p);
      
    });    
    
  }

  // CHECK FUNCTION 
  // ---------------------

  function check() {        
  
    data.blocks.forEach(block => {
    
      const r = dsl.checkAnswers(block.answerMap);             

      if (r.correct === r.total) correct++;

      console.log(`
        THE AMOUNT FOR BLOCK ${block.label} is:

        CORRECT: ${r.correct}
        TOTAL: ${r.total}

        CORRECT ANSWER VALUE (100 / total): ${100 / r.total}
        POINTS FOR THIS BLOCK: ${((100 / r.total) * r.correct) / 100}
        
      `);                  

      // convert to decimal 
      score += r.correct / r.total * 100;

      Object.values(r.details).forEach(val => {            
        if (!val.ok) wrong.push(val.got);      
      });

    });    
    
    finish();
  }

  // RESULT HANDLER BRIDGE
  // ---------------------
  
  function finish() {

    const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);
    score = score / total;    
                  
    const result: RendererResult = { 
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

   // remove interactivity     
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
//                           PARSER                        
// ===================================================================//

function blanksMultipleParser(code: string, parse = dsl.parse): {
  ok: boolean,
  content?: BlanksMultipleData,
  errors?: []
} {
  const { title, rest } = extractTitleAndStrip(code);
  const rawBlocks = splitBlocksOutsideParens(rest);

  const blocks: BlanksMultipleData["blocks"] = [];

  for (const raw of rawBlocks) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const { label, cleaned } = takeOptionalLabel(trimmed);

    const r = parse(cleaned);
    if (!r || !r.ok) continue;

    blocks.push({
      label,
      html: r.content.html,
      answerMap: r.content.answerMap
    });
  }

  return { ok: true, content: { instruction: title, blocks: blocks } }
}

function blanksMultipleValidator(data: BlanksMultipleData): boolean { return true; }

// ===================================================================// 
//                           CONTRACT                        
// ===================================================================//

const example = `
@TITLE = Fill the blanks;

# gerund
I am @tx(going) to school tomorrow, I come back at 04:00 @sl([pm]|am);

The days of the week are @nm(7), but you know we live as if they were 10!;

# Look at the answer first
A: What is @tx(her) name?
B: Her name is Maria; 
`;

export const BlanksMultipleContract: ContractType = {
    name: "Blanks Multiple",
    description: "...",
        
    version: 1.0,
    parserVersion: 1.0,

    category: "input",
    tags: ["Complete", "...", "Missing Information"],

    usage: [ "...", "..."],
    wrong: ["...", "..."],

    grammarExample: [example],

    defaultOptions: {
        shuffle: true,
        allowRetry: false,
        ariaLabel: "Blanks Multiple Exercise"
    },

    implementation: {
        renderer: blanksMultipleRenderer,
        parser: blanksMultipleParser,
        validator: blanksMultipleValidator
    },

    styleTag: 'blanks-Multiple-style',

    html: baseHTML,
    css: baseCSS
}; 

