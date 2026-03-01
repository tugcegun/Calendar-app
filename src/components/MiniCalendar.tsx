import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { PixelArrowLeft, PixelArrowRight, PixelStar } from './PixelIcons';

const DAY_LABELS = ['Pt', 'Sa', 'Ca', 'Pe', 'Cu', 'Ct', 'Pa'];
const MONTH_NAMES = [
  'OCAK', 'SUBAT', 'MART', 'NISAN', 'MAYIS', 'HAZIRAN',
  'TEMMUZ', 'AGUSTOS', 'EYLUL', 'EKIM', 'KASIM', 'ARALIK',
];

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

export function MiniCalendar() {
  const { selectedDate, setSelectedDate } = useAppStore();
  const selectedDateObj = useMemo(() => new Date(selectedDate), [selectedDate]);
  const [viewMonth, setViewMonth] = useState(selectedDateObj.getMonth());
  const [viewYear, setViewYear] = useState(selectedDateObj.getFullYear());
  const today = todayStr();

  const days = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    const cells: { date: Date; current: boolean }[] = [];

    for (let i = startDay - 1; i >= 0; i--)
      cells.push({ date: new Date(viewYear, viewMonth - 1, daysInPrevMonth - i), current: false });
    for (let d = 1; d <= daysInMonth; d++)
      cells.push({ date: new Date(viewYear, viewMonth, d), current: true });
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++)
      cells.push({ date: new Date(viewYear, viewMonth + 1, d), current: false });

    return cells;
  }, [viewMonth, viewYear]);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  return (
    <div className="pixel-border border-peach/40 bg-bg-card p-3">
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center pixel-border-sm border-cream/20 bg-bg hover:bg-rose/15 transition-colors">
          <PixelArrowLeft size={12} color="#1a1a2e" />
        </button>
        <span className="font-pixel text-[9px] text-cream tracking-wide">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center pixel-border-sm border-cream/20 bg-bg hover:bg-rose/15 transition-colors">
          <PixelArrowRight size={12} color="#1a1a2e" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center font-pixel text-[8px] text-cream/50">{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((cell, i) => {
          const dateStr = formatDate(cell.date);
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedDate;
          return (
            <button key={i} onClick={() => setSelectedDate(dateStr)}
              className={`
                w-8 h-8 flex items-center justify-center text-[18px] font-body transition-all
                ${!cell.current ? 'text-cream/15' : 'text-cream/70'}
                ${isToday && !isSelected ? 'bg-rose/15 text-rose font-bold pixel-border-sm border-rose/40' : ''}
                ${isSelected ? 'bg-rose text-white font-bold shadow-pixel-sm' : ''}
                ${!isToday && !isSelected && cell.current ? 'hover:bg-peach/20 hover:text-cream' : ''}
              `}>
              {cell.date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Today button */}
      <button
        onClick={() => {
          const now = new Date();
          setViewMonth(now.getMonth());
          setViewYear(now.getFullYear());
          setSelectedDate(todayStr());
        }}
        className="w-full mt-3 py-2 flex items-center justify-center gap-2 pixel-btn text-[8px] font-pixel
          border-rose/40 bg-rose/10 text-rose hover:bg-rose/20"
      >
        <PixelStar size={12} color="#E50046" />
        <span>BUGUNE DON</span>
      </button>
    </div>
  );
}
