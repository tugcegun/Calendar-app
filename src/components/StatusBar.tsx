import { useAppStore } from '../store/useAppStore';
import { PixelHeart, PixelStar } from './PixelIcons';

export function StatusBar() {
  const { cameraReady, mode, highlightedSlot, currentGesture, lastAction, hands, googleSignedIn, googleLoading } = useAppStore();

  return (
    <div className="flex items-center gap-4 px-5 py-2 bg-mint/20 border-t-[3px] border-mint/30 text-[20px] font-body">
      <div className="flex items-center gap-1.5">
        <PixelHeart size={14} color={cameraReady ? '#C7DB9C' : '#E50046'} />
        <span className={cameraReady ? 'text-cream/60' : 'text-rose animate-pulse'}>
          {cameraReady ? 'CAM:ON' : 'CAM:OFF'}
        </span>
      </div>

      <span className="text-cream/15">|</span>

      <span className="text-cream/50">
        EL: <span className={hands.length > 0 ? 'text-cream' : 'text-cream/25'}>{hands.length}</span>
      </span>

      <span className="text-cream/15">|</span>

      <span className={`px-2 py-0.5
        ${mode === 'creating' ? 'text-rose bg-rose/10' :
          mode === 'selecting' ? 'text-cream bg-peach/15' : 'text-cream/40'}`}>
        {mode === 'creating' ? 'OLUSTURMA' : mode === 'selecting' ? 'SECIM' : 'HAZIR'}
      </span>

      {highlightedSlot !== null && (
        <><span className="text-cream/15">|</span><span className="text-rose">{highlightedSlot.toString().padStart(2, '0')}:00</span></>
      )}

      {currentGesture !== 'none' && (
        <><span className="text-cream/15">|</span><span className="text-cream">{currentGesture}</span></>
      )}

      <span className="text-cream/15">|</span>
      <div className="flex items-center gap-1">
        <PixelStar size={12} color={googleSignedIn ? '#C7DB9C' : '#ccc'} />
        <span className={googleSignedIn ? 'text-cream' : 'text-cream/30'}>
          {googleSignedIn ? 'GOOGLE' : 'YEREL'}{googleLoading && ' ...'}
        </span>
      </div>

      <div className="flex-1" />

      {lastAction && (
        <span className="text-rose animate-gesture-pop flex items-center gap-1">
          <PixelArrowR /> {lastAction}
        </span>
      )}
    </div>
  );
}

function PixelArrowR() {
  return (
    <svg width="10" height="10" viewBox="0 0 8 8" style={{ imageRendering: 'pixelated' as const }}>
      <rect x="0" y="3" width="5" height="2" fill="#E50046" />
      <rect x="4" y="1" width="2" height="2" fill="#E50046" />
      <rect x="6" y="3" width="2" height="2" fill="#E50046" />
      <rect x="4" y="5" width="2" height="2" fill="#E50046" />
    </svg>
  );
}
