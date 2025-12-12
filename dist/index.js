function W(n,t){if(!(typeof document>"u")&&!document.getElementById(n)){let e=document.createElement("style");e.id=n,e.textContent=t,document.head.appendChild(e)}}function Q(n){let t=[...n];for(let e=t.length-1;e>0;e--){let i=Math.random()*(e+1)|0;[t[e],t[i]]=[t[i],t[e]]}return t}function V(n,t){let e=document.createElement("section");return e.className=n,e.setAttribute("role","region"),e.setAttribute("aria-label",t),e}function We(n){let t=/@EXTRA\s*(?:=|::)\s*\[(.*?)\]/,e=/@EXTRA\s*(?:=|::)\s*\[(.*?)\]/g,i=[],o="",s=Array.from(n.matchAll(e),c=>c[1]);if(s.length===0)return{ok:!0,resultString:n,errors:"no matches for @EXTRA distractors in the provided string"};if(s.length>1)return{ok:!1,resultString:n,errors:"More than one @EXTRA distractors identifier found."};console.log(s),i=s[0].split("|").map(c=>c.trim()).filter(c=>c.length>0);let v=n.replace(t,"");return{ok:!0,distractors:i,resultString:v}}function oe(n){let t=/@TITLE\s*=\s*([^;]+);?/i,e=n.match(t);if(!e)return{rest:n};let i=e[1].trim(),o=n.replace(e[0],"").trim();return{title:i,rest:o}}function ie(n){let t=n.split(/\r?\n/,1)[0]?.trim()??"",e=/^->\s*(.+)$/,i=/^#\s*(.+)$/;if(e.test(t)){let o=t.replace(e,"$1").trim(),s=n.replace(/^[^\n]*\n?/,"");return{label:o,cleaned:s.trim()}}if(i.test(t)){let o=t.replace(i,"$1").trim(),s=n.replace(/^[^\n]*\n?/,"");return{label:o,cleaned:s.trim()}}return{label:"",cleaned:n.trim()}}function se(n){let t=[],e="",i=0;for(let s=0;s<n.length;s++){let v=n[s];if(v==="("&&i++,v===")"&&(i=Math.max(0,i-1)),v===";"&&i===0){let c=e.trim();c&&t.push(c),e=""}else e+=v}let o=e.trim();return o&&t.push(o),t}function Ve(n){let t=n.match(/<\s*(data:[^>\s]+|https?:\/\/[^>\s]+)\s*>/i);if(!t)return{cleaned:n.trim()};let e=n.replace(t[0],"").trim();return{img:t[1],cleaned:e}}function ge(n){return n.split("|").map(t=>t.trim()).filter(Boolean)}function me(n){return[...new Set(n)]}function U(n,t,e,i,o){let s=document.createElement("ul");o.forEach(c=>{let r=document.createElement("li");r.textContent=c,s.appendChild(r)});let v=document.createElement("div");return v.innerHTML=`            
      <header>
        <h4>${t} of ${e} correct! ${String(n).slice(0,4)}/100</h4>
        <small>${String(i).slice(0,4)} seconds</small>
        <p>${t!==e?"Better luck next time":"Very nice job!"}</p>          
      </header>        
      <p>Wrong Answers: </p>    
    `,t<e?v.appendChild(s):v.innerHTML+="<p>0 wrong answers \u{1F973}</p>",v}function ee(n){let t=ht(n);if(!t.ok)return{ok:!1,errors:t.errors};let e=t.distractors??[],i=t.resultString??n,o=[],s=[...i.trim().split(";")];for(let v of s){if(v.trim()==="")continue;let c=v.includes("="),r=v.includes("::");if(c&&r)return{ok:!1,errors:`Ambiguous separators in ${v}`};let A=v.split("=").length-1,f=v.split("::").length-1;if((A||f)>1)return{ok:!1,errors:`More than one separator found in a single sentence: ${v}`};if(!c&&!r)return{ok:!1,errors:`No separators found in ${v}`};let L="";c?L="=":L="::";let[x,a]=v.split(L,2).map(g=>g.trim());if(!(x&&a))return{ok:!1,errors:`Incomplete pair at: ${v}`};o.push({left:x,right:a})}return{ok:!0,content:{content:o,distractors:e}}}function ht(n){let t=/@EXTRA\s*(?:=|::)\s*\[(.*?)\]/,e=/@EXTRA\s*(?:=|::)\s*\[(.*?)\]/g,i=[],o="",s=Array.from(n.matchAll(e),c=>c[1]);if(s.length===0)return{ok:!0,resultString:n,errors:"no matches for @EXTRA distractors in the provided string"};if(s.length>1)return{ok:!1,resultString:n,errors:"More than one @EXTRA distractors identifier found."};console.log(s),i=s[0].split("|").map(c=>c.trim()).filter(c=>c.length>0);let v=n.replace(t,"");return{ok:!0,distractors:i,resultString:v}}var Y=(n,t)=>n.content.map(e=>t==="right"?e.right:e.left);var te=n=>Object.fromEntries(n.content.map(t=>[t.left,t.right]));var Qe={victory:"victory.mp3",failure:"failure.mp3",click:"click.mp3"},ae=null,he=async()=>(ae||(ae=new(window.AudioContext||window.webkitAudioContext)),ae.state==="suspended"&&await ae.resume(),ae),be=new Map;function ft(n){return`${(import.meta?.env?.BASE_URL??"/").replace(/\/$/,"")}/audio/${n}`}async function Ue(n){return be.has(n)||be.set(n,(async()=>{let[t,e]=await Promise.all([he(),fetch(ft(Qe[n]))]),i=await e.arrayBuffer();return t.decodeAudioData(i)})()),be.get(n)}async function $e(n,t={}){let e=await he(),i=await Ue(n),o=e.createBufferSource();o.buffer=i,t.rate&&(o.playbackRate.value=t.rate);let s=e.createGain();s.gain.value=t.volume??1,o.connect(s).connect(e.destination),o.loop=!!t.loop,o.start()}async function Rr(n){let t=n??Object.keys(Qe);await Promise.all(t.map(Ue))}async function Br(){let n=await he();n.state==="suspended"&&await n.resume()}var fe=`<div class="matching-wrap">

    <div class='matching-card'>
        <div class="edu-match__indicators">
            <h3 >{{leftColumnName}}</h3>
            <h3>{{rightColumnName}}</h3>
        </div>

        <div class="edu-matching__game">
            <div class="edu-matching__column">
                <div id="left-items"></div>
            </div>

            <div class="edu-matching__column">
                <div id="right-items"></div>
            </div>
        </div>

        <div class="edu-matching__actions">
            <button id="check-btn" style="
                    min-with: 100%;
                    padding: 0.75rem 20%;
                    border: none;
                    border-radius: var(--edu-radius);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    background: rgb(var(--edu-bg));
                    color: rgb(var(--edu-ink));
            " disabled>
                Check Matches
            </button>
        </div>
    </div>
    
</div>
`;var xe=`/* ROOT SECTION NOT STYLED, UNNECESSARY */

.matching-wrap {
  background: linear-gradient(to right, rgb(var(--edu-first-accent) / 0.50) 50%, rgb(var(--edu-ink) / 0.50) 50%);
}

.matching-card {

  display: flex;

  padding:24px; 

  flex-direction: column;
  
  font-family: var(--font-family, system-ui);
  background-color: rgb(var(--edu-first-accent) / 0.20);
  color: rgb(var(--edu-ink));    
  
  border-radius: var(--edu-radius);
  padding: 2rem;
  
  box-shadow: var(--shadow, 0 1px 3px 0 rgba(0, 0, 0, 0.1));
  
  border: 3px solid rgb(var(--edu-first-accent));
  border-top: 15px solid rgb(var(--edu-first-accent)); 
  border-bottom: 15px solid rgb(var(--edu-first-accent));   
}

.edu-match__indicators {    
    margin-top: 2%;
    display: flex;
    gap: 0.7rem;
}

.edu-match__indicators h3 {
    font-weight: 600;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgb(var(--edu-border));
    color: rgb(var(--edu-inverted-ink));
    width: 100%;
    text-align: center;
}

.edu-matching__game {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 2rem;
    align-items: center;
}

.edu-matching__column {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
} 

.edu-matching__item {
    padding: 0.75rem 1rem;
    background: rgb(var(--edu-card));
    border: 2px solid rgb(var(--edu-border));
    border-radius: var(--edu-radius);
    transition: all 0.2s ease;
    font-weight: 500;
    text-align: center;
    max-width: 280px;
    word-wrap: break-word;
    hyphens: auto;
    overflow-wrap: anywhere;
    margin: 0.75rem auto;
    color: rgb(var(--edu-ink));
} 

.edu-matching__item:hover {
    border-color: rgb(var(--edu-first-accent));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
} 

.edu-matching__item--selected {
    border-color: rgb(var(--edu-first-accent));
    background: rgb(var(--edu-first-accent));
    color: white;
    transform: scale(1.05);
}
.edu-matching__item--matched {
    border-color: rgb(var(--edu-success));
    background: rgb(var(--edu-success));
    color: white;
    cursor: not-allowed;
    transform: scale(0.95);
}

/* Confirmed matches turn green and scale down */
.edu-matching__item--confirmed {
    border-color: rgb(var(--edu-success)) !important;
    background: rgb(var(--edu-success)) !important;
    color: white !important;
    transform: scale(0.95) !important;
    opacity: 0.9;
    cursor: not-allowed;
}

.edu-matching__actions {
    display: flex;
    justify-content: center;
}


/* Mobile optimizations - keep columns side by side */
@media (max-width: 768px) {

    .edu-matching {        
        padding: 1rem;
        max-width: 100%;
    }
    .edu-matching__game {
        gap: 1rem;
        grid-template-columns: 1fr 1fr; /* Keep two columns */
    }
    .edu-matching__item {
        min-width: 80px;
        max-width: 140px;
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
    }
    .edu-matching__items-container {
        min-height: 150px;
        gap: 0.5rem;
    }
}

@media (max-width: 480px) {
    .edu-matching {
        padding: 0.75rem;
    }
    .edu-matching__game {
        gap: 0.75rem;
    }
    .edu-matching__item {
        min-width: 70px;
        max-width: 120px;
        padding: 0.4rem 0.6rem;
        font-size: 0.85rem;
    }
    .edu-matching__actions {
        gap: 0.5rem;
    }
    .edu-matching__button {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;function _e(n,t,e={}){let{shuffle:i=!0,allowRetry:o=!0,resultHandler:s,ariaLabel:v="Matching Exercise",checkBtn:c=!0}=e,r=V("edu-matching",v);W("edu-matching-style",xe);let A=te(t),f=Q(Y(t,"right")),L=Q(Y(t,"left")),x=Q([...Y(t,"right"),...t.distractors||[]]),a={matches:{},pendingMatches:{},selectedLeft:null,selectedRight:null,score:0},g=["#8b5cf6","#d946ef","#9333ea","#facc15","#c084fc","#a855f7","#eab308","#f97316","#14b8a6","#f59e0b"],u=t.content.length,l=Date.now(),b={},h=[];function w(k,C,m){let d=document.createElement("div");return d.className="edu-matching__item",d.id=m,d.setAttribute("data-id",m),d.setAttribute("data-type",C),d.setAttribute("role","button"),d.textContent=k,d.addEventListener("click",()=>{H(m,C),$e("click")}),d.addEventListener("keydown",p=>{(p.key==="Enter"||p.key===" ")&&(p.preventDefault(),H(m,C))}),d}function H(k,C){let m,d;if(C==="left"?(a.pendingMatches[k]?(m=document.getElementById(k),d=document.getElementById(a.pendingMatches[k]),delete a.pendingMatches[k],d.style.backgroundColor="",m.style.backgroundColor="",a.selectedLeft=null):a.selectedLeft=a.selectedLeft===k?null:k,a.selectedRight=null):a.selectedRight=a.selectedRight===k?null:k,a.selectedLeft&&a.selectedRight){for(let[O,I]of Object.entries(a.pendingMatches))if(I===a.selectedRight){delete a.pendingMatches[O];let F=document.getElementById(O),B=document.getElementById(String(I));F&&(F.style.backgroundColor=""),B&&(B.style.backgroundColor="")}a.pendingMatches[a.selectedLeft]=a.selectedRight;let p=document.getElementById(a.selectedLeft),R=document.getElementById(a.selectedRight);p.style.backgroundColor=b[a.selectedLeft],R.style.backgroundColor=b[a.selectedLeft],a.selectedLeft=null,a.selectedRight=null}q()}function E(k){k.style.animation="",k.offsetWidth,k.style.animation="shake 0.3s ease"}function M(){let k=r.querySelector("#left-items"),C=r.querySelector("#right-items");k?.setAttribute("inert",""),C?.setAttribute("inert","")}function z(){if(Object.keys(a.pendingMatches).length===0)return;let k=[];Object.entries(a.pendingMatches).forEach(([C,m])=>{A[C]===m?k.push({leftId:C,rightId:m}):h.push(C)}),k.forEach(({leftId:C,rightId:m})=>{a.matches[C]=m,a.score++}),h.length>0&&h.forEach(C=>{let m=a.pendingMatches[C],d=document.getElementById(C),p=document.getElementById(m);E(d),E(p),d.style.backgroundColor="red",p.style.backgroundColor="red"}),k.forEach(({leftId:C})=>{delete a.pendingMatches[C]}),q(),P()}function q(){let k=r.querySelectorAll('[data-type="left"]'),C=r.querySelectorAll('[data-type="right"]');k.forEach(p=>{let R=p.getAttribute("data-id");p.className="edu-matching__item",a.matches[R]?p.classList.add("edu-matching__item--confirmed"):(a.pendingMatches[R]||a.selectedLeft===R)&&p.classList.add("edu-matching__item--selected")}),C.forEach(p=>{let R=p.getAttribute("data-id");p.className="edu-matching__item",Object.entries(a.matches).find(([,I])=>I===R)?p.classList.add("edu-matching__item--confirmed"):(Object.entries(a.pendingMatches).find(([,F])=>F===R)||a.selectedRight===R)&&p.classList.add("edu-matching__item--selected")});let m=r.querySelector("#check-btn");m&&(m.disabled=Object.keys(a.pendingMatches).length!==L.length);let d=r.querySelector("#score");d&&(d.textContent=a.score.toString())}function S(){r.innerHTML=fe.replace("{{leftColumnName}}",t.leftColumnName??"Match These").replace("{{rightColumnName}}",t.rightColumnName??"With These");let k=r.querySelector("#check-btn");k&&(k.addEventListener("click",z),e.checkBtn||(k.style.display="none"));let C=r.querySelector("#left-items");C&&L.forEach(d=>{b[d]=g.length>0?g.pop():"#1a1a",C.appendChild(w(d,"left",d))});let m=r.querySelector("#right-items");m&&x.forEach(d=>{m.appendChild(w(d,"right",d))}),q()}function P(){M();let k=((Date.now()-l)/1e3).toFixed(1),C=a.score/u*100,m={detail:{correct:a.score,total:u,score:C},timestamp:k,winningEl:U(C,a.score,u,k,h)};s&&s(m);let d=new CustomEvent("matching-complete",{detail:m.detail,bubbles:!0});r.dispatchEvent(d)}return S(),n.appendChild(r),{destroy(){n.removeChild(r)},check:z}}function kt(n){return!0}var yt=`
apple = red;
pear = green;
grapes = purple;
banana = yellow;
@EXTRA = [white | black]
`,Je={name:"Matching",description:"...",version:1.1,parserVersion:1,category:"open",tags:["relation-mapping","...","binary-choice"],usage:["...","..."],wrong:["...","..."],grammarExample:[yt],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"Matching Exercise"},implementation:{renderer:_e,parser:ee,validator:kt},styleTag:"edu-matching-style",html:fe,css:xe};var ve=`<section class="mtc-wheels-card">
    <div class="wheels" id="wheelsWrap">

        <header>
            <label class="lives" id="mtc-wheels-lives">\u2764\uFE0F\u2764\uFE0F\u2764\uFE0F</label>
        </header>
        
        <!-- WHEEL OBJECT -->
        <div class="mtc-wheels-obj" id="wheelTop">
            <div class="mtc-wheels-controls">
            <button class="mtc-wheels-btn ghost" id="prevTop">\u2190 Prev</button>
            </div>
            <label id="topLabel"></label>
            <div class="mtc-wheels-controls">
            <button class="mtc-wheels-btn ghost" id="nextTop">Next \u2192</button>
            </div>
        </div>

        <!-- CENTER BUTTON -->
        <div class="mtc-wheels-center">
            <button id="wheelsCheckBtn" class="mtc-wheels-btn">Check</button>
        </div>

        <!-- WHEEL OBJECT -->
        <div class="mtc-wheels-obj" id="wheelBottom">
            <div class="mtc-wheels-controls">
            <button class="mtc-wheels-btn ghost" id="prevBottom">\u2190 Prev</button>
            </div>
            <label id="bottomLabel"></label>
            <div class="mtc-wheels-controls">
            <button class="mtc-wheels-btn ghost" id="nextBottom">Next \u2192</button>
            </div>
        </div>

    </div>

    <!-- PROGRESS BAR -->
    <div class="mtc-wheels-progress">
        <div class="mtc-wheels-bar" style="flex:1"><i id="barFill"></i></div>
    </div>
    
    <div class="mtc-wheels-sep"></div>

    <!-- CORRECT  MATCHES INDICATOR -->
    <ul id="solvedList" class="mtc-wheels-list"></ul>
    
</section>

`;var ke=`.mtc-wheels-wrap {    
    background-image: url('https://media.licdn.com/dms/image/v2/D5612AQFZcZCOD6olCw/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1700549159934?e=2147483647&v=beta&t=F30JEd72k-HOGg4ryPedv7FKad-gZSK5fXYWF5imL5A');  
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;           
}

.mtc-wheels-card {
    background-color: rgb(var(--edu-bg) / 0.95);    
    box-shadow: 0 10px 30px rgba(0,0,0,.18);
    color: rgb(var(--edu-ink));
    padding:min(4.5vw,28px);    
}

/** ================== CUSTOM BUTTON ============================ **/

.mtc-wheels-btn {
    --b: 2px; --s: .5em; --c: rgb(var(--edu-first-accent));
    
    padding: calc(.55em + var(--s)) calc(1em + var(--s));
    color: var(--c); 
    
    background: conic-gradient(from 90deg at var(--b) var(--b), #0000 90deg, var(--c) 0)
    var(--s) var(--s)/calc(100% - var(--b) - 2*var(--s)) calc(100% - var(--b) - 2*var(--s));
    
    border:0; 
    outline: var(--b) solid #0000; 
    outline-offset:.6em; 
    border-radius:12px;
    transition:.25s linear, color 0s, background-color 0s;
    font-weight:600; 
    cursor:pointer;
    user-select:none; 
    -webkit-user-select:none;
    touch-action:manipulation;
    background-color: transparent;
}
.mtc-wheels-btn:hover, .mtc-wheels-btn:focus-visible{
    --s:0px;
    outline-color: var(--c);
    outline-offset:.08em
}
.mtc-wheels-btn:active {
    background: var(--c);
    color:rgb(var(--edu-ink));
}
.mtc-wheels-btn.ghost{
    color:rgb(var(--edu-ink));
    --c: rgb(var(--edu-first-accent));
    font-weight:500
}
.mtc-wheels-btn.ok {
    --c: rgb(var(--edu-first-accent))
}

/** ============================================== **/

.wheels{
    display:grid; gap:16px;
}

.wheels header {
    display: flex;
    justify-content: right;
    padding-right: 20px;
    font-size: 1.6rem;
    letter-spacing: 0.4rem;
}

.mtc-wheels-obj {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px;
    border: 1px dashed rgb(var(--edu-first-accent));
    background-color: rgb(var(--edu-card) / 0.90);
    margin: 20px;
}

.mtc-wheels-obj label {
    font-size:clamp(24px, 5vw, 46px);
    font-weight:800;
    letter-spacing:.2px;
    line-height:1.1;
    text-align:center;
    min-width: 40%;
    translate:0 0;
    transition: transform .18s cubic-bezier(.2,.8,.2,1), opacity .18s cubic-bezier(.2,.8,.2,1);
    will-change: transform, opacity;
}

.mtc-wheels-obj.spin label {
    translate:0 .5rem;
    opacity:.7;
}
.mtc-wheels-controls {
    display:flex;
    gap:10px;
    align-items:center;
}
.mtc-wheels-center {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    padding: 60px 0;
}

.mtc-wheels-center button {
    font-size: 1.2rem;
    padding: 1em 2em;
}

.mtc-wheels-progress{
    display:flex;
    align-items:center;
    justify-content:space-between; 
    gap:10px;
    margin-left:6px;
    color: rgb(var(--edu-first-accent));
}
.mtc-wheels-bar{
    height:8px;
    background:color-mix(in oklch, rgb(var(--edu-ink)) 8%, transparent);
    border-radius:999px;
    overflow:hidden;
    margin: 20px;
}
.mtc-wheels-bar > i {
  display:block;
  height:100%;
  width:0%;
  transition: width 300ms ease;
  background: linear-gradient(
    90deg,
    rgb(var(--edu-first-accent)),
    rgb(var(--edu-second-accent))
  );
}
.mtc-wheels-list{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin:10px;
    padding:0;
    list-style:none;    
    gap:8px;    
    /* justify-content:space-between; */
}

.mtc-wheels-chip {
    border: 3px solid rgb(var(--edu-border));
    padding: 10px;
    flex: 0 0 auto;
}

.mtc-wheels-sep {
  height: 1px;
  margin: 16px 10px;
  background: rgb(var(--edu-ink));
  opacity: .7;
}


`;function Ge(n,t,e={}){let{shuffle:i=!0,allowRetry:o=!0,resultHandler:s,ariaLabel:v="Matching Wheels"}=e,c=V("mtc-wheels-wrap",v);W("matching-wheels-style",ke);let r=C=>c.querySelector(C),A=te(t),f=Date.now(),L,x,a,g,u,l=Q(Y(t,"left")),b=Q([...Y(t,"right"),...t.distractors||[]]),h=0,w=0,H=[];function E(){L.textContent=l[h]??"-",x.textContent=L.textContent==="-"?"-":b[w]}function M(C,m){let d=document.createElement("li");d.className="mtc-wheels-chip",d.textContent=`${C} = ${m}`,g.appendChild(d)}function z(C){let m=r("#wheelsCheckBtn");m.classList.remove("ok"),C?(m.classList.add("ok"),m.textContent="\u2713 Correct",u.style.width=100*(H.length+1)/t.content.length+"%"):m.textContent="\u2717 Try again",l.length-1!==0?setTimeout(()=>{m.textContent="Check",m.classList.remove("ok")},900):u.style.background="#66ff00"}function q(){r("#wheelsWrap")?.setAttribute("inert","")}function S(){let C=l[h],m=b[w],d=A[l[h]]===b[w];if(z(d),d){if(H.push(C),M(l[h],b[w]),l=l.filter(p=>p!==C),l.length===0){k();return}h=h%l.length,E()}else a.textContent=a.textContent.replace("\u2764\uFE0F","\u{1F90D}"),c.classList.remove("shake-animation"),c.offsetWidth,c.classList.add("shake-animation"),a.textContent.includes("\u2764\uFE0F")||k()}function P(){let C=document.createElement("template");C.innerHTML=ve.trim(),c.replaceChildren(C.content),L=r("#topLabel"),L.textContent=l[h],x=r("#bottomLabel"),x.textContent=b[w],a=c.querySelector("#mtc-wheels-lives"),g=r("#solvedList"),u=r("#barFill"),r("#prevTop").onclick=()=>{h=(h-1+l.length)%l.length,E()},r("#nextTop").onclick=()=>{h=(h+1)%l.length,E()},r("#prevBottom").onclick=()=>{w=(w-1+b.length)%b.length,E()},r("#nextBottom").onclick=()=>{w=(w+1)%b.length,E()},r("#wheelsCheckBtn").onclick=S}function k(){a.textContent.includes("\u2764\uFE0F")?c.classList.add("success-jump"):q();let C=((Date.now()-f)/1e3).toFixed(1),m=document.createElement("div");m.textContent="You have finished!",s&&s({detail:{correct:0,total:0,score:0},timestamp:C,winningEl:m})}return P(),n.appendChild(c),{destroy(){n.removeChild(c)},check:S}}function At(n){return!0}var Ct=`
apple \u{1F34E} = red \u{1F534};
pear \u{1F350} = green \u{1F7E2};
grapes \u{1F347} = purple \u{1F7E3};  
banana \u{1F34C} = yellow \u{1F7E1};
@EXTRA = [white \u26AA | black \u26AB]
`,Ke={name:"Matching Wheels",description:"Move objects in a rotating still in a top and bottom container to match them.",version:1,parserVersion:1,category:"relational",tags:["relation","binary-choice","concept-tying"],usage:["...","..."],wrong:["...","..."],grammarExample:[Ct],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"Matching Wheels Exercise"},implementation:{renderer:Ge,parser:ee,validator:At},styleTag:"matching-wheels-style",html:ve,css:ke};var ye=`
<div class="tnf-wrap">
    <header>
        <h2>True, False or Neutral?</h2>
    </header>

    <!--Append dynamically here

    <div class="item">
        <span class="chip">...</span>
        <p class="prompt">...</p>
        <button class="choose">Select</button>
    </div>
    -->
    <main id="list"></main>    

    <footer>
        <button id="checkAll" class="tnf-check">Check</button>
    </footer>
</tnf>

<!-- Chooser -->
<dialog id="picker">
    <form method="dialog">
        <label id="dialog-text">Hello</label>
        <hr>
        <button value="T">True</button>
        <button value="N">Neutral</button>
        <button value="F">False</button>
    </form>
</dialog>

`;var we=`.tnf-root {
  display: flex;
  align-items: center;
  justify-content: center;  
  padding: 20px;
}

.tnf-wrap {
    width: 100%;
    max-width: 900px;
    padding: 20px;    
    background-color: rgb(var(--edu-card) / 0.95);    
    box-shadow: 0 6px 20px rgba(0,0,0,.2);
    transition: background 0.3s, border-color 0.3s;
    border-radius: 12px;
}

.tnf-root header h2 {
    color: rgb(var(--edu-ink));
    margin: 0;
    padding: 16px;
    text-align: center;
}

.tnf-root main {
    margin: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px;    
    cursor: pointer;
    background: rgb(var(--edu-card));
    transition: transform .2s, background .3s, border-color .3s;
    border-radius: 8px;
    border: 2px solid transparent;
}

.item:nth-child(even){
    background: rgb(var(--edu-muted));
}

.item:hover{
    transform: scale(1.02);
    border-color: rgb(var(--edu-first-accent) / 0.50);
}

.prompt{
    font-size: 1.05rem;
    letter-spacing: .03em;
    flex: 1;
    color: rgb(var(--edu-ink));
}

.choose, .check {
    background: none;
    color: rgb(var(--edu-ink));
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 10px;
    border: 2px solid rgb(var(--edu-ink));
    font-weight: 600;
    transition: background .3s, transform .2s;
}

.choose:hover{
    background: rgb(var(--edu-first-accent) / 0.50);
    color: #fff;
    transform: scale(1.05);
}

.tnf-check {
    border: 1px dashed rgb(var(--edu-ink));
    padding: 0.7rem;
    font-size: 1.1rem;
    background: none;
    width: 90%;
    color: rgb(var(--edu-ink));
    border-radius: 8px;
    cursor: pointer;
}

.tnf-check:hover {
    background: rgb(var(--edu-first-accent) / 0.50);
    color: rgb(var(--edu-ink));
}

.tnf-root footer {
    display: flex;    
    justify-content: center;    
    padding: 10px;
}

.chip {
    font-size: .9rem;
    padding: .35rem .8rem;
    border: 1px dashed rgb(var(--edu-ink));
    background: rgb(var(--edu-card)); 
    min-width: 70px;
    text-align: center;
    transition: background .3s, color .3s;
    color: rgb(var(--edu-ink));
    border-radius: 6px;
}

.chip.t { background: rgb(var(--edu-success)); color: rgb(var(--edu-ink)); }
.chip.n { background: var(--neutral); color: rgb(var(--edu-ink)); }
.chip.f { background: rgb(var(--edu-error)); color: rgb(var(--edu-ink)); }

.item.correct { 
    outline: 3px solid rgb(var(--edu-success)); 
    animation: pop 0.4s; 
    border: 2px solid rgb(var(--edu-success));
}

.item.wrong { 
    outline: 3px solid rgb(var(--edu-error)); 
    animation: shake 0.4s; 
    border: 2px solid rgb(var(--edu-error));
}

.tnf-root dialog {
    padding: 24px;
    background: rgb(var(--edu-card));
    box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    animation: scaleIn .25s ease;
    max-width: 360px;
    margin: auto;
    border: 1px solid rgb(var(--edu-first-accent) / 0.50);
    color: rgb(var(--edu-ink));
    border-radius: 12px;
}

.tnf-root dialog form button {
    padding: 14px;
    border: 2px solid rgb(var(--edu-ink));
    border-radius: 12px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: background .3s, transform .2s;
    background: rgb(var(--edu-muted));
    color: rgb(var(--edu-ink));
    cursor: pointer;
}

.tnf-root dialog form button:hover {
    background: rgb(var(--edu-first-accent) / 0.50);
    color: rgb(var(--edu-ink));
    transform: scale(1.05);
}

.tnf-root dialog::backdrop {
    background: rgb(var(--edu-bg) / 0.50);
    backdrop-filter: blur(4px);
}

.tnf-root dialog form{
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.tnf-root dialog hr {
    border: 1px solid rgb(var(--edu-first-accent));
    width: 100%;
}

.msg{
    text-align: center;
    margin: 8px 0 0;
    font-weight: 600;
    animation: fadein .3s;
}

@media (max-width: 1024px) {
    .tnf-root {
        padding: 12px;
    }

    .tnf-wrap {
        padding: 12px;
        border-radius: 8px;
    }

    .tnf-root .item {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
        padding: 16px;
        gap: 10px;
    }

    .tnf-root .prompt {
        font-size: 1.1rem;
        font-weight: 500;
    }

    .tnf-root .chip {
        font-size: 1rem;
        padding: 0.5rem 1rem;
        min-width: 100%;
        align-self: center;
    }

    .tnf-root .choose {
        width: 100%;
        font-size: 1rem;
        padding: 12px;
    }

    .tnf-root footer {
        flex-direction: column;
        gap: 12px;
        align-items: stretch;
    }

    .tnf-root .tnf-check {
        width: 100%;
        padding: 14px;
        font-size: 1.1rem;
    }

    .tnf-root header h2 {
        font-size: 1.2rem;
        text-align: center;
    }
}

/* Animations */
@keyframes fadein {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes pop {
    0% { transform: scale(0.95); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
}

@keyframes scaleIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

@keyframes jump {
    0%   { transform: translateY(0) rotate(0); }
    25%  { transform: translateY(-50px) rotate(-5deg); }
    35%  { transform: translateY(-55px) rotate(5deg); }
    50%  { transform: translateY(0) rotate(0); }
    65%  { transform: translateY(-25px) rotate(-3deg); }
    75%  { transform: translateY(0) rotate(0); }
    85%  { transform: translateY(-10px) rotate(2deg); }
    100% { transform: translateY(0) rotate(0); }
}

.success-jump {
    animation: jump 0.6s ease-out forwards;
}

.shake-animation {
    animation: shake 0.6s ease-out forwards;
}
`;function Xe(n,t,e){let{shuffle:i=!0,allowRetry:o=!1,resultHandler:s,ariaLabel:v="True False Exercise",checkBtn:c=!1}=e,r=V("tnf-root",v);W("tnf-style",we);let A=Q(t),f={},L=Array(t.length).fill(null),x=-1,a=0,g=0,u=[],l=t.length,b=Date.now(),h,w,H,E,M=m=>m==="T"?"True":m==="F"?"False":"Neutral",z=m=>m==="True"?"T":m==="False"?"F":m==="Neutral"?"N":"";function q(){r.setAttribute("inert","")}function S(){r.innerHTML=ye,h=r.querySelector("#list"),w=r.querySelector("#picker"),H=r.querySelector("#checkAll"),e.checkBtn||(H.style.display="none"),E=r.querySelector("#dialog-text"),w.addEventListener("close",()=>{let m=w.returnValue;if(!m||x<0)return;L[x]=m;let p=h.querySelector(`.item[data-index="${x}"]`).querySelector(".chip");p.className="chip "+m.toLowerCase(),p.textContent=M(m),x=-1}),t.forEach(m=>{console.log(m),f[m.q]=m.a}),H.addEventListener("click",()=>{k()}),P()}function P(){h.innerHTML="",A.forEach((m,d)=>{let p=document.createElement("div");p.className="item",p.dataset.index=d.toString();let R=document.createElement("span");R.className="chip "+(L[d]?.toLowerCase()||""),R.textContent=L[d]??"Choose";let O=document.createElement("p");O.className="prompt",O.textContent=m.q,p.addEventListener("click",I=>{I.stopPropagation(),x=d,E.textContent=m.q,w.showModal()}),p.append(O,R),h.appendChild(p)})}function k(){let m=100/l;Array.from(h.children).forEach(d=>{let p=d.querySelector("p").textContent,R=z(d.querySelector("span").textContent);f[p]===R?(a++,g+=m,d.classList.add("correct")):(d.classList.add("wrong"),u.push(p))}),a===l&&r.classList.add("success-jump"),C()}function C(){let m=((Date.now()-b)/1e3).toFixed(1),d={detail:{correct:a,total:l,score:g},timestamp:m,winningEl:U(g,a,l,m,u)};r.setAttribute("inert","true"),s&&s(d)}return S(),n.appendChild(r),{destroy(){n.removeChild(r)},check:k}}function Mt(n){let t=[],e=[];if(!n)return e.push("No code provided"),{ok:!1,errors:e};if(!n.includes(";"))return e.push("No ';' found in the code (which indicate matches separation)"),{ok:!1,errors:e};let i=n.trim().split(";").map(o=>o.trim()).filter(Boolean);for(let o=0;o<i.length;o++){let s=i[o];(!s.includes("=")||!s.includes("::"))&&e.push(`Match ${o} (${s}) is invalid. No separator provided. `);let v=s.includes("=")?"=":"::",[c,r]=s.split(v).map(L=>L.trim()),A=r.toUpperCase(),f=A[0].toUpperCase()==="T"?"T":A[0].toUpperCase()==="F"?"F":"N";t.push({q:c,a:f})}return{ok:!0,content:t}}function St(n){let t=[],e=["t","f","n","true","false","neutral"];n.length<4&&t.push(`
            Exercise needs at least 4 valid matches, found ${n.length}
        `);for(let i=0;i<n.length;i++){let o=n[i];o.q.length>40&&t.push(`
                The question for match ${i} is too long. This component is not suitable for 
                questions with a large length of characthers. 
            `),o.q.length<10&&t.push(`
                The question for match ${i} is too short. Are you sure your sentence is a proper
                statement user can determine validity from? 
            `),e.includes(o.a)||t.push(`Match ${i} (${o}) has not any valid values. 
Valid values: 
${e}.`)}return t.length===0}var Ht=[`
The sun is really big = t;
Water is good for humans = t;
The earth does not rotate = f;
Love is good = n;
`,`
Money is the most important thing in life :: neutral;
Graduating from university ensures a good life :: false;
Not having friends is a good thing :: neutral;
`],Ye={name:"True, False or Neutral",description:"A nicer version of a true/false exercise, with cute styling and a neutral option.",version:1,parserVersion:1,category:"logic",tags:["true/false","neutral","binary-choice"],usage:["Non-subjective statements students must classify","Feedback collection from reading, audio, or pictures","Survey-style personal opinion questions"],wrong:["Super long questions (use a reading exercise with TNF plugin instead)","Statements without clear truth value","Ignoring cultural or subjective context"],grammarExample:Ht,defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"True False Exercise"},implementation:{renderer:Xe,parser:Mt,validator:St},styleTag:"tnf-style",html:ye,css:we};var Ee=`<!-- We are creating the section in the script instead of
hardcoding it here (as well as all our components)-->
<div class='mtc-single-wrap'>

<header class="navigation">
  <div class="mtc-single-dots" id="mtc-single-dots"></div>
  <button class="hint" id="mtc-single-hint-btn" title="Show hint">\u{1F4A1}</button>
</header>

<main class="layout">
  <aside class="answer-holder">
    <h4>Drop your answer</h4>
    <div class="holder-dropzone" id="dropzone">
      <div class="holder-content" id="mtc-single-holder"></div>
    </div>
  </aside>

  <div class="question-container">
    <label class="question" id="mtc-single-question">\u2026</label>
    <div class="hint-text" id="mtc-single-hint"></div>

    <div class="bank">
      <h5>Answer bank</h5>
      <div class="bank-grid" id="mtc-single-bank"></div>
    </div>

    <div class="nav-buttons">
      <button id="mtc-single-prevBtn">Previous</button>
      <button id="mtc-single-nextBtn" class="primary">Next</button>
    </div>
  </div>
</main>

<footer>
  <button id="mtc-single-check" class="mtc-single-check">Check</button>
</footer>

</div>
`;var Ae=`.mtc-single {
  --border: color-mix(in oklab, rgb(var(--edu-ink)) 28%, transparent);

  background-image: url('https://png.pngtree.com/thumb_back/fh260/background/20230620/pngtree-stacks-of-cardboard-boxes-in-isolation-a-3d-rendering-image_3646804.jpg');  
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;

}

.mtc-single-wrap {    
    background:rgb(var(--edu-card) / 0.90);
    border:2px solid rgb(var(--edu-first-accent));
    padding: 10px;
}

/* Top nav */
.navigation{
    display:flex;
    align-items:center;
    gap:14px;
    padding:10px 4px 14px;
    border-bottom:1.5px solid rgb(var(--edu-border));
}

.mtc-single-dots {display:flex;gap:12px}

.circle{
    width:14px;
    aspect-ratio:1/1;
    border: 1px solid rgb(var(--edu-ink));
    border-radius:999px;
    background:transparent;
    cursor:pointer;
}

.circle:hover{
    transform:scale(1.5);
    background: color-mix(in oklab, rgb(var(--edu-ink)) 18%, transparent)
}
.circle.is-active{ background:rgb(var(--edu-first-accent)) }

.hint{
    margin-left:auto;
    aspect-ratio: 1/1;
    border-radius:99px;
    border:1.5px solid rgb(var(--edu-first-accent));
    background:transparent;
    display:grid;
    place-items:center;
    cursor:pointer;    
}

/* ==== */
.layout{
    display:grid;
    grid-template-columns:minmax(220px,260px) 1fr;
    gap:18px;
    padding-top:16px;
}

@media (max-width:780px){ .layout{ grid-template-columns:1fr } }

/* Answer holder */
.answer-holder{
    padding:12px;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.04), 0 5px 12px rgba(0,0,0,.35);
    display:flex;
    flex-direction:column;
}

.answer-holder h4 {
    margin:10px; font-size:13px; color:rgb(var(--edu-ink)); letter-spacing:.3px;
}

.holder-dropzone {
    flex:1;
    border:1.5px dashed rgb(var(--edu-first-accent));
    border-radius:10px;
    padding:10px;
    display: grid;
    place-items:center;
}

/* Question & hint */
.question {
    display:block;
    font-weight:700;
    margin:6px 0 10px;
    font-size:clamp(1.6rem,3.4vw,2.2rem);
    color: rgb(var(--edu-ink));
}

.hint-text {
    max-height:0;
    opacity:0;
    overflow:hidden;
    color: rgb(var(--edu-ink));
    border-left: 4px solid rgb(var(--edu-ink));
    margin:.25rem 0 1rem;
    font-style:italic;
    padding-left: 10px;
    transition: max-height 1s ease, opacity .8s ease;
}
.hint-text.is-open{
    max-height:140px; opacity:1;
}

/* Answer bank */
.bank{ margin-top:.5rem; }
.bank h5 { margin:10px 0 8px; color:rgb(var(--edu-ink)); }

.bank-grid{5
    display: grid;
    grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
    gap:10px;
}

/* Tiles */
.tile{
    background: rgb(var(--edu-first-accent) / 0.50);
    color:rgb(var(--edu-ink));
    border:1.6px solid rgb(var(--edu-border));
    border-radius:16px;
    padding:10px 12px;
    cursor:pointer;
    user-select: none;
    border-color: rgb(var(--edu-border));

    transition:
        transform .12s ease,
        border-color .12s ease,
        opacity .12s ease;
    will-change: transform;
}

.tile.disabled {
    color: rgb(var(--edu-ink));
    border:1.6px solid rgb(var(--edu-border));
    border-radius:16px;
    padding:10px 12px;
    cursor:pointer;
    transform-style: preserve-3d;
    user-select: none;
    border-color: rgb(var(--edu-border));
    transition:
        transform .12s ease,
        box-shadow .12s ease,
        border-color .12s ease,
        opacity .12s ease;
    will-change: transform;
}

.tile:hover{
    transform:translateY(-2px) scale(.94);
}

.tile:active{
    transform:translateY(0) scale(.98)
}

.correct{
    border-color: rgb(var(--edu-success));
    box-shadow:0 0 0 2px color-mix(in oklab, rgb(var(--edu-success)) 35%, transparent)
}
.wrong{
    border-color:rgb(var(--edu-error));
    box-shadow:0 0 0 2px color-mix(in oklab, rgb(var(--edu-error)) 35%, transparent)
}

/* Bottom nav */
.nav-buttons {
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    margin:14px;
    padding-top:14px;
    border-top:1.5px solid rgb(var(--edu-border))
}
.nav-buttons button {
    padding:10px 14px;
    border-radius:12px;
    cursor:pointer;
    background:transparent;
    border:1.6px solid rgb(var(--edu-border));
    color: rgb(var(--edu-ink));
    transition:transform .12s ease, background .12s ease, border-color .12s ease;
}

.nav-buttons button:hover {
    transform:translateY(-1px);
    background:color-mix(in oklab, rgb(var(--edu-ink)) 10%, transparent)
}
.nav-buttons .primary {
    background:rgb(var(--edu-first-accent));
    border-color:rgb(var(--edu-first-accent)); 
    color: rgb(var(--edu-ink))
}
.nav-buttons .primary:disabled {
    opacity:.5;
    cursor:not-allowed
}

footer {
    display: grid;
    place-items: center;
    margin: 20px;
    padding: 10px;
}
.mtc-single-check {
    cursor: pointer;
    width: 80%;
    padding: 10px 12px;
    background: none;
    border: 1px solid rgb(var(--edu-border));
    color: rgb(var(--edu-ink));
}

.mtc-single-check:hover {
    background-color: rgb(var(--edu-first-accent) / 0.50);
}

/* Misc */
@keyframes fadeSlide{
    from{ opacity:0; transform:translateY(30px) }
    to{ opacity:1; transform:none }
}

.animate-fadeSlide {
    animation:fadeSlide .22s ease both;
}

/* Stagger-in animation */
@keyframes tileIn {
    from{ opacity:0; transform:translateY(6px) scale(.98) }
    to{ opacity:1; transform:none }
}
`;function Ze(n,t,e={}){let{shuffle:i=!0,allowRetry:o=!0,resultHandler:s,ariaLabel:v="Matching Single Exercise",checkBtn:c=!1}=e,r=V("mtc-single",v);W("mtc-single-style",Ae);let A=te(t),f=Q(Y(t,"left")),L=Q([...Y(t,"right"),...t.distractors||[]]),x=Date.now(),a,g,u,l,b,h,w,H,E,M,z={},q={};f.forEach(T=>q[T]=null);let S=0,P={};t.content.forEach(T=>{P[T.left]=T.right});let k={total:t.content.length,score:0,incorrect:[],correct:0,wrong:[]};function C(){r.innerHTML="",r.innerHTML=Ee;let T=y=>r.querySelector(y);a=T("#mtc-single-dots"),g=T("#mtc-single-hint-btn"),u=T("#mtc-single-hint"),l=T("#mtc-single-question"),b=T("#mtc-single-bank"),h=T("#mtc-single-holder"),H=T("#mtc-single-prevBtn"),E=T("#mtc-single-nextBtn"),M=T("#mtc-single-check"),e.checkBtn||(M.style.display="none"),u.textContent="Yahir was here",M.addEventListener("click",()=>F()),g.addEventListener("click",()=>{u.classList.toggle("is-open")}),H.addEventListener("click",()=>{I(),S>0&&(S--,O()),d()}),E.addEventListener("click",()=>{I(),S<f.length-1&&(S++,O()),d()}),h.addEventListener("click",()=>{let y=h.firstElementChild;y!==null&&(b.appendChild(y),q[f[S]]=null,d())}),O()}function m(T){let y=/@left\s*(?:=|::)\s*\[a-Z\]/,N=/@right\s*(?:=|::)\s*\[a-Z\]/,$=Array.from(T.matchAll(y),G=>G[1]),_=Array.from(T.matchAll(N),G=>G[1])}function d(){h.innerHTML="";let T=q[f[S]];T!=null&&h.appendChild(T)}function p(T){let y=document.createElement("button");return y.className="tile",y.type="button",y.textContent=T,y.dataset.value=T,y.addEventListener("click",()=>{q[f[S]]=y,h.children.length>0&&b.append(h.firstElementChild),d()}),y}function R(){a.innerHTML="",f.forEach((T,y)=>{let N=document.createElement("button");N.className="circle"+(y===S?" is-active":""),N.title=`Go to question ${y+1}`,N.addEventListener("click",()=>{S=y,O()}),a.appendChild(N)})}function O(){R();let T=S===f.length-1,y=f[S];l.textContent=y,u.textContent=P[f[S]]||"No hints :(",u.classList.remove("is-open"),H.disabled=S===0,E.textContent=T?"Finish":"Next",b.innerHTML="",L.forEach(N=>{if(Object.values(q).map(G=>G?.textContent??null).filter(G=>G!==null).includes(N))return;let _=p(N);b.appendChild(_)}),T&&E.classList.toggle(".check")}function I(){l.classList.remove("animate-fadeSlide"),l.offsetWidth,l.classList.add("animate-fadeSlide")}function F(){let T=100/k.total;f.forEach(y=>{let N=y,$,_;if(q[N])$=q[N],_=$.textContent;else return;A[N]===_?($.classList.remove("correct"),$.offsetWidth,$.classList.add("correct"),k.score+=T,k.correct++):($.classList.remove("wrong"),$.offsetWidth,$.classList.add("wrong"),k.wrong.push(_))}),B()}function B(){let T=((Date.now()-x)/1e3).toFixed(1),y={detail:{correct:k.correct,total:k.total,score:k.score},timestamp:T,winningEl:U(k.score,k.correct,k.total,T,k.wrong)};b.setAttribute("inert",""),M.setAttribute("inert",""),s&&s(y)}return C(),n.appendChild(r),{destroy(){n.removeChild(r)},check:F}}function Bt(n){return!0}var qt=`
It's the most famous fruit in the world = apple;

A lot of small circles, usually purple = grapes;

A tree + the other red fruit = pineapple;

5 letters. Sweet and kinda small, usually yellow = mango;

@EXTRA = [banana | orange]
`,et={name:"Matching Single",description:"Exploring questions and assigning answers with a single available pool of options.",version:1,parserVersion:1,category:"relational",tags:["relation","binary-choice","concept-tying"],usage:["...","..."],wrong:["...","..."],grammarExample:[qt],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"True False Exercise"},implementation:{renderer:Ze,parser:ee,validator:Bt},styleTag:"mtc-single-style",html:Ee,css:Ae};var Ce=`<div class='concepts-wrap'>
  <header>
    <h4 id="conceptsTitle">Define the Concepts</h4>
    <span>4/4</span>
  </header>
  <hr>
  <main id="conceptsContainer"></main>
  <hr>
  <footer>
    <button type="button" class="concepts-btn" id="conceptsCheck">Check your Answers</button>
  </footer>
</div>
`;var Le=`.concepts-root {

    
}

.concepts-wrap {
    padding: 20px;
    border: 4px solid rgb(var(--edu-bg));    
    background: rgb(var(--edu-bg) / 0.98);
    box-shadow: 0 6px 18px rgba(0,0,0,.15);      
}

.concepts-wrap hr {
    border: 1px solid rgb(var(--edu-border));
}

.concepts-wrap header {
    display: flex;
    justify-content: space-between; 
    color: rgb(var(--edu-ink))
}

.concepts-wrap footer {
    display: flex;    
    margin: 10px 0;
}

.concepts-wrap h4 {
    margin-left: 10px;
    color: rgb(var(--edu-ink));
    font-size: 0.95rem;
}

.concepts-btn {
    width: 100%;
    background: none;    
    border: 1px solid rgb(var(--edu-border));
    cursor: pointer;
    padding: 8px 16px;
    font-size: 1rem;
    font-weight: 300;
    color: rgb(var(--edu-first-accent));
    transition: background .2s, transform .2s;
}

.concepts-btn:hover {
    background-color: rgb(var(--edu-first-accent));
    color: rgb(var(--edu-inverted-ink));
    transform: scale(1.05);
}

.concepts-container {   
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px;    
    padding: 10px 14px;
    transition: border .1s ease;
}

.concepts-container:hover {   
    background: rgb(var(--edu-first-accent) / 0.50);
}

.concepts-correct {
    border: 3px solid rgb(var(--edu-success));
}

.concepts-incorrect {
    border: 3px solid rgb(var(--edu-error));
}

/* Main index span */
.concepts-container span {
    margin-right: 10px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgb(var(--edu-first-accent));
    color: rgb(var(--edu-inverted-ink));
    font-size: .9rem;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0,0,0,.2);
}

.concepts-container label {
    flex: 1;
    font-weight: 300;
    letter-spacing: .08rem;
    color: rgb(var(--edu-ink));
}

.concepts-container select {
    font-size: 0.95rem;
    font-weight: 300;
    padding: 4px 8px;
        
    margin-left: 10px;
    background: none;
    border: 2px solid rgb(var(--edu-border));
    border-radius: 6px;
    color: rgb(var(--edu-ink));

    background-color: rgb(var(--edu-card));
}

@media (max-width: 760px) {
    .concepts-container {
        flex-direction: column;
        align-items: stretch;
        text-align: center;
    }

    .concepts-container select {
        margin: 10px auto 0;
        width: 100%;
    }
}


/* Jump animation */
@keyframes jump {
    0%   { transform: translateY(0) rotate(0); }
    25%  { transform: translateY(-50px) rotate(-5deg); }
    35%  { transform: translateY(-55px) rotate(5deg); }
    50%  { transform: translateY(0) rotate(0); }
    65%  { transform: translateY(-25px) rotate(-3deg); }
    75%  { transform: translateY(0) rotate(0); }
    85%  { transform: translateY(-10px) rotate(2deg); }
    100% { transform: translateY(0) rotate(0); }
}

.concepts-success {
    animation: jump 1s cubic-bezier(0.25, 0.8, 0.5, 1);
}
`;function tt(n,t,e={}){let{shuffle:i=!0,allowRetry:o=!0,resultHandler:s,ariaLabel:v="concept-definition",checkBtn:c=!1}=e,r=V("concepts-root",v);W("edu-concepts-style",Le);let A,f,L,x=te(t),a=Q(Y(t,"left")),g=Q([...Y(t,"right"),...t.distractors||[]]),u=t.content.length,l=Date.now(),b=0,h=0,w=[];function H(){r.innerHTML=Ce,f=r.querySelector("#conceptsContainer"),A=r.querySelector("#conceptsCheck"),e.checkBtn||(A.style.display="none");for(let S=0;S<a.length;S++)f.appendChild(M(S,a[S],E(g)));A.addEventListener("click",z)}function E(S){let P=document.createElement("select"),k=document.createElement("option");k.textContent="",P.appendChild(k);for(let C of S){let m=document.createElement("option");m.textContent=C,P.appendChild(m)}return P}function M(S,P,k){let C=document.createElement("div");C.className="concepts-container",C.setAttribute("aria-label",`q-${S}`);let m=document.createElement("span");m.textContent=S+1;let d=document.createElement("label");return d.id=`concepts-lab-${S}`,d.textContent=P,C.append(m,d,k),C}function z(){let S=100/u;for(let P=0;P<f.children.length;P++){let k=f.children[P],C=k.querySelector("label").textContent,m=k.querySelector("select").value;x[C]===m?(b++,h+=S,k.classList.add("concepts-correct")):(k.classList.add("concepts-incorrect"),r.classList.add("concepts-incorrect"),w.push(C))}b===a.length&&(r.classList.remove("concepts-success"),r.offsetWidth,r.classList.add("concepts-success")),q()}function q(){let S=((Date.now()-l)/1e3).toFixed(1),P={detail:{correct:b,total:u,score:h},timestamp:S,winningEl:U(h,b,u,S,w)};r.setAttribute("inert",""),s&&s(P);let k=new CustomEvent("concept-exercise-complete",{detail:"Completed!",bubbles:!0});r.dispatchEvent(k)}return H(),n.append(r),{destroy(){n.removeChild(r)},check:z}}function Pt(n){return!0}var rt={name:"Concepts Defintion",description:"In a matching-style way, place the right defition to the concepts.",version:1,parserVersion:1,category:"open",tags:["relation-mapping","...","binary-choice"],usage:["...","...","..."],wrong:["...","...","..."],grammarExample:[`
Misinformation = Telling something that is false as if it was true;

Fraternity = The idea of union of man and fellowship of the people;

Destroy = Riping something apart to make it non-functionable;

Intelligence = Concept that represents intelectual capacity;

@EXTRA = [State of deep sadness during long times | Hurting someone deeply];
        `],defaultOptions:{shuffle:!0,allowRtry:!1,ariaLabel:"Concepts Definition Exercise"},implementation:{renderer:tt,parser:ee,validator:Pt},styleTag:"edu-concepts-style",html:Ce,css:Le};var Te=`<div class='manual-wrap'>  
  <header>    
    <h2 id='manual-instruction'>None</h2>    
    <h2 id="manual-counter" aria-live="polite" class='manual-counter'></h2>
  </header>

  <main id="manual-chips" class="chips" aria-label="Your words">
    <div id="manual-container-message" style="display: flex; justify-content: center; width: 100%">
      <p style="align-self: center;">Hey! No words for the moment \u{1F642}</p>
    </div>
  </main>  
  
  <footer>
    <div class="manual-footer-top">
      <input id="manual-input" type="text" placeholder="Enter word\u2026" autocomplete="off" />  
      <button id="manual-add">+</button>
    </div>

    <div id="manual-check-container">      
      <hr>
      <button id="manual-check">Check</button>
    </div>
  </footer>  
</div>  
`;var Me=`.edu-manual {
  --maxw:min(100%, 720px);
  
  background-image: url('https://promova.com/_next/image?url=https%3A%2F%2Fpromova.com%2Fcontent%2Fdays_of_the_week_in_chinese_b0bfc416b0.png&w=1920&q=75&dpl=dpl_9gd2o8tjy6xfifwZT6VFAnGNRiow');  
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;

  height: 80dvh;
}

.manual-wrap { 
  display: flex;
  height: 80dvh;
  padding:24px;     
  background-color: rgb(var(--edu-bg) / 0.95);      
  color:rgb(var(--edu-ink));   
  font:500 16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;     
  flex-direction: column;
  gap: 12px;
}

.manual-wrap header {  
  display:flex;
  justify-content: space-between;
}

.manual-wrap h2 { margin:0; font-size:1.90rem; background: rgb(var(--edu-bg) / 0.40); padding: 5px; border-radius: 10px;}
.manual-wrap .manual-counter { align-self: center; margin:0; font-size:0.95rem; color: rgb(var(--edu-first-accent)); }

.manual-wrap .chips {
  min-height:60%;
  padding:10px;
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  border:1px solid rgb(var(--edu-border));
  border-radius:var(--edu-radius);
  background:rgb(var(--edu-card) / 0.90);
  box-shadow:rgb(var(--edu-shadow));
  overflow:auto;
  scroll-snap-type:x proximity;
}
.manual-wrap .chips::-webkit-scrollbar{ height:10px }
.manual-wrap .chips::-webkit-scrollbar-thumb{ background:#cbd5e1; border-radius:10px }

.manual-wrap .chip {
  scroll-snap-align:start;
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  background: rgb(var(--edu-card));  
  border:1px solid rgb(var(--edu-border)); 
  border-radius: 15px;
  /* box-shadow:0 6px 18px rgb(var(--edu-first-accent) / 0.20); */
  font-size:14px;
  white-space:nowrap;
  animation:pop .15s ease;
  cursor: pointer;
}

.manual-wrap .chip-span {
  padding: 5px;
  background-color: rgb(var(--edu-ink) / 0.10);
  border-radius: 20px;
}

.manual-wrap .chip[data-state="correct"] {
  border:4px solid rgb(var(--edu-success));     
}

.manual-wrap .chip[data-state="wrong"] {
  border:4px solid rgb(var(--edu-error)); 
}

.manual-wrap .chip::before {
  content:"";
  inline-size:8px; block-size:8px; border-radius:999px;
  background:currentColor; opacity:.9;
}
.manual-wrap .chip button {
  border:0; background:transparent; color:#64748b;
  font-size:16px; line-height:1; padding:0 2px; cursor:pointer;
}
.manual-wrap .chip:hover{ transform:translateY(-1px) }

.manual-wrap input {
  padding:12px 14px;   
  width: 100%;
  align-self: center;
  border:1px solid rgb(var(--edu-first-accent)); 
  background-color: rgb(var(--edu-card));  
  color:rgb(var(--edu-ink));
  margin: 10px;    
}

.manual-wrap input:focus {
  outline:none; border-color:rgb(var(--edu-first-accent));
  box-shadow:0 0 0 4px rgba(99,102,241,.15);
}

.manual-wrap footer { 
  display: flex; 
  flex-direction: column;  
  align-items: center;
}

.manual-wrap .manual-footer-top {
  display: flex;
  justify-content: center;
}

#manual-add {
  border-radius: 20px;
  background: rgb(var(--edu-bg) / 0.20);
}

#manual-check-container {
  display: grid;
  justify-items: center;
  width: 100%;
}

.manual-wrap footer button {
  padding:12px 14px;   
  border:1px solid rgb(var(--edu-first-accent)); 
  background:rgb(var(--edu-card) / 0.40); 
  color:rgb(var(--edu-ink));
  font-weight: 600;
  width: 40%;
  margin: 10px;  
}

.manual-wrap hr {
  width: 100%;  
}

.manual-wrap footer button { cursor:pointer; transition:transform .12s ease,border-color .12s ease }
.manual-wrap footer button:hover{ transform:translateY(-1px); border-color:rgb(var(--edu-first-accent)) }

@media (max-width:560px){
  .manual-wrap{ padding:16px }
  .manual-wrap header { display: block; }
  .manual-wrap .controls{ grid-template-columns:1fr; }  
}

@keyframes pop{ from{opacity:0; transform:translateY(6px) scale(.96)} to{opacity:1; transform:none} }
`;var nt="edu-manual-style";function It(n,t,e){let{allowRetry:i=!0,resultHandler:o,ariaLabel:s="Manual Exercise",checkBtn:v=!0}=e,c=V("edu-manual",s);W(nt,Me);let r=(d,p=c)=>p.querySelector(d),A,f,L,x,a,g,u,l=t.words.length,b=Date.now(),h=["#8b5cf6","#d946ef","#9333ea","#facc15","#c084fc","#a855f7","#eab308","#f97316","#14b8a6","#f59e0b"],w=t.words,H=d=>d.replace(/[&<>"']/g,p=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[p]),E=0,M=[],z=!0;function q(){c.innerHTML=Te,f=r("#manual-input"),A=r("#manual-chips"),L=r("#manual-add"),x=r("#manual-check"),g=r("#manual-instruction"),u=r("#manual-container-message"),a=r("#manual-counter");let d=r("#manual-check-container");e.checkBtn||(d.style.display="none"),g.textContent=t.$instruction??"No Instruction",f.addEventListener("keydown",p=>{p.key==="Enter"&&P()}),L.addEventListener("click",P),x.addEventListener("click",C),A.addEventListener("click",p=>{let R=p.target;R instanceof Element&&(R.matches("button[data-x]")&&(R.closest(".chip")?.remove(),S()),A.children.length===1&&(z=!0,u.style.display="flex"))}),S()}function S(){a.textContent=`${A.children.length-1}/${l} added`}function P(){let d=f.value.trim();if(!d)return;if(z&&(u.style.display="none",z=!1),A.children.length-1>=l||Array.from(A.children).some(O=>O.dataset.value?.toLowerCase()===d.toLowerCase()))return k(f);let R=document.createElement("label");R.className="chip",R.dataset.value=d,R.style.color=h[Math.floor(Math.random()*h.length)],R.innerHTML=`<span class="chip-span">${H(d)}</span><button data-x aria-label="Remove">\u2715</button>`,A.appendChild(R),f.value="",S(),R.scrollIntoView({behavior:"smooth",inline:"end",block:"nearest"})}function k(d){d.style.transition="box-shadow .15s ease",d.style.boxShadow="0 0 0 6px rgba(239,68,68,.25)",setTimeout(()=>d.style.boxShadow="none",160)}function C(){let d=A.children.length-1;if(d<l){a.textContent=`You are still missing ${l-d} words`,a.style.color="rgb(var(--edu-error))",c.classList.remove("shake-animation"),c.offsetWidth,c.classList.add("shake-animation");return}[...A.children].forEach((R,O)=>{if(O===0)return;let I=R.textContent.slice(0,-1).toLowerCase(),F=[...t.words.map(B=>B.toLowerCase())].includes(I);R.dataset.state=F?"correct":"wrong",F?E++:M.push(I)});let p=E===l;a.textContent=p?"Well done!":`Oops... ${E}/${l}`,a.style.color=p?"rgb(var(--edu-success))":"rgb(var(--edu-error))",c.setAttribute("inert",""),m()}function m(){let d=((Date.now()-b)/1e3).toFixed(1),p=E/l*100,R={detail:{correct:E,total:l,score:p},timestamp:d,winningEl:U(p,E,l,d,M)};o&&o(R)}return q(),n.appendChild(c),{destroy(){n.removeChild(c)},check:C}}function Ft(n){let t=n.split(`
`).map(o=>o.trim()).filter(Boolean),e="",i=[];for(let o of t)o.startsWith("#")?e=o.replace(/^#\s*/,""):o.split(";").map(s=>s.trim()).filter(Boolean).forEach(s=>i.push(s));return{ok:!0,content:{instruction:e,words:i}}}function Wt(n){return!0}var Vt=[`
# Enter the 7 days of the week
Monday; Tuesday; Wednesday; Thursday; Friday; Saturday; Sunday;
`],at={name:"Manual",description:"...",version:1,parserVersion:1,category:"open",tags:["Manual Work","...","No help"],usage:["...","..."],wrong:["...","..."],grammarExample:[Vt[0]],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"Manual Input Exercise"},implementation:{renderer:It,parser:Ft,validator:Wt},styleTag:nt,html:Te,css:Me};var Se=`<div class="blanks-single-card">

  <header class="top">      
    <div class="progress" id="blanks-single-progress">1 / 1</div>
    <div style="display: flex; gap: 10px;">
      <label><i class="far fa-lightbulb"></i>Hint </label>
      <div class="instruction" id="blanks-single-instruction">Instruction</div>      
    </div>
  </header>

  <main class="word" id="blanks-single-word"></main>

  <footer>	
    <div class="blanks-single-nav">          
      <button id="blanks-single-prev"><i class="far fa-hand-point-left"></i></button>      
      <button id="blanks-single-next"><i class="far fa-hand-point-right"></i></button>
    </div>      

    <div id="bls-check-container">
      <!-- Wasn't able to make it full-width in css for some reason -->
      <hr>
      <button id="bls-single-check">Check <i class="fa-solid fa-check"></i></button>
    </div>
  </footer>
</div>

`;var He=`.blanks-single {
  background-image:url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdGMmkyax8_nzanbfOGadHC03Nu_DqzJAQxQ&s');
  font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif;
  color: rgb(var(--edu-ink));
}

.blanks-single-card {
  border: 2px solid rgb(var(--edu-border));
  background-color: rgb(var(--edu-card) / 0.98);
  padding-top: 40%;
  padding-bottom: 40%;  
}

/* Grid centers safely at all sizes */
.blanks-single-card .top {
  display: grid;
  place-items: center;
  gap: clamp(6px, 1.6vw, 12px);
}

.blanks-single-card .top label {
  font-weight: 600;
  align-content: center;
  border: 2px dashed rgb(var(--edu-first-accent));
  padding: 4px;
  transform: rotate(-3deg);
}

/* Fluid type scales */
.blanks-single-card .instruction { 
  font-weight: 600; 
  font-size: clamp(1.1rem, 3.6vw, 2rem); 
  line-height: 1.2;
}
.blanks-single-card .progress{ 
  opacity: .75; 
  font-size: clamp(1rem, 3.2vw, 1.8rem); 
}

/* Word row */
.blanks-single-card .word {
  margin-block: clamp(20px, 8vw, 40px);
  display: flex;
  gap: clamp(.35rem, 1.5vw, .7rem);
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

/* Letters scale and wrap nicely */
.blanks-single-card .letter {
  min-width: 2ch;
  text-align: center;
  font-weight: 800;
  letter-spacing: .02em;
  font-size: clamp(1.2rem, 4.2vw, 1.8rem);
  color: rgb(var(--edu-ink));
  border-bottom: 2px solid rgb(var(--edu-ink));
}

/* Component accent inheritance */
letter-picker{ --accent-color: rgb(var(--edu-first-accent)); }

/* Visual feedback using the component's ::part(display) */
letter-picker[data-state="correct"]::part(display) {
  border-color: rgb(var(--edu-success)) !important;
  box-shadow: 0 0 0 2px rgb(var(--edu-muted) / 0.50);
}
letter-picker[data-state="wrong"]::part(display) {
  border-color: rgb(var(--edu-error)) !important;
  box-shadow: 0 0 0 2px rgb(var(--edu-muted));
}

/* Footer actions */
.blanks-single-card footer {
  margin-top: clamp(12px, 3vw, 20px);
  display: grid;  
  gap: clamp(6px, 2vw, 12px);  
  justify-content: center;  
}

.blanks-single-card footer hr {
  width: 100%;
}

#bls-check-container {
  display: grid;
  width: 100%;
  align-items: center;
}

.blanks-single-card footer button {
  border:1px solid rgb(var(--edu-border));
  background: rgb(var(--edu-bg));
  color: rgb(var(--edu-ink));
  padding: clamp(8px, 1.8vw, 12px) clamp(10px, 2.5vw, 16px);
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: clamp(.9rem, 2.6vw, 1rem);
}
.blanks-single-card footer button:disabled { opacity:.45; cursor:not-allowed }

/* ========== Medium screens ========== */
@media (min-width: 520px) {
  .blanks-single-card .top label { transform: rotate(-4deg); }
}

/* ========== Large screens ========== */
@media (min-width: 900px) {
  .blanks-single-wrap { padding: clamp(24px, 3vw, 36px); }
  .blanks-single-card { padding: clamp(20px, 2.5vw, 32px); }
}

/* ========== Very narrow tweaks ========== */
@media (max-width: 420px) {
  .blanks-single-card .letter { min-width: 1.7ch; }
}

/* ========== Motion & contrast considerations ========== */
@media (prefers-reduced-motion: reduce) {
  .blanks-single-card .top label { transform: none; }
}
@media (prefers-contrast: more) {
  .blanks-single-card .letter { border-bottom-width: 3px; }
  .blanks-single-card footer button { border-width: 2px; }
}

`;function $t(n,t,e){let{allowRetry:i=!0,resultHandler:o,ariaLabel:s="Blanks Single Exercise",checkBtn:v=!1}=e,c=V("blanks-single",s);W("edu-blanks-single-style",He);let r=(p,R=c)=>R.querySelector(p),A=t.length,f=Date.now(),L,x,a,g,u,l,b={},h=new Set,w=0,H={},E=0,M=0,z=[],q=new Map;function S(p){let R=t[p],O=[...R.word],I=new Set(R.blanks||[]),F=document.createElement("div");F.className="word";for(let B=1;B<=O.length;B++){let T=O[B-1];if(I.has(B)){let y=document.createElement("letter-picker");y.setAttribute("mode","box"),y.setAttribute("placeholder","\u{1F4AC}"),y.dataset.pos=String(B),y.id=`lp-${p}-${B}`;let N=b[y.id];N!=null&&y.setAttribute("value",N),y.addEventListener("change",()=>{k(y.id)}),F.append(y)}else{let y=document.createElement("div");y.className="letter",y.textContent=T,F.append(y)}}return q.set(p,F),F}function P(p){let R=t[p];x.textContent=R.hint,a.innerHTML=`${p+1} / <strong style="color: rgb(var(--edu-first-accent))">${t.length}</strong>`;let O=q.get(p)??S(p);L.replaceChildren(O),g.disabled=p===0,u.disabled=p===t.length-1,l.disabled=p!==t.length-1}function k(p){let R;R=document.getElementById(p).getAttribute("value"),R&&(b[p]=R)}function C(){t.forEach((p,R)=>{let O=p.word,I=new Set(p.blanks||[]),F=q.get(R)??null;if(!F)return;let B=I.size,T=0,y=!0;for(let N of I){let $=F.querySelector(`#lp-${R}-${N}`);if(!$)continue;let _=$.getAttribute("value")?.trim().toLowerCase();if(!_){alert("You still have blocks to fill up.");return}let G=O[N-1].toLowerCase();$.setAttribute("data-state",_===G?"correct":"wrong"),_!==G?y=!1:T++}y?M++:z.push(O),E+=T/B,h.add(R)}),d()}function m(){if(c.innerHTML=Se,L=r("#blanks-single-word"),x=r("#blanks-single-instruction"),a=r("#blanks-single-progress"),g=r("#blanks-single-prev"),u=r("#blanks-single-next"),l=r("#bls-single-check"),l.disabled=!0,e.checkBtn)l.addEventListener("click",C);else{let p=r("#bls-check-container");p.style.display="none"}g.addEventListener("click",()=>{w=Math.max(0,w-1),P(w)}),u.addEventListener("click",()=>{w=Math.min(t.length-1,w+1),P(w)}),window.addEventListener("keydown",p=>{p.key==="ArrowRight"?u.click():p.key==="ArrowLeft"&&g.click()}),P(w)}function d(){let p=((Date.now()-f)/1e3).toFixed(1);E=E/A*100;let R={detail:{correct:M,total:A,score:E},timestamp:p,winningEl:U(E,M,A,p,z)};o&&o(R),r("#bls-check-container").setAttribute("inert","")}return m(),n.appendChild(c),{destroy(){n.removeChild(c)},check:C}}function _t(n){let t=[],e="",i=!1,o=0;for(let s=0;s<n.length;s++){let v=n[s];if(v==="["){i=!0;continue}if(v==="]"){i=!1;continue}e+=v,i&&t.push(o+1),o++}return{word:e,blanks:t}}function Jt(n){let t=[],e=/#\s*([^\n]+?)\s*\n\s*([^\n;]+);?/g,i;for(;(i=e.exec(n))!==null;){let o=i[1].trim(),s=i[2].trim(),{word:v,blanks:c}=_t(s);t.push({hint:o,word:v,blanks:c})}return{ok:!0,content:t}}function Gt(n){return!0}var Kt=`
# A day of the week... 
M[on]da[y];

# A month of the year... 
[De]cem[ber];

# A part of the day
[Mor]n[ing];

# Saturday and Sunday?
We[eken]d

# 100% Frequency
[Al]wa[ys];

# The Cold Season 
[Winter]; 
`,ot={name:"Blanks Single",description:"...",version:1,parserVersion:1,category:"input",tags:["Complete","...","Missing Information"],usage:["Vocabulary Practice","Guessing Games","Spelling Practice","Single-Answer questions"],wrong:["Multiple possible answers questions"],grammarExample:[Kt],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"Blanks Single Exercise"},implementation:{renderer:$t,parser:Jt,validator:Gt},styleTag:"edu-blanks-single-style",html:Se,css:He};function ce(){let n=r=>r.split("|").map(A=>A.trim()).filter(Boolean),t=r=>[...new Set(r)];function e(r){let A=r.length,f;for(;A!==0;)f=Math.floor(Math.random()*A),A--,[r[A],r[f]]=[r[f],r[A]];return r}let i=r=>{function A(a,g){let u=n(a);if(u.length===0||u.some(h=>!h))throw new Error(`@tx: provide at least one non-empty answer. Pos ${g}.`);let l=t(u),b=`id-${r.elsCounter++}`;return r.answerMap.set(b,l),`<input type="text" id="${b}" autocomplete="off">`}function f(a,g){let u=n(a);if(u.length===0)throw new Error(`@nm: empty content. Pos ${g}.`);let l=[],b=[];for(let w of u){let H=w.match(/^\s*(-?\d+)\s*(\.\.)\s*(-?\d+)\s*$/);if(H){let E=parseInt(H[1],10),M=parseInt(H[3],10);if(Number.isNaN(E)||Number.isNaN(M))throw new Error(`@nm: invalid range '${w}'. Pos ${g}.`);if(E>M)throw new Error(`@nm: range min > max in '${w}'. Pos ${g}.`);b.push({min:E,max:M})}else{let E=Number(w.trim());if(!Number.isInteger(E))throw new Error(`@nm: '${w}' is not an integer. Pos ${g}.`);l.push(E)}}let h=`id-${r.elsCounter++}`;return r.answerMap.set(h,{single:t(l),ranges:b}),`<input type="number" id="${h}">`}function L(a,g){let l=[...a.matchAll(/\[([^\]]+)\]/g)].flatMap(E=>n(E[1])),b=a.replace(/\[|\]/g,""),h=[" ",...e(t(n(b)))];if(h.length===0)throw new Error(`@sl: provide at least one option. Pos ${g}.`);if(l.length===0)throw new Error(`@sl: mark correct option(s) in [brackets]. Pos ${g}.`);for(let E of l)if(!h.includes(E))throw new Error(`@sl: correct '${E}' not present among options. Pos ${g}.`);let w=`id-${r.elsCounter++}`;r.answerMap.set(w,{correct:l,options:h.filter(E=>!l.includes(E))});let H=h.map(E=>`<option>${E}</option>`).join("");return`<select id="${w}">${H}</select>`}function x(a,g){let[u,l]=n(a),b=(u??"").trim().replace(/^["']|["']$/g,""),h=(l??"image").trim();if(!b)throw new Error(`@img: missing URL. Pos ${g}.`);if(!/^(https?:\/\/|data:image\/[a-zA-Z]+;base64,)/.test(b))throw new Error(`@img: invalid or unsupported URL '${b}'. Pos ${g}.`);let H=h.replace(/"/g,"&quot;");return`<img src="${b}" alt="${H}">`}return{tx:A,nm:f,sl:L,img:x}};function o(r){let A={elsCounter:0,answerMap:new Map},f=i(A),L=[],x=0,a="";for(;x<r.length;){let g=r[x];if(g==="@"&&r[x+1]==="@"){a+="@",x+=2;continue}if(g!=="@"){a+=g,x++;continue}let u=x;x++;let l="";for(;x<r.length&&/[a-z]/i.test(r[x]);)l+=r[x++];if(!l){L.push({pos:u,msg:"Expected a function id after '@' (e.g., @tx, @nm, @sl)."}),a+="@";continue}if(r[x]!=="("){L.push({pos:u,msg:`Expected '(' after @${l.substring(0,2)}.`}),a+=`@${l}`;continue}x++;let b="",h=!1;for(;x<r.length;){if(r[x]===")"){h=!0,x++;break}b+=r[x++]}if(!h){L.push({pos:u,msg:`Unclosed parentheses for @${l}(...).`}),a+=`@${l}({$content})`;continue}let w=f[l];if(!w){L.push({pos:u,msg:`Unknown input type '@${l}'. Allowed: ${Object.keys(f).join(", ")}.`}),a+=`@${l}(${b})`;continue}try{a+=w(b.trim(),u)}catch(H){L.push({pos:u,msg:String(H?.message??H)}),a+=`@${l}(${b})`}}return L.length>0?{ok:!1,errors:L}:{ok:!0,content:{html:a.replace(/\n/g,"<br>"),answerMap:A.answerMap},errors:L}}let s=r=>!0;function v(r,A=document){let f={},L=0,x=0,a=g=>A.querySelector(`#${g}`);return r.forEach((g,u)=>{L++;let l=a(u);if(!l){f[u]={ok:!1,error:"Element not found"};return}let b=!1,h;if(Array.isArray(g)){let w=l.value.trim();h=w,b=g.some(H=>H.toLowerCase()===w.toLowerCase()),f[u]={type:"tx",ok:b,expectedAnyOf:g,got:h}}else if("single"in g&&"ranges"in g){let w=Number(l.value);h=w;let H=Number.isInteger(w),E=H&&g.single.includes(w),M=H&&g.ranges.some(z=>w>=z.min&&w<=z.max);b=E||M,f[u]={type:"nm",ok:b,expected:g,got:h}}else if("correct"in g){let w=l.value;h=w,b=g.correct.includes(w),f[u]={type:"sl",ok:b,expectedAnyOf:g.correct,got:h}}else f[u]={ok:!1,error:"Unknown spec shape"};l.style.borderBottom=b?"2px solid color-mix(in oklab, rgb(var(--edu-success)) 45%, transparent)":"2px solid color-mix(in oklab, rgb(var(--edu-error)) 45%, transparent)",b&&x++}),{total:L,correct:x,details:f}}function c(){return o(`
      @img(https://picsum.photos/seed/market/640/360 | A bustling city market)

      Saturday Morning at the Market

      On a @tx(sunny | rainy) morning, Lina and Joel arrived at the old city market around @nm(7..9) AM.
      They planned to buy @nm(2..4) kinds of produce and a small gift for their friend\u2019s birthday.

      First, they stopped at a booth selling @sl([fresh fruits] | electronics | winter coats | phone cases).
      Lina pointed at oranges and asked, \u201CAre these @tx(sweet | sour | fresh) today?\u201D
      The vendor smiled and said, \u201CTry one!\u201D

      After tasting, Joel decided to get @nm(3 | 5 | 7) oranges and @nm(1..2) pineapple(s).
      They also compared two jars of jam:
      - Label A: \u201CHarvest Blend \u2014 @tx(homemade | organic | imported)\u201D
      - Label B: \u201CCity Classic \u2014 @tx(homemade | organic | imported)\u201D

      @img(https://picsum.photos/seed/jam-stand/640/360 | Jam stand with glass jars)

      Next, they browsed the craft aisle to pick a present.
      They considered a bracelet, a notebook, and a mug. The notebook caught their eye because its cover read:
      \u201C@@Make it happen.\u201D 

      At checkout, the clerk asked: \u201CPaper or @sl([reusable bag] | plastic bag | no bag)?\u201D
      They paid exactly @nm(10 | 12 | 15..18) dollars (including a small discount) and left before @nm(10..11) o\u2019clock.

      Back home, Joel typed a quick review:
      \u201CThe market was @tx(clean | lively | crowded), prices were @tx(fair | high), and the vendors were @tx(kind | helpful).\u201D
      They promised to return next @sl(Monday | [Saturday] | Thursday) to try new fruits and jam flavors.     
    `)}return{parse:o,checkAnswers:v,validateData:s,test:c}}var ze=`<div id="blanks-reading-wrapper">
  <head>
    <h2 id="blanks-reading-label">Complete the reading</h2>
  </head>

  <main id="blanks-reading-container"></main>
  
  <footer id="">
    <button id="blanks-reading-check">Finish</button>
  </footer>
</div>
`;var Re=`/* =============== Notebook Card =============== */
#blanks-reading-wrapper {

  font-family: system-ui, Segoe UI, Roboto, sans-serif;
  color: rgb(var(--edu-ink));
  
  background-color: rgb(var(--edu-bg));
  background-size:
    100% 100%, /* holes 1 */
    100% 100%, /* holes 2 */
    100% 100%, /* holes 3 */
    100% 100%; /* rules */
    
  border: 1px solid rgb(var(--edu-border));
 
  max-width: 760px;
  margin: 24px auto;
  padding: 20px 20px 16px 52px; /* left pad for gutter */
  box-shadow: 0 10px 30px rgb(var(--edu-muted) / 0.25);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* left gutter line */
#blanks-reading-wrapper::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 40px;
  width: 2px;
  background: linear-gradient(
    to bottom,
    color-mix(in oklab, rgb(var(--edu-first-accent)) 65%, transparent),
    color-mix(in oklab, rgb(var(--edu-first-accent)) 50%, transparent)
  );
  border-radius: 2px;
}

/* Header: notebook label tab */
#blanks-reading-wrapper header {
  padding-bottom: 8px;
  border-bottom: 1px dashed color-mix(in oklab, rgb(var(--edu-ink)) 35%, transparent);
}

#blanks-reading-wrapper h2 {
  margin: 0;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.2px;
  display: inline-block;
  padding: 6px 10px;

  background: color-mix(in oklab, rgb(var(--edu-first-accent)) 16%, transparent);
  box-shadow: inset 0 -2px 0 color-mix(in oklab, rgb(var(--edu-first-accent)) 28%, transparent);
}

/* Main content */
#blanks-reading-container {
  line-height: 1.9;
  padding: 6px 0;
}

/* Footer */
#blanks-reading-wrapper footer {
  padding-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  border-top: 1px dashed color-mix(in oklab, rgb(var(--edu-ink)) 28%, transparent);
}

/* Button with accent */
#blanks-reading-wrapper button {
  background: color-mix(in oklab, rgb(var(--edu-first-accent)) 22%, rgb(var(--edu-bg)));
  color: rgb(var(--edu-ink));
  border: 1px solid color-mix(in oklab, rgb(var(--edu-first-accent)) 50%, rgb(var(--edu-border)));
  border-radius: 10px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform .06s ease, filter .15s ease, box-shadow .15s ease;
  box-shadow: 0 2px 0 color-mix(in oklab, rgb(var(--edu-first-accent)) 40%, transparent);
}
#blanks-reading-wrapper button:hover {
  filter: brightness(1.03);
}
#blanks-reading-wrapper button:active {
  transform: translateY(1px);
}

/* =============== Inline Exercise Paragraph =============== */
.exercise-paragraph {
  line-height: 2.1;                 /* airy like lines on paper */
  font-size: 1.06rem;
  color: rgb(var(--edu-ink));
  background: rgb(var(--edu-card));          /* let ruled bg show through */    
  padding: 14px 16px;
  max-width: 720px;
  position: relative;
}

/* Inputs blend like blanks on ruled paper */
.exercise-paragraph input[type="text"],
.exercise-paragraph input[type="number"],
.exercise-paragraph select {
  display: inline-block;
  min-width: 7ch;
  max-width: 22ch;
  margin: 0 4px;
  padding: 2px 4px 3px;
  font: inherit;
  color: rgb(var(--edu-ink));
  background: transparent;
  border: none;
  border-bottom: 2px solid color-mix(in oklab, rgb(var(--edu-first-accent)) 45%, transparent);
  outline: none;
  vertical-align: baseline;
  transition: box-shadow .15s ease, border-color .15s ease, background .15s ease;
}

/* Focus = highlighted line */
.exercise-paragraph input:focus,
.exercise-paragraph select:focus {
  border-bottom-color: rgb(var(--edu-first-accent));
  box-shadow: 0 2px 0 -1px rgb(var(--edu-first-accent));
  background: color-mix(in oklab, rgb(var(--edu-first-accent)) 10%, transparent);
}

/* Select arrow, notebooky */
.exercise-paragraph select {
  appearance: none;
  padding-right: 1.5rem;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 20 20' fill='%236b7280'><path d='M5 7l5 5 5-5'/></svg>");
  background-repeat: no-repeat;
  background-position: right 0.15rem center;
  background-size: 1rem;
}

/* Placeholder tone */
.exercise-paragraph input::placeholder {
  color: color-mix(in oklab, rgb(var(--edu-ink)) 40%, transparent);
  font-style: italic;
}

.exercise-paragraph img {
  display: block;
  max-width: 100%;
  margin: 14px auto;
  border-radius: 10px;
  border: 3px solid color-mix(in oklab, rgb(var(--edu-first-accent)) 45%, transparent);
  box-shadow: 0 4px 12px rgba(0,0,0,0.18);
  background: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

/* Hover pop effect */
.exercise-paragraph img:hover {
  transform: scale(1.015) rotate(-0.4deg);
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
}

/* Small screens */
@media (max-width: 520px) {
  #blanks-reading-wrapper { padding-left: 46px; }
  .exercise-paragraph { font-size: 1rem; }
}

`;var Be=ce();function Zt(n,t,e){let{allowRetry:i=!0,resultHandler:o,ariaLabel:s="Blanks Reading Exercise"}=e,v=V("blanks-reading",s);W("blanks-reading-style",Re);let c=(H,E=v)=>E.querySelector(H),r,A,f,L=document.createElement("p"),x=Date.now(),a=0,g=0,u=[],l=0;function b(){v.innerHTML=ze,r=c("#blanks-reading-label"),A=c("#blanks-reading-container"),f=c("#blanks-reading-check"),L.className="exercise-paragraph",L.ariaLabel=s,L.innerHTML=t.html,r.textContent=t.instruction??"Complete the reading",f.addEventListener("click",h),A.appendChild(L),console.log(a),console.log(g)}function h(){let H=Be.checkAnswers(t.answerMap,v);console.log(H.total),console.log(H.correct),a=H.total,g=H.correct;let E=100/a;l+=E*g,Object.values(H.details).forEach(M=>{M.ok||u.push(M.got)}),w()}function w(){let H=((Date.now()-x)/1e3).toFixed(1),E={detail:{correct:g,total:a,score:l},timestamp:H,winningEl:U(l,g,a,H,u)};o&&o(E),v.setAttribute("inert","")}return b(),n.appendChild(v),{destroy(){n.removeChild(v)},check:h}}var it={name:"Blanks Reading",description:"...",version:1,parserVersion:1,category:"input",tags:["Complete","...","Missing Information"],usage:["...","...","..."],wrong:["...","...","..."],grammarExample:[`
@img(https://picsum.photos/seed/city/640/360 | A morning street)

It was a @tx(sunny | cloudy) morning when Anna left her apartment.  
She walked exactly @nm(200 | 250 | 300) meters to the caf\xE9.

@img(https://picsum.photos/seed/cafe/640/360 | Coffee shop)

Inside, she ordered a @sl([coffee] | tea | juice)  
and sat by the window with her @tx(book).

She spent @nm(1..2) hours there,  
feeling @tx(relaxed | inspired | tired).
                
     `],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"Blanks Reading Exercise"},implementation:{renderer:Zt,parser:Be.parse,validator:Be.validateData},styleTag:"blanks-reading-style",html:ze,css:Re};var qe=`<div class="bm-wrap">
  <header class="bm-header">
    <h2 class="bm-title" id="bm-title-id">Title</h2>
    <p class="bm-instruction" id="bm-instruction">Fill the blanks carefully and check your answers.</p>
  </header>

  <main class="bm-main" id="bm-main-id"></main>

  <footer class="bm-footer">
    <button class="bm-btn" id="bm-check-id">Check</button>    
  </footer>
</div>


`;var Ne=`.bm-wrap{max-width: 900px; margin: 24px auto; padding: 16px; display:grid; gap:16px}
.bm-header{display:grid; gap:6px}
.bm-title{margin:0; font-weight:800; letter-spacing:.2px}
.bm-instruction{margin:0; opacity:.9; color: rgb(var(--edu-ink)); display:flex; align-items:center; gap:8px;}

.bm-main {
    display:grid; 
    gap:30px; 
    counter-reset: bm; 
    border: 10px dashed rgb(var(--edu-first-accent) / 0.20);
    padding: 5%;
}

.bm-block{
  margin-top: 5px;
  position: relative;
  border: 1px solid rgb(var(--edu-border));
  padding: 18px 18px 20px 56px;
  border-radius: 16px;
  line-height: 1.95;
  word-spacing: 10px;
  transition: box-shadow .2s ease, transform .06s ease;
}
.bm-block:hover{ transform: translateY(-1px) }
.bm-block:focus-within{ box-shadow: 0 0 0 2px rgb(var(--edu-border)/.30), 0 8px 28px rgba(0 0 0 / .14) }

/* Number bubble */
.bm-block::before{
  counter-increment: bm;
  content: counter(bm);
  position:absolute; 
  left:14px; 
  top:50%; 
  translate:0 -50%;
  width:28px; height:28px; display:grid; place-items:center;
  font-weight:700; font-size:.9rem;
  color: rgb(var(--edu-ink));
  background: rgb(var(--edu-first-accent) / 0.40);
  border-radius: 999px;
  box-shadow: 0 2px 8px rgba(0 0 0 / .25);
}

/* Corner label (badge ribbon) */
.bm-badge{
  position: absolute; 
  top:-25px;
  left:10px;
  padding:6px 10px; 
  font-size:.72rem; 
  font-weight:700; 
  color: rgb(var(--edu-ink));
  background: rgb(var(--edu-first-accent) / 0.20);
  border: none;
  box-shadow: 0 4px 16px rgba(0 0 0 / .25);
  backdrop-filter: blur(6px);
}

/* Hint chip (glass) */
.bm-hint{
  display:inline-flex; align-items:center; gap:6px; margin-left:8px;
  font-size:.78rem; color: rgb(var(--edu-ink));
  padding:2px 8px; border-radius: 999px;
  border: 1px solid rgb(var(--edu-border));
  background: linear-gradient(180deg, rgb(var(--edu-card) / .3), rgb(var(--edu-card) / .05));
  backdrop-filter: blur(6px);
  vertical-align: middle;
}
.bm-hint::before{ content:"#"; opacity:.7 }

/* Inputs */
.bm-block input[type="text"],
.bm-block input[type="number"]{
  appearance:none; background: transparent; border: none; outline: none;
  padding: 0 4px 2px; min-width: 5ch; font: inherit; color: rgb(var(--edu-ink));
  border-bottom: 1.75px solid rgb(var(--edu-ink));
  transition: border-color .15s ease;
}

/* Select (custom-ish but accessible) */
.bm-block select{
  appearance:none;
  font:inherit; 
  color:rgb(var(--edu-ink));
  padding:4px 28px 4px 10px; border-radius:10px;
  border:none;
  border-bottom: 3px solid rgb(var(--edu-border));
  background:
    linear-gradient(180deg, rgb(var(--edu-card) / .9), rgb(var(--edu-card) / .7));
  position:relative;
}
.bm-block select:focus-visible{
  outline: none;
}
.bm-block select{
  background-image:
    linear-gradient(45deg, transparent 50%, rgb(var(--edu-ink)) 50%),
    linear-gradient(135deg, rgb(var(--edu-muted)) 50%, transparent 50%);
  background-position:
    calc(100% - 18px) 55%, calc(100% - 12px) 55%;
  background-size:6px 6px, 6px 6px;
  background-repeat:no-repeat;
}

.bm-footer{display:flex; gap:8px; justify-content:end}
.bm-btn{
  border:1px solid rgb(var(--edu-border));
  background:
    linear-gradient(180deg, rgb(var(--edu-card) / .95), rgb(var(--edu-card) / .85));
  padding:10px 14px; border-radius:12px; cursor:pointer; font-weight:700;
  transition: transform .06s ease, box-shadow .2s ease;
}
.bm-btn:hover{ transform: translateY(-1px) }
.bm-btn:active{ transform: translateY(0) }
.bm-btn[aria-busy="true"]{opacity:.7; pointer-events:none}

#bm-check-id{ color: rgb(var(--edu-ink)); background: linear-gradient(135deg, rgb(var(--edu-first-accent) /.16), rgb(var(--edu-second-accent)/.16)) }

.is-correct{ box-shadow: inset 0 0 0 2px rgb(var(--edu-success)) }
.is-wrong{ box-shadow: inset 0 0 0 2px rgb(var(--edu-error)) }
`;var st=ce();function rr(n,t,e){let{allowRetry:i=!0,resultHandler:o,ariaLabel:s="Blanks Multiple Exercise"}=e,v=V("blanks-multiple",s);W("blanks-multiple-style",Ne);let c=(E,M=v)=>M.querySelector(E),r,A,f,L,x=Date.now(),a=t.blocks.length,g=0,u=0,l=[];function b(){v.innerHTML=qe,r=c("#bm-title-id"),A=c("#bm-instruction-id"),f=c("#bm-main-id"),L=c("#bm-check-id"),r.textContent=t.instruction??"Fill Blanks Exercise",h(),L.addEventListener("click",w)}function h(){t.blocks.forEach(M=>{let z=document.createElement("p");z.className="bm-block";let q=M.label?M.html+`<span class="bm-badge">${M.label}</span>`:M.html;z.innerHTML=q,f.appendChild(z)})}function w(){t.blocks.forEach(E=>{let M=st.checkAnswers(E.answerMap);M.correct===M.total&&g++,console.log(`
        THE AMOUNT FOR BLOCK ${E.label} is:

        CORRECT: ${M.correct}
        TOTAL: ${M.total}

        CORRECT ANSWER VALUE (100 / total): ${100/M.total}
        POINTS FOR THIS BLOCK: ${100/M.total*M.correct/100}
        
      `),u+=M.correct/M.total*100,Object.values(M.details).forEach(z=>{z.ok||l.push(z.got)})}),H()}function H(){let E=((Date.now()-x)/1e3).toFixed(1);u=u/a;let M={detail:{correct:g,total:a,score:u},timestamp:E,winningEl:U(u,g,a,E,l)};o&&o(M)}return b(),n.appendChild(v),{destroy(){n.removeChild(v)},check:w}}function nr(n,t=st.parse){let{title:e,rest:i}=oe(n),o=se(i),s=[];for(let v of o){let c=v.trim();if(!c)continue;let{label:r,cleaned:A}=ie(c),f=t(A);!f||!f.ok||s.push({label:r,html:f.content.html,answerMap:f.content.answerMap})}return{ok:!0,content:{instruction:e,blocks:s}}}function ar(n){return!0}var or=`
@TITLE = Fill the blanks;

# gerund
I am @tx(going) to school tomorrow, I come back at 04:00 @sl([pm]|am);

The days of the week are @nm(7), but you know we live as if they were 10!;

# Look at the answer first
A: What is @tx(her) name?
B: Her name is Maria; 
`,ct={name:"Blanks Multiple",description:"...",version:1,parserVersion:1,category:"input",tags:["Complete","...","Missing Information"],usage:["...","..."],wrong:["...","..."],grammarExample:[or],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"Blanks Multiple Exercise"},implementation:{renderer:rr,parser:nr,validator:ar},styleTag:"blanks-Multiple-style",html:qe,css:Ne};function le(n){try{let t=We(n);if(!t.ok)return{ok:!1,errors:t.errors};let e=t.distractors||[],i=t.resultString||n,o=i.match(/^\s*#\s*(.+)$/m),s=o?o[1].trim():void 0,v=/(\w+)\s*=\s*([^;]+);/g,c=[],r;for(;(r=v.exec(i))!==null;){let f=r[1].trim(),x=r[2].trim().split("|").map(a=>a.trim()).filter(a=>a.length>0);c.push({category:f,words:x})}return c.length===0?{ok:!1,errors:"No valid category definitions found"}:{ok:!0,content:{instruction:s,items:c,distractors:e}}}catch(t){return{ok:!1,errors:`Parse error: ${t instanceof Error?t.message:String(t)}`}}}var De=`<div class="edu-categorize" id="cca">
  <header class="cca-header">    
    <p class="edu-categorize-instruction" id="cca-instruction"></p>

    <div class="edu-categorize-palette" id="cca-palette">
      <button type="button" class="edu-categorize-chip" id="cca-none" aria-pressed="true" data-active="true">
        <span class="edu-categorize-swatch" style="background:rgb(var(--edu-bg))"></span>
        <span>None</span>
      </button>
      
      <!-- Category painters injected here -->
    </div>

    <div class="edu-categorize-current" aria-live="polite">
      <strong>Current:</strong>
      <span class="edu-categorize-swatch" id="cca-current-swatch"></span>
      <span id="cca-current-label">None</span>
    </div>
  </header>

  <main class="edu-categorize-grid" id="cca-grid"></main>

  <hr>

  <footer class="edu-categorize-footer">
    <button class="edu-categorize-btn" id="cca-check">Check</button>
    <button class="edu-categorize-btn secondary" id="cca-reset">Reset</button>
  </footer>
</div>
`;var Pe=`.colors-categorize {

  margin:0;
  padding: 0;
  background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQTERUSExMVExIXGBcYGRYXFxgdGRgdGhYYGhgYGBcYHSggGh0lHRcaIjEiJSkrLi4uFyAzODMsOCgtLisBCgoKDg0OGxAQGysmICYvLS4rLTUvLS8tLi0tLy0tKy8tLS0vLy0vLS0vLy8vLS0tLS0tLS0tLS0vLS0tLS0tL//AABEIAKgBKwMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYDBAcCAf/EAEAQAAEDAgQDBQYDBgQHAQAAAAEAAhEDIQQFEjFBUWEGInGBkRMyobHB8EJS0SNicpKy4RQVU/EkM0NzgqLSFv/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQIDBgEH/8QANxEAAgEDAgMFBwMDBQEBAAAAAAECAwQRITEFEkETUWFxkSIygaGx0fAGweEUQlIjM3KS8TRi/9oADAMBAAIRAxEAPwDuKAIAgMdSs1sBzgC4wJO55BepNmUYSllpbbkdmGblhOin7VrQZeHtDWkbtdyMQesrONPO7wTKFmppc8uVvZYeWu9Gzgs0pVbNe3VcaZvIAJifeF9xZeShKO5prWtWl7yeO/8ANvI3FgRwgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgIjMcQQ+f8QGtBALAyTBs64vqtPQaiZi22K02J9CmnDHZ5fR5x5ad310S8danm4DiBXa7jpcxzeA/d9yCHA7mTey9dPTY2ytG455GvHKf779H3dxG43tRVY4gaHAF7drkhxh9jAERaeB6LZGhFomUuF0pxy8rZ/Lb88CCOaVIIGkTILg0B0GJEjwF9zAut3Iiy/paeU3nTpnT8+XgemZxWBBDyPdkcHaQANQ2NgAnZxPHZ0WsNd/wz3Hpmad59R1MGo52rUHPaRO4GkzHmnJpjJ47X2VBS0SxjCf1RJUM0DhLKppuAbLHF2l7tX4SCXCBJvO4GwWtwxuiJO1cXiUeZa4axlLHXpr8OvVliyjNxUaS8hsjWLggNAGqSNoJNjdaJ08PQqLqzdOWI69Ou+uPVdwxeeNA/ZDW4XJOprGtAkuc8j08UjTfU9pWMm/8AU0XTZtvuSyesNnOp5b7MzAcGggugge9+ETeL7DqJ8dPCzk8qWfJFS5uuM9Ph189Po8SVOoDt8iPmteCHKLjue0MQgCAIAgCAIAgCAIAgCAIAgCAIAgCAIAgPFSq1sanASYEkCSdgJ4r1Rb2RjKcY7vB7XhkfCUAa4ESDIPEI1g8TTWUfUPQgCA51meZVgH0HtDGkgxoLTY2N7mYFzKnQhHSSOst7ai3GrF5fnn+PQiS4zMmea2k7Cxg+IAgCAID610GRYjYoGk1hn3WeZ4j13Hmh5hGStiXuMue5xgC5Ow2C8UUtjGNKEFiKSPFKoWkFpIIg26GfmF61kylFSWGXjKqVd9P2rcSHlwJILZEgmGtJA0tNgRB2MKHNxTxg5u5nQhU7OVPGPHp3vvfdr5kzhsTqc9pAa5pAiZkFoM3AtePEFamsJMr6lLljGS1T++xsLE1BAEAQBAEAQBAEAQBAEAQBAEAQBAEBr18bTZ7zwLx4He8beJ5rONOUtkap1qcPef5+xVO12fMe11BgJIc06xBbaD3SDIN4nxVnZWsotVJeOhQ8V4hCcXRhumtdMd+hBUs/xDXmoKhLi3TcAiBtDdh/vzUx2tJx5caFZHiFzGbmpatY8PTY1HY6odZNR512fc94citqpQWMJabEd16r5syeu+u5sYDOKtJzXNcTpbpDXE6QOWkELCpb06iaa318TbQva1GSlF7LCTzjHkXrs5nYr0i55a2o33gLCODr7A/QqmurZ0p4js9jqOH3yuKWZYUlv+zJajWa4amuDhzBBHqFFlFxeGifCcZrMXlHteGRyRxm5uVZndJY2PiAIAgCAIAgCAIAgLf2Vzwx7KoRAgNJgROlrWhobtPGeKi1qXVFFxKxWe0prz+bby38i0imNWsco8byPr69Ao+dMFLzPl5fEyLwwCAIAgCAIAgCAIAgCAIAgCAIAgNLMc0pUW6qjwOQFyTyAC20qE6jxFEe4u6VCPNN/cqGY9sHmoHUZawNI0vAuT+Kx4Wi/NWtLh8VHE989Dn6/Gqjqc1LRY2ff36FZeZJJuSZJO5J3JVgtFhFI9W292fEAQBAEAhenmDfwGbVKTSxsFpdqgzY2u0g2NhzWipQhUfM9yXQvKlGPLHGM5+Ph+M6VgceyrTbUaRDhO9xzB6g28lz9SlKEnF9DsqNxCrTU4vRnLVPPoIQBAEAQBAEAQBAEBnwuJ0WI1MJaXN21abgE7gSvGsmupT59Vo9cPuz4F37LZk2oz2bRp0AQJHnAHCQfVQ60GnlnOcRtpU5c71znvJ5aSsCAIAgCAIAgCAIAgCAIAgCAICs9tsX7NjdLnte+wguAABGrYgSQY4+SsLCnzyeUsL8RS8ZrdnBKLab23+JQgFdnK4SC8PQgCAIAgCAIAgCAzqoPvoQBAEAQBAEAQBAEAQEv2czT2NQA+44i3dEE2DiTwAJ9Vqqw5kQb+17anlbrz23wdDY8EAggg7EbHzUE5Rpp4Z6Q8CAICNz+k40S5hIcwh4gjhzkXgX8QFJtZRVTEtnoeS2MeBz2k6m1z6jWujvAm8jfhfyWVW0qKbUVlHikjHU7T0Btrd4N+F4WSsKz7hzIzUO0FB349Np7wI8p2lYSsq0eg5kbmExtOqCWPDo5foVpqUp0/eWD1PJsLWehAEAQBAEBBdtKGrCuOoN0ua6/Hhp8b+qm2EsVlpuVfGIc1q3nGGn5+BzlXpyAQBAEAQBAEAQBAEBnVQffQgCAIAgCAIAgCAIAgJb/LtNFtZpBltpDxpI3dqBixtfeNlq58y5WQf6jmquk+j8NV3Y39O/ctGT42CGgOFKY7wYNDnS/TqDrgDpxCjzj6lNdUMrmyubwzqlpnGO8nlpKw81KgaC5xAAuSdgvUm3hAiX9pqA/E4+DT9VLVhWfT5mPMioYvGPe9zi497eLSBYCB0VxTpRjFRS2NbZrLaAgCA2MBjHUqge3cbjgRxBjgtdWkqkeVhPB0djgQCNjdc21h4Nx9XgCAIAgCAhO1uYMpUC1wa9z7Na4SOriOQsfGFMsqUp1MrRL8+ZWcVuYUqDjJJuWiT+vw+uDm6vjjwgCAIAgCAIAgCAIDzgsYx7WkECfwyJEcPgqGhXhVimuvQ+8Uq0ZxTXobK3m0IAgCAIAgCAIAgCAvHZzCNrYEU3zp1O2MbP1fNRKsnGplHOX9WVG854b4X0weMFhm0TqhzwCabzDtQLocXOEnfuwBO+8lJNyMqtWVdcuizqtsaaYXzznBZmiBCjlO3lkF2jzOk1vsnN9o6QdMkAQeJHhsp9nb1G+dPC7zCTRUK1TU4mAJMwBAHQDgFcRjyrBrPCyAQBAEAQFqy/tS0NDajCCBALLg+RNviqmtw+WcwfqZqRL4POKNT3XgHbS6x9Dv5KHUtqtPdGSaN9aD0IAgCA5f2izE167nT3QdLfAHfzMnzXR2tHsqaXXdnEX9y69dy6LReS++5GLeQwgCAIAgCAIAgCAIClNcRsYPRfOU2tUfWk8bFhyvOtRDKkNhsaidzMeVldWnEOZqFTTTfvZZ295lqM+7fxJtWpYBAEAQBAEAQBAEB0TsnRLcKybEy7yJJHwhQazzNnKcTmpXMsdML0NmnopBzeBcS1sg9SZJteTeIJUSvdQhjLy+7TP2Xm8I1S56rUvDV/nh3Cvi3FrvZhjnwdIFQTMWkER8VqpXac9k11SknL00XzNbo4XVea0/PgUvN9Lagpts5rRq1AhxJu5xnfxFl0dheQuE9cPPuvRpeXd47Mj1Kbh5d/Q0lYmsIAgCAIAgCAAoCz9lMe4n2ZjT43kkkmOI+Uyqu/orHP1M4stKqjMIDBj6mmlUd+Vjj6NJWdNc00vFGqvLkpyl3J/Q5GF1BwC2C8PQgCAIAgCAIAgCAICkr5wfWQgJjJczeHtpuOphsJ3HK6s7G8qKcacnlbeROtbmakoPYsqvS2CAIAgCAIAgBQ9OpPxdNlNriQGQNPURaB4Klurmlbx5qrwcUqVSdRxS16kJXz8yfZtAni656WFguWrfqCWX2McZ6vf06Y+PzLKHD1j236GlVzWq6znAjkWtj4hVtXi11VWJyTXdiP2JEbWlHZfNnP8ZjqhqO1nUQ528SDMGHN224WV5R4jVUIpvK6b5X/ABe69ceBElRjl9PzqbWCzfhU/m/VdHw/9Qp+xc/CX3+/0Idaz6w9CTFcRPD81iPULpFcwa5v7e/Rr1X1eEQuR7dTKpBiEAQBAEAQG5lFcMr03EwA655A2PzWm4g50pRR6tzoYK5w2n1AaOen/hq//aqf0Fbrf/dj5r6kW+/+ap/xf0OVLpDhggCAIAgCAIAgCAIAgKSvnB9ZCAlOz+D11NRgtbw68Pl8FYcOoKpU5nsvr0JlnS555eyLSugLgIAgCAIAgCAw4nEhg5nkoN7f07WOusui+/cjbTpObJTJse6rTGoy5nd8B+GOQi3kvm/E6tStXdSo859F4IhXdvGlU9laPX49TfVeRiNzfEaSwF5psOrU5sTZthcKTbw5k2ll6aGqo8YKg+JMSRzO/mrhbEQ+IDLQxDmXa4j75KTb3le3eaUmvp6bGE6cZ+8iQwObRZ4tzHDy5K/4f+oHTfJXXs9Gunw7vp0WMJRK1pnWG5NtcCJFwV2MJxnFSi8p7Fc008M+rIBAEAQBAW7sfjS5jqRM6ILfA8PI/NU/EKSjJTXXfzM4MsSrjMxYuu1jHPfZjQSfBZQi5SUY7murUjTg5z2W5yInpHTl0XUHAHxAEAQBAEAQBAEAQBAUlfOD6yEBL9m8RFQs4OHxFx8JVlwyry1eTo/qvxk6xqYny95ZlfFsEAQBARWZ59TpHSCHOvIF46Hr0W6FGUtSnvuNW9s+RPMvDp/Ph+OFqdq6k91rI6h3/wBKQrWPUoan6nr59iMceT+5lo9rv9Snbm0/Q/qtdS1WG29CRQ/VLzipT9H+z+59oZzTxB7hg/kNiB4cfJfP+JOpOq5NYj07sfdnYcO4lbXUcU5e11T3/PInOzr3CtA2IOrwix9fmqS8S7PL+Bvv1F0svfoWpVRSkbn9VookOuTZoib8/JSbSMnUWPiaqrXLqU9XBECAIAF6k28IFoy6kW0mg7x8zML6VwqhOjaQhPfH1ecfApa8lKo2jZVgaggCAIAgJjsnUjEgfma4fCfooV/HNFvuwZR3LwSqM2HPe1PaD259nT/5LTv+cjj/AA8vXkryztOyXNL3voclxPiP9Q+zh7q+f8d3qV5TipPFWs1vvED75KPXu6ND/ckl9fTcyjCUtkYP8wZzPoVAfHLPvfozZ2Ez7/j2cz6FZLjdn/k/+svsedhPuMjMSw7OH34qVS4hbVXiE1nu2fozF05LdGVSzAIAgCAh8f2hpsJa2HkcRt4SN+v14bFBssKPD6k1mWhGO7VP4MZHn+qy7NEtcKh1kxmGDLKjmwTvfTA6wJNgvltKopRTO3oVlOCl++fxmotpvN3Jf+fT8T/SVKsf/oh+dGSLX/eiXBdMXgQGLF4htNhe4w0D7HisoxcnhGm4rwoU3UqPRFOzLtJUqAtb+zaeXvHz4eSnQt4x1epw99+obiunCn7Mfn6/b1IRbygCA08dX/CPP9FS8Uu8LsY/H7fckUaf9zNOm8tIIJBGxCoGk1hkynUlTkpQeGtmdm7F5y3E4dpgNqN7rwABJFtQjgfgZXF8StXQrNbp7fY6y04hG6Wr9pbr9/JlgVeTCC7R4LumrqJI0iCbAbGPOPip9nV1UMEetD+4rSsiOEAQG1llfRUBMQbeE8QrTg9yqF1FtLD08s9V+bGi4hz02WdfRynCAIAgNLEZkxth3jyH6qPO4hHRam+nbTlrsjC3MWukuc5vJoHTmN1rVeMtW8eBtdvOOiSfiT3ZDNKbajnE6iAIDhDgCblukQeG8eKg31x7KWXg2U7Ocuiz5l9bVZVaQDIIvwMEcjdQIz1yiPVoyScZrwObZ1ktTDEB5Ba6dLhxiNxwNwujoXMay036nDXdjUtWlLDT2fkQOOxmnut975f3VXxXiv8AT/6VL3+r/wAf58Pi/HVSpc2r2Ipxm5uVyMpOUnKTy31JiWD4sQEAQG7gMUQQ0mWm3hyV3wniNSnUjRm8xei8H0x4dMGitTTWVuSq7AhmtmOObRYXu8AOJPJZJZZuoUJVp8sSoZlnlSsNNmM4tbx8TxW6MEi9t7GnRfNu+8jFkTQgOl18r1CNdjU1kEbg7smZj7hfFY18POOmP5N8Lrleca8uF595oZvkbAx72Q3SNQaByF778PWVvoXUnJRlrkk2t9NzjCWudM/QjuzuFLqntPws+JIiPjK6PhtFyqdp0X1OmsqTlPm6Is6vy3CArfbTEjQynxJ1eAAI+Mn0Uu1jq2ct+qLiKpwo9W8+WNPnn5FSUw4sIDxVfAt68uqj3FSUY4jv39Eu/wCyM4LO5EuN1yM3mTZOR8AWILxkuMNB7HtEQBLRyO7VR3NJVouL9SttLydtcKrF5118V1Om0qgc0OBkEAg9DsuXlFxbTPpVOcakVOOz1RF9oy4tZTaJL3fK/wB+Cl2eFJzfRGFbZIqitSKEAQBegtGGxbXQAZOkOMbDp4r6VacQpV2oReXyqTxsvDz8ClqUZQ1e2cGyrA1BAaGYZgGS1t3fAf3UatXUdFuSaFu5+09iCVcWYQGShWLHBzTBCxlFSWGeqTTyi45NmjnMD2ktINwNgeMTzEKqqwdKeEyYlCtH2kaHavOHvqEvEaWgMHAyLkdZmfAK1pXkKFnKpH3v3ei+H8nzz9QWlWF2lL3P7X9fjn9iokrknJyeW8tlefF4AgCAIDPgqep4Hn6XU/hlFVrqEW8YefTXH50ya6ssQZNrvCAVPthiAajKY3aCSf4ot6D4rdTWmS84XTag59/7EAthaBAEB11fDTUaGe1Q3D1J4jT/ADW+q320c1Ykqzi5V4+voRXZh37NwnZ23iBf4H0Xb8LeabXczubB+w14kyrMnhAUjta8nEkcmtA9J+qsLdewfP8A9Rzcr1p9El+/7kKt5RBAa2PfDY5lVnFavLR5V1fyN1BZlkjlzRLLBklGKeqLuJPlsPvqq+5lmeO4q7yeamO4kVHIh0Psy4nDU5MwCJ8/pt5LnL1YrSPovBZN2UMvP5+23wJGpSa6zgD4jyUZScdmWjSe5Tsxy91M3uOcdfSLhXNGsqiIc4OJoreYBAe6MahO0ifCbrdbqDqx5/dys+WdTGeeV43J/BUwKtSAAAGC21xJXdcPowje1uSKSSgtNtVllXVk3Sjl95vq7IxgxtfQwu47DxK11Z8kWzZRhzzSK2Sqktz4h6EB6pxInaRPhxXjzjQLfUuWEotawBnu7jrPFU1SUpSzLcsoRSWhU+3lSqHMAB9iBJjbVJEnwtC0VZU+VQ/uy3+fM57jsa8mks8mPnl7/LwIjC1tQ6jjz5FQpLBxlSHKzMsTWEAQBAZcKe+3xHzUqxk43NNr/JfN4MKnusnV9BK8oWeOJxFUn80egAHwCkR2Ons0lQjjuNFZEkNEmBcnYDc+SPTVhJt4WrJmn2arEAksE8CTI8YCiO8pp9S9h+nrqUU24rwy8/JHQyYubBfGDnUs6IqGd5yKzQ1oIAcSZ48Gn0Jsra3tnSbbZf2dm6MnKT1x/wCmDIazm1mgbOsR0gmfJXHD5yjXSXXcubObjVSXUti6MuggKR2srtdX7pktbpJ6gm3lKsLeLUNTgP1FXp1bvEHnCw/PL0+H8dDVyTAitV0u90AuMcQIEepWypLlWTl7uu6NPmW+yLjTwFJogU2Afwj4k7qK5N9SglcVZPLk/Ug8/wAmpFuv2YbcAaZFoMmBa5+QVHxaVTs1Uz1wvLXX4v8AYs7K9qxlyc2fmQTcopgzBPQlc+7moyyd5UaN4BaCMfUPC+dmn/s2AOLmhl7yAe6RHLdwj91UF6vbba6/f+H8TvuDSzSgovK5deuumPLdrHgTagl4Y69Br2lrhIKyjNxeUeNJrDKpj8ncx4a06g73biesjpzVtSuozi29MbkSVNp4R9wmRVHkhw0ASJI5chxHVeVLuEVpqI0pM0sbhwx5aHB8RcbXW+nPnjnGDCSw8G/kNc6izgRM+FvRdZ+m7qXaSoNaNZz5YXoQL2muVSJtdkVxoZzHs77yI6/YKjXWOQk2me00IJVxZhAEBlw7WlwDiQ0m5HBYzbUW47nsUm9S6MYAABsBA8lSN5eWWaWFgrfa4k06oHBg9Jk/BVNaSd2vDH58yDxLP9LUx3f+lUytp0yeO3kpFXc+d3LXNhG6tRHBQBAEBlwpGts8/wDb4qXYuKuabltlfx88GFTPK8E6SvoBXlCzvENqV3vZdpgTzgAT8FIisI6e0pyp0VGW5jyzBe2qCnq02JmJ26SsatTs482C1sbR3dZUk8aN5xnb0LnluAFJjW2c4T3oANyT9VU1arqSbO5sbGNrSjDRtZ1xh6vP5qbi1E81u1OP0s9kD3n79G/329V85sqXNLnfT6nzjh1Dmn2j2W3n/BVFaF4Wbs2WmnYAPBIJgSRuJP3sr7hjg6WiWVv3+Bb2Li4aLUl1ZE0x4lhLHBp0uLSAeRixXsWk9TVXjOdKUYPDaeH3Poc4xeGdTeWPEOG4mfkrWMlJZR8tuLepb1HTqLDRKdk3xXI5sPzaVrre6VPEo5o/H7lvUUoDUzWnqpO6CfQz8lB4lT57aa7tfTUkWsuWqisLjC5CAIDPQxbmCAbTMf7XWuVKMnlkildVKS5YvQnsmz64ZUtyc06fWIHqq+5s9OaH3/PgX/DuMJyVOrp3NafTC9fiy2YWrqBvMGJ2mwNxwN4PUcFUzjhnW0J86eucdfn69/j3HqrpHfdA0z3jFud+C8jzP2V1NrxuyvZrnuoFlKQDYu4nwHDxVhQs+V80/Qjzq50RBKeaCeyJwLDaCDc8+IXcfpuUJW7Sjhp4b7+q9CsvE1PckiV0TIaK1isQXuk+Q5KpqVHN5ZcU6agsIwrA2BAEBK5RlYqgucTAdEDjYHfzUW4uHTfKkb6VJTWWWVVhNIPFOl7vE/oucuJc1WT8fpoeGtgsvoB0upCOhIHoDH34rCdes1pIqrjhNrUWVBZLVQyyiy7aTAeekT6m6rpV6st5MrIWtGGsYJfA2atIOGlwDgeBEj0K1xk4vKZulGMliSyjnud4QUq72N90QR0BAMeUrobao6lJSe5yV5RVKvKEdunx1NBbyKfV7jOgJLF4R78O6nqh5ET57E9RbzX0GwhVp0YxrPMlv+3yItKrCFZTxoUatSLXFp3aSD4hWaOlhJSipLZkh2adGJZ1Dh/6k/RR7pZpMuOBy5b2HjlfLP7F2VQd8EBUcXiDUe57tyfTkPILiqcFCKijkaVNU4KC6GFZmZa+z9DTRB0kOcSTO55eFl0XDqfJRzjDf4i5s4ctPONWSSnEsIChdpKLm4h+og6u8PA7A+ACsqDTgsHzjjlGdO9nzvOdV5dF8CLIW4qS/ZVivaUWP4xB8RY/fVQZxxLBzF1S7Oq4+nkbZCxaTWGaE8FTxmHLHlp8uo4Lhru3dCq4P4eXQvKVRTipIwqObAgCAIDoGUVhSwrXVDHHqZvEcT97LnriLqV2oH0bhfNC0i57vX1/PxEJmuaOrGPdYNm/U9VNoW8aS8TfOo5EepBgEBZMnP7IWjfz6r6HwKXNZRfLjf4+P3Ki6WKj1NwlW5HKziapc4uMX5KpnLmk2XNOChFJGbL8A6qSAQANyevRR6taNNam6nTc9iR//PH/AFB/L/dRv61f4/M3f0z7z43s8eNQfy/3R3q/xH9M+8mcHhhTYGN258zzUOpUc5czJMIKKwj3WfpaTy+wo9ap2cHLuMmQb2Ebrmk8mKaex5Xp6WfLK2qk08RY+SgVY8smUtxDkqNG0tZpOe9oHTiap/ej0AH0XQ2ixRicjfvNzPz/AGRHKQRD1TbJAgnoN1spU3UmoJN56Lc8bwslgAhfRklFYRWnPczoaKz2E6iDvzm/1UqLyjqreanSjJLGhiw1Yse143aQf1HnsvJx5ouL6kuhWdGpGpHdNP8APM6FSqBzQ4XBAI8CqNpp4Z9Mp1I1IKcdmso9rwzKWuNOUNnLaZdVYAJ7zSegBkkrfbQc6sVHvRtoRcqiS7y6LqS/CAICJ7RZf7Sk4tYHVBEGO9ANwD4TZbqM+WWr0KbjViri3k4QTmsY78Z2+uhSquFe0S5jmjmWkD4qwUovZnA1LatTXNODS8U0S3ZbH6H+yPuv26O/vt6LXWjlZKjiNDnh2i3X0/gtqilCauYYEVRycNj9D0UK9so3MMPRrZ/nQkUK7pPwK3WoFpII2tI2tyK5CrQnSk4yX2LeM1JZRjWoyCAk8twMD21Vv7Me60/9Q8AP3eZ8lFrVtezg9evh/PcXnCeFutJVaq9hbf8A6f2738DYxWKdUdqeZPDkOgHBaqdOMFiJ17k3uYVmeBAbmVUdVUWkC59LfFW/BLftruOVlLV922nzI9zPlpssq+iFQfCJsvGshPBXMfQ0VC0bWIVXWhyTaRbUZ88E2SfZgd5/g35lVt7sifbbsn1XksIAgNerWAqU2/vAn6fH5Ko4rV9js15s0189nLHcaGZNh58Xf1O+hCqaT9kxt3mHp9Eaq2G8l+z9W7mf+Q+R+ijXEdEyBfQ0UvgS2JrhjHPcYa0SVHhBzkordlXUqRpwc5bI5pXql7nOO7iSfMyumjHlSiumhxc5ucnJ9Xn1N1mWWu6HfALpqX6fzTzOeJeWUvv6oiO410WhkwuB0u1F0x0Umw4M7asqsp5xnGmN9O8wqVuaOMG6r00ER2ky91WmNDQXtM8JIgiAfos4Sw9SfYXEaU3zvRoqmKy+rTEvY5o58PMjZblJPYu6dxSqPEJJlg7J47Uw0ibtu3+E/ofmFXXlLEuddTtv09d81N28t46ryf2f1RYFCOkPf+Dp/wCmz+UfotHYUv8AFeiInY0/8V6GRjALAADoIWyMVHRIzUUtkel6ehAEAQHx7QRBAIPA7L08lFSWJLKI3H5dRbSe4U2NLWuIcAAQQJBB5ytsKknJLJU33DrNW1R9nFey+i7j1l2KFWk1/MX6EWI9VslHleD4hcUuyqOH5g2ViaSMzbMNHdbGrieX91TcT4h2X+nT97r4fyTrW35valsQVKoWkOaYIMgrlZJSWGW0JyhJSi8NF5ySvRxDNbqdMVG+93W2/eFtiqK5hVoy5VJ4e2p3fDKtte0+eUI8630Xr8SGzbG+1qE/hFmjpz81NoUuzhjr1J85czNJbjAsmAwtP2bToEkA3En4r6Hw2wtXbU5dmstJ6pN582VFarU52smc4Vn5G/yhTXY2r3px/wCq+xq7Wfe/UyMYBsAPAKRCnCmsQSS8NDFtvc9LM8CAw4nCtf7w8+K1zpRnubKdWUPdJHsrgKIraHTDxAvxFxt5/BV17ZxdPmXQkU72rF6E/nuUtptD2SBMETO+xE/d1R1KaSyizs7uVSXJMg1pLE8Vqoa0uPBa6tRU4OTBCVKhJ1Hdc5ObnJyl1PD3ia+s6jvx9AJ+BWqMeXQ104ciwvzcwrM2GXDYxtJwqPOloNz42XkqbqLlitSNeShGjKU3hIjs8zp1c6R3aQNm8T1d+nBTLa1jRWXq/wA2Pn17fSuHhaR7u/zNDAsmo319Lq74XSVS7gntnPos/UrKrxBk2u7IAQBAEAQEdnVcUaYqACQ5sWF794fyyjhzpxZccDuqlvewqx6Zz4rqvzqblGoHNDmmQQCD4qrkmnhn2mnUjUgpxej1RtUqgcA5pkG4K1QmppSjsaoyUllHuFkeiEAhAIQCEAhAVntVmwg0GXJ988v3fHmpdvS15mcp+oOKRUXa03q/efd4eff6Gp2SxcOdSOzu83xG48x/St1aOmT5zxOjmKqLpo/L8+pM5rjQxpa0988uHOeVlRcSvo0YOEJe39PsQLa3c5c0loV0grkm29WWuD5CHuDz/mDqLhEjVZ3Vp3H3yXvYKqtem3mWPDK0qFXtOmz8US4vcbKG00dummsoQmD0s2Uz7Fvn8yvovBZN2NPPj9WU9z/us24VqaBCAQgEIBCA+tJBBFiLg8l48PRgt9THivg3O/GNOodQ4X8CubvaHZNrp0J9hL/Wj8foV2FWnQkXmVaXaRsPmqW/rc0+RbL6nhpwoAEIDXxuLbSbqeYHAcSeQC2U6UqksRNFxc06EOeb+78im5nmL6zpNmj3WjYdep6q4o0I0lhepyF5eVLmWZbdF3fyStF2poPMBamsPBz048smjawToqNPWPWyncMqqnd02+/HroaascwZNwu8IAhAIQCEB5e4AEkwBck7BD1RbeEilZ9mntnQ21Nu3U/mP0W+EcHRWVp2Ecv3nv8AY1aGZVWNDWvIaNh4mVjKjTk8tFzS4hc0oKEJtJdD/9k=");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.edu-categorize {  
  font-family: system-ui, Segoe UI, Roboto, Arial, sans-serif;
  color: rgb(var(--edu-ink));
  display: grid;  
  gap: min(5vh, 40px);
  
  margin: 0;
  padding: 16px;
  background: rgb(var(--edu-bg) / 0.92);
}

.edu-categorize-header { display: grid; gap: 10px; color: rgb(var(--edu-ink));}
.edu-categorize-instruction {
  margin: 10px;
  font-size: clamp(.95rem, .8rem + .5vw, 1.1rem);
  font-weight: 700;
  letter-spacing: .2px;
}

.edu-categorize-palette {
  display: flex; flex-wrap: wrap; gap: 8px; 
  justify-content: space-between;
  border: 1px solid rgb(var(--edu-border));
  padding: 8px;   
  background: rgb(var(--edu-bg));  
  margin: 5%;
}

.edu-categorize-chip {
  display: inline-flex; 
  align-items: center; 
  gap: 8px;
  border: 1px solid rgb(var(--edu-border));  
  padding: 8px 12px;
  background: rgb(var(--edu-card)); 
  cursor: pointer; 
  user-select: none;
  font-size: .95rem; 
  font-weight: 600;
  color: rgb(var(--edu-ink));
  transition: transform .06s ease-in-out, box-shadow .1s ease-in-out;
}
/* .edu-categorize-chip:focus-visible { outline: 2px solid var(--cca-ring); outline-offset: 2px; } */

.edu-categorize-chip:hover { transform: translateY(-1px); background: rgb(var(--edu-first-accent) / 0.50)}
.edu-categorize-swatch {
  width: 28px; 
  height: 18px; 
  border-radius: 999px; 
  border: 1px solid rgb(var(--edu-border));
  background: rgb(var(--edu-bg)); flex: 0 0 18px;
}
.edu-categorize-chip[data-active="true"] { background: rgb(var(--edu-first-accentr)) }

.edu-categorize-current {
  display: flex; 
  justify-content: center;   
  font-size: 1.1rem; 
  margin: 10px;
  gap: 5px;
  color: rgb(var(--edu-ink));
}
.edu-categorize-current strong { color: rgb(var(--edu-ink)); }
.edu-categorize-current .edu-categorize-swatch { width: 22px; height: 22px; border-width: 1px; }

.edu-categorize-grid {
  display: grid; 
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.edu-categorize-item {
  display: inline-flex; 
  align-items: center; 
  justify-content: center;
  padding: 12px 14px;
  min-height: 46px;
  border: 1px solid rgb(var(--edu-border)); 
  cursor: pointer;
  background: rgb(var(--edu-card)); 
  transition: transform .05s ease-in-out, background .1s ease;
  font-weight: 700; 
  letter-spacing: .4px; 
  text-align: center;
  user-select: none; 
  color: rgb(var(--edu-ink));
}
.edu-categorize-item:hover { transform: translateY(-1px); background: var(--current-color); }
.edu-categorize-item:focus-visible { outline: 2px solid rgb(var(--edu-border)); outline-offset: 2px; }
.edu-categorize-item[data-result="ok"]    { outline: 2px solid rgb(var(--edu-success)); }
.edu-categorize-item[data-result="wrong"] { outline: 2px solid rgb(var(--edu-error)); }

.edu-categorize-footer { display: flex; gap: 8px; justify-content: center; }
.edu-categorize-btn {
  padding: 10px 14px;   
  border: none;
  background: rgb(var(--edu-card)); 
  color: rgb(var(--edu-ink)); 
  cursor: pointer; 
  font-weight: 700;  
}
.edu-categorize-btn:hover { background: rgb(var(--edu-first-accent) / 0.50) }
.edu-categorize-btn.secondary { background: transparent; color: rgb(var(--edu-ink)); border-color: rgb(var(--edu-border)); }
/* .edu-categorize-btn:focus-visible { outline: 2px solid var(--cca-ring); outline-offset: 2px; } */

.edu-categorize hr {
    width: 100%;
    border: 1px solid rgb(var(--edu-first-accent));
}
`;function cr(n,t,e){let{allowRetry:i=!0,resultHandler:o,ariaLabel:s="Color Categorizer Exercise",checkBtn:v=!1}=e,c=V("colors-categorize",s);W("colors-categorize-style",Pe);let r=(B,T=c)=>T.querySelector(B),A=["#ef4444","#22c55e","#3b82f6","#f59e0b","#8b5cf6","#ec4899","#a16207","#16a34a","#0ea5e9","#f97316","#f5f5dc","#9ca3af"],f=new Set(t.distractors||[]),L=new Map,x={},a=new Map,g="rgb(var(--edu-card))",u="None",l=0,b=0,h=0,w=[],H=Date.now(),E,M,z,q,S,P,k,C;function m(){c.innerHTML=De,E=r("#cca-instruction"),E.textContent=t.instruction,P=r("#cca-current-label"),P.textContent="None",S=r("#cca-current-swatch"),S.style.background="rgb(var(--edu-card))",q=r("#cca-none"),q.addEventListener("click",()=>d("rgb(var(--edu-card))","None",q)),z=r("#cca-grid"),M=r("#cca-palette"),k=r("#cca-check"),k.addEventListener("click",()=>I()),e.checkBtn||(k.style.display="none"),C=r("#cca-reset"),C.addEventListener("click",()=>O());for(let B of t.items){x[B.category]=[];for(let T of B.words)L.set(T,B.category)}t.items.forEach((B,T)=>{let y=A[T%A.length];a.set(B.category,y);let N=document.createElement("button");N.type="button",N.className="edu-categorize-chip",N.setAttribute("aria-pressed","false"),N.setAttribute("aria-label",`Paint: ${B.category}`),N.innerHTML=`
        <span class="edu-categorize-swatch" style="background:${y}"></span>
        <span>${B.category}</span>
        <span id="chip-counter-${B.category}">0</span>
      `,N.addEventListener("click",()=>d(y,B.category,N)),M.appendChild(N)}),R()}function d(B,T,y){M.querySelectorAll(".edu-categorize-chip").forEach(N=>{N.setAttribute("aria-pressed","false"),N.dataset.active="false"}),y.setAttribute("aria-pressed","true"),y.dataset.active="true",g=B,u=T,S.style.background=B||"rgb(var(--edu-card))",P.textContent=T||"None",document.documentElement.style.setProperty("--current-color",B,"important")}function p(B,T){if(u==="None")return;let y=c.querySelector(`#chip-counter-${u}`);if(x[u].includes(B)){let N=x[u].indexOf(B);N!==-1&&x[u].splice(N,1),T.style.background="rgb(var(--edu-card))",y.textContent=String(x[u].length);return}for(let[N,$]of Object.entries(x))if($.includes(B)){let _=x[N].indexOf(B);_!==-1&&x[N].splice(_,1);let G=c.querySelector(`#chip-counter-${N}`);G.textContent=String(x[N].length)}x[u].push(B),y.textContent=String(x[u].length)}function R(){let B=Q([...t.items.flatMap(T=>T.words),...t.distractors||[]]);z.innerHTML="";for(let T of B){let y=document.createElement("button");y.type="button",y.className="edu-categorize-item",y.textContent=T,y.dataset.color="",y.dataset.result="",y.addEventListener("click",()=>{y.style.background=g||"rgb(var(--edu-card));",p(T,y),y.dataset.color=g,y.dataset.result=""}),z.appendChild(y)}}function O(){z.querySelectorAll(".edu-categorize-item").forEach(B=>{B.style.background="rgb(var(--edu-card))",B.dataset.color="",B.dataset.result=""}),Object.keys(x).forEach(B=>{let T=c.querySelector(`#chip-counter-${B}`);T.textContent="0",x[B]=[]}),d("","None",q)}function I(){z.querySelectorAll(".edu-categorize-item").forEach(B=>{l++;let T=B.textContent||"",y=B.dataset.color||"",N=!1;if(f.has(T))N=y===""||y==="var(rgb(--edu-var))";else{let $=L.get(T),_=$?a.get($):"";N=y&&y===_}B.dataset.result=N?"ok":"wrong",N?b++:w.push(T)}),F()}function F(){let B=((Date.now()-H)/1e3).toFixed(1);h=b/l*100;let T={detail:{correct:b,total:l,score:h},timestamp:B,winningEl:U(h,b,l,B,w)};c.setAttribute("inert",""),o&&o(T)}return m(),n.appendChild(c),{destroy(){n.removeChild(c)},check:I}}function lr(n){return!0}var dr=`
# Categorize the countries with their continent

Asia = Thailand | Japan | Vietnam;
Europe = France | The Netherlands | Ukraine;
America = Colombia | Jamaica | Brazil;

@EXTRA = [Egypt | Madagascar];
`,lt={name:"Colors Categorize",description:"...",version:1,parserVersion:1,category:"input",tags:["Complete","...","Missing Information"],usage:["...","..."],wrong:["...","..."],grammarExample:[dr],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"Colors Categorize Exercise"},implementation:{renderer:cr,parser:le,validator:lr},styleTag:"colors-categorize-style",html:De,css:Pe};var Oe=`<div class="categorize-single" id="cats-app">
  <header class="categorize-single-head">
    <p class="categorize-single-instruction" id="cats-instruction">Instruction</p>
        
    <div class="categorize-single-qmeta">      
      <span id="cats-progress">0 / 0</span>
    </div>
  </header>

  <main class="categorize-single-main">
    
    <div class="categorize-single-qwrap" aria-live="polite">
      <p class="categorize-single-question" id="cats-question">Loading\u2026</p>
    </div>
    
    <div class="categorize-single-qnav">
      <button class="categorize-single-btn" id="cats-prev">Prev</button>
      <button class="categorize-single-btn" id="cats-next">Next</button>
    </div>

    <section class="categorize-single-grid" id="cats-grid" aria-label="Categories"></section>
  </main>    

  <footer id="ccs-footer" class="categorize-single-foot">
    <hr>
    <button class="categorize-single-btn" id="cats-check">Check</button>
  </footer>
</div>

<!-- Per-category modal -->
<dialog class="categorize-single-dialog" id="cats-dialog">
  <div class="categorize-single-dhead">
    <div class="categorize-single-dtitle" id="cats-dialog-title">Category</div>
    <button class="categorize-single-btn" id="cats-dialog-close">Close</button>
  </div>
  <div class="categorize-single-dbody" id="cats-dialog-body"></div>
</dialog>


`;var je=`.categorize-single-root {
  background-image: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReJJGdJqQVoB3WIpCK8rCwCUm88juBFtiQgQ&s");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

.categorize-single { 
  display:grid; 
  gap:20px; 

  padding: 16px; 
  background-color: rgb(var(--edu-bg) / 0.95);
  padding: 5%;
}

.categorize-single-head { display:grid; gap:8px; text-align:start; }
.categorize-single-instruction { margin:0; font-size:1.1rem; color:rgb(var(--edu-ink)); letter-spacing: 2px;}

.categorize-single-main { display:grid; gap:18px; min-height: 70vh}

.categorize-single-qwrap {
  border-top:1px solid rgb(var(--edu-border));
  border-bottom:1px solid rgb(var(--edu-border));
  padding: 18px;
  display:grid;
  gap:12px; 
  align-items:center; 
  justify-items:center;
}

.categorize-single-question {
  font-size:2.15rem; 
  line-height:1.6; 
  letter-spacing:.5px; 
  text-wrap:balance;
  text-align:center; margin:0;
}
.categorize-single-qmeta { display:flex; gap:12px; align-items:center; font-size:.9rem; color:rgb(var(--edu-ink)); }

.categorize-single-qnav { display:flex; gap:10px; justify-content:space-between; width: 100%; }

.categorize-single-btn {
  border:1px solid rgb(var(--edu-border));
  background: rgb(var(--edu-card));
  color: rgb(var(--edu-ink));
  padding: 5px 8px;
  width: 20%;
  border-radius: 10px;
  font-weight: 700; 
  letter-spacing:.3px;
  cursor: pointer;
  transition: transform .12s ease, background .15s ease, border-color .15s ease, opacity .15s ease;
}
.categorize-single-btn:hover { transform: translateY(-1px); background-color: rgb(var(--edu-card));}
.categorize-single-btn[disabled] { opacity:.6; pointer-events:none; }

.categorize-single-grid {
  display:grid; gap:14px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.categorize-single-card {
  margin: 10px;
  display:grid;
  grid-template-rows: auto 1fr auto;
  gap:10px; 
  align-content:start;
  background:linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0));
  padding: 12px;
  position:relative;
  outline:2px solid transparent;
  transition: transform .12s ease, outline-color .15s ease, background .15s ease, border-color .15s ease;
  cursor: pointer;
}
.categorize-single-card:hover { transform:translateY(-2px); }
.categorize-single-card.bad    { outline-color: color-mix(in srgb, rgb(var(--edu-wrong)) 60%, transparent); }
.categorize-single-card.good   { outline-color: color-mix(in srgb, rgb(var(--edu-success)) 60%, transparent); }
.categorize-single-card.neutral{ outline-color: color-mix(in srgb, rgb(var(--edu-muted)) 40%, transparent); }

hr {
  width: 80%;
}

.categorize-single-label {
  font-weight: 800; 
  letter-spacing: 3px; 
  text-transform: uppercase; 
  font-size:.9rem;
  padding:6px 8px;
  border:1px solid rgb(var(--edu-border));
  justify-self:start;
}
.categorize-single-count {
  font-size: 2.4rem; 
  font-weight: 900;
  display:flex; 
  align-items:center; 
  justify-content:center;
  border:1px dashed rgb(var(--edu-border));
  border-radius: 12px; 
  padding: 8px; 
  min-height:64px;
  background: color-mix(in srgb, rgb(var(--edu-card)) 85%, rgb(var(--edu-ink)) 6%);
}
.categorize-single-open {
  border:1px solid rgb(var(--edu-border));
  padding:8px 10px; border-radius:10px; font-weight:700; background:transparent; 
  color: rgb(var(--edu-ink));
  margin-top: auto;
}
.categorize-single-open:hover { background: color-mix(in srgb, rgb(var(--edu-card)) 80%, rgb(var(--edu-ink)) 6%); }

.categorize-single-foot {
  display:flex; gap:10px; justify-content:center; align-items:center;
  padding-top: 6px;
}

.categorize-single-check.good { color: rgb(var(--edu-success)); }
.categorize-single-check.bad  { color: rgb(var(--edu-error)); }

/* ==== Modal (per-category) ===== */
.categorize-single-dialog::backdrop { background: rgb(var(--edu-bg) / 0.80);}

.categorize-single-dialog {
  border:1px solid rgb(var(--edu-border));
  background: rgb(var(--edu-card)); color: rgb(var(--edu-ink));
  padding: 14px; width: min(720px, 96vw);
}

.categorize-single-dhead { display:flex; justify-content:space-between; align-items:center; gap:8px; padding-bottom:8px; border-bottom:1px dashed rgb(var(--edu-border)); }
.categorize-single-dtitle { font-weight:900; letter-spacing:.4px; }
.categorize-single-dbody { display:grid; gap:10px; padding-top:10px; max-height: 56vh; overflow:auto; }
.categorize-single-drow {
  border:1px solid rgb(var(--edu-border)); b
  order-radius: 12px; 
  padding: 10px;
  display:grid; grid-template-columns: 1fr auto; 
  gap:10px; 
  align-items:center;
  background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,0));
  margin: 10px;
}

.categorize-single-drow.good { outline:2px solid color-mix(in srgb, rgb(var(--edu-success)) 50%, transparent); }
.categorize-single-drow.bad  { outline:2px solid color-mix(in srgb, rgb(var(--edu-error)) 50%, transparent); }
.categorize-single-remove {
  border:1px solid rgb(var(--edu-border)); border-radius:10px; padding:8px 10px; background:transparent; color:rgb(var(--edu-ink)); font-weight:800;
}
.categorize-single-remove:hover { background: color-mix(in srgb, rgb(var(--edu-card)) 80%, rgb(var(--edu-ink)) 6%); }

@media (max-width: 520px) {
  .categorize-single-question { font-size:1.05rem; }
  .categorize-single-count { font-size:2rem; }
}
`;function gr(n,t,e){let{allowRetry:i=!0,resultHandler:o,ariaLabel:s="Single Categorize Exercise",checkBtn:v=!1}=e,c=V("categorize-single-root",s);W("colors-categorize-style",je);let r=(D,j=c)=>j.querySelector(D),A=(D,j=n)=>[...j.querySelectorAll(D)],f,L,x,a,g,u,l,b,h,w,H,E=new Map,M,z,q=0,S=new Set,P=!1,k=0,C=0,m=0,d=Date.now(),p=[],R=["#ef4444","#22c55e","#3b82f6","#f59e0b","#8b5cf6","#ec4899","#a16207","#16a34a","#0ea5e9","#f97316","#f5f5dc","#9ca3af"],O=[],I=()=>z[q]??null,F=()=>{q<z.length-1&&q++,y()},B=()=>{q>0&&q--,y()};function T(){if(c.innerHTML=Oe,f=r("#cats-instruction"),f.textContent=t.instruction||"Categorize every sentence into a category",L=r("#cats-question"),x=r("#cats-progress"),a=r("#cats-grid"),u=r("#cats-next"),g=r("#cats-prev"),l=r("#cats-check"),b=c.querySelector("#cats-dialog"),h=c.querySelector("#cats-dialog-title"),w=c.querySelector("#cats-dialog-body"),H=c.querySelector("#cats-dialog-close"),!e.checkBtn){let D=r("#ccs-footer");D.style.display="none"}t.items.forEach((D,j)=>{let K=R[j%R.length];E.set(D.category,K),D.words.forEach(J=>{O.push({text:J,trueCategory:D.category})})}),Array.isArray(t.distractors)&&t.distractors.forEach(D=>O.push({text:D,trueCategory:null})),M=t.items.map(D=>({name:D.category,color:E.get(D.category),items:[]})),z=Q(O.map((D,j)=>j)),u.addEventListener("click",F),g.addEventListener("click",B),l.addEventListener("click",_),N(),y()}function y(){let D=I(),j=z.length;if(x.textContent=`${Math.min(q+1,j)} / ${j}`,D==null){L.textContent="Done!",u.disabled=!0,g.disabled=q<=0;return}L.textContent=O[D].text,u.disabled=q>=z.length-1,g.disabled=q<=0}function N(){a.innerHTML="",M.forEach((D,j)=>{let K=document.createElement("article");K.className="categorize-single-card neutral",K.style.setProperty("border-color",D.color),K.style.setProperty("background",`linear-gradient(180deg, color-mix(in srgb, ${D.color} 8%, transparent), transparent)`);let J=document.createElement("span");J.className="categorize-single-label",J.style.setProperty("border-color",D.color),J.style.setProperty("background",`color-mix(in srgb, ${D.color} 25%, transparent)`),J.textContent=D.name;let Z=document.createElement("div");Z.className="categorize-single-count",Z.textContent=String(D.items.length);let X=document.createElement("button");X.className="categorize-single-open",X.type="button",X.textContent="See \u{1F441}",K.addEventListener("click",re=>{if(re.target===X)return;let ne=I();if(ne!==null){if(S.has(ne)){alert("Another category already has this item");return}D.items.push(ne),S.add(ne),Z.textContent=`${D.items.length} ${D.items.length===1?"item":"items"}`,q<z.length-1?F():y()}}),X.addEventListener("click",()=>{$(D)}),K.append(J,Z,X),a.append(K),D._els={card:K,count:Z,label:J}})}function $(D){h.textContent=D.name,D.items.length===0?w.innerHTML="<p>No items in this category</p>":w.innerHTML="",D.items.forEach((j,K)=>{let J=document.createElement("div");J.className="categorize-single-drow";let Z=document.createElement("p");if(Z.textContent=O[j].text,P){let re=O[j].trueCategory===D.name;J.classList.add(re?"good":"bad")}let X=document.createElement("button");X.className="categorize-single-remove",X.textContent="Remove",X.addEventListener("click",()=>{D.items.splice(K,1),S.delete(j),z.includes(j)||z.push(j),D._els.count.textContent=String(D.items.length),y(),J.remove()}),J.appendChild(Z),J.appendChild(X),w.appendChild(J)}),typeof b.showModal=="function"?b.showModal():b.setAttribute("open",""),H&&H.addEventListener("click",()=>b?.close?.())}function _(){P=!0;let D=100/M.length;M.forEach(j=>{let K=D/j.items.length,J=0,Z=0;j.items.forEach(X=>{C++;let re=O[X];re.trueCategory===j.name?(m++,J++,k+=K):(Z++,p.push(re.text))}),j._els.card.classList.remove("good","bad","neutral"),Z===0&&J>0?j._els.card.classList.add("good"):Z>0?j._els.card.classList.add("bad"):j._els.card.classList.add("neutral")}),G()}function G(){let D=((Date.now()-d)/1e3).toFixed(1),j={detail:{correct:m,total:C,score:k},timestamp:D,winningEl:U(k,m,C,D,p)};w.setAttribute("inert",""),o&&o(j)}return T(),n.appendChild(c),{destroy(){n.removeChild(c)},check:_}}function mr(n){return!0}var br=`
# Categorize the statements with their continents 

Asia = "Has the largest country in the world in it" | 
"It's where the most ancient religions come from";
      
Europe = "Continent where the roman empire had most of its territory" |
"You can find monuments like the eiffel tower in here" |
"People in this continent usually like more classical music";

America = "People in this continent usually like rythmic music like Salsa" |
"Has great beaches, specially in the caribbean |
"It's a continent that's usually divided in two or even 3 regions";          
`,dt={name:"Single Categorize",description:"...",version:1.2,parserVersion:1,category:"input",tags:["Complete","...","Missing Information"],usage:["...","..."],wrong:["...","..."],grammarExample:[br],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"Single Categorize Exercise"},implementation:{renderer:gr,parser:le,validator:mr},styleTag:"single-categorize-style",html:Oe,css:je};var Ie=`<div class="edu-mcq-wrap">
  <header>
    <h2 class="edu-mcq-title" id="mcq-title">
  </header>

  <!-- Dynamic <edu-mcq></edy-mcq> custom elements -->
  <main class="edu-mcq-container" id="mcq-container"></main>

  <footer>
    <button class="edu-mcq-check" id="mcq-check">Check</button>
  </footer>
</div>
`;var Fe=`/* ===== MCQ \u2014 Scoped styles ===== */
.edu-mcq-wrap {
  display:grid; gap:16px;
  background: rgb(var(--edu-bg));
  color: rgb(var(--edu-ink));
  border: 1px solid rgb(var(--edu-border));
  border-radius: var(--edu-radius);
  box-shadow: 0 10px 30px rgb(var(--edu-shadow-color) / .25);  
  padding: 16px;
}

/* Header */
.edu-mcq-wrap > header {
  display:flex; align-items:center; justify-content:space-between;
  padding: 8px 4px 12px;
  border-bottom: 1px dashed rgb(var(--edu-border));
}

.edu-mcq-wrap .edu-mcq-title {
  margin:0;
  font-weight:800;
  letter-spacing:.3px;
  color: rgb(var(--edu-ink));
}

/* Grid container for dynamic <edu-mcq> blocks */
.edu-mcq-wrap .edu-mcq-container {
  display:flex; 
  gap: 50px;
  flex-direction: column;
  justify-content: center;
  counter-reset: mcq;
  padding-block: 4px;
}

/* Card shell for each custom element (outer host only) */
.edu-mcq-wrap .edu-mcq-container edu-mcq {
  position: relative;
  display:block;
  background: rgb(var(--edu-card));
  color: rgb(var(--edu-ink));
  border: 1px solid rgb(var(--edu-border));
  border-radius: calc(var(--edu-radius) + 2px);
  padding: 14px;
  box-shadow: 0 4px 16px rgb(var(--edu-shadow-color) / .18);
  transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;  
  outline: none;
}

.edu-mcq-wrap .edu-mcq-container edu-mcq::before {
  counter-increment: mcq; 
  content: counter(mcq);
  position:absolute; 
  left:10px; top:15px; 
  translate: 0 -10px;
  width:28px; 
  height:28px; display:grid; place-items:center;
  font-weight:700; font-size:.9rem;
  color:white;
  background: rgb(var(--edu-first-accent) / 0.80);  
  border-radius: 10px;

}

.edu-mcq-wrap .edu-mcq-container edu-mcq:hover {
  transform: translateY(-1px);

  border-color: rgb(var(--edu-first-accent));
}

.edu-mcq-wrap .edu-mcq-container edu-mcq:focus-visible,
.edu-mcq-wrap .edu-mcq-container edu-mcq:focus-within{
  box-shadow: 0 0 0 3px rgb(var(--edu-first-accent) / .35),
              0 8px 22px rgb(var(--edu-shadow-color) / .22);
  border-color: rgb(var(--edu-first-accent));
}

/* Footer / Check button */
.edu-mcq-wrap > footer {
  display:flex; 
  justify-content:center;  
  width: 100%; 
  align-items:center; 
  gap:8px;
  padding-top: 8px;
  border-top: 1px dashed rgb(var(--edu-border));
}

.edu-mcq-wrap .edu-mcq-check{
  appearance:none; -webkit-appearance:none;
  border: 1px solid rgb(var(--edu-first-accent));
  background: linear-gradient(
    0deg,
    rgb(var(--edu-first-accent) / .18),
    rgb(var(--edu-first-accent) / .28)
  );
  color: rgb(var(--edu--ink));
  font-weight:700;
  padding: 10px 14px;    
  cursor:pointer;
  width: 40%;
  transition: transform .12s ease, filter .12s ease, box-shadow .15s ease;
}

.edu-mcq-wrap .edu-mcq-check:hover{
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.edu-mcq-wrap .edu-mcq-check:active{
  transform: translateY(0);
  box-shadow: 0 3px 12px rgb(var(--edu-shadow-color) / .18) inset;
}

.edu-mcq-wrap .edu-mcq-check:disabled{
  opacity:.6; cursor:not-allowed;
  filter: grayscale(.2);
}


`;function xr(n,t,e){let{allowRetry:i=!0,resultHandler:o,ariaLabel:s="",checkBtn:v=!0}=e,c=V("edu-mcq-root",s);W("edu-mcq-style",Fe);let r=(z,q=c)=>q.querySelector(z),A,f,L,x=Q(t.blocks),a=t.blocks.length,g=Date.now(),u=0,l=0,b=[],h=[];function w(){c.innerHTML=Ie,A=r("#mcq-title"),f=r("#mcq-container"),L=r("#mcq-check"),e.checkBtn||(L.style.display="none"),H(),L.addEventListener("click",E)}function H(){A.textContent=t.instruction??"No instructions",x.forEach((z,q)=>{let S=document.createElement("edu-mcq");S.id=`mcq-pos-${q}`,S.data={img:z.img??"",question:z.question??"",hint:z.hint??"",options:z.options??[],correctOptions:z.correctOptions??[]},h.push(S.id),f.append(S)})}function E(){h.forEach(z=>{let q=c.querySelector(`#${z}`);if(!q)return;let S=q.showFeedback(),P=S.correct/S.total;l+=P,P===1&&u++,S.wrong.forEach(k=>{b.push(k)})}),c.setAttribute("inert",""),M()}function M(){let z=((Date.now()-g)/1e3).toFixed(1);l=l/a*100;let q={detail:{correct:u,total:a,score:l},timestamp:z,winningEl:U(l,u,a,z,b)};o&&o(q)}return w(),n.appendChild(c),{destroy(){n.removeChild(c)},check:E}}function vr(n){let{title:t,rest:e}=oe(n),i=se(e),o=[],s;for(let v of i){if(!v)continue;let{label:c,cleaned:r}=ie(v),{img:A,cleaned:f}=Ve(r);if(A&&!/[=?]/.test(f)){s=A;continue}let L=f.trim(),x=L.indexOf("=");if(x===-1)continue;let a=L.slice(0,x).trim().replace(/\s+/g," "),g=L.slice(x+1).trim(),u=[...g.matchAll(/\[([^\]]+)\]/g)],l=me(u.flatMap(H=>ge(H[1]))),b=g.replace(/\[|\]/g,""),h=me(ge(b)),w=Q(h);o.push({img:A??s,question:a,hint:c,options:w,correctOptions:l}),s=void 0}return{ok:!0,content:{instruction:t,blocks:o}}}function kr(n){return!0}var yr=`
@TITLE = Complete the coding questions; 

# Think: compilers or interpreters exist for them
Which of this are programming languages? = 
CSS | HTML | QML | [Typescript | Python];

<https://pixabay.com/get/gae95e5da62e6f8b77c076bf3df6264f18998a4338d56f97841208742e7cce419ab2ec250cd10471cd25d0a456e9f45ae3b5e7f4863781e1eeceed900de233af6_640.png>
What language of the following is best for micro-controllers? =
C# | Java | Lua | [C | C++]; 

# Well... The place you are on!
What is Javascript best for? = 
OS development | Desktop Linux Applications | [Web Development];

<https://pixabay.com/get/g85c11ca9c972371d19aa5dd5afe4165b11b16deef90b0cd002717873a5ecd9428e628dca988789b32b9aee9777c0166e_640.png>
What is one markup language in the options? = 
[XAML] | CSS | Rust | React;  
`,pt={name:"Multiple Choice",description:"...",version:1,parserVersion:1,category:"",tags:["","",""],usage:["...","..."],wrong:["...","..."],grammarExample:[yr],defaultOptions:{shuffle:!0,allowRetry:!1,ariaLabel:"MCQ Exercise"},implementation:{renderer:xr,parser:vr,validator:kr},styleTag:"edu-mcq-style",html:Ie,css:Fe};var ut=`<style>

.letter-picker-wrapper { position: relative; }

.letter-picker-wrapper .display {
  cursor: pointer; 
  padding: 16px 20px; 
  color: rgb(var(--edu-first-accent)); 
  outline: none;
  user-select: none; 
  font-size: 1.5rem;
}

.letter-picker-wrapper .display.placeholder { opacity: .6; }

:host([mode="simple"]) .display { border-bottom: 2px solid rgb(var(--edu-border)); }
:host([mode="simple"]:focus-within) .display { border-bottom-color: rgb(var(--edu-first-accent)); }

:host([mode="box"]) .letter-picker-wrapper .display {
  border: 2px solid rgb(var(--edu-border)); border-radius: 8px; min-width: 60px;
  text-align: center; 
  background: rgb(var(--edu-bg)); 
  box-shadow: 0 2px 6px rgb(var(--edu-muted));
}

:host([mode="box"]:focus-within) .display { 
  border-color: rgb(var(--edu-first-accent)); 
}

.letter-picker-wrapper .picker {
  position: absolute; 
  top: calc(100% + 6px); 
  left: 0; 
  display: none;
  grid-template-columns: repeat(7, 1fr); 
  gap: 4px; 
  padding: 8px;
  background: rgb(var(--edu-bg)); 
  border: 1px solid rgb(var(--edu-border)); 
  border-radius: 8px;
  box-shadow: 0 6px 14px rgb(var(--edu-muted));
  z-index: 1000;
}

.letter-picker-wrapper .picker button {
  border: none;   
  background: rgb(var(--edu-card)); 
  color: rgb(var(--edu-ink));
  padding: 6px; 
  border-radius: 4px;
  cursor: pointer; 
  font-weight: 700;
}

.letter-picker-wrapper .picker button:hover, .letter-picker-wrapper .picker button:focus {   
  background: rgb(var(--edu-first-accent)); 
  color: rgb(var(--edu-ink)); 
  outline: none; 
}
</style>

<div class="letter-picker-wrapper" id="wrap">
  <div class="display" id="display" part="display" role="button" aria-haspopup="listbox" aria-expanded="false" tabIndex="0"></div>
  <div class="picker" id="picker" part="picker" role="listbox">
</div>

`;var de=class extends HTMLElement{constructor(){super();this._open=!1;this._onDocClick=e=>{(e.composedPath&&e.composedPath()||[]).includes(this)||this.close()};this._onDocKey=e=>{if(this._open){if(e.key==="Escape"){e.stopPropagation(),this.close(),this._display.focus?.();return}if(/^[a-z]$/i.test(e.key)){let i=e.key.toUpperCase();this._picker.querySelector(`button[data-letter="${i}"]`)&&(this.value=i,this.close(),this.dispatchEvent(new Event("change",{bubbles:!0})))}}};let e=this.attachShadow({mode:"open"});e.innerHTML=ut,this._display=e.getElementById("display"),this._picker=e.getElementById("picker");for(let i=65;i<=90;i++){let o=String.fromCharCode(i),s=document.createElement("button");s.type="button",s.textContent=o,s.dataset.letter=o,s.setAttribute("role","option"),s.addEventListener("click",()=>{this.value=o,this.close(),this.dispatchEvent(new Event("change",{bubbles:!0}))}),this._picker.appendChild(s)}this._display.addEventListener("click",()=>this.toggle()),this._syncDisplay()}static get observedAttributes(){return["value","mode","placeholder","disabled"]}get placeholder(){return this.getAttribute("placeholder")}set placeholder(e){e==null?this.removeAttribute("placeholder"):this.setAttribute("placeholder",e)}get mode(){return this.getAttribute("mode")??"simple"}set mode(e){this.setAttribute("mode",e??"simple")}get value(){return(this.getAttribute("value")||"").toUpperCase()}set value(e){let i=(e||"").toUpperCase().replace(/[^A-Z]/g,"");this.setAttribute("value",i)}get disabled(){return this.hasAttribute("disabled")}set disabled(e){e?this.setAttribute("disabled",""):this.removeAttribute("disabled"),this._display.setAttribute("aria-disabled",e?"true":"false")}connectedCallback(){this._upgradeProperty("placeholder"),this._upgradeProperty("mode"),this._upgradeProperty("value"),this._upgradeProperty("disabled"),this.hasAttribute("mode")||(this.mode="simple"),this._syncDisplay(),this.addEventListener("keydown",e=>{(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),this.toggle())})}disconnectedCallback(){this.close()}attributeChangedCallback(e){(e==="value"||e==="placeholder")&&this._syncDisplay(),e==="disabled"&&this.disabled&&this.close()}open(){this._open||this.disabled||(this._picker.style.display="grid",this._display.setAttribute("aria-expanded","true"),document.addEventListener("click",this._onDocClick,!0),document.addEventListener("keydown",this._onDocKey),this._open=!0)}close(){this._open&&(this._picker.style.display="none",this._display.setAttribute("aria-expanded","false"),document.removeEventListener("click",this._onDocClick,!0),document.removeEventListener("keydown",this._onDocKey),this._open=!1)}toggle(){this._open?this.close():this.open()}_syncDisplay(){let e=this.value,i=this.placeholder||"Pick a letter";this._display.textContent=e||i,this._display.classList.toggle("placeholder",!e)}_upgradeProperty(e){if(Object.prototype.hasOwnProperty.call(this,e)){let i=this[e];delete this[e],this[e]=i}}};customElements.get("letter-picker")||customElements.define("letter-picker",de);var gt=`<style>
  :host {
    --_radius: var(--edu-radius, .5rem);
    --_shadow: 0 4px 14px rgb(var(--edu-shadow-color) / 0.15);
    --_shadow-hover: 0 8px 24px rgb(var(--edu-shadow-color) / 0.25);

    display: block;
    color: rgb(var(--edu-ink));
    font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    background: rgb(var(--edu-bg));
  }
  
  .mcq {
    background: linear-gradient(145deg, rgb(var(--edu-card)), rgb(var(--edu-first-accent) / 0.20));
    border: 1px solid rgb(var(--edu-border, 51 65 85));
    border-radius: var(--_radius);
    box-shadow: var(--_shadow);
    overflow: hidden;
    transition: box-shadow .2s ease;
  }
  .mcq:hover {
    box-shadow: var(--_shadow-hover);
  }
  
  header {
    display: grid;
    gap: 16px;
    padding: 20px;    
    grid-template-columns: 1fr;
    align-items: center;
    background: rgb(var(--edu-muted, 30 41 59) / 0.2);
    border-bottom: 1px solid rgb(var(--edu-border, 51 65 85));
  }

  .media {
    position: relative;
    width: 100%;    
    max-height: 320px;
    border-radius: calc(var(--_radius) - 2px);
    background: rgb(var(--edu-bg) / 0.80);
    overflow: hidden;
    border: 1px solid rgb(var(--edu-border) / 0.5);
  }
  .media img, .media video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  
  .prompt-row {
    display: grid;
    gap: 10px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
  }

  h2 {
    margin: 0;
    font-size: 1.25rem; 
    line-height: 1.4;
    font-weight: 600;
    color: rgb(var(--edu-ink));
  }

  .hint-btn {
    border: 1px solid rgb(var(--edu-border));
    border-radius: 999px;
    padding: 6px 14px;
    font-size: .875rem;
    cursor: pointer;
    color: rgb(var(--edu-ink));
    background: rgb(var(--edu-muted) / 0.6);
    transition: all .2s ease;
    flex-shrink: 0; 
  }
  .hint-btn:hover {
    box-shadow: var(--_shadow-hover);
    transform: translateY(-2px);
    border-color: rgb(var(--edu-border) / 0.5);
    background: rgb(var(--edu-muted));
  }

  .hint {
    display: none;
    margin-top: 6px;
    font-size: .95rem;
    color: rgb(var(--edu-ink));
    background: rgb(var(--edu-bg) / 0.4);
    padding: 12px;
    border-radius: calc(var(--_radius) - 4px);
    border-left: 3px solid rgb(var(--edu-first-accent));
  }
  :host([hint-open]) .hint, .hint[open] {
    display: block;
  }
  
  main {
    padding: 20px;
  }

  #options {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .option {
    display: grid;
    grid-template-columns: 32px 1fr;
    gap: 12px;
    align-items: center;
    background: rgb(var(--edu-muted) / 0.5);
    border: 1px solid rgb(var(--edu-border));
    border-radius: var(--_radius);
    padding: 12px;
    cursor: pointer;
    user-select: none;
    transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background-color .2s ease;
    outline: none;
  }

  .option:hover {
    box-shadow: var(--_shadow-hover);
    transform: translateY(-2px);
    border-color: rgb(var(--edu-first-accent));
  }
  .option:focus-visible {
    outline: 2px solid rgb(var(--edu-first-accent));
    outline-offset: 2px;
  }

  .badge {
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    font-weight: 700;
    font-size: .9rem;
    color: rgb(var(--edu-inverted-ink));
    background: rgb(var(--edu-first-accent));
    border: 1px solid rgb(var(--edu-border));
  }

  .text {
    margin: 0;
    color: rgb(var(--edu-ink));
  }

  .option[data-state="selected"] {
    background: rgb(var(--edu-first-accent) / 0.12);
    border-color: rgb(var(--edu-first-accent));
  }
  .option[data-state="correct"] {
    background: rgb(var(--edu-success) / 0.14);
    border-color: rgb(var(--edu-success));
  }
  .option[data-state="wrong"] {
    background: rgb(var(--edu-error) / 0.16);
    border-color: rgb(var(--edu-error));
  }
  .option[data-state="warning"] {
    background: rgb(var(--edu-warning) / 0.16);
    border-color: rgb(var(--edu-warning));
  }
  
  footer {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid rgb(var(--edu-border));
  }
  .btn {
    border: 1px solid rgb(var(--edu-border));
    border-radius: 8px;
    background: rgb(var(--edu-muted) / 0.6);
    color: rgb(var(--edu-ink));
    padding: 10px 16px;
    cursor: pointer;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all .2s ease;
  }
  .btn:hover {
    box-shadow: var(--_shadow-hover);
    transform: translateY(-2px);
    border-color: rgb(var(--edu-border) / 0.7);
  }
  
  /* Primary button style for "Check" */
  #checkBtn {
    background: rgb(var(--edu-first-accent));
    color: #fff;
    border-color: rgb(var(--edu-first-accent));
  }
  #checkBtn:hover {
     background: rgb(110 121 235); /* A slightly darker accent for hover */
  }
  
  :host([no-media]) header {
    grid-template-columns: 1fr;
  }
  :host([no-media]) .media {
    display: none;
  }
</style>

<section class="mcq" part="container">
  <header>
    <div class="media"><img id="media" alt=""></div>
    <div class="prompt-row">
      <div class="title">
        <h2 id="prompt"></h2>
        <button class="hint-btn" id="hintToggle" type="button" aria-expanded="false">Hint</button>
      </div>
      <div class="hint" id="hint"></div>
    </div>
  </header>

  <main>
    <div id="options" role="group" aria-label="Options"></div>
    <footer style="display:none">
      <button class="btn" id="clearBtn" type="button">Clear</button>
      <button class="btn" id="checkBtn" type="button">Check</button>
    </footer>
  </main>
</section>
`;var mt=document.createElement("template");mt.innerHTML=gt;var Ar="ABCDEFGHIJKLMNOPQRSTUVWXYZ",pe=class extends HTMLElement{constructor(){super();this._data={img:"",question:"",hint:"",options:[],correctOptions:[]};this._selected=new Set;this._isChecked=!1;this.toggleHint=()=>{let e=!this.hasAttribute("hint-open");this.toggleAttribute("hint-open",e),this._$hintBtn.setAttribute("aria-expanded",String(e))};this.attachShadow({mode:"open"}).appendChild(mt.content.cloneNode(!0));let e=(i,o=this.shadowRoot)=>o.querySelector(i);this._$prompt=e("#prompt"),this._$hint=e("#hint"),this._$media=e("#media"),this._$opts=e("#options"),this._$hintBtn=e("#hintToggle"),this._$hintBtn.addEventListener("click",this.toggleHint)}static get observedAttributes(){return["hint-open"]}set data(e){let i=Array.from(new Set([...e?.options??[],...e?.correctOptions??[]]));this._data={img:e?.img??"",hint:e?.hint??"",question:e?.question??"",options:i,correctOptions:Array.isArray(e?.correctOptions)?e.correctOptions:[]},this.render()}render(){this._$prompt.textContent=this._data.question||"No question",this._$hint.textContent=this._data.hint||"No hints bro :(";let e=this._data.img;e?(this._$media.src=e,this.removeAttribute("no-media")):this.setAttribute("no-media",""),this._$opts.innerHTML="",this._selected.clear(),this._data.options.forEach((i,o)=>{let s=document.createElement("button");s.type="button",s.className="option",s.setAttribute("role","checkbox"),s.setAttribute("aria-checked","false"),s.dataset.value=i,s.innerHTML=`
        <span class="badge">${Ar[o]??""}</span>
        <p class="text">${i}</p>
      `,s.addEventListener("click",()=>{let v=s.dataset.value;this._selected.has(v)?this._selected.delete(v):this._selected.add(v),this.syncSelectedUI()}),this._$opts.appendChild(s)})}clear(){}showFeedback(){let e=[],i=[],o=0,s=this._data.correctOptions.length;if(this._isChecked)return;let v=new Set(this._data.correctOptions);return[...this._$opts.children].forEach(c=>{let r=c.dataset.value,A=this._selected.has(r);if(!A&&this._data.correctOptions.includes(r)){c.dataset.state="warning",i.push(r);return}!this._data.correctOptions.includes(r)&&A&&e.push(r);let f=v.has(r);c.dataset.state=A?f?"correct":"wrong":"",f&&o++,c.dataset.state||c.removeAttribute("data-state")}),this.setAttribute("inert",""),this._isChecked=!0,{total:s,correct:o,wrong:e,missed:i}}syncSelectedUI(){[...this._$opts.children].forEach(e=>{let i=e.dataset.value,o=this._selected.has(i);e.setAttribute("aria-checked",String(o)),e.dataset.state=o?"selected":"",o||e.removeAttribute("data-state")})}attributeChangedCallback(e){e==="hint-open"&&this._$hintBtn?.setAttribute("aria-expanded",String(this.hasAttribute("hint-open")))}};customElements.get("edu-mcq")||customElements.define("edu-mcq",pe);var bt=` <style>
  :host { 
    /* Custom Props here, when you are not lazy enough to add them */
    font-family: system-ui, sans-serif; 
  }
  
  .wrap { position: relative; display: inline-block; }
  
  button.swatch {
    width: 38px; 
    height: 32px; 
    border-radius: 8px; 
    border: 1px solid #ccc;
    box-shadow: 0 1px 2px rgba(0,0,0,.08); 
    cursor: pointer;
  }
  
  .tooltip {
    position: absolute; 
    z-index: 1000; 
    top: 110%; 
    left: 0;
    min-width: 220px; 
    background: #fff; 
    border: 1px solid #e5e7eb;
    border-radius: 10px; 
    box-shadow: 0 12px 30px rgba(0,0,0,.12);
    padding: 10px; display: none;
  }
  
  .tooltip.open { display: block; }
  
  header { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    gap: 8px; 
  }
  
  header .name { font-size: 0.9rem; font-weight: 600; }
  
  .grid {
    display: grid; 
    grid-template-columns: repeat(6, 1fr); 
    gap: 8px; 
    padding: 10px 0;
  }
  .opt {
    width: 28px; 
    height: 28px; 
    border-radius: 6px; 
    border: 1px solid #d1d5db;
    cursor: pointer;
  }
  .opt[aria-selected="true"] { outline: 2px solid #111827; outline-offset: 1px; }
  
  footer { display: flex; gap: 6px; flex-wrap: wrap; }
  footer .tab {
    padding: 6px 10px; 
    border-radius: 999px; 
    border: 1px solid #e5e7eb; 
    background: #f9fafb;
    cursor: pointer; 
    font-size: .85rem;
  }
  footer .tab.active { 
    background: #111827; 
    color: white; 
    border-color: #111827; 
  } 
</style>
    
<div class="wrap">
  <button class="swatch" title="Open color picker"></button>
  <div class="tooltip" role="dialog" aria-label="Choose a color">
    <header>
      <div class="name"></div>
      <div class="chip" style="width:18px;height:18px;border-radius:4px;border:1px solid #d1d5db;"></div>
    </header>
    <div class="grid"></div>
    <footer class="tabs"></footer>
  </div>
</div>
`;var ue=class extends HTMLElement{constructor(){super();this._palettes={light:[{name:"Red",hex:"#ef4444"},{name:"Orange",hex:"#f97316"},{name:"Yellow",hex:"#f59e0b"},{name:"Beige",hex:"#f5f5dc"},{name:"Green",hex:"#22c55e"},{name:"Blue",hex:"#3b82f6"},{name:"Purple",hex:"#8b5cf6"},{name:"Pink",hex:"#ec4899"},{name:"Brown",hex:"#a16207"},{name:"Gray",hex:"#9ca3af"},{name:"Black",hex:"#000000"},{name:"White",hex:"#ffffff"}],dark:[{name:"Dark Red",hex:"#991b1b"},{name:"Dark Orange",hex:"#9a3412"},{name:"Gold",hex:"#b45309"},{name:"Khaki",hex:"#bdb76b"},{name:"Dark Green",hex:"#166534"},{name:"Dark Blue",hex:"#1e3a8a"},{name:"Indigo",hex:"#4338ca"},{name:"Magenta",hex:"#9d174d"},{name:"Dark Brown",hex:"#78350f"},{name:"Dark Gray",hex:"#4b5563"},{name:"Near Black",hex:"#111827"},{name:"Ivory",hex:"#fffff0"}]};this._activePaletteKey=Object.keys(this._palettes)[0];this._value=this._palettes[this._activePaletteKey][0];this.attachShadow({mode:"open"});let e=document.createElement("div");e.innerHTML=bt,this.shadowRoot.append(e),this.$wrap=this.shadowRoot.querySelector(".wrap"),this.$swatch=this.shadowRoot.querySelector(".swatch"),this.$tooltip=this.shadowRoot.querySelector(".tooltip"),this.$name=this.shadowRoot.querySelector(".name"),this.$chip=this.shadowRoot.querySelector(".chip"),this.$grid=this.shadowRoot.querySelector(".grid"),this.$tabs=this.shadowRoot.querySelector(".tabs"),this.$swatch.addEventListener("click",()=>this.toggle()),document.addEventListener("click",i=>{let o=i.target;o&&!this.contains(o)&&!this.shadowRoot?.contains(o)&&this.close()})}static get observedAttributes(){return["value"]}get palettes(){return this._palettes}set palettes(e){e&&typeof e=="object"&&Object.keys(e).length&&(this._palettes=e,this._activePaletteKey=Object.keys(e)[0],this._value=e[this._activePaletteKey][0],this.render())}get activePaletteKey(){return this._activePaletteKey}set activePaletteKey(e){e in this._palettes&&(this._activePaletteKey=e)}get value(){return this._value}set value(e){e&&e.hex&&(this._value=e,this.updateHeader(),this.updateSwatch(),this.markSelected(),this.dispatch())}attributeChangedCallback(e,i,o){if(e==="value"&&o)try{let s=JSON.parse(o);s&&s.hex&&(this.value=s)}catch{}}connectedCallback(){this.render()}render(){this.renderTabs(),this.renderGrid(),this.updateHeader(),this.updateSwatch(),this.markSelected()}renderTabs(){this.$tabs.innerHTML="",Object.keys(this._palettes).forEach(e=>{let i=document.createElement("button");i.className="tab"+(e===this._activePaletteKey?" active":""),i.textContent=e,i.addEventListener("click",()=>{this.activePaletteKey=e,this.renderGrid(),this.updateHeader(),this.markSelected(),this.$tabs.querySelectorAll(".tab").forEach(o=>o.classList.remove("active")),i.classList.add("active")}),this.$tabs.appendChild(i)})}renderGrid(){this.$grid.innerHTML="",(this._palettes[this._activePaletteKey]||[]).forEach(i=>{let o=document.createElement("button");o.className="opt",o.style.background=i.hex,o.title=`${i.name} (${i.hex})`,o.setAttribute("role","button"),o.addEventListener("click",()=>{this.value=i}),this.$grid.appendChild(o)})}updateHeader(){let e=this._value||{name:"",hex:"#ffffff"};this.$name.textContent=e.name,this.$chip.style.background=e.hex}updateSwatch(){let e=this._value||{hex:"#ffffff"};this.$swatch.style.background=e.hex}markSelected(){let e=this._value;this.$grid.querySelectorAll(".opt").forEach(i=>{i.setAttribute("aria-selected",i.style.background.replace(/\s/g,"").toLowerCase()===(e?.hex||"").toLowerCase()?"true":"false")})}toggle(){this.$tooltip.classList.toggle("open")}close(){this.$tooltip.classList.remove("open")}dispatch(){this.dispatchEvent(new CustomEvent("colorchange",{bubbles:!0,detail:{name:this._value.name,hex:this._value.hex,palette:this._activePaletteKey}}))}};customElements.get("color-picker")||customElements.define("color-picker",ue);export{ct as BlanksMultipleContract,it as BlanksReadingContract,ot as BlanksSingleContract,dt as CategorizeSingleContract,lt as ColorCategorizeContract,ue as ColorPicker,rt as ConceptsDefinitionContract,pe as EduMCQ,de as LetterPicker,pt as MCQContract,at as ManualContract,Je as MatchingContract,et as MatchingSingleContract,Ke as MatchingWheelsContract,Ye as TrueFalseContract,$e as playSound,Rr as preloadSounds,Br as unlockAudio};
//# sourceMappingURL=index.js.map
