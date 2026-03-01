import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useAppStore } from '../store/useAppStore';
import { PixelMusic } from './PixelIcons';

export function VoiceInput() {
  const { isListening, startListening, stopListening } = useSpeechRecognition();
  const { speechText, mode } = useAppStore();

  if (mode !== 'creating') return null;

  return (
    <div className="flex items-center gap-3 pixel-border-sm border-peach/30 bg-white/60 px-3 py-2">
      <button onClick={isListening ? stopListening : startListening}
        className={`pixel-btn px-3 py-2 text-[8px] font-pixel flex items-center gap-2
          ${isListening
            ? 'border-rose bg-rose/25 text-rose animate-pulse-slow'
            : 'border-cream/30 bg-peach/15 text-cream hover:bg-peach/25'}`}>
        <PixelMusic size={14} color={isListening ? '#E50046' : '#1a1a2e'} />
        {isListening ? 'DUR' : 'SES'}
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-[20px] font-body text-cream truncate">
          {speechText || (isListening ? 'Dinleniyor...' : 'Mikrofona tiklayin')}
        </p>
      </div>

      {isListening && (
        <div className="flex gap-1 items-end h-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-1.5 bg-rose animate-pulse"
              style={{ height: `${6 + Math.random() * 14}px`, animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      )}
    </div>
  );
}
