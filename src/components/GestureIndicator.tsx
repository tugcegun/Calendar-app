import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { resolveAction } from '../services/gestureEngine';
import { PixelHand, PixelFist, PixelStar, PixelArrowRight } from './PixelIcons';

const GESTURE_ICONS: Record<string, React.ReactNode> = {
  pointing: <PixelHand size={24} />,
  open_palm: <PixelHand size={24} />,
  fist: <PixelFist size={24} />,
  peace: <PixelStar size={24} color="#C7DB9C" />,
  pinch: <PixelHand size={24} />,
  thumbs_down: <PixelFist size={24} />,
  swipe_left: <span className="text-[22px] font-body text-cream">{'<< '}</span>,
  swipe_right: <span className="text-[22px] font-body text-cream">{' >>'}</span>,
  none: null,
};

const GESTURE_LABELS: Record<string, string> = {
  pointing: 'ISARET', open_palm: 'AVUC', fist: 'YUMRUK', peace: 'PEACE',
  pinch: 'PINCH', thumbs_down: 'T.DOWN', swipe_left: 'SWIPE L', swipe_right: 'SWIPE R', none: '',
};

export function GestureIndicator() {
  const { currentGesture, mode } = useAppStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (currentGesture !== 'none') setVisible(true);
    else { const t = setTimeout(() => setVisible(false), 500); return () => clearTimeout(t); }
  }, [currentGesture]);

  const actionInfo = resolveAction(currentGesture, mode);

  return (
    <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-30 transition-all duration-200
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
      <div className="pixel-border border-rose/60 bg-bg-card px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          {GESTURE_ICONS[currentGesture]}
          <span className="font-pixel text-[9px] text-cream">{GESTURE_LABELS[currentGesture]}</span>
        </div>

        {actionInfo && (
          <>
            <PixelArrowRight size={12} color="#E50046" />
            <span className="font-pixel text-[9px] text-cream">{actionInfo.label}</span>
          </>
        )}

        <span className={`font-pixel text-[8px] px-3 py-1 pixel-border-sm
          ${mode === 'creating' ? 'border-rose/40 text-rose bg-rose/10' :
            mode === 'selecting' ? 'border-cream/40 text-cream bg-peach/15' :
            'border-cream/20 text-cream/40 bg-cream/5'}`}>
          {mode === 'creating' ? 'OLUSTURMA' : mode === 'selecting' ? 'SECIM' : 'HAZIR'}
        </span>
      </div>
    </div>
  );
}
