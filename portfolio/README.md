# achilles.dev — portfolio + "Know Me" game

Plain HTML/CSS/JS, no build step. Open `index.html`, or host the folder anywhere.

- `index.html`, `style.css`, `script.js` — the handheld-dex style portfolio. Edit the `PROJECTS` array at the top of `script.js`.
- `sprites.js` — pixel characters drawn from code (shared by the site footer and the game).
- `game/` — the "Know Me" game (walk, meet 7 people, play the volleyball rally). Progress is saved in the browser.
- `assets/fonts/` — Pixelify Sans (SIL OFL), bundled so nothing loads from the internet.

## Notes
- Before going live: make the `og:image` URL in `index.html` absolute and add a `<link rel="canonical">` so link previews work on every platform.
- Screen readers: the typewriter text is hidden from assistive tech; the full line is announced once via a hidden live region (`.sr`).
- The last two entries in `PROJECTS` (Responsive Website, Python Automation Tool) are generic placeholders. Replace them with real projects, or delete them.
- Raspberry Pi accuracy (95%) lives in the `pi` entry of `PROJECTS` (`stat: { label, value }`). Add a `stat` to any other project to get the same pixel meter.
- Foldable dex: the Close/Open (desktop) and Fold/Unfold (phone) button lives in the dex top bar. Logic is the "foldable dex" block in `script.js`; the hinge swing and phone fold are in `style.css` ("fold" sections). All motion switches off under `prefers-reduced-motion`.
- Game (v10): Blaire's lines live in the `blaire` NPC in `game/game.js`. Touch devices get an on-screen d-pad you can slide your thumb around (8 directions) plus an A button that pulses near something to talk to. Animations (dialogue pop, talking portrait, dust, confetti, idle bobbing, Dex bump) all switch off under `prefers-reduced-motion`.
