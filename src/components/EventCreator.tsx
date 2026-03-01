import { useAppStore } from '../store/useAppStore';
import { useGoogleCalendar } from '../hooks/useGoogleCalendar';
import { VoiceInput } from './VoiceInput';
import { PixelFrog, PixelFist, PixelHeart } from './PixelIcons';

export function EventCreator() {
  const {
    mode, draftTitle, setDraftTitle, draftDuration, setDraftDuration,
    highlightedSlot, selectedDate, addEvent, setMode, setLastAction,
    setSpeechText, googleSignedIn,
  } = useAppStore();
  const { addGoogleEvent } = useGoogleCalendar();

  if (mode !== 'creating') return null;

  const handleSave = async () => {
    if (!draftTitle.trim()) return;
    const slot = highlightedSlot ?? 9;
    if (googleSignedIn) {
      await addGoogleEvent(draftTitle.trim(), selectedDate, slot, 0, draftDuration);
    } else {
      addEvent({
        id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        title: draftTitle.trim(), date: selectedDate,
        startHour: slot, startMinute: 0, duration: draftDuration,
        color: ['#E50046', '#FDAB9E', '#C7DB9C', '#E50046', '#FDAB9E'][Math.floor(Math.random() * 5)],
      });
      setLastAction(`"${draftTitle}" olusturuldu`);
    }
    setDraftTitle(''); setSpeechText(''); setDraftDuration(60); setMode('idle');
  };

  const handleCancel = () => {
    setDraftTitle(''); setSpeechText(''); setDraftDuration(60); setMode('idle');
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50" onClick={handleCancel}>
      <div
        className="pixel-border p-8 w-full max-w-md mx-4 animate-pixel-assemble"
        style={{
          background: '#FFF8D6',
          borderColor: '#E50046',
          boxShadow: '6px 6px 0px rgba(0,0,0,0.2), inset -2px -2px 0px rgba(0,0,0,0.05), inset 2px 2px 0px rgba(255,255,255,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with big frog */}
        <div className="text-center mb-6">
          <PixelFrog size={72} className="mx-auto animate-hop" />
          <h2 className="font-pixel text-[14px] mt-3" style={{ color: '#E50046' }}>YENI ETKINLIK</h2>
          {googleSignedIn && (
            <span className="font-pixel text-[8px] pixel-border-sm px-2 py-1 mt-2 inline-block"
              style={{ color: '#1a1a2e', borderColor: '#C7DB9C', background: '#C7DB9C40' }}>
              GOOGLE
            </span>
          )}
        </div>

        {/* Selected time display */}
        <div className="pixel-border p-3 mb-4 text-center"
          style={{ borderColor: '#FDAB9E', background: '#FDAB9E30' }}>
          <span className="font-pixel text-[10px]" style={{ color: '#1a1a2e80' }}>SAAT</span>
          <div className="font-pixel text-[24px] mt-1" style={{ color: '#1a1a2e' }}>
            {highlightedSlot !== null ? `${highlightedSlot.toString().padStart(2, '0')}:00` : '09:00'}
          </div>
        </div>

        {/* Voice input */}
        <div className="mb-4">
          <VoiceInput />
        </div>

        {/* Title input */}
        <div className="mb-4">
          <label className="text-[20px] font-body block mb-1" style={{ color: '#1a1a2e' }}>Etkinlik Adi:</label>
          <input type="text" value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Toplanti, Spor, Yemek..."
            autoFocus
            className="w-full border-[3px] px-4 py-3 text-[22px] font-body focus:outline-none transition-colors"
            style={{ background: '#fff', borderColor: '#FDAB9E80', color: '#1a1a2e' }}
          />
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="text-[20px] font-body block mb-1" style={{ color: '#1a1a2e' }}>Sure: {draftDuration} dakika</label>
          <input type="range" min="15" max="240" step="15"
            value={draftDuration} onChange={(e) => setDraftDuration(Number(e.target.value))}
            className="w-full h-3" style={{ accentColor: '#E50046' }} />
          <div className="flex justify-between text-[16px] font-body mt-1" style={{ color: '#1a1a2e60' }}>
            <span>15dk</span><span>1sa</span><span>2sa</span><span>4sa</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={handleCancel}
            className="pixel-btn flex-1 py-3 text-[9px] font-pixel flex items-center justify-center gap-2"
            style={{ borderColor: '#FDAB9E', background: '#FDAB9E30', color: '#1a1a2e' }}>
            <PixelHeart size={14} color="#E50046" /> IPTAL
          </button>
          <button onClick={handleSave} disabled={!draftTitle.trim()}
            className="pixel-btn flex-1 py-3 text-[9px] font-pixel flex items-center justify-center gap-2"
            style={{
              borderColor: draftTitle.trim() ? '#C7DB9C' : '#ccc',
              background: draftTitle.trim() ? '#C7DB9C' : '#e8e8e8',
              color: draftTitle.trim() ? '#1a1a2e' : '#999',
              cursor: draftTitle.trim() ? 'pointer' : 'not-allowed',
            }}>
            <PixelFist size={16} /> KAYDET
          </button>
        </div>

        {/* Hint */}
        <p className="text-center text-[16px] font-body mt-4" style={{ color: '#1a1a2e50' }}>
          Yumruk yap = Kaydet
        </p>
      </div>
    </div>
  );
}
