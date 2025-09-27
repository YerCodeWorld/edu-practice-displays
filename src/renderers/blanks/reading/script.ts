import {
  injectStyle,
  createSection
} from "./../../../utils/utils";

import {
  RendererOptions,
  RendererHandle,
  ContractType
} from '../../types';

import { parserContract } from "../parser";

import baseHTML from './index.html';
import baseCSS from './styles.css';

type BlanksReadingData = {
  instruction?: string; 
  html: string;
  answerMap: Map<string, any>;
};

function blanksReadingRenderer(
  mount: HTMLElement,
  data: BlanksReadingData,
  options: RendererOptions
): RendererHandle {

  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = 'Blanks Reading Exercise'
  } = options; 

  const root = createSection('blanks-reading', ariaLabel);
  injectStyle('blanks-reading-style', baseCSS);    

  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
  r.querySelector<T>(sel);
  
  let $instruction: HTMLElement;
  let $container: HTMLElement;  
  let $finish: HTMLButtonElement;  
    
  function init() {    

    root.innerHTML = baseHTML;
            
    $instruction = $("#blanks-reading-label");
    $container = $("#blanks-reading-container");
    $finish = $("#blanks-reading-check");

    const p = document.createElement('p');
    p.className = 'exercise-paragraph';
    p.ariaLabel = ariaLabel;    
    p.innerHTML = data.html;           

    $instruction.textContent = data.instruction ?? 'Complete the reading';
    $finish.addEventListener('click', () => parserContract.checkAnswers(data.answerMap));
    $container.appendChild(p);
    
  }

  function finish() {}

  init();
  mount.appendChild(root);

  return {

    destroy(): void { mount.removeChild(root); },
  
    styleTag: BlanksReadingContract.styleTag,

    name: BlanksReadingContract.name,

    finish 
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
        parser: parserContract.dslParser,
        validator: parserContract.validator
    },

    styleTag: 'blanks-reading-style',

    html: baseHTML,
    css: baseCSS
}; 

