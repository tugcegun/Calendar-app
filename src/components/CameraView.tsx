import { useRef, useEffect } from 'react';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import { useHandTracking } from '../hooks/useHandTracking';
import { useAppStore } from '../store/useAppStore';

export function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { hands, cameraReady } = useAppStore();

  useHandTracking(videoRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 480;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const hand of hands) {
      const lm = hand.landmarks.map((l) => ({ x: l.x, y: l.y, z: l.z, visibility: 1 }));

      drawConnectors(ctx, lm, HAND_CONNECTIONS, {
        color: hand.handedness === 'Right' ? '#E50046' : '#C7DB9C',
        lineWidth: 2,
      });

      drawLandmarks(ctx, lm, {
        color: '#F7DB91',
        lineWidth: 1,
        radius: 2,
      });
    }
  }, [hands]);

  return (
    <div className="relative w-full h-full bg-bg overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)', imageRendering: 'pixelated' }}
        autoPlay playsInline muted
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ transform: 'scaleX(-1)' }}
      />
      {!cameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/90">
          <div className="text-center">
            <span className="font-pixel text-[7px] text-rose animate-pulse">LOADING...</span>
          </div>
        </div>
      )}
    </div>
  );
}
