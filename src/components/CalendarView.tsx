import { useMemo, memo, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getEventsForDate, getEventsForWeek } from '../services/calendarService';
import { CALENDAR_START_HOUR, CALENDAR_END_HOUR } from '../utils/coordinateMapper';
import { PixelArrowLeft, PixelArrowRight, PixelStar, PixelCalendar } from './PixelIcons';
import type { CalendarEvent } from '../types';

const HOURS = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR },
  (_, i) => i + CALENDAR_START_HOUR
);

const DAY_NAMES_FULL = ['Pazar', 'Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi'];
const DAY_NAMES_SHORT = ['Pa', 'Pt', 'Sa', 'Ca', 'Pe', 'Cu', 'Ct'];
const MONTH_NAMES = [
  'Ocak', 'Subat', 'Mart', 'Nisan', 'Mayis', 'Haziran',
  'Temmuz', 'Agustos', 'Eylul', 'Ekim', 'Kasim', 'Aralik',
];

function formatHour(h: number): string {
  return `${h.toString().padStart(2, '0')}:00`;
}

function formatEndTime(startHour: number, startMinute: number, duration: number): string {
  const totalMin = startHour * 60 + startMinute + duration;
  return `${Math.floor(totalMin / 60).toString().padStart(2, '0')}:${(totalMin % 60).toString().padStart(2, '0')}`;
}

function getEventStyle(event: CalendarEvent): React.CSSProperties {
  const top = ((event.startHour - CALENDAR_START_HOUR) + event.startMinute / 60) * 60;
  const height = (event.duration / 60) * 60;
  const color = event.color || '#E50046';
  return { top: `${top}px`, height: `${Math.max(height, 32)}px`, backgroundColor: color + '30', borderColor: color };
}

function getWeekDates(dateStr: string): Date[] {
  const date = new Date(dateStr);
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function todayStr(): string { return new Date().toISOString().split('T')[0]; }

export const CalendarView = memo(function CalendarView() {
  const {
    selectedDate, viewMode, highlightedSlot, events, mode,
    goNextDay, goPrevDay, toggleView, setHighlightedSlot, setMode,
  } = useAppStore();

  const selectedDateObj = useMemo(() => new Date(selectedDate), [selectedDate]);
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);
  const isToday = selectedDate === todayStr();

  const dailyEvents = useMemo(() => getEventsForDate(events, selectedDate), [events, selectedDate]);
  const weeklyEvents = useMemo(
    () => getEventsForWeek(events, weekDates[0].toISOString().split('T')[0]),
    [events, weekDates]
  );

  const handleSlotClick = useCallback((hour: number) => {
    setHighlightedSlot(hour);
    if (mode === 'idle') setMode('creating');
  }, [mode, setHighlightedSlot, setMode]);

  const header = (
    <div className="flex items-center gap-3 px-5 py-3 border-b-[3px] border-peach/40 bg-peach/15">
      {/* Day badge */}
      <div className={`
        w-14 h-14 flex flex-col items-center justify-center pixel-border
        ${isToday ? 'border-rose bg-rose/15 text-rose' : 'border-cream/30 bg-bg text-cream'}
      `}>
        <span className="font-pixel text-[10px] leading-none">{selectedDateObj.getDate()}</span>
        <span className="text-[18px] mt-0.5 font-body">{DAY_NAMES_SHORT[selectedDateObj.getDay()]}</span>
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h2 className="font-pixel text-[10px] text-cream leading-tight">
          {DAY_NAMES_FULL[selectedDateObj.getDay()]}
        </h2>
        <p className="text-[20px] text-cream/60 mt-1 font-body">
          {selectedDateObj.getDate()} {MONTH_NAMES[selectedDateObj.getMonth()]} {selectedDateObj.getFullYear()}
          {dailyEvents.length > 0 && (
            <span className="text-rose ml-3">
              <PixelCalendar size={16} className="inline-block mr-1 -mt-0.5" />
              {dailyEvents.length} etkinlik
            </span>
          )}
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2">
        <button onClick={goPrevDay}
          className="pixel-btn px-4 py-2 text-[8px] font-pixel border-peach/50 bg-peach/20 text-cream hover:bg-peach/35 flex items-center gap-2">
          <PixelArrowLeft size={10} color="#1a1a2e" /> ONCEKI
        </button>

        {!isToday && (
          <button onClick={() => useAppStore.getState().setSelectedDate(todayStr())}
            className="pixel-btn px-4 py-2 text-[8px] font-pixel border-rose/50 bg-rose/15 text-rose hover:bg-rose/25 flex items-center gap-2">
            <PixelStar size={10} color="#E50046" /> BUGUN
          </button>
        )}

        <button onClick={goNextDay}
          className="pixel-btn px-4 py-2 text-[8px] font-pixel border-peach/50 bg-peach/20 text-cream hover:bg-peach/35 flex items-center gap-2">
          SONRAKI <PixelArrowRight size={10} color="#1a1a2e" />
        </button>

        <div className="flex ml-3">
          <button onClick={() => { if (viewMode !== 'daily') toggleView(); }}
            className={`pixel-btn px-4 py-2 text-[8px] font-pixel border-rose/40
              ${viewMode === 'daily' ? 'bg-rose/25 text-rose' : 'bg-bg text-cream/40 hover:text-cream/70'}`}>
            GUN
          </button>
          <button onClick={() => { if (viewMode !== 'weekly') toggleView(); }}
            className={`pixel-btn px-4 py-2 text-[8px] font-pixel border-rose/40 -ml-[3px]
              ${viewMode === 'weekly' ? 'bg-rose/25 text-rose' : 'bg-bg text-cream/40 hover:text-cream/70'}`}>
            HAFTA
          </button>
        </div>
      </div>
    </div>
  );

  // WEEKLY VIEW
  if (viewMode === 'weekly') {
    return (
      <div className="flex flex-col h-full">
        {header}
        <div className="flex border-b-2 border-peach/20">
          <div className="w-16 shrink-0" />
          {weekDates.map((d, i) => {
            const dateStr = d.toISOString().split('T')[0];
            const today = dateStr === todayStr();
            const selected = dateStr === selectedDate;
            return (
              <div key={i}
                className={`flex-1 text-center py-3 cursor-pointer transition-colors
                  ${today ? 'bg-rose/5' : selected ? 'bg-peach/10' : 'hover:bg-peach/5'}`}
                onClick={() => useAppStore.getState().setSelectedDate(dateStr)}>
                <div className={`font-pixel text-[8px] tracking-wide ${today ? 'text-rose' : 'text-cream/40'}`}>
                  {DAY_NAMES_SHORT[d.getDay()]}
                </div>
                <div className={`
                  w-9 h-9 mx-auto flex items-center justify-center mt-1 text-[20px] font-body
                  ${today ? 'pixel-border-sm border-rose bg-rose/20 text-rose font-bold'
                    : selected ? 'pixel-border-sm border-peach bg-peach/20 text-cream'
                    : 'text-cream/50'}
                `}>{d.getDate()}</div>
              </div>
            );
          })}
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="relative flex" style={{ height: `${HOURS.length * 60}px` }}>
            <div className="w-16 shrink-0">
              {HOURS.map((h) => (
                <div key={h} className="h-[60px] flex items-start justify-end pr-2 -mt-2">
                  <span className="text-[20px] font-body text-cream/25">{formatHour(h)}</span>
                </div>
              ))}
            </div>
            {weekDates.map((d, dayIdx) => {
              const dateStr = d.toISOString().split('T')[0];
              const dayEvents = weeklyEvents.filter((e) => e.date === dateStr);
              return (
                <div key={dayIdx} className={`flex-1 relative border-l-2 border-cream/[0.06]
                  ${dateStr === todayStr() ? 'bg-rose/[0.03]' : ''}`}>
                  {HOURS.map((h) => <div key={h} className="h-[60px] border-b border-cream/[0.06]" />)}
                  {dayEvents.map((evt) => (
                    <div key={evt.id}
                      onClick={() => {
                        useAppStore.getState().setSelectedDate(dateStr);
                        handleSlotClick(evt.startHour);
                      }}
                      className="absolute left-1 right-1 border-l-[3px] px-2 py-1 text-[20px] font-body
                        overflow-hidden hover:brightness-110 transition-all cursor-pointer pixel-border-sm"
                      style={getEventStyle(evt)}>
                      <span className="text-cream truncate block">{evt.title}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // DAILY VIEW
  return (
    <div className="flex flex-col h-full">
      {header}
      <div className="flex-1 overflow-y-auto">
        <div className="relative" style={{ height: `${HOURS.length * 60}px` }}>
          {HOURS.map((h) => {
            const isHighlighted = highlightedSlot === h;
            return (
              <div key={h} onClick={() => handleSlotClick(h)}
                className={`flex h-[60px] border-b cursor-pointer transition-all duration-100
                  ${isHighlighted ? 'bg-rose/15 border-rose/20' : 'border-cream/[0.08] hover:bg-peach/[0.08]'}`}>
                <div className="w-16 shrink-0 flex items-start justify-end pr-3 -mt-2">
                  <span className={`text-[20px] font-body ${isHighlighted ? 'text-rose font-bold' : 'text-cream/25'}`}>
                    {formatHour(h)}
                  </span>
                </div>
                <div className="flex-1 relative border-l-2 border-cream/[0.08]">
                  {isHighlighted && mode === 'creating' && (
                    <div className="absolute inset-x-1 inset-y-0.5 border-2 border-dashed border-rose/50 bg-rose/5
                      flex items-center justify-center">
                      <span className="font-pixel text-[8px] text-rose">+ BURAYA EKLE</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div className="absolute top-0 left-16 right-0 pointer-events-none">
            {dailyEvents.map((evt) => (
              <div key={evt.id}
                onClick={() => handleSlotClick(evt.startHour)}
                className="absolute left-2 right-2 border-l-[4px] px-4 py-2 cursor-pointer pointer-events-auto
                  transition-all hover:brightness-110 pixel-border-sm"
                style={getEventStyle(evt)}>
                <div className="text-[20px] font-body text-cream font-medium truncate">{evt.title}</div>
                <div className="text-[18px] font-body text-cream/50">
                  {formatHour(evt.startHour)} – {formatEndTime(evt.startHour, evt.startMinute, evt.duration)}
                  <span className="text-cream/30 ml-2">({evt.duration}dk)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
