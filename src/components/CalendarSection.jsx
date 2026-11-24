import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Plus } from 'lucide-react';

const MONTH_NAMES = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

const DAY_NAMES_FULL = [
  'Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'
];

export default function CalendarSection({ events, onSelectEvent, onPinForDate }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  };

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Lunedì = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  const eventsByDate = {};
  events.forEach((evt) => {
    if (evt.date) {
      if (!eventsByDate[evt.date]) eventsByDate[evt.date] = [];
      eventsByDate[evt.date].push(evt);
    }
  });

  const selectedDayEvents = eventsByDate[selectedDateStr] || [];

  const getSelectedDayLabel = () => {
    try {
      const [y, m, d] = selectedDateStr.split('-');
      const dObj = new Date(Number(y), Number(m) - 1, Number(d));
      return `${DAY_NAMES_FULL[dObj.getDay()]} ${dObj.getDate()} ${MONTH_NAMES[dObj.getMonth()]}`;
    } catch {
      return selectedDateStr;
    }
  };

  return (
    <div className="pt-2">
      {/* Card Mensile */}
      <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        {/* Header Mese */}
        <div className="grid grid-cols-[36px_1fr_36px] items-center mb-3">
          <button
            type="button"
            onClick={prevMonth}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-[#F0F0F3] hover:text-[#111111] transition-colors"
            aria-label="Mese precedente"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center justify-center gap-2">
            <h2 className="text-[16px] font-semibold capitalize text-[#111111]">
              {MONTH_NAMES[month]} {year}
            </h2>
            {!isCurrentMonth && (
              <button
                type="button"
                onClick={goToToday}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F0F0F3] text-[#111111] hover:bg-[#E5E5EA] transition-colors"
              >
                Oggi
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#6E6E73] hover:bg-[#F0F0F3] hover:text-[#111111] transition-colors"
            aria-label="Mese successivo"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Giorni Settimana */}
        <div className="grid grid-cols-7 text-center mb-1">
          {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((label, idx) => (
            <div key={idx} className="text-[11px] font-semibold text-[#8E8E93] py-1">
              {label}
            </div>
          ))}
        </div>

        {/* Griglia Giorni */}
        <div className="grid grid-cols-7 gap-y-1">
          {calendarCells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-11 w-full" />;
            }

            const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = cellDateStr === todayStr;
            const isSelected = cellDateStr === selectedDateStr;
            const dayEvents = eventsByDate[cellDateStr] || [];
            const hasEvents = dayEvents.length > 0;
            const hasPinned = dayEvents.some((e) => e.pinned);

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDateStr(cellDateStr)}
                className="h-11 w-full flex flex-col items-center justify-center relative rounded-xl transition-colors"
              >
                <span
                  className={
                    isSelected
                      ? 'w-9 h-9 rounded-full bg-[#111111] text-white text-[14px] font-semibold flex items-center justify-center'
                      : isToday
                      ? 'w-9 h-9 rounded-full ring-1 ring-black/25 text-[#111111] text-[14px] font-bold flex items-center justify-center'
                      : 'w-9 h-9 rounded-full text-[#111111] text-[14px] font-medium flex items-center justify-center hover:bg-[#F0F0F3]'
                  }
                >
                  {day}
                </span>

                {hasEvents && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                      isSelected
                        ? 'bg-white'
                        : hasPinned
                        ? 'bg-[#F59E0B]'
                        : 'bg-[#111111]'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pannello Giorno Selezionato */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-semibold text-[#111111]">
            {getSelectedDayLabel()}
          </h3>
          <button
            type="button"
            onClick={() => onPinForDate(selectedDateStr)}
            className="text-[13px] font-semibold text-[#111111] bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] px-3 py-1.5 rounded-full flex items-center gap-1 active:scale-95 transition-transform shrink-0"
          >
            <Plus size={14} />
            <span>Pinna</span>
          </button>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
            <p className="text-center py-6 text-[13px] text-[#8E8E93]">
              Nessun evento pinnato per questa data
            </p>
            <button
              type="button"
              onClick={() => onPinForDate(selectedDateStr)}
              className="bg-[#111111] text-white rounded-xl h-11 w-full font-medium text-[14px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
            >
              <Plus size={16} />
              <span>Pinna gioco su questa data</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="bg-white rounded-2xl p-3.5 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-[15px] font-semibold text-[#111111] leading-snug truncate">
                    {evt.gameTitle}
                  </h4>
                  <div className="flex items-center gap-2.5 mt-1 text-[13px] text-[#6E6E73]">
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock size={13} />
                      <span>{evt.time || '21:00'}</span>
                    </span>
                    <span className="text-[#AEAEB2]">·</span>
                    <span className="flex items-center gap-1 min-w-0 truncate">
                      <MapPin size={13} className="shrink-0" />
                      <span className="truncate">{evt.location || 'Tavolo da gioco'}</span>
                    </span>
                  </div>
                </div>
                {evt.pinned && (
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
