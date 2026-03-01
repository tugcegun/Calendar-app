import type { GestureType, AppMode, AppAction } from '../types';

interface GestureMapping {
  gesture: GestureType;
  modes: AppMode[];
  action: AppAction;
  label: string;
  icon: string;
}

const GESTURE_MAP: GestureMapping[] = [
  // FIST = universal "click/confirm" button
  {
    gesture: 'fist',
    modes: ['idle', 'selecting'],
    action: 'click_select',
    label: 'Sec / Olustur',
    icon: '✊',
  },
  {
    gesture: 'fist',
    modes: ['creating'],
    action: 'save_event',
    label: 'Kaydet',
    icon: '✊',
  },
  // Swipe for navigation
  {
    gesture: 'swipe_left',
    modes: ['idle', 'selecting'],
    action: 'next_day',
    label: 'Sonraki Gun',
    icon: '👈',
  },
  {
    gesture: 'swipe_right',
    modes: ['idle', 'selecting'],
    action: 'prev_day',
    label: 'Onceki Gun',
    icon: '👉',
  },
  // Peace for view toggle
  {
    gesture: 'peace',
    modes: ['idle', 'selecting'],
    action: 'toggle_view',
    label: 'Gorunum Degistir',
    icon: '✌️',
  },
  // Thumbs down to delete
  {
    gesture: 'thumbs_down',
    modes: ['idle', 'selecting'],
    action: 'delete_event',
    label: 'Etkinlik Sil',
    icon: '👎',
  },
];

export function resolveAction(gesture: GestureType, currentMode: AppMode): {
  action: AppAction;
  label: string;
  icon: string;
} | null {
  const mapping = GESTURE_MAP.find(
    (m) => m.gesture === gesture && m.modes.includes(currentMode)
  );

  if (!mapping) return null;

  return {
    action: mapping.action,
    label: mapping.label,
    icon: mapping.icon,
  };
}

export function getGestureHelp(): { gesture: string; description: string; icon: string }[] {
  return [
    { gesture: 'El Ac', description: 'Cursor hareket', icon: '✋' },
    { gesture: 'Yumruk', description: 'Tikla / Kaydet', icon: '✊' },
    { gesture: 'Peace', description: 'Gorunum degistir', icon: '✌️' },
    { gesture: 'Thumbs Down', description: 'Etkinlik sil', icon: '👎' },
    { gesture: 'Sola Savur', description: 'Sonraki gun', icon: '👈' },
    { gesture: 'Saga Savur', description: 'Onceki gun', icon: '👉' },
  ];
}
