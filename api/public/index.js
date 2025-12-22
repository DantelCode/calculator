// DOM Constants
const main_grid = document.getElementById('main_grid');
const sub_grid = document.getElementById('sub_grid');
const topDisplay = document.getElementById('upper');
const btmDisplay = document.getElementById('lower');
const themeToggle = document.getElementById('themeToggle');

const canvas = document.getElementById('bg-stars');
const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;

let state = {
  expression: '', // expression (operators and numbers)
  entry: '0', // current input shown on bottom display
  memory: 0,
  justEvaluated: false,
}

const data = {
  sub: ['MC', 'MR', 'M+', 'M-', 'MS', 'M'],
  main: [
    '%', 'CE', 'C', '⌫',
    '1/ₓ', 'x²', '√x', '÷',
    '7', '8', '9', 'X',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '±', '0', '.', '='
  ]
}

function setDisplay() {
  topDisplay.textContent = state.expression;
  btmDisplay.textContent = state.entry;
}

/** UI initializations **/
function createButtons() {
  sub_grid.innerHTML = '';
  main_grid.innerHTML = '';

  data.sub.forEach((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'sub-btn';
    switch (label) {
      case 'MC': btn.onclick = memoryClear; break;
      case 'MR': btn.onclick = memoryRecall; break;
      case 'M+': btn.onclick = memoryAdd; break;
      case 'M-': btn.onclick = memorySubtract; break;
      case 'MS': btn.onclick = memoryStore; break;
      case 'M': btn.onclick = memoryDisplay; break;
    }
    sub_grid.appendChild(btn);
  });

  data.main.forEach((label) => {
    const btn = document.createElement('button');
    btn.textContent = label;
    // classify
    if (['=', '+', '-', 'X', '÷', '%'].includes(label)) btn.classList.add('btn-op');
    if (['C', 'CE', '='].includes(label)) btn.classList.add('btn-clear');

    btn.addEventListener('click', () => onButtonClick(label));
    main_grid.appendChild(btn);
  })
}

function onButtonClick(label) {
  if (!label) return;

  // digits
  if (/^[0-9]$/.test(label)) {
    appendDigit(label);
    return;
  }
  if (label === '.') { appendDot(); return; }

  switch (label) {
    case 'C': clearAll(); break;
    case 'CE': clearEntry(); break;
    case '⌫': backspace(); break;
    case '=': evaluate(); break;
    case 'X': setOperator('*'); break;
    case '÷': setOperator('/'); break;
    case '+': setOperator('+'); break;
    case '-': setOperator('-'); break;
    case '%': percent(); break;
    case '1/ₓ': reciprocal(); break;
    case 'x²': square(); break;
    case '√x': squareRoot(); break;
    case '±': changeSign(); break;
    default:
    // do nothing
  }
}

function appendDigit(d) {
  // reset when previous result was an error or calculation done
  if (state.justEvaluated) { state.entry = '0'; state.justEvaluated = false; }
  if (!/^[-]?[0-9]*(\.|$)/.test(state.entry)) { state.entry = '0'; }
  if (state.entry === '0') state.entry = d; else state.entry += d;
  setDisplay();
}

function appendDot() {
  if (state.justEvaluated) { state.entry = '0'; state.justEvaluated = false; }
  if (!/^[-]?[0-9]*$/.test(state.entry)) { state.entry = '0'; }
  if (!state.entry.includes('.')) state.entry += '.';
  setDisplay();
}

function setOperator(op) {
  if (state.justEvaluated) {
    state.expression = state.entry + op;
    state.justEvaluated = false;
    state.entry = '0';
    setDisplay();
    return;
  }
  if (!state.expression) {
    state.expression = state.entry + op;
  } else if (/[+\-*/%]$/.test(state.expression) && state.entry === '0') {
    // replace trailing operator
    state.expression = state.expression.slice(0, -1) + op;
  } else {
    state.expression = state.expression + state.entry + op;
  }
  state.entry = '0';
  setDisplay();
}

function percent() {
  const val = parseFloat(state.entry) || 0;
  state.entry = (val / 100).toString();
  setDisplay();
}

function reciprocal() {
  const val = parseFloat(state.entry) || 0;
  if (val === 0) { state.entry = 'Infinity'; }
  else state.entry = (1 / val).toString();
  setDisplay();
}

function square() { const val = parseFloat(state.entry) || 0; state.entry = (val * val).toString(); setDisplay(); }
function squareRoot() { const val = parseFloat(state.entry) || 0; state.entry = (val < 0 ? 'Math Error' : Math.sqrt(val).toString()); setDisplay(); }
function changeSign() { const val = parseFloat(state.entry) || 0; state.entry = (-val).toString(); setDisplay(); }

function evaluate() {
  try {
    // Build final expression
    const exp = state.expression + state.entry;
    // sanitize operators
    const sanitized = exp.replace(/X/g, '*').replace(/÷/g, '/');
    // Evaluate safely by using Function
    const result = Function('return ' + sanitized)();
    state.expression = '';
    state.entry = String(result);
    state.justEvaluated = true;
    setDisplay();
  } catch (e) {
    state.entry = 'Error';
    setDisplay();
  }
}

function clearAll() { state.expression = ''; state.entry = '0'; state.justEvaluated = false; setDisplay(); }
function clearEntry() { state.entry = '0'; setDisplay(); }
function backspace() { if (state.entry.length <= 1) state.entry = '0'; else state.entry = state.entry.slice(0, -1); setDisplay(); }

/* Memory functions with safe parsing */
function parseEntry() { const v = parseFloat(state.entry); return Number.isFinite(v) ? v : 0; }
function memoryAdd() { state.memory = state.memory + parseEntry(); }
function memorySubtract() { state.memory = state.memory - parseEntry(); }
function memoryRecall() { state.entry = String(state.memory); setDisplay(); }
function memoryClear() { state.memory = 0; }
function memoryStore() { state.memory = parseEntry(); }
function memoryDisplay() { state.entry = String(state.memory); setDisplay(); }

/* Theme Toggle */
function initTheme() {
  const isLight = localStorage.getItem('calc-theme') === 'dark';
  if (isLight) document.body.classList.add('dark');
  themeToggle.onclick = () => { document.body.classList.toggle('light'); localStorage.setItem('calc-theme', document.body.classList.contains('light') ? 'light' : 'dark'); }
}

/* Keyboard support */
function attachKeyboard() {
  window.addEventListener('keydown', (ev) => {
    if (/\d/.test(ev.key)) appendDigit(ev.key);
    else if (ev.key === '.') appendDot();
    else if (ev.key === 'Enter') evaluate();
    else if (ev.key === 'Backspace') backspace();
    else if (ev.key === 'Delete') clearEntry();
    else if (ev.key === 'Escape') clearAll();
    else if (['+', '-', '*', '/'].includes(ev.key)) setOperator(ev.key);
  });
}

/* starry background animation using canvas */
let stars = [];
function setupCanvas() {
  if (!ctx) return;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  function resize() { canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
  window.addEventListener('resize', resize);
  resize();
  // create stars
  const count = Math.floor((window.innerWidth + window.innerHeight) / 10);
  stars = new Array(count).fill(null).map(() => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.2 + 0.3, alpha: Math.random(), dA: (Math.random() * 0.02) + 0.005 }));
}

function animateStars() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0,0,0,0)';
  for (let s of stars) {
    s.alpha += s.dA * (Math.random() < 0.5 ? -1 : 1);
    if (s.alpha < 0.05) { s.alpha = 0.05; }
    if (s.alpha > 1) { s.alpha = 1; }
    ctx.beginPath();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = '#ddd';
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateStars);
}

// initialize
createButtons();
setDisplay();
initTheme();
attachKeyboard();
setupCanvas();
requestAnimationFrame(animateStars)