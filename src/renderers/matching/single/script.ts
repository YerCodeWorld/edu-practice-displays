import {
    injectStyle,
    applyTheme,
    shuffle,
    createSection
} from "../../../utils/utils";

import {

    Pair,
    MatchData,

    MatchingRendererOptions,
    MatchingRendererHandle,

    QuizTheme,
    ComponentData

} from "../types";

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
            '--bg': '#eef6ff',
            '--card': '#f6fbff',
            '--ink': '#0f172a',
            '--muted': '#64748b',
            '--accent': '#2563eb',
            '--accent2': '#14b8a6',
            '--accent3': '#1f9edb',
            '--border': 'color-mix(in oklab, var(--ink) 28%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 10%, white)'
        }
    },
    light: {
        name: 'light',
        cssVariables: {
            '--bg': '#f9fafb',
            '--card': '#ffffff',
            '--ink': '#111827',
            '--muted': '#6b7280',
            '--accent': '#2563eb',
            '--accent2': '#16a34a',
            '--accent3': '#d97706',
            '--border': 'color-mix(in oklab, var(--ink) 20%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 12%, white)'
        }
    },
    dark: {
        name: 'dark',
        cssVariables: {
            '--bg': '#0f172a',
            '--card': '#1e293b',
            '--ink': '#f1f5f9',
            '--muted': '#94a3b8',
            '--accent': '#3b82f6',
            '--accent2': '#22c55e',
            '--accent3': '#eab308',
            '--border': 'color-mix(in oklab, var(--ink) 40%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 20%, black)'
        }
    },
    forest: {
        name: 'forest',
        cssVariables: {
            '--bg': '#f0fdf4',
            '--card': '#dcfce7',
            '--ink': '#064e3b',
            '--muted': '#10b981',
            '--accent': '#15803d',
            '--accent2': '#4ade80',
            '--accent3': '#84cc16',
            '--border': 'color-mix(in oklab, var(--ink) 25%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 10%, white)'
        }
    },
    deepForest: {
        name: 'deepForest',
        cssVariables: {
            '--bg': '#052e16',
            '--card': '#064e3b',
            '--ink': '#ecfdf5',
            '--muted': '#34d399',
            '--accent': '#22c55e',
            '--accent2': '#84cc16',
            '--accent3': '#facc15',
            '--border': 'color-mix(in oklab, var(--ink) 45%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 15%, black)'
        }
    },
    ocean: {
        name: 'ocean',
        cssVariables: {
            '--bg': '#ecfeff',
            '--card': '#cffafe',
            '--ink': '#083344',
            '--muted': '#06b6d4',
            '--accent': '#0ea5e9',
            '--accent2': '#22d3ee',
            '--accent3': '#0284c7',
            '--border': 'color-mix(in oklab, var(--ink) 25%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 12%, white)'
        }
    },
    deepOcean: {
        name: 'deepOcean',
        cssVariables: {
            '--bg': '#082f49',
            '--card': '#164e63',
            '--ink': '#e0f2fe',
            '--muted': '#38bdf8',
            '--accent': '#0ea5e9',
            '--accent2': '#06b6d4',
            '--accent3': '#f472b6',
            '--border': 'color-mix(in oklab, var(--ink) 40%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 18%, #082f49)'
        }
    },
    sunSet: {
        name: 'sunSet',
        cssVariables: {
            '--bg': '#fff7ed',
            '--card': '#ffedd5',
            '--ink': '#7c2d12',
            '--muted': '#f97316',
            '--accent': '#ea580c',
            '--accent2': '#f59e0b',
            '--accent3': '#c2410c',
            '--border': 'color-mix(in oklab, var(--ink) 28%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 15%, white)'
        }
    },
    moonSet: {
        name: 'moonSet',
        cssVariables: {
            '--bg': '#fdf4ff',
            '--card': '#fae8ff',
            '--ink': '#581c87',
            '--muted': '#d946ef',
            '--accent': '#9333ea',
            '--accent2': '#a855f7',
            '--accent3': '#db2777',
            '--border': 'color-mix(in oklab, var(--ink) 25%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 15%, white)'
        }
    },
    bright: {
        name: 'bright',
        cssVariables: {
            '--bg': '#ffffff',
            '--card': '#fef9c3',
            '--ink': '#1f2937',
            '--muted': '#eab308',
            '--accent': '#facc15',
            '--accent2': '#84cc16',
            '--accent3': '#ef4444',
            '--border': 'color-mix(in oklab, var(--ink) 20%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 15%, white)'
        }
    },
    neon: {
        name: 'neon',
        cssVariables: {
            '--bg': '#0f0f1a',
            '--card': '#1a1a2e',
            '--ink': '#e0e0ff',
            '--muted': '#c084fc',
            '--accent': '#22d3ee',
            '--accent2': '#a3e635',
            '--accent3': '#f472b6',
            '--border': 'color-mix(in oklab, var(--ink) 50%, transparent)',
            '--accent2-soft': 'color-mix(in oklch, var(--accent) 20%, black)'
        }
    }
};

export function matchingSingleRenderer(

    mount: HTMLElement,
    data: MatchData,
    options: MatchingRendererOptions = {}

): Omit<MatchingRendererHandle, "getState"> {

    const componentData: ComponentData = {
        name: "Single Matching",
        description: "A custom... renders all possible answers to all questions"
    };

    injectStyle("mtc-single-style", baseCSS);

    const {
        theme = themes.forest,
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "Matching Single Exercise"
    } = options;

    const root = createSection("mtc-single-wrapper", ariaLabel);
    applyTheme(root, theme);

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

        hintText.textContent = left[questions[idx]] || "";
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

        setTheme(): void {},

        componentData,

        finish
    }
}

export function validateMatchingSingle(data: {}): string[] {}

export const MatchingSingleContract: ContractType = {
    name: "Matching Single",
    description: "Exploring questions and assigning answers with a single available pool of options",
    
    themes,
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
      `It's the most famous fruit in the world = apple;
       A lot of small circles, usually purple = grapes;
       A tree + the other red fruit = pineapple;
       5 letters. Sweet and kinda small, usually yellow = mango`,
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

    html: baseHTML,
    css: baseCSS
}


