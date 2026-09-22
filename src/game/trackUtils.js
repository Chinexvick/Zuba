// Helpers for measuring progress along the closed track curve and snapping
// karts/AI to a driveable line — shared by physics, AI, camera and lap logic.
import * as THREE from 'three';

const SAMPLE_COUNT = 400;

export function sampleCurve(curve) {
  const points = curve.getSpacedPoints(SAMPLE_COUNT);
  return points;
}

// Finds the nearest sample index to a world position; returns { index, t, distance }.
export function nearestPointOnCurve(samples, position) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < samples.length; i++) {
    const d = samples[i].distanceToSquared(position);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return { index: best, t: best / samples.length, distance: Math.sqrt(bestDist) };
}

export function curveTangent(samples, index) {
  const a = samples[index];
  const b = samples[(index + 1) % samples.length];
  return new THREE.Vector3().subVectors(b, a).normalize();
}

export function startGridPosition(samples, slot) {
  // Slot 0 is pole; spread karts across the road width in a staggered grid,
  // slightly behind the start line (index 0).
  const startIndex = Math.max(0, samples.length - 6 - Math.floor(slot / 2) * 4);
  const p = samples[startIndex % samples.length].clone();
  const tangent = curveTangent(samples, startIndex % samples.length);
  const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);
  const side = slot % 2 === 0 ? 1 : -1;
  p.addScaledVector(normal, side * 2.2);
  const heading = Math.atan2(tangent.x, tangent.z);
  return { position: p, heading };
}
