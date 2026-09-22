// Basic AI opponents: follow the track centerline with simple lookahead
// steering, throttle management, and occasional item use. Not a faithful
// port of any reference AI — a small original controller sufficient for a
// vertical slice.
import * as THREE from 'three';
import { curveTangent } from './trackUtils';

const LOOKAHEAD = 14;

export function createAIController(personalityJitter = 0) {
  return {
    targetIndex: 0,
    aggressiveness: 0.7 + personalityJitter,
  };
}

export function updateAI(kart, controller, samples, nearest, dt) {
  const lookaheadSteps = Math.round(LOOKAHEAD / (100 / samples.length));
  const targetIndex = (nearest.index + Math.max(6, lookaheadSteps)) % samples.length;
  const target = samples[targetIndex];

  const toTarget = new THREE.Vector3().subVectors(target, kart.position);
  const desiredHeading = Math.atan2(toTarget.x, toTarget.z);
  let headingDelta = desiredHeading - kart.heading;
  // normalize to [-PI, PI]
  headingDelta = Math.atan2(Math.sin(headingDelta), Math.cos(headingDelta));

  kart.steerInput = THREE.MathUtils.clamp(headingDelta * 2.2, -1, 1);
  kart.throttleInput = controller.aggressiveness;
  kart.brakeInput = Math.abs(headingDelta) > 0.9 ? 0.3 : 0;

  // AI drifts on sharper corners for mini-turbo, releasing after a short charge.
  const tangent = curveTangent(samples, nearest.index);
  const curveAhead = curveTangent(samples, targetIndex);
  const turnSharpness = 1 - tangent.dot(curveAhead);
  if (turnSharpness > 0.08 && Math.abs(kart.steerInput) > 0.4) {
    if (!kart.isDrifting) {
      kart.isDrifting = true;
      kart.driftDirection = Math.sign(kart.steerInput) || 1;
      kart.driftCharge = 0;
    }
  } else if (kart.isDrifting) {
    kart.aiWantsRelease = true;
  }
}
