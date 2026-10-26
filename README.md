# PROJECT BC

A first-person horror game set in an enormous abandoned Brent Cross shopping centre, featuring **Prime Secretary Josiah Richards (Subject BC-01)** and **Deputy Prime Secretary Peter Chambers (Subject BC-02)**. Josiah is the Prime Secretary of the United Kingdom, a title that replaced Prime Minister in the game's fictional setting.

## Play

This repository contains the editable browser game and its audio, artwork and story assets. Open **index.html** in desktop Chrome or Edge, keeping all neighboring files and the `assets/` folder together. No installation or build step is required. Keyboard, mouse and touch controls are included.

The separately distributed **Project BC.html** is the standalone offline edition. Generated standalone files, itch.io ZIP exports and temporary development files are excluded from this repository.

For local development, you can also serve this folder with `python -m http.server 8000` and visit `http://localhost:8000`.

The opening title introduces Prime Secretary Josiah Richards. Choose **BEGIN PROLOGUE** to read the full supplied story across 12 chapters. Use Previous/Next or the arrow keys at your own pace; Escape or **SKIP TO TITLE** goes directly to the main menu. **REPLAY PROLOGUE** lets you revisit it. The original supplied text is included in `prologue.txt`; on-screen text preserves the prose while displaying Markdown links as their readable labels. The prologue is fictional game lore.

Choose **ENTER BRENT CROSS** from the main menu, then allow the game to capture your mouse. If mouse capture is unavailable, hold the left mouse button while looking, or use the left/right arrow keys to turn. Press Escape to release the mouse and pause.

## Shopping centre

The 283.5 × 283.5 metre map starts in a forecourt inspired by the supplied building image: Brent Cross Government Complex signage, a huge Josiah banner, floodlights, parked cars, bollards and a fenced derelict playground. Walk through the entrance into the centre without a loading screen.

Explore 26 shop units, west and east arcades, a grand atrium with a dry fountain and glazed roof, a food court, department store, cinema and market hall. Some shops are shuttered. Upper galleries and broken escalators are scenery; exploration takes place on the ground level. The architecture is a stylized 3D interpretation, not a survey of the real Brent Cross building.

The persistent minimap shows **you as a white arrow, Josiah as a RED dot, Peter as a little GREEN dot, relays as amber diamonds, and the south gate as a green square**. Both enemy markers update as they move, even when walls hide them. Hold Tab for the expanded labelled map. Peter's status reads ESCORTING JOSIAH, ROAMING or HUNTING YOU.

## Objective

Restore the four amber relays in the **food court, Northstar department store, cinema, and market hall**. Press E near each relay. When all four turn green, return to the **south evacuation gate behind the starting point** and press E to escape.

Both pursuers start moving after a short grace period. **Until the first power circuit is restored, Peter follows Josiah everywhere** and does not independently patrol or pursue you. He can still catch you if you touch him. Restoring any first relay immediately releases Peter to patrol on his own. After that, both enemies can spot your flashlight and hear nearby running. Use connecting corridors to break line of sight. Crouching with the light off makes you harder to detect. Restarting returns Peter to escort mode.

Peter has a separate capture sequence: a forward lunge, reaching arms, an open-mouth expression, green lighting and a rising two-tone sting. Reduced scares skip the close-up and identify which subject caught you on the loss screen.

## Controls

| Input | Action |
| --- | --- |
| W A S D | Move |
| Mouse | Look |
| Left Shift | Sprint |
| Hold C | Crouch |
| F | Toggle flashlight |
| E | Activate a nearby relay / use the exit |
| Hold Tab | Expanded shopping-centre map |
| Escape | Pause and release mouse |
| Arrow keys | Forward/back and turn alternative |

Stamina recovers when you stop sprinting. The flashlight recharges when switched off. Sound and reduced-scare options are on the main menu. Reduced scares replace the capture close-up with the loss screen.

## Character

Use the **BC-01 · JOSIAH / BC-02 · PETER** buttons on the main menu to switch the displayed subject. Select **VIEW 3D SUBJECT** to inspect the chosen model, read his biography, and switch between subjects there too. Drag to rotate and scroll to zoom. This is an archive selector; both enemies remain active in the game.

**BC-01-character.glb** is the preserved model of Josiah. **BC-02-Peter-Chambers.glb** is the new, separate model of Peter: dark side-parted hair, brown eyes, a black suit with angular lapels, black bow tie and a grey pocket square. Both use a similar rounded cartoon style. The material-colored glTF 2.0 files can be imported into Blender or a game engine. They have separate head, torso, arm and leg groups, without a skeletal rig or animation clips. The game animates the parts procedurally.

The existing character model and its exported GLB are retained unchanged: brown hair, peach skin, half-lidded teal eyes, crooked smile, charcoal shirt and black bow tie. The large entrance poster is generated from this same 3D character.

## Editable files

- `index.html` — interface and biography.
- `game.js` — Josiah's original model, controls, pursuit and game state.
- `mall.js` — shopping-centre geometry, navigation map, scenery and live minimap.
- `peter.js` — Peter's 3D model, escort/patrol behaviour, capture sequence and subject switching.
- `prologue.js` / `prologue.txt` — opening sequence and supplied story.
- `style.css` — interface styling.

## Requirements and credits

Desktop keyboard and mouse; a WebGL-capable browser. Enable browser hardware acceleration if 3D cannot start. No account, installation, external assets, or internet connection is needed to play. Progress lasts for the current run.

Game code, procedural scenery, model geometry, and synthesized audio created for Project BC. Character appearance based on the user-supplied reference. Three.js r160 is distributed under the MIT license; see THREE-LICENSE.txt.

## Before the Story: The Last Juko

After Josiah's recorded narration and Boki's private scene (CH4BJ1–CH4BJ10, with measured audio lip sync), select ENTER OSAKA CASTLE to control Josiah through 25 enclosed Japanese castle rooms. Each room has a different name and arrangement of tatami, timber, shoji screens, painted panels and furniture. Entering Osaka Castle and opening its room doors have no loading screen or fade; room changes happen immediately. Room 25 starts a conversation containing five Boki lines alternating with five Josiah replies. Boki declares that she is awakened and can save her nephew Tajiri. Continue or Enter advances the exchange; after the final reply, her attack and Josiah's escape play automatically. The conversation, scream and hospital line use CH4OC1–CH4OC12, with subtitles and mouth animation measured from the recordings. CH4OC1–CH4OC10 alternate Boki/Josiah, CH4OC11 is the impact scream, and CH4OC12 is the hospital line during the crawl. Skipping or leaving stops the previous clip. The escape and completion wait for the respective recording to finish.

Windows: WASD move, mouse look, Shift run, click fire, R reload, V first/third-person camera, E open the nearby shoji door, Escape pause. Touch: left stick move, right swipe look, RUN, FIRE, RELOAD, CAMERA, OPEN, and pause. Returning to the Before the Story menu starts the next exploration at room 1. Completion uses the prequel save only and does not change main-story progress.

OSAKA - INFILTRATION is the exclusive Osaka Castle exploration theme. It loops through room changes, preserves playback position when paused, follows the shared sound/music settings, and stops when the room-25 Boki conversation begins or exploration is exited.

Osaka Castle shoji doors physically slide open into adjacent connected rooms: walking across a threshold changes the room label without teleporting, fading, or loading. The injury escape is first person, with crawling hands, fading consciousness, blurred vision, and a final collapse.

After Osaka’s collapse, a TWO DAYS LATER card leads into a hospital cinematic. Josiah has five reflective paragraphs, then an anonymous blue figure appears and says “From India to Hong Kong, Britannia rules the waves.” Josiah reacts in confusion. These new lines are subtitled; existing Osaka recordings remain unchanged. Chapter completion is recorded after this scene.

The hospital scene continues with ten Union Crown paragraphs manipulating Josiah into believing only he can unite the world. Union Crown disappears before Josiah’s final panic dialogue; completion occurs after that final line. New dialogue remains subtitled pending voice recordings.

Hospital dialogue now uses supplied CH4JRH1–18 recordings in numeric order, including Union Crown and the final panic. Josiah’s mouth follows measured recording amplitude; Union Crown’s blue light responds to its voice. Advancing, disappearance, and leaving stop and rewind active recordings.

Before the Story / Chapter 4: UNION CROWN unlocks after the Osaka hospital scene. Josiah’s prequel menu appearance becomes a black hoodie with a blue spectral figure, Alignment: Lawful Evil. Five voiced narration paragraphs (UNION-JR1–5, supplied JR1–5) precede Boki’s 5,000 HP boss fight, with charm volleys, shockwaves, a seeking charm, a rush, and a fracture field. Desktop/touch golden-chain attacks, dodge, healing, first/third-person camera, pause, retry, and victory are confined to prequel progression.

UNION CROWN’s introduction now reuses the exact Chapter 2/3 office narration set, with the desk, dossier, globe, stellar chart, lighting, and camera framing. Josiah narrates off screen; his hoodie and spectral menu appearance are retained.

Josiah’s second personal menu theme, I’M JUST JOSIAH - NEUTRAL PIANO, loops in Before the Story after Chapter 3 completion, across all character selections. It remains available for his subsequent personal chapters and follows Sound/Music settings. It continues across character selections and stops for cutscenes, battles, and the main campaign.

UNION CROWN now uses Kenji’s combat HUD layout, with both health meters, attack cues, dialogue, and matching pause/retry screens. Josiah attacks with animated golden chains in both camera views, without a gun, ammo, or reload. Touch controls display CHAINS. The personal-story piano theme remains uninterrupted when switching among Josiah, Gareth Jones, Kenji, and Boki.

The UNION CROWN narration uses JR1–5 in order. Skipping a line, entering the fight, returning to the prequel menu, or exiting stops and rewinds the narration; replay starts with JR1. These assets have a UNION prefix to preserve the main game’s existing JR recordings.

Boki’s UNION CROWN combat dialogue now cycles through ten lines. UNION-CROWN-BOSS.mp3 (supplied Union Crown - Josiah_s Theme Song) loops only during her Chapter 4 fight, pauses without rewinding for pause, and stops on victory, defeat or exit. It obeys Sound/Music levels and mute; the menu retains its piano theme.

After Boki’s defeat, the UNION CROWN aftermath plays ten Josiah lines using JRSENSE1–10. Josiah looks at his hands and kneels beside her body with a distressed expression and subtle tears; the blue specter and chains are hidden. Lip sync follows measured 20ms audio envelopes. Enter/touch Continue skips each line and stops its audio; music and combat stop throughout. Chapter completion is saved only after the final line, in the prequel save.

Chapter 4 completion changes the personal-menu Josiah alignment to Lawful Neutral and unlocks the final Chapter 5, The True Successor. BC-05 Tajiri Juko has an owned cartoon model with long brown hair, black clothes and a studded tricorn. Five subtitles in the existing office narration room lead into his 5,000 HP fight; Josiah uses golden chains and Kevin actively follows, fires at Tajiri and is marked as an ally. Chapter 4 UNION CROWN music does not play here. The three-line aftermath completes only the prequel save. Desktop/touch controls, pause, retry, replay and cleanup use the existing boss HUD. New Chapter 5 dialogue currently uses subtitles.

The Before the Story menu has ERASE STORY SAVE DATA with a confirmation dialog. It removes only project-bc-before-story-v1, resets all five personal chapters and unlocks, restores Josiah’s initial model/alignment and keeps the campaign/audio settings. Cancel and Escape preserve data. Chapter 5’s narration now opens three years after Boki’s death, with Emma welcoming their two children in England.

Boki’s Chapter 4 combat quotes use BOKI1–10 with lip sync from measured 20ms audio envelopes. A new taunt waits for the current recording to finish, preserving numeric order and avoiding overlaps. Pausing freezes the current recording; resume keeps its position. Defeat, the aftermath, retry, exit and other personal chapters stop/rewind these recordings. Sound/mute settings apply; music remains on its own channel.

The True Successor narration uses CH5JR1–5. Its 5,000 HP Tajiri encounter now takes place above a procedural cloud sea, with automatic hovering, R/F rise/descend, horizontal flight, aerial dodge, first/third-person views, golden chains, an active flying Kevin ally and five 3D attack patterns. Touch adds RISE/DOWN without changing HEAL/DODGE. Tajiri has ten vengeful subtitles confronting Josiah over Boki and Kevin over Bozuki. The aftermath stays airborne. Chapter 4’s castle fight and boss theme are unchanged.

## Opening prologue

PROLOGUE appears before Chapter 1: Enter Brent Cross. Gareth Williams speaks alone in a government office, with twelve paragraphs about the aftermath of the riots, Richards, Parliament, and Brent Cross in Hendon, now nicknamed Downing Street 2.0. No timestamps or references to Sans/Papyrus are used in the dialogue. A separate PROLOGUE button precedes CHAPTERS in the main menu, and the introduction is the first card before Enter Brent Cross in the chapter picker. It remains available across every route, including Last Refusal aftermath menus. Chapter 1 starts directly without forcing the introduction. Finishing or skipping returns to the menu or chapter picker it was opened from and records only garethPrologueViewed. Leaving for the menu does not mark it complete. It does not select a route or unlock a personal story.

The scene advances automatically, with Enter/Space and touch buttons for advancing, skipping the prologue, or returning to the menu. H/F1 opens the shared controls guide. GW1–GW12 are attached in order. All twelve lines advance after playback ends, with lip movement measured from each recording. Skipping, leaving or replaying stops the previous voice, and the controls guide pauses/resumes the active recording. The full script is saved in the adjacent Project BC - Prologue - Gareth Williams dialogue.md document.

Chapter audio is loaded when played on desktop and mobile, avoiding preloading every story recording at startup. Returning to the main menu also disposes unfinished atrium, Cabinet and Stephen rescue scenes without completing them or advancing the story.
