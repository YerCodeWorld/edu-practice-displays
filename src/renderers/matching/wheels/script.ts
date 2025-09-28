import {
    injectStyle,
    shuffle,
    createSection
} from "../../../utils/utils";

import {
    Pair,
    MatchData    
} from '../types';

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
} from '../utils';

import baseHTML from "./index.html";
import baseCSS from "./styles.css";

export function matchingWheelsRenderer(
    mount: HTMLElement,
    data: MatchData,
    options: RendererOptions = {}
): RendererHandle {

    const {        
        shuffle: doShuffle = true,
        allowRetry = true,
        resultHandler,
        ariaLabel = "Matching Wheels"
    } = options;

    const root = createSection("mtc-wheels-wrap", ariaLabel);    
    injectStyle("matching-wheels-style", baseCSS);    

    const $ = sel => root.querySelector(sel);

    const answers = answerKey(data);
    let topPool = shuffle(items(data, "left"));
    let bottomPool = shuffle([...items(data, "right"), ...(data.distractors || [])]);

    let topLabel: HTMLElement;
    let bottomLabel: HTMLElement;
    let lives: HTMLLabelElement;
    let solvedList: HTMLUListElement;
    let barFill: HTMLElement;

    let iT = 0;
    let iB = 0;
    let solved = [];

    function update() {
        // disable them when finished instead
        topLabel.textContent = topPool[iT] ?? '-';
        bottomLabel.textContent = topLabel.textContent === '-' ? '-' : bottomPool[iB];
    }

    function pushSolved(top, bottom) {
        const li = document.createElement('li');
        li.className = 'mtc-wheels-chip';
        li.textContent = `${top} = ${bottom}`;
        solvedList.appendChild(li);
    }

    function correctState(isCorrect: boolean) {
        const btn = $('#wheelsCheckBtn');
        btn.classList.remove('ok');
        if(isCorrect){
            btn.classList.add('ok'); btn.textContent = '✓ Correct';
            barFill.style.width = (100 * (solved.length + 1) / data.content.length) + '%';
        }
        else   { btn.textContent = '✗ Try again'; }

        if (topPool.length - 1 !== 0) {
            setTimeout(()=>{ btn.textContent = 'Check'; btn.classList.remove('ok'); }, 900);
        } else {
            barFill.style.background = "#66ff00";
        }
        // remove lives
    }

    function disableAll() {
        const container = $("#wheelsWrap");
        container?.setAttribute("inert", "");
    }

    function check() {

        const top = topPool[iT];
        const bottom = bottomPool[iB];

        const isCorrect: boolean = answers[topPool[iT]] === bottomPool[iB];

        correctState(isCorrect);

        if (isCorrect) {

            solved.push(top);
            pushSolved(topPool[iT], bottomPool[iB]);

            // remove - no dealing with infinite matching lol
            topPool = topPool.filter(x => x !== top);         

            if (topPool.length === 0) {
                finish();
                return;
            }
            
            iT = (iT) % topPool.length;
            update();   

        } else {            

            lives.textContent = lives.textContent.replace("❤️", "🤍");            

            root.classList.remove("shake-animation");
            void root.offsetWidth;
            root.classList.add("shake-animation");

            if (!lives.textContent.includes("❤️")) {
                finish();
            }

        }
    }

    function init() {
        const tpl = document.createElement('template');
        tpl.innerHTML = baseHTML.trim();

        root.replaceChildren(tpl.content);

        topLabel = $('#topLabel');
        topLabel.textContent = topPool[iT];

        bottomLabel = $('#bottomLabel');
        bottomLabel.textContent = bottomPool[iB];

        lives = root.querySelector("#mtc-wheels-lives") as HTMLLabelElement;        

        solvedList = $("#solvedList");
        barFill = $('#barFill');

        $('#prevTop').onclick = () => {
            iT = (iT - 1 + topPool.length) % topPool.length; update();
        };
        $('#nextTop').onclick = () => {
            iT = (iT + 1) % topPool.length; update();
        };
        $('#prevBottom').onclick = () => {
            iB = (iB - 1 + bottomPool.length) % bottomPool.length; update();
        };
        $('#nextBottom').onclick = () =>{
            iB = (iB + 1) % bottomPool.length; update();
        };
        $('#wheelsCheckBtn').onclick = check;
    }

    function finish() {

        if (!lives.textContent.includes("❤️")) {
            disableAll();
        } else {
            root.classList.add("success-jump");
        }

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

        styleTag: MatchingWheelsContract.styleTag,

        name: MatchingWheelsContract.name,

        finish

    }

}

function matchingWheelsValidator(data: any): boolean { return true; }

export const MatchingWheelsContract: ContractType = {
    name: "Matching Wheels",
    description: "Move objects in a rotating still in a top and bottom container to match them.",
        
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
apple 🍎 = red 🔴;
pear 🍐 = green 🟢;
grapes 🍇 = purple 🟣;  
banana 🍌 = yellow 🟡;
@EXTRA = [white ⚪ | black ⚫]
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
        ariaLabel: "Matching Wheels Exercise"
    },

    implementation: {
        renderer: matchingWheelsRenderer,
        parser: parseMatching,
        validator: matchingWheelsValidator
    },

    styleTag: 'matching-wheels-style',

    html: baseHTML,
    css: baseCSS
}

