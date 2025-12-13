// CATEGORIZE SINGLE 

import { injectStyle, createSection, removeDistractors, shuffle, getResultEl } from "./../../../utils/utils";
import { RendererOptions, RendererHandle, ContractType, RendererResult } from '../../types';
import { CategorizeData, categorizeParser } from "../utils";

import baseHTML from './index.html';
import baseCSS from './styles.css';

// ===================================================================// 
//                           RENDERER                       
// ===================================================================//
function singleCategorizeRenderer(

  mount: HTMLElement,
  data: CategorizeData,
  options: RendererOptions
  
): RendererHandle {

  // BASE COMPONENT UTILITIES 
  // ------------------------
  const {    
    allowRetry = true,
    resultHandler,
    ariaLabel = 'Single Categorize Exercise',
    checkButtonEnabled = false 
  } = options; 

  const root = createSection('categorize-single-root', ariaLabel);
  injectStyle('colors-categorize-style', baseCSS);    

  const $ = <T extends Element>(sel: string, r: ParentNode=root): T | null => 
    r.querySelector<T>(sel);

  const $$ = (sel, r=mount) => [...r.querySelectorAll(sel)];
    
  // HTML ELEMENTS 
  // -------------
  let $instruction: HTMLParagraphElement;
  let $question: HTMLParagraphElement;
  let $progress: HTMLSpanElement; 
  let $grid: HTMLElement;
  let $prev: HTMLButtonElement; 
  let $next: HTMLButtonElement; 
  let $check: HTMLButtonElement;   
  let $dialog: HTMLDialogElement; 
  let $dialogTitle: HTMLDivElement; 
  let $dialogBody: HTMLDivElement; 
  let $dialogClose: HTMLButtonElement;   
  
  // VARIABLES  
  // ------------- 
  let colorByCategory = new Map();  // map the color of each category -> useful for the check() function     
  let categories: Array<{ 
    // KEEP state of the categories and the items added to them 
    name: string, 
    color: string, 
    items: number[], 
    _els?: { card: HTMLElement, count: HTMLDivElement, label: HTMLSpanElement } 
  }>;  

  let order: number[];
  let cursor = 0;  // nav
  let assigned = new Set<number>(); // index of all questions that have already being assigned
  let checked = false;  // to paint the border of good / bad

  // for the score, let's first assign a value to each category based on 100 divided by the number of categories.
  // (val = 100 / cats.length), then for each word assign a value dividing the amount of words by the value 
  // of the category (itemVal = items.length / val). Plus equal this itemVal each time  
  let score = 0; 
  let total = 0;
  let correct = 0; 
  let startTime = Date.now();
  let wrong: string[] = [];    

  // CONSTANTS 
  // ---------
  const palette = ["#ef4444","#22c55e","#3b82f6","#f59e0b","#8b5cf6", "#ec4899","#a16207","#16a34a","#0ea5e9","#f97316", "#f5f5dc","#9ca3af"];
  const bank: Array<{text: string, trueCategory: string | null}> = [];    // simple mapping utility for each word in the exercise | not a real constant 
  const currentIndex = () => order[cursor] ?? null;
  const goToNext = () => { if (cursor < order.length-1) { cursor++ } updateQuestion() };
  const goToPrev = () => { if (cursor > 0) { cursor-- } updateQuestion() };

  // INITIALIZER FUNCTION 
  // ---------
  function init() {  

    root.innerHTML = baseHTML; 

    // ...asign 
    $instruction = $('#cats-instruction');
    $instruction.textContent = data.instruction || "Categorize every sentence into a category";    
    $question = $('#cats-question');
    $progress = $('#cats-progress');
    $grid = $('#cats-grid');    
    $next = $('#cats-next');      
    $prev = $('#cats-prev');
    $check = $('#cats-check');        
        
    $dialog = root.querySelector('#cats-dialog');
    $dialogTitle = root.querySelector('#cats-dialog-title');
    $dialogBody = root.querySelector('#cats-dialog-body');    
    $dialogClose = root.querySelector('#cats-dialog-close');     
        
    if (!options.checkButtonEnabled) { 
      const $footer = $("#ccs-footer") as HTMLElement; 
      $footer.style.display = "none"; 
    };

    // ...bundle 
    data.items.forEach((cat, idx) => {
      const color = palette[idx % palette.length];
      colorByCategory.set(cat.category, color);       
      cat.words.forEach(i => {  // check this out
        bank.push({ text: i, trueCategory: cat.category }) 
      });
    });

    if (Array.isArray(data.distractors)) {
      data.distractors.forEach(w => bank.push({ text: w, trueCategory: null }) );
    }
    
    categories = data.items.map(c => { 
      return { name: c.category, color: colorByCategory.get(c.category), items: [] } 
    });
    order = shuffle(bank.map((_, i) => i))

    // event listeners 
    $next.addEventListener('click', goToNext);
    $prev.addEventListener('click', goToPrev);
    $check.addEventListener('click', check);

    renderGrid();
    updateQuestion();            
  }

  // RENDERER-SPECIFIC LOGIC 
  // ---------
  function updateQuestion() {
    const idx = currentIndex();

    const total = order.length; 
    $progress.textContent = `${Math.min(cursor+1, total)} / ${total}`;    
    
    if (idx === null || idx === undefined) {
      $question.textContent = 'Done!';
      $next.disabled = true;
      $prev.disabled = (cursor <= 0);
      return;
    }    

    $question.textContent = bank[idx].text;
    $next.disabled = (cursor >= order.length-1);
    $prev.disabled = (cursor <= 0);
  }

  function renderGrid() {
    $grid.innerHTML = '';
    
    /**      
      <article 
        class="categorize-single-card neutral" 
        style="
          border-color: ${cat.color}; 
          background: linear-gradient(180deg, color-mix(in srgb, ${cat.color} 8%, transparent), transparent)"
      >
        <span class="categorize-single-label" style="border-color: ${cat.color}; background: color-mix(in srgb, ${cat.color} 25%, transparent)">
          ${cat.name}
        </span>

        <div class="categorize-single-open" type="button">
          See 👁
        </div>
      </article>
    `
    **/
    
    categories.forEach((cat, i) => {

      const card = document.createElement('article');
      card.className = 'categorize-single-card neutral';
      card.style.setProperty('border-color', cat.color);
      card.style.setProperty('background', `linear-gradient(180deg, color-mix(in srgb, ${cat.color} 8%, transparent), transparent)`);

      const label = document.createElement('span');
      label.className = 'categorize-single-label';
      label.style.setProperty('border-color', cat.color);
      label.style.setProperty('background', `color-mix(in srgb, ${cat.color} 25%, transparent)`);
      label.textContent = cat.name;

      const count = document.createElement('div');
      count.className = 'categorize-single-count';
      count.textContent = String(cat.items.length);

      const open = document.createElement('button');
      open.className = 'categorize-single-open';
      open.type = 'button';
      open.textContent = 'See 👁';

      card.addEventListener('click', (e) => {
        if (e.target === open) return; 
        const idx = currentIndex();
        if (idx === null) return;

        if (assigned.has(idx)) { alert('Another category already has this item'); return; }; 

        cat.items.push(idx);
        assigned.add(idx);
        count.textContent = `${cat.items.length} ${cat.items.length === 1 ? 'item' : 'items'}`;

        if (cursor < order.length -1) goToNext(); else updateQuestion();
      });

      open.addEventListener('click', () => { 
        openDialog(cat); 
      });

      card.append(label, count, open);
      $grid.append(card);

      // Keep a back-ref for quick updates
      cat._els = { card, count, label };
      
    });    
  }

  // : { name: string, color: string, items: string[] }
  function openDialog(cat): void {
  
    $dialogTitle.textContent = cat.name;

    if (cat.items.length === 0 ) $dialogBody.innerHTML = "<p>No items in this category</p>";
    else $dialogBody.innerHTML = '';

    cat.items.forEach((idx, pos) => {
      const row = document.createElement('div');
      row.className = 'categorize-single-drow';

      const p = document.createElement('p');
      p.textContent = bank[idx].text;

      if (checked) {
        const isOk = bank[idx].trueCategory === cat.name;
        row.classList.add(isOk ? 'good' : 'bad');
      }

      const btn = document.createElement('button');
      btn.className = 'categorize-single-remove';
      btn.textContent = 'Remove';

      btn.addEventListener('click', () => {
        cat.items.splice(pos, 1);
        assigned.delete(idx);
        if (!order.includes(idx)) order.push(idx);

        cat._els.count.textContent = String(cat.items.length);
        updateQuestion();

        row.remove();
      });

      row.appendChild(p);
      row.appendChild(btn);
      $dialogBody.appendChild(row);
      
    });

    if (typeof $dialog.showModal === 'function') $dialog.showModal();
    else $dialog.setAttribute('open', '');
    
    if ($dialogClose) $dialogClose.addEventListener('click', () => $dialog?.close?.());
  
  }  

  // CHECK FUNCTION 
  // --------------
  function check() {

    checked = true;       
    
    const categoryValue = 100 / categories.length;             

    categories.forEach(cat => {      
      const itemValue = categoryValue / cat.items.length; 
      
      let good = 0, bad = 0;
      cat.items.forEach(idx => {  // idx is not a number! 
        total++;
        const item = bank[idx];
        const ok = item.trueCategory === cat.name;
        
        if (ok) { 
          correct++; 
          good++;
          score += itemValue;
        } else { 
          bad++;
          wrong.push(item.text);
        };
      });

      cat._els.card.classList.remove('good', 'bad', 'neutral');
      if (bad === 0 && good > 0) {
        cat._els.card.classList.add('good');
      } else if (bad > 0) {
        cat._els.card.classList.add('bad');
      } else {
        cat._els.card.classList.add('neutral');        
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
        correct: correct, 
        total: total, 
        score: score          
      }, 
      timestamp: timestamp,
      // create a better showcase that takes an object (string, string[]) to detail
      // wrong answers for each category instead 
      winningEl: getResultEl(score, correct, total, timestamp, wrong)
    };

    // only grab the body of the dialog this time 
    $dialogBody.setAttribute("inert", "");

    if (resultHandler) {
      resultHandler(result);
    }
  }

  // Initialize and mount  
  // ------------------------
  init();
  mount.appendChild(root);

  return {
    destroy(): void { mount.removeChild(root); },
    check
  }

}

// ===================================================================// 
//                           CONTRACT                        
// ===================================================================//

// parser -> categorizeParser (imported )

function singleCategorizeValidator(data: CategorizeData): boolean { return true; }

// ===================================================================// 
//                           CONTRACT                        
// ===================================================================//

const exs = `
# Categorize the statements with their continents 

Asia = "Has the largest country in the world in it" | 
"It's where the most ancient religions come from";
      
Europe = "Continent where the roman empire had most of its territory" |
"You can find monuments like the eiffel tower in here" |
"People in this continent usually like more classical music";

America = "People in this continent usually like rythmic music like Salsa" |
"Has great beaches, specially in the caribbean |
"It's a continent that's usually divided in two or even 3 regions";          
`;

export const CategorizeSingleContract: ContractType = {
    name: "Single Categorize",
    description: "...",        
    version: 1.2,
    parserVersion: 1.0,
    category: "input",
    tags: ["Complete", "...", "Missing Information"],

    usage: ["...", "..."],
    wrong: ["...","..."],

    grammarExample: [exs],

    defaultOptions: { shuffle: true, allowRetry: false, ariaLabel: "Single Categorize Exercise" },
    implementation: { renderer: singleCategorizeRenderer, parser: categorizeParser, validator: singleCategorizeValidator },
    
    styleTag: 'single-categorize-style',
    html: baseHTML,
    css: baseCSS
}; 

