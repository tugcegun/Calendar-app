import { Hands, type Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import type { HandData, Landmark } from '../types';

export type HandResultsCallback = (hands: HandData[]) => void;

export class HandTracker {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private callback: HandResultsCallback | null = null;

  async initialize(videoElement: HTMLVideoElement, onResults: HandResultsCallback): Promise<void> {
    this.callback = onResults;

    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5,
    });

    this.hands.onResults((results: Results) => {
      this.handleResults(results);
    });

    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.hands) {
          await this.hands.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480,
    });

    await this.camera.start();
  }

  private handleResults(results: Results): void {
    if (!this.callback) return;

    const hands: HandData[] = [];

    if (results.multiHandLandmarks && results.multiHandedness) {
      for (let i = 0; i < results.multiHandLandmarks.length; i++) {
        const landmarks: Landmark[] = results.multiHandLandmarks[i].map((lm) => ({
          x: lm.x,
          y: lm.y,
          z: lm.z,
        }));

        const handedness = results.multiHandedness[i].label as 'Left' | 'Right';

        hands.push({ landmarks, handedness });
      }
    }

    this.callback(hands);
  }

  stop(): void {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    if (this.hands) {
      this.hands.close();
      this.hands = null;
    }
    this.callback = null;
  }
}
