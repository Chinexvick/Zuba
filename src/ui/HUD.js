import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TOTAL_LAPS } from '../game/raceLogic';

export default function HUD({ speedKmh, lap, position, totalRacers, itemSlot, driftTier }) {
  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.topLeft}>
        <Text style={styles.lapText}>LAP {Math.min(lap + 1, TOTAL_LAPS)}/{TOTAL_LAPS}</Text>
        <Text style={styles.posText}>{position}/{totalRacers}</Text>
      </View>
      <View style={styles.topRight}>
        <View style={[styles.itemBox, itemSlot && styles.itemBoxFilled]}>
          <Text style={styles.itemText}>{itemSlot ? itemSlot.toUpperCase() : ''}</Text>
        </View>
      </View>
      <View style={styles.bottomCenter}>
        <Text style={styles.speedText}>{Math.round(speedKmh)} km/h</Text>
        {driftTier >= 0 && (
          <Text style={[styles.driftText, driftTier >= 1 && styles.driftTextHot]}>
            {driftTier >= 1 ? 'MINI-TURBO!' : 'CHARGING...'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...StyleSheet.absoluteFillObject },
  topLeft: { position: 'absolute', top: 14, left: 14 },
  topRight: { position: 'absolute', top: 14, right: 14 },
  bottomCenter: { position: 'absolute', bottom: 100, alignSelf: 'center', alignItems: 'center' },
  lapText: { color: '#fff', fontSize: 20, fontWeight: '800', textShadowColor: '#000', textShadowRadius: 4 },
  posText: { color: '#f4c542', fontSize: 16, fontWeight: '700' },
  speedText: { color: '#fff', fontSize: 28, fontWeight: '900', textShadowColor: '#000', textShadowRadius: 6 },
  driftText: { color: '#4fd1ff', fontWeight: '800', fontSize: 14 },
  driftTextHot: { color: '#ffb703' },
  itemBox: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBoxFilled: { backgroundColor: 'rgba(244,197,66,0.85)' },
  itemText: { fontSize: 9, fontWeight: '800', color: '#1a1108' },
});
