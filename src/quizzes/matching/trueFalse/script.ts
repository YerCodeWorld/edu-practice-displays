// TRUE/FALSE 

import { injectStyle, shuffle, createSection, getResultEl } from "../../../utils/utils";
import { RendererOptions, RendererHandle, ContractType, RendererResult } from '../../types';

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

type trueFalseData = Array<{
    q: string,
    a: string
}>;

// ===================================================================// 
//                           RENDERER                        
// ===================================================================//
export function trueFalseRenderer(

    mount: HTMLElement,
    data: trueFalseData,
    options: RendererOptions

): RendererHandle {

    // BASE COMPONENT DATA 
    // -------------------
    const {        
        shuffle: doShuffle = true,
        allowRetry = false,
        resultHandler,
        ariaLabel = "True False Exercise",
        checkButtonEnabled = false
    } = options;

    const root = createSection("tnf-root", ariaLabel);
    injectStyle("tnf-style", baseCSS);    

    
    const questions = shuffle(data);

    // variables     
    let answerMap: Record<string, string> = {};
    // prefilled array
    let picks = Array(data.length).fill(null);    
    let activeIndex = -1;

    let correct = 0;    
    let score = 0;
    let wrong: string[] = [];    

    // constants 
    const total = data.length;
    const startTime = Date.now();

    // elements   
    let $list: HTMLElement;
    let $picker: HTMLDialogElement;
    let $checkAll: HTMLButtonElement;
    let $dialogLabel: HTMLElement;             

    // converters 
    const label = v => v === 'T' ? 'True' : v === 'F' ? 'False' : 'Neutral';    
    const conversion = v =>
    v === 'True' ? 'T':
    v === 'False' ? 'F' :
    v === 'Neutral' ? 'N' :
    '';

    function disableAll() { root.setAttribute("inert", ""); };

    // INITIALIZER FUNCTION 
    // --------------------
    function init() {
      root.innerHTML = baseHTML;

      $list = root.querySelector("#list");
      $picker = root.querySelector("#picker");
      $checkAll = root.querySelector("#checkAll");
      if (!options.checkButtonEnabled) $checkAll.style.display = "none";
      
      $dialogLabel = root.querySelector("#dialog-text");

      $picker.addEventListener('close', () => {
          const val = $picker.returnValue;
          if (!val || activeIndex < 0) return;
          picks[activeIndex] = val;
          const row = $list.querySelector(`.item[data-index="${activeIndex}"]`);
          const chip = row.querySelector('.chip');
          chip.className = 'chip ' + val.toLowerCase();
          chip.textContent = label(val);
          activeIndex = -1;
      });

      data.forEach(item => {
          console.log(item);
          answerMap[item.q] = item.a;
      });

      $checkAll.addEventListener("click", () => {
          check();
      });

      renderQuestions();

    }

    function renderQuestions() {

        $list.innerHTML = '';
        questions.forEach((row, i) => {

            const el = document.createElement("div");
            el.className = "item";
            el.dataset.index = i.toString();

            const chip = document.createElement("span");
            chip.className = 'chip ' + (picks[i]?.toLowerCase() || '');
            chip.textContent = picks[i] ?? 'Choose';

            const prompt = document.createElement("p");
            prompt.className = "prompt";
            prompt.textContent = row.q;

            el.addEventListener('click', e => {
                e.stopPropagation();
                activeIndex = i;               
                $dialogLabel.textContent = row.q; 
                $picker.showModal();
            })

            el.append(prompt, chip);
            $list.appendChild(el);

        });
    }
    
    function check() {

      const correctValue = 100 / total;

      Array.from($list.children).forEach(child => {

        const question: string = child.querySelector("p").textContent;
        const pick: string = conversion(child.querySelector("span").textContent);        
                
        if (answerMap[question] === pick) {          
          correct++;          
          score += correctValue;
          child.classList.add("correct");          
        } else {
          child.classList.add("wrong");          
          wrong.push(question);
        }                        
      });
      
      if (correct === total) {
          root.classList.add("success-jump");
      }

      finish();      
    }

    function finish() {

      const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);      

      const result: RendererResult = { 
        detail: { 
          correct: correct, 
          total: total, 
          score: score          
        }, 
        timestamp: timestamp,
        // ...
        winningEl: getResultEl(score, correct, total, timestamp, wrong)
      };

      root.setAttribute("inert", "true");
      
      if (resultHandler) {
          resultHandler(result);
      }

    }

    // initialize and mount to parent element 
    init();
    mount.appendChild(root);

    return { destroy(): void { mount.removeChild(root); }, check }
}

// ===================================================================// 
//                           PARSER                         
// ===================================================================//

export function parseTrueFalse(
    code: string
): { ok: boolean, content?: trueFalseData, errors?: string[] } {

    let data: trueFalseData = [];
    let errors: string[] = [];    
    
    if (!code) {
        errors.push("No code provided");
        return { ok: false, errors }; 
    }; 

    if (!code.includes(";")) {
        errors.push("No ';' found in the code (which indicate matches separation)");
        return { ok: false, errors }; 
    }

    const matches = code.trim().split(";").map(m => m.trim()).filter(Boolean);;

    for (let i = 0; i < matches.length; i++) {

        const match  = matches[i];
        
        if (!match.includes("=") || !match.includes("::")) {
            errors.push(`Match ${i} (${match}) is invalid. No separator provided. `);
        }

        let sep = match.includes("=") ? '=' : '::'; 
        const [left, rightRaw] = match.split(sep).map(p => p.trim());
        const right = rightRaw.toUpperCase(); 
 
        // true | false | neutral support 
        const normalize = right[0].toUpperCase() === "T" ? 'T' :
            right[0].toUpperCase() === "F" ? 'F' : 'N';          

        data.push({
            q: left,
            a: normalize 
        });       
    }    
    
    return { ok: true, content: data }; 
}

export function validateTrueFalse(data: trueFalseData): boolean {

    let errors = [];
    const validRightValues = ["t", "f", "n", "true", "false", "neutral"];

    if (data.length < 4) {
        errors.push(`
            Exercise needs at least 4 valid matches, found ${data.length}
        `);
    }

    for (let i = 0; i < data.length; i++) {

        const match = data[i];
        
        // These is not handled in the parser
        
        if (match.q.length > 40) {
            errors.push(`
                The question for match ${i} is too long. This component is not suitable for 
                questions with a large length of characthers. 
            `); 
        }

        if (match.q.length < 10) {
            errors.push(`
                The question for match ${i} is too short. Are you sure your sentence is a proper
                statement user can determine validity from? 
            `); 
        }
        
        if (!validRightValues.includes(match.a)) {
            errors.push(`Match ${i} (${match}) has not any valid values. \nValid values: \n${validRightValues}.`);                         
        }
        
    }

    // should probably be checked like 
    // const isValid = errors.length === 0; 
    return errors.length === 0; 
}

// ===================================================================// 
//                           RENDERER                        
// ===================================================================//

const exs = [
`
The sun is really big = t;
Water is good for humans = t;
The earth does not rotate = f;
Love is good = n;
`, 
`
Money is the most important thing in life :: neutral;
Graduating from university ensures a good life :: false;
Not having friends is a good thing :: neutral;
`]

// Helping others is generally good :: true;

export const TrueFalseContract: ContractType = {

    name: "True, False or Neutral",
    description: "A nicer version of a true/false exercise, with cute styling and a neutral option.",
        
    version: 1.0,
    parserVersion: 1.0,

    category: "logic",
    tags: ["true/false", "neutral", "binary-choice"],

    usage: [
        "Non-subjective statements students must classify",
        "Feedback collection from reading, audio, or pictures",
        "Survey-style personal opinion questions"
    ],
    wrong: [
        "Super long questions (use a reading exercise with TNF plugin instead)",
        "Statements without clear truth value",
        "Ignoring cultural or subjective context"
    ],

    grammarExample: exs,

    defaultOptions: { shuffle: true, allowRetry: false, ariaLabel: "True False Exercise" },
    implementation: { renderer: trueFalseRenderer, parser: parseTrueFalse, validator: validateTrueFalse },
    styleTag: 'tnf-style',
    html: baseHTML,
    css: baseCSS
}

