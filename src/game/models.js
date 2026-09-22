// Builds Three.js Object3Ds from the procedural specs in modelSpec.js.
// Everything is primitive geometry + flat/basic materials — no external assets.
import * as THREE from 'three';

function box(w, h, d, color) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7, metalness: 0.05 });
  return new THREE.Mesh(geo, mat);
}

function sphere(r, color) {
  const geo = new THREE.SphereGeometry(r, 12, 10);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
  return new THREE.Mesh(geo, mat);
}

// Build a simple, original stylized character rig out of primitives.
export function buildCharacter(spec) {
  const group = new THREE.Group();
  group.name = `character-${spec.id}`;

  const [bx, by, bz] = spec.bodyScale;
  const torso = box(0.5 * bx, 0.6 * by, 0.35 * bz, spec.outfit.top);
  torso.position.y = 0.75;
  group.add(torso);

  const beltStripe = box(0.52 * bx, 0.08, 0.37 * bz, spec.outfit.pattern);
  beltStripe.position.y = 0.5;
  group.add(beltStripe);

  const hips = box(0.45 * bx, 0.3, 0.32 * bz, spec.outfit.bottom);
  hips.position.y = 0.35;
  group.add(hips);

  // legs
  for (const side of [-1, 1]) {
    const leg = box(0.16, 0.35, 0.16, spec.outfit.bottom);
    leg.position.set(side * 0.13 * bx, 0.12, 0);
    group.add(leg);
  }

  // arms
  for (const side of [-1, 1]) {
    const arm = box(0.14, 0.45, 0.14, spec.skinColor);
    arm.position.set(side * (0.3 * bx + 0.05), 0.75, 0);
    arm.rotation.z = side * 0.15;
    group.add(arm);
  }

  const [hx, hy, hz] = spec.headScale;
  const head = sphere(0.28, spec.skinColor);
  head.scale.set(hx, hy, hz);
  head.position.y = 1.25;
  group.add(head);

  // simple face: two eye dots
  for (const side of [-1, 1]) {
    const eye = sphere(0.035, '#141414');
    eye.position.set(side * 0.1, 1.27, 0.25 * hz);
    group.add(eye);
  }
  const mouth = box(0.12, 0.03, 0.02, '#3a1a12');
  mouth.position.set(0, 1.14, 0.27 * hz);
  group.add(mouth);

  // hair cap (simple dome, sits under accessory if any)
  const hair = sphere(0.29, spec.hairColor);
  hair.scale.set(1, 0.6, 1);
  hair.position.y = 1.38;
  group.add(hair);

  // accessories — distinguishing silhouettes, not palette swaps
  switch (spec.accessory) {
    case 'headwrap': {
      const wrap = box(0.5, 0.28, 0.5, spec.accessoryColor);
      wrap.position.y = 1.55;
      group.add(wrap);
      const knot = sphere(0.1, spec.accessoryColor);
      knot.position.set(0, 1.72, -0.15);
      group.add(knot);
      break;
    }
    case 'cap': {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.18, 12),
        new THREE.MeshStandardMaterial({ color: spec.accessoryColor })
      );
      cap.position.y = 1.48;
      group.add(cap);
      const brim = box(0.35, 0.03, 0.2, spec.accessoryColor);
      brim.position.set(0, 1.42, 0.28);
      group.add(brim);
      break;
    }
    case 'headphones': {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.03, 8, 16, Math.PI),
        new THREE.MeshStandardMaterial({ color: spec.accessoryColor })
      );
      band.rotation.z = Math.PI;
      band.position.y = 1.5;
      group.add(band);
      for (const side of [-1, 1]) {
        const cup = new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 0.06, 10),
          new THREE.MeshStandardMaterial({ color: spec.accessoryColor })
        );
        cup.rotation.x = Math.PI / 2;
        cup.position.set(side * 0.29, 1.25, 0);
        group.add(cup);
      }
      break;
    }
    case 'bandana': {
      const band = box(0.5, 0.1, 0.5, spec.accessoryColor);
      band.position.y = 1.38;
      group.add(band);
      break;
    }
    default:
      break;
  }

  group.userData.spec = spec;
  return group;
}

// Simple original kart chassis, no Nintendo-style design; colors/variant driven by spec.
export function buildKart(spec, colorOverride) {
  const group = new THREE.Group();
  group.name = `kart-${spec.id}`;
  const color = colorOverride || spec.kartColor;

  const body = box(0.9, 0.28, 1.6, color);
  body.position.y = 0.32;
  group.add(body);

  const nose = box(0.7, 0.2, 0.4, '#efefef');
  nose.position.set(0, 0.34, -0.9);
  group.add(nose);

  const seat = box(0.55, 0.2, 0.5, '#1c1c1c');
  seat.position.set(0, 0.5, 0.15);
  group.add(seat);

  const spoiler = box(0.85, 0.08, 0.12, '#1c1c1c');
  spoiler.position.set(0, 0.55, 0.85);
  group.add(spoiler);

  const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.22, 14);
  const wheelMat = new THREE.MeshStandardMaterial({ color: '#161616', roughness: 0.9 });
  const wheelPositions = [
    [-0.5, 0.28, -0.65],
    [0.5, 0.28, -0.65],
    [-0.5, 0.28, 0.65],
    [0.5, 0.28, 0.65],
  ];
  group.userData.wheels = [];
  for (const [x, y, z] of wheelPositions) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, y, z);
    group.add(wheel);
    group.userData.wheels.push(wheel);
  }

  return group;
}

export function buildKartWithDriver(characterSpec, colorOverride) {
  const kart = buildKart(characterSpec, colorOverride);
  const driver = buildCharacter(characterSpec);
  driver.scale.set(0.72, 0.72, 0.72);
  driver.position.set(0, 0.38, 0.1);
  kart.add(driver);
  kart.userData.driver = driver;
  return kart;
}
