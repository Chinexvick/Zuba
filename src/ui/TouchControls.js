// On-screen touch controls: left/right steer, accelerate, brake, drift, item.
// Self-contained single-device controls — no second-screen/controller pairing.
import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

function ControlButton({ label, style, onPressIn, onPressOut, onPress }) {
  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

export default function TouchControls({ inputRef, onUseItem, useTilt, onToggleTilt }) {
  const setSteer = (v) => {
    inputRef.current.steerTouch = v;
  };
  const setThrottle = (v) => {
    inputRef.current.throttle = v;
  };
  const setBrake = (v) => {
    inputRef.current.brake = v;
  };
  const setDrift = (v) => {
    inputRef.current.driftHeld = v;
  };

  return (
    <View style={styles.root} pointerEvents="box-none">
      <View style={styles.leftCluster} pointerEvents="box-none">
        <ControlButton
          label="◀"
          style={styles.steerBtn}
          onPressIn={() => setSteer(-1)}
          onPressOut={() => setSteer(0)}
        />
        <ControlButton
          label="▶"
          style={styles.steerBtn}
          onPressIn={() => setSteer(1)}
          onPressOut={() => setSteer(0)}
        />
        <ControlButton
          label={useTilt ? 'TILT ON' : 'TILT OFF'}
          style={styles.tiltBtn}
          onPress={onToggleTilt}
        />
      </View>
      <View style={styles.rightCluster} pointerEvents="box-none">
        <ControlButton
          label="ITEM"
          style={styles.itemBtn}
          onPress={onUseItem}
        />
        <ControlButton
          label="DRIFT"
          style={styles.driftBtn}
          onPressIn={() => setDrift(true)}
          onPressOut={() => setDrift(false)}
        />
        <ControlButton
          label="BRAKE"
          style={styles.brakeBtn}
          onPressIn={() => setBrake(1)}
          onPressOut={() => setBrake(0)}
        />
        <ControlButton
          label="GO"
          style={styles.goBtn}
          onPressIn={() => setThrottle(1)}
          onPressOut={() => setThrottle(0)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 18,
  },
  leftCluster: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  rightCluster: { flexDirection: 'row', alignItems: 'flex-end', gap: 10 },
  button: {
    backgroundColor: 'rgba(20,15,10,0.55)',
    borderWidth: 2,
    borderColor: '#f4c542',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { backgroundColor: 'rgba(224,85,43,0.75)' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  steerBtn: { width: 64, height: 64, borderRadius: 32 },
  tiltBtn: { width: 90, height: 40, borderRadius: 20, marginLeft: 4 },
  itemBtn: { width: 66, height: 66, borderRadius: 33, backgroundColor: 'rgba(122,43,224,0.55)' },
  driftBtn: { width: 74, height: 74, borderRadius: 37 },
  brakeBtn: { width: 66, height: 66, borderRadius: 33 },
  goBtn: { width: 86, height: 86, borderRadius: 43, backgroundColor: 'rgba(43,122,75,0.65)' },
});
