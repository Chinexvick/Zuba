// Simple item system: pickup boxes placed on the road, two item types
// (speed boost "Pepper Dash" and offensive "Okra Shell"), inspired in
// structure by held-item.js / item-roulette.js in the reference project
// but reimplemented from scratch and much simplified.
import * as THREE from 'three';
import { applyItemBoost, applyStun } from './physics';

export const ITEM_TYPES = {
  BOOST: 'boost',
  SHELL: 'shell',
};

export function placeItemBoxes(samples, count = 10) {
  const boxes = [];
  const step = Math.floor(samples.length / count);
  for (let i = 0; i < count; i++) {
    const idx = (i * step + 20) % samples.length;
    const p = samples[idx].clone();
    p.y = 0.5;
    boxes.push({ id: `box-${i}`, position: p, active: true, respawnTimer: 0 });
  }
  return boxes;
}

export function buildItemBoxMesh() {
  const geo = new THREE.OctahedronGeometry(0.5, 0);
  const mat = new THREE.MeshStandardMaterial({
    color: '#f4c542',
    emissive: '#e0552b',
    emissiveIntensity: 0.4,
    metalness: 0.3,
    roughness: 0.3,
  });
  return new THREE.Mesh(geo, mat);
}

export function rollItem() {
  return Math.random() < 0.55 ? ITEM_TYPES.BOOST : ITEM_TYPES.SHELL;
}

export function updateItemBoxes(boxes, dt) {
  for (const box of boxes) {
    if (!box.active) {
      box.respawnTimer -= dt;
      if (box.respawnTimer <= 0) box.active = true;
    }
  }
}

export function checkItemPickup(kart, boxes) {
  if (kart.itemSlot) return;
  for (const box of boxes) {
    if (!box.active) continue;
    if (box.position.distanceTo(kart.position) < 1.4) {
      box.active = false;
      box.respawnTimer = 6;
      kart.itemSlot = rollItem();
      return box.id;
    }
  }
  return null;
}

// Use held item: BOOST applies immediately to self; SHELL launches a
// projectile that is resolved simply (nearest kart ahead within range gets stunned).
export function useItem(kart, allKarts) {
  if (!kart.itemSlot) return null;
  const type = kart.itemSlot;
  kart.itemSlot = null;
  if (type === ITEM_TYPES.BOOST) {
    applyItemBoost(kart, 1.8, 1.4);
    return { type, target: kart };
  }
  if (type === ITEM_TYPES.SHELL) {
    // find nearest opponent within 12m ahead along heading
    const forward = new THREE.Vector3(Math.sin(kart.heading), 0, Math.cos(kart.heading));
    let best = null;
    let bestDist = 12;
    for (const other of allKarts) {
      if (other === kart) continue;
      const toOther = new THREE.Vector3().subVectors(other.position, kart.position);
      const dist = toOther.length();
      if (dist > bestDist) continue;
      const dot = toOther.clone().normalize().dot(forward);
      if (dot > 0.6) {
        best = other;
        bestDist = dist;
      }
    }
    if (best) applyStun(best, 1.4);
    return { type, target: best };
  }
  return null;
}
