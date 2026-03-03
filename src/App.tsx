import { useEffect, useCallback, useState, useMemo } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './services/firebase';
import { addFirestoreEvent, deleteFirestoreEvent } from './services/firestoreService';
import { useAuth } from './hooks/useAuth';
import { CameraView } from './components/CameraView';
import { CalendarView } from './components/CalendarView';
import { MiniCalendar } from './components/MiniCalendar';
import { GestureIndicator } from './components/GestureIndicator';
import { EventCreator } from './components/EventCreator';
import { StatusBar } from './components/StatusBar';
import { Onboarding } from './components/Onboarding';
import { HandCursor } from './components/HandCursor';
import { PixelFrog, PixelCat, PixelLion, PixelHand, PixelFist, PixelStar, PixelHeart } from './components/PixelIcons';
import { useGestureRecognition } from './hooks/useGestureRecognition';
import { useHandScroll } from './hooks/useHandScroll';
import { useGoogleCalendar } from './hooks/useGoogleCalendar';
import { resolveAction } from './services/gestureEngine';
import { useAppStore } from './store/useAppStore';
import { PixelArrowLeft, PixelArrowRight } from './components/PixelIcons';

// Pre-generate star data once — never recalculated
const STAR_DATA = Array.from({ length: 40 }, (_, i) => ({
  key: i,
  width: (Math.sin(i * 7.3) > 0.3) ? '3px' : '2px',
  height: (Math.sin(i * 7.3) > 0.3) ? '3px' : '2px',
  left: `${((i * 17.31) % 100)}%`,
  top: `${((i * 23.57) % 100)}%`,
  background: ['#E50046', '#FDAB9E', '#C7DB9C', '#E50046'][i % 4],
  animation: `twinkle ${2 + (i % 5)}s ease-in-out infinite`,
  animationDelay: `${(i * 0.37) % 3}s`,
}));

function BackgroundStars() {
  return useMemo(() => (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {STAR_DATA.map((s) => (
        <div key={s.key} className="absolute" style={s} />
      ))}
    </div>
  ), []);
}

function App() {
  const {
    currentGesture, mode, setMode, highlightedSlot,
    selectedDate, draftTitle, draftDuration, setDraftDuration,
    removeEvent, events, goNextDay, goPrevDay, toggleView,
    setLastAction, setDraftTitle, setSpeechText, error, setError, googleSignedIn,
    firebaseUser, authLoading,
  } = useAppStore();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useAuth();
  useGestureRecognition();
  useHandScroll();
  const { addGoogleEvent, removeGoogleEvent } = useGoogleCalendar();

  const userName = firebaseUser?.displayName || firebaseUser?.email || '';

  const handleLogout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const processAction = useCallback(() => {
    const result = resolveAction(currentGesture, mode);
    if (!result) return;

    switch (result.action) {
      case 'save_event':
        if (mode === 'creating' && draftTitle.trim()) {
          const slot = highlightedSlot ?? 9;
          if (googleSignedIn) {
            addGoogleEvent(draftTitle.trim(), selectedDate, slot, 0, draftDuration);
          } else if (firebaseUser) {
            const color = ['#E50046', '#FDAB9E', '#C7DB9C', '#E50046', '#FDAB9E'][Math.floor(Math.random() * 5)];
            addFirestoreEvent(firebaseUser.uid, {
              title: draftTitle.trim(), date: selectedDate,
              startHour: slot, startMinute: 0, duration: draftDuration, color,
            });
            setLastAction(`"${draftTitle}" kaydedildi`);
          }
          setDraftTitle(''); setSpeechText(''); setDraftDuration(60); setMode('idle');
        }
        break;

      case 'delete_event':
        if (highlightedSlot !== null) {
          const slotEvents = events.filter((e) => e.date === selectedDate && e.startHour === highlightedSlot);
          if (slotEvents.length > 0) {
            const toDelete = slotEvents[0];
            if (googleSignedIn) {
              removeGoogleEvent(toDelete.id);
            } else if (firebaseUser) {
              deleteFirestoreEvent(firebaseUser.uid, toDelete.id);
              setLastAction(`"${toDelete.title}" silindi`);
            }
          }
        }
        break;

      case 'next_day': goNextDay(); setLastAction('Sonraki gun'); break;
      case 'prev_day': goPrevDay(); setLastAction('Onceki gun'); break;
      case 'toggle_view': toggleView(); setLastAction('Gorunum degistirildi'); break;
    }
  }, [
    currentGesture, mode, draftTitle, draftDuration, highlightedSlot,
    selectedDate, events, googleSignedIn, firebaseUser,
    setMode, removeEvent, goNextDay, goPrevDay, toggleView,
    setLastAction, setDraftTitle, setSpeechText, setDraftDuration,
    addGoogleEvent, removeGoogleEvent,
  ]);

  useEffect(() => { processAction(); }, [currentGesture]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auth loading screen
  if (authLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-bg">
        <BackgroundStars />
        <PixelFrog size={72} className="animate-hop" />
        <p className="font-pixel text-[12px] text-cream/60 mt-4 animate-pulse">YUKLENIYOR...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-bg">
      {/* Background stars — memoized so they don't regenerate on every render */}
      <BackgroundStars />

      <Onboarding />
      <HandCursor />
      <EventCreator />

      {error && (
        <div className="relative z-10 pixel-border-sm border-rose/50 bg-rose/15 px-5 py-2 flex items-center justify-between">
          <span className="text-[20px] font-body text-rose">{error}</span>
          <button onClick={() => setError(null)} className="font-pixel text-[9px] text-cream/40 hover:text-rose">KAPAT</button>
        </div>
      )}

      <GestureIndicator />

      <div className="flex-1 flex min-h-0 relative z-10">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'w-80' : 'w-0'} shrink-0 transition-all duration-200 overflow-hidden
          border-r-[3px] border-peach/40 bg-mint/15 flex flex-col
        `}>
          <div className="p-4 space-y-4 flex-1 overflow-y-auto">
            {/* Big title with Aston Script */}
            <div className="text-center py-3 pixel-border border-peach/50 bg-white/50">
              <div className="flex items-center justify-center gap-3 mb-1">
                <PixelFrog size={28} className="animate-hop" />
                <PixelCat size={28} className="animate-wiggle" />
                <PixelLion size={28} className="animate-float" />
              </div>
              <h1 className="font-script text-[36px] text-rose leading-tight"
                style={{ textShadow: '0 0 25px rgba(229,0,70,0.3), 2px 2px 0px rgba(0,0,0,0.15)' }}>
                Air Planner
              </h1>
              <p className="text-[20px] font-body text-cream/60 flex items-center justify-center gap-2 mt-1">
                <PixelHand size={18} /> El ile Takvim Yonetimi
              </p>
            </div>

            {/* Camera - en ustte */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PixelLion size={18} />
                <span className="font-pixel text-[9px] text-cream/50">KAMERA</span>
              </div>
              <div className="pixel-border border-peach/40 h-44 overflow-hidden">
                <CameraView />
              </div>
            </div>

            <MiniCalendar />

            {/* Gesture reference */}
            {mode === 'idle' && (
              <div className="pixel-border border-mint/50 bg-white/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <PixelFrog size={18} />
                  <span className="font-pixel text-[9px] text-cream/50">EL HAREKETLERI</span>
                </div>
                <div className="space-y-2 text-[22px] font-body">
                  {[
                    [<PixelHand size={18} key="h" />, 'El Ac', 'Hareket', 'text-cream'],
                    [<PixelFist size={18} key="f" />, 'Yumruk', 'Tikla/Kaydet', 'text-cream'],
                    [<PixelStar size={18} color="#C7DB9C" key="s" />, 'Peace', 'Gorunum', 'text-cream'],
                    [<PixelHeart size={18} color="#E50046" key="t" />, 'T.Down', 'Sil', 'text-rose'],
                    [<PixelArrowLeft size={16} key="a1" />, 'Swipe', 'Gun', 'text-cream'],
                  ].map(([icon, gesture, action, color], i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-6 flex justify-center">{icon}</div>
                      <span className="text-cream/50 flex-1">{gesture as string}</span>
                      <span className={color as string}>{action as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Account & logout — pinned to bottom */}
          {userName && (
            <div className="px-4 py-3 border-t-[2px] border-peach/30 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-rose/20 border-2 border-rose/40 flex items-center justify-center shrink-0">
                  <span className="font-pixel text-[7px] text-rose">{userName.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-[14px] font-body text-cream/70 truncate">{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="font-pixel text-[7px] text-rose/50 hover:text-rose transition-colors shrink-0 ml-2"
              >
                CIKIS
              </button>
            </div>
          )}
        </div>

        {/* Sidebar toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-6 shrink-0 flex items-center justify-center
            bg-bg-light/30 hover:bg-rose/15 transition-colors border-r border-rose/10">
          {sidebarOpen
            ? <PixelArrowLeft size={10} color="#E50046" />
            : <PixelArrowRight size={10} color="#E50046" />}
        </button>

        {/* Calendar */}
        <div className="flex-1 min-w-0">
          <CalendarView />
        </div>
      </div>

      <StatusBar />
    </div>
  );
}

export default App;
