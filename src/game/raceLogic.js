// Lap counting, progress tracking, and race position/results logic.
import { nearestPointOnCurve } from './trackUtils';

const FINISH_LINE_INDEX = 0;
const TOTAL_LAPS = 3;

export { TOTAL_LAPS };

// Updates kart.lapProgress (0..1 along curve) and increments kart.lap when
// the finish-line sample is crossed moving forward.
export function updateLapProgress(kart, samples, raceTime) {
  const nearest = nearestPointOnCurve(samples, kart.position);
  const progress = nearest.index / samples.length;

  if (kart.lastLapProgress > 0.85 && progress < 0.15 && !kart.finished) {
    kart.lap += 1;
    if (kart.lap >= TOTAL_LAPS) {
      kart.finished = true;
      kart.finishTime = raceTime;
    }
  }
  kart.lastLapProgress = kart.lapProgress;
  kart.lapProgress = progress;
  kart.totalProgress = kart.lap + progress;
  return nearest;
}

export function computeStandings(karts) {
  return [...karts].sort((a, b) => {
    if (a.finished && b.finished) return a.finishTime - b.finishTime;
    if (a.finished) return -1;
    if (b.finished) return 1;
    return (b.totalProgress || 0) - (a.totalProgress || 0);
  });
}
