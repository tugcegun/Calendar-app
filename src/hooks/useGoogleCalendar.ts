import { useEffect, useCallback, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import {
  initGapi,
  initGis,
  signIn,
  signOut,
  isApiReady,
  listEvents,
  createGoogleEvent,
  deleteGoogleEvent,
  setAuthChangeCallback,
  getColorHex,
} from '../services/googleCalendarApi';
import type { CalendarEvent } from '../types';

export function useGoogleCalendar() {
  const {
    googleSignedIn,
    setGoogleSignedIn,
    setGoogleLoading,
    selectedDate,
    setEvents,
    setError,
    setLastAction,
  } = useAppStore();

  const initedRef = useRef(false);

  // Initialize Google API on mount
  useEffect(() => {
    if (initedRef.current) return;
    initedRef.current = true;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
    if (!clientId || clientId === 'YOUR_CLIENT_ID_HERE') {
      // No client ID configured — stay in mock mode silently
      return;
    }

    setAuthChangeCallback((signedIn: boolean) => {
      setGoogleSignedIn(signedIn);
      if (signedIn) {
        setLastAction('Google hesabına bağlanıldı');
      }
    });

    // Wait for scripts to load then init
    const tryInit = () => {
      if (window.gapi && window.google) {
        initGapi().then(() => {
          initGis();
        }).catch((err) => {
          console.error('Google API init error:', err);
        });
      } else {
        setTimeout(tryInit, 200);
      }
    };
    tryInit();
  }, [setGoogleSignedIn, setLastAction]);

  // Fetch events when signed in or date changes
  useEffect(() => {
    if (!googleSignedIn || !isApiReady()) return;

    fetchGoogleEvents();
  }, [googleSignedIn, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchGoogleEvents = useCallback(async () => {
    if (!googleSignedIn) return;

    setGoogleLoading(true);
    try {
      // Fetch events for the current week
      const start = new Date(selectedDate);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(end.getDate() + 7);

      const googleEvents = await listEvents(start.toISOString(), end.toISOString());

      const calendarEvents: CalendarEvent[] = googleEvents.map((ge) => ({
        id: ge.id,
        title: ge.title,
        date: ge.start.toISOString().split('T')[0],
        startHour: ge.start.getHours(),
        startMinute: ge.start.getMinutes(),
        duration: Math.round((ge.end.getTime() - ge.start.getTime()) / 60000),
        color: getColorHex(ge.colorId),
      }));

      setEvents(calendarEvents);
    } catch (err) {
      console.error('Failed to fetch Google events:', err);
      setError('Google Calendar etkinlikleri alınamadı.');
    } finally {
      setGoogleLoading(false);
    }
  }, [googleSignedIn, selectedDate, setEvents, setError, setGoogleLoading]);

  const addGoogleEvent = useCallback(async (
    title: string,
    date: string,
    startHour: number,
    startMinute: number,
    duration: number
  ) => {
    if (!googleSignedIn) return null;

    setGoogleLoading(true);
    try {
      const startTime = new Date(`${date}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const created = await createGoogleEvent(title, startTime, endTime);
      setLastAction(`"${title}" Google Calendar'a eklendi`);
      await fetchGoogleEvents();
      return created;
    } catch (err) {
      console.error('Failed to create Google event:', err);
      setError('Etkinlik oluşturulamadı.');
      return null;
    } finally {
      setGoogleLoading(false);
    }
  }, [googleSignedIn, setGoogleLoading, setLastAction, setError, fetchGoogleEvents]);

  const removeGoogleEvent = useCallback(async (eventId: string) => {
    if (!googleSignedIn) return;

    setGoogleLoading(true);
    try {
      await deleteGoogleEvent(eventId);
      setLastAction('Etkinlik Google Calendar\'dan silindi');
      await fetchGoogleEvents();
    } catch (err) {
      console.error('Failed to delete Google event:', err);
      setError('Etkinlik silinemedi.');
    } finally {
      setGoogleLoading(false);
    }
  }, [googleSignedIn, setGoogleLoading, setLastAction, setError, fetchGoogleEvents]);

  return {
    isConnected: googleSignedIn,
    connect: signIn,
    disconnect: signOut,
    addGoogleEvent,
    removeGoogleEvent,
    refreshEvents: fetchGoogleEvents,
  };
}
