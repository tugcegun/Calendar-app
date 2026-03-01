import { useAppStore } from '../store/useAppStore';
import { PixelFrog, PixelLion, PixelCat, PixelHand, PixelFist, PixelStar, PixelHeart, PixelMusic } from './PixelIcons';

const GESTURES = [
  { icon: <PixelHand size={28} />, label: 'El Ac', desc: 'Cursor hareket' },
  { icon: <PixelFist size={28} />, label: 'Yumruk', desc: 'Tikla / Kaydet' },
  { icon: <PixelStar size={28} color="#C7DB9C" />, label: 'Peace', desc: 'Gorunum degistir' },
  { icon: <PixelHeart size={28} color="#E50046" />, label: 'Thumbs Down', desc: 'Etkinlik sil' },
];

export function Onboarding() {
  const { showOnboarding, setShowOnboarding } = useAppStore();
  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="pixel-border p-8 max-w-lg w-full mx-4 animate-pixel-assemble"
        style={{
          background: '#FFF8D6',
          borderColor: '#E50046',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.2), inset -2px -2px 0px rgba(0,0,0,0.05), inset 2px 2px 0px rgba(255,255,255,0.4)',
        }}>
        {/* Title with pixel animals */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-4 mb-2">
            <PixelFrog size={36} className="animate-hop" />
            <PixelLion size={36} className="animate-float" />
            <PixelCat size={36} className="animate-wiggle" />
          </div>
          <h2 className="font-script text-[48px] leading-tight"
            style={{ color: '#E50046', textShadow: '0 0 20px rgba(229,0,70,0.3), 2px 2px 0px rgba(0,0,0,0.15)' }}>
            Air Planner
          </h2>
          <p className="text-[22px] font-body mt-1" style={{ color: '#1a1a2e' }}>El hareketleriyle takvim yonetimi</p>
        </div>

        {/* HP Bar */}
        <div className="pixel-border-sm px-4 py-2 mb-5 flex items-center gap-3"
          style={{ borderColor: '#C7DB9C', background: '#C7DB9C30' }}>
          <PixelLion size={24} />
          <span className="font-pixel text-[8px]" style={{ color: '#1a1a2e' }}>SKILL</span>
          <div className="flex-1 h-3 pixel-border-sm" style={{ borderColor: '#C7DB9C80', background: '#fff' }}>
            <div className="h-full w-full animate-pulse-slow" style={{ background: '#C7DB9C' }} />
          </div>
          <span className="font-pixel text-[8px]" style={{ color: '#1a1a2e' }}>MAX</span>
        </div>

        {/* Gestures */}
        <div className="space-y-2 mb-5">
          {GESTURES.map((g, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-2 border-2 transition-colors"
              style={{ background: '#FDAB9E20', borderColor: '#FDAB9E40' }}>
              <div className="w-8 flex justify-center">{g.icon}</div>
              <span className="text-[20px] font-body flex-1" style={{ color: '#1a1a2e' }}>{g.label}</span>
              <span className="text-[20px] font-body" style={{ color: '#1a1a2e80' }}>{g.desc}</span>
            </div>
          ))}
        </div>

        {/* Flow */}
        <div className="pixel-border-sm px-4 py-3 mb-5" style={{ borderColor: '#E5004640', background: '#E5004610' }}>
          <div className="flex items-center gap-2 mb-2">
            <PixelMusic size={18} color="#E50046" />
            <span className="font-pixel text-[8px]" style={{ color: '#1a1a2e' }}>ETKINLIK AKISI:</span>
          </div>
          <p className="text-[22px] font-body leading-relaxed" style={{ color: '#1a1a2e90' }}>
            El ac &rarr; Slot sec &rarr; Yumruk yap &rarr; Isim yaz &rarr; Kaydet
          </p>
        </div>

        {/* Start button */}
        <button onClick={() => setShowOnboarding(false)}
          className="pixel-btn w-full py-4 font-pixel text-[10px] flex items-center justify-center gap-3"
          style={{ borderColor: '#E50046', background: '#E50046', color: '#fff' }}>
          <PixelHeart size={18} color="#fff" />
          BASLA
          <PixelHeart size={18} color="#fff" />
        </button>
      </div>
    </div>
  );
}
