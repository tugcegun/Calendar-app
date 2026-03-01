// Google Calendar API Integration
// Uses Google Identity Services (GIS) for auth + gapi for Calendar API

const SCOPES = 'https://www.googleapis.com/auth/calendar';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

// Extend window types for gapi and google
declare global {
  interface Window {
    gapi: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: { discoveryDocs: string[] }) => Promise<void>;
        calendar: {
          events: {
            list: (params: Record<string, unknown>) => Promise<GapiResponse<GapiEventList>>;
            insert: (params: Record<string, unknown>) => Promise<GapiResponse<GapiEvent>>;
            delete: (params: Record<string, unknown>) => Promise<void>;
            patch: (params: Record<string, unknown>) => Promise<GapiResponse<GapiEvent>>;
          };
        };
        getToken: () => { access_token: string } | null;
        setToken: (token: { access_token: string } | null) => void;
      };
    };
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: TokenResponse) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

interface TokenResponse {
  access_token: string;
  error?: string;
}

interface TokenClient {
  requestAccessToken: (config?: { prompt?: string }) => void;
}

interface GapiResponse<T> {
  result: T;
}

interface GapiEventList {
  items?: GapiEvent[];
}

interface GapiEvent {
  id?: string;
  summary?: string;
  start?: { dateTime?: string; date?: string };
  end?: { dateTime?: string; date?: string };
  colorId?: string;
}

let tokenClient: TokenClient | null = null;
let gapiInited = false;
let gisInited = false;
let onAuthChange: ((signedIn: boolean) => void) | null = null;

export function setAuthChangeCallback(cb: (signedIn: boolean) => void) {
  onAuthChange = cb;
}

export async function initGapi(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.gapi) {
      reject(new Error('Google API (gapi) yüklenemedi. Sayfayı yenileyin.'));
      return;
    }
    window.gapi.load('client', async () => {
      try {
        await window.gapi.client.init({
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiInited = true;
        maybeEnableApi();
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}

export function initGis(): void {
  if (!window.google) {
    console.warn('Google Identity Services yüklenemedi.');
    return;
  }
  if (!CLIENT_ID || CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
    console.warn('Google Client ID ayarlanmamış. .env dosyasına VITE_GOOGLE_CLIENT_ID ekleyin.');
    return;
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: TokenResponse) => {
      if (response.error) {
        console.error('Auth error:', response.error);
        onAuthChange?.(false);
        return;
      }
      onAuthChange?.(true);
    },
  });

  gisInited = true;
  maybeEnableApi();
}

function maybeEnableApi() {
  if (gapiInited && gisInited) {
    // Check if already signed in
    const token = window.gapi.client.getToken();
    if (token) {
      onAuthChange?.(true);
    }
  }
}

export function isApiReady(): boolean {
  return gapiInited && gisInited;
}

export function signIn(): void {
  if (!tokenClient) {
    console.error('Token client henüz başlatılmadı');
    return;
  }
  const token = window.gapi.client.getToken();
  if (token === null) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    tokenClient.requestAccessToken({ prompt: '' });
  }
}

export function signOut(): void {
  const token = window.gapi.client.getToken();
  if (token) {
    window.gapi.client.setToken(null);
  }
  onAuthChange?.(false);
}

export function isSignedIn(): boolean {
  return !!window.gapi?.client?.getToken();
}

// --- Calendar CRUD ---

export interface GoogleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  colorId?: string;
}

const COLOR_MAP: Record<string, string> = {
  '1': '#7986cb', '2': '#33b679', '3': '#8e24aa', '4': '#e67c73',
  '5': '#f6bf26', '6': '#f4511e', '7': '#039be5', '8': '#616161',
  '9': '#3f51b5', '10': '#0b8043', '11': '#d50000',
};

export function getColorHex(colorId?: string): string {
  return COLOR_MAP[colorId || ''] || '#6366f1';
}

export async function listEvents(
  timeMin: string,
  timeMax: string
): Promise<GoogleEvent[]> {
  const response = await window.gapi.client.calendar.events.list({
    calendarId: 'primary',
    timeMin,
    timeMax,
    showDeleted: false,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 100,
  });

  const items = response.result.items || [];
  return items
    .filter((item) => item.start?.dateTime) // skip all-day events
    .map((item) => ({
      id: item.id || '',
      title: item.summary || '(İsimsiz)',
      start: new Date(item.start!.dateTime!),
      end: new Date(item.end!.dateTime!),
      colorId: item.colorId,
    }));
}

export async function createGoogleEvent(
  title: string,
  startTime: Date,
  endTime: Date
): Promise<GoogleEvent> {
  const response = await window.gapi.client.calendar.events.insert({
    calendarId: 'primary',
    resource: {
      summary: title,
      start: { dateTime: startTime.toISOString() },
      end: { dateTime: endTime.toISOString() },
    },
  });

  const evt = response.result;
  return {
    id: evt.id || '',
    title: evt.summary || title,
    start: new Date(evt.start!.dateTime!),
    end: new Date(evt.end!.dateTime!),
    colorId: evt.colorId,
  };
}

export async function deleteGoogleEvent(eventId: string): Promise<void> {
  await window.gapi.client.calendar.events.delete({
    calendarId: 'primary',
    eventId,
  });
}
