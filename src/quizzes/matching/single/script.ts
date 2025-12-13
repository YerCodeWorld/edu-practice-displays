// MATCHING SINGLE 

import { injectStyle, shuffle, createSection, getResultEl } from "../../../utils/utils";
import { RendererOptions, RendererHandle, ContractType, RendererResult } from '../../types';
import { items, distractors, answerKey, parseMatching, Pair, MatchData  } from "../utils";

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

// ===================================================================// 
//                           RENDERER                        
// ===================================================================//
export function matchingSingleRenderer(

    mount: HTMLElement,
    data: MatchData,
    options: RendererOptions = {}

): RendererHandle {    
    
    // BASE COMPONENT DATA 
    // -------------------
    const {        
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "Matching Single Exercise",
        checkButtonEnabled = false
    } = options;

    const root = createSection("mtc-single", ariaLabel);
    injectStyle("mtc-single-style", baseCSS); 
    
    // CONSTANTS 
    // ---------------------
    const resultMap = answerKey(data);
    const questions = shuffle(items(data, "left"));
    const answers = shuffle([...items(data, "right"), ...(data.distractors || [])]);
    const startTime = Date.now();

    // HTML ELEMENTS
    // ---------------------
    let $dots: HTMLDivElement;
    let $hintBtn: HTMLButtonElement;
    let $hintText: HTMLDivElement;
    let $questionText: HTMLLabelElement;
    let $bank: HTMLDivElement;
    let $holder: HTMLDivElement;
    let $dropzone: HTMLDivElement;
    let $prev: HTMLButtonElement;
    let $next: HTMLButtonElement;
    let $checkBtn: HTMLButtonElement;

    const els = {};
    const picks: Record<string, HTMLButtonElement | null> = {};
    questions.forEach(q => picks[q] = null);

    let idx = 0;

    let left:  Record<string, string> = {};
    data.content.forEach(item => {
        left[item.left] = item.right;
    });;

    const state = {
        total: data.content.length,
        score: 0,
        incorrect: [],
        correct: 0,
        wrong: []                
    }; 
    
    // INITIALIZER FUNCTION 
    // ---------------------
    function init() {        
        
        root.innerHTML = '';
        root.innerHTML = baseHTML;

        const $ = cn => root.querySelector(cn);

        $dots = $("#mtc-single-dots");
        $hintBtn = $("#mtc-single-hint-btn");
        $hintText = $("#mtc-single-hint");
        $questionText = $("#mtc-single-question");
        $bank = $("#mtc-single-bank");
        $holder = $("#mtc-single-holder");
        $prev = $("#mtc-single-prevBtn");;
        $next = $("#mtc-single-nextBtn");
        $checkBtn = $("#mtc-single-check");
        if (!options.checkButtonEnabled) $checkBtn.style.display = "none";

        $hintText.textContent = 'Yahir was here';

        // click events
        $checkBtn.addEventListener("click", () => check());

        $hintBtn.addEventListener("click", () => {
            $hintText.classList.toggle("is-open");
        })

        $prev.addEventListener("click", () => {
            staggerAnimation();
            if (idx > 0) { idx--; updateDisplay(); }
            updateHolder();
        });

        $next.addEventListener("click", () => {
            staggerAnimation();
            if (idx < questions.length - 1) { idx++; updateDisplay(); }
            updateHolder();
        });

        $holder.addEventListener("click", () => {
            const child = $holder.firstElementChild as HTMLButtonElement | null;
            if (child === null) return;
            $bank.appendChild(child);
            picks[questions[idx]] = null;
            updateHolder();
        });
        
        updateDisplay();
    }

    /**
     * Supposed to pick up these:
     * @right = countries;
     * @left = capitals;
     */
    function getColumnNames(code: string) {
        const leftRe: RegExp = /@left\s*(?:=|::)\s*\[a-Z\]/; 
        const rightRe: RegExp = /@right\s*(?:=|::)\s*\[a-Z\]/; 

        const mLeft = Array.from(code.matchAll(leftRe), m => m[1]);
        const mRight = Array.from(code.matchAll(rightRe), m => m[1]);
    }

    function updateHolder() {
        $holder.innerHTML = '';
        const el = picks[questions[idx]];
        if (el === undefined || el === null) return;
        $holder.appendChild(el);
    }

    function createAnswer(text: string): HTMLButtonElement {
    
        const b = document.createElement("button");
        b.className = "tile";
        b.type = "button";
        b.textContent = text;
        b.dataset.value = text;

        b.addEventListener("click", () => {
            picks[questions[idx]] = b;

            // returnin' back those buttons placed in the holda' if any
            if ($holder.children.length > 0) {
                $bank.append($holder.firstElementChild);
            }

            updateHolder();
        });

        return b;
    }

    function renderNavigation(): void {
        $dots.innerHTML = '';
        questions.forEach((_, i) => {
            const el = document.createElement("button");
            el.className = "circle" + (i===idx ? " is-active": "");
            el.title = `Go to question ${i+1}`;
            el.addEventListener("click", () => { idx=i, updateDisplay(); });
            $dots.appendChild(el);
        })
    }

    function updateDisplay() {

        renderNavigation();
        const isLast =  idx === questions.length-1;

        // current question
        const q = questions[idx];
        $questionText.textContent = q;

        $hintText.textContent = left[questions[idx]] || "No hints :(";
        $hintText.classList.remove("is-open");

        $prev.disabled = idx === 0;
        $next.textContent = isLast ? 'Finish' : 'Next';

        $bank.innerHTML = '';
        answers.forEach(i => {
            const picksList = Object.values(picks)
            .map(btn => btn?.textContent ?? null)
            .filter((t): t is string => t !== null);

            // nope... not allowing to resent to all possible answers
            if (picksList.includes(i)) return;
            const ans = createAnswer(i);
            $bank.appendChild(ans);
        });

        // must add this class in the css
        if (isLast) $next.classList.toggle(".check");

    }

    function staggerAnimation() {
        $questionText.classList.remove("animate-fadeSlide");
        void $questionText.offsetWidth;
        $questionText.classList.add("animate-fadeSlide");

        // fade-in one by one animation for tiles
    }
    
    // CHECK FUNCTION 
    // ---------------------
    function check() {        

        const correctVal = 100 / state.total;

        questions.forEach(i => {

            const q = i;
            let btn: HTMLButtonElement;
            let a: string;
            
            if (picks[q]) {
                btn = picks[q];
                a = btn.textContent;
            } else return;            
                    
            if (resultMap[q] === a) {
                btn.classList.remove("correct");
                void btn.offsetWidth;
                btn.classList.add("correct");

                state.score += correctVal;
                state.correct++;
            } else {

                btn.classList.remove("wrong");
                void btn.offsetWidth;
                btn.classList.add("wrong");
                state.wrong.push(a);
            }
        });

        finish();
    }

    // RESULT HANDLER BRIDGE
    // ---------------------
    function finish() {
        
        const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);        
                
        const result: RendererResult = { 
            detail: { 
                correct: state.correct, 
                total: state.total, 
                score: state.score          
            }, 
            timestamp: timestamp,
            winningEl: getResultEl(state.score, state.correct, state.total, timestamp, state.wrong)
        };

        $bank.setAttribute("inert", "");
        $checkBtn.setAttribute("inert", "");
        
        if (resultHandler) {
            resultHandler(result);
        }
        
    }

    // Initialize and mount to parent element 
    // --------------------------------------    
    init();    
    mount.appendChild(root);
    return { destroy(): void {  mount.removeChild(root) }, check }
}

// ===================================================================// 
//                           PARSER                        
// ===================================================================//

export function validateMatchingSingle(data: {}): boolean { return true; }

// ===================================================================// 
//                           CONTRACT                         
// ===================================================================//

const exs = `
It's the most famous fruit in the world = apple;

A lot of small circles, usually purple = grapes;

A tree + the other red fruit = pineapple;

5 letters. Sweet and kinda small, usually yellow = mango;

@EXTRA = [banana | orange]
`;

export const MatchingSingleContract: ContractType = {
    name: "Matching Single",
    description: "Exploring questions and assigning answers with a single available pool of options.",    
    version: 1.0,
    parserVersion: 1.0,

    category: "relational",
    tags: ["relation", "binary-choice", "concept-tying"],

    usage: [ "...", "..." ],
    wrong: [ "...", "..."],

    grammarExample: [exs],

    defaultOptions: { shuffle: true, allowRetry: false, ariaLabel: "True False Exercise" },
    implementation: { renderer: matchingSingleRenderer, parser: parseMatching, validator: validateMatchingSingle },

    styleTag: 'mtc-single-style',
    html: baseHTML,
    css: baseCSS
}

