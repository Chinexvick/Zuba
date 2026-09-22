// Procedurally synthesized audio: engine hum, drift spark, mini-turbo boost
// whoosh, and item pickup blip. No external asset files are used (matching
// the zero-external-asset approach the visuals take in track.js's hand-
// rolled DataTexture) — instead, raw PCM sample data is generated in pure
// JS, packed into a WAV container, and handed to expo-av as a base64 data
// URI. This works because expo-av can play any URI (including data: URIs)
// without needing real files or a DOM AudioContext, which React Native
// doesn't have.
import { Audio } from 'expo-av';

const SAMPLE_RATE = 22050;

function base64Encode(bytes) {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let i = 0;
  for (; i + 3 <= bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    result += CHARS[(n >> 18) & 63] + CHARS[(n >> 12) & 63] + CHARS[(n >> 6) & 63] + CHARS[n & 63];
  }
  const remaining = bytes.length - i;
  if (remaining === 1) {
    const n = bytes[i] << 16;
    result += CHARS[(n >> 18) & 63] + CHARS[(n >> 12) & 63] + '==';
  } else if (remaining === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8);
    result += CHARS[(n >> 18) & 63] + CHARS[(n >> 12) & 63] + CHARS[(n >> 6) & 63] + '=';
  }
  return result;
}

function encodeWav(samples) {
  const dataSize = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true); // byte rate (16-bit mono)
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);
  for (let i = 0; i < samples.length; i++) {
    view.setInt16(44 + i * 2, samples[i], true);
  }
  return new Uint8Array(buffer);
}

function toDataUri(samples) {
  return 'data:audio/wav;base64,' + base64Encode(encodeWav(samples));
}

function clamp(v) {
  return Math.max(-1, Math.min(1, v));
}

// Deterministic pseudo-noise (avoids relying on Math.random behaving the
// same across JS engines) used for screech/thud texture.
function noise(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

// Short, loopable low rumble: a detuned sawtooth stack plus a little noise,
// pitch-shifted at playback time (via setRateAsync) to track kart speed.
function synthEngineLoop() {
  const duration = 0.5;
  const n = Math.floor(SAMPLE_RATE * duration);
  const samples = new Int16Array(n);
  const baseFreq = 85;
  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    const phase = (t * baseFreq) % 1;
    let v = (phase * 2 - 1) * 0.6; // sawtooth
    v += Math.sin(2 * Math.PI * baseFreq * 2 * t) * 0.2;
    v += Math.sin(2 * Math.PI * baseFreq * 3.3 * t) * 0.1;
    v += noise(i * 0.5) * 0.08;
    const fade = Math.min(1, Math.min(i, n - i) / (SAMPLE_RATE * 0.02));
    v *= fade; // fade loop edges so the seam doesn't click
    samples[i] = Math.round(clamp(v) * 32767 * 0.5);
  }
  return samples;
}

function synthSweep({ duration = 0.4, freqStart = 300, freqEnd = 900, volume = 0.6 }) {
  const n = Math.floor(SAMPLE_RATE * duration);
  const samples = new Int16Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const freq = freqStart + (freqEnd - freqStart) * t;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const envelope = Math.sin(Math.PI * t);
    samples[i] = Math.round(clamp(Math.sin(phase) * envelope * volume) * 32767);
  }
  return samples;
}

function synthBlip({ freqs = [660, 990], duration = 0.18, volume = 0.55 }) {
  const n = Math.floor(SAMPLE_RATE * duration);
  const samples = new Int16Array(n);
  const segment = Math.floor(n / freqs.length);
  for (let i = 0; i < n; i++) {
    const segIndex = Math.min(freqs.length - 1, Math.floor(i / segment));
    const freq = freqs[segIndex];
    const t = i / SAMPLE_RATE;
    const localT = (i % segment) / segment;
    const envelope = Math.sin(Math.PI * Math.min(1, localT + 0.05));
    samples[i] = Math.round(clamp(Math.sin(2 * Math.PI * freq * t) * envelope * volume) * 32767);
  }
  return samples;
}

function synthNoiseBurst({ duration = 0.25, volume = 0.5 }) {
  const n = Math.floor(SAMPLE_RATE * duration);
  const samples = new Int16Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const envelope = Math.pow(1 - t, 2);
    samples[i] = Math.round(clamp(noise(i * 1.7) * envelope * volume) * 32767);
  }
  return samples;
}

const CLIPS = {
  engine: () => synthEngineLoop(),
  drift: () => synthNoiseBurst({ duration: 0.3, volume: 0.3 }),
  boost: () => synthSweep({ duration: 0.45, freqStart: 220, freqEnd: 1100, volume: 0.6 }),
  pickup: () => synthBlip({ freqs: [660, 990, 1320], duration: 0.18, volume: 0.5 }),
  shellHit: () => synthNoiseBurst({ duration: 0.3, volume: 0.6 }),
};

let sounds = null;
let engineSound = null;
let loaded = false;
let loadFailed = false;
let lastEngineRate = -1;

// Loads and starts the looping engine sound. Safe to call multiple times;
// fails soft (logs a warning, returns false) if expo-av or audio playback
// isn't available on this platform, so the race stays fully playable
// without sound rather than crashing.
export async function initAudio() {
  if (loaded) return true;
  if (loadFailed) return false;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    const built = {};
    for (const key of Object.keys(CLIPS)) {
      const uri = toDataUri(CLIPS[key]());
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: false, isLooping: key === 'engine', volume: key === 'engine' ? 0.3 : 0.7 }
      );
      built[key] = sound;
    }
    sounds = built;
    engineSound = built.engine;
    await engineSound.playAsync();
    loaded = true;
    return true;
  } catch (err) {
    console.warn('[audio] init failed, continuing without sound:', err && err.message ? err.message : err);
    loadFailed = true;
    return false;
  }
}

// Called from the frame loop with the player kart's current speed to vary
// engine pitch/volume. Fire-and-forget (not awaited by the caller) and
// internally throttled by the caller's own frame-skip logic if desired;
// this function itself is cheap to call every frame.
export function updateEngineAudio({ speed, topSpeed, boosting }) {
  if (!loaded || !engineSound) return;
  const ratio = Math.min(1, Math.abs(speed) / Math.max(1, topSpeed));
  const rate = Math.max(0.5, Math.min(2.5, 0.7 + ratio * 1.6 + (boosting ? 0.4 : 0)));
  // Skip redundant native calls when the rate barely changed.
  if (Math.abs(rate - lastEngineRate) < 0.03) return;
  lastEngineRate = rate;
  engineSound
    .setStatusAsync({ rate, shouldCorrectPitch: false, volume: 0.2 + ratio * 0.35 })
    .catch(() => {});
}

function playOneShot(key) {
  if (!loaded || !sounds || !sounds[key]) return;
  sounds[key].replayAsync().catch(() => {});
}

export const playDriftSpark = () => playOneShot('drift');
export const playBoost = () => playOneShot('boost');
export const playPickup = () => playOneShot('pickup');
export const playShellHit = () => playOneShot('shellHit');

export async function shutdownAudio() {
  if (!sounds) return;
  try {
    await Promise.all(Object.values(sounds).map((s) => s.unloadAsync().catch(() => {})));
  } catch (err) {
    // ignore
  }
  sounds = null;
  engineSound = null;
  loaded = false;
  loadFailed = false;
  lastEngineRate = -1;
}
