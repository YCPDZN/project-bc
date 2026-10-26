# PROJECT BC

A first-person horror game in an abandoned Brent Cross shopping centre, with Prime Secretary Josiah Richards (BC-01) and Deputy Prime Secretary Peter Chambers (BC-02), plus a prologue, a main campaign and the "Before the Story" personal chapters. See `README.md` for the full design notes; it's the record of how each feature should behave.

## Working on it from anywhere

This repo is the project's home. It's edited both on the user's PC and in Claude Code cloud sessions (phone/web), so:
- Commit and push every finished change. A cloud container is thrown away after the session.
- Pull before starting work, so changes made elsewhere aren't lost.
- When a feature changes, update its section in `README.md` too.

## Running it

- No build step. `python3 -m http.server 8768` in the repo root, then open http://localhost:8768 (also in `.claude/launch.json`).
- Everything is plain scripts loaded by `index.html`, using the bundled `three.min.js` (r160). Keep all files and `assets/` side by side.
- In a cloud session, use the pre-installed Playwright Chromium to load the page and screenshot it to check changes.

## Key files

- `index.html`: interface, menus and script order. New `.js` files must be added here.
- `game.js`: Josiah's model, controls, pursuit, game state. `mall.js`: map, navigation, minimap. `peter.js`: Peter.
- `prologue.js` / `prologue.txt`, `gareth-prologue.js`: openings.
- `before-story*.js`: the personal chapters; `*-voices.js` hold recording/lip-sync data.
- `mobile-controls.js`, `accessible-controls.js`: touch and accessibility controls (see `MOBILE-CONTROLS.md`, `ACCESSIBLE-CONTROLS.md`).
- `style.css`: styling.

## Rules

- Line endings are LF for js/css/html/md (`.gitattributes`).
- Every feature needs desktop and touch controls.
- Story progress has separate saves (e.g. `project-bc-before-story-v1` for the prequel). Don't mix them or change existing keys.
- `Project BC.html` (standalone edition) and ZIP exports are generated and git-ignored.
