import type { CalendarEvent } from '../types';

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
