// Main race scene: sets up an expo-gl WebGL context + Three.js renderer,
// builds the track/karts, and runs the game loop each frame (physics, AI,
// items, camera, HUD state). Rendering stack differs from the browser-based
// Three.js reference (expo-gl instead of a DOM canvas), so the render/loop
// wiring here is written from scratch for React Native.
import React, { useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';
import { Renderer } from 'expo-three';

import { buildTrack, TRACK_WIDTH } from '../game/track';
import { buildKartWithDriver } from '../game/models';
import { CHARACTERS, getCharacter } from '../game/modelSpec';
import {
  createKartState,
  updateKartPhysics,
  startDrift,
  releaseDrift,
  currentDriftTier,
} from '../game/physics';
import { sampleCurve, nearestPointOnCurve, startGridPosition } from '../game/trackUtils';
import { createAIController, updateAI } from '../game/ai';
import { placeItemBoxes, buildItemBoxMesh, updateItemBoxes, checkItemPickup, useItem } from '../game/items';
import { updateChaseCamera } from '../game/camera';
import { updateLapProgress, computeStandings, TOTAL_LAPS } from '../game/raceLogic';

import HUD from '../ui/HUD';
import TouchControls from '../ui/TouchControls';
import { useTiltSteering } from '../input/useTiltSteering';

const AI_COUNT = 3;

export default function RaceScene({ characterId, onFinish }) {
  const inputRef = useRef({ steerTouch: 0, throttle: 0, brake: 0, driftHeld: false });
  const [useTilt, setUseTilt] = useState(true);
  const tiltRef = useTiltSteering(useTilt);

  const [hud, setHud] = useState({
    speedKmh: 0,
    lap: 0,
    position: 1,
    totalRacers: AI_COUNT + 1,
    itemSlot: null,
    driftTier: -1,
  });

  const worldRef = useRef(null); // holds three scene state across frames
  const finishedRef = useRef(false);

  const handleUseItem = useCallback(() => {
    const world = worldRef.current;
    if (!world) return;
    const result = useItem(world.player, world.allKarts);
    if (result) {
      setHud((h) => ({ ...h, itemSlot: null }));
    }
  }, []);

  const onContextCreate = useCallback(
    async (gl) => {
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor('#ffb15c', 1);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        62,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        500
      );

      const { curve } = buildTrack(scene);
      const samples = sampleCurve(curve);

      // collect roadside props for camera collision avoidance
      const collidables = [];
      scene.traverse((obj) => {
        if (obj.isMesh && obj.name !== 'road' && obj.name !== 'ground' && obj.name !== 'sky') {
          collidables.push(obj);
        }
      });

      const playerSpec = getCharacter(characterId);
      const aiSpecs = CHARACTERS.filter((c) => c.id !== characterId).slice(0, AI_COUNT);
      while (aiSpecs.length < AI_COUNT) aiSpecs.push(CHARACTERS[aiSpecs.length % CHARACTERS.length]);

      const allSpecs = [playerSpec, ...aiSpecs];
      const allKarts = [];
      const kartMeshes = [];
      const aiControllers = [];

      allSpecs.forEach((spec, i) => {
        const grid = startGridPosition(samples, i);
        const kartState = createKartState(spec, grid.position, grid.heading);
        kartState.isPlayer = i === 0;
        const mesh = buildKartWithDriver(spec);
        mesh.position.copy(grid.position);
        scene.add(mesh);
        allKarts.push(kartState);
        kartMeshes.push(mesh);
        if (i > 0) aiControllers.push(createAIController((i - 1) * 0.08));
      });

      const itemBoxes = placeItemBoxes(samples, 10);
      const itemMeshes = itemBoxes.map((box) => {
        const mesh = buildItemBoxMesh();
        mesh.position.copy(box.position);
        scene.add(mesh);
        return mesh;
      });

      worldRef.current = {
        scene,
        camera,
        renderer,
        curve,
        samples,
        player: allKarts[0],
        allKarts,
        kartMeshes,
        aiControllers,
        itemBoxes,
        itemMeshes,
        collidables,
        raceTime: 0,
      };

      let lastTime = Date.now();

      const animate = () => {
        requestAnimationFrame(animate);
        const now = Date.now();
        const dt = Math.min(0.05, (now - lastTime) / 1000);
        lastTime = now;

        const world = worldRef.current;
        if (!world) return;
        world.raceTime += dt;

        // --- player input ---
        const input = inputRef.current;
        const steer = Math.abs(tiltRef.current) > 0.05 ? tiltRef.current : input.steerTouch;
        world.player.steerInput = THREE.MathUtils.clamp(steer, -1, 1);
        world.player.throttleInput = input.throttle;
        world.player.brakeInput = input.brake;

        if (input.driftHeld && !world.player.isDrifting && Math.abs(world.player.steerInput) > 0.2) {
          startDrift(world.player, Math.sign(world.player.steerInput));
        } else if (!input.driftHeld && world.player.isDrifting) {
          releaseDrift(world.player);
        }

        // --- AI ---
        world.allKarts.forEach((kart, i) => {
          if (i === 0) return;
          const nearest = nearestPointOnCurve(world.samples, kart.position);
          updateAI(kart, world.aiControllers[i - 1], world.samples, nearest, dt);
          if (kart.aiWantsRelease) {
            releaseDrift(kart);
            kart.aiWantsRelease = false;
          }
          if (Math.random() < 0.004 && kart.itemSlot) {
            useItem(kart, world.allKarts);
          }
        });

        // --- physics ---
        world.allKarts.forEach((kart) => updateKartPhysics(kart, dt, world.raceTime));

        // --- lap progress ---
        world.allKarts.forEach((kart) => updateLapProgress(kart, world.samples, world.raceTime));

        // --- items ---
        updateItemBoxes(world.itemBoxes, dt);
        world.allKarts.forEach((kart) => checkItemPickup(kart, world.itemBoxes));
        world.itemMeshes.forEach((mesh, i) => {
          mesh.visible = world.itemBoxes[i].active;
          mesh.rotation.y += dt * 1.5;
        });

        // --- sync meshes ---
        world.allKarts.forEach((kart, i) => {
          const mesh = world.kartMeshes[i];
          mesh.position.copy(kart.position);
          mesh.rotation.y = kart.heading;
          const tilt = kart.isDrifting ? -kart.driftDirection * 0.15 : 0;
          mesh.rotation.z = tilt;
          const wheelSpin = kart.speed * dt * 2;
          mesh.userData.wheels?.forEach((w) => (w.rotation.x += wheelSpin));
        });

        // --- camera ---
        updateChaseCamera(camera, world.player, dt, scene, world.collidables);

        // --- HUD ---
        const standings = computeStandings(world.allKarts);
        const position = standings.indexOf(world.player) + 1;
        setHud({
          speedKmh: Math.max(0, world.player.speed) * 3.6,
          lap: world.player.lap,
          position,
          totalRacers: world.allKarts.length,
          itemSlot: world.player.itemSlot,
          driftTier: currentDriftTier(world.player),
        });

        if (world.player.finished && !finishedRef.current) {
          finishedRef.current = true;
          setTimeout(() => {
            const finalStandings = computeStandings(world.allKarts);
            onFinish(finalStandings);
          }, 400);
        }

        renderer.render(scene, camera);
        gl.endFrameEXP();
      };
      animate();
    },
    [characterId, onFinish, tiltRef]
  );

  return (
    <View style={styles.root}>
      <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
      <HUD {...hud} />
      <TouchControls
        inputRef={inputRef}
        onUseItem={handleUseItem}
        useTilt={useTilt}
        onToggleTilt={() => setUseTilt((v) => !v)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
});
