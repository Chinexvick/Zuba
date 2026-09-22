# Zuba Kart

A self-contained, single-device React Native kart-racing game set on a
procedurally generated African market street circuit. Built with Expo,
`expo-gl`, and Three.js.

Architecturally and technique-wise inspired by the open-source
[pattssun/OpenWii `games/mario-kart`](https://github.com/pattssun/OpenWii/tree/main/games/mario-kart)
project (MIT licensed) — the drift/mini-turbo tiering, procedural
"model-spec" character building, and item-box system are reimplemented from
scratch for this project's own rendering stack (expo-gl + React Native
instead of a browser + DOM canvas), with original characters, an original
track theme, and no Nintendo/Mario IP reused.

## Setup

```bash
npm install
npx expo start
```

Then open in Expo Go on a phone (scan the QR code), or press `a`/`i` for an
Android/iOS simulator, or `w` for the web preview (see limitations below —
web is the least tested target).

The app is locked to landscape orientation (`app.json`).

## What's built (vertical slice)

- **Expo/React Native project scaffold** — `App.js`, `src/engine`-adjacent
  modules under `src/game`, `src/scenes`, `src/ui`, `src/input`.
- **Procedural track** (`src/game/track.js`) — a closed-loop African market
  street circuit generated entirely from code: extruded road mesh along a
  Catmull-Rom curve, procedurally scattered market stalls (canopy + counter +
  produce props), painted-signage buildings with window grids, matatu-style
  minibuses as roadside decoration, and simple crowd figures. No downloaded
  textures/models — colors and a lightweight procedural "paint" pattern are
  generated at runtime via a hand-rolled `DataTexture` (no DOM canvas
  dependency, since React Native has none by default).
- **Original characters & karts** (`src/game/modelSpec.js`,
  `src/game/models.js`) — 4 original characters (Amara, Kofi, Zola, Biko),
  each described as data (proportions, palette, accessory silhouette:
  headwrap / cap / headphones / bandana) and assembled from primitive
  geometry, following the same "spec-driven procedural build" idea as the
  reference project's `model-spec.js`, not palette-swapped clones. Each has
  a distinct kart color and stat spread (top speed / acceleration /
  handling / weight).
- **Driving physics** (`src/game/physics.js`) — acceleration, braking,
  speed-dependent steering, and a **two-tier mini-turbo drift boost**
  (blue-spark tier at 0.9s charge, orange-spark tier at 1.8s charge),
  loosely modeled on the charge/tier idea in the reference's drift system
  but with its own tuning and integration for this game's scale.
- **Input** — on-screen touch buttons (steer/accelerate/brake/drift/item)
  in `src/ui/TouchControls.js`, plus optional **device tilt steering** via
  `expo-sensors` Accelerometer (`src/input/useTiltSteering.js`), toggleable
  in-race. This is fully self-contained: the same device that renders the
  game reads its own input, no second-screen/controller pairing.
- **AI opponents** (`src/game/ai.js`) — 3 AI karts that follow the track
  centerline with lookahead steering, throttle proportional to an
  "aggressiveness" stat, and drift into sharper corners for their own
  mini-turbos.
- **Item system** (`src/game/items.js`) — pickup boxes placed at fixed
  intervals around the track; two item types: a **speed boost** and an
  **offensive shell-style item** that stuns the nearest opponent ahead
  within range. AI uses items opportunistically.
- **Camera** (`src/game/camera.js`) — smoothed chase camera following the
  player kart, with a raycast-based collision-avoidance pass that pulls the
  camera closer if a roadside prop would otherwise occlude/clip it.
- **HUD & menus** (`src/ui/HUD.js`, `src/ui/MenuScreen.js`,
  `src/ui/ResultsScreen.js`) — speed readout, lap counter, race position,
  held-item indicator, drift-charge indicator; a character-select menu with
  stat bars; a results screen with finish times/standings, "race again" and
  "main menu" actions.
- **Lap counting & race flow** (`src/game/raceLogic.js`) — progress-around-
  curve tracking per kart, lap increment on finish-line crossing, 3-lap
  races, live standings computed from lap + progress (falls back to finish
  time once a kart completes the race).

## Known limitations / untested

- **Not tested on a real device or in Expo Go.** This was built in a
  headless CLI environment with no phone, simulator, or GPU display
  attached, so `npx expo start` and on-device rendering have not been run
  end-to-end. The code has been written to be internally consistent (no
  circular deps between physics/AI/track/camera modules) and reviewed by
  re-reading, but runtime bugs (Metro bundling issues, a wrong `expo-gl` /
  `three` / `expo-three` version pin, a typo caught only at runtime) are
  possible and should be expected on first run.
- **`npm install` has not been run in this environment** (no reliable
  network/npm registry access here), so dependency versions in
  `package.json` are believed-compatible pins for Expo SDK 51 but have not
  been resolved/installed/verified. If `expo install` reports mismatches,
  run `npx expo install --fix` to let Expo align versions.
- **Web target (`npx expo start --web`) is the least likely to work well**
  — `expo-gl` and `expo-sensors` (Accelerometer) have partial/inconsistent
  web support; touch controls should still work, tilt steering will
  silently no-op on web (falls back safely, does not crash).
- **Collision detection between karts, and kart-vs-scenery collision, is
  not implemented** — karts and props currently do not physically block
  each other; only camera-vs-scenery uses raycasting. This is the biggest
  functional gap vs. a full game and the next thing to add.
- **Track boundaries are not enforced** — a kart can currently drive off
  the road onto the surrounding ground plane without penalty; there's no
  off-track speed penalty or wall bounce-back.
- **Physics tuning is a first pass**, not iterated against real hands-on
  playtesting (impossible without a device here) — expect acceleration,
  drift feel, and AI difficulty to need adjustment once played for real.
- **No audio** — sound effects/music were out of scope for this slice.
- **Single track, single race mode** — no track selection, no cups/series,
  no multiplayer.
- **Performance on low-end devices is unverified** — the scene has a
  moderate prop count (~30 roadside objects) and 4 karts; if frame rate is
  poor on older phones, reducing scenery density in
  `src/game/track.js` (`buildScenery` step) is the first lever to pull.

## Project structure

```
App.js                      # screen state machine (menu / race / results)
src/
  game/
    modelSpec.js             # original character + kart data specs
    models.js                # builds Three.js meshes from specs
    track.js                 # procedural market-street track + scenery
    trackUtils.js             # curve sampling / nearest-point helpers
    physics.js               # acceleration/steering/drift/boost
    ai.js                     # AI opponent steering/throttle
    items.js                  # item boxes, boost/shell items
    camera.js                 # chase camera + collision avoidance
    raceLogic.js               # lap counting, standings
  scenes/
    RaceScene.js               # expo-gl + three.js scene setup & game loop
  ui/
    MenuScreen.js, HUD.js, ResultsScreen.js, TouchControls.js
  input/
    useTiltSteering.js         # expo-sensors accelerometer hook
```

## License / attribution

Original code in this repository. Architectural techniques (procedural
model-spec character building, drift-tier boost system, item-roulette
structure) are inspired by the MIT-licensed
[pattssun/OpenWii](https://github.com/pattssun/OpenWii) `games/mario-kart`
project; no assets, characters, or verbatim code from that project (or from
Nintendo's Mario Kart) are included.
