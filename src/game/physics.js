// Kart driving physics: acceleration, braking, steering, and a two-tier
// mini-turbo drift/boost system, inspired by (not copied from) the drift
// accumulation approach in OpenWii's mario-kart `glide.js`/`logic.js`.
import * as THREE from 'three';

export const DRIFT_TIERS = [
  { threshold: 0.9, boost: 1.35, duration: 0.9, color: '#4fd1ff' }, // blue spark
  { threshold: 1.8, boost: 1.7, duration: 1.3, color: '#ffb703' }, // orange spark
];

const MAX_STEER = 0.55; // radians/sec at full lock
const DRIFT_STEER_BONUS = 0.35;
const GRAVITY_STICK = 12; // pseudo-gravity keeping kart on road plane

export function createKartState(spec, startPos, startHeading) {
  return {
    spec,
    position: startPos.clone(),
    heading: startHeading, // radians, 0 = +z forward is handled via velocity vector
    velocity: new THREE.Vector3(),
    speed: 0,
    steerInput: 0,
    throttleInput: 0,
    brakeInput: 0,
    isDrifting: false,
    driftDirection: 0,
    driftCharge: 0,
    boostTimer: 0,
    boostPower: 1,
    lap: 0,
    lapProgress: 0, // 0..1 around the curve, used for lap counting + AI + rubber-band
    lastLapProgress: 0,
    itemSlot: null,
    stunTimer: 0,
    finished: false,
    finishTime: 0,
  };
}

// Returns forward-facing unit vector from heading.
function headingToDir(heading) {
  return new THREE.Vector3(Math.sin(heading), 0, Math.cos(heading));
}

export function updateKartPhysics(kart, dt, raceTime) {
  const { spec } = kart;
  const topSpeed = 14 + spec.stats.topSpeed * 12; // m/s
  const accel = 6 + spec.stats.acceleration * 8;
  const handling = 1.6 + spec.stats.handling * 1.6;
  const weight = 0.6 + spec.stats.weight * 0.6;

  if (kart.stunTimer > 0) {
    kart.stunTimer -= dt;
    kart.throttleInput = 0;
  }

  // Speed integration
  let targetSpeed = 0;
  if (kart.throttleInput > 0) targetSpeed = topSpeed * kart.throttleInput;
  if (kart.brakeInput > 0) targetSpeed = -6 * kart.brakeInput;

  const accelRate = kart.speed < targetSpeed ? accel / weight : accel * 1.6;
  if (kart.speed < targetSpeed) {
    kart.speed = Math.min(targetSpeed, kart.speed + accelRate * dt);
  } else {
    kart.speed = Math.max(targetSpeed, kart.speed - accelRate * dt);
  }
  // natural drag
  kart.speed *= 1 - Math.min(0.6, 0.15 * dt);

  // boost timer (from mini-turbo or item)
  if (kart.boostTimer > 0) {
    kart.boostTimer -= dt;
    kart.speed = Math.min(topSpeed * kart.boostPower, kart.speed + accel * 2 * dt);
    if (kart.boostTimer <= 0) kart.boostPower = 1;
  }

  // Steering + drift
  const steerAmount = kart.steerInput * MAX_STEER * handling * (0.4 + Math.min(1, Math.abs(kart.speed) / 6));
  let effectiveSteer = steerAmount;

  if (kart.isDrifting && kart.driftDirection !== 0) {
    effectiveSteer =
      kart.driftDirection * (MAX_STEER * 0.55) + steerAmount * 0.5 + kart.driftDirection * DRIFT_STEER_BONUS * handling * 0.3;
    kart.driftCharge += dt * (0.6 + Math.abs(kart.steerInput) * 0.4);
  }

  kart.heading += effectiveSteer * dt;

  const dir = headingToDir(kart.heading);
  kart.velocity.copy(dir).multiplyScalar(kart.speed);
  kart.position.addScaledVector(kart.velocity, dt);

  return kart;
}

// Call when drift button pressed while turning at speed.
export function startDrift(kart, direction) {
  if (Math.abs(kart.speed) < 6) return;
  kart.isDrifting = true;
  kart.driftDirection = direction;
  kart.driftCharge = 0;
}

// Call when drift button released: grants mini-turbo boost based on charge tier.
export function releaseDrift(kart) {
  if (!kart.isDrifting) return;
  let tier = null;
  for (let i = DRIFT_TIERS.length - 1; i >= 0; i--) {
    if (kart.driftCharge >= DRIFT_TIERS[i].threshold) {
      tier = DRIFT_TIERS[i];
      break;
    }
  }
  if (tier) {
    kart.boostTimer = tier.duration;
    kart.boostPower = tier.boost;
    kart.lastBoostColor = tier.color;
  }
  kart.isDrifting = false;
  kart.driftDirection = 0;
  kart.driftCharge = 0;
}

export function currentDriftTier(kart) {
  let tier = -1;
  for (let i = 0; i < DRIFT_TIERS.length; i++) {
    if (kart.driftCharge >= DRIFT_TIERS[i].threshold) tier = i;
  }
  return tier;
}

export function applyItemBoost(kart, boostPower = 1.6, duration = 1.2) {
  kart.boostTimer = Math.max(kart.boostTimer, duration);
  kart.boostPower = Math.max(kart.boostPower, boostPower);
}

export function applyStun(kart, duration = 1.4) {
  kart.stunTimer = duration;
  kart.speed *= 0.2;
}

// --- Kart-vs-kart collision -------------------------------------------------
// Simple circle-vs-circle push-apart (soft body, not a full rigid-body sim):
// overlapping karts are separated along the line between their centers and
// both lose a little speed, proportional to how hard they hit. Runs once per
// frame over every pair; kart count here is small (player + a few AI) so an
// O(n^2) sweep is fine.
const KART_RADIUS = 0.9; // approx. half-width of a kart body for collision purposes

export function resolveKartCollisions(karts) {
  for (let i = 0; i < karts.length; i++) {
    for (let j = i + 1; j < karts.length; j++) {
      const a = karts[i];
      const b = karts[j];
      const dx = b.position.x - a.position.x;
      const dz = b.position.z - a.position.z;
      const distSq = dx * dx + dz * dz;
      const minDist = KART_RADIUS * 2;
      if (distSq >= minDist * minDist || distSq < 1e-6) continue;

      const dist = Math.sqrt(distSq);
      const overlap = minDist - dist;
      const nx = dx / dist;
      const nz = dz / dist;

      // push both karts apart equally along the collision normal
      a.position.x -= nx * overlap * 0.5;
      a.position.z -= nz * overlap * 0.5;
      b.position.x += nx * overlap * 0.5;
      b.position.z += nz * overlap * 0.5;

      // bump: bleed off some speed on both, a bit more for the faster one,
      // and nudge heading slightly away from the hit so it reads as a shove
      // rather than a wall stop
      const relSpeed = Math.abs(a.speed) + Math.abs(b.speed);
      const speedLoss = Math.min(0.35, relSpeed * 0.02);
      a.speed *= 1 - speedLoss;
      b.speed *= 1 - speedLoss;
      a.heading -= Math.sign(a.speed || 1) * 0.02;
      b.heading += Math.sign(b.speed || 1) * 0.02;
    }
  }
}

// --- Kart-vs-scenery collision ----------------------------------------------
// `obstacles` is an array of { x, z, radius } circles built alongside the
// roadside props in track.js. Karts are pushed back out of any circle they
// penetrate and lose speed proportional to the impact, like driving into a
// market stall.
const KART_SCENERY_RADIUS = 0.8;

export function resolveSceneryCollisions(kart, obstacles) {
  if (!obstacles || !obstacles.length) return;
  for (let k = 0; k < obstacles.length; k++) {
    const ob = obstacles[k];
    const dx = kart.position.x - ob.x;
    const dz = kart.position.z - ob.z;
    const distSq = dx * dx + dz * dz;
    const minDist = KART_SCENERY_RADIUS + ob.radius;
    if (distSq >= minDist * minDist || distSq < 1e-6) continue;

    const dist = Math.sqrt(distSq);
    const overlap = minDist - dist;
    const nx = dx / dist;
    const nz = dz / dist;
    kart.position.x += nx * overlap;
    kart.position.z += nz * overlap;
    kart.speed *= Math.max(0.35, 1 - overlap * 0.5);
  }
}

// --- Off-track boundary enforcement -----------------------------------------
// The track has no physical rails, so straying past the road edge just
// costs speed (like driving onto dirt/gravel) rather than hard-blocking the
// kart — this fits the open market-street layout better than a wall bounce.
export function applyOffTrackPenalty(kart, distanceFromCenter, trackHalfWidth, dt) {
  const overshoot = distanceFromCenter - trackHalfWidth;
  kart.offTrack = overshoot > 0;
  if (overshoot <= 0) return;
  // heavier drag the further off-road, capped so it doesn't feel like a wall
  const dragPerSecond = Math.min(0.9, 0.35 + overshoot * 0.06);
  kart.speed *= Math.max(0, 1 - dragPerSecond * dt);
}
