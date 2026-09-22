import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { CHARACTERS } from '../game/modelSpec';

export default function MenuScreen({ onStart }) {
  const [selected, setSelected] = useState(CHARACTERS[0].id);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>ZUBA KART</Text>
      <Text style={styles.subtitle}>African Market Street Circuit</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardRow}>
        {CHARACTERS.map((c) => (
          <Pressable
            key={c.id}
            onPress={() => setSelected(c.id)}
            style={[
              styles.card,
              { borderColor: c.kartColor },
              selected === c.id && styles.cardSelected,
            ]}
          >
            <View style={[styles.swatch, { backgroundColor: c.kartColor }]} />
            <Text style={styles.cardName}>{c.name}</Text>
            <Text style={styles.cardDesc}>{c.description}</Text>
            <View style={styles.statRow}>
              <StatBar label="SPD" value={c.stats.topSpeed} />
              <StatBar label="ACC" value={c.stats.acceleration} />
              <StatBar label="HDL" value={c.stats.handling} />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable style={styles.startBtn} onPress={() => onStart(selected)}>
        <Text style={styles.startText}>START RACE</Text>
      </Pressable>
    </View>
  );
}

function StatBar({ label, value }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statTrack}>
        <View style={[styles.statFill, { width: `${value * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2b1608', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#f4c542', fontSize: 42, fontWeight: '900', letterSpacing: 2 },
  subtitle: { color: '#e0552b', fontSize: 16, marginBottom: 24, fontWeight: '600' },
  cardRow: { maxHeight: 210, marginBottom: 24 },
  card: {
    width: 170,
    marginHorizontal: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  cardSelected: { backgroundColor: 'rgba(244,197,66,0.18)' },
  swatch: { width: '100%', height: 60, borderRadius: 8, marginBottom: 8 },
  cardName: { color: '#fff', fontWeight: '800', fontSize: 16 },
  cardDesc: { color: '#ddd', fontSize: 11, marginBottom: 8, height: 40 },
  statRow: { gap: 4 },
  statItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  statLabel: { color: '#f4c542', fontSize: 9, width: 30, fontWeight: '700' },
  statTrack: { flex: 1, height: 5, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 3 },
  statFill: { height: 5, backgroundColor: '#e0552b', borderRadius: 3 },
  startBtn: {
    backgroundColor: '#2b7a4b',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f4c542',
  },
  startText: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
});
