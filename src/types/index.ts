// Hand tracking types
export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface HandData {
  landmarks: Landmark[];
  handedness: 'Left' | 'Right';
}

// Gesture types
export type GestureType =
  | 'pointing'      // İşaret parmağı
  | 'open_palm'     // Avuç açık
  | 'fist'          // Yumruk
  | 'peace'         // Peace sign
  | 'pinch'         // Baş parmak + işaret parmağı
  | 'thumbs_down'   // Thumbs down
  | 'swipe_left'    // Sola savurma
  | 'swipe_right'   // Sağa savurma
  | 'none';

export interface GestureResult {
  type: GestureType;
  confidence: number;
  timestamp: number;
}

// Finger state
export interface FingerState {
  thumb: boolean;
  index: boolean;
  middle: boolean;
  ring: boolean;
  pinky: boolean;
}

// Calendar types
export type ViewMode = 'daily' | 'weekly';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;        // YYYY-MM-DD
  startHour: number;   // 0-23
  startMinute: number; // 0-59
  duration: number;    // minutes
  color: string;
}

// App action types
export type AppAction =
  | 'create_event'
  | 'save_event'
  | 'delete_event'
  | 'next_day'
  | 'prev_day'
  | 'toggle_view'
  | 'adjust_duration'
  | 'select_slot'
  | 'click_select'
  | 'none';

// App modes
export type AppMode = 'idle' | 'creating' | 'selecting' | 'confirming';

// Speech recognition
export interface SpeechResult {
  text: string;
  isFinal: boolean;
}
