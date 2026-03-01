// Maps hand landmark positions to calendar UI coordinates

const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 22;
const TOTAL_SLOTS = CALENDAR_END_HOUR - CALENDAR_START_HOUR;

/**
 * Maps a normalized Y coordinate (0-1, where 0=top) to a calendar hour slot.
 * The mapping uses a narrower band to account for natural hand movement range.
 */
export function mapYToHourSlot(normalizedY: number): number {
  // Hand movement typically in 0.2-0.8 range
  const clampedY = Math.max(0.15, Math.min(0.85, normalizedY));
  const mapped = (clampedY - 0.15) / 0.7; // normalize to 0-1
  const slot = Math.floor(mapped * TOTAL_SLOTS);
  return Math.max(0, Math.min(TOTAL_SLOTS - 1, slot)) + CALENDAR_START_HOUR;
}

/**
 * Maps a pinch distance to event duration in minutes.
 * Larger pinch = longer duration.
 */
export function mapPinchToDuration(pinchDistance: number): number {
  // pinchDistance ranges from ~0.02 (closed) to ~0.3 (open wide)
  const normalized = Math.max(0, Math.min(1, (pinchDistance - 0.03) / 0.25));
  // Map to 15-240 minutes in 15-minute increments
  const minutes = Math.round((normalized * 225 + 15) / 15) * 15;
  return Math.max(15, Math.min(240, minutes));
}

/**
 * Gets the day index (0-6) from normalized X coordinate for weekly view
 */
export function mapXToDayIndex(normalizedX: number): number {
  const clamped = Math.max(0, Math.min(1, normalizedX));
  return Math.min(6, Math.floor(clamped * 7));
}

export { CALENDAR_START_HOUR, CALENDAR_END_HOUR, TOTAL_SLOTS };
