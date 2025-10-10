import innerHTML from "./html/edu-mcq.html";
import { EduMCQData } from "../utils/utils";
const tpl = document.createElement("template");
tpl.innerHTML = innerHTML; 

const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';  

export class EduMCQ extends HTMLElement {
  static get observedAttributes() { return ['hint-open'] }

  private _$prompt!: HTMLHeadingElement; 
  private _$hint!: HTMLDivElement;
  private _$media!: HTMLImageElement;
  private _$opts!: HTMLDivElement;
  private _$hintBtn!: HTMLButtonElement;

  private _data: EduMCQData = { 
    img: '', 
    question: '', 
    hint: '', 
    options: [], 
    correctOptions: [] 
  }; 
  
  private _selected = new Set<string>(); // state   
  private _isChecked = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).appendChild(tpl.content.cloneNode(true));
    
    const $ = <T extends Element>(sel: string, r: ParentNode = this.shadowRoot!): T | null => 
      r.querySelector<T>(sel);

    this._$prompt = $("#prompt") as HTMLHeadingElement;
    this._$hint = $("#hint") as HTMLDivElement;
    this._$media = $("#media") as HTMLImageElement;
    this._$opts = $("#options") as HTMLDivElement;
    this._$hintBtn = $("#hintToggle") as HTMLButtonElement;    

    this._$hintBtn.addEventListener("click", this.toggleHint);

    // would be good to add an internal keyboard event listener 
    // for inter-options navigation         
  }

  set data(v: EduMCQData) {
    const opts = Array.from(new Set([...(v?.options ?? []), ...(v?.correctOptions ?? [])]));;
    this._data = {
      img: v?.img ?? '',
      hint: v?.hint ?? '',
      question: v?.question ?? '',
      options: opts,
      correctOptions: Array.isArray(v?.correctOptions) ? v.correctOptions : [],
    };
    this.render();
  }

  render() {
    this._$prompt.textContent = this._data.question || 'No question';
    this._$hint.textContent = this._data.hint || 'No hints bro :('; 

    const imgUrl = this._data.img;
    if (imgUrl) {
      this._$media.src = imgUrl; 
      this.removeAttribute('no-media');
    } else {
      this.setAttribute('no-media', '');
    }        

    // clean-up
    this._$opts.innerHTML = '';
    this._selected.clear();

    this._data.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.type = 'button';
      btn.className = 'option';
      btn.setAttribute('role', 'checkbox');
      btn.setAttribute('aria-checked', 'false');
      btn.dataset.value = text; 

      btn.innerHTML = `
        <span class="badge">${ABC[i] ?? ''}</span>
        <p class="text">${text}</p>
      `;

      btn.addEventListener('click', () => {
        const v = btn.dataset.value;
        if (this._selected.has(v)) this._selected.delete(v);
        else this._selected.add(v);        
        this.syncSelectedUI();
      });

      this._$opts.appendChild(btn);
    });
  }

  private toggleHint = () => {
    const open: boolean = !this.hasAttribute('hint-open');
    this.toggleAttribute('hint-open', open);
    this._$hintBtn.setAttribute('aria-expanded', String(open));
  }

  // whenever we are not lazy enough to implement 
  clear() {}
  
  showFeedback(): {
    total: number, 
    correct: number, 
    wrong: string[],
    missed: string[] 
  } {    

    let wrong: string[] = [];
    let missed: string[] = [];
    let correct: number = 0;
    let total: number = this._data.correctOptions.length; 
    
    if (this._isChecked) return;
    const correctSet = new Set(this._data.correctOptions);
    [...this._$opts.children].forEach((el: HTMLButtonElement) => {
      const v = el.dataset.value;
      const isSel = this._selected.has(v);
      
      if (!isSel && this._data.correctOptions.includes(v)) {                 
        el.dataset.state = 'warning';
        missed.push(v);
        return;
      };      

      if (!this._data.correctOptions.includes(v) && isSel) wrong.push(v);      
      
      const isCorrect = correctSet.has(v);
      el.dataset.state = isSel ? (isCorrect ? 'correct' : 'wrong') : '';      
      if (isCorrect) correct++;
      
      if (!el.dataset.state) el.removeAttribute('data-state');
    });
    
    this.setAttribute('inert', '');
    this._isChecked = true; 

    return {
      total: total, 
      correct: correct, 
      wrong: wrong,
      missed: missed 
    }
  }
  
  syncSelectedUI() {
    [...this._$opts.children].forEach((el: HTMLButtonElement) => {

      const v = el.dataset.value;
      const sel = this._selected.has(v);
      el.setAttribute('aria-checked', String(sel));
      el.dataset.state = sel ? 'selected' : '';
      if (!sel) el.removeAttribute('data-state');
      
    });
  }

  attributeChangedCallback(name: string) {
    if (name === 'hint-open') this._$hintBtn?.setAttribute('aria-expanded', String(this.hasAttribute('hint-open')));
  }
}

if (!customElements.get('edu-mcq')) customElements.define('edu-mcq', EduMCQ);
