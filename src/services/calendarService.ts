import type { CalendarEvent } from '../types';

const STORAGE_KEY = 'calendar-events';

// Color palette for events
const EVENT_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6',
];

function getRandomColor(): string {
  return EVENT_COLORS[Math.floor(Math.random() * EVENT_COLORS.length)];
}

function generateId(): string {
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function loadEvents(): CalendarEvent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : getMockEvents();
  } catch {
    return getMockEvents();
  }
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function createEvent(
  title: string,
  date: string,
  startHour: number,
  startMinute: number,
  duration: number
): CalendarEvent {
  return {
    id: generateId(),
    title,
    date,
    startHour,
    startMinute,
    duration,
    color: getRandomColor(),
  };
}

export function deleteEvent(events: CalendarEvent[], id: string): CalendarEvent[] {
  return events.filter((e) => e.id !== id);
}

export function getEventsForDate(events: CalendarEvent[], date: string): CalendarEvent[] {
  return events.filter((e) => e.date === date);
}

export function getEventsForWeek(events: CalendarEvent[], startDate: string): CalendarEvent[] {
  const start = new Date(startDate);
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return events.filter((e) => dates.includes(e.date));
}

function getMockEvents(): CalendarEvent[] {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const events: CalendarEvent[] = [
    {
      id: generateId(),
      title: 'Sabah Toplantısı',
      date: today,
      startHour: 9,
      startMinute: 0,
      duration: 60,
      color: '#6366f1',
    },
    {
      id: generateId(),
      title: 'Öğle Yemeği',
      date: today,
      startHour: 12,
      startMinute: 30,
      duration: 60,
      color: '#22c55e',
    },
    {
      id: generateId(),
      title: 'Proje Sunumu',
      date: today,
      startHour: 15,
      startMinute: 0,
      duration: 90,
      color: '#f97316',
    },
    {
      id: generateId(),
      title: 'Spor',
      date: tomorrow,
      startHour: 18,
      startMinute: 0,
      duration: 60,
      color: '#ec4899',
    },
  ];

  saveEvents(events);
  return events;
}
