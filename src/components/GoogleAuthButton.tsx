import { useAppStore } from '../store/useAppStore';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { PixelStar, PixelHeart } from './PixelIcons';

export function GoogleAuthButton() {
  const { googleSignedIn, googleLoading } = useAppStore();
  const { connect, disconnect } = useGoogleCalendar();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
  const isConfigured = clientId && clientId !== 'YOUR_CLIENT_ID_HERE';

  if (!isConfigured) {
    return (
      <div className="pixel-border-sm border-peach/30 bg-peach/10 px-4 py-2 text-[20px] font-body text-cream">
        <PixelStar size={16} color="#FDAB9E" className="inline mr-2" />
        .env dosyasina VITE_GOOGLE_CLIENT_ID ekleyin
      </div>
    );
  }

  if (googleSignedIn) {
    return (
      <div className="pixel-border-sm border-mint/50 bg-mint/15 px-4 py-2 flex items-center gap-2">
        <PixelHeart size={16} color="#C7DB9C" />
        <span className="text-[20px] font-body text-cream flex-1">Google Calendar Bagli</span>
        {googleLoading && <span className="text-cream animate-pulse font-pixel text-[8px]">...</span>}
        <button onClick={disconnect}
          className="font-pixel text-[8px] text-cream/30 hover:text-rose transition-colors">
          CIKIS
        </button>
      </div>
    );
  }

  return (
    <button onClick={connect}
      className="pixel-btn w-full flex items-center justify-center gap-3
        border-rose/50 bg-rose/15 text-rose hover:bg-rose/25 px-4 py-3">
      <PixelCalIcon />
      <span className="font-pixel text-[8px]">GOOGLE BAGLAN</span>
    </button>
  );
}

function PixelCalIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 14 14" style={{ imageRendering: 'pixelated' as const }}>
      <rect x="0" y="2" width="14" height="12" fill="#FFF8D6" />
      <rect x="0" y="2" width="14" height="3" fill="#E50046" />
      <rect x="3" y="0" width="2" height="4" fill="#FDAB9E" />
      <rect x="9" y="0" width="2" height="4" fill="#FDAB9E" />
      <rect x="2" y="7" width="2" height="2" fill="#1a1a2e" />
      <rect x="6" y="7" width="2" height="2" fill="#1a1a2e" />
      <rect x="10" y="7" width="2" height="2" fill="#1a1a2e" />
      <rect x="2" y="11" width="2" height="2" fill="#1a1a2e" />
      <rect x="6" y="11" width="2" height="2" fill="#1a1a2e" />
    </svg>
  );
}
