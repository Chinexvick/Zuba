import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';

export default function ResultsScreen({ standings, onRestart, onMenu }) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>RACE RESULTS</Text>
      <FlatList
        data={standings}
        keyExtractor={(item, i) => item.spec.id + i}
        style={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.pos}>{index + 1}</Text>
            <View style={[styles.swatch, { backgroundColor: item.spec.kartColor }]} />
            <Text style={styles.name}>{item.spec.name}{item.isPlayer ? ' (You)' : ''}</Text>
            <Text style={styles.time}>{item.finished ? `${item.finishTime.toFixed(1)}s` : 'DNF'}</Text>
          </View>
        )}
      />
      <View style={styles.btnRow}>
        <Pressable style={styles.btn} onPress={onRestart}>
          <Text style={styles.btnText}>RACE AGAIN</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.btnAlt]} onPress={onMenu}>
          <Text style={styles.btnText}>MAIN MENU</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#2b1608', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#f4c542', fontSize: 30, fontWeight: '900', marginBottom: 20 },
  list: { width: '85%', maxHeight: 320, marginBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  pos: { color: '#f4c542', fontWeight: '900', fontSize: 18, width: 30 },
  swatch: { width: 20, height: 20, borderRadius: 10, marginRight: 10 },
  name: { color: '#fff', fontWeight: '700', flex: 1 },
  time: { color: '#ddd', fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 14 },
  btn: {
    backgroundColor: '#2b7a4b',
    paddingVertical: 14,
    paddingHorizontal: 26,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#f4c542',
  },
  btnAlt: { backgroundColor: '#233b8a' },
  btnText: { color: '#fff', fontWeight: '800' },
});
