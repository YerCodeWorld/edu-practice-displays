import { MatchData } from '../types';
import { injectStyle, shuffle, createSection, getResultEl } from "../../../utils";
import { RendererOptions, RendererHandle, RendererResult, ContractType } from '../../types';
import { items, distractors, answerKey, parseMatching } from "../utils";
import { playSound } from "../../../services";

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

export function matchingPageRenderer(
    mount: HTMLElement,
    data: MatchData,
    options: RendererOptions = {}    
): RendererHandle {

    // BASE COMPONENT DATA 
    // ---------------------
    const {        
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "Matching Exercise",
        checkBtn = true
    } = options;

    const root = createSection("edu-matching", ariaLabel)    
    injectStyle('edu-matching-style', baseCSS);    

    // BUNDLED DATA CONSTANTS 
    // ---------------------
    const answers = answerKey(data);
    const right = shuffle(items(data, "right"));
    const left = shuffle(items(data, "left"));
    const rightWithDistractors = shuffle([...items(data, "right"), ...(data.distractors || [])]);    

    // State tracker 
    let state = {
        matches: {},
        pendingMatches: {},
        selectedLeft: null,
        selectedRight: null,
        score: 0
    };

    // CONSTANTS 
    // ---------
    const colors = ["#8b5cf6", "#d946ef", "#9333ea", "#facc15", "#c084fc", "#a855f7", "#eab308", "#f97316", "#14b8a6", "#f59e0b"];
    const total = data.content.length;
    const startTime = Date.now();    
    
    // VARIABLES  
    // ---------
    let pairColors: Record<string, string> = {};
    let wrong: string[] = [];

    function createMatchItem(text: string, type: 'left' | 'right', id: string): HTMLElement {
        const item = document.createElement('div');

        item.className = "edu-matching__item";
        item.id = id;
        item.setAttribute("data-id", id);
        item.setAttribute("data-type", type);
        item.setAttribute('role', 'button');

        item.textContent = text;

        item.addEventListener("click", () => { handleItemClick(id, type); playSound('click'); });
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

    function check(): void {
        if (Object.keys(state.pendingMatches).length === 0) return;

        const correctMatches: Array<{leftId: string, rightId: string}> = [];        

        // Check each pending match
        Object.entries(state.pendingMatches).forEach(([leftId, rightId]) => {
            if (answers[leftId] === rightId) {
                correctMatches.push({leftId, rightId});
            } else {
                wrong.push(leftId);
            }
        });

        correctMatches.forEach(({leftId, rightId}) => {
            state.matches[leftId] = rightId;
            state.score++;
        });

        if (wrong.length > 0) {
            wrong.forEach(leftId => {
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

        const $checkBtn = root.querySelector("#check-btn") as HTMLButtonElement;
        if ($checkBtn) {
            $checkBtn.addEventListener("click", check);            
            if (!options.checkBtn) $checkBtn.style.display = "none";
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

        const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);
        const score = (state.score / total) * 100;

        const result: RendererResult = {
            detail: {
                correct: state.score,
                total: total,
                score: score                
            },
            timestamp: timestamp,
            // well, at this point each component should have a custom winning screen honestly 
            winningEl: getResultEl(score, state.score, total, timestamp, wrong)
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

        check
    };

}

// ===================================================================// 
//                           PARSER                         
// ===================================================================//

// parser -> parseMatching (imported)

function matchingValidator(data: MatchData): boolean { return true; }


// ===================================================================// 
//                           CONTRACT                         
// ===================================================================//

const exs = `
apple = red;
pear = green;
grapes = purple;
banana = yellow;
@EXTRA = [white | black]
`;

export const MatchingContract: ContractType = {
    name: "Matching",
    description: "...",       
    version: 1.1,
    parserVersion: 1.0,

    category: "open",
    tags: ["relation-mapping", "...", "binary-choice"],

    usage: ["...", "..."],
    wrong: ["...", "..."],

    // reminder to support naming the columns
    grammarExample: [exs],

    defaultOptions: { shuffle: true, allowRetry: false, ariaLabel: "Matching Exercise"},
    implementation: { renderer: matchingPageRenderer, parser: parseMatching, validator: matchingValidator},

    styleTag: 'edu-matching-style',
    html: baseHTML,
    css: baseCSS
}; 

