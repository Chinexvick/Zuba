// Procedural character + kart model specifications.
// Inspired by the "model-spec.js" technique in pattssun/OpenWii's mario-kart game:
// characters are described as data (proportions, palette, accessories) and built
// procedurally out of primitive geometry, not palette-swapped from one mesh.
// All original characters — no Nintendo IP.

export const CHARACTERS = [
  {
    id: 'amara',
    name: 'Amara',
    description: 'Quick-witted market trader, built for tight corners.',
    skinColor: '#8a5a34',
    outfit: { top: '#e0552b', bottom: '#f4c542', pattern: '#2b2b2b' },
    headScale: [1.0, 1.05, 1.0],
    bodyScale: [0.85, 1.0, 0.85],
    accessory: 'headwrap', // tall folded fabric headwrap
    accessoryColor: '#e0552b',
    hairColor: '#1a1108',
    stats: { topSpeed: 0.82, acceleration: 0.95, handling: 0.95, weight: 0.6 },
    kartColor: '#e0552b',
  },
  {
    id: 'kofi',
    name: 'Kofi',
    description: 'Ex-matatu driver, heavy kart, brutal top speed.',
    skinColor: '#5c3a21',
    outfit: { top: '#2b7a4b', bottom: '#233b8a', pattern: '#f4c542' },
    headScale: [1.1, 1.0, 1.1],
    bodyScale: [1.15, 1.1, 1.15],
    accessory: 'cap',
    accessoryColor: '#233b8a',
    hairColor: '#0d0d0d',
    stats: { topSpeed: 0.98, acceleration: 0.7, handling: 0.65, weight: 0.95 },
    kartColor: '#2b7a4b',
  },
  {
    id: 'zola',
    name: 'Zola',
    description: 'Street-side DJ, light and nimble, big drift game.',
    skinColor: '#a5703f',
    outfit: { top: '#7a2be0', bottom: '#e0552b', pattern: '#f4c542' },
    headScale: [0.95, 1.0, 0.95],
    bodyScale: [0.75, 0.95, 0.75],
    accessory: 'headphones',
    accessoryColor: '#111111',
    hairColor: '#3a1a0a',
    stats: { topSpeed: 0.78, acceleration: 1.0, handling: 1.0, weight: 0.5 },
    kartColor: '#7a2be0',
  },
  {
    id: 'biko',
    name: 'Biko',
    description: 'Retired footballer, balanced all-rounder.',
    skinColor: '#3f2a1a',
    outfit: { top: '#f4c542', bottom: '#111111', pattern: '#e0552b' },
    headScale: [1.02, 1.0, 1.02],
    bodyScale: [1.0, 1.05, 1.0],
    accessory: 'bandana',
    accessoryColor: '#e0552b',
    hairColor: '#000000',
    stats: { topSpeed: 0.88, acceleration: 0.85, handling: 0.85, weight: 0.75 },
    kartColor: '#f4c542',
  },
];

export const KART_COLOR_VARIANTS = ['#e0552b', '#2b7a4b', '#233b8a', '#7a2be0', '#f4c542', '#c0392b'];

export function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
