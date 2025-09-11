import {
    injectStyle,
    applyTheme,
    shuffle,
    createSection
} from "../../../utils/utils";

import {
    MatchData,

    MatchingState,
    MatchingResultDetail,
    MatchingResult,

    MatchingRendererOptions,
    MatchingRendererHandle,

    QuizTheme,
    ComponentData
} from '../types';

import {
    ContractType
} from "../../types";

import {
    items,
    distractors,
    answerKey,
    parseMatching
} from "../utils";

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

const themes: Record<string, QuizTheme> = {
    original: {
        name: 'original',
        cssVariables: {
            '--primary-color': '#f97316',
            '--primary-hover': '#ea580c',
            '--success-color': '#16a34a',
            '--error-color': '#dc2626',
            '--background': '#fff7ed',
            '--surface': '#ffffff',
            '--border': '#fed7aa',
            '--text-primary': '#1f2937',
            '--text-secondary': '#6b7280',
            '--shadow': '0 2px 4px 0 rgba(0, 0, 0, 0.06)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    light: {
        name: 'light',
        cssVariables: {
            '--primary-color': '#2563eb',
            '--primary-hover': '#1d4ed8',
            '--success-color': '#16a34a',
            '--error-color': '#dc2626',
            '--background': '#f9fafb',
            '--surface': '#ffffff',
            '--border': '#e5e7eb',
            '--text-primary': '#111827',
            '--text-secondary': '#6b7280',
            '--shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    dark: {
        name: 'dark',
        cssVariables: {
            '--primary-color': '#3b82f6',
            '--primary-hover': '#2563eb',
            '--success-color': '#22c55e',
            '--error-color': '#ef4444',
            '--background': '#0f172a',
            '--surface': '#1e293b',
            '--border': '#334155',
            '--text-primary': '#f1f5f9',
            '--text-secondary': '#94a3b8',
            '--shadow': '0 2px 6px rgba(0, 0, 0, 0.5)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    forest: {
        name: 'forest',
        cssVariables: {
            '--primary-color': '#15803d',
            '--primary-hover': '#166534',
            '--success-color': '#16a34a',
            '--error-color': '#dc2626',
            '--background': '#f0fdf4',
            '--surface': '#dcfce7',
            '--border': '#86efac',
            '--text-primary': '#064e3b',
            '--text-secondary': '#065f46',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.08)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    deepForest: {
        name: 'deepForest',
        cssVariables: {
            '--primary-color': '#22c55e',
            '--primary-hover': '#16a34a',
            '--success-color': '#4ade80',
            '--error-color': '#ef4444',
            '--background': '#052e16',
            '--surface': '#064e3b',
            '--border': '#14532d',
            '--text-primary': '#ecfdf5',
            '--text-secondary': '#6ee7b7',
            '--shadow': '0 2px 6px rgba(0, 0, 0, 0.7)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    ocean: {
        name: 'ocean',
        cssVariables: {
            '--primary-color': '#0ea5e9',
            '--primary-hover': '#0284c7',
            '--success-color': '#14b8a6',
            '--error-color': '#e11d48',
            '--background': '#ecfeff',
            '--surface': '#cffafe',
            '--border': '#67e8f9',
            '--text-primary': '#083344',
            '--text-secondary': '#155e75',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.08)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    deepOcean: {
        name: 'deepOcean',
        cssVariables: {
            '--primary-color': '#38bdf8',
            '--primary-hover': '#0ea5e9',
            '--success-color': '#06b6d4',
            '--error-color': '#e11d48',
            '--background': '#082f49',
            '--surface': '#164e63',
            '--border': '#155e75',
            '--text-primary': '#e0f2fe',
            '--text-secondary': '#7dd3fc',
            '--shadow': '0 2px 6px rgba(0, 0, 0, 0.6)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    sunSet: {
        name: 'sunSet',
        cssVariables: {
            '--primary-color': '#ea580c',
            '--primary-hover': '#c2410c',
            '--success-color': '#f97316',
            '--error-color': '#be123c',
            '--background': '#fff7ed',
            '--surface': '#ffedd5',
            '--border': '#fdba74',
            '--text-primary': '#7c2d12',
            '--text-secondary': '#9a3412',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    moonSet: {
        name: 'moonSet',
        cssVariables: {
            '--primary-color': '#9333ea',
            '--primary-hover': '#7e22ce',
            '--success-color': '#a855f7',
            '--error-color': '#db2777',
            '--background': '#fdf4ff',
            '--surface': '#fae8ff',
            '--border': '#d8b4fe',
            '--text-primary': '#581c87',
            '--text-secondary': '#6b21a8',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.1)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    bright: {
        name: 'bright',
        cssVariables: {
            '--primary-color': '#eab308',
            '--primary-hover': '#ca8a04',
            '--success-color': '#84cc16',
            '--error-color': '#ef4444',
            '--background': '#ffffff',
            '--surface': '#fef9c3',
            '--border': '#fde68a',
            '--text-primary': '#1f2937',
            '--text-secondary': '#6b7280',
            '--shadow': '0 2px 4px rgba(0, 0, 0, 0.06)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    },
    neon: {
        name: 'neon',
        cssVariables: {
            '--primary-color': '#22d3ee',
            '--primary-hover': '#06b6d4',
            '--success-color': '#a3e635',
            '--error-color': '#f472b6',
            '--background': '#0f0f1a',
            '--surface': '#1a1a2e',
            '--border': '#6b21a8',
            '--text-primary': '#e0e0ff',
            '--text-secondary': '#c084fc',
            '--shadow': '0 0 8px rgba(168, 85, 247, 0.6)',
            '--radius': '0.5rem',
            '--font-family': 'Inter, system-ui, sans-serif'
        }
    }
};

export function matchingPageRenderer(
    mount: HTMLElement,
    data: MatchData,
    options: MatchingRendererOptions = {},
    overrideCSS?: string
): MatchingRendererHandle {

    const componentData: ComponentData = {
        name: "Matching",
        description: "The classic matching exercise, ideal for short words matching"
    };

    injectStyle("edu-matching-style", overrideCSS || baseCSS);

    const {
        theme = themes.ocean,
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "Matching Exercise"
    } = options;

    const root = createSection("edu-matching", ariaLabel);
    applyTheme(root, theme);

    // bundle data using builder helpers
    const answers = answerKey(data);
    const right = doShuffle ? shuffle(items(data, "right")) : items(data, "right");
    const left = doShuffle ? shuffle(items(data, "left")) : items(data, "left");
    const rightWithDistractors = doShuffle ?
    shuffle([...items(data, "right"), ...(data.distractors || [])]) :
    [...items(data, "right"), ...(data.distractors || [])];

    // keeps track of the whole exercise play, without it we wouldn't be able to track
    // anything
    let state: MatchingState = {
        matches: {},
        pendingMatches: {},
        selectedLeft: null,
        selectedRight: null,
        score: 0
    };

    // To assign them dynamically at rendering time. If more matches than the length of this are present, we default to green (init())
    const colors = ["#8b5cf6", "#d946ef", "#9333ea", "#facc15", "#c084fc", "#a855f7", "#eab308", "#f97316", "#14b8a6", "#f59e0b"];
    let pairColors: Record<string, string> = {};

    function createMatchItem(text: string, type: 'left' | 'right', id: string): HTMLElement {
        const item = document.createElement('div');

        item.className = "edu-matching__item";
        item.id = id;
        item.setAttribute("data-id", id);
        item.setAttribute("data-type", type);
        item.setAttribute('role', 'button');

        item.textContent = text;

        item.addEventListener("click", () => handleItemClick(id, type));
        item.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleItemClick(id, type);
            }
        });

        return item;
    }

    // boxes elements in the actual rendered exercise
    function handleItemClick(id: string, type: 'left' | 'right'): void {

        let left = undefined;
        let right = undefined;

        if (type === "left") {

            if (state.pendingMatches[id]) {

                left = document.getElementById(id);
                right = document.getElementById(state.pendingMatches[id]);

                delete state.pendingMatches[id];

                right.style.backgroundColor = "";
                left.style.backgroundColor = "";

                state.selectedLeft = null;
            } else {
                state.selectedLeft = state.selectedLeft === id ? null : id;
            }

            state.selectedRight = null;

        } else {
            state.selectedRight = state.selectedRight === id ? null : id;
        }

        if (state.selectedLeft && state.selectedRight) {

            // unselects matches pointed to a same right item
            for (const [leftId, rightId] of Object.entries(state.pendingMatches)) {
                if (rightId === state.selectedRight) {
                    delete state.pendingMatches[leftId];

                    const oldLeft = document.getElementById(leftId);
                    const oldRight = document.getElementById(rightId);
                    if (oldLeft) oldLeft.style.backgroundColor = "";
                    if (oldRight) oldRight.style.backgroundColor = "";
                }
            }

            state.pendingMatches[state.selectedLeft] = state.selectedRight;

            const left = document.getElementById(state.selectedLeft);
            const right = document.getElementById(state.selectedRight);

            left.style.backgroundColor = pairColors[state.selectedLeft];
            right.style.backgroundColor = pairColors[state.selectedLeft];

            state.selectedLeft = null;
            state.selectedRight = null;
        }

        updateDisplay();
    }

    function replayAnim(el) {
        el.style.animation = "";
        void el.offsetWidth;
        el.style.animation = "shake 0.3s ease";
    }

    function disableAll() {
        const left  = root.querySelector("#left-items");
        const right = root.querySelector("#right-items");
        left?.setAttribute("inert", "");
        right?.setAttribute("inert", "");
    }

    function checkMatches(): void {
        if (Object.keys(state.pendingMatches).length === 0) return;

        const correctMatches: Array<{leftId: string, rightId: string}> = [];
        const incorrectMatches: string[] = [];

        // Check each pending match
        Object.entries(state.pendingMatches).forEach(([leftId, rightId]) => {
            if (answers[leftId] === rightId) {
                correctMatches.push({leftId, rightId});
            } else {
                incorrectMatches.push(leftId);
            }
        });

        correctMatches.forEach(({leftId, rightId}) => {
            state.matches[leftId] = rightId;
            state.score++;
        });

        if (incorrectMatches.length > 0) {
            incorrectMatches.forEach(leftId => {
                const rightId = state.pendingMatches[leftId];

                const leftEl = document.getElementById(leftId);
                const rightEl = document.getElementById(rightId);

                replayAnim(leftEl);
                replayAnim(rightEl);

                leftEl.style.backgroundColor = "red";
                rightEl.style.backgroundColor = "red";
            });
        }

        // Clear correct pending matches
        correctMatches.forEach(({leftId}) => {
            delete state.pendingMatches[leftId];
        });

        updateDisplay();
        finish();
    }

    function updateDisplay(): void {
        const leftItems = root.querySelectorAll('[data-type="left"]');
        const rightItems = root.querySelectorAll('[data-type="right"]');

        // this
        leftItems.forEach(item => {
            const id = item.getAttribute('data-id')!;
            item.className = 'edu-matching__item';

            if (state.matches[id]) {

                // Confirmed match - show green
                item.classList.add('edu-matching__item--confirmed');
            } else if (state.pendingMatches[id]) {
                item.classList.add('edu-matching__item--selected');
            } else if (state.selectedLeft === id) {
                item.classList.add('edu-matching__item--selected');
            }
        });

        // and this
        rightItems.forEach(item => {
            const id = item.getAttribute('data-id')!;
            item.className = 'edu-matching__item';

            // Check if this item is in confirmed matches
            const matchedEntry = Object.entries(state.matches).find(([, rightId]) => rightId === id);
            if (matchedEntry) {
                item.classList.add('edu-matching__item--confirmed');
            } else {
                // Check if this item is in pending matches
                const pendingEntry = Object.entries(state.pendingMatches).find(([, rightId]) => rightId === id);
                if (pendingEntry) {
                    item.classList.add('edu-matching__item--selected');
                } else if (state.selectedRight === id) {
                    item.classList.add('edu-matching__item--selected');
                }
            }
        });

        // IS THE SAME

        // Update buttons
        const checkBtn = root.querySelector('#check-btn') as HTMLButtonElement;
        if (checkBtn) {
            checkBtn.disabled = !(Object.keys(state.pendingMatches).length === left.length);
        }

        // Update score
        const scoreEl = root.querySelector('#score');
        if (scoreEl) scoreEl.textContent = state.score.toString();
    }

    /**
     * Replaces the base html data with the data from the metadata,
     * and appends the proper elements to the right/left columns.
     * This function also adds event listeners to the reset and finish buttons.
     */
    function init(): void  {

        root.innerHTML = baseHTML
        .replace("{{leftColumnName}}", data.leftColumnName ?? "Match These")
        .replace("{{rightColumnName}}", data.rightColumnName ?? "With These");

        const checkBtn = root.querySelector("#check-btn");
        if (checkBtn) {
            checkBtn.addEventListener("click", checkMatches);
        }

        const leftContainer = root.querySelector("#left-items");
        if (leftContainer) {
            left.forEach(item => {
                pairColors[item] = colors.length > 0 ? colors.pop() : "#1a1a";  // here
                leftContainer.appendChild(createMatchItem(item, 'left', item));
            });
        }

        const rightContainer = root.querySelector("#right-items");
        if (rightContainer) {
            rightWithDistractors.forEach(item => {
                rightContainer.appendChild(createMatchItem(item, 'right', item));
            });
        }

        updateDisplay();
    }


    /**
     * We pass the result type (which also makes use of our global state object variable)
     * to whichever resultHanlder the user wants to add to the component.
     * Result is also shown in the component itself, which user should be able to disable (to-do)
     */
    function finish(): void {

        disableAll();

        const result: MatchingResult = {
            detail: {
                correct: state.score,
                total: data.content.length,
                score: state.score,
                matches: { ...state.matches }
            },
            timestamp: Date.now()
        };

        if (resultHandler) {
            resultHandler(result);
        }

        const event = new CustomEvent('matching-complete', {
            detail: result.detail,
            bubbles: true
        });
        root.dispatchEvent(event);

    }

    // initialize and append component to passed parent element
    init();
    mount.appendChild(root);

    return {
        destroy(): void {
            mount.removeChild(root);
        },

        setTheme(newTheme: QuizTheme): void {
            applyTheme(root, newTheme);
        },

        getState(): MatchingState {
            return { ...state };
        },

        componentData,

        finish
    };

}

function matchingValidator(data: MatchData) {}

export const MatchingContract: ContractType = {
    name: "Matching",
    description: "...",
    
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
       apple = red;
       pear = green;
       grapes = purple;
       banana = yellow;
       @EXTRA = [white | black]`,       
       
      `
       USA :: Washington DC;
       DR :: Santo Domingo;
       Japan :: Tokyo;
       Spain :: Madrid;
       Argentina :: Buenos Aires;
       @EXTRA :: [Ottowa | London | Moscow];
       `
    ],

    defaultOptions: {
        shuffle: true,
        allowRetry: false,
        ariaLabel: "True False Exercise"
    },

    implementation: {
        renderer: matchingPageRenderer,
        parser: parseMatching,
        validator: matchingValidator
    },

    html: baseHTML,
    css: baseCSS
}; 

