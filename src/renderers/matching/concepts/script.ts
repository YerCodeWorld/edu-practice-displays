import {
    injectStyle,
    applyTheme,
    shuffle,
    createSection
} from "../../../utils/utils";

import {
    MatchData,

    MatchingRendererOptions,
    MatchingRendererHandle,

    QuizTheme,
    ComponentData,

    ThemeName
} from "../types";

import {
    items,
    answerKey,
    parseMatching
} from '../utils';

import {
    ContractType
} from "../../types";

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

export const themes: Record<ThemeName, QuizTheme> = {
  original: {
    name: 'original',
    cssVariables: {
      '--concepts-bg': '#ecfdf5',
      '--concepts-card': '#ffffff',
      '--concepts-border': '#064e3b',
      '--concepts-accent': '#10b981',
      '--concepts-accent2': '#3b82f6',
      '--concepts-odd-bg': '#d1fae5',
      '--concepts-label': '#064e3b',
      '--concepts-span-bg': '#10b981',
      '--concepts-span-color': '#fff'
    }
  },
  light: {
    name: 'light',
    cssVariables: {
      '--concepts-bg': '#fafafa',
      '--concepts-card': '#ffffff',
      '--concepts-border': '#222222',
      '--concepts-accent': '#3182ce',
      '--concepts-accent2': '#805ad5',
      '--concepts-odd-bg': '#f1f5f9',
      '--concepts-label': '#1a202c',
      '--concepts-span-bg': '#3182ce',
      '--concepts-span-color': '#fff'
    }
  },
  dark: {
    name: 'dark',
    cssVariables: {
      '--concepts-bg': '#1a202c',
      '--concepts-card': '#2d3748',
      '--concepts-border': '#e2e8f0',
      '--concepts-accent': '#63b3ed',
      '--concepts-accent2': '#f6ad55',
      '--concepts-odd-bg': '#2a3344',
      '--concepts-label': '#e2e8f0',
      '--concepts-span-bg': '#63b3ed',
      '--concepts-span-color': '#1a202c'
    }
  },
  forest: {
    name: 'forest',
    cssVariables: {
      '--concepts-bg': '#e8f5e9',
      '--concepts-card': '#ffffff',
      '--concepts-border': '#1b5e20',
      '--concepts-accent': '#2e7d32',
      '--concepts-accent2': '#8d6e63',
      '--concepts-odd-bg': '#c8e6c9',
      '--concepts-label': '#1b5e20',
      '--concepts-span-bg': '#2e7d32',
      '--concepts-span-color': '#fff'
    }
  },
  deepForest: {
    name: 'deepForest',
    cssVariables: {
      '--concepts-bg': '#102418',
      '--concepts-card': '#1b3124',
      '--concepts-border': '#d0e8d2',
      '--concepts-accent': '#2f855a',
      '--concepts-accent2': '#c9a227',
      '--concepts-odd-bg': '#163a27',
      '--concepts-label': '#d0e8d2',
      '--concepts-span-bg': '#2f855a',
      '--concepts-span-color': '#fff'
    }
  },
  ocean: {
    name: 'ocean',
    cssVariables: {
      '--concepts-bg': '#e0f7fa',
      '--concepts-card': '#ffffff',
      '--concepts-border': '#01579b',
      '--concepts-accent': '#0288d1',
      '--concepts-accent2': '#00bcd4',
      '--concepts-odd-bg': '#b2ebf2',
      '--concepts-label': '#01579b',
      '--concepts-span-bg': '#0288d1',
      '--concepts-span-color': '#fff'
    }
  },
  deepOcean: {
    name: 'deepOcean',
    cssVariables: {
      '--concepts-bg': '#0a192f',
      '--concepts-card': '#112240',
      '--concepts-border': '#ccd6f6',
      '--concepts-accent': '#64ffda',
      '--concepts-accent2': '#48b1f5',
      '--concepts-odd-bg': '#0f2740',
      '--concepts-label': '#ccd6f6',
      '--concepts-span-bg': '#64ffda',
      '--concepts-span-color': '#0a192f'
    }
  },
  sunSet: {
    name: 'sunSet',
    cssVariables: {
      '--concepts-bg': '#fff5f0',
      '--concepts-card': '#ffffff',
      '--concepts-border': '#4a1d1f',
      '--concepts-accent': '#ff6b6b',
      '--concepts-accent2': '#ffa94d',
      '--concepts-odd-bg': '#ffe0d0',
      '--concepts-label': '#4a1d1f',
      '--concepts-span-bg': '#ff6b6b',
      '--concepts-span-color': '#fff'
    }
  },
  moonSet: {
    name: 'moonSet',
    cssVariables: {
      '--concepts-bg': '#2c2c54',
      '--concepts-card': '#474787',
      '--concepts-border': '#f7f1e3',
      '--concepts-accent': '#706fd3',
      '--concepts-accent2': '#ff793f',
      '--concepts-odd-bg': '#3e3e70',
      '--concepts-label': '#f7f1e3',
      '--concepts-span-bg': '#706fd3',
      '--concepts-span-color': '#fff'
    }
  },
  bright: {
    name: 'bright',
    cssVariables: {
      '--concepts-bg': '#ffffff',
      '--concepts-card': '#f9f871',
      '--concepts-border': '#000000',
      '--concepts-accent': '#ff1744',
      '--concepts-accent2': '#2979ff',
      '--concepts-odd-bg': '#fff9c4',
      '--concepts-label': '#000000',
      '--concepts-span-bg': '#ff1744',
      '--concepts-span-color': '#fff'
    }
  },
  neon: {
    name: 'neon',
    cssVariables: {
      '--concepts-bg': '#0d0d0d',
      '--concepts-card': '#1a1a1a',
      '--concepts-border': '#e0e0e0',
      '--concepts-accent': '#39ff14',
      '--concepts-accent2': '#ff00ff',
      '--concepts-odd-bg': '#222222',
      '--concepts-label': '#e0e0e0',
      '--concepts-span-bg': '#39ff14',
      '--concepts-span-color': '#0d0d0d'
    }
  }
};

export function conceptsExerciseRenderer(
    mount: HTMLElement,
    data: MatchData,
    options: MatchingRendererOptions = {}
): Omit<MatchingRendererHandle, "getState"> {


    const componentData: ComponentData = {
        name: "Concept Definition",
        description: "A simple component for concept-like matching. Works great for exams"
    };

    const {
        theme = themes.sunSet,
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "concept-definition"
    } = options;

    const root = createSection("concepts-wrap", ariaLabel);
    injectStyle("edu-concepts-style", baseCSS);
    applyTheme(root, theme);

    let btn: HTMLButtonElement;
    let main: HTMLElement;
    let title: HTMLLabelElement;

    const answers = answerKey(data);

    const left = shuffle(items(data, "left"));
    const right = shuffle([...items(data, "right"), ...(data.distractors || [])]);

    let totalCorrect = 0;

    function checkAnswers() {
        let totalCorrect = 0;

        for (let i = 0; i < main.children.length; i++) {

            const child = main.children[i];

            const q = child.querySelector("label").textContent;
            const sel = child.querySelector("select").value;

            console.log(q);
            console.log(sel);

            if (answers[q] === sel) {
                totalCorrect++;
            } else {
                child.classList.add("concepts-incorrect");
                root.classList.add("concepts-incorrect");
            }
        }

        if (totalCorrect === left.length) {
            root.classList.remove("concepts-success");
            void root.offsetWidth;
            root.classList.add("concepts-success");
            // confetti({
            //    particleCount: 100,
            //    spread: 70,
            //    origin: { y: 0.6 },
            // });
        } else {
            alert(`${totalCorrect} / ${left.length} correct`);
        }
    }

    function createSelect(options) {
        const select = document.createElement("select");
        for (const opt of options) {
            const optEl = document.createElement("option");
            optEl.textContent = opt;
            select.appendChild(optEl);
        }
        return select;
    }

    function createConceptSection(idx, labText, selectEl) {
        const container = document.createElement("div");
        container.className = "concepts-container";
        container.setAttribute("aria-label", `q-${idx}`);

        const conceptIdx = document.createElement("span");
        conceptIdx.textContent = idx + 1;

        const lab = document.createElement("label");
        lab.id = `concepts-lab-${idx}`;
        lab.textContent = labText;

        container.append(conceptIdx, lab, selectEl);
        return container;
    }

    function init() {
        root.innerHTML = baseHTML;
        main = root.querySelector("#conceptsContainer");
        btn = root.querySelector("#conceptsCheck");

        for (let i = 0; i < left.length; i++) {        
            main.appendChild(createConceptSection(i, left[i], createSelect(right)));
        }

        btn.addEventListener("click", () => {
            finish();
        });

    }

    function finish() {
        checkAnswers();

        // disableAll();
        const result = { detail: { correct: 0, total: 0, score: 0, matches: {} }, timestamp: 0 };

        if (resultHandler) {
            resultHandler(result);
        }

        const event = new CustomEvent('concept-exercise-complete', {
            detail: "Completed!",
            bubbles: true
        });
        root.dispatchEvent(event);
    }

    init();
    mount.append(root);
    return {
        destroy(): void { mount.removeChild(root); },

        setTheme(newTheme: QuizTheme): void {
            applyTheme(root, newTheme);
        },

        componentData,

        finish
    }
}

function validateConceptsDefinition(data: any): boolean {return true;}

export const ConceptsDefinitionContract: ContractType = {
    name: "Concepts Defintion",
    description: "In a matching-style way, place the right defition to the concepts.",
    
    themes,
    version: 1.0,
    parserVersion: 1.0,

    category: "open",
    tags: ["relation-mapping", "...", "binary-choice"],

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
        Misinformation = Telling something that is false as if it was true;
        Fraternity = The idea of union of man and fellowship of the people;
        Destroy = Riping something apart to make it non-functionable;
        Intelligence = Concept that represents intelectual capacity;
        @EXTRA = [State of deep sadness during long times | Hurting someone deeply];
        `
    ],

    defaultOptions: {
        shuffle: true,
        allowRtry: false,
        ariaLabel: "Concepts Definition Exercise"
    },

    implementation: {
        renderer: conceptsExerciseRenderer,
        parser: parseMatching,
        validator: validateConceptsDefinition
    },

    html: baseHTML,
    css: baseCSS
}; 

