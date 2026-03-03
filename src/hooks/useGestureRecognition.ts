import { useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { detectGesture, getPalmCenter } from '../utils/gestureDetector';
import { SwipeDetector } from '../utils/swipeDetector';
import { mapYToHourSlot } from '../utils/coordinateMapper';
import type { GestureType } from '../types';

const FIST_CONFIRM_MS = 500;   // hold fist 500ms to confirm click (was 120)
const PINCH_CONFIRM_MS = 400;  // hold pinch 400ms to confirm click
const SWIPE_DEBOUNCE_MS = 300;
const SMOOTH_FACTOR = 0.3;
const CURSOR_THROTTLE_MS = 50;
const CLICK_COOLDOWN_MS = 800; // minimum time between synthetic clicks

export function useGestureRecognition() {
  const hands = useAppStore((s) => s.hands);
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
  // Pinch confirmation tracking
  const pinchStartRef = useRef<number | null>(null);
  const pinchFiredRef = useRef(false);
  // Cooldown to prevent rapid clicks
  const lastClickTimeRef = useRef(0);

  const prevGestureRef = useRef<GestureType>('none');

  useEffect(() => {
    if (hands.length === 0) {
      setCurrentGesture('none');
      setCursorPos(null);
      smoothPosRef.current = null;
      fistStartRef.current = null;
      fistFiredRef.current = false;
      pinchStartRef.current = null;
      pinchFiredRef.current = false;
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

    // --- Gesture detection ---
    const detected = detectGesture(landmarks);
    const isFist = detected === 'fist';
    const isPinch = detected === 'pinch';

    // Helper: dispatch synthetic click at cursor screen position
    function dispatchClick() {
      if (!smoothPosRef.current) return;
      if (now - lastClickTimeRef.current < CLICK_COOLDOWN_MS) return;
      lastClickTimeRef.current = now;

      const sx = (1 - smoothPosRef.current.x) * window.innerWidth;
      const sy = smoothPosRef.current.y * window.innerHeight;
      const el = document.elementFromPoint(sx, sy);
      if (el && el instanceof HTMLElement) {
        el.click();
      }
    }

    // --- Fist: hold 500ms to click ---
    if (isFist) {
      if (fistStartRef.current === null) {
        fistStartRef.current = now;
      }
      if (!fistFiredRef.current && now - fistStartRef.current >= FIST_CONFIRM_MS) {
        setCurrentGesture('fist');
        fistFiredRef.current = true;
        dispatchClick();
      }
    } else {
      if (fistStartRef.current !== null) {
        fistStartRef.current = null;
        fistFiredRef.current = false;
      }
    }

    // --- Pinch: hold 400ms to click ---
    if (isPinch) {
      if (pinchStartRef.current === null) {
        pinchStartRef.current = now;
      }
      if (!pinchFiredRef.current && now - pinchStartRef.current >= PINCH_CONFIRM_MS) {
        setCurrentGesture('pinch');
        pinchFiredRef.current = true;
        dispatchClick();
      }
    } else {
      if (pinchStartRef.current !== null) {
        pinchStartRef.current = null;
        pinchFiredRef.current = false;
      }
    }

    // --- Other gestures (non-fist, non-pinch) ---
    if (!isFist && !isPinch) {
      if (detected !== prevGestureRef.current) {
        setCurrentGesture(detected);
      }
    }
    prevGestureRef.current = detected;

    // --- Cursor tracking (always, when hand is visible) ---
    const palmPos = getPalmCenter(landmarks);
    if (smoothPosRef.current === null) {
      smoothPosRef.current = { x: palmPos.x, y: palmPos.y };
    } else {
      smoothPosRef.current = {
        x: smoothPosRef.current.x + (palmPos.x - smoothPosRef.current.x) * SMOOTH_FACTOR,
        y: smoothPosRef.current.y + (palmPos.y - smoothPosRef.current.y) * SMOOTH_FACTOR,
      };
    }

    // Throttle cursor/slot updates — update even during fist so cursor stays visible
    if (now - lastCursorUpdateRef.current > CURSOR_THROTTLE_MS) {
      lastCursorUpdateRef.current = now;
      setCursorPos({ x: smoothPosRef.current.x, y: smoothPosRef.current.y });

      // Only highlight calendar slots when NOT in fist/pinch (prevents accidental slot selection)
      if (!isFist && !isPinch) {
        const slot = mapYToHourSlot(smoothPosRef.current.y);
        setHighlightedSlot(slot);
      }
    }
  }, [hands, setCurrentGesture, setHighlightedSlot, setCursorPos]);
}
