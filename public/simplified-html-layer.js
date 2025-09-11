var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var grammar = {
    tx: parseTX
};
function parseBlanks(code) {
    var _a;
    var errors = [];
    var i = 0;
    var textBuf = "";
    while (i < code.length) {
        var ch = code[i];
        if (ch === "@" && code[i + 1] === "@") {
            textBuf += "@";
            i += 2;
            continue;
        }
        if (ch !== "@") {
            textBuf += ch;
            i++;
            continue;
        }
        // ...
        var currentPos = i;
        i++; // skips current '@'
        var fn = '';
        while (i < code.length && /[a-z]/i.test(code[i])) {
            fn += code[i++];
        }
        if (!fn) {
            errors.push({ pos: currentPos, msg: "Expected a function id after '@' (e.g., @tx, @nm, @sl)." });
            textBuf += '@'; // turn it back 
            continue;
        }
        if (code[i] !== '(') {
            errors.push({ pos: currentPos, msg: "Expected '(' after @".concat(fn, ".") });
            textBuf += "@".concat(fn); // turn it back 
            continue;
        }
        i++; // skip current '('
        // reading until closing bracket ')'
        var startContent = i;
        var content = "";
        var closed_1 = false;
        while (i < code.length) {
            if (code[i] === ')') {
                closed_1 = true;
                i++;
                break;
            }
            content += code[i++];
        }
        if (!closed_1) {
            errors.push({ pos: currentPos, msg: "Unclosed parentheses for @".concat(fn, "(...).") });
            textBuf += "@".concat(fn, "({$content})");
            continue;
        }
        var parser = grammar[fn];
        if (!parser) {
            errors.push({ pos: currentPos, msg: "Unknown input type '@".concat(fn, "'. Allowed: ").concat(Object.keys(grammar).join(", "), ".") });
            textBuf += "@".concat(fn, "(").concat(content, ")");
            continue;
        }
        try {
            var part = parser(content.trim(), currentPos);
            textBuf += (part);
        }
        catch (e) {
            errors.push({ pos: currentPos, msg: String((_a = e === null || e === void 0 ? void 0 : e.message) !== null && _a !== void 0 ? _a : e) });
            textBuf += "@".concat(fn, "(").concat(content, ")");
        }
    }
    if (errors.length > 0)
        return { ok: false, html: '', errors: errors };
    return { ok: true, html: textBuf, errors: errors };
}
function parseTX(content, pos) {
    var tokens = splitPipes(content);
    if (tokens.length === 0 || tokens.some(function (t) { return !t; })) {
        throw new Error('@tx: provide at least one non-empty answer. Pos ${pos}.');
    }
    var answers = dedupe(tokens);
    return "<input type=\"text\" data-answer='".concat(attrJSON(answers), "'>");
}
/* --------------------Helpers -------------------- */
function splitPipes(s) {
    return s.split("|").map(function (t) { return t.trim(); }).filter(Boolean);
}
function dedupe(arr) {
    return __spreadArray([], new Set(arr), true);
}
// avoid breaking the html when embedding in value attributes 
function escapeAttr(s) {
    return s.replace(/["&<>]/g, function (ch) { return ({
        '"': "&quot;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;"
    }[ch]); });
}
function attrJSON(obj) {
    return escapeAttr(JSON.stringify(obj));
}
/* --------------------Run -------------------- */
var code = "\nI @tx(am|'m) your best friend. \nI am @tx(21|20) years old. \nWe @tx(are|'re) a family.\n";
var parsed = parseBlanks(code);
if (!parsed.ok) {
    console.log(parsed.errors);
}
else {
    var p = "<p>".concat(parsed, "</p>");
    console.log(p);
    // document.body.innerHTML = p;
}
