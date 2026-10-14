/* Pixel sprites drawn from code, so every character and frame stays consistent.
   Sprite.person(palette, dir, step) -> canvas.  dir: d u l r   step: 0 idle, 1/3 walking
   Sprite.face(palette)  -> small head-and-shoulders canvas (for dialogue portraits)
   Sprite.ball()         -> volleyball canvas
   Sprites are 16x23 with the feet on the bottom row: draw at (x - Sprite.AX, y - Sprite.AY). */
const Sprite = (() => {
  const OUT = '#1d1737', EYE = '#17121f', SW = 16, SH = 23, cache = {};
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  function outline(o) {
    const f = mk(o.width, o.height), g = f.getContext('2d');
    [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([x, y]) => g.drawImage(o, x, y));
    g.globalCompositeOperation = 'source-in';
    g.fillStyle = OUT; g.fillRect(0, 0, f.width, f.height);
    g.globalCompositeOperation = 'source-over';
    g.drawImage(o, 0, 0);
    return f;
  }

  /* Edit these to restyle anyone.
     "me" is based on Achilles' photo: dark wavy hair, thick brows, warm skin, cream zip jacket with a red collar. */
  const PALS = {
    me:      { id: 'me', hair: '#17121f', skin: '#e2ab80', shade: '#bd7f58', jacket: '#ece1cb', jacket2: '#cfc2a5', collar: '#c8323c', pants: '#323849', pants2: '#262b39', shoes: '#f4f4f4', style: 'wavy', zip: 1 },
    teacher: { id: 'teacher', hair: '#a4a9b3', skin: '#d9a07a', shade: '#b97c58', shirt: '#6b4cff', shirt2: '#563bd6', pants: '#3a3550', pants2: '#2b2740', shoes: '#222', style: 'short', glasses: 1 },
    /* Blaire, styled from her photo: long straight black hair with a centre part, oversized cream Lakers tee,
       black wide-leg pants, lavender Crocs, thin gold necklace and bracelets. */
    blaire:  { id: 'blaire', hair: '#17121f', skin: '#d29a74', shade: '#b07652', shirt: '#f3ecdc', shirt2: '#d9cfb8', pants: '#17141f', pants2: '#0f0d15', shoes: '#b9a6ee', shoes2: '#8f7bd0', style: 'straight', wide: 1, lakers: 1, necklace: '#e8c36a', bracelet: ['#dfe3ee', '#e8c36a'] },
    kid:     { id: 'kid', hair: '#3a2418', skin: '#d99a6c', shade: '#b97a4e', shirt: '#22b8cf', shirt2: '#169cb2', pants: '#1c2a52', pants2: '#141f3e', shoes: '#fff', style: 'short', stripe: 1 },
    coach:   { id: 'coach', hair: '#17121f', skin: '#c98a60', shade: '#a76c45', shirt: '#ff6a3d', shirt2: '#d9532b', pants: '#2b2d42', pants2: '#1f2133', shoes: '#fff', style: 'cap', cap: '#ffd93b', cap2: '#e0b81f', whistle: 1 },
    owner:   { id: 'owner', hair: '#dcdce4', skin: '#d49a72', shade: '#b47a52', shirt: '#2fe3a1', shirt2: '#22c488', pants: '#7a4fa3', pants2: '#5e3b82', shoes: '#4a2f20', style: 'long' },
    driver:  { id: 'driver', hair: '#2a2218', skin: '#cf9367', shade: '#ad7249', shirt: '#fff4c2', shirt2: '#e8d98a', pants: '#3b4a6b', pants2: '#2c3956', shoes: '#222', style: 'cap', cap: '#e5484d', cap2: '#c23a3f' }
  };

  function person(P, dir, step = 0) {
    const key = P.id + dir + step;
    if (cache[key]) return cache[key];
    if (dir === 'l') {                                   // mirror the right-facing frame
      const r = person(P, 'r', step), f = mk(SW, SH), g = f.getContext('2d');
      g.translate(SW, 0); g.scale(-1, 1); g.drawImage(r, 0, 0);
      return (cache[key] = f);
    }
    const o = mk(SW, SH), c = o.getContext('2d');
    const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x + 1, y + 1, w, h); };
    const side = dir === 'r', back = dir === 'u', front = dir === 'd';
    const a = step === 1 ? 1 : step === 3 ? -1 : 0, H = P.hair;
    const top = P.jacket || P.shirt, top2 = P.jacket2 || P.shirt2;

    /* ----- body ----- */
    if (!side) {
      const ll = a === 1 ? 1 : 0, rl = a === -1 ? 1 : 0;
      if (P.wide) {                                       // wide-leg pants, chunky clogs, boxy oversized tee
        R(2, 17, 5, 3 - ll, P.pants); R(2, 19 - ll, 5, 2, P.shoes); R(2, 20 - ll, 5, 1, P.shoes2);
        R(7, 17, 5, 3 - rl, P.pants); R(7, 19 - rl, 5, 2, P.shoes); R(7, 20 - rl, 5, 1, P.shoes2);
        R(6, 17, 2, 3, P.pants2);
        if (!back) [[3, 19], [5, 19], [8, 19], [10, 19]].forEach(([x, y]) => R(x, y - (x < 7 ? ll : rl), 1, 1, P.shoes2));
        R(1, 10, 12, 7, top); R(1, 16, 12, 1, top2);
        R(0, 10 + rl, 2, 3, top); R(0, 13 + rl, 2, 3, P.skin); R(12, 10 + ll, 2, 3, top); R(12, 13 + ll, 2, 3, P.skin);
        R(0, 15 + rl, 2, 1, P.bracelet[0]); R(12, 15 + ll, 2, 1, P.bracelet[1]);
      } else {
      R(3, 16, 3, 3 - ll, P.pants); R(3, 19 - ll, 3, 2, P.shoes);
      R(8, 16, 3, 3 - rl, P.pants); R(8, 19 - rl, 3, 2, P.shoes);
      R(2, 10, 10, 6, top);
      R(2, 15, 10, 1, top2);
      if (P.stripe) [4, 6, 8].forEach(x => R(x, 10, 1, 5, top2));
      R(0, 10 + rl, 2, 5, top); R(0, 15 + rl, 2, 2, P.skin);
      R(12, 10 + ll, 2, 5, top); R(12, 15 + ll, 2, 2, P.skin);
      }
      if (front) {
        if (P.collar) {                                   // open jacket collar, red shirt underneath
          R(5, 10, 4, 1, P.skin); R(5, 11, 4, 1, P.collar); R(6, 12, 2, 1, P.collar);
          R(4, 10, 1, 2, top2); R(9, 10, 1, 2, top2);
          if (P.zip) { R(7, 13, 1, 3, '#b3a587'); R(7, 12, 1, 1, '#7d8590'); }
        } else { R(5, 10, 4, 1, P.skin); R(4, 10, 1, 1, top2); R(9, 10, 1, 1, top2); }
        if (P.lakers) {                                   // purple LAKERS wordmark, gold ball, dark court
          R(4, 11, 6, 1, '#d9cfb8'); R(3, 12, 8, 2, '#6a4ac0'); R(6, 13, 2, 2, '#f5c518'); R(4, 15, 6, 1, '#2a2438');
          R(4, 14, 1, 1, '#6a4ac0'); R(9, 14, 1, 1, '#6a4ac0');
        }
        if (P.necklace) { R(5, 10, 4, 1, P.skin); R(5, 11, 1, 1, P.necklace); R(8, 11, 1, 1, P.necklace); }
        if (P.whistle) { R(7, 11, 1, 3, '#fff'); R(6, 14, 3, 2, '#c9ccd6'); }
      } else {
        R(4, 10, 6, 1, top2);                              // collar from behind
        if (P.lakers) R(3, 12, 8, 3, '#6a4ac0');
      }
    } else {
      if (P.wide) {
        R(3 - 2 * a, 17, 5, 3, P.pants2); R(3 - 2 * a, 19, 6, 2, P.shoes); R(3 - 2 * a, 20, 6, 1, P.shoes2);
        R(3 + 2 * a, 17, 5, 3, P.pants); R(3 + 2 * a, 19, 6, 2, P.shoes); R(3 + 2 * a, 20, 6, 1, P.shoes2);
        R(2, 10, 9, 7, top); R(2, 16, 9, 1, top2); if (P.lakers) R(2, 12, 2, 3, '#6a4ac0');
      } else {
      R(4 - 2 * a, 16, 3, 3, P.pants2); R(4 - 2 * a, 19, 4, 2, P.shoes);
      R(4 + 2 * a, 16, 3, 3, P.pants); R(4 + 2 * a, 19, 4, 2, P.shoes);
      R(3, 10, 7, 6, top); R(3, 15, 7, 1, top2);
      }
      if (P.stripe) [4, 6, 8].forEach(x => R(x, 10, 1, 5, top2));
      R(8, 10, 2, 2, P.collar ? top2 : top2);
      if (P.collar) R(8, 11, 2, 1, P.collar);
      if (P.wide) { R(4 - 2 * a, 10, 4, 4, top2); R(5 - 2 * a, 14, 2, 3, P.skin); R(5 - 2 * a, 15, 2, 1, P.bracelet[0]); }
      else { R(5 - 2 * a, 10, 3, 5, top2); R(6 - 2 * a, 15, 2, 2, P.skin); }
    }

    /* ----- head ----- */
    if (!back) {
      if (front) R(2, 2, 10, 8, P.skin); else R(2, 2, 9, 8, P.skin);
    }
    if (front) {
      R(1, 5, 1, 2, P.skin); R(12, 5, 1, 2, P.skin);     // ears
      R(4, 5, 1, P.glasses ? 1 : 2, EYE); R(9, 5, 1, P.glasses ? 1 : 2, EYE);
      if (P.id === 'me') { R(3, 4, 3, 1, H); R(8, 4, 3, 1, H); }       // thick brows
      R(6, 7, 2, 1, P.shade); R(6, 8, 2, 1, '#b5654f');
      if (P.glasses) { const gl = '#2b2b3a'; [3, 8].forEach(x => { R(x, 4, 3, 1, gl); R(x, 6, 3, 1, gl); R(x, 5, 1, 1, gl); R(x + 2, 5, 1, 1, gl); }); R(6, 5, 2, 1, gl); }
    }
    if (side) {
      R(8, 5, 1, 2, EYE); if (P.id === 'me') R(8, 4, 3, 1, H);
      R(11, 6, 1, 1, P.skin); R(9, 8, 2, 1, '#b5654f'); R(4, 5, 2, 2, P.shade);
    }

    /* ----- hair ----- */
    if (P.style === 'cap') {
      R(2, 0, 10, 3, P.cap); R(3, -1 + 1, 8, 1, P.cap);
      if (front) { R(1, 3, 12, 1, P.cap2); R(2, 3, 1, 3, H); R(11, 3, 1, 3, H); }
      if (side) { R(10, 3, 4, 1, P.cap2); R(2, 3, 4, 5, H); }
      if (back) { R(2, 3, 10, 6, H); R(3, 9, 8, 1, H); }
    } else if (P.style === 'straight') {                  // Blaire: long, sleek, centre-parted
      R(2, 0, 10, 3, H);
      if (front) { R(1, 2, 2, 11, H); R(11, 2, 2, 11, H); R(3, 3, 3, 1, H); R(8, 3, 3, 1, H); R(2, 3, 1, 3, H); R(11, 3, 1, 3, H); }
      if (back) { R(1, 0, 12, 13, H); R(6, 1, 2, 1, '#2a2240'); }
      if (side) { R(2, 3, 5, 10, H); R(9, 3, 1, 1, H); R(8, 3, 2, 1, H); }
    } else if (P.style === 'long') {
      R(2, 0, 10, 3, H);
      if (front) { R(1, 2, 2, 10, H); R(11, 2, 2, 10, H); R(3, 3, 2, 1, H); R(9, 3, 2, 1, H); }
      if (back) { R(1, 0, 12, 12, H); }
      if (side) { R(2, 3, 5, 9, H); R(9, 3, 1, 1, H); }
    } else if (P.style === 'wavy') {                      // Achilles: tousled, wavy, a little fringe
      R(3, 0, 2, 1, H); R(6, 0, 3, 1, H); R(10, 0, 1, 1, H);
      R(2, 1, 10, 2, H);
      if (front) {
        R(1, 2, 1, 3, H); R(12, 2, 1, 3, H);              // sideburns
        R(2, 3, 2, 1, H); R(6, 3, 2, 1, H); R(10, 3, 2, 1, H); R(2, 4, 1, 1, H); R(11, 4, 1, 1, H);
      }
      if (back) { R(1, 2, 12, 7, H); R(2, 9, 10, 1, H); R(3, 0, 8, 1, H); R(3, 10, 8, 0, H); }
      if (side) { R(2, 3, 5, 5, H); R(1, 2, 2, 4, H); R(8, 3, 3, 1, H); R(10, 4, 1, 1, H); R(7, 0, 2, 1, H); }
    } else {                                              // short
      R(2, 1, 10, 2, H); R(3, 0, 8, 1, H);
      if (front) { R(1, 2, 1, 3, H); R(12, 2, 1, 3, H); R(2, 3, 2, 1, H); R(10, 3, 2, 1, H); }
      if (back) { R(1, 2, 12, 7, H); R(2, 9, 10, 1, H); }
      if (side) R(2, 3, 5, 5, H);
    }
    return (cache[key] = outline(o));
  }

  function face(P) {                                       // head + collar, for dialogue portraits
    const key = P.id + 'face';
    if (cache[key]) return cache[key];
    const f = mk(SW, 13), g = f.getContext('2d');
    g.drawImage(person(P, 'd', 0), 0, 0, SW, 13, 0, 0, SW, 13);
    return (cache[key] = f);
  }

  function cat() {
    if (cache.cat) return cache.cat;
    const o = mk(14, 14), c = o.getContext('2d');
    const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x + 1, y + 1, w, h); };
    R(2, 6, 8, 6, '#f0903c'); R(4, 8, 4, 3, '#ffd9a8'); R(3, 2, 6, 5, '#f0903c');
    R(3, 1, 1, 1, '#f0903c'); R(8, 1, 1, 1, '#f0903c'); R(5, 2, 1, 2, '#c8691f'); R(7, 2, 1, 2, '#c8691f');
    R(4, 4, 1, 1, EYE); R(7, 4, 1, 1, EYE); R(5, 5, 2, 1, '#ff8fa3');
    R(3, 11, 2, 1, '#fff'); R(7, 11, 2, 1, '#fff'); R(10, 9, 2, 1, '#f0903c'); R(11, 6, 1, 4, '#f0903c');
    return (cache.cat = outline(o));
  }

  function ball() {                                        // 11x11 volleyball
    if (cache.ball) return cache.ball;
    const o = mk(11, 11), c = o.getContext('2d');
    for (let y = 0; y < 11; y++) for (let x = 0; x < 11; x++) {
      const d = Math.hypot(x - 5, y - 5);
      if (d > 5.2) continue;
      let col = '#ffffff';
      if (d > 4.2) col = '#1d1737';
      else if (Math.abs((x - 5) - (y - 5) * 0.9) < 0.9 || Math.abs((x - 5) + (y - 5) * 0.9) < 0.9) col = '#ffd93b';
      else if (Math.abs(y - 5 - Math.sin((x - 5) * 0.55) * 2.6) < 0.9) col = '#3b82f6';
      else if (x + y < 6) col = '#eaf2ff';
      c.fillStyle = col; c.fillRect(x, y, 1, 1);
    }
    return (cache.ball = o);
  }

  return { person, face, cat, ball, PALS, W: SW, H: SH, AX: 8, AY: 22 };
})();
