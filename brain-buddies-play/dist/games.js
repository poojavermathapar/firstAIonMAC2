// Question generators. Every question looks like:
// { prompt, visual, choices: [html], answer: index, speak, autoSpeak, choiceStyle }

// ---------- helpers ----------
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const times = (n, fn) => Array.from({ length: n }, (_, i) => fn(i)).join('');
const stripTags = (s) => String(s).replace(/<[^>]*>/g, '');

function q(prompt, visual, correct, wrongs, opts = {}) {
  correct = String(correct);
  const others = shuffle([...new Set(wrongs.map(String))].filter((w) => w !== correct)).slice(0, 3);
  // Top up numeric answers (like "12", "$5", "40%", "30 km") with nearby values if distractors collided.
  const num = correct.match(/^(\$?)(-?\d+)(%| km)?$/);
  for (let d = 1; num && !opts.exact && others.length < 3 && d < 50; d++) {
    for (const v of [Number(num[2]) + d, Number(num[2]) - d]) {
      const s = `${num[1]}${v}${num[3] || ''}`;
      if (others.length < 3 && (v >= 0 || num[2] < 0 || opts.allowNegative) && !others.includes(s)) others.push(s);
    }
  }
  const choices = shuffle([correct, ...others]);
  return {
    prompt,
    visual,
    choices,
    answer: choices.indexOf(correct),
    speak: opts.speak || stripTags(prompt),
    autoSpeak: !!opts.autoSpeak,
    choiceStyle: opts.choiceStyle || '',
  };
}

// Three distinct numbers close to `ans`, never below `min`.
function nearby(ans, spread = 3, min = 0) {
  const out = new Set();
  for (let guard = 0; out.size < 3 && guard < 200; guard++) {
    if (guard > 0 && guard % 40 === 0) spread++;
    const v = ans + rand(-spread, spread);
    if (v !== ans && v >= min) out.add(v);
  }
  return [...out];
}

// ---------- visuals ----------
const group = (e, n, goneFrom = Infinity) =>
  `<div class="emoji-group">${times(n, (i) => `<span class="${i >= goneFrom ? 'gone' : ''}">${e}</span>`)}</div>`;

const row = (...parts) => `<div class="vrow">${parts.join('')}</div>`;
const op = (s) => `<span class="op">${s}</span>`;
const equation = (s) => `<div class="equation">${s.replace('?', '<span class="blank">?</span>')}</div>`;
const bubbles = (terms) =>
  `<div class="seq">${terms.map((t) => `<span class="bubble">${t}</span>`).join('')}<span class="bubble blank">?</span></div>`;

function dotArray(r, c) {
  return `<div class="dot-array" style="--cols:${c}">${times(r * c, () => '<span></span>')}</div>`;
}

function pie(n, k) {
  const R = 80, C = 90;
  const pt = (i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return `${C + R * Math.cos(a)} ${C + R * Math.sin(a)}`;
  };
  const slices = n === 1
    ? `<circle cx="${C}" cy="${C}" r="${R}" class="on"/>`
    : times(n, (i) => `<path d="M${C} ${C} L${pt(i)} A${R} ${R} 0 0 1 ${pt(i + 1)} Z" class="${i < k ? 'on' : 'off'}"/>`);
  return `<svg viewBox="0 0 180 180" class="pie">${slices}</svg>`;
}

function clock(h, m) {
  const nums = times(12, (i) => {
    const n = i + 1, a = (n * Math.PI) / 6;
    return `<text x="${100 + 72 * Math.sin(a)}" y="${100 - 72 * Math.cos(a) + 7}">${n}</text>`;
  });
  const ticks = times(60, (i) => `<line x1="100" y1="10" x2="100" y2="${i % 5 ? 15 : 19}" transform="rotate(${i * 6} 100 100)" class="tick"/>`);
  return `<svg viewBox="0 0 200 200" class="clock">
    <circle cx="100" cy="100" r="94" class="face"/>${ticks}${nums}
    <line x1="100" y1="100" x2="100" y2="55" class="hand hour" transform="rotate(${((h % 12) + m / 60) * 30} 100 100)"/>
    <line x1="100" y1="100" x2="100" y2="28" class="hand minute" transform="rotate(${m * 6} 100 100)"/>
    <circle cx="100" cy="100" r="6" class="pin"/></svg>`;
}

function baseTen(n) {
  const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
  return `<div class="base10">${times(h, () => '<div class="flat"></div>')}${times(t, () => '<div class="rod"></div>')}
    <div class="ones">${times(o, () => '<div class="cube"></div>')}</div></div>
    <div class="legend"><span class="flat mini"></span> 100 &nbsp; <span class="rod mini"></span> 10 &nbsp; <span class="cube"></span> 1</div>`;
}

function percentGrid(p) {
  return `<div class="pgrid">${times(100, (i) => `<span class="${i < p ? 'on' : ''}"></span>`)}</div>`;
}

function numberLine(start) {
  const W = 640, pad = 22, step = (W - 2 * pad) / 20, x = (v) => pad + (v + 10) * step;
  let ticks = '';
  for (let v = -10; v <= 10; v++) {
    ticks += `<line x1="${x(v)}" y1="${v % 5 ? 52 : 46}" x2="${x(v)}" y2="${v % 5 ? 68 : 74}" class="tick"/>
      <text x="${x(v)}" y="92" class="${v === 0 ? 'zero' : ''}">${v}</text>`;
  }
  return `<svg viewBox="0 0 ${W} 100" class="numline">
    <line x1="${pad - 10}" y1="60" x2="${W - pad + 10}" y2="60" class="axis"/>${ticks}
    <text x="${x(start)}" y="42" class="frog">🐸</text></svg>`;
}

function coordPlane(px, py) {
  const S = 22, N = 5, size = S * 2 * N + 40, o = size / 2;
  let g = '';
  for (let i = -N; i <= N; i++) {
    const cls = i === 0 ? 'axis' : 'grid';
    g += `<line x1="${o + i * S}" y1="${o - N * S}" x2="${o + i * S}" y2="${o + N * S}" class="${cls}"/>`;
    g += `<line x1="${o - N * S}" y1="${o + i * S}" x2="${o + N * S}" y2="${o + i * S}" class="${cls}"/>`;
    if (i) {
      g += `<text x="${o + i * S}" y="${o + 15}" class="lbl">${i}</text>`;
      g += `<text x="${o - 9}" y="${o - i * S + 4}" class="lbl">${i}</text>`;
    }
  }
  return `<svg viewBox="0 0 ${size} ${size}" class="coords">${g}
    <text x="${o + N * S + 12}" y="${o + 4}" class="axname">x</text><text x="${o}" y="${o - N * S - 8}" class="axname">y</text>
    <text x="${o + px * S}" y="${o - py * S + 8}" class="star">⭐</text></svg>`;
}

function areaGrid(w, h) {
  return `<div class="area-wrap"><div class="side top">${w}</div><div class="side left">${h}</div>
    <div class="area-grid" style="--cols:${w}">${times(w * h, () => '<span></span>')}</div></div>`;
}

const fracBar = (a, b) =>
  `<div class="fbar-row"><b>${a}/${b}</b><div class="fbar" style="--n:${b}">${times(b, (i) => `<span class="${i < a ? 'on' : ''}"></span>`)}</div></div>`;

// ---------- NUMBER FUN ----------
const numbers = {
  1: [
    function count() {
      const e = pick(CONTENT.objects), n = rand(2, 10);
      return q(`How many ${e} can you count?`, group(e, n), n, nearby(n, 2, 1), { choiceStyle: 'nums' });
    },
    function addPics() {
      const e = pick(CONTENT.objects), a = rand(1, 5), b = rand(1, 5);
      return q(`${a} + ${b} = ?`, row(group(e, a), op('+'), group(e, b)), a + b, nearby(a + b, 2, 1),
        { speak: `${a} plus ${b}. How many altogether?`, choiceStyle: 'nums' });
    },
    function subPics() {
      const e = pick(CONTENT.objects), a = rand(3, 9), b = rand(1, a - 1);
      return q(`${a} − ${b} = ?`, group(e, a, a - b), a - b, nearby(a - b, 2, 0),
        { speak: `${a} take away ${b}. How many are left?`, choiceStyle: 'nums' });
    },
    function shapes() {
      const S = [['circle', '🟢'], ['square', '🟦'], ['triangle', '🔺'], ['star', '⭐'], ['heart', '❤️'], ['diamond', '🔷']];
      const [name, e] = pick(S);
      return q(`Tap the <b>${name}</b>!`, '', e, S.map((s) => s[1]), { choiceStyle: 'pics' });
    },
    function compare() {
      const e = pick(CONTENT.objects);
      let a = rand(1, 9), b = rand(1, 9);
      while (a === b) b = rand(1, 9);
      return q(`Which number is <b>bigger</b>?`, row(group(e, a), op('or'), group(e, b)), Math.max(a, b),
        [Math.min(a, b)], { choiceStyle: 'nums', exact: true });
    },
  ],
  2: [
    function arrayMult() {
      const r = rand(2, 6), c = rand(2, 9);
      return q(`${r} rows of ${c}. How many dots in all?`, dotArray(r, c) + equation(`${r} × ${c} = ?`), r * c,
        [r * c + r, r * c - c, r + c, (r + 1) * c], { choiceStyle: 'nums' });
    },
    function pieFraction() {
      const n = pick([2, 3, 4, 5, 6, 8]), k = rand(1, n - 1);
      return q('What fraction of the pizza is colored? 🍕', pie(n, k), `${k}/${n}`,
        [`${n - k}/${n}`, `${k}/${n + 1}`, `${n}/${k}`, `${k + 1}/${n}`, `${k}/${n - 1}`], { choiceStyle: 'nums' });
    },
    function readClock() {
      const h = rand(1, 12), m = pick([0, 15, 30, 45]);
      const f = (hh, mm) => `${hh}:${String(mm).padStart(2, '0')}`;
      return q('What time does the clock show? ⏰', clock(h, m), f(h, m),
        [f(h, (m + 30) % 60), f((h % 12) + 1, m), f(h === 1 ? 12 : h - 1, m), f(h, (m + 15) % 60)], { choiceStyle: 'nums' });
    },
    function share() {
      const friends = rand(2, 5), each = rand(2, 5), total = friends * each;
      return q(`Share ${total} 🍪 equally with ${friends} friends. How many does each friend get?`,
        row(group('🍪', total), op('÷'), group('🧒', friends)), each, nearby(each, 2, 1), { choiceStyle: 'nums' });
    },
    function placeValue() {
      const n = rand(21, 349);
      const h = Math.floor(n / 100), t = Math.floor(n / 10) % 10, o = n % 10;
      return q('What number do the blocks show?', baseTen(n), n,
        [n + 10, n - 1, h * 100 + o * 10 + t, n + 100, n - 10].filter((v) => v > 0), { choiceStyle: 'nums' });
    },
  ],
  3: [
    function percent() {
      const p = rand(1, 19) * 5;
      return q('What percent of the grid is colored?', percentGrid(p), `${p}%`,
        [100 - p, p + 10, p - 10, p + 5].filter((v) => v > 0 && v < 100).map((v) => `${v}%`), { choiceStyle: 'nums' });
    },
    function hop() {
      let a, b;
      do { a = rand(-8, 6); b = rand(2, 8) * (Math.random() < 0.4 ? -1 : 1); } while (a + b < -10 || a + b > 10);
      const dir = b > 0 ? 'right ➡️' : 'left ⬅️';
      return q(`The frog starts at <b>${a}</b> and hops ${Math.abs(b)} ${dir}. Where does it land?`, numberLine(a), a + b,
        [a - b, a + b + 1, a + b - 1, -(a + b)], { choiceStyle: 'nums' });
    },
    function coordinates() {
      let x, y;
      do { x = rand(-5, 5); y = rand(-5, 5); } while (x === 0 || y === 0);
      const f = (a, b) => `(${a}, ${b})`;
      return q('What are the coordinates of the ⭐?', coordPlane(x, y), f(x, y),
        [f(y, x), f(-x, y), f(x, -y), f(-x, -y)], { choiceStyle: 'nums' });
    },
    function area() {
      const w = rand(3, 9), h = rand(2, 6);
      if (Math.random() < 0.5) {
        return q('What is the <b>area</b> of the rectangle? (square units)', areaGrid(w, h), w * h,
          [2 * (w + h), w * h + w, w + h, w * h - h], { choiceStyle: 'nums' });
      }
      return q('What is the <b>perimeter</b> of the rectangle? (units)', areaGrid(w, h), 2 * (w + h),
        [w * h, w + h, 2 * (w + h) + 2, 2 * (w + h) - 2], { choiceStyle: 'nums' });
    },
    function compareFractions() {
      const equal = [[1, 2, 2, 4], [2, 3, 4, 6], [3, 4, 6, 8], [1, 3, 2, 6], [1, 4, 2, 8]];
      let a, b, c, d;
      if (Math.random() < 0.25) [a, b, c, d] = pick(equal);
      else {
        do {
          b = pick([2, 3, 4, 5, 6, 8]); d = pick([2, 3, 4, 5, 6, 8]);
          a = rand(1, b - 1); c = rand(1, d - 1);
        } while (a * d === b * c);
      }
      const correct = a * d === b * c ? "They're equal" : a * d > b * c ? `${a}/${b}` : `${c}/${d}`;
      return q('Which fraction is bigger?', fracBar(a, b) + fracBar(c, d), correct, [`${a}/${b}`, `${c}/${d}`, "They're equal"]);
    },
  ],
};

// ---------- PUZZLES & WORD PROBLEMS ----------
const puzzles = {
  1: [
    function wordAdd() {
      const name = pick(CONTENT.names), e = pick(['🍎', '🍓', '🎈', '🐚', '⭐']), a = rand(1, 5), b = rand(1, 4);
      return q(`${name} has ${a} ${e}. ${name} gets ${b} more. How many ${e} now?`, row(group(e, a), op('+'), group(e, b)),
        a + b, nearby(a + b, 2, 1), { choiceStyle: 'nums' });
    },
    function wordSub() {
      const e = pick(['🐦', '🦋', '🐝', '🐞']), a = rand(4, 9), b = rand(1, a - 1);
      return q(`There are ${a} ${e} on a tree. ${b} fly away. How many are left?`, group(e, a, a - b), a - b,
        nearby(a - b, 2, 0), { choiceStyle: 'nums' });
    },
    function pattern() {
      const pool = shuffle(['🔴', '🔵', '🟡', '🟢', '🟣', '⭐', '🐱', '🐶', '🍎', '🍌']);
      const kind = pick([[0, 1], [0, 1, 2], [0, 0, 1], [0, 1, 1]]);
      const seq = Array.from({ length: 7 }, (_, i) => pool[kind[i % kind.length]]);
      return q('What comes next in the pattern?', `<div class="pattern">${seq.slice(0, 6).map((s) => `<span>${s}</span>`).join('')}<span class="blank">?</span></div>`,
        seq[6], pool.slice(0, 4), { choiceStyle: 'pics' });
    },
    function countNext() {
      const step = pick([1, 1, 2, 5]), start = step === 5 ? 5 * rand(0, 3) : rand(1, 12);
      const terms = [0, 1, 2].map((i) => start + i * step);
      const ans = start + 3 * step;
      return q(`Count by ${step}s! What comes next?`, bubbles(terms), ans, [ans + 1, ans - 1, ans + step], { choiceStyle: 'nums' });
    },
  ],
  2: [
    function wordMult() {
      const [cont, conts, item, items] = pick([
        ['📦', 'boxes', '🖍️', 'crayons'], ['🧺', 'baskets', '🍎', 'apples'], ['🚌', 'buses', '🧒', 'kids'],
        ['🛍️', 'bags', '⚽', 'balls'], ['🌳', 'trees', '🐦', 'birds'], ['🚗', 'cars', '🛞', 'wheels'],
      ]);
      const n = rand(2, 6), each = cont === '🚗' ? 4 : rand(3, 9);
      return q(`There are ${n} ${conts}. Each has ${each} ${items}. How many ${items} in all?`,
        `<div class="minis">${times(n, () => `<div class="mini"><span>${cont}</span><small>${each} ${item}</small></div>`)}</div>`,
        n * each, [n * each + each, n * each - each, n + each, n * each + 1], { choiceStyle: 'nums' });
    },
    function numPattern() {
      const step = pick([2, 3, 4, 5, 10, 25, -2, -3, -5]);
      const start = step < 0 ? rand(40, 80) : rand(1, 30);
      const terms = [0, 1, 2, 3].map((i) => start + i * step);
      const ans = start + 4 * step;
      return q('Find the rule! What number comes next?', bubbles(terms), ans,
        [ans + step, ans - 1, ans + 1, terms[3] - step], { choiceStyle: 'nums' });
    },
    function missing() {
      const t = pick(['add', 'sub', 'mul', 'mul']);
      if (t === 'add') {
        const a = rand(5, 40), b = rand(5, 40);
        return q('What is the missing number?', equation(`${a} + ? = ${a + b}`), b, nearby(b, 4, 1),
          { speak: `${a} plus what equals ${a + b}?`, choiceStyle: 'nums' });
      }
      if (t === 'sub') {
        const a = rand(20, 70), b = rand(5, 19);
        return q('What is the missing number?', equation(`${a} − ? = ${a - b}`), b, nearby(b, 4, 1),
          { speak: `${a} minus what equals ${a - b}?`, choiceStyle: 'nums' });
      }
      const a = rand(2, 9), b = rand(2, 10);
      return q('What is the missing number?', equation(`${a} × ? = ${a * b}`), b, nearby(b, 3, 1),
        { speak: `${a} times what equals ${a * b}?`, choiceStyle: 'nums' });
    },
    function money() {
      const have = pick([5, 10, 20]);
      const [e, item] = pick([['🍦', 'ice cream'], ['🧃', 'juice'], ['🍪', 'cookie'], ['🎈', 'balloon'], ['📒', 'notebook'], ['🧸', 'teddy']]);
      const cost = rand(1, have - 1);
      return q(`You have $${have}. A ${item} costs $${cost}. How much money is left?`,
        row(`<div class="price">💵<b>$${have}</b></div>`, op('−'), `<div class="price">${e}<b>$${cost}</b></div>`),
        `$${have - cost}`, nearby(have - cost, 3, 0).map((v) => `$${v}`), { choiceStyle: 'nums' });
    },
  ],
  3: [
    function solveX() {
      const a = rand(2, 9), x = rand(1, 12), b = rand(1, 20), minus = Math.random() < 0.4;
      const c = minus ? a * x - b : a * x + b;
      return q('Solve for <i>x</i> ⚖️', equation(`${a}x ${minus ? '−' : '+'} ${b} = ${c}`), x, nearby(x, 3, 0),
        { speak: `Solve for x. ${a} x ${minus ? 'minus' : 'plus'} ${b} equals ${c}.`, choiceStyle: 'nums' });
    },
    function sequence() {
      const t = rand(0, 3);
      let terms;
      if (t === 0) { const a = rand(1, 4), r = rand(2, 3); terms = [0, 1, 2, 3, 4].map((i) => a * r ** i); }
      else if (t === 1) { const s = rand(1, 6); terms = [0, 1, 2, 3, 4].map((i) => (s + i) ** 2); }
      else if (t === 2) { const a = rand(1, 5); terms = [a, rand(a, a + 5)]; while (terms.length < 5) terms.push(terms.at(-1) + terms.at(-2)); }
      else { const a = rand(10, 40), d = -rand(3, 9); terms = [0, 1, 2, 3, 4].map((i) => a + i * d); }
      const ans = terms.pop();
      const diff = terms[3] - terms[2];
      return q('What number comes next?', bubbles(terms), ans, [terms[3] + diff, ans + 2, ans - 2, ans + diff], { choiceStyle: 'nums' });
    },
    function percentOff() {
      const [e, item] = pick([['🎮', 'video game'], ['👟', 'pair of sneakers'], ['🎧', 'pair of headphones'], ['🛹', 'skateboard']]);
      const price = pick([20, 40, 60, 80, 100, 120, 200]);
      const pct = pick([10, 20, 25, 50].filter((p) => (price * p) % 100 === 0));
      const off = (price * pct) / 100;
      return q(`A ${item} costs $${price}. It's ${pct}% off. What is the sale price?`,
        row(`<div class="price">${e}<b>$${price}</b></div>`, `<div class="tag">${pct}% OFF</div>`),
        `$${price - off}`, [off, price - pct, price - off + 5, price - off - 10].filter((v) => v > 0).map((v) => `$${v}`), { choiceStyle: 'nums' });
    },
    function ratio() {
      const a = rand(2, 4); let b = rand(2, 5);
      while (b === a) b = rand(2, 5);
      const k = rand(2, 5);
      return q(`For every ${a} 🐱 there are ${b} 🐶. If there are ${a * k} 🐱, how many 🐶 are there?`,
        row(group('🐱', a), op(':'), group('🐶', b)), b * k, [a * k + (b - a), b + k, b * k + b, b * k - b].filter((v) => v > 0), { choiceStyle: 'nums' });
    },
    function speed() {
      const [e, thing] = pick([['🚲', 'bike'], ['🚗', 'car'], ['🚂', 'train'], ['🐢', 'turtle']]);
      const s = thing === 'turtle' ? rand(1, 3) : thing === 'bike' ? rand(10, 20) : rand(4, 12) * 10;
      const t = rand(2, 6);
      return q(`A ${thing} travels ${s} km every hour. How far does it go in ${t} hours?`,
        `<div class="road">${times(t, () => `<span>${e}</span>`)}</div>`, `${s * t} km`,
        [s + t, s * t + s, s * (t - 1), s * t + 10].map((v) => `${v} km`), { choiceStyle: 'nums' });
    },
  ],
};

// ---------- WORDS & SOUNDS ----------
const ALPHA = 'abcdefghijklmnopqrstuvwxyz';
const VOWELS = 'aeiou';
const otherLetters = (letter, pool = ALPHA) => shuffle(pool.replace(letter, '').split('')).slice(0, 3);

function misspell(w) {
  const ops = [
    (s) => { const i = rand(0, s.length - 2); return s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2); },
    (s) => { const i = rand(1, s.length - 1); return s.slice(0, i) + s.slice(i + 1); },
    (s) => { const i = rand(1, s.length - 1); return s.slice(0, i) + s[i] + s.slice(i); },
    (s) => {
      const idx = [...s].map((c, i) => (VOWELS.includes(c) ? i : -1)).filter((i) => i >= 0);
      const i = pick(idx);
      return s.slice(0, i) + pick(VOWELS.replace(s[i], '').split('')) + s.slice(i + 1);
    },
  ];
  return pick(ops)(w);
}

const bigPic = (e) => `<div class="big-pic">${e}</div>`;

const words = {
  1: [
    function firstLetter() {
      const [w, e] = pick(CONTENT.words1);
      return q('What letter does this start with?', bigPic(e), w[0], otherLetters(w[0]),
        { speak: `What letter does ${w} start with?`, autoSpeak: true, choiceStyle: 'letters' });
    },
    function pictureWord() {
      const [w, e] = pick(CONTENT.words1);
      return q('Which word matches the picture?', bigPic(e), w, CONTENT.words1.map((x) => x[0]), { choiceStyle: 'words' });
    },
    function sightListen() {
      const w = pick(CONTENT.sightWords);
      return q('Listen 👂 Which word did you hear?', '<div class="big-pic ear">👂</div><p class="hint">Tap 🔊 to hear it again</p>', w,
        CONTENT.sightWords, { speak: w, autoSpeak: true, choiceStyle: 'words' });
    },
  ],
  2: [
    function missingLetter() {
      const [w, e] = pick(CONTENT.words2);
      const i = rand(0, w.length - 1), letter = w[i];
      const shown = `${w.slice(0, i)}<span class="blank">_</span>${w.slice(i + 1)}`;
      return q('Which letter is missing?', bigPic(e) + `<div class="spell">${shown}</div>`, letter,
        otherLetters(letter, VOWELS.includes(letter) ? VOWELS : ALPHA), { speak: `Which letter is missing in ${w}?`, choiceStyle: 'letters' });
    },
    function rhyme() {
      const fam = pick(CONTENT.rhymes);
      const [target, match] = shuffle(fam);
      const wrongs = shuffle(CONTENT.rhymes.filter((f) => f !== fam)).slice(0, 3).map((f) => pick(f));
      return q(`Which word rhymes with <b>${target}</b>?`, '', match, wrongs, { choiceStyle: 'words' });
    },
    function spelling() {
      const [w, e] = pick(CONTENT.words2);
      const wrongs = new Set();
      for (let g = 0; wrongs.size < 3 && g < 100; g++) {
        const m = misspell(w);
        if (m !== w) wrongs.add(m);
      }
      return q('Which word is spelled correctly?', bigPic(e), w, [...wrongs], { speak: `Which spelling of ${w} is correct?`, choiceStyle: 'words' });
    },
  ],
  3: [
    function synonym() {
      const [w, s] = pick(CONTENT.synonyms);
      const wrongs = CONTENT.antonyms.map((a) => a[0]).concat(CONTENT.synonyms.filter((x) => x[0] !== w).map((x) => x[1]));
      return q(`Which word means the <b>same</b> as <b>${w}</b>?`, '', s, shuffle(wrongs), { choiceStyle: 'words' });
    },
    function antonym() {
      const [w, a] = pick(CONTENT.antonyms);
      const wrongs = CONTENT.antonyms.filter((x) => x[0] !== w).map((x) => x[1]);
      return q(`Which word means the <b>opposite</b> of <b>${w}</b>?`, '', a, shuffle(wrongs), { choiceStyle: 'words' });
    },
    function prefix() {
      const [p, example, meaning] = pick(CONTENT.prefixes);
      return q(`In <b>${example}</b>, what does the prefix <b>${p}</b> mean?`, '', meaning,
        CONTENT.prefixes.map((x) => x[2]), { choiceStyle: 'words' });
    },
  ],
};

// ---------- STORY TIME ----------
function storyRound(level, lastTitle) {
  const options = CONTENT.stories[level].filter((s) => s.title !== lastTitle);
  const story = pick(options);
  return story.questions.map((x) => ({ ...q(x.q, '', x.a, x.w), story }));
}

// ---------- public API ----------
const ROUND_SIZE = 6;
const GENERATORS = { numbers, puzzles, words };

function buildRound(activity, level, lastStory) {
  if (activity === 'stories') return storyRound(level, lastStory);
  const gens = GENERATORS[activity][level];
  const seen = new Set();
  const out = [];
  for (let guard = 0; out.length < ROUND_SIZE && guard < 200; guard++) {
    const question = pick(gens)();
    const key = question.prompt + question.visual + question.speak;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(question);
  }
  return out;
}
