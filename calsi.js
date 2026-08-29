/* ==========================================================================
   Casio fx-991CW ClassWiz - Scientific Engine & Interactive UI Controller
   ========================================================================== */

(() => {
  'use strict';

  // --- STATE ---
  const state = {
    expression: '',
    cursorPosition: 0,
    result: '',
    rawResult: null,
    error: null,
    calcMode: 'calculate',
    shiftActive: false,
    alphaActive: false,
    angleUnit: 'DEG', // DEG, RAD, GRA
    numberFormat: 'NORM1', // NORM1, NORM2, FIX, SCI, ENG
    fixDecimals: 2,
    sciDigits: 3,
    fractionDisplay: 'natural', // natural, decimal, mixed
    contrast: 3,
    soundEnabled: true,
    history: [],
    historyIndex: null,
    variables: {
      A: 0, B: 0, C: 0, D: 0, E: 0, F: 0,
      x: 0, y: 0, z: 0, M: 0, Ans: 0, PreAns: 0
    }
  };

  // --- AUDIO SYNTHESIS ---
  let audioCtx = null;
  const getAudioContext = () => {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  };

  const playSound = (type = 'click') => {
    if (!state.soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      } else {
        osc.type = 'sine';
        const freq = type === 'exe' ? 980 : type === 'shift' ? 1200 : 750;
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.025);
      }
    } catch (e) {
      // Audio context might be restricted
    }
  };

  // --- MATH ENGINE & PARSER ---
  const toRadians = (deg, unit) => {
    if (unit === 'RAD') return deg;
    if (unit === 'GRA') return (deg * Math.PI) / 200;
    return (deg * Math.PI) / 180;
  };

  const fromRadians = (rad, unit) => {
    if (unit === 'RAD') return rad;
    if (unit === 'GRA') return (rad * 200) / Math.PI;
    return (rad * 180) / Math.PI;
  };

  const factorial = (n) => {
    if (n < 0 || Math.floor(n) !== n) throw new Error('Math ERROR');
    if (n > 170) return Infinity;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const nPr = (n, r) => {
    if (n < 0 || r < 0 || r > n || Math.floor(n) !== n || Math.floor(r) !== r) {
      throw new Error('Math ERROR');
    }
    return factorial(n) / factorial(n - r);
  };

  const nCr = (n, r) => {
    if (n < 0 || r < 0 || r > n || Math.floor(n) !== n || Math.floor(r) !== r) {
      throw new Error('Math ERROR');
    }
    return factorial(n) / (factorial(r) * factorial(n - r));
  };

  const gcd = (a, b) => {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  const toFraction = (val) => {
    if (isNaN(val) || !isFinite(val)) return null;
    const sign = val < 0 ? -1 : 1;
    const num = Math.abs(val);
    if (Number.isInteger(num)) return { numerator: sign * num, denominator: 1 };

    const tolerance = 1.0e-7;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1, b = num;
    do {
      const a = Math.floor(b);
      let aux = h1;
      h1 = a * h1 + h2;
      h2 = aux;
      aux = k1;
      k1 = a * k1 + k2;
      k2 = aux;
      b = 1 / (b - a);
    } while (Math.abs(num - h1 / k1) > num * tolerance && k1 < 100000);

    if (k1 > 100000) return null;
    return { numerator: sign * h1, denominator: k1 };
  };

  const formatResult = (val) => {
    if (typeof val !== 'number' || isNaN(val)) return 'Math ERROR';
    if (!isFinite(val)) return val > 0 ? '∞' : '-∞';

    // Check fraction representation if natural mode
    if (state.fractionDisplay === 'natural') {
      const frac = toFraction(val);
      if (frac && frac.denominator > 1 && frac.denominator <= 10000 && Math.abs(frac.numerator) <= 100000) {
        return `${frac.numerator}/${frac.denominator}`;
      }
    } else if (state.fractionDisplay === 'mixed') {
      const frac = toFraction(val);
      if (frac && frac.denominator > 1 && Math.abs(frac.numerator) > frac.denominator) {
        const whole = Math.trunc(frac.numerator / frac.denominator);
        const rem = Math.abs(frac.numerator % frac.denominator);
        return `${whole} ${rem}/${frac.denominator}`;
      }
    }

    if (state.numberFormat === 'FIX') {
      return val.toFixed(state.fixDecimals);
    }
    if (state.numberFormat === 'SCI') {
      return val.toExponential(state.sciDigits);
    }
    if (state.numberFormat === 'ENG') {
      if (val === 0) return '0';
      const exp = Math.floor(Math.log10(Math.abs(val)));
      const engExp = Math.floor(exp / 3) * 3;
      const mantissa = val / Math.pow(10, engExp);
      return `${parseFloat(mantissa.toFixed(6))}×10^(${engExp})`;
    }

    // NORM format
    if (Math.abs(val) > 0 && (Math.abs(val) < 1e-9 || Math.abs(val) >= 1e10)) {
      return val.toExponential(6).replace('e+', '×10^(').replace('e', '×10^(') + ')';
    }
    const clean = parseFloat(val.toPrecision(10));
    return clean.toString();
  };

  const evaluateExpression = (exprStr) => {
    let clean = exprStr.trim();
    if (!clean) return 0;

    // Substitute visual mathematical symbols
    clean = clean.replace(/×/g, '*')
                 .replace(/÷/g, '/')
                 .replace(/−/g, '-')
                 .replace(/π/g, `(${Math.PI})`)
                 .replace(/e(?![a-zA-Z0-9_])/g, `(${Math.E})`);

    // Replace Variables
    const vars = state.variables;
    clean = clean.replace(/\bAns\b/g, `(${vars.Ans})`)
                 .replace(/\bPreAns\b/g, `(${vars.PreAns})`)
                 .replace(/\b([A-FxyzM])\b/g, (_, v) => `(${vars[v] || 0})`);

    // Trigonometric functions according to angle unit
    const u = state.angleUnit;
    const trigWrap = (fn, inner) => {
      return `Math.${fn}((${inner}) * ${u === 'RAD' ? 1 : u === 'GRA' ? Math.PI/200 : Math.PI/180})`;
    };
    const invTrigWrap = (fn, inner) => {
      return `(Math.${fn}(${inner}) * ${u === 'RAD' ? 1 : u === 'GRA' ? 200/Math.PI : 180/Math.PI})`;
    };

    // Replace Scientific Functions
    clean = clean.replace(/asin\(([^()]+)\)/g, (_, val) => invTrigWrap('asin', val))
                 .replace(/acos\(([^()]+)\)/g, (_, val) => invTrigWrap('acos', val))
                 .replace(/atan\(([^()]+)\)/g, (_, val) => invTrigWrap('atan', val))
                 .replace(/sin\(([^()]+)\)/g, (_, val) => trigWrap('sin', val))
                 .replace(/cos\(([^()]+)\)/g, (_, val) => trigWrap('cos', val))
                 .replace(/tan\(([^()]+)\)/g, (_, val) => trigWrap('tan', val))
                 .replace(/sinh\(/g, 'Math.sinh(')
                 .replace(/cosh\(/g, 'Math.cosh(')
                 .replace(/tanh\(/g, 'Math.tanh(')
                 .replace(/asinh\(/g, 'Math.asinh(')
                 .replace(/acosh\(/g, 'Math.acosh(')
                 .replace(/atanh\(/g, 'Math.atanh(')
                 .replace(/log\(/g, 'Math.log10(')
                 .replace(/ln\(/g, 'Math.log(')
                 .replace(/√\(/g, 'Math.sqrt(')
                 .replace(/∛\(/g, 'Math.cbrt(')
                 .replace(/abs\(/g, 'Math.abs(')
                 .replace(/(-)/g, '(-1)*')
                 .replace(/\^/g, '**');

    // Handle factorials (x!)
    clean = clean.replace(/(\d+(\.\d+)?)!/g, (_, num) => `factorial(${num})`);

    // Handle nPr and nCr
    clean = clean.replace(/(\d+)\s*P\s*(\d+)/g, (_, n, r) => `nPr(${n}, ${r})`);
    clean = clean.replace(/(\d+)\s*C\s*(\d+)/g, (_, n, r) => `nCr(${n}, ${r})`);

    // Context execution
    const evaluator = new Function('factorial', 'nPr', 'nCr', 'gcd', `
      try {
        const res = (${clean});
        return res;
      } catch (e) {
        throw new Error('Syntax ERROR');
      }
    `);

    const result = evaluator(factorial, nPr, nCr, gcd);
    if (typeof result !== 'number' || isNaN(result)) throw new Error('Math ERROR');
    return result;
  };

  // --- UI UPDATE & RENDERING ---
  const updateLcd = () => {
    const exprEl = document.getElementById('lcd-expr');
    const resultEl = document.getElementById('lcd-result');

    // Build expression with visible cursor
    const expr = state.expression;
    const pos = state.cursorPosition;
    const before = expr.slice(0, pos);
    const after = expr.slice(pos);

    exprEl.innerHTML = `${escapeHtml(before)}<span class="expr-cursor"></span>${escapeHtml(after)}`;
    exprEl.scrollLeft = exprEl.scrollWidth;

    // Display Result or Error
    if (state.error) {
      resultEl.innerHTML = `<span class="lcd-error">${escapeHtml(state.error)}</span>`;
    } else {
      resultEl.textContent = state.result || (state.rawResult !== null ? formatResult(state.rawResult) : '0');
    }

    // Status Badges
    document.getElementById('ind-s').className = `ind-badge ${state.shiftActive ? 'active' : 'inactive'}`;
    document.getElementById('ind-a').className = `ind-badge ${state.alphaActive ? 'active' : 'inactive'}`;
    document.getElementById('ind-m').className = `ind-badge ${state.variables.M !== 0 ? 'active' : 'inactive'}`;
    document.getElementById('ind-angle').textContent = state.angleUnit;
    document.getElementById('ind-fmt').textContent = state.numberFormat;
    document.getElementById('ind-mode').textContent = state.calcMode.toUpperCase().slice(0, 4);

    // Shift/Alpha buttons active visual state
    const btnShift = document.getElementById('btn-shift');
    const btnAlpha = document.getElementById('btn-alpha');
    if (btnShift) btnShift.classList.toggle('active', state.shiftActive);
    if (btnAlpha) btnAlpha.classList.toggle('active', state.alphaActive);
  };

  const escapeHtml = (str) => {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  };

  // --- ACTIONS ---
  const insertToken = (token) => {
    playSound('click');
    state.error = null;
    state.historyIndex = null;

    const expr = state.expression;
    const pos = state.cursorPosition;
    state.expression = expr.slice(0, pos) + token + expr.slice(pos);
    state.cursorPosition = pos + token.length;

    state.shiftActive = false;
    state.alphaActive = false;
    updateLcd();
  };

  const executeCalculation = () => {
    playSound('exe');
    if (!state.expression.trim()) {
      if (state.rawResult !== null) {
        state.result = formatResult(state.rawResult);
        updateLcd();
      }
      return;
    }

    try {
      const val = evaluateExpression(state.expression);
      state.rawResult = val;
      state.result = formatResult(val);
      state.error = null;

      // Update Variables Memory
      state.variables.PreAns = state.variables.Ans;
      state.variables.Ans = val;

      // Push to history
      state.history.unshift({
        expression: state.expression,
        result: state.result,
        rawResult: val
      });
      if (state.history.length > 50) state.history.pop();
      state.historyIndex = null;
    } catch (err) {
      playSound('error');
      state.error = err.message || 'Syntax ERROR';
    }

    state.shiftActive = false;
    state.alphaActive = false;
    updateLcd();
  };

  const allClear = () => {
    playSound('click');
    state.expression = '';
    state.cursorPosition = 0;
    state.error = null;
    state.historyIndex = null;
    state.shiftActive = false;
    state.alphaActive = false;
    updateLcd();
  };

  const deleteChar = () => {
    playSound('click');
    state.error = null;
    if (state.cursorPosition > 0) {
      const expr = state.expression;
      const pos = state.cursorPosition;
      state.expression = expr.slice(0, pos - 1) + expr.slice(pos);
      state.cursorPosition = pos - 1;
    }
    updateLcd();
  };

  const moveCursor = (dir) => {
    playSound('click');
    if (dir === 'left') {
      state.cursorPosition = Math.max(0, state.cursorPosition - 1);
    } else {
      state.cursorPosition = Math.min(state.expression.length, state.cursorPosition + 1);
    }
    updateLcd();
  };

  const navigateHistory = (dir) => {
    if (state.history.length === 0) return;
    playSound('click');

    if (dir === 'up') {
      const nextIdx = state.historyIndex === null ? 0 : Math.min(state.historyIndex + 1, state.history.length - 1);
      state.historyIndex = nextIdx;
      const item = state.history[nextIdx];
      if (item) {
        state.expression = item.expression;
        state.cursorPosition = item.expression.length;
        state.result = item.result;
        state.rawResult = item.rawResult;
      }
    } else {
      if (state.historyIndex === null) return;
      const nextIdx = state.historyIndex - 1;
      if (nextIdx < 0) {
        state.historyIndex = null;
        state.expression = '';
        state.cursorPosition = 0;
      } else {
        state.historyIndex = nextIdx;
        const item = state.history[nextIdx];
        if (item) {
          state.expression = item.expression;
          state.cursorPosition = item.expression.length;
          state.result = item.result;
          state.rawResult = item.rawResult;
        }
      }
    }
    updateLcd();
  };

  const toggleFractionDisplay = () => {
    playSound('click');
    const modes = ['natural', 'decimal', 'mixed'];
    const next = modes[(modes.indexOf(state.fractionDisplay) + 1) % modes.length];
    state.fractionDisplay = next;
    if (state.rawResult !== null) {
      state.result = formatResult(state.rawResult);
    }
    updateLcd();
  };

  // --- MODAL CONTROLLERS ---
  const openModal = (id) => {
    playSound('click');
    closeAllModals();
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'flex';
      if (id === 'modal-variables') renderVariables();
      if (id === 'modal-tools') renderTools();
      if (id === 'modal-catalog') renderCatalog();
    }
  };

  const closeAllModals = () => {
    document.querySelectorAll('.modal-overlay').forEach((el) => {
      el.style.display = 'none';
    });
  };

  // --- VARIABLES MANAGER ---
  const renderVariables = () => {
    const container = document.getElementById('var-grid-container');
    if (!container) return;
    const varKeys = ['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'z', 'M', 'Ans', 'PreAns'];
    container.innerHTML = varKeys.map(k => `
      <div class="var-cell">
        <span class="var-name">${k}</span>
        <span class="var-val">${state.variables[k] || 0}</span>
        <button class="var-btn-use" data-var="${k}">USE</button>
        <button class="var-btn-use" style="background:#1e3a8a;color:#fff" data-store="${k}">STO</button>
      </div>
    `).join('');

    container.querySelectorAll('[data-var]').forEach(btn => {
      btn.onclick = () => {
        const v = btn.getAttribute('data-var');
        insertToken(v);
        closeAllModals();
      };
    });

    container.querySelectorAll('[data-store]').forEach(btn => {
      btn.onclick = () => {
        const v = btn.getAttribute('data-store');
        if (state.rawResult !== null) {
          state.variables[v] = state.rawResult;
          renderVariables();
          updateLcd();
        }
      };
    });
  };

  // --- TOOLS & SETTINGS ---
  const renderTools = () => {
    // Angle Unit
    ['DEG', 'RAD', 'GRA'].forEach(unit => {
      const btn = document.getElementById(`btn-angle-${unit.toLowerCase()}`);
      if (btn) btn.classList.toggle('active', state.angleUnit === unit);
    });
    // Sound
    const sndBtn = document.getElementById('btn-sound-toggle');
    if (sndBtn) {
      sndBtn.textContent = state.soundEnabled ? 'ON' : 'OFF';
      sndBtn.classList.toggle('active', state.soundEnabled);
    }
  };

  // --- CATALOG DATABASE ---
  const catalogData = [
    { cat: 'Hyperbolic', items: [
      { name: 'sinh', token: 'sinh(' },
      { name: 'cosh', token: 'cosh(' },
      { name: 'tanh', token: 'tanh(' },
      { name: 'asinh', token: 'asinh(' }
    ]},
    { cat: 'Probability & Math', items: [
      { name: 'nPr (Permutation)', token: 'P' },
      { name: 'nCr (Combination)', token: 'C' },
      { name: 'x! (Factorial)', token: '!' },
      { name: 'gcd(a,b)', token: 'gcd(' },
      { name: 'Ran# (0-1)', token: 'Ran#' }
    ]},
    { cat: 'Constants', items: [
      { name: 'π (Pi: 3.14159...)', token: 'π' },
      { name: 'e (Euler: 2.71828...)', token: 'e' }
    ]}
  ];

  const renderCatalog = (filter = '') => {
    const listEl = document.getElementById('catalog-list');
    if (!listEl) return;
    const lower = filter.toLowerCase();
    let html = '';

    catalogData.forEach(section => {
      const filtered = section.items.filter(i => i.name.toLowerCase().includes(lower));
      if (filtered.length > 0) {
        html += `<div style="font-weight:bold;color:#facc15;margin:8px 0 4px 0;">${section.cat}</div>`;
        filtered.forEach(item => {
          html += `
            <div class="setting-row" style="cursor:pointer" data-cat-token="${item.token}">
              <span>${item.name}</span>
              <span style="color:#94a3b8;font-family:monospace">${item.token}</span>
            </div>
          `;
        });
      }
    });

    listEl.innerHTML = html;
    listEl.querySelectorAll('[data-cat-token]').forEach(el => {
      el.onclick = () => {
        const token = el.getAttribute('data-cat-token');
        if (token === 'Ran#') {
          insertToken(Math.random().toFixed(4));
        } else {
          insertToken(token);
        }
        closeAllModals();
      };
    });
  };

  // --- EQUATION SOLVER ---
  const solveQuadratic = (a, b, c) => {
    const d = b * b - 4 * a * c;
    if (d > 0) {
      const x1 = (-b + Math.sqrt(d)) / (2 * a);
      const x2 = (-b - Math.sqrt(d)) / (2 * a);
      return `x₁ = ${x1.toFixed(4)}<br>x₂ = ${x2.toFixed(4)}`;
    } else if (d === 0) {
      const x = -b / (2 * a);
      return `x = ${x.toFixed(4)} (Double root)`;
    } else {
      const real = (-b / (2 * a)).toFixed(4);
      const imag = (Math.sqrt(-d) / (2 * a)).toFixed(4);
      return `x₁ = ${real} + ${imag}i<br>x₂ = ${real} - ${imag}i`;
    }
  };

  // --- BASE-N CONVERTER ---
  const convertBaseN = (numStr, fromBase, toBase) => {
    try {
      const dec = parseInt(numStr, fromBase);
      if (isNaN(dec)) return 'Syntax ERROR';
      return dec.toString(toBase).toUpperCase();
    } catch {
      return 'Syntax ERROR';
    }
  };

  // --- ATTACH EVENT LISTENERS ---
  const setupEventListeners = () => {
    // Keypad Click Delegation
    document.getElementById('calc-container').addEventListener('click', (e) => {
      const target = e.target.closest('button');
      if (!target) return;

      const token = target.getAttribute('data-token');
      const shiftToken = target.getAttribute('data-shift-token');
      const action = target.getAttribute('data-action');

      if (token) {
        if (state.shiftActive && shiftToken) {
          insertToken(shiftToken);
        } else {
          insertToken(token);
        }
      } else if (action) {
        handleAction(action);
      }
    });

    // Modal Close Buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.onclick = () => closeAllModals();
    });

    // Home Menu Mode Selections
    document.querySelectorAll('[data-calc-mode]').forEach(btn => {
      btn.onclick = () => {
        const mode = btn.getAttribute('data-calc-mode');
        state.calcMode = mode;
        closeAllModals();
        if (mode === 'equation') openModal('modal-equation');
        else if (mode === 'base-n') openModal('modal-basen');
        else if (mode === 'table') openModal('modal-table');
        else if (mode === 'matrix') openModal('modal-matrix');
        updateLcd();
      };
    });

    // Tools / Settings Listeners
    ['deg', 'rad', 'gra'].forEach(u => {
      const el = document.getElementById(`btn-angle-${u}`);
      if (el) {
        el.onclick = () => {
          state.angleUnit = u.toUpperCase();
          renderTools();
          updateLcd();
        };
      }
    });

    const sndBtn = document.getElementById('btn-sound-toggle');
    if (sndBtn) {
      sndBtn.onclick = () => {
        state.soundEnabled = !state.soundEnabled;
        renderTools();
      };
    }

    const resetBtn = document.getElementById('btn-factory-reset');
    if (resetBtn) {
      resetBtn.onclick = () => {
        state.angleUnit = 'DEG';
        state.numberFormat = 'NORM1';
        state.fractionDisplay = 'natural';
        state.expression = '';
        state.result = '';
        state.rawResult = null;
        state.variables = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, x: 0, y: 0, z: 0, M: 0, Ans: 0, PreAns: 0 };
        renderTools();
        updateLcd();
        closeAllModals();
      };
    }

    // Catalog Search Filter
    const catInput = document.getElementById('catalog-search');
    if (catInput) {
      catInput.oninput = (e) => renderCatalog(e.target.value);
    }

    // Equation Solver UI Trigger
    const solveQuadBtn = document.getElementById('btn-solve-quad');
    if (solveQuadBtn) {
      solveQuadBtn.onclick = () => {
        const a = parseFloat(document.getElementById('quad-a').value) || 1;
        const b = parseFloat(document.getElementById('quad-b').value) || 0;
        const c = parseFloat(document.getElementById('quad-c').value) || 0;
        document.getElementById('quad-result').innerHTML = solveQuadratic(a, b, c);
      };
    }

    // Table Mode Generator
    const genTableBtn = document.getElementById('btn-gen-table');
    if (genTableBtn) {
      genTableBtn.onclick = () => {
        const fnStr = document.getElementById('table-fn').value || 'x^2';
        const start = parseFloat(document.getElementById('table-start').value) || 1;
        const end = parseFloat(document.getElementById('table-end').value) || 5;
        const step = parseFloat(document.getElementById('table-step').value) || 1;
        let html = '<table style="width:100%;border-collapse:collapse;margin-top:6px;">';
        html += '<tr style="border-bottom:1px solid #444;color:#facc15;"><th>x</th><th>f(x)</th></tr>';

        for (let x = start; x <= end; x += step) {
          try {
            state.variables.x = x;
            const y = evaluateExpression(fnStr);
            html += `<tr style="border-bottom:1px solid #2a2a2a;text-align:center;"><td>${x}</td><td>${parseFloat(y.toFixed(4))}</td></tr>`;
          } catch {
            html += `<tr style="border-bottom:1px solid #2a2a2a;text-align:center;"><td>${x}</td><td style="color:#f87171">ERROR</td></tr>`;
          }
        }
        html += '</table>';
        document.getElementById('table-output').innerHTML = html;
      };
    }

    // Physical Keyboard Listener
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        executeCalculation();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        deleteChar();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        allClear();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveCursor('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveCursor('right');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateHistory('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateHistory('down');
      } else if (e.key === 'Shift') {
        state.shiftActive = !state.shiftActive;
        playSound('shift');
        updateLcd();
      } else if ('0123456789.+-*/()^%!'.includes(e.key)) {
        e.preventDefault();
        const map = { '*': '×', '/': '÷', '-': '−' };
        insertToken(map[e.key] || e.key);
      }
    });
  };

  const handleAction = (action) => {
    switch (action) {
      case 'exe':
        executeCalculation();
        break;
      case 'del':
        deleteChar();
        break;
      case 'ac':
        allClear();
        break;
      case 'shift':
        state.shiftActive = !state.shiftActive;
        playSound('shift');
        updateLcd();
        break;
      case 'alpha':
        state.alphaActive = !state.alphaActive;
        playSound('shift');
        updateLcd();
        break;
      case 'home':
        openModal('modal-home');
        break;
      case 'back':
        closeAllModals();
        break;
      case 'tools':
        openModal('modal-tools');
        break;
      case 'variables':
        openModal('modal-variables');
        break;
      case 'format':
        toggleFractionDisplay();
        break;
      case 'catalog':
        openModal('modal-catalog');
        break;
      case 'help':
        openModal('modal-help');
        break;
      case 'dpad-up':
        navigateHistory('up');
        break;
      case 'dpad-down':
        navigateHistory('down');
      case 'dpad-left':
        moveCursor('left');
        break;
      case 'dpad-right':
        moveCursor('right');
        break;
      case 'm-plus':
        if (state.rawResult !== null) {
          state.variables.M += state.rawResult;
          playSound('click');
          updateLcd();
        }
        break;
      case 'eng':
        state.numberFormat = state.numberFormat === 'ENG' ? 'NORM1' : 'ENG';
        if (state.rawResult !== null) state.result = formatResult(state.rawResult);
        updateLcd();
        break;
    }
  };

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateLcd();
  });
})();
