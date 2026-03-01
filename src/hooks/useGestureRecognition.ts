import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { detectGesture, getPalmCenter } from '../utils/gestureDetector';
import { SwipeDetector } from '../utils/swipeDetector';
import { mapYToHourSlot } from '../utils/coordinateMapper';
import type { GestureType } from '../types';

const FIST_CONFIRM_MS = 120;   // hold fist for 120ms to confirm click
const SWIPE_DEBOUNCE_MS = 300;
const SMOOTH_FACTOR = 0.3;
const CURSOR_THROTTLE_MS = 50;

export function useGestureRecognition() {
  const hands = useAppStore((s) => s.hands);
  const mode = useAppStore((s) => s.mode);
  const setCurrentGesture = useAppStore((s) => s.setCurrentGesture);
  const setHighlightedSlot = useAppStore((s) => s.setHighlightedSlot);
  const setCursorPos = useAppStore((s) => s.setCursorPos);

  const swipeDetectorRef = useRef(new SwipeDetector());
  const lastSwipeTimeRef = useRef(0);
  const lastCursorUpdateRef = useRef(0);
  const smoothPosRef = useRef<{ x: number; y: number } | null>(null);

  // Fist confirmation tracking
  const fistStartRef = useRef<number | null>(null);
  const fistFiredRef = useRef(false);
  const prevGestureRef = useRef<GestureType>('none');

  useEffect(() => {
    if (hands.length === 0) {
      setCurrentGesture('none');
      setCursorPos(null);
      smoothPosRef.current = null;
      fistStartRef.current = null;
      fistFiredRef.current = false;
      prevGestureRef.current = 'none';
      return;
    }

    const landmarks = hands[0].landmarks;
    const now = performance.now();

    // --- Swipe detection (kept, with its own debounce) ---
    const swipe = swipeDetectorRef.current.update(landmarks);
    if (swipe && now - lastSwipeTimeRef.current > SWIPE_DEBOUNCE_MS) {
      setCurrentGesture(swipe);
      lastSwipeTimeRef.current = now;
      return;
    }

    // --- Simple 2-state gesture: fist vs not-fist ---
    const detected = detectGesture(landmarks);
    const isFist = detected === 'fist';

    if (isFist) {
      // Start fist timer if not already started
      if (fistStartRef.current === null) {
        fistStartRef.current = now;
      }
      // Confirm fist after hold duration (fire once per fist)
      if (!fistFiredRef.current && now - fistStartRef.current >= FIST_CONFIRM_MS) {
        setCurrentGesture('fist');
        fistFiredRef.current = true;
      }
    } else {
      // Hand is open — reset fist tracking
      if (fistStartRef.current !== null) {
        fistStartRef.current = null;
        fistFiredRef.current = false;
      }

      // Set gesture to the detected type (for UI indicator)
      if (detected !== prevGestureRef.current) {
        setCurrentGesture(detected);
      }
    }
    prevGestureRef.current = detected;

    // --- Cursor tracking (always, when hand is not fist) ---
    // Use palm center for stability (average of wrist + middle finger MCP)
    const palmPos = getPalmCenter(landmarks);
    if (smoothPosRef.current === null) {
      smoothPosRef.current = { x: palmPos.x, y: palmPos.y };
    } else {
      smoothPosRef.current = {
        x: smoothPosRef.current.x + (palmPos.x - smoothPosRef.current.x) * SMOOTH_FACTOR,
        y: smoothPosRef.current.y + (palmPos.y - smoothPosRef.current.y) * SMOOTH_FACTOR,
      };
    }

    // Throttle cursor/slot updates
    if (now - lastCursorUpdateRef.current > CURSOR_THROTTLE_MS) {
      lastCursorUpdateRef.current = now;

      if (!isFist) {
        setCursorPos({ x: smoothPosRef.current.x, y: smoothPosRef.current.y });
        const slot = mapYToHourSlot(smoothPosRef.current.y);
        setHighlightedSlot(slot);
      }
    }
  }, [hands, setCurrentGesture, setHighlightedSlot, setCursorPos, mode]);
}
