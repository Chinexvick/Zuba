// Device tilt (accelerometer-based roll) steering input via expo-sensors.
// Falls back gracefully (returns 0) if sensors are unavailable, e.g. web/simulator.
import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

export function useTiltSteering(enabled) {
  const tiltRef = useRef(0);

  useEffect(() => {
    if (!enabled) return undefined;
    let sub;
    try {
      Accelerometer.setUpdateInterval(33);
      sub = Accelerometer.addListener(({ x }) => {
        // Landscape orientation: device roll maps from accelerometer x-axis.
        const clamped = Math.max(-1, Math.min(1, x * 2.2));
        tiltRef.current = clamped;
      });
    } catch (e) {
      // Sensors unavailable (e.g. web) — tilt steering silently disabled,
      // touch controls remain fully functional.
      tiltRef.current = 0;
    }
    return () => {
      if (sub) sub.remove();
    };
  }, [enabled]);

  return tiltRef;
}
