import { MatchData } from '../types';
import { injectStyle, shuffle, createSection } from "../../../utils/utils";
import { RendererOptions, RendererHandle, ContractType } from '../../types';
import { items, distractors, answerKey, parseMatching } from "../utils";

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

export function matchingPageRenderer(
    mount: HTMLElement,
    data: MatchData,
    options: RendererOptions = {},
    overrideCSS?: string
): RendererHandle {

    const {        
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "Matching Exercise"
    } = options;

    const root = createSection("edu-matching", ariaLabel)    
    injectStyle('edu-matching-style', baseCSS);    

    // bundle data using builder helpers
    const answers = answerKey(data);
    const right = doShuffle ? shuffle(items(data, "right")) : items(data, "right");
    const left = doShuffle ? shuffle(items(data, "left")) : items(data, "left");
    const rightWithDistractors = doShuffle ?
    shuffle([...items(data, "right"), ...(data.distractors || [])]) :
    [...items(data, "right"), ...(data.distractors || [])];

    // keeps track of the whole exercise play, without it we wouldn't be able to track
    // anything
    let state = {
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
                    const oldRight = document.getElementById(String(rightId));
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

        const result = {
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

        styleTag: MatchingContract.styleTag,

        name: MatchingContract.name,

        finish
    };

}

function matchingValidator(data: MatchData): boolean { return true; }

export const MatchingContract: ContractType = {
    name: "Matching",
    description: "...",
       
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

    // reminder to support naming the columns
    grammarExample: [
      `       
apple = red;
pear = green;
grapes = purple;
banana = yellow;
@EXTRA = [white | black]
       `,       
       
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

    styleTag: 'edu-matching-style',

    html: baseHTML,
    css: baseCSS
}; 

