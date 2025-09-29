import {
    injectStyle,
    shuffle,
    createSection
} from "../../../utils/utils";

import {
  QuizTheme,
  Themes,
  RendererOptions,
  RendererHandle,
  ContractType
} from '../../types';

import {
    items,
    answerKey,
    parseMatching
} from '../utils';

type Pair = {
    left: string;
    right: string;
    hint?: string;
}

type MatchData = {
    content: Pair[];
    distractors?: string[];
    leftColumnName?: string;
    rightColumnName?: string;
}

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

export function conceptsExerciseRenderer(
    mount: HTMLElement,
    data: MatchData,
    options: RendererOptions = {}
): RendererHandle {

    const {        
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "concept-definition"
    } = options;

    const root = createSection("concepts-root", ariaLabel);
    injectStyle("edu-concepts-style", baseCSS);    

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
        const defaultEl = document.createElement("option");
        defaultEl.textContent = "";
        select.appendChild(defaultEl);
        
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
        destroy(): void {  mount.removeChild(root) },

        styleTag: ConceptsDefinitionContract.styleTag,

        name: 'Concepts Defintion',

        finish
    }
}

function validateConceptsDefinition(data: any): boolean { return true; }

export const ConceptsDefinitionContract: ContractType = {
    name: "Concepts Defintion",
    description: "In a matching-style way, place the right defition to the concepts.",
    
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

    styleTag: 'edu-concepts-style',

    html: baseHTML,
    css: baseCSS
}; 

