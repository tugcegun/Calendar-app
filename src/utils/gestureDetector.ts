import type { Landmark, FingerState, GestureType } from '../types';

// MediaPipe hand landmark indices
const WRIST = 0;
const _THUMB_CMC = 1, THUMB_MCP = 2, _THUMB_IP = 3, THUMB_TIP = 4;
const INDEX_MCP = 5, INDEX_PIP = 6, _INDEX_DIP = 7, INDEX_TIP = 8;
const MIDDLE_MCP = 9, MIDDLE_PIP = 10, _MIDDLE_DIP = 11, MIDDLE_TIP = 12;
const RING_MCP = 13, RING_PIP = 14, _RING_DIP = 15, RING_TIP = 16;
const PINKY_MCP = 17, PINKY_PIP = 18, _PINKY_DIP = 19, PINKY_TIP = 20;
void [_THUMB_CMC, _THUMB_IP, _INDEX_DIP, _MIDDLE_DIP, _RING_DIP, _PINKY_DIP];

function distance(a: Landmark, b: Landmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

function isFingerExtended(landmarks: Landmark[], tip: number, pip: number, mcp: number): boolean {
  // A finger is extended if the tip is farther from wrist than pip
  const tipToWrist = distance(landmarks[tip], landmarks[WRIST]);
  const pipToWrist = distance(landmarks[pip], landmarks[WRIST]);
  // Also check that tip is farther from MCP than PIP is (finger is straightened out)
  const tipToMcp = distance(landmarks[tip], landmarks[mcp]);
  const pipToMcp = distance(landmarks[pip], landmarks[mcp]);
  return tipToWrist > pipToWrist && tipToMcp > pipToMcp;
}

function isThumbExtended(landmarks: Landmark[]): boolean {
  // Thumb: tip is farther from palm center than MCP
  const palmCenter = {
    x: (landmarks[WRIST].x + landmarks[MIDDLE_MCP].x) / 2,
    y: (landmarks[WRIST].y + landmarks[MIDDLE_MCP].y) / 2,
    z: (landmarks[WRIST].z + landmarks[MIDDLE_MCP].z) / 2,
  };
  return distance(landmarks[THUMB_TIP], palmCenter) > distance(landmarks[THUMB_MCP], palmCenter);
}

export function getFingerState(landmarks: Landmark[]): FingerState {
  return {
    thumb: isThumbExtended(landmarks),
    index: isFingerExtended(landmarks, INDEX_TIP, INDEX_PIP, INDEX_MCP),
    middle: isFingerExtended(landmarks, MIDDLE_TIP, MIDDLE_PIP, MIDDLE_MCP),
    ring: isFingerExtended(landmarks, RING_TIP, RING_PIP, RING_MCP),
    pinky: isFingerExtended(landmarks, PINKY_TIP, PINKY_PIP, PINKY_MCP),
  };
}

export function detectPinch(landmarks: Landmark[]): boolean {
  const d = distance(landmarks[THUMB_TIP], landmarks[INDEX_TIP]);
  return d < 0.09;
}

export function detectThumbsDown(landmarks: Landmark[]): boolean {
  const fingers = getFingerState(landmarks);
  // Thumb should be pointing down (tip.y > mcp.y) and other fingers closed
  const thumbDown = landmarks[THUMB_TIP].y > landmarks[THUMB_MCP].y;
  return thumbDown && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky;
}

export function detectGesture(landmarks: Landmark[]): GestureType {
  const fingers = getFingerState(landmarks);
  const allExtended = fingers.thumb && fingers.index && fingers.middle && fingers.ring && fingers.pinky;
  const allClosed = !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky;

  // Fist: all 4 fingers closed (thumb can be in or out)
  // Check FIRST — when making a fist, thumb+index tips get close (false pinch)
  if (allClosed) {
    // Distinguish fist from thumbs_down
    if (detectThumbsDown(landmarks)) {
      return 'thumbs_down';
    }
    return 'fist';
  }

  // Open palm: all fingers extended
  if (allExtended) {
    return 'open_palm';
  }

  // Peace sign: index + middle extended, others closed
  if (fingers.index && fingers.middle && !fingers.ring && !fingers.pinky) {
    return 'peace';
  }

  // Pointing: only index extended
  if (fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) {
    return 'pointing';
  }

  // Pinch: thumb and index tips close together (only when fingers are partially open)
  if (detectPinch(landmarks)) {
    return 'pinch';
  }

  return 'none';
}

// Get the index finger tip position (normalized 0-1)
export function getIndexTipPosition(landmarks: Landmark[]): { x: number; y: number } {
  return {
    x: landmarks[INDEX_TIP].x,
    y: landmarks[INDEX_TIP].y,
  };
}

// Get palm center (average of wrist + middle finger MCP) — more stable than fingertip
export function getPalmCenter(landmarks: Landmark[]): { x: number; y: number } {
  return {
    x: (landmarks[WRIST].x + landmarks[MIDDLE_MCP].x) / 2,
    y: (landmarks[WRIST].y + landmarks[MIDDLE_MCP].y) / 2,
  };
}

// Get pinch distance for duration adjustment
export function getPinchDistance(landmarks: Landmark[]): number {
  return distance(landmarks[THUMB_TIP], landmarks[INDEX_TIP]);
}
