import {
    injectStyle,
    shuffle,
    createSection
} from "../../../utils/utils";

import {    
  RendererOptions,
  RendererHandle,
  ContractType
} from '../../types';

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

type trueFalseData = Array<{
    q: string,
    a: string
}>;

export function trueFalseRenderer(

    mount: HTMLElement,
    data: trueFalseData,
    options: RendererOptions

): RendererHandle {

    const {        
        shuffle: doShuffle = true,
        allowRetry = false,
        resultHandler,
        ariaLabel = "True False Exercise"
    } = options;

    const questions = shuffle(data);
    const root = createSection("tnf-root", ariaLabel);
    injectStyle("tnf-style", baseCSS);    

    let answerMap: Record<string, string> = {};

    // prefilled array
    let picks = Array(data.length).fill(null);
    let activeIndex = -1;

    let list: HTMLElement;
    let picker: HTMLDialogElement;
    let checkAll: HTMLButtonElement;
    let dialogLabel: HTMLElement; 
    let points = 0;

    const label = v => v === 'T' ? 'True' : v === 'F' ? 'False' : 'Neutral';
    const conversion = v =>
    v === 'True' ? 'T':
    v === 'False' ? 'F' :
    v === 'Neutral' ? 'N' :
    '';

    function disableAll() {
        root.setAttribute("inert", "");
    };

    function check() {
        // if we don't narrow the type typescript will start to complain of unexisting properties 
        for (const child of Array.from(list.children) as HTMLDivElement[]) {            
            
            const q = child.querySelector("p").textContent;
            const pick = conversion(child.querySelector("span").textContent);

            if (answerMap[q] === pick) {
                points++;
            } else {
                child.classList.add("shake-animation");
                child.style.borderColor = "red";
                disableAll();
            }
        }

        if (points === list.children.length) {
            root.classList.add("success-jump");
        }
    }

    function renderQuestions() {

        list.innerHTML = '';
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
                dialogLabel.textContent = row.q; 
                picker.showModal();
            })

            el.append(prompt, chip);
            list.appendChild(el);

        });
    }

    function init() {
        root.innerHTML = baseHTML;

        list = root.querySelector("#list");
        picker = root.querySelector("#picker");
        checkAll = root.querySelector("#checkAll");
        dialogLabel = root.querySelector("#dialog-text");

        picker.addEventListener('close', () => {
            const val = picker.returnValue;
            if (!val || activeIndex < 0) return;
            picks[activeIndex] = val;
            const row = list.querySelector(`.item[data-index="${activeIndex}"]`);
            const chip = row.querySelector('.chip');
            chip.className = 'chip ' + val.toLowerCase();
            chip.textContent = label(val);
            activeIndex = -1;
        });

        data.forEach(item => {
            answerMap[item.q] = item.a;
        });

        checkAll.addEventListener("click", () => {
            check();
        });

        renderQuestions();

    }

    function finish() {

        const result = { detail: { correct: 0, total: 0, score: 0, matches: {} }, timestamp: 0 };
        if (resultHandler) {
            resultHandler(result);
        }

    }

    init();
    mount.appendChild(root);

    return {
    
        destroy(): void {
            mount.removeChild(root);
        },

        styleTag: TrueFalseContract.styleTag,

        name: TrueFalseContract.name,

        finish
    }
}

// EXAMPLE 
// apple = t;
// pear :: f;
// grapes :: n;
// banana = t;

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
        const normalize = 
            right[0] === "T" || 't' ? 'T' :
            right[0] === "F" || 'f' ? 'F' : 'N';  

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

// type -> : ExerciseContract<trueFalseData>
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

    grammarExample: [
      `The sun is really big = t;
       Water is good for humans = t;
       The earth does not rotate = f;
       Love is good = n;
      `,
      `Money is the most important thing in life :: neutral;
       Graduating from university ensures a good life :: false;
       Not having friends is a good thing :: neutral;
       Helping others is generally good :: true;`
    ],

    defaultOptions: {
        shuffle: true,
        allowRetry: false,
        ariaLabel: "True False Exercise"
    },

    implementation: {
        renderer: trueFalseRenderer,
        parser: parseTrueFalse,
        validator: validateTrueFalse
    },

    styleTag: 'tnf-style',

    html: baseHTML,
    css: baseCSS
}

