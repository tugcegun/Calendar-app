import { memo } from 'react';
import { useAppStore } from '../store/useAppStore';

const GESTURE_LABELS: Record<string, string> = {
  pointing: 'Isaret',
  open_palm: 'Avuc Ac',
  fist: 'Yumruk',
  peace: 'Peace',
  pinch: 'TIKLA!',
  thumbs_down: 'Sil',
};

export const HandCursor = memo(function HandCursor() {
  const cursorPos = useAppStore((s) => s.cursorPos);
  const gesture = useAppStore((s) => s.currentGesture);

  if (!cursorPos) return null;

  const screenX = (1 - cursorPos.x) * 100;
  const screenY = cursorPos.y * 100;
  const label = GESTURE_LABELS[gesture] || '';
  const isPinch = gesture === 'pinch';

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${screenX}%`,
        top: `${screenY}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Outer glow ring */}
      <div className={`absolute -inset-4 rounded-full ${isPinch ? 'bg-mint/30 scale-125' : 'bg-rose/15'} animate-pulse-slow transition-all duration-200`} />

      {/* Cursor: pixel crosshair */}
      <svg width="28" height="28" viewBox="0 0 16 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="7" y="0" width="2" height="5" fill={isPinch ? '#C7DB9C' : '#E50046'} opacity="0.8" />
        <rect x="7" y="11" width="2" height="5" fill={isPinch ? '#C7DB9C' : '#E50046'} opacity="0.8" />
        <rect x="0" y="7" width="5" height="2" fill={isPinch ? '#C7DB9C' : '#E50046'} opacity="0.8" />
        <rect x="11" y="7" width="5" height="2" fill={isPinch ? '#C7DB9C' : '#E50046'} opacity="0.8" />
        <rect x="6" y="6" width="4" height="4" fill="#E50046" />
        <rect x="7" y="7" width="2" height="2" fill={isPinch ? '#C7DB9C' : '#fff'} />
      </svg>

      {/* Gesture label */}
      {label && (
        <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap
          font-pixel text-[8px] px-2 py-1 pixel-border-sm transition-all duration-200
          ${isPinch
            ? 'text-white bg-mint border-mint scale-110'
            : 'text-white bg-rose border-rose'}`}>
          {label}
        </div>
      )}
    </div>
  );
});
