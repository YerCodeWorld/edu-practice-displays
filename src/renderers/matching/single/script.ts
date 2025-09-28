import {
    injectStyle,    
    shuffle,
    createSection
} from "../../../utils/utils";

import {
    Pair,
    MatchData
} from "../types";

import {    
  RendererOptions,
  RendererHandle,
  ContractType
} from '../../types';

import {
    items,
    distractors,
    answerKey,
    parseMatching
} from "../utils";

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

export function matchingSingleRenderer(

    mount: HTMLElement,
    data: MatchData,
    options: RendererOptions = {}

): RendererHandle {    

    const {        
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "Matching Single Exercise"
    } = options;

    const root = createSection("mtc-single", ariaLabel);
    injectStyle("mtc-single-style", baseCSS);    

    const resultMap = answerKey(data);
    const questions = shuffle(items(data, "left"));
    const answers = shuffle([...items(data, "right"), ...(data.distractors || [])]);

    let dots: HTMLDivElement;
    let hintBtn: HTMLButtonElement;
    let hintText: HTMLDivElement;
    let questionText: HTMLLabelElement;
    let bank: HTMLDivElement;
    let holder: HTMLDivElement;
    let dropzone: HTMLDivElement;
    let prev: HTMLButtonElement;
    let next: HTMLButtonElement;
    let checkBtn: HTMLButtonElement;

    const els = {};
    const picks: Record<string, HTMLButtonElement | null> = {};
    questions.forEach(q => picks[q] = null);

    let idx = 0;

    // need hints mapping
    let left:  Record<string, string> = {};
    data.content.forEach(item => {
        left[item.left] = item.hint;
    });;

    const state = {

        score: 0,
        incorrect: [],
        time: 0
        
    }; 

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

    function check() {

        let score = 0;

        questions.forEach(i => {

            const q = i;
            const btn = picks[q];
            const a = btn.textContent;

            if (resultMap[q] === a) {

                btn.classList.remove("correct");
                void btn.offsetWidth;
                btn.classList.add("correct");

                score++;
            } else {

                btn.classList.remove("wrong");
                void btn.offsetWidth;
                btn.classList.add("wrong");

            }

        });

        finish();

    }

    function updateHolder() {
        holder.innerHTML = '';
        const el = picks[questions[idx]];
        if (el === undefined || el === null) return;
        holder.appendChild(el);
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
            if (holder.children.length > 0) {
                bank.append(holder.firstElementChild);
            }

            updateHolder();
        });

        return b;
    }

    function renderNavigation(): void {
        dots.innerHTML = '';
        questions.forEach((_, i) => {
            const el = document.createElement("button");
            el.className = "circle" + (i===idx ? " is-active": "");
            el.title = `Go to question ${i+1}`;
            el.addEventListener("click", () => { idx=i, updateDisplay(); });
            dots.appendChild(el);
        })
    }

    function updateDisplay() {

        renderNavigation();
        const isLast =  idx === questions.length-1;

        // current question
        const q = questions[idx];
        questionText.textContent = q;

        hintText.textContent = left[questions[idx]] || "No hints :(";
        hintText.classList.remove("is-open");

        prev.disabled = idx === 0;
        next.textContent = isLast ? 'Finish' : 'Next';

        bank.innerHTML = '';
        answers.forEach(i => {
            const picksList = Object.values(picks)
            .map(btn => btn?.textContent ?? null)
            .filter((t): t is string => t !== null);

            // nope... not allowing to resent to all possible answers
            if (picksList.includes(i)) return;
            const ans = createAnswer(i);
            bank.appendChild(ans);
        });

        // must add this class in the css
        if (isLast) next.classList.toggle(".check");

    }

    function staggerAnimation() {
        questionText.classList.remove("animate-fadeSlide");
        void questionText.offsetWidth;
        questionText.classList.add("animate-fadeSlide");

        // fade-in one by one animation for tiles
    }

    function init() {        
        
        root.innerHTML = '';
        root.innerHTML = baseHTML;

        const $ = cn => root.querySelector(cn);

        dots = $("#mtc-single-dots");
        hintBtn = $("#mtc-single-hint-btn");
        hintText = $("#mtc-single-hint");
        questionText = $("#mtc-single-question");
        bank = $("#mtc-single-bank");
        holder = $("#mtc-single-holder");
        prev = $("#mtc-single-prevBtn");;
        next = $("#mtc-single-nextBtn");
        checkBtn = $("#mtc-single-check");

        hintText.textContent = 'Yahir was here';

        // click events
        checkBtn.addEventListener("click", () => check());

        hintBtn.addEventListener("click", () => {
            hintText.classList.toggle("is-open");
        })

        prev.addEventListener("click", () => {
            staggerAnimation();
            if (idx > 0) { idx--; updateDisplay(); }
            updateHolder();
        });

        next.addEventListener("click", () => {
            staggerAnimation();
            if (idx < questions.length - 1) { idx++; updateDisplay(); }
            updateHolder();
        });

        holder.addEventListener("click", () => {
            const child = holder.firstElementChild as HTMLButtonElement | null;
            if (child === null) return;
            bank.appendChild(child);
            picks[questions[idx]] = null;
            updateHolder();
        });
        
        updateDisplay();
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

        destroy(): void {  mount.removeChild(root) },        

        styleTag: MatchingSingleContract.styleTag,

        name: MatchingSingleContract.name,

        finish
    }
}

export function validateMatchingSingle(data: {}): boolean { return true; }

export const MatchingSingleContract: ContractType = {
    name: "Matching Single",
    description: "Exploring questions and assigning answers with a single available pool of options.",
    
    version: 1.0,
    parserVersion: 1.0,

    category: "relational",
    tags: ["relation", "binary-choice", "concept-tying"],

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
It's the most famous fruit in the world = apple;

A lot of small circles, usually purple = grapes;

A tree + the other red fruit = pineapple;

5 letters. Sweet and kinda small, usually yellow = mango;

@EXTRA = [banana | orange]
        `,
       
      `The capital of France :: Paris;
       Biggest Dessert in the world :: Sahara;
       Largest river in the world :: Amazon;
       Country almost considered a continent :: Australia;`
    ],

    defaultOptions: {
        shuffle: true,
        allowRetry: false,
        ariaLabel: "True False Exercise"
    },

    implementation: {
        renderer: matchingSingleRenderer,
        parser: parseMatching,
        validator: validateMatchingSingle
    },

    styleTag: 'mtc-single-style',

    html: baseHTML,
    css: baseCSS
}

