// Procedural "African Market Street" track: a closed-loop path built from control
// points, with road mesh extruded along it, plus procedurally generated market
// stalls, buildings, matatu-style vehicles and crowd props as roadside scenery.
// Everything is generated with Three.js primitives/canvas textures — no external
// asset files required to run.
import * as THREE from 'three';

// Closed-loop control points (x, z) describing a street circuit with a couple of
// market-square widenings. Units are world meters.
export const TRACK_CONTROL_POINTS = [
  [0, 0],
  [20, -6],
  [45, -4],
  [60, 10],
  [65, 35],
  [55, 55],
  [30, 62],
  [5, 58],
  [-20, 50],
  [-35, 30],
  [-32, 5],
  [-15, -10],
];

const ROAD_WIDTH = 10;

export function buildTrackPath() {
  const points = TRACK_CONTROL_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z));
  return new THREE.CatmullRomCurve3(points, true, 'catmullrom', 0.5);
}

function makeCanvasTexture(draw, size = 256) {
  // React Native / expo-gl has no DOM canvas by default; fall back to solid
  // color data textures generated procedurally in pure JS instead of using
  // CanvasRenderingContext2D (keeps this fully native-compatible).
  const data = new Uint8Array(size * size * 4);
  draw(data, size);
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function roadTexture() {
  return makeCanvasTexture((data, size) => {
    const base = [66, 62, 58];
    const line = [230, 210, 150];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const noise = Math.floor(Math.random() * 10) - 5;
        let [r, g, b] = base;
        // painted dashed centerline pattern band
        const bandY = y % 64;
        const isCenter = x > size / 2 - 4 && x < size / 2 + 4 && bandY < 32;
        if (isCenter) [r, g, b] = line;
        data[i] = Math.max(0, Math.min(255, r + noise));
        data[i + 1] = Math.max(0, Math.min(255, g + noise));
        data[i + 2] = Math.max(0, Math.min(255, b + noise));
        data[i + 3] = 255;
      }
    }
  }, 128);
}

export function buildRoadMesh(curve) {
  const segments = 240;
  const positions = [];
  const uvs = [];
  const indices = [];

  const pts = curve.getSpacedPoints(segments);
  for (let i = 0; i <= segments; i++) {
    const p = pts[i % pts.length];
    const next = pts[(i + 1) % pts.length];
    const dir = new THREE.Vector3().subVectors(next, p).normalize();
    const normal = new THREE.Vector3(-dir.z, 0, dir.x);
    const left = new THREE.Vector3().copy(p).addScaledVector(normal, ROAD_WIDTH / 2);
    const right = new THREE.Vector3().copy(p).addScaledVector(normal, -ROAD_WIDTH / 2);
    positions.push(left.x, 0, left.z, right.x, 0, right.z);
    const v = (i / segments) * 20;
    uvs.push(0, v, 1, v);
  }
  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = i * 2 + 2;
    const d = i * 2 + 3;
    indices.push(a, c, b, b, c, d);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    map: roadTexture(),
    roughness: 0.95,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'road';
  return mesh;
}

function buildGround() {
  const geo = new THREE.PlaneGeometry(400, 400);
  const mat = new THREE.MeshStandardMaterial({ color: '#c98a3f', roughness: 1 });
  const ground = new THREE.Mesh(geo, mat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  ground.name = 'ground';
  return ground;
}

function buildSky() {
  const geo = new THREE.SphereGeometry(300, 16, 16);
  const mat = new THREE.MeshBasicMaterial({ color: '#ffb15c', side: THREE.BackSide });
  const sky = new THREE.Mesh(geo, mat);
  sky.name = 'sky';
  return sky;
}

const STALL_COLORS = ['#e0552b', '#2b7a4b', '#233b8a', '#f4c542', '#7a2be0', '#c0392b'];

function buildMarketStall(color) {
  const group = new THREE.Group();
  const postMat = new THREE.MeshStandardMaterial({ color: '#5a3d22' });
  const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2, 6);
  const positions = [
    [-1, 1, -0.8],
    [1, 1, -0.8],
    [-1, 1, 0.8],
    [1, 1, 0.8],
  ];
  for (const [x, y, z] of positions) {
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(x, y, z);
    group.add(post);
  }
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.7, 0.9, 4),
    new THREE.MeshStandardMaterial({ color })
  );
  roof.rotation.y = Math.PI / 4;
  roof.position.y = 2.4;
  group.add(roof);

  const counter = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.7, 1.5),
    new THREE.MeshStandardMaterial({ color: '#8a5a34' })
  );
  counter.position.y = 0.35;
  group.add(counter);

  // small produce props on the counter
  for (let i = 0; i < 4; i++) {
    const fruit = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 8, 8),
      new THREE.MeshStandardMaterial({ color: STALL_COLORS[(i + 1) % STALL_COLORS.length] })
    );
    fruit.position.set(-0.7 + i * 0.45, 0.78, 0.2);
    group.add(fruit);
  }

  return group;
}

function buildBuilding(width, height, depth, color, signColor) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.85 })
  );
  body.position.y = height / 2;
  group.add(body);

  // painted sign board
  const sign = new THREE.Mesh(
    new THREE.BoxGeometry(width * 0.7, height * 0.18, 0.1),
    new THREE.MeshStandardMaterial({ color: signColor })
  );
  sign.position.set(0, height * 0.75, depth / 2 + 0.06);
  group.add(sign);

  // windows grid
  const winMat = new THREE.MeshStandardMaterial({ color: '#2b2b2b' });
  const rows = Math.max(1, Math.floor(height / 2.2));
  const cols = Math.max(1, Math.floor(width / 1.6));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.05), winMat);
      win.position.set(
        -width / 2 + 1 + c * 1.6,
        1.2 + r * 2.0,
        depth / 2 + 0.03
      );
      group.add(win);
    }
  }
  return group;
}

// Simplified matatu / painted minibus as a roadside decorative prop.
function buildMatatu(color) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 1.5, 3.6),
    new THREE.MeshStandardMaterial({ color })
  );
  body.position.y = 1.0;
  group.add(body);
  const stripe = new THREE.Mesh(
    new THREE.BoxGeometry(1.82, 0.3, 3.62),
    new THREE.MeshStandardMaterial({ color: '#f4c542' })
  );
  stripe.position.y = 0.75;
  group.add(stripe);
  const windows = new THREE.Mesh(
    new THREE.BoxGeometry(1.75, 0.5, 3.4),
    new THREE.MeshStandardMaterial({ color: '#8fd3e8', opacity: 0.85, transparent: true })
  );
  windows.position.y = 1.5;
  group.add(windows);
  const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 10);
  const wheelMat = new THREE.MeshStandardMaterial({ color: '#151515' });
  for (const [x, z] of [
    [-0.95, -1.2],
    [0.95, -1.2],
    [-0.95, 1.2],
    [0.95, 1.2],
  ]) {
    const wheel = new THREE.Mesh(wheelGeo, wheelMat);
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(x, 0.32, z);
    group.add(wheel);
  }
  return group;
}

function buildCrowdFigure(color) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.18, 0.5, 4, 8),
    new THREE.MeshStandardMaterial({ color })
  );
  body.position.y = 0.6;
  group.add(body);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 8, 8),
    new THREE.MeshStandardMaterial({ color: '#6b4226' })
  );
  head.position.y = 1.05;
  group.add(head);
  return group;
}

// Scatter roadside scenery just outside the road edges along the curve.
export function buildScenery(curve, scene) {
  const segments = 90;
  const pts = curve.getSpacedPoints(segments);
  let stallToggle = 0;
  for (let i = 0; i < segments; i += 3) {
    const p = pts[i];
    const next = pts[(i + 1) % pts.length];
    const dir = new THREE.Vector3().subVectors(next, p).normalize();
    const normal = new THREE.Vector3(-dir.z, 0, dir.x);

    const side = i % 6 < 3 ? 1 : -1;
    const offset = ROAD_WIDTH / 2 + 2.5 + (i % 5) * 0.6;
    const pos = new THREE.Vector3().copy(p).addScaledVector(normal, side * offset);

    const choice = i % 9;
    let prop;
    if (choice < 4) {
      prop = buildMarketStall(STALL_COLORS[stallToggle % STALL_COLORS.length]);
      stallToggle++;
    } else if (choice < 6) {
      prop = buildBuilding(
        4 + (i % 3),
        4 + (i % 4),
        3,
        STALL_COLORS[(i + 2) % STALL_COLORS.length],
        STALL_COLORS[(i + 4) % STALL_COLORS.length]
      );
    } else if (choice < 7) {
      prop = buildMatatu(STALL_COLORS[(i + 1) % STALL_COLORS.length]);
      prop.rotation.y = Math.atan2(dir.x, dir.z) + (side > 0 ? Math.PI / 2 : -Math.PI / 2);
    } else {
      prop = buildCrowdFigure(STALL_COLORS[(i + 3) % STALL_COLORS.length]);
    }
    prop.position.copy(pos);
    if (choice < 6) {
      prop.rotation.y = Math.atan2(dir.x, dir.z);
    }
    scene.add(prop);
  }
}

export function buildTrack(scene) {
  const curve = buildTrackPath();
  const road = buildRoadMesh(curve);
  scene.add(buildGround());
  scene.add(buildSky());
  scene.add(road);
  buildScenery(curve, scene);

  // simple hemisphere + directional light for warm market-afternoon look
  const hemi = new THREE.HemisphereLight('#ffe3b0', '#7a4a22', 0.9);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff1d0', 1.1);
  sun.position.set(40, 60, 20);
  scene.add(sun);

  return { curve, road };
}

export const TRACK_WIDTH = ROAD_WIDTH;
