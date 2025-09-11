import {
    injectStyle,
    applyTheme,
    shuffle,
    createSection
} from "../../../utils/utils";

import {
    MatchingRendererHandle,
    MatchingRendererOptions,
    QuizTheme,
    ComponentData    
} from "../types";

import {
    ContractType
} from "../../types";

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

// ParseResult
// ExerciseContract type 

const themes: Record<string, QuizTheme> = {
    original: {
        name: 'original',
        cssVariables: {
            '--bg':     '#fdf6ff',
            '--card':   '#fffaff',
            '--ink':    '#463c4b',
            '--muted':  '#e5d0eb',
            '--true':   '#8b5cf6',
            '--false':  '#ec4899',
            '--neutral':'#f59e0b',
            '--focus':  '#ec4899'
        }
    },
    light: {
        name: 'light',
        cssVariables: {
            '--bg':     '#f9fafb',
            '--card':   '#ffffff',
            '--ink':    '#111827',
            '--muted':  '#d1d5db',
            '--true':   '#16a34a',
            '--false':  '#dc2626',
            '--neutral':'#facc15',
            '--focus':  '#2563eb'
        }
    },
    dark: {
        name: 'dark',
        cssVariables: {
            '--bg':     '#0f172a',
            '--card':   '#1e293b',
            '--ink':    '#f1f5f9',
            '--muted':  '#475569',
            '--true':   '#22c55e',
            '--false':  '#ef4444',
            '--neutral':'#eab308',
            '--focus':  '#3b82f6'
        }
    },
    forest: {
        name: 'forest',
        cssVariables: {
            '--bg':     '#f0fdf4',
            '--card':   '#dcfce7',
            '--ink':    '#064e3b',
            '--muted':  '#86efac',
            '--true':   '#15803d',
            '--false':  '#b91c1c',
            '--neutral':'#ca8a04',
            '--focus':  '#166534'
        }
    },
    deepForest: {
        name: 'deepForest',
        cssVariables: {
            '--bg':     '#052e16',
            '--card':   '#064e3b',
            '--ink':    '#f0fdf4',
            '--muted':  '#14532d',
            '--true':   '#22c55e',
            '--false':  '#dc2626',
            '--neutral':'#eab308',
            '--focus':  '#84cc16'
        }
    },
    ocean: {
        name: 'ocean',
        cssVariables: {
            '--bg':     '#ecfeff',
            '--card':   '#cffafe',
            '--ink':    '#083344',
            '--muted':  '#67e8f9',
            '--true':   '#0ea5e9',
            '--false':  '#be123c',
            '--neutral':'#fbbf24',
            '--focus':  '#0284c7'
        }
    },
    deepOcean: {
        name: 'deepOcean',
        cssVariables: {
            '--bg':     '#082f49',
            '--card':   '#164e63',
            '--ink':    '#e0f2fe',
            '--muted':  '#155e75',
            '--true':   '#38bdf8',
            '--false':  '#e11d48',
            '--neutral':'#facc15',
            '--focus':  '#06b6d4'
        }
    },
    sunSet: {
        name: 'sunSet',
        cssVariables: {
            '--bg':     '#fff7ed',
            '--card':   '#ffedd5',
            '--ink':    '#7c2d12',
            '--muted':  '#fdba74',
            '--true':   '#ea580c',
            '--false':  '#be123c',
            '--neutral':'#eab308',
            '--focus':  '#c2410c'
        }
    },
    moonSet: {
        name: 'moonSet',
        cssVariables: {
            '--bg':     '#fdf4ff',
            '--card':   '#fae8ff',
            '--ink':    '#581c87',
            '--muted':  '#d8b4fe',
            '--true':   '#9333ea',
            '--false':  '#db2777',
            '--neutral':'#f59e0b',
            '--focus':  '#7e22ce'
        }
    },
    bright: {
        name: 'bright',
        cssVariables: {
            '--bg':     '#ffffff',
            '--card':   '#fef9c3',
            '--ink':    '#111827',
            '--muted':  '#fde68a',
            '--true':   '#84cc16',
            '--false':  '#ef4444',
            '--neutral':'#f59e0b',
            '--focus':  '#f97316'
        }
    },
    neon: {
        name: 'neon',
        cssVariables: {
            '--bg':     '#0f0f1a',
            '--card':   '#1a1a2e',
            '--ink':    '#e0e0ff',
            '--muted':  '#6b21a8',
            '--true':   '#22d3ee',
            '--false':  '#f472b6',
            '--neutral':'#facc15',
            '--focus':  '#a855f7'
        }
    }
}

type trueFalseData = Array<{
    q: string,
    a: string
}>;

export function trueFalseRenderer(

    mount: HTMLElement,
    data: trueFalseData,
    options: MatchingRendererOptions

): Omit<MatchingRendererHandle, "getState"> {

    // leaving this here for the moment since the main example page uses it
    // will be replaced with 'componentMetadata' structure 
    const componentData: ComponentData = {
        name: "True, False or Neutral",
        description: "A nicer version or true/false exercise, cute styling and neutral option"
    };

    injectStyle("tnf-style", baseCSS);

    const {
        theme = themes.ocean,
        shuffle: doShuffle = true,
        allowRetry = false,
        resultHandler,
        ariaLabel = "True False Exercise"
    } = options;

    const questions = shuffle(data);
    const root = createSection("tnf-wrapper", ariaLabel);
    applyTheme(root, theme);

    let answerMap: Record<string, string> = {};

    // prefilled array
    let picks = Array(data.length).fill(null);
    let activeIndex = -1;

    let list: HTMLElement;
    let picker: HTMLDialogElement;
    let checkAll: HTMLButtonElement;
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

            const btn = document.createElement("button");
            btn.className = 'choose';
            btn.textContent = 'Select';

            btn.addEventListener('click', e => {
                e.stopPropagation();
                activeIndex = i;
                picker.showModal();
            })

            el.addEventListener('click', e => {
                e.stopPropagation();
                activeIndex = i;
                picker.showModal();
            })

            el.append(chip, prompt, btn);
            list.appendChild(el);

        });
    }

    function init() {
        root.innerHTML = baseHTML;

        list = root.querySelector("#list");
        picker = root.querySelector("#picker");
        checkAll = root.querySelector("#checkAll");

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

        setTheme(newTheme: QuizTheme): void {
            applyTheme(root, newTheme);
        },

        componentData,

        finish
    }
}

// EXAMPLE 
// apple = t;
// pear :: f;
// grapes :: n;
// banana = t;

export function parseTrueFalse(code: string): trueFalseData {

    let data: trueFalseData = [];
    let errors: string[] = [];    
    
    if (!code) {
        errors.push("No code provided");
        return []; 
    }; 

    if (!code.includes(";")) {
        errors.push("No ';' found in the code (which indicate matches separation)");
        return [];
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
            right.startsWith("T" || 't') ? 'T' :
            right.startsWith("F" || 'f') ? 'F' : 'N';  

        data.push({
            q: left,
            a: normalize 
        });       
    }    

    return data; 
}

export function validateTrueFalse(data: trueFalseData): Array<string> {

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
    return errors; 
}

// type -> : ExerciseContract<trueFalseData>
export const TrueFalseContract: ContractType = {
    name: "True, False or Neutral",
    description: "A nicer version of a true/false exercise, with cute styling and a neutral option.",
    
    themes,
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
       Love is good = n;`,
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

    html: baseHTML,
    css: baseCSS
}

