import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import MenuScreen from './src/ui/MenuScreen';
import ResultsScreen from './src/ui/ResultsScreen';
import RaceScene from './src/scenes/RaceScene';

const SCREENS = { MENU: 'menu', RACE: 'race', RESULTS: 'results' };

export default function App() {
  const [screen, setScreen] = useState(SCREENS.MENU);
  const [characterId, setCharacterId] = useState(null);
  const [standings, setStandings] = useState([]);
  const [raceKey, setRaceKey] = useState(0);

  const handleStart = useCallback((id) => {
    setCharacterId(id);
    setRaceKey((k) => k + 1);
    setScreen(SCREENS.RACE);
  }, []);

  const handleFinish = useCallback((finalStandings) => {
    setStandings(finalStandings);
    setScreen(SCREENS.RESULTS);
  }, []);

  const handleRestart = useCallback(() => {
    setRaceKey((k) => k + 1);
    setScreen(SCREENS.RACE);
  }, []);

  const handleMenu = useCallback(() => {
    setScreen(SCREENS.MENU);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      {screen === SCREENS.MENU && <MenuScreen onStart={handleStart} />}
      {screen === SCREENS.RACE && (
        <RaceScene key={raceKey} characterId={characterId} onFinish={handleFinish} />
      )}
      {screen === SCREENS.RESULTS && (
        <ResultsScreen standings={standings} onRestart={handleRestart} onMenu={handleMenu} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
});
