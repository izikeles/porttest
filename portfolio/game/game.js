/* =====================================================================
   KNOW ME — Volleyball Edition. A tiny pixel RPG about Achilles.
   Everything you might want to edit (people, lines, objects) is in the
   SCENES section below.
   Sprites come from ../sprites.js.
   ===================================================================== */
(() => {
  const W = 320, H = 192;
  const cv = document.getElementById('cv'), c = cv.getContext('2d');
  c.imageSmoothingEnabled = false;
  const $ = id => document.getElementById(id);
  const R = (g, x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  const go = url => () => { location.href = url; };
  const PAL = Sprite.PALS;
  const touch = matchMedia('(pointer:coarse)').matches || matchMedia('(any-pointer:coarse)').matches || navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  const REDUCED = matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (touch) document.documentElement.classList.add('touch');
  const ACT = touch ? 'Tap A' : 'Press E';
  const FONT = '"Pixelify Sans","Trebuchet MS",monospace';

  /* ---------- tiny helpers: storage + sound ---------- */
  const keep = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} };
  let AC = null, muted = keep('knowme-mute') === '1';
  function sfx(f1, f2, dur, type = 'square', vol = 0.04) {
    if (muted) return;
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      if (AC.state === 'suspended') AC.resume();
      const o = AC.createOscillator(), g = AC.createGain(), n = AC.currentTime;
      o.type = type; o.frequency.setValueAtTime(f1, n); o.frequency.exponentialRampToValueAtTime(Math.max(30, f2), n + dur);
      g.gain.setValueAtTime(vol, n); g.gain.exponentialRampToValueAtTime(0.001, n + dur);
      o.connect(g); g.connect(AC.destination); o.start(); o.stop(n + dur);
    } catch (e) {}
  }

  /* ---------- background helpers ---------- */
  function doorway(g, side, y0, y1, col) {
    const h = y1 - y0, x = side === 'r' ? W - 14 : 0;
    R(g, x, y0, 14, h, col);
    R(g, side === 'r' ? W - 16 : 14, y0 - 2, 2, h + 4, '#241a45');
    for (let j = 0; j < 7; j++) {
      const d = 3 - Math.abs(j - 3), px = side === 'r' ? W - 11 + d * 2 : 3 + (3 - d) * 2;
      R(g, px, y0 + h / 2 - 7 + j * 2, 2, 2, '#241a45');
    }
  }
  const tree = (g, x, y) => { R(g, x + 6, y + 16, 4, 12, '#7a4a2a'); R(g, x, y + 4, 16, 14, '#2fb872'); R(g, x + 3, y, 10, 6, '#2fb872'); R(g, x + 4, y + 6, 4, 4, '#5ee6a0'); };
  const sdesk = (g, x, y) => { R(g, x, y, 40, 8, '#e6c28f'); R(g, x + 2, y + 8, 36, 6, '#b88a50'); R(g, x + 12, y + 16, 16, 10, '#6b4cff'); R(g, x + 6, y - 3, 10, 3, '#ff5fa8'); };
  const tuft = (g, x, y) => { R(g, x, y + 3, 7, 3, '#1f8f55'); R(g, x + 1, y, 1, 4, '#2fb872'); R(g, x + 3, y - 2, 1, 6, '#2fb872'); R(g, x + 5, y + 1, 1, 4, '#2fb872'); };

  /* ---------- SCENES ---------- */
  const SCENES = [
    { name: 'My Room', wall: 60, right: 1, door: { r: [88, 140] }, doorCol: '#ffeaa0',
      draw(g) {
        R(g, 0, 0, W, 58, '#cdbfff'); R(g, 0, 36, W, 22, '#b8a6ff'); R(g, 0, 36, W, 2, '#9c86f0'); R(g, 0, 56, W, 4, '#7a63d9');
        R(g, 0, 60, W, H - 60, '#e8b47c');
        for (let y = 60; y < H; y += 16) { R(g, 0, y, W, 1, '#d39a62'); for (let x = ((y - 60) / 16 % 2) * 24; x < W; x += 48) R(g, x, y, 1, 16, '#d39a62'); }
        R(g, 136, 8, 56, 34, '#fff'); R(g, 140, 12, 48, 26, '#8fd8ff'); R(g, 140, 12, 48, 9, '#b9e8ff'); R(g, 162, 12, 4, 26, '#fff'); R(g, 140, 24, 48, 3, '#fff'); R(g, 146, 15, 12, 3, '#fff'); R(g, 170, 18, 10, 3, '#fff');
        R(g, 22, 10, 26, 32, '#ff5fa8'); R(g, 25, 13, 20, 26, '#fff1f8'); R(g, 32, 19, 6, 6, '#ffd93b'); R(g, 28, 29, 14, 2, '#6b4cff'); R(g, 28, 33, 10, 2, '#6b4cff');
        R(g, 222, 12, 22, 28, '#2fe3a1'); R(g, 225, 15, 16, 22, '#fff'); R(g, 228, 19, 10, 3, '#241a45'); R(g, 228, 25, 7, 3, '#241a45'); R(g, 228, 31, 10, 3, '#241a45');
        R(g, 100, 118, 130, 58, '#6b4cff'); R(g, 104, 122, 122, 50, '#8c74ff');
        for (let x = 112; x < 220; x += 16) { R(g, x, 130, 4, 4, '#ffd93b'); R(g, x + 8, 160, 4, 4, '#ffd93b'); }
        // computer desk
        R(g, 104, 62, 112, 8, '#c58d57'); R(g, 104, 70, 112, 12, '#a8723f'); R(g, 108, 82, 5, 6, '#7a4a2a'); R(g, 207, 82, 5, 6, '#7a4a2a');
        R(g, 134, 34, 50, 30, '#241a45'); R(g, 137, 37, 44, 22, '#4cc9f0'); R(g, 141, 41, 18, 2, '#fff'); R(g, 141, 46, 28, 2, '#ffd93b'); R(g, 141, 51, 14, 2, '#fff'); R(g, 155, 64, 10, 3, '#241a45');
        R(g, 142, 64, 36, 3, '#fff'); R(g, 194, 38, 16, 24, '#e9e4ff'); R(g, 197, 42, 10, 2, '#2fe3a1'); R(g, 112, 56, 8, 6, '#ff5fa8');
        R(g, 148, 86, 24, 18, '#ff5fa8'); R(g, 150, 80, 20, 7, '#e04a90');
        // pi desk
        R(g, 14, 62, 74, 8, '#c58d57'); R(g, 14, 70, 74, 10, '#a8723f'); R(g, 18, 80, 5, 4, '#7a4a2a'); R(g, 78, 80, 5, 4, '#7a4a2a');
        R(g, 26, 50, 24, 13, '#1f8a4c'); R(g, 29, 52, 7, 5, '#c0c8d0'); R(g, 38, 53, 9, 2, '#ffd93b'); R(g, 38, 58, 9, 2, '#ffd93b'); R(g, 62, 40, 3, 22, '#555'); R(g, 56, 36, 15, 6, '#ffd93b');
        // bookshelf
        R(g, 244, 14, 56, 58, '#7a4a2a'); R(g, 247, 17, 50, 52, '#4a2e1a');
        const bc = ['#ff5fa8', '#ffd93b', '#2fe3a1', '#6b4cff', '#4cc9f0', '#ff8a3d'];
        [17, 34, 51].forEach((y, r) => { R(g, 247, y + 15, 50, 2, '#7a4a2a'); for (let i = 0; i < 9; i++) { const h = 9 + ((i * 5 + r * 3) % 6); R(g, 249 + i * 5, y + 15 - h, 4, h, bc[(i + r * 2) % 6]); } });
        // bed + plant
        R(g, 236, 134, 64, 52, '#7a4a2a'); R(g, 240, 138, 56, 44, '#9fd6ff'); R(g, 244, 141, 24, 12, '#fff'); R(g, 240, 156, 56, 26, '#ff5fa8'); R(g, 240, 156, 56, 3, '#ff8fc4');
        R(g, 24, 160, 14, 12, '#e0703a'); R(g, 22, 142, 18, 18, '#2fb872'); R(g, 26, 138, 10, 8, '#2fb872'); R(g, 26, 146, 4, 4, '#5ee6a0');
        // my volleyball
        R(g, 52, 173, 13, 3, 'rgba(36,26,69,.25)'); g.drawImage(Sprite.ball(), 53, 163);
      },
      objs: [
        { r: [104, 36, 112, 46], solid: true, label: 'Use the computer', use: () => talk('Achilles', ['You selected my computer — would you like to explore my web projects?!'], { choices: [{ t: 'Login', cls: 'ok', do: go('../index.html?tab=projects') }, { t: 'Cancel', cls: 'no' }] }) },
        { r: [244, 14, 56, 58], solid: true, label: 'Check the bookshelf', use: () => talk('Bookshelf', ['Java, Python, C, C++, HTML, CSS, JavaScript — and a Raspberry Pi. That’s the whole toolbox.'], { choices: [{ t: 'See skills', cls: 'ok', do: go('../index.html?tab=skills') }, { t: 'Close', cls: 'no' }] }) },
        { r: [14, 36, 74, 46], solid: true, label: 'Look at the Pi desk', use: () => talk('Raspberry Pi', ['A Raspberry Pi prototype: hardware and code working together as one build.'], { choices: [{ t: 'See project', cls: 'ok', do: go('../index.html?tab=projects&p=pi') }, { t: 'Close', cls: 'no' }] }) },
        { r: [236, 134, 64, 52], solid: true, label: 'Look at the bed', use: () => talk('Bed', ['Zzz… even developers need sleep.', 'Proof: hover over my photo on the portfolio page.']) },
        { r: [52, 164, 13, 12], solid: true, label: 'Look at the volleyball', use: () => talk('Volleyball', ['My volleyball. It sits next to my keyboard, just in case a game breaks out.']) },
        { r: [22, 138, 20, 34], solid: true }
      ],
      npcs: [{ id: 'cat', name: 'Byte the cat', cat: true, x: 78, y: 134, lines: ['Mrrp.', 'Translation: you’re in Achilles’ room, and the real work happens at that computer.', 'He’s a programmer. Java, Python, C, C++, HTML, CSS and JavaScript.'] }]
    },

    { name: 'School', wall: 60, left: 0, right: 2, door: { l: [96, 140], r: [96, 140] }, doorCol: '#f6e2a0',
      draw(g) {
        R(g, 0, 0, W, 58, '#ffe39a'); R(g, 0, 38, W, 20, '#f4cf6d'); R(g, 0, 56, W, 4, '#c79a3a');
        for (let y = 60; y < H; y += 16) for (let x = 0; x < W; x += 16) R(g, x, y, 16, 16, (x / 16 + (y - 60) / 16) % 2 ? '#d9efff' : '#bfe0f7');
        R(g, 52, 6, 158, 44, '#7a5230'); R(g, 56, 10, 150, 36, '#2e6b5a'); R(g, 56, 46, 150, 3, '#d9b27a');
        R(g, 64, 16, 44, 2, '#fff'); R(g, 64, 24, 70, 2, '#ffd93b'); R(g, 64, 32, 30, 2, '#fff'); R(g, 160, 16, 3, 14, '#fff'); R(g, 170, 18, 22, 2, '#ff8fb8'); R(g, 170, 26, 12, 2, '#fff');
        R(g, 232, 10, 20, 20, '#241a45'); R(g, 234, 12, 16, 16, '#fff'); R(g, 241, 14, 2, 7, '#241a45'); R(g, 241, 20, 6, 2, '#ff5fa8');
        R(g, 266, 12, 26, 30, '#6b4cff'); R(g, 269, 15, 20, 24, '#ffd93b'); R(g, 277, 22, 4, 12, '#6b4cff'); R(g, 273, 26, 12, 4, '#6b4cff');
        R(g, 72, 60, 64, 10, '#d9a066'); R(g, 72, 70, 64, 14, '#a8723f'); R(g, 78, 55, 12, 6, '#ff5fa8'); R(g, 92, 57, 8, 4, '#2fe3a1'); R(g, 120, 56, 6, 5, '#e5484d');
        [[40, 112], [112, 112], [184, 112], [76, 152], [148, 152], [220, 152]].forEach(([x, y]) => sdesk(g, x, y));
      },
      objs: [
        { r: [72, 58, 64, 26], solid: true },
        { r: [52, 6, 158, 54], label: 'Read the blackboard', use: () => talk('Blackboard', ['Today’s lesson: logic first, then make it look good.']) },
        ...[[40, 112], [112, 112], [184, 112], [76, 152], [148, 152], [220, 152]].map(([x, y]) => ({ r: [x, y, 40, 14], solid: true }))
      ],
      npcs: [
        { id: 'teacher', name: 'Teacher', pal: PAL.teacher, x: 160, y: 92, dir: 'l', lines: ['Ah, you’re here about Achilles?', 'Logic first, then make it look good. That’s how he approaches every project.', 'He’s working toward being strong on both the front end and the back end.'] },
        { id: 'blaire', name: 'Blaire', pal: PAL.blaire, x: 262, y: 134, dir: 'l', lines: [
          'He is a hardworking and determined person who always gives his best when he sets his mind to something.',
          'When he wants to achieve a goal, he is willing to put in the effort and do what it takes to make it happen.',
          'He is naturally creative and enjoys making things, especially when he can be hands-on and bring his ideas to life.',
          'He is also good at communicating with others and knows how to connect with different people.',
          'Aside from these qualities, he has a great sense of humor and enjoys making people laugh, bringing a positive and lively energy to the people around him.',
          'His determination, creativity, and ability to work well with others make him someone who is always willing to learn, take on challenges, and turn his ideas into reality.'
        ] }
      ]
    },

    /* ---------- the volleyball court ---------- */
    { name: 'Volleyball Court', wall: 62, left: 1, right: 3, door: { l: [132, 172], r: [132, 172] }, doorCol: '#f8a46c',
      draw(g) {
        // gym wall
        R(g, 0, 0, W, 62, '#efe3c6');
        for (let y = 0; y < 44; y += 8) { R(g, 0, y + 7, W, 1, '#dccca6'); for (let x = ((y / 8) % 2) * 12; x < W; x += 24) R(g, x, y, 1, 8, '#dccca6'); }
        R(g, 0, 44, W, 14, '#3a6fb5'); R(g, 0, 44, W, 2, '#6a9be0'); R(g, 0, 58, W, 4, '#8a6f3f');
        [[18, 8], [58, 8]].forEach(([x, y]) => { R(g, x, y, 32, 24, '#fff'); R(g, x + 3, y + 3, 26, 18, '#8fd8ff'); R(g, x + 3, y + 3, 26, 6, '#b9e8ff'); R(g, x + 15, y + 3, 2, 18, '#fff'); });
        R(g, 130, 8, 60, 32, '#241a45'); R(g, 133, 11, 54, 26, '#1b2a5c');            // scoreboard
        R(g, 138, 16, 14, 16, '#ffd93b'); R(g, 142, 20, 6, 3, '#1b2a5c'); R(g, 142, 26, 6, 3, '#1b2a5c'); R(g, 148, 20, 0, 0, '#000');
        R(g, 168, 16, 14, 16, '#ff5fa8'); R(g, 172, 20, 6, 3, '#1b2a5c'); R(g, 172, 26, 6, 3, '#1b2a5c');
        R(g, 158, 20, 4, 4, '#fff'); R(g, 158, 27, 4, 4, '#fff');
        R(g, 232, 8, 62, 34, '#e5484d'); R(g, 232, 8, 62, 4, '#ff7a7f'); R(g, 238, 16, 50, 3, '#fff'); R(g, 238, 24, 34, 3, '#ffd93b'); g.drawImage(Sprite.ball(), 274, 22);
        // wooden floor
        R(g, 0, 62, W, H - 62, '#d9aa6a');
        for (let y = 62; y < H; y += 10) { R(g, 0, y, W, 1, '#c2924f'); for (let x = ((y - 62) / 10 % 2) * 20; x < W; x += 40) R(g, x, y, 1, 10, '#c2924f'); }
        // court: blue back zones, orange attack zones
        R(g, 24, 80, 272, 100, '#3f8fd6'); R(g, 112, 80, 96, 100, '#f0a050');
        const L = '#ffffff';
        R(g, 24, 80, 272, 2, L); R(g, 24, 178, 272, 2, L); R(g, 24, 80, 2, 100, L); R(g, 294, 80, 2, 100, L);
        R(g, 111, 80, 2, 100, L); R(g, 207, 80, 2, 100, L); R(g, 159, 80, 2, 100, L);
        // net (seen from above) and posts
        R(g, 163, 82, 3, 96, 'rgba(36,26,69,.28)');
        for (let y = 82; y < 178; y += 3) R(g, 155, y, 10, 1, 'rgba(255,255,255,.6)');
        for (let x = 156; x < 165; x += 3) R(g, x, 82, 1, 96, 'rgba(255,255,255,.35)');
        R(g, 158, 82, 4, 96, '#f6f6f6'); R(g, 158, 82, 1, 96, '#cfd6e6');
        R(g, 154, 74, 12, 10, '#2b2d42'); R(g, 156, 75, 8, 3, '#7b809b'); R(g, 154, 176, 12, 10, '#2b2d42'); R(g, 156, 177, 8, 3, '#7b809b');
        R(g, 164, 82, 1, 8, '#e5484d'); R(g, 164, 170, 1, 8, '#e5484d');
        // loose ball + ball shadow
        R(g, 196, 166, 13, 3, 'rgba(36,26,69,.3)'); g.drawImage(Sprite.ball(), 197, 155);
        // bench
        R(g, 36, 184, 52, 6, '#7a4a2a'); R(g, 36, 184, 52, 2, '#a8723f'); R(g, 44, 180, 5, 4, '#4cc9f0'); R(g, 54, 180, 5, 4, '#ffd93b');
      },
      objs: [
        { r: [130, 8, 60, 52], label: 'Check the scoreboard', use: () => talk('Scoreboard', ['Languages: 7  ·  Projects built: 4  ·  Food guides shipped: 2']) },
        { r: [154, 74, 12, 112], solid: true, label: 'Look at the net', use: () => talk('Net', ['Regulation men’s net height is 2.43 m. Up here it just keeps the two sides apart.']) },
        { r: [197, 156, 11, 11], solid: true, label: 'Look at the ball', use: () => talk('Volleyball', ['A loose ball. Somebody left it mid-rally.']) },
        { r: [36, 180, 52, 10], solid: true }
      ],
      npcs: [
        { id: 'kid', name: 'Teammate', pal: PAL.kid, x: 108, y: 150, dir: 'd', lines: ['New face on the court! …Oh, you’re here about Achilles.', 'Check the scoreboard. That’s his stat line.', 'He also built a Raspberry Pi prototype: hardware and code in one working thing.', 'Enough talking. Want a rally? Hit A when the ball reaches the ring.'], choices: [{ t: 'Rally!', cls: 'ok', do: () => startRally() }, { t: 'Later', cls: 'no' }] },
        { id: 'coach', name: 'Coach', pal: PAL.coach, x: 236, y: 118, dir: 'l', lines: ['He cares how things look, too: themes, animation, layouts that work on a phone.', 'And he’s learning security. Hashed passwords, secrets kept on the backend.'] }
      ]
    },

    { name: 'The Street', wall: 96, left: 2, door: { l: [150, 186] }, doorCol: '#6c6886',
      draw(g) {
        R(g, 0, 0, W, 40, '#8fd8ff'); R(g, 0, 40, W, 56, '#b7e6ff'); R(g, 30, 14, 30, 5, '#fff'); R(g, 34, 10, 16, 5, '#fff'); R(g, 200, 24, 36, 5, '#fff'); R(g, 206, 20, 18, 5, '#fff');
        for (let x = 0; x < W; x += 4) { const h = Math.round(22 + Math.abs(((x + 30) % 120) - 60) * 0.55 + 6 * Math.sin(x / 17)); R(g, x, 90 - h, 4, h, '#8aa6d8'); }
        R(g, 34, 4, 64, 4, '#a9a2c4'); R(g, 36, 8, 60, 84, '#d7d2e6'); R(g, 116, 16, 56, 4, '#c7b8a2'); R(g, 118, 20, 52, 72, '#e6d9c8');
        for (let y = 14; y < 84; y += 14) { for (let x = 42; x < 92; x += 12) R(g, x, y, 6, 8, '#7ea4d8'); if (y > 22) for (let x = 124; x < 166; x += 12) R(g, x, y, 6, 8, '#7ea4d8'); }
        tree(g, 6, 64); tree(g, 196, 62);
        R(g, 228, 52, 86, 44, '#f4a261'); R(g, 262, 64, 16, 32, '#7a4a2a'); R(g, 236, 62, 20, 18, '#bfe9ff'); R(g, 238, 76, 16, 3, '#ff5fa8'); R(g, 288, 62, 20, 18, '#bfe9ff'); R(g, 291, 70, 14, 3, '#2fe3a1');
        for (let i = 0; i < 11; i++) R(g, 224 + i * 8, 46, 8, 14, i % 2 ? '#fff' : '#e5484d'); R(g, 236, 24, 64, 18, '#241a45'); R(g, 238, 26, 60, 14, '#2fb7e0');
        g.fillStyle = '#fff'; g.font = '600 9px ' + FONT; g.textAlign = 'center'; g.fillText('SARI-SARI', 268, 37);
        R(g, 0, 88, W, 31, '#e6e0d3'); for (let x = 0; x < W; x += 24) R(g, x, 90, 1, 27, '#d4cdbd'); R(g, 0, 116, W, 3, '#bdb6a6');
        R(g, 0, 119, W, H - 119, '#5a5672'); for (let x = 6; x < W; x += 28) R(g, x, 162, 14, 3, '#ffd93b');
        for (let i = 0; i < 6; i++) R(g, 142 + i * 10, 119, 6, 73, '#fff');
        R(g, 28, 108, 84, 10, '#ffd93b'); R(g, 24, 116, 92, 34, '#e5484d');
        [32, 52, 72, 92].forEach(x => R(g, x, 120, 14, 12, '#bfe9ff')); R(g, 24, 138, 92, 4, '#ffd93b'); R(g, 112, 126, 6, 14, '#c23a3f'); R(g, 20, 144, 4, 6, '#ccc');
        R(g, 34, 146, 14, 12, '#241a45'); R(g, 90, 146, 14, 12, '#241a45'); R(g, 38, 150, 6, 4, '#aaa'); R(g, 94, 150, 6, 4, '#aaa'); R(g, 50, 110, 28, 6, '#fff');
        R(g, 290, 164, 3, 14, '#555'); R(g, 284, 148, 16, 18, '#2fb7e0'); R(g, 288, 154, 8, 3, '#241a45'); R(g, 296, 150, 6, 4, '#e5484d');
        tuft(g, 8, 96); tuft(g, 190, 98); tuft(g, 212, 100); tuft(g, 306, 100);
      },
      objs: [
        { r: [24, 108, 92, 50], solid: true, label: 'Read the route sign', use: () => talk('Jeepney', ['Route: Taft Avenue, and every cheap eat along it.', '(Taft Foodies lists 68 stops.)']) },
        { r: [224, 44, 94, 52], label: 'Peek into the store', use: () => talk('Sari-sari store', ['The original neighborhood app: it has what you need, right when you need it.']) },
        { r: [284, 148, 16, 30], solid: true, label: 'Open the mailbox', use: () => talk('Mailbox', ['mendiolaachilles@gmail.com — want to write to him?'], { choices: [{ t: 'Contact page', cls: 'ok', do: go('../index.html?tab=contact') }, { t: 'Not now', cls: 'no' }] }) }
      ],
      npcs: [
        { id: 'owner', name: 'Store owner', pal: PAL.owner, x: 252, y: 110, dir: 'd', lines: ['Students ask me where to eat all day long.', 'Now I send them to Taft Foodies: 68 places from Pedro Gil to Buendia, with open-now badges.', 'Achilles made it.'] },
        { id: 'driver', name: 'Jeepney driver', pal: PAL.driver, x: 130, y: 146, dir: 'l', lines: ['Next stop: his inbox!', 'Drop him a message. He says it’s open, and the mailbox is right over there.'] }
      ]
    }
  ];
  SCENES.forEach(s => { s.solids = [[0, 0, W, s.wall]].concat(s.objs.filter(o => o.solid).map(o => o.r)); });
  const TOTAL = SCENES.reduce((n, s) => n + s.npcs.length, 0);

  /* ---------- state ---------- */
  const P = { x: 160, y: 108, dir: 'd', walk: 0, moving: false };
  const K = { left: 0, right: 0, up: 0, down: 0 };
  let saved = []; try { saved = JSON.parse(keep('knowme-met') || '[]'); } catch (e) {}
  const met = new Set(saved);
  let best = +keep('knowme-best') || 0;
  let mode = 'world', S = SCENES[0], cur = 0, D = null, busy = false, near = null, t = 0, finale = false, idleKey = '', dexOpen = false, RL = null;
  let banner = { text: '', t: 0 };
  const TIP = 'Walk around and meet the people in my life. Look out for the yellow !';
  const srEl = $('sr');
  let sayShown = '';
  const setSay = t => { if (t !== sayShown) { sayShown = t; sayEl.textContent = t; } };      // don't touch the DOM every frame
  const actBtn = $('act'), dlg = $('dialog'), who = $('who'), sayEl = $('say'), choicesEl = $('choices'), fade = $('fade'), more = $('more');
  const faceBox = $('faceBox'), faceCv = $('face'), fg = faceCv.getContext('2d');
  fg.imageSmoothingEnabled = false;

  function build(s) {
    s.bg = document.createElement('canvas'); s.bg.width = W; s.bg.height = H;
    const g = s.bg.getContext('2d'); g.imageSmoothingEnabled = false; s.draw(g);
    if (s.door.l) doorway(g, 'l', s.door.l[0], s.door.l[1], s.doorCol);
    if (s.door.r) doorway(g, 'r', s.door.r[0], s.door.r[1], s.doorCol);
  }
  if (document.fonts) document.fonts.ready.then(() => SCENES.forEach(s => s.bg = null));

  /* ---------- dialogue portraits: my real photo (pixelated) for Achilles, sprite faces for everyone else ---------- */
  const photo = new Image(); photo.onload = () => { if (D) setFace(D.name); }; photo.src = '../assets/img/me.webp';
    const FACES = {}; SCENES.forEach(s => s.npcs.forEach(n => { if (n.pal) FACES[n.name] = n.pal; }));
  function setFace(name) {
    fg.clearRect(0, 0, 64, 64);
    if (name === 'Achilles' && photo.complete && photo.naturalWidth) {
      fg.imageSmoothingEnabled = true;
      fg.drawImage(photo, 90, 20, 420, 420, 0, 0, 64, 64);          // real photo, cropped around the face
      fg.imageSmoothingEnabled = false;
      faceBox.hidden = false; return;
    }
    if (FACES[name]) { R(fg, 0, 0, 64, 64, '#e6f1ff'); fg.drawImage(Sprite.face(FACES[name]), 0, 6, 64, 52); faceBox.hidden = false; return; }
    if (name === 'Byte the cat') { R(fg, 0, 0, 64, 64, '#e6f1ff'); fg.drawImage(Sprite.cat(), 8, 8, 48, 48); faceBox.hidden = false; return; }
    faceBox.hidden = true;
  }

  /* ---------- dialogue ---------- */
  function talk(name, lines, o = {}) {
    D = { name, lines, i: 0, ch: 0, done: false, o }; who.textContent = name; choicesEl.innerHTML = '';
    choicesEl.classList.toggle('menu', !!o.menu); more.hidden = true; idleKey = ''; setFace(name);
    reserve(lines); pop();
  }
  function pop() { dlg.classList.remove('pop'); void dlg.offsetWidth; dlg.classList.add('pop'); }
  function reserve(lines) {                       // size the text area to the longest line so the box (and the controls below it) never jump
    sayEl.style.minHeight = ''; let h = 0;
    lines.forEach(l => { sayEl.textContent = l; h = Math.max(h, sayEl.offsetHeight); });
    sayEl.textContent = ''; sayShown = ''; sayEl.style.minHeight = h + 'px';
  }
  function finishLine() {
    D.ch = D.lines[D.i].length; D.done = true;
    if (D.i === D.lines.length - 1 && D.o.choices) {
      D.o.choices.forEach(ch => {
        const b = document.createElement('button'); b.type = 'button'; b.className = ch.cls || 'ok'; b.textContent = ch.t;
        b.onclick = e => { e.stopPropagation(); closeDlg(); ch.do && ch.do(); };
        choicesEl.appendChild(b);
      });
      choicesEl.firstChild.focus({ preventScroll: true });
    } else more.hidden = false;
  }
  function advance() {
    if (!D) return; sfx(520, 700, 0.06);
    if (!D.done) return finishLine();
    if (D.i < D.lines.length - 1) { D.i++; D.ch = 0; D.done = false; more.hidden = true; return; }
    if (!D.o.choices) closeDlg();
  }
  function closeDlg() { const end = D && D.o.end; D = null; sayEl.style.minHeight = ''; faceBox.classList.remove('talking'); choicesEl.innerHTML = ''; choicesEl.classList.remove('menu'); more.hidden = true; idleKey = ''; if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); end && end(); }
  dlg.addEventListener('click', advance);
  function plain(label, text) { sayEl.style.minHeight = ''; D = null; who.textContent = label; setSay(text); choicesEl.innerHTML = ''; more.hidden = true; idleKey = ''; faceBox.hidden = true; }

  function maybeFinale() {
    if (finale || met.size < TOTAL || mode !== 'world' || D) return;
    finale = true;
    setTimeout(() => {
      if (mode !== 'world' || D) { finale = false; return; }
      talk('Achilles', ['That’s everyone! Thanks for stopping by — now you know me a little better.', 'Want to build something together? My inbox is open.'], { choices: [{ t: 'Say hi', cls: 'ok', do: go('../index.html?tab=contact') }, { t: 'Keep exploring', cls: 'no' }] });
    }, 250);
  }
  function updateMet(bump) {
    $('met').textContent = met.size + '/' + TOTAL;
    if (bump) { const b = $('dexbtn'); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }
  function talkTo(n) {
    const dx = P.x - n.x, dy = P.y - n.y;
    n.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u');
    const o = { choices: n.choices, end: () => {
      if (!met.has(n.id)) { met.add(n.id); keep('knowme-met', JSON.stringify([...met])); sfx(660, 990, 0.18); updateMet(true); burst(n.x, n.y - 20, 26, CONF, 55, 45, 0.9); if (navigator.vibrate) navigator.vibrate([20, 40, 20]); }
      maybeFinale();
    } };
    talk(n.name, n.lines, o);
  }

  /* ---------- little particles: dust, sparkles, confetti ---------- */
  const PT = [];
  const CONF = ['#ffd93b', '#ff5fa8', '#2fe3a1', '#6b4cff', '#8fd8ff'];
  function burst(x, y, n, cols, spd = 40, up = 30, life = 0.7) {
    if (REDUCED) return;
    for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = spd * (0.4 + Math.random() * 0.8);
      PT.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - up, life: life * (0.6 + Math.random() * 0.6), max: life, col: cols[i % cols.length], g: 120, s: Math.random() < 0.4 ? 2 : 1 }); }
  }
  function dust(x, y) { if (!REDUCED) PT.push({ x: x + (Math.random() * 4 - 2), y: y - 1, vx: (Math.random() - 0.5) * 8, vy: -6 - Math.random() * 6, life: 0.35, max: 0.35, col: 'rgba(255,255,255,.7)', g: 0, s: 2 }); }
  function stepPT(dt) { for (let i = PT.length - 1; i >= 0; i--) { const p = PT[i]; p.life -= dt; if (p.life <= 0) { PT.splice(i, 1); continue; } p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt; } }
  function drawPT() { PT.forEach(p => { c.globalAlpha = Math.min(1, p.life / p.max * 1.5); R(c, Math.round(p.x), Math.round(p.y), p.s, p.s, p.col); }); c.globalAlpha = 1; }
  let dustT = 0;

  /* ---------- world ---------- */
  const hit = (a, b) => a[0] < b[0] + b[2] && a[0] + a[2] > b[0] && a[1] < b[1] + b[3] && a[1] + a[3] > b[1];
  const free = (nx, ny) => { const b = [nx - 4, ny - 5, 8, 5]; return !S.solids.some(s => hit(b, s)) && !S.npcs.some(n => hit(b, [n.x - 5, n.y - 5, 10, 5])); };
  const inDoor = side => { const d = S.door[side]; return d && P.y >= d[0] && P.y <= d[1]; };

  function nearest() {
    let best = null, bd = 1e9; const px = P.x, py = P.y - 3;
    S.objs.forEach(o => {
      if (!o.label) return;
      const [x, y, w, h] = o.r, d = Math.hypot(Math.max(x - px, 0, px - (x + w)), Math.max(y - py, 0, py - (y + h)));
      if (d < 12 && d < bd) { bd = d; best = o; }
    });
    S.npcs.forEach(n => { const d = Math.hypot(n.x - px, n.y - 4 - py); if (d < 20 && d < bd) { bd = d; best = n; } });
    return best;
  }
  function showBanner(text) { banner = { text, t: 2.4 }; }
  function act() {
    if (busy || dexOpen) return;
    if (D) return advance();
    if (mode === 'rally') return rallyHit();
    if (near) near.lines ? talkTo(near) : near.use();
  }
  function travel(to, arrive) {
    if (busy) return; busy = true; fade.classList.add('on'); sfx(440, 220, 0.2, 'triangle');
    setTimeout(() => {
      cur = to; S = SCENES[to]; $('loc').textContent = S.name; showBanner(S.name);
      const d = S.door[arrive]; P.x = arrive === 'l' ? 24 : W - 24; P.y = (d[0] + d[1]) / 2;
      fade.classList.remove('on'); setTimeout(() => { busy = false; }, 120);
    }, 300);
  }

  function startGame() {
    showBanner(S.name);
    talk('Achilles', ['Hey, welcome to my room! Walk around, meet the people in my life, and you’ll know me by the end.', 'Start with the computer on the desk, or say hi to Byte.']);
  }

  /* ---------- update ---------- */
  function update(dt) {
    t += dt; stepPT(dt);
    const talking = !!(D && !D.done);
    if (talking !== faceBox.classList.contains('talking')) faceBox.classList.toggle('talking', talking);
    if (D) {
      if (!D.done) { D.ch += dt * 55; if (D.ch >= D.lines[D.i].length) finishLine(); }
      if (D.said !== D.i) { D.said = D.i; srEl.textContent = D.lines[D.i]; }       // full line to screen readers once
      setSay(D.lines[D.i].slice(0, Math.floor(D.ch)));
      P.moving = false; return;
    }
    if (mode === 'rally') return updateRally(dt);
    if (dexOpen) return;
    let vx = K.right - K.left, vy = K.down - K.up;
    if (busy) vx = vy = 0;
    if (vx && vy) { vx *= 0.7071; vy *= 0.7071; }
    P.moving = !!(vx || vy);
    if (P.moving) {
      P.walk += dt; dustT -= dt; if (dustT <= 0) { dustT = 0.14; dust(P.x, P.y); }
      P.dir = vx ? (vx > 0 ? 'r' : 'l') : (vy > 0 ? 'd' : 'u');
      const minX = S.left != null && inDoor('l') ? -20 : 8, maxX = S.right != null && inDoor('r') ? W + 20 : W - 8;
      const nx = Math.min(maxX, Math.max(minX, P.x + vx * 62 * dt)); if (free(nx, P.y)) P.x = nx;
      const ny = Math.min(H - 1, Math.max(0, P.y + vy * 62 * dt)); if (free(P.x, ny)) P.y = ny;
      if (P.x <= 3 && S.left != null && inDoor('l')) travel(S.left, 'r');
      else if (P.x >= W - 3 && S.right != null && inDoor('r')) travel(S.right, 'l');
    }
    near = busy ? null : nearest();
    if (near && near.lines && !near.cat) { const dx = P.x - near.x, dy = P.y - near.y; near.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u'); }
    const rdy = !!near; if (rdy !== actBtn.classList.contains('ready')) actBtn.classList.toggle('ready', rdy);
    const msg = near ? `${ACT} — ${near.lines ? 'Talk to ' + near.name : near.label}` : TIP;
    if (msg !== idleKey) { idleKey = msg; who.textContent = near ? 'Nearby' : 'Tip'; setSay(msg); if (near) srEl.textContent = msg; faceBox.hidden = true; }
    if (banner.t > 0) banner.t -= dt;
  }

  /* ---------- drawing ---------- */
  function shadow(x, y) { R(c, x - 5, y - 2, 10, 3, 'rgba(36,26,69,.28)'); }
  function bubbleMark(x, y, txt, bg) {
    const bob = Math.round(Math.sin(t * 5) * 1.5);
    R(c, x - 5, y + bob, 10, 11, '#241a45'); R(c, x - 4, y + 1 + bob, 8, 9, bg);
    c.fillStyle = '#241a45'; c.font = '700 9px ' + FONT; c.textAlign = 'center'; c.fillText(txt, x, y + 9 + bob);
  }
  function label(g, text, x, y, size, fill, stroke, lw) {
    g.font = `700 ${size}px ${FONT}`; g.textAlign = 'center'; g.lineJoin = 'round';
    if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.strokeText(text, x, y); }
    g.fillStyle = fill; g.fillText(text, x, y);
  }
  function box(x, y, w, h, bg = '#fff') { R(c, x, y, w, h, '#241a45'); R(c, x + 2, y + 2, w - 4, h - 4, '#fff'); R(c, x + 3, y + 3, w - 6, h - 6, bg); }

  function drawWorld() {
    if (!S.bg) build(S);
    c.drawImage(S.bg, 0, 0);
    const AX = Sprite.AX, AY = Sprite.AY;
    const list = S.npcs.map(n => ({ y: n.y, f: () => {
      shadow(n.x, n.y);
      if (n.cat) c.drawImage(Sprite.cat(), n.x - 7, n.y - 13); else c.drawImage(Sprite.person(n.pal, n.dir, 0), n.x - AX, n.y - AY - (REDUCED ? 0 : (Math.sin(t * 2.2 + n.x) > 0.55 ? 1 : 0)));
    } }));
    list.push({ y: P.y, f: () => {
      shadow(P.x, P.y);
      const step = P.moving ? [0, 1, 0, 3][Math.floor(P.walk * 9) % 4] : 0;
      c.drawImage(Sprite.person(PAL.me, P.dir, step), Math.round(P.x) - AX, Math.round(P.y) - AY);
    } });
    list.sort((a, b) => a.y - b.y).forEach(o => o.f());
    drawPT();
    S.npcs.forEach(n => { if (!met.has(n.id)) bubbleMark(n.x, n.y - (n.cat ? 26 : 38), '!', '#ffd93b'); });
    if (near && !D && !near.lines) bubbleMark(Math.round(P.x), Math.round(P.y) - 38, touch ? 'A' : 'E', '#fff');
    if (near && !D && near.lines && met.has(near.id)) bubbleMark(Math.round(P.x), Math.round(P.y) - 38, touch ? 'A' : 'E', '#fff');
    if (banner.t > 0) {                                    // location sign, slides in from the top like in the handheld games
      const k = Math.min(1, banner.t, (2.4 - banner.t) * 4), y = -22 + k * 26;
      c.font = `700 11px ${FONT}`; const w = Math.max(80, Math.ceil(c.measureText(banner.text).width) + 20);
      box(6, Math.round(y), w, 20, '#fff9e0'); c.fillStyle = '#241a45'; c.textAlign = 'left'; c.fillText(banner.text, 16, Math.round(y) + 14);
    }
  }
  function draw() {
    if (mode === 'rally') drawRally(); else drawWorld();
  }

  let last = performance.now();
  function frame(now) { const dt = Math.min(0.05, (now - last) / 1000); last = now; update(dt); draw(); requestAnimationFrame(frame); }

  /* ---------- volleyball rally mini-game (side view) ---------- */
  const FLOOR = 152, HIT_ME = [90, 114], HIT_MATE = [230, 114];
  let rallyBg = null;
  function buildRallyBg() {
    rallyBg = document.createElement('canvas'); rallyBg.width = W; rallyBg.height = H;
    const g = rallyBg.getContext('2d');
    R(g, 0, 0, W, 118, '#efe3c6');
    for (let y = 0; y < 100; y += 8) { R(g, 0, y + 7, W, 1, '#dccca6'); for (let x = ((y / 8) % 2) * 12; x < W; x += 24) R(g, x, y, 1, 8, '#dccca6'); }
    R(g, 0, 84, W, 34, '#3a6fb5'); R(g, 0, 84, W, 2, '#6a9be0'); R(g, 0, 114, W, 4, '#8a6f3f');
    [[20, 14], [250, 14]].forEach(([x, y]) => { R(g, x, y, 44, 34, '#fff'); R(g, x + 3, y + 3, 38, 28, '#8fd8ff'); R(g, x + 3, y + 3, 38, 9, '#b9e8ff'); R(g, x + 21, y + 3, 2, 28, '#fff'); });
    R(g, 120, 12, 80, 30, '#e5484d'); R(g, 120, 12, 80, 4, '#ff7a7f'); g.drawImage(Sprite.ball(), 126, 21);
    g.fillStyle = '#fff'; g.font = '700 12px ' + FONT; g.textAlign = 'left'; g.fillText('KNOW ME', 144, 32);
    R(g, 0, 118, W, H - 118, '#d9aa6a');
    for (let y = 118; y < H; y += 10) { R(g, 0, y, W, 1, '#c2924f'); for (let x = ((y - 118) / 10 % 2) * 20; x < W; x += 40) R(g, x, y, 1, 10, '#c2924f'); }
    R(g, 0, FLOOR + 2, W, 2, '#fff'); R(g, 158, FLOOR - 62, 4, 66, '#2b2d42'); R(g, 156, FLOOR + 2, 8, 4, '#2b2d42');
    R(g, 160, FLOOR - 58, 1, 40, 'rgba(255,255,255,.0)');
    for (let y = FLOOR - 58; y < FLOOR - 16; y += 4) R(g, 152, y, 16, 1, 'rgba(255,255,255,.75)');
    for (let x = 152; x < 168; x += 4) R(g, x, FLOOR - 58, 1, 42, 'rgba(255,255,255,.6)');
    R(g, 150, FLOOR - 62, 20, 3, '#fff');
  }
  function startRally() {
    D = null; choicesEl.innerHTML = ''; more.hidden = true;
    mode = 'rally'; RL = { n: 0, perfect: 0, state: 'ready', t: 0, k: 0, dir: 1, dur: 1.5, peak: 62, msg: '', msgT: 0, lock: 0, hopP: 0, hopT: 0, over: 0 };
    $('loc').textContent = 'Rally'; idleKey = ''; faceBox.hidden = true; who.textContent = 'Rally'; sfx(520, 780, 0.12);
  }
  function endRally() { mode = 'world'; RL = null; $('loc').textContent = S.name; idleKey = ''; showBanner(S.name); }
  const rmsg = m => { RL.msg = m; RL.msgT = 0.8; };
  function rallyHit() {
    if (!RL || RL.state !== 'fly' || RL.dir !== 1 || RL.lock > 0) return;
    if (RL.k < 0.72) { RL.lock = 0.35; rmsg('WAIT…'); sfx(220, 150, 0.08, 'square'); return; }
    const perfect = Math.abs(RL.k - 1) < 0.07;
    RL.n++; if (perfect) RL.perfect++;
    rmsg(perfect ? 'PERFECT!' : 'NICE'); sfx(perfect ? 880 : 660, perfect ? 1320 : 900, 0.14);
    burst(HIT_ME[0], HIT_ME[1], perfect ? 22 : 10, perfect ? ['#ffd93b', '#fff'] : ['#2fe3a1', '#fff'], 50, 20, 0.5); RL.hopP = 8; RL.dir = -1; RL.k = 0; if (navigator.vibrate) navigator.vibrate(12);
  }
  function rallyFinish() {
    const n = RL.n, nb = n > best; if (nb) { best = n; keep('knowme-best', String(n)); }
    RL.state = 'done';
    const line = n === 0 ? 'Zero returns! The ball says hi, though. Try again.' : n < 5 ? `${n} in a row. Warm-up round.` : n < 10 ? `${n} in a row! Not bad at all.` : n < 20 ? `${n} in a row! Varsity material.` : `${n} in a row!! Okay, you’re the MVP.`;
    talk('Teammate', [line + (RL.perfect ? ` (${RL.perfect} perfect)` : ''), nb && n > 0 ? `New best: ${best}!` : `Your best so far: ${best}.`],
      { choices: [{ t: 'Again', cls: 'ok', do: startRally }, { t: 'Done', cls: 'no' }], end: () => { if (RL && RL.state === 'done') endRally(); } });
  }
  function updateRally(dt) {
    const r = RL;
    r.msgT = Math.max(0, r.msgT - dt); r.lock = Math.max(0, r.lock - dt); r.hopP = Math.max(0, r.hopP - dt * 40); r.hopT = Math.max(0, r.hopT - dt * 40);
    const key = 'r' + r.state + r.n + '/' + best;
    if (key !== idleKey) { idleKey = key; who.textContent = 'Rally'; setSay(r.state === 'ready' ? 'Hit A (or tap the screen) when the ball reaches the ring.' : `Rally ${r.n}  ·  Best ${best}`); if (r.state === 'ready') srEl.textContent = sayShown; }
    if (r.state === 'ready') { r.t += dt; if (r.t > 1.2) { r.state = 'fly'; r.k = 0; r.dir = 1; } return; }
    if (r.state === 'fly') {
      r.k += dt / (r.dir === 1 ? r.dur : r.dur * 0.85);
      if (r.dir === -1 && r.k >= 1) {
        r.dir = 1; r.k = 0; r.hopT = 8; sfx(520, 700, 0.08);
        r.dur = Math.max(0.7, r.dur * 0.955) * (0.94 + Math.random() * 0.12); r.peak = 50 + Math.random() * 22;
      } else if (r.dir === 1 && r.k > 1.08) { r.state = 'over'; r.over = 0; sfx(300, 90, 0.4, 'sawtooth', 0.05); }
      return;
    }
    if (r.state === 'over') { r.over += dt; if (r.over > 1) rallyFinish(); }
  }
  function drawRally() {
    if (!rallyBg) buildRallyBg();
    c.drawImage(rallyBg, 0, 0);
    const r = RL, me = Sprite.person(PAL.me, 'r', 0), mate = Sprite.person(PAL.kid, 'l', 0);
    // ball position
    const from = r.dir === 1 ? HIT_MATE : HIT_ME, to = r.dir === 1 ? HIT_ME : HIT_MATE;
    let bx, by;
    if (r.state === 'ready') { bx = HIT_MATE[0]; by = HIT_MATE[1] - 6; }
    else {
      const k = r.k; bx = from[0] + (to[0] - from[0]) * k;
      by = k <= 1 ? from[1] - Math.sin(Math.PI * k) * (r.dir === 1 ? r.peak : 56) : to[1] + 380 * Math.pow((k - 1) * r.dur, 2);
      if (r.state === 'over') { bx = to[0] + (to[0] - from[0]) * (r.over * 0.12); by = Math.min(FLOOR - 4, to[1] + 380 * Math.pow(0.08 * r.dur + r.over, 2)); }
    }
    by = Math.min(FLOOR - 4, by); bx = Math.max(8, bx);
    // players (drawn 2x)
    R(c, 50, FLOOR - 1, 30, 4, 'rgba(36,26,69,.28)'); R(c, 240, FLOOR - 1, 30, 4, 'rgba(36,26,69,.28)');
    c.drawImage(me, 64 - 16, FLOOR - 44 - r.hopP, 32, 46); c.drawImage(mate, 256 - 16, FLOOR - 44 - r.hopT, 32, 46);
    // timing ring on my hands while the ball is coming
    if (r.state === 'fly' && r.dir === 1) {
      const inWin = r.k >= 0.72 && r.k <= 1.08, perf = Math.abs(r.k - 1) < 0.07, col = perf ? '#ffd93b' : inWin ? '#2fe3a1' : '#ffffff';
      const x = HIT_ME[0] - 12, y = HIT_ME[1] - 12;
      R(c, x, y, 24, 2, col); R(c, x, y + 22, 24, 2, col); R(c, x, y, 2, 24, col); R(c, x + 22, y, 2, 24, col);
    }
    // ball + shadow
    const sh = Math.max(4, 12 - (FLOOR - by) / 8); R(c, Math.round(bx - sh / 2), FLOOR, Math.round(sh), 2, 'rgba(36,26,69,.3)');
    c.drawImage(Sprite.ball(), Math.round(bx) - 7, Math.round(by) - 7, 14, 14);
    drawPT();
    // text
    label(c, 'RALLY ' + r.n, 52, 70, 12, '#fff', '#241a45', 4);
    label(c, 'BEST ' + best, 268, 70, 12, '#ffd93b', '#241a45', 4);
    const m = r.state === 'ready' ? 'READY?' : r.state === 'over' ? 'MISS!' : r.msgT > 0 ? r.msg : '';
    if (m) label(c, m, 160, 64, 16, r.state === 'over' ? '#ff7a7f' : '#fff', '#241a45', 5);
  }

  /* ---------- people Dex ---------- */
  const DEXLIST = []; SCENES.forEach(s => s.npcs.forEach(n => DEXLIST.push({ n, where: s.name })));
  function toggleDex(open) {
    dexOpen = open === undefined ? !dexOpen : open; $('dexov').hidden = !dexOpen;
    if (dexOpen) { for (const k in K) K[k] = 0; renderDex(); $('dexclose').focus({ preventScroll: true }); } else $('dexbtn').focus({ preventScroll: true });
  }
  function renderDex() {
    const ul = $('dexlist'); ul.innerHTML = '';
    DEXLIST.forEach(({ n, where }, i) => {
      const got = met.has(n.id), li = document.createElement('li'), cv2 = document.createElement('canvas');
      cv2.width = 32; cv2.height = 32; const g = cv2.getContext('2d'); g.imageSmoothingEnabled = false;
      R(g, 0, 0, 32, 32, '#e6f1ff');
      if (n.cat) g.drawImage(Sprite.cat(), 4, 4, 24, 24); else g.drawImage(Sprite.face(n.pal), 0, 3, 32, 26);
      if (!got) cv2.className = 'dark';
      li.className = got ? 'got' : '';
      li.innerHTML = `<b>No.${String(i + 1).padStart(2, '0')}</b><span>${got ? n.name : '???'}</span><small>${got ? where : 'Not met yet'}</small>`;
      li.prepend(cv2); ul.appendChild(li);
    });
    $('dexbest').textContent = best;
  }
  $('dexbtn').addEventListener('click', () => toggleDex());
  $('dexclose').addEventListener('click', () => toggleDex(false));
  const resetBtn = $('dexreset'); let resetT;
  const armReset = on => { clearTimeout(resetT); resetBtn.classList.toggle('sure', on); resetBtn.textContent = on ? 'Erase?' : 'Reset'; if (on) resetT = setTimeout(() => armReset(false), 3000); };
  resetBtn.addEventListener('click', () => {
    if (!resetBtn.classList.contains('sure')) return armReset(true);        // one stray tap shouldn't wipe progress and best score
    armReset(false); met.clear(); best = 0; keep('knowme-met', '[]'); keep('knowme-best', '0'); finale = false; updateMet(); renderDex();
  });
  const muteBtn = $('mute');
  function paintMute() { muteBtn.setAttribute('aria-pressed', muted); muteBtn.setAttribute('aria-label', muted ? 'Sound off. Turn on' : 'Sound on. Turn off'); muteBtn.querySelector('use').setAttribute('href', muted ? '#i-mute' : '#i-vol'); }
  muteBtn.addEventListener('click', () => { muted = !muted; keep('knowme-mute', muted ? '1' : '0'); paintMute(); sfx(660, 880, 0.1); });
  paintMute();
  $('stage').addEventListener('pointerdown', e => { if (mode === 'rally' && !D && !dexOpen) { e.preventDefault(); act(); } });

  /* ---------- input ---------- */
  const keyMap = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right', ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down' };
  addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (keyMap[e.key]) {
      const btns = [...choicesEl.querySelectorAll('button')];
      if (btns.length) {                                    // arrows move through the menu, like a handheld game
        const i = btns.indexOf(document.activeElement), step = ['left', 'up'].includes(keyMap[e.key]) ? -1 : 1;
        btns[(i + step + btns.length) % btns.length].focus(); e.preventDefault(); return;
      }
      if (dexOpen) return;
      K[keyMap[e.key]] = 1; e.preventDefault(); return;
    }
    if (e.key === 'Escape' && dexOpen) { toggleDex(false); return; }
    if (e.key === 'Escape' && D && D.o.choices && D.done && !D.o.menu) { closeDlg(); return; }
    if (['e', 'E', ' ', 'Enter'].includes(e.key)) {
      if (dexOpen || (document.activeElement && document.activeElement.closest('#choices, .hud'))) return;
      e.preventDefault(); if (!e.repeat) act();
    }
  });
  addEventListener('keyup', e => { if (keyMap[e.key]) K[keyMap[e.key]] = 0; });
  addEventListener('blur', () => { for (const k in K) K[k] = 0; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) for (const k in K) K[k] = 0; });
  /* on-screen d-pad: press a button, or slide your thumb around it like a joystick (8 directions) */
  const dpadEl = document.querySelector('#pad .dpad'), dBtns = {};
  dpadEl.querySelectorAll('[data-k]').forEach(b => { dBtns[b.dataset.k] = b; });
  const setDir = (l, r, u, d) => {
    const want = { left: l, right: r, up: u, down: d };
    for (const k in want) { if (K[k] !== +want[k]) { K[k] = +want[k]; dBtns[k].classList.toggle('on', want[k]); } }
  };
  const aim = e => {
    const r = dpadEl.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), dead = r.width * 0.12;
    if (Math.hypot(dx, dy) < dead) return setDir(0, 0, 0, 0);
    const ax = Math.abs(dx), ay = Math.abs(dy), diag = Math.min(ax, ay) > Math.max(ax, ay) * 0.45;   // thumb near a corner = two keys
    setDir(dx < 0 && (ax >= ay || diag), dx > 0 && (ax >= ay || diag), dy < 0 && (ay > ax || diag), dy > 0 && (ay > ax || diag));
  };
  let dpadId = null;
  dpadEl.addEventListener('pointerdown', e => { e.preventDefault(); dpadId = e.pointerId; dpadEl.setPointerCapture && dpadEl.setPointerCapture(e.pointerId); if (navigator.vibrate) navigator.vibrate(8); aim(e); });
  dpadEl.addEventListener('pointermove', e => { if (e.pointerId === dpadId) aim(e); });
  const dOff = e => { if (dpadId !== null && e.pointerId !== dpadId) return; dpadId = null; setDir(0, 0, 0, 0); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(n => dpadEl.addEventListener(n, dOff));
  addEventListener('blur', () => setDir(0, 0, 0, 0));
  addEventListener('contextmenu', e => { if (e.target.closest && e.target.closest('#pad')) e.preventDefault(); });
  actBtn.addEventListener('pointerdown', e => { e.preventDefault(); if (navigator.vibrate) navigator.vibrate(10); act(); });

  /* ---------- go ---------- */
  $('loc').textContent = S.name; updateMet(); finale = met.size >= TOTAL;
  startGame();
    requestAnimationFrame(frame);
})();
