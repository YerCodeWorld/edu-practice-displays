function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-").map(Number);

    const months = [
        "january","february","march","april","may","june",
        "july","august","september","october","november","december"
    ];

    // Ordinal suffix
    const suffix =
    day % 10 === 1 && day !== 11 ? "st" :
    day % 10 === 2 && day !== 12 ? "nd" :
    day % 10 === 3 && day !== 13 ? "rd" : "th";

    return `${day}${suffix} ${months[month - 1]}, ${year}`;
}


export class EduGlobalInput extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this._data = {
            prompt: "Example Prompt",
            answer: "Yes",
            hint: "No hints bro :(",
            answerHint: "%",
            inputType: "text", // default
            selectOptions: []  // for select input
        };

        this.shadowRoot.innerHTML = `
        <style>
        :host {
            --bg:#f8fafc;
            --surface:#ffffff;
            --surface-2:#f1f5f9;
            --text:#0f172a;
            --muted:#64748b;
            --muted-transparent:#64748b10;
            --primary:#2563eb;
            --border:#e2e8f0;
            --radius:16px;
            --shadow:0 10px 30px rgba(2,6,23,.08);
        }
        .m-sin {
            display:block;
            background: repeating-linear-gradient(
                90deg,
                var(--muted-transparent),
            var(--muted-transparent) 15px,
            var(--bg) 15px,
            var(--bg) 30px
            );
            border:6px solid var(--border);
            border-radius: calc(var(--radius) - 4px);
            padding: clamp(16px, 3.2vw, 24px);
            min-height: 230px;
            box-sizing: border-box;
        }
        .m-sin__helpers {
            display:flex;
            gap:12px;
            padding-right:8px;
        }
        .m-sin__helpers label {
            flex:1;
            min-width: 50px;
            background:var(--bg);
            border-left:5px solid var(--primary);
            padding:8px;
            max-height:0;
            opacity:0;
            overflow:hidden;
            transition: max-height .7s ease, opacity .2s ease;
        }
        .m-sin__helpers label.is-open { max-height:200px; opacity:1; }
        .m-sin__helpers button {
            margin-left:auto;
            border:1px solid var(--border);
            background: var(--primary);
            border-radius:10px;
            padding:8px 10px;
            cursor:pointer;
        }
        .m-sin__helpers button:hover {
            transform: translateY(-1px);
            background: rgba(99,102,241,.08);
            animation: float 0.5s ease;
        }
    }
    .m-sin__input-container {
        display: flex;
        flex-direction: column;
        background: var(--bg);
        border-left: 5px solid var(--primary);
        border-right: 5px solid var(--primary);
        padding: 5%;
    }
    .m-sin__input-container label {
        min-width: 50px;
        background:var(--bg);
        border-left:5px solid var(--primary);
        padding:8px;
        max-height:0;
    }

    h2 { color: var(--text); }
    .m-sin__input {
        margin-top: 8%;
        width:100%;
        padding:12px 14px;
        font-size:16px;
        border:1px solid var(--border);
        border-radius:12px;
        box-sizing: border-box;
    }

    .animate-float { animation: float 3s ease-in-out; }
    @keyframes float { 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-8px);} }
    </style>
    <section class="m-sin" aria-label="Matching Single">
    <div class="m-sin__helpers">
        <label id="hint"></label>
        <button aria-label="Hint" id="idea" aria-expanded="false">💡</button>
    </div>
    <div class="m-sin__input-container" id="input-container">
        <h2 id="prompt"></h2>
        <label id="answerLabel">...</label>
    </div>
    </section>
         `;
}

// ------------------ DATA ------------------
set data(obj) {
    this._data = {
        prompt: obj.prompt ?? this._data.prompt,
        answer: obj.answer ?? this._data.answer,
        hint: obj.hint ?? this._data.hint,
        inputType: obj.inputType ?? this._data.inputType,
        selectOptions: obj.selectOptions ?? this._data.selectOptions,
        answerHint: obj.answerHint ?? ""
    };
    this._render(true);
}
get data() { return this._data; }

// ------------------ THEME ------------------
set theme(themeObj) {
    if (!themeObj) return;
    Object.entries(themeObj.cssVariables).forEach(([key, val]) => {
        this.style.setProperty(key, val);
    });
}

// ------------------ ANSWER ------------------
get answer() {
    const el = this._els.answer;
    if (!el) return { answer: "", isCorrect: false };

    let value;
    switch(this._data.inputType) {
        case "switch": value = el.checked; break;
        case "select": value = el.value; break;
        default: value = el.value.trim();
    }

    return {
        answer: value,
        isCorrect: value.toString().toLowerCase() === this._data.answer.toString().toLowerCase()
    };
}

// ------------------ LIFECYCLE ------------------
connectedCallback() {
    this._els = {
        card: this.shadowRoot.querySelector(".m-sin"),
        hint: this.shadowRoot.querySelector("#hint"),
        idea: this.shadowRoot.querySelector("#idea"),
        prompt: this.shadowRoot.querySelector("#prompt"),
        label: this.shadowRoot.querySelector("#answerLabel"),
        container: this.shadowRoot.querySelector("#input-container"),
        answer: null
    };

    this._render(true);

    this._els.idea.addEventListener("click", () => {
        this._els.hint.classList.toggle("is-open");
        this._els.idea.setAttribute(
            "aria-expanded",
            this._els.hint.classList.contains("is-open")
        );
    });

    this._interval = setInterval(() => {
        if (this._els.answer) {
            this._els.answer.classList.remove("animate-float");
            void this._els.answer.offsetWidth;
            this._els.answer.classList.add("animate-float");
        }
    }, 5000);
}

disconnectedCallback() {
    clearInterval(this._interval);
}

// ------------------ RENDER ------------------
_render(focusInput = false) {
    if (!this._els) return;
    this._els.prompt.textContent = this._data.prompt;
    this._els.hint.textContent = this._data.hint;
    this._renderInput();
    if (focusInput && this._els.answer) this._els.answer.focus();
}

_renderInput() {
    const container = this._els.container;
    if (!container) return;

    if (this._els.answer) this._els.answer.remove();

    let input;
    switch(this._data.inputType) {
        case "number":
            input = document.createElement("input");
            input.type = "number";
            break;
        case "slider":
            input = document.createElement("input");
            input.type = "range";
            input.min = "0";
            input.max = "100";
            break;
        case "date":
            input = document.createElement("input");
            input.type = "date";
            break;
        case "select":
            input = document.createElement("select");
            (this._data.selectOptions || ["Option 1", "Option 2"]).forEach(optText => {
                const opt = document.createElement("option");
                opt.value = optText;
                opt.textContent = optText;
                input.appendChild(opt);
            });
            break;
        case "switch":
            input = document.createElement("input");
            input.type = "checkbox";

            break;
        default:
            input = document.createElement("input");
            input.type = "text";
    }

    input.id = "answer";
    input.classList.add("m-sin__input");

    input.addEventListener("input", () => {
        if (this._data.inputType === "switch") {
            this._els.label.textContent = input.checked ? "On" : "Off";
        } else if (this._data.inputType === "date") {
            this._els.label.textContent = `${formatDate(input.value)}`;
        } else {

            this._els.label.textContent = `${input.value} ${this._data.answerHint}`;
            if (input.value === "") this._els.label.textContent = "...";
        }
    });

    container.appendChild(input);
    this._els.answer = input;
}
}


