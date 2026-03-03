import { create } from 'zustand';
import type { User } from 'firebase/auth';
import type { CalendarEvent, GestureType, AppMode, ViewMode, HandData } from '../types';

interface AppState {
  // Firebase Auth
  firebaseUser: User | null;
  setFirebaseUser: (user: User | null) => void;
  authLoading: boolean;
  setAuthLoading: (loading: boolean) => void;

  // Google Calendar
  googleSignedIn: boolean;
  setGoogleSignedIn: (signedIn: boolean) => void;
  googleLoading: boolean;
  setGoogleLoading: (loading: boolean) => void;

  // Hand tracking
  hands: HandData[];
  setHands: (hands: HandData[]) => void;

  // Gesture
  currentGesture: GestureType;
  setCurrentGesture: (gesture: GestureType) => void;

  // Calendar
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  highlightedSlot: number | null; // hour slot 0-23
  setHighlightedSlot: (slot: number | null) => void;

  // Events
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  setEvents: (events: CalendarEvent[]) => void;

  // App mode
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Event creation
  draftTitle: string;
  setDraftTitle: (title: string) => void;
  draftDuration: number;
  setDraftDuration: (duration: number) => void;

  // Camera
  cameraReady: boolean;
  setCameraReady: (ready: boolean) => void;

  // Speech
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  speechText: string;
  setSpeechText: (text: string) => void;

  // Feedback
  lastAction: string;
  setLastAction: (action: string) => void;

  // Errors
  error: string | null;
  setError: (error: string | null) => void;

  // Hand cursor position (normalized 0-1)
  cursorPos: { x: number; y: number } | null;
  setCursorPos: (pos: { x: number; y: number } | null) => void;

  // Onboarding
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;

  // Navigation helpers
  goNextDay: () => void;
  goPrevDay: () => void;
  toggleView: () => void;
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const useAppStore = create<AppState>((set, get) => ({
  // Firebase Auth
  firebaseUser: null,
  setFirebaseUser: (user) => set({ firebaseUser: user }),
  authLoading: true,
  setAuthLoading: (loading) => set({ authLoading: loading }),

  // Google Calendar
  googleSignedIn: false,
  setGoogleSignedIn: (signedIn) => set({ googleSignedIn: signedIn }),
  googleLoading: false,
  setGoogleLoading: (loading) => set({ googleLoading: loading }),

  // Hand tracking
  hands: [],
  setHands: (hands) => set({ hands }),

  // Gesture
  currentGesture: 'none',
  setCurrentGesture: (gesture) => set({ currentGesture: gesture }),

  // Calendar
  selectedDate: formatDate(new Date()),
  setSelectedDate: (date) => set({ selectedDate: date }),
  viewMode: 'daily',
  setViewMode: (mode) => set({ viewMode: mode }),
  highlightedSlot: null,
  setHighlightedSlot: (slot) => set({ highlightedSlot: slot }),

  // Events (managed by Firestore via useAuth hook)
  events: [],
  addEvent: (event) => {
    set({ events: [...get().events, event] });
  },
  removeEvent: (id) => {
    set({ events: get().events.filter((e) => e.id !== id) });
  },
  setEvents: (events) => {
    set({ events });
  },

  // App mode
  mode: 'idle',
  setMode: (mode) => set({ mode }),

  // Event creation
  draftTitle: '',
  setDraftTitle: (title) => set({ draftTitle: title }),
  draftDuration: 60,
  setDraftDuration: (duration) => set({ draftDuration: Math.max(15, Math.min(480, duration)) }),

  // Camera
  cameraReady: false,
  setCameraReady: (ready) => set({ cameraReady: ready }),

  // Speech
  isListening: false,
  setIsListening: (listening) => set({ isListening: listening }),
  speechText: '',
  setSpeechText: (text) => set({ speechText: text }),

  // Feedback
  lastAction: '',
  setLastAction: (action) => set({ lastAction: action }),

  // Errors
  error: null,
  setError: (error) => set({ error }),

  // Hand cursor
  cursorPos: null,
  setCursorPos: (pos) => set({ cursorPos: pos }),

  // Onboarding
  showOnboarding: !localStorage.getItem('onboarding-done'),
  setShowOnboarding: (show) => {
    if (!show) localStorage.setItem('onboarding-done', 'true');
    set({ showOnboarding: show });
  },

  // Navigation helpers
  goNextDay: () => {
    const current = new Date(get().selectedDate);
    current.setDate(current.getDate() + 1);
    set({ selectedDate: formatDate(current) });
  },
  goPrevDay: () => {
    const current = new Date(get().selectedDate);
    current.setDate(current.getDate() - 1);
    set({ selectedDate: formatDate(current) });
  },
  toggleView: () => {
    set({ viewMode: get().viewMode === 'daily' ? 'weekly' : 'daily' });
  },
}));
