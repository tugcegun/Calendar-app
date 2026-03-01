import { useEffect, useRef, useCallback } from 'react';
import { HandTracker } from '../services/handTracker';
import { useAppStore } from '../store/useAppStore';
import type { HandData } from '../types';

export function useHandTracking(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const trackerRef = useRef<HandTracker | null>(null);
  const { setHands, setCameraReady, setError } = useAppStore();
  const prevHandCountRef = useRef(0);

  const handleResults = useCallback(
    (hands: HandData[]) => {
      // Avoid calling setHands([]) 30fps when no hands detected — only update
      // when transitioning from "has hands" to "no hands" or when hands exist.
      if (hands.length === 0 && prevHandCountRef.current === 0) return;
      prevHandCountRef.current = hands.length;
      setHands(hands);
    },
    [setHands]
  );

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const tracker = new HandTracker();
    trackerRef.current = tracker;

    tracker
      .initialize(videoEl, handleResults)
      .then(() => {
        setCameraReady(true);
        setError(null);
      })
      .catch((err) => {
        console.error('Hand tracking init failed:', err);
        if (err instanceof DOMException && err.name === 'NotAllowedError') {
          setError('Kamera izni reddedildi. Lütfen tarayıcı ayarlarından kamera iznini verin.');
        } else if (err instanceof DOMException && err.name === 'NotFoundError') {
          setError('Kamera bulunamadı. Lütfen bir kamera bağlayın.');
        } else {
          setError('Kamera başlatılamadı. Lütfen sayfayı yenileyin.');
        }
      });

    return () => {
      tracker.stop();
      trackerRef.current = null;
      setCameraReady(false);
    };
  }, [videoRef, handleResults, setCameraReady, setError]);

  return trackerRef;
}
