import {
  injectStyle,
  createSection,  
  shuffle
} from "./../../../utils/utils";

import {
  RendererOptions,
  RendererHandle,
  ContractType
} from '../../types';

import baseHTML from './index.html';
import baseCSS from './styles.css';

import { CategorizeData, categorizeParser } from "../utils";

function colorsCategorizeRenderer(
  mount: HTMLElement,
  data: CategorizeData,
  options: RendererOptions
): RendererHandle {

  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = 'Color Categorizer Exercise'
  } = options; 

  const root = createSection('colors-categorize', ariaLabel);
  injectStyle('colors-categorize-style', baseCSS);    

  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
    r.querySelector<T>(sel);

  const palette = [
    "#ef4444","#22c55e","#3b82f6","#f59e0b","#8b5cf6",
    "#ec4899","#a16207","#16a34a","#0ea5e9","#f97316",
    "#f5f5dc","#9ca3af"
  ];

  const itemToCategory = new Map();
  const distractorSet = new Set(data.distractors || []);
  
  const categoryColors = new Map();
  let activeColor = "";
  let activeCategory = "None";

  let $instructions: HTMLParagraphElement;
  let $colorsContainer: HTMLElement;
  let $container: HTMLElement;
  let $noneBtn: HTMLButtonElement;
  let $currentSwatch: HTMLElement;
  let $currentLabel: HTMLElement;    
  let $checkBtn: HTMLButtonElement;
  let $resetBtn: HTMLButtonElement;

  function init() {  

    root.innerHTML = baseHTML; 

    $instructions = $("#cca-instruction");
    $instructions.textContent = data.instruction; 
    
    $currentLabel = $("#cca-current-label");
    $currentLabel.textContent = "None";
    
    $currentSwatch = $("#cca-current-swatch");
    $currentSwatch.style.background = "rgb(var(--edu-card))";
    
    $noneBtn = $("#cca-none");
    $noneBtn.addEventListener("click", () => setActivePainter("rgb(var(--edu-card))", "None", $noneBtn));
    
    $container = $("#cca-grid");  
    $colorsContainer = $("#cca-palette");     

    $checkBtn = $("#cca-check");
    $checkBtn.addEventListener("click", () => check());
    
    $resetBtn = $("#cca-reset");
    $resetBtn.addEventListener("click", () => reset());

    for (const block of data.items) {
      for (const w of block.words) itemToCategory.set(w, block.category);
    }

    // populating painters in he
    data.items.forEach((block, idx: number) => {
      const color = palette[idx % palette.length];
      categoryColors.set(block.category, color);

      const btn = document.createElement('button');
      btn.type = "button";
      btn.className = "edu-categorize-chip";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", `Paint: ${block.category}`);
      btn.innerHTML = `
        <span class="edu-categorize-swatch" style="background:${color}"></span>
        <span>${block.category}</span>
      `;
      btn.addEventListener("click", () => setActivePainter(color, block.category, btn));
      $colorsContainer.appendChild(btn);      
    });            

    renderItems();
  
  }

  function setActivePainter(color: string, label: string, btn: HTMLButtonElement): void {
  
    $colorsContainer.querySelectorAll(".edu-categorize-chip").forEach((b: HTMLButtonElement) => {
      b.setAttribute("aria-pressed", "false");
      b.dataset.active = "false";
    });

    btn.setAttribute("aria-pressed", "true");
    btn.dataset.active = "true";

    activeColor = color;
    activeCategory = label;
    $currentSwatch.style.background = color || "rgb(var(--edu-card))";
    $currentLabel.textContent = label || "None";    
        
    document.documentElement.style.setProperty('--current-color', color, 'important');    

  }
  
  function renderItems() {
    const allWords = shuffle([ ...data.items.flatMap(b => b.words), ...(data.distractors || []) ]);

    $container.innerHTML = "";

    for (const word of allWords) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "edu-categorize-item";
      el.textContent = word;
      el.dataset.color = "";
      el.dataset.result = "";
      el.addEventListener("click", () => {
        el.style.background = activeColor || "rgb(var(--edu-card));";
        el.dataset.color = activeColor;
        el.dataset.result = "";        
      });
      $container.appendChild(el);
    }
    
  }
  
  function reset() {
    $container.querySelectorAll('.edu-categorize-item').forEach((el: HTMLButtonElement) => {
      el.style.background = "rgb(var(--edu-card))";
      el.dataset.color = "";
      el.dataset.result = "";
    });
    setActivePainter("", "None", $noneBtn);
  }
  
  function check() {
    $container.querySelectorAll('.edu-categorize-item').forEach((el: HTMLButtonElement) => {
      const word = el.textContent || "";
      const chosen = el.dataset.color || "";

      let isCorrect = false;
      if (distractorSet.has(word)) {
        isCorrect = chosen === "";
      } else {
        const expectedCat = itemToCategory.get(word);
        
        const expectedColor = expectedCat ? categoryColors.get(expectedCat) : "";
        
        isCorrect = chosen && chosen === expectedColor;
      }
      el.dataset.result = isCorrect ? "ok" : "wrong";
    });
  }

  function finish() {}

  init();
  mount.appendChild(root);

  return {

    destroy(): void { mount.removeChild(root); },
  
    styleTag: ColorCategorizeContract.styleTag,

    name: ColorCategorizeContract.name,

    finish 
  }

}

function colorsCategorizeValidator(data: CategorizeData): boolean { return true; }

export const ColorCategorizeContract: ContractType = {
    name: "Colors Categorize",
    description: "...",
        
    version: 1.0,
    parserVersion: 1.0,

    category: "input",
    tags: ["Complete", "...", "Missing Information"],

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
# Categorize the countries with their continent

Asia = Thailand | Japan | Vietnam;
Europe = France | The Netherlands | Ukraine;
America = Colombia | Jamaica | Brazil;

@EXTRA = [Egypt | Madagascar];
      `
    ],

    defaultOptions: {
        shuffle: true,
        allowRetry: false,
        ariaLabel: "Colors Categorize Exercise"
    },

    implementation: {
        renderer: colorsCategorizeRenderer,
        parser: categorizeParser,
        validator: colorsCategorizeValidator
    },

    styleTag: 'colors-categorize-style',

    html: baseHTML,
    css: baseCSS
}; 

