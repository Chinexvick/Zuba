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
