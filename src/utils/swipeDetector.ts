import type { Landmark } from '../types';

interface PositionSample {
  x: number;
  timestamp: number;
}

const SWIPE_VELOCITY_THRESHOLD = 0.8; // normalized units per second
const SWIPE_MIN_DISTANCE = 0.15;      // minimum displacement
const SWIPE_COOLDOWN = 800;           // ms between swipes
const HISTORY_LENGTH = 10;

export class SwipeDetector {
  private history: PositionSample[] = [];
  private lastSwipeTime = 0;

  update(landmarks: Landmark[]): 'swipe_left' | 'swipe_right' | null {
    const wristX = landmarks[0].x;
    const now = performance.now();

    this.history.push({ x: wristX, timestamp: now });
    if (this.history.length > HISTORY_LENGTH) {
      this.history.shift();
    }

    if (this.history.length < 4) return null;
    if (now - this.lastSwipeTime < SWIPE_COOLDOWN) return null;

    const oldest = this.history[0];
    const newest = this.history[this.history.length - 1];
    const dt = (newest.timestamp - oldest.timestamp) / 1000;

    if (dt === 0) return null;

    const dx = newest.x - oldest.x;
    const velocity = dx / dt;
    const displacement = Math.abs(dx);

    if (displacement > SWIPE_MIN_DISTANCE && Math.abs(velocity) > SWIPE_VELOCITY_THRESHOLD) {
      this.lastSwipeTime = now;
      this.history = [];
      // MediaPipe mirrors x, so positive dx = visual left swipe
      return velocity > 0 ? 'swipe_left' : 'swipe_right';
    }

    return null;
  }

  reset() {
    this.history = [];
  }
}
