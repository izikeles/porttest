/* =====================================================================
   EDIT ME — project data. Fill in `live` / `github` and the buttons appear.
   ===================================================================== */
const PROJECTS = [
  { id: 'univ', c: '#ff5fa8', meta: 'Web app · Manila universities', title: 'University Foodies',
    img: 'assets/projects/university-foodies.webp', alt: 'University Foodies home screen with a big red and yellow Manila headline, search and filters',
    desc: 'A food guide for students across Manila: cheap eats near campus, in a bold red-and-yellow poster style.',
    pts: ['799 food spots across Manila campus areas', 'Search by place, food or area, plus filters', '“Open now” and Favorites toggles', '“Ask Foodie” chat assistant'],
    tags: ['HTML', 'CSS', 'JavaScript', 'Dataset'], live: 'https://university-foodie.netlify.app/', github: '' },
  { id: 'taft', c: '#2fe3a1', meta: 'Web app · Taft Avenue', title: 'Taft Foodies',
    img: 'assets/projects/taft-foodies.webp', alt: 'Taft Foodies home screen with a green header, search, filters and a burger place card',
    desc: '68 food places from Pedro Gil to Buendia. See what’s open, cheap or good for studying, then walk there.',
    pts: ['Cuisine and ₱ price level on every place', 'Live “Open now” and “Open 24 hours” badges', 'Favorites and star ratings', '“Walk there” opens Google Maps'],
    tags: ['HTML', 'CSS', 'JavaScript', 'Google Maps'], live: '', github: '' },
  { id: 'game', c: '#ffd93b', meta: 'Browser game · Volleyball edition', title: '“Know Me” Game',
    img: 'assets/projects/know-me-game.webp', pos: 'center', alt: 'Know Me game: a pixel-art volleyball court with a net, the coach, a teammate and Achilles in his cream jacket',
    desc: 'A pixel RPG-style game about my life. Walk my room, school, the court and the street, meet seven people, then challenge the teammate to a rally.',
    pts: ['Four scenes linked by doorways', 'Seven people to meet, tracked in a Dex', 'A timing-based volleyball rally with a best score', 'Saves progress, works on phones'],
    tags: ['JavaScript', 'Canvas', 'Pixel art'], play: 'game/index.html' },
  { id: 'pi', c: '#7fd2ff', meta: 'Embedded · Hardware', title: 'Raspberry Pi Prototype',
    img: 'assets/projects/raspberry-pi.webp', alt: 'Raspberry Pi prototype with a lamp and white panel inside a clear case',
    desc: 'An embedded-system build on a Raspberry Pi that combines hardware and software into one working prototype, tested to 95% accuracy.',
    stat: { label: 'Accuracy', value: 95 },
    pts: ['95% accuracy in testing', 'Hardware and code working together', 'Built and tested as a physical prototype', 'Hands-on practice for low-level thinking'],
    tags: ['Raspberry Pi', 'Python', 'Electronics'], live: '', github: '' },
  { id: 'web', c: '#a28bff', meta: 'Web design', title: 'Responsive Website', icon: 'i-html',
    desc: 'A responsive website built with clean HTML and CSS so it looks right on any screen size.',
    pts: ['Mobile-first layout', 'Clean, semantic HTML', 'Styled with modern CSS'],
    tags: ['HTML', 'CSS', 'Responsive'], live: '', github: '' },
  { id: 'py', c: '#ffb454', meta: 'Automation', title: 'Python Automation Tool', icon: 'i-py',
    desc: 'A Python program that automates repetitive tasks so they run on their own.',
    pts: ['Scripted workflow', 'Saves time on repetitive work', 'Easy to extend'],
    tags: ['Python', 'Scripting'], live: '', github: '' }
];

const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const phone = () => matchMedia('(max-width:860px)').matches;
const icon = id => `<svg class="ic" aria-hidden="true"><use href="#${id}"/></svg>`;
const meter = st => {                                     // pixel "HP bar": 20 segments, each worth 5%
  const on = Math.round(st.value / 5);
  return `<div class="meter" role="img" aria-label="${st.label}: ${st.value} percent">
    <div class="meter-top"><span>${st.label}</span><b>${st.value}%</b></div>
    <div class="bar" aria-hidden="true">${Array.from({ length: 20 }, (_, i) => `<i${i < on ? ` class="on" style="--i:${i}"` : ''}></i>`).join('')}</div>
  </div>`;
};
const keep = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} };

/* ---------- speech bubble ---------- */
const SAY = {
  bio: 'Hello! Welcome to my portfolio.',
  skills: 'This is my toolbox. It keeps growing.',
  projects: 'Pick a cartridge with the arrows, or swipe.',
  contact: 'Say hi! My inbox is open.'
};
let typer;
function say(text) {
  const b = $('#bubble'); clearInterval(typer);
  $('#bubble-sr').textContent = text;                       // screen readers get the full line once, not letter by letter
  if (reduce) { b.textContent = text; return; }
  let i = 0; b.textContent = '';
  typer = setInterval(() => { b.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(typer); }, 24);
}

/* ---------- tabs ---------- */
const tabs = $$('.tab'), panes = $$('.pane');
const currentTab = () => (tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]).dataset.tab;
function afterNav() { if (phone()) { setFold(true); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); } else if (folded) setFold(false); }
function toPanel() { if (phone()) $('#panel').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }
function show(id) {
  if (!SAY[id]) id = 'bio';
  tabs.forEach(t => { const on = t.dataset.tab === id; t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; });
  panes.forEach(p => p.hidden = p.id !== 'pane-' + id);
  say(SAY[id]);
  history.replaceState(null, '', '#' + id);
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => { show(t.dataset.tab); afterNav(); });
  t.addEventListener('keydown', e => {
    const k = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!k) return;
    e.preventDefault();
    const n = tabs[(i + k + tabs.length) % tabs.length]; n.focus(); show(n.dataset.tab);
  });
});
$$('.dpad button').forEach(b => b.addEventListener('click', () => {
  if (folded) setFold(false);
  const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true');
  show(tabs[(i + +b.dataset.d + tabs.length) % tabs.length].dataset.tab);
}));
$('.brand').addEventListener('click', e => { e.preventDefault(); if (folded) setFold(false); show('bio'); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
addEventListener('hashchange', () => { const h = location.hash.slice(1); if (SAY[h] && h !== currentTab()) show(h); });
$$('[data-go]').forEach(b => b.addEventListener('click', () => { show(b.dataset.go); afterNav(); }));

/* ---------- projects carousel ---------- */
let cur = 0;
function render(i, dir = 0) {
  cur = (i + PROJECTS.length) % PROJECTS.length;
  const p = PROJECTS[cur];
  const links = [
    p.play && `<a class="btn px grape" href="${p.play}">${icon('i-pad')}Play it</a>`,
    p.live && `<a class="btn px mint" href="${p.live}" target="_blank" rel="noopener noreferrer">${icon('i-ext')}Visit site</a>`,
    p.github && `<a class="btn px white" href="${p.github}" target="_blank" rel="noopener noreferrer">${icon('i-ext')}Code</a>`
  ].filter(Boolean).join('');
  const box = $('#pj');
  box.className = 'pj' + (dir > 0 ? ' sl-r' : dir < 0 ? ' sl-l' : '');
  box.style.animation = 'none'; box.offsetWidth; box.style.animation = '';
  box.innerHTML = `
    <div class="shot px" style="--c:${p.c}">${p.img ? `<img src="${p.img}" alt="${p.alt}" loading="lazy" decoding="async" width="900" height="900" style="object-position:${p.pos || 'top'}">` : icon(p.icon)}</div>
    <div>
      <p class="meta">${p.meta}</p><h3>${p.title}</h3><p>${p.desc}</p>
      ${p.stat ? meter(p.stat) : ''}
      <ul class="pts">${p.pts.map(x => `<li>${x}</li>`).join('')}</ul>
      <ul class="tags">${p.tags.map(x => `<li>${x}</li>`).join('')}</ul>
      ${links ? `<div class="acts">${links}</div>` : ''}
    </div>`;
  $('#count').textContent = `${cur + 1} / ${PROJECTS.length}`;
  $$('#dots button').forEach((d, i) => d.setAttribute('aria-selected', i === cur));
}
$('#dots').innerHTML = PROJECTS.map(p => `<button type="button" role="tab" style="--c:${p.c}" aria-label="${p.title}"></button>`).join('');
$$('#dots button').forEach((d, i) => d.onclick = () => render(i, i > cur ? 1 : -1));
(function swipe() {
  let x0 = null, y0 = null; const el = $('#pj');
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) render(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  }, { passive: true });
})();
$('#prev').onclick = () => render(cur - 1, -1);
$('#next').onclick = () => render(cur + 1, 1);
document.addEventListener('keydown', e => {
  if ($('#pane-projects').hidden || /INPUT|TEXTAREA/.test(document.activeElement.tagName) || document.activeElement.closest('.rail')) return;
  if (e.key === 'ArrowLeft') render(cur - 1, -1);
  if (e.key === 'ArrowRight') render(cur + 1, 1);
});

/* ---------- day / night ---------- */
const themeBtn = $('#theme');
function setTheme(mode, save) {
  document.documentElement.dataset.theme = mode;
  const night = mode === 'night';
  themeBtn.setAttribute('aria-pressed', night);
  themeBtn.setAttribute('aria-label', night ? 'Switch to day mode' : 'Switch to night mode');
  themeBtn.innerHTML = icon(night ? 'i-sun' : 'i-moon');
  const m = $('meta[name=theme-color]'); if (m) m.content = night ? '#0f1244' : '#8fd8ff';
  if (save) keep('theme', mode);
  if (typeof drawStrip === 'function') drawStrip();
}
themeBtn.addEventListener('click', () => {
  const n = document.documentElement.dataset.theme !== 'night';
  setTheme(n ? 'night' : 'day', true);
  say(n ? 'Good night! Tap my photo to tuck me in.' : SAY[currentTab()]);
});
$('.frame').addEventListener('click', e => { e.currentTarget.classList.toggle('zz'); });   // tap = sleep, for phones

/* ---------- skill filters, count-up ---------- */
$$('.chipbtn').forEach(b => b.addEventListener('click', () => {
  $$('.chipbtn').forEach(x => x.setAttribute('aria-pressed', x === b));
  $$('.skills li').forEach(li => li.hidden = b.dataset.f !== 'all' && !li.dataset.cat.split(' ').includes(b.dataset.f));
}));
function countUp() {
  $$('.stats b').forEach(el => {
    const n = +el.dataset.n, sfx = el.dataset.s || ''; if (reduce) return;
    const t0 = performance.now();
    (function step(now) { const k = Math.min(1, (now - t0) / 800); el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3))) + sfx; if (k < 1) requestAnimationFrame(step); })(t0);
  });
}

/* ---------- contact ---------- */
const MAIL = 'mendiolaachilles@gmail.com';
const mailBtn = $('#copyEmail');
mailBtn.onclick = async () => {
  const label = $('span', mailBtn), old = label.textContent;
  try { await navigator.clipboard.writeText(MAIL); label.textContent = 'Copied!'; } catch { label.textContent = MAIL; }
  setTimeout(() => label.textContent = old, 1800);
};
$('#quick').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  location.href = `mailto:${MAIL}?subject=${encodeURIComponent('Hello Achilles')}&body=${encodeURIComponent(`${f.get('msg')}\n\n— ${f.get('name')}`)}`;
});
$('#year').textContent = new Date().getFullYear();

/* ---------- foldable dex ---------- */
/* desktop: the right half swings shut on the hinge (clamshell). phone: the profile half folds up into a slim bar. */
const dex = $('.dex'), dexR = $('.dex-r'), foldBtn = $('#fold');
let folded = false, wasWide = !phone();
function shift() {                                            // when shut on desktop, slide the closed half to the middle
  if (phone()) { dex.style.removeProperty('--shift'); return; }
  dex.style.setProperty('--shift', Math.max(0, (dex.clientWidth - $('.dex-l').offsetWidth - $('.hinge').offsetWidth) / 2) + 'px');
}
function setFold(f, o = {}) {
  const w = !phone();
  folded = f;
  if (o.instant) dex.classList.add('nofx');
  dex.classList.toggle('shut', f);
  shift();
  if (o.instant) { void dex.offsetWidth; dex.classList.remove('nofx'); }
  dexR.inert = f && w;
  foldBtn.setAttribute('aria-expanded', String(!f));
  foldBtn.setAttribute('aria-label', w ? (f ? 'Open the dex' : 'Close the dex') : (f ? 'Unfold profile' : 'Fold profile'));
  foldBtn.innerHTML = w ? `${icon(f ? 'i-right' : 'i-left')}<span>${f ? 'Open' : 'Close'}</span>` : `${icon(f ? 'i-down' : 'i-up')}<span>${f ? 'Unfold' : 'Fold'}</span>`;
  if (!o.instant) say(w && f ? 'Tap OPEN to flip me open.' : SAY[currentTab()]);
}
foldBtn.addEventListener('click', () => setFold(!folded));
addEventListener('resize', () => {
  const w = !phone();
  if (w !== wasWide) { wasWide = w; setFold(false, { instant: true }); } else shift();
});

/* ---------- tap sparkles + swipe between tabs (phone) ---------- */
if (!reduce) document.addEventListener('pointerdown', e => {
  const t = e.target.closest('.btn,.tab,.round,.gbtn,.chipbtn,.dpad button'); if (!t) return;
  for (let i = 0; i < 7; i++) {
    const s = document.createElement('i'), a = Math.PI * 2 * i / 7 + Math.random() * .6, d = 24 + Math.random() * 20;
    s.className = 'spark';
    s.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px;--c:${['#ffd93b', '#ff5fa8', '#2fe3a1', '#fff'][i % 4]}`;
    document.body.appendChild(s); setTimeout(() => s.remove(), 600);
  }
});
(function swipeTabs() {
  let x0 = null, y0 = null; const el = $('#panel');
  el.addEventListener('touchstart', e => { x0 = e.target.closest('#pj,input,textarea,.filters') ? null : e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 == null || !phone()) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.8) return;
    const i = tabs.findIndex(t => t.getAttribute('aria-selected') === 'true'), n = i + (dx < 0 ? 1 : -1);
    if (n >= 0 && n < tabs.length) show(tabs[n].dataset.tab);
  }, { passive: true });
})();

/* ---------- footer: Achilles and a teammate rally a volleyball over the net ---------- */
let drawStrip;
(function () {
  const cv = $('#strip'), c = cv.getContext('2d'), S = 3, H = 52, GY = H - 5;     // ground line
  const me = { x: 70, pal: Sprite.PALS.me, dir: 'r', hop: 0, mv: 0 }, mate = { x: 400, pal: Sprite.PALS.kid, dir: 'l', hop: 0, mv: 0 };
  const ball = { t: 0, dur: 90, fx: 0, tx: 0, peak: 24, to: me };
  let W, t = 0;
  const net = () => Math.round(W / 2);
  const fit = () => { W = Math.ceil(innerWidth / S); cv.width = W; cv.height = H; c.imageSmoothingEnabled = false; me.x = Math.max(14, Math.min(me.x, net() - 24)); mate.x = Math.min(W - 14, Math.max(mate.x, net() + 24)); if (!ball.fx) { ball.fx = mate.x; ball.tx = me.x; } };
  const night = () => document.documentElement.dataset.theme === 'night';
  const lerp = (a, b, k) => a + (b - a) * k;
  const bpos = () => { const k = ball.t / ball.dur; return { x: lerp(ball.fx, ball.tx, k), y: GY - 14 - Math.sin(Math.PI * k) * ball.peak }; };

  drawStrip = function () {
    if (!W) return;
    const n = night();
    c.clearRect(0, 0, W, H);
    c.fillStyle = n ? '#1a6f4b' : '#2fc77a'; c.fillRect(0, GY, W, H - GY);
    c.fillStyle = n ? '#14573b' : '#25a862'; c.fillRect(0, GY, W, 1);
    for (let i = 5; i < W; i += 13) c.fillRect(i, GY + 2 + (i % 3), 1, 2);
    for (let i = 23; i < W; i += 71) { c.fillStyle = i % 2 ? '#ff5fa8' : '#ffd93b'; c.fillRect(i, GY + 1, 2, 2); }
    // net
    const nx = net();
    c.fillStyle = n ? '#8a8fb8' : '#2b2d42'; c.fillRect(nx - 14, GY - 30, 1, 30); c.fillRect(nx + 14, GY - 30, 1, 30);
    c.fillStyle = 'rgba(255,255,255,.75)';
    for (let y = GY - 28; y < GY - 6; y += 2) c.fillRect(nx - 13, y, 27, 1);
    for (let x = nx - 13; x < nx + 14; x += 3) c.fillRect(x, GY - 28, 1, 22);
    c.fillStyle = '#fff'; c.fillRect(nx - 14, GY - 30, 29, 2);
    // players + ball
    [me, mate].forEach(p => {
      c.fillStyle = 'rgba(36,26,69,.28)'; c.fillRect(Math.round(p.x) - 5, GY - 1, 10, 2);
      const step = reduce ? 0 : (p.mv ? [0, 1, 0, 3][Math.floor(t / 6) % 4] : 0);
      c.drawImage(Sprite.person(p.pal, p.dir, step), Math.round(p.x) - Sprite.AX, Math.round(GY + 1 - Sprite.AY - p.hop));
    });
    const b = bpos();
    c.fillStyle = 'rgba(36,26,69,.25)'; c.fillRect(Math.round(b.x) - 4, GY, 8, 1);
    c.drawImage(Sprite.ball(), Math.round(b.x) - 5, Math.round(b.y) - 5);
  };

  function relaunch() {                                    // the receiver hits it back to the other side
    const from = ball.to, other = from === me ? mate : me, left = other === me;
    from.hop = 7;
    ball.fx = ball.tx; ball.t = 0; ball.dur = 80 + Math.random() * 40; ball.peak = 22 + Math.random() * 6;
    const lo = left ? 14 : net() + 22, hi = left ? net() - 22 : W - 14;
    ball.tx = Math.min(hi, Math.max(lo, other.x + (Math.random() - .5) * 70)); ball.to = other;
  }
  let onScreen = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(e => { onScreen = e[0].isIntersecting; }).observe(cv);
  function tick() {
    if (!document.hidden && onScreen) {
      t++; ball.t++;
      [me, mate].forEach(p => {
        const target = ball.to === p ? ball.tx : (p === me ? W * .18 : W * .82);
        const d = target - p.x; p.mv = Math.abs(d) > 1.2 ? 1 : 0; p.x += Math.max(-.9, Math.min(.9, d));
        p.hop = Math.max(0, p.hop - (p.hop > 0 ? .35 : 0));
      });
      if (ball.t >= ball.dur) relaunch();
      drawStrip();
    }
    requestAnimationFrame(tick);
  }
  fit(); addEventListener('resize', () => { fit(); drawStrip(); });
  drawStrip();
  if (!reduce) requestAnimationFrame(tick);
})();

/* ---------- start ---------- */
render(0);
setTheme(keep('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'), false);
countUp();
const q = new URLSearchParams(location.search);
const startTab = q.get('tab') || location.hash.slice(1);
if (q.get('p')) { const i = PROJECTS.findIndex(p => p.id === q.get('p')); if (i > -1) render(i); }
show(SAY[startTab] ? startTab : 'bio');
if (q.get('tab') && phone()) setFold(true, { instant: true });
else if (!phone() && !reduce) { setFold(true, { instant: true }); setTimeout(() => setFold(false), 700); }   // intro: the dex opens like a clamshell
else setFold(false, { instant: true });
