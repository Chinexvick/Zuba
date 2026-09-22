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
- **Collision physics** (`src/game/physics.js`) — `resolveKartCollisions`
  does a circle-vs-circle push-apart between every pair of karts each frame
  (soft-body separation plus a little speed bleed, so bumping another kart
  slows both of you down a bit rather than clipping through); `track.js`'s
  `buildScenery` now returns collision circles for stalls, buildings and
  matatus, and `resolveSceneryCollisions` pushes karts back out of them with
  a speed penalty on impact (crowd figures stay non-blocking).
- **Off-track boundary** (`applyOffTrackPenalty` in `physics.js`) — no hard
  wall/rail; a kart that strays past the road edge (measured against its
  nearest-point-on-curve distance, same sampling raceLogic already does for
  lap progress) gets progressively more speed drag the further off-road it
  goes. This was chosen over a rigid rail because the market-street track
  has open square-like widenings where a wall would feel wrong.
- **Audio** (`src/audio/soundEngine.js`) — procedurally synthesized, no
  external asset files: raw PCM sample data (sawtooth/sine oscillators plus
  a deterministic noise function) is generated in pure JS, packed into a WAV
  container, base64-encoded, and played via `expo-av` from a `data:` URI.
  Covers a looping engine hum (pitch/volume follow the player kart's speed
  via `setStatusAsync({ rate })`, boosted further while a mini-turbo/item
  boost is active), a mini-turbo boost whoosh, an item-pickup blip, and a
  shell-hit thud. Only the player's actions trigger one-shot sfx (AI karts
  don't spam sound); init/shutdown fail soft (logs a warning, race stays
  playable silently) if `expo-av` or audio playback isn't available on a
  given platform.

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
- **Kart-vs-kart and kart-vs-scenery collisions, and the off-track
  penalty, are implemented but unverified at runtime** — the same caveat as
  the rest of this slice: written to be internally consistent (circle-vs-
  circle math, unit-tested only by re-reading, not by running) but not
  played on a device. Tuning values (collision radii, push-apart strength,
  off-track drag curve) are first-pass guesses likely to need adjustment.
- **Audio is implemented but unverified at runtime** — the WAV-synthesis +
  `expo-av` playback path (`src/audio/soundEngine.js`) has been reviewed by
  re-reading (WAV header layout, base64 encoding, PCM sample generation)
  but never actually played back, since this environment has no
  speaker/device. If `expo-av`'s `Audio.Sound.createAsync` rejects a
  `data:` URI on some platform, or `setStatusAsync({ rate })` behaves
  differently than expected, engine pitch or one-shot playback may need
  adjustment — the module fails soft either way (logs and continues
  without sound) rather than crashing the race.
- **Physics tuning is a first pass**, not iterated against real hands-on
  playtesting (impossible without a device here) — expect acceleration,
  drift feel, collision response, and AI difficulty to need adjustment once
  played for real.
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
  audio/
    soundEngine.js              # procedural WAV synthesis + expo-av playback
```

## License / attribution

Original code in this repository. Architectural techniques (procedural
model-spec character building, drift-tier boost system, item-roulette
structure) are inspired by the MIT-licensed
[pattssun/OpenWii](https://github.com/pattssun/OpenWii) `games/mario-kart`
project; no assets, characters, or verbatim code from that project (or from
Nintendo's Mario Kart) are included.
