// COLORS CATEGORIZE

import { injectStyle, createSection, shuffle, getResultEl } from "./../../../utils/utils";
import { RendererOptions, RendererHandle, ContractType, RendererResult } from '../../types';
import { CategorizeData, categorizeParser } from "../utils";

import baseHTML from './index.html';
import baseCSS from './styles.css';

// ===================================================================// 
//                           RENDERER                       
// ===================================================================//
function colorsCategorizeRenderer(

  mount: HTMLElement,
  data: CategorizeData,
  options: RendererOptions
  
): RendererHandle {

  // BASE COMPONENT UTILITIES 
  // ------------------------
  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = 'Color Categorizer Exercise',
    checkButtonEnabled = false
  } = options; 

  const root = createSection('colors-categorize', ariaLabel);
  injectStyle('colors-categorize-style', baseCSS);    

  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
    r.querySelector<T>(sel);

  // CONSTANTS 
  // ---------------------
  const palette = [ "#ef4444","#22c55e","#3b82f6","#f59e0b","#8b5cf6", "#ec4899","#a16207","#16a34a","#0ea5e9","#f97316", "#f5f5dc","#9ca3af"];
  const distractorSet = new Set(data.distractors || []); 
  // map the object list of category<->items to later use in the check function 
  const itemToCategory = new Map();  

  // VARIABLES 
  // ---------
  let assigned: Record<string, string[]> = {};   
  const categoryColors = new Map();  // track of category | assigned color   
  let activeColor = "rgb(var(--edu-card))"; // live-updating color/label categories 
  let activeCategory = "None";

  let total = 0;
  let correct = 0;
  let score = 0;
  let wrong: string[] = [];
  let startTime = Date.now();

  // HTML ELEMENTS  
  // -------------
  let $instructions: HTMLParagraphElement;
  let $colorsContainer: HTMLElement;
  let $container: HTMLElement;
  let $noneBtn: HTMLButtonElement;
  let $currentSwatch: HTMLElement;
  let $currentLabel: HTMLElement;    
  let $checkBtn: HTMLButtonElement;
  let $resetBtn: HTMLButtonElement;

  // INITIALIZER FUNCTION  
  // --------------------
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
    if (!options.checkButtonEnabled) {
	const $footer = $("#edc-footer") as HTMLElement; 
  	$footer.style.display = "none";
    } 
    
    $resetBtn = $("#cca-reset");
    $resetBtn.addEventListener("click", () => reset());

    for (const block of data.items) {
      assigned[block.category] = [];
      for (const w of block.words) itemToCategory.set(w, block.category);      
    }

    // populating painters 
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
        <span id="chip-counter-${block.category}">0</span>
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

  function updateCounters(word: string, el) {       
    if (activeCategory === "None") return;    

    const counter = root.querySelector(`#chip-counter-${activeCategory}`);

    // toggle color
    if (assigned[activeCategory].includes(word)) {          
      const idx = assigned[activeCategory].indexOf(word);               
      if (idx !== -1) {
        assigned[activeCategory].splice(idx, 1);
      }            
      
      el.style.background = "rgb(var(--edu-card))";
      counter.textContent = String(assigned[activeCategory].length);            
      return; 
    };         

    // reassign color if necessary
    for (const [k, v] of Object.entries(assigned)) {                    
      if (v.includes(word)) {                        
        // clean old fam
        const idx = assigned[k].indexOf(word);                       
        if (idx !== -1) {
          assigned[k].splice(idx, 1);
        }         
        const catCounter = root.querySelector(`#chip-counter-${k}`);
        catCounter.textContent = String(assigned[k].length);           
      }      
    }
                  
    assigned[activeCategory].push(word);        
    counter.textContent = String(assigned[activeCategory].length);         
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

        updateCounters(word, el);
        
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

    Object.keys(assigned).forEach(k => {
      const counter = root.querySelector(`#chip-counter-${k}`);
      counter.textContent = "0";
      assigned[k] = [];
    });
    
    setActivePainter("", "None", $noneBtn);
  }
  
  // CHECK FUNCTION 
  // --------------
  function check() {
    $container.querySelectorAll('.edu-categorize-item').forEach((el: HTMLButtonElement) => {
      total++;
      
      const word = el.textContent || "";      
      const chosen = el.dataset.color || "";

      let isCorrect = false;
      if (distractorSet.has(word)) {
        isCorrect = chosen === "" || chosen === "var(rgb(--edu-var))";        
      } else {
        const expectedCat = itemToCategory.get(word);        
        const expectedColor = expectedCat ? categoryColors.get(expectedCat) : "";        
        isCorrect = chosen && chosen === expectedColor;
      }
      
      el.dataset.result = isCorrect ? "ok" : "wrong";
      
      if (isCorrect) correct++;
      else wrong.push(word);      
    });

    finish();
  }

  // RESULT HANDLER BRIDGE 
  // ---------------------
  function finish() {
  
    const timestamp = ((Date.now() - startTime) / 1000).toFixed(1);
    score = (correct / total) * 100;

    const result: RendererResult = { 
      detail: { 
        correct: correct, 
        total: total, 
        score: score          
      }, 
      timestamp: timestamp,
      winningEl: getResultEl(score, correct, total, timestamp, wrong)
    };

    root.setAttribute("inert", "");

    if (resultHandler) {
      resultHandler(result);
    }
  }

  // Initialize and mount to parent  
  // --------------
  init();
  mount.appendChild(root);
  return { destroy(): void { mount.removeChild(root); }, check}
}

// ===================================================================// 
//                           PARSER                       
// ===================================================================//

// parser -> categorizeParser (imported)

function colorsCategorizeValidator(data: CategorizeData): boolean { return true; }

// ===================================================================// 
//                           CONTRACT                        
// ===================================================================//

const exs = `
# Categorize the countries with their continent

Asia = Thailand | Japan | Vietnam;
Europe = France | The Netherlands | Ukraine;
America = Colombia | Jamaica | Brazil;

@EXTRA = [Egypt | Madagascar];
`;

export const ColorCategorizeContract: ContractType = {
    name: "Colors Categorize",
    description: "...",        
    version: 1.0,
    parserVersion: 1.0,
    category: "input",
    tags: ["Complete", "...", "Missing Information"],

    usage: [ "...", "..." ],
    wrong: ["...", "..." ],

    grammarExample: [exs],

    defaultOptions: { shuffle: true, allowRetry: false, ariaLabel: "Colors Categorize Exercise" },
    implementation: { renderer: colorsCategorizeRenderer, parser: categorizeParser, validator: colorsCategorizeValidator },

    styleTag: 'colors-categorize-style',
    html: baseHTML,
    css: baseCSS
}; 

