// BLANKS READING 

import { injectStyle, createSection, getResultEl } from "./../../../utils/utils";
import { RendererOptions, RendererHandle, ContractType, RendererResult } from '../../types';

import { createDSLParser } from "../parser";

import baseHTML from './index.html';
import baseCSS from './styles.css';

type BlanksReadingData = {
  instruction?: string; 
  html: string;
  answerMap: Map<string, any>;
};

const dsl = createDSLParser();

function blanksReadingRenderer(
  mount: HTMLElement,
  data: BlanksReadingData,
  options: RendererOptions
): RendererHandle {

  // BASE COMPONENT UTILITIES 
  // -------------------
   
  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = 'Blanks Reading Exercise',
    checkButtonEnabled = false
  } = options; 

  const root = createSection('blanks-reading', ariaLabel);
  injectStyle('blanks-reading-style', baseCSS);    

  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
  r.querySelector<T>(sel);

  // HTML ELEMENTS 
  // -------------------
  
  let $instruction: HTMLElement;
  let $container: HTMLElement;  
  let $checkButton: HTMLButtonElement;  

  let $p: HTMLParagraphElement | null = document.createElement('p');;

  // CONSTANTS 
  // -------------------
  
  const startTime = Date.now();  

  // VARIABLES 
  // -------------------
  
  let total = 0;
  let correct = 0;
  let wrong: string[] = [];
  let score = 0;

  // INITIALIZER FUNCTION  
  // -------------------
    
  function init() {    
    root.innerHTML = baseHTML;
            
    $instruction = $("#blanks-reading-label");
    $container = $("#blanks-reading-container");
    $checkButton = $("#blanks-reading-check");
    
    if (!options.checkButtonEnabled) {
        $checkButton.style.display = 'none'; 
    }
    
    $p.className = 'exercise-paragraph';
    $p.ariaLabel = ariaLabel;    
    $p.innerHTML = data.html;           

    $instruction.textContent = data.instruction ?? 'Complete the reading';
    $checkButton.addEventListener('click', check);
    $container.appendChild($p);    

  }

  // CHECK FUNCTION  
  // -------------------

  function check() {
    const r = dsl.checkAnswers(data.answerMap, root);

    total = r.total;
    correct = r.correct;
    const correctVal = 100 / total; 

    score += correctVal * correct;

    Object.values(r.details).forEach(val => {            
      if (!val.ok) wrong.push(val.got);      
    });    

    finish();
  }

  // RESULT HANDLER BRIDGE  
  // -------------------

  function finish() {        
    const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);    
              
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

    root.setAttribute("inert", "");
  }

  // Initialize and mount
  // ---------------------
  
  init();
  mount.appendChild(root);

  return {
    destroy(): void { 
      mount.removeChild(root);                 
    },
    
    check
  }

}

function BlanksReadingValidator(data: BlanksReadingData): boolean { return true; }

export const BlanksReadingContract: ContractType = {
    name: "Blanks Reading",
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
@img(https://picsum.photos/seed/city/640/360 | A morning street)

It was a @tx(sunny | cloudy) morning when Anna left her apartment.  
She walked exactly @nm(200 | 250 | 300) meters to the café.

@img(https://picsum.photos/seed/cafe/640/360 | Coffee shop)

Inside, she ordered a @sl([coffee] | tea | juice)  
and sat by the window with her @tx(book).

She spent @nm(1..2) hours there,  
feeling @tx(relaxed | inspired | tired).
                
     `
    ],

    defaultOptions: {
        shuffle: true,
        allowRetry: false,
        ariaLabel: "Blanks Reading Exercise"
    },

    implementation: {
        renderer: blanksReadingRenderer,
        parser: dsl.parse,
        validator: dsl.validateData
    },

    styleTag: 'blanks-reading-style',

    html: baseHTML,
    css: baseCSS
}; 

