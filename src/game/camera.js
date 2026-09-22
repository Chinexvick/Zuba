// Chase camera that follows the player's kart with smoothing and a simple
// raycast-based collision avoidance: pulls the camera in toward the kart if
// a roadside prop would otherwise clip through it. Loosely inspired by the
// intent of camera-collision.js / driver-camera-anchor.js in the reference
// project, reimplemented simply for a single-device mobile context.
import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const desiredOffset = new THREE.Vector3(0, 3.2, -6.5);
const lookOffset = new THREE.Vector3(0, 1.0, 3);

export function updateChaseCamera(camera, kart, dt, scene, collidables) {
  const heading = kart.heading;
  const rotatedOffset = desiredOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), heading);
  let targetPos = kart.position.clone().add(rotatedOffset);

  // simple collision avoidance: cast from kart to desired camera position
  if (collidables && collidables.length) {
    const from = kart.position.clone().add(new THREE.Vector3(0, 1.2, 0));
    const dir = new THREE.Vector3().subVectors(targetPos, from);
    const dist = dir.length();
    dir.normalize();
    raycaster.set(from, dir);
    raycaster.far = dist;
    const hits = raycaster.intersectObjects(collidables, true);
    if (hits.length > 0) {
      const hit = hits[0];
      targetPos = from.clone().addScaledVector(dir, Math.max(1.5, hit.distance * 0.85));
    }
  }

  const smoothing = 1 - Math.pow(0.001, dt);
  camera.position.lerp(targetPos, smoothing);

  const rotatedLook = lookOffset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), heading);
  const lookAt = kart.position.clone().add(rotatedLook);
  camera.lookAt(lookAt);
}
