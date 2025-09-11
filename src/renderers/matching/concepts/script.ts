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
    ComponentData
} from "../types";

import {
    items,
    answerKey
} from '../utils';

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

const themes: Record<string, QuizTheme> = {
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

    injectStyle("edu-concepts-style", baseCSS);

    const {
        theme = themes.original,
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "concept-definition"
    } = options;

    const root = createSection("concepts-wrap", ariaLabel);
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
