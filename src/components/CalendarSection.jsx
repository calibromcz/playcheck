import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Pin, MapPin, Clock, Plus, Share2 } from 'lucide-react';

const MONTH_NAMES = [
  'GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
  'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'
];

const DAY_NAMES_FULL = [
  'DOMENICA', 'LUNEDÌ', 'MARTEDÌ', 'MERCOLEDÌ', 'GIOVEDÌ', 'VENERDÌ', 'SABATO'
];

export default function CalendarSection({ events, onSelectEvent, onPinForDate }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  };

  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // LUN = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  // Map events per date
  const eventsByDate = {};
  events.forEach(evt => {
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
    } catch (e) {
      return selectedDateStr;
    }
  };

  const handleShareWhatsApp = () => {
    if (selectedDayEvents.length === 0) return;
    const lines = [
      `🎲 *PLAYCHECK — PARTITE IN PROGRAMMA*`,
      `📅 *${getSelectedDayLabel()}*`,
      ...selectedDayEvents.map(e => `• *${e.gameTitle}* alle *${e.time || '21:00'}* (${e.location || 'Tavolo da gioco'})${e.notes ? ` — "${e.notes}"` : ''}`),
      `\nCi siete? 🚀`
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    alert('Programma copiato negli appunti per WhatsApp!');
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Intestazione Sezione Grande */}
      <div className="text-center pt-2">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#141414]">
          CALENDARIO
        </h2>
        <p className="text-xs font-medium text-[#141414]/60">
          Tocca un giorno per vedere gli eventi o fissare una partita
        </p>
      </div>

      {/* Griglia Calendario Mensile Ampia */}
      <div className="bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-4">
        {/* Header compatto Mese e tasto OGGI */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#141414]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevMonth}
              className="w-9 h-9 flex items-center justify-center border-2 border-[#141414] bg-[#F4EFE6] active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Mese precedente"
            >
              <ChevronLeft size={18} className="stroke-[3]" />
            </button>
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#141414] px-2 min-w-[150px] text-center">
              {MONTH_NAMES[month]} {year}
            </h3>
            <button
              onClick={nextMonth}
              className="w-9 h-9 flex items-center justify-center border-2 border-[#141414] bg-[#F4EFE6] active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Mese successivo"
            >
              <ChevronRight size={18} className="stroke-[3]" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="btn-tactile-sm bg-[#FFE600] px-3 py-1 font-mono text-xs font-black uppercase text-[#141414]"
          >
            OGGI
          </button>
        </div>

        {/* Intestazione giorni settimana */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold uppercase pb-2 text-[#141414]/70">
          <div>L</div>
          <div>M</div>
          <div>M</div>
          <div>G</div>
          <div>V</div>
          <div className="text-[#FF4522]">S</div>
          <div className="text-[#FF4522]">D</div>
        </div>

        {/* Celle Giorno ampie (min-h-[52px], centrati 16px) */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="min-h-[52px]" />;
            }

            const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = cellDateStr === todayStr;
            const isSelected = cellDateStr === selectedDateStr;
            const dayEvents = eventsByDate[cellDateStr] || [];
            const hasPinned = dayEvents.some(e => e.pinned);
            const count = dayEvents.length;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDateStr(cellDateStr)}
                className={`min-h-[52px] border-2 flex flex-col items-center justify-center relative transition-all select-none ${
                  isSelected
                    ? 'bg-[#141414] text-[#FFE600] font-black border-[#141414] ring-2 ring-[#FFE600]'
                    : isToday
                    ? 'border-2 border-[#FF4522] bg-[#FFE600]/25 font-bold text-[#141414]'
                    : 'border-[#141414]/30 bg-white hover:bg-[#F4EFE6] text-[#141414]'
                }`}
              >
                <span className="font-display text-[16px] font-bold leading-none">
                  {day}
                </span>

                {/* Indicatore visibile di pin o eventi */}
                {count > 0 && (
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {hasPinned ? (
                      <Pin 
                        size={11} 
                        className={`stroke-[3] ${isSelected ? 'fill-[#FFE600] text-[#FFE600]' : 'fill-[#FF4522] text-[#FF4522]'}`} 
                      />
                    ) : (
                      <span 
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-[#FFE600]' : 'bg-[#FF4522]'
                        }`} 
                      />
                    )}
                    {count > 1 && (
                      <span className={`font-mono text-[9px] font-bold ${isSelected ? 'text-[#FFE600]' : 'text-[#141414]'}`}>
                        {count}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pannello del Giorno Selezionato */}
      <div className="bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-4 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
          <div className="text-left">
            <span className="font-mono text-[10px] uppercase font-bold text-[#141414]/60 block tracking-wider">
              DETTAGLIO DATA
            </span>
            <h3 className="font-display text-base font-extrabold uppercase text-[#141414] tracking-tight">
              {getSelectedDayLabel()}
            </h3>
          </div>

          {selectedDayEvents.length > 0 && (
            <button
              onClick={handleShareWhatsApp}
              className="btn-tactile-sm bg-[#B8FF2C] px-2.5 py-1.5 font-mono text-xs font-bold flex items-center gap-1.5"
              title="Copia messaggio per WhatsApp"
            >
              <Share2 size={13} className="stroke-[2.5]" />
              <span>CONDIVIDI</span>
            </button>
          )}
        </div>

        {/* Lista degli eventi del giorno */}
        {selectedDayEvents.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <p className="font-mono text-xs uppercase text-[#141414]/60 font-semibold">
              Nessuna partita programmata per questa data.
            </p>
            <button
              type="button"
              onClick={() => onPinForDate(selectedDateStr)}
              className="w-full btn-tactile bg-[#FFE600] font-display text-sm font-bold uppercase py-3 flex items-center justify-center gap-2"
            >
              <Plus size={18} className="stroke-[3]" />
              <span>+ PINNA SUL CALENDARIO</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedDayEvents.map(evt => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className={`p-3 border-2 border-[#141414] flex items-center justify-between cursor-pointer active:translate-x-[1px] active:translate-y-[1px] ${
                  evt.pinned ? 'bg-[#FFE600]/25' : 'bg-[#F4EFE6]'
                }`}
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    {evt.pinned && <Pin size={13} className="fill-[#FF4522] text-[#FF4522] shrink-0" />}
                    <h4 className="font-display text-[16px] font-bold uppercase text-[#141414] truncate">
                      {evt.gameTitle}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-xs text-[#141414]/75">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      <b>{evt.time || '21:00'}</b>
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={12} />
                      <span className="truncate">{evt.location || 'Tavolo da gioco'}</span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 font-mono text-[11px] font-bold bg-white border border-[#141414] px-2 py-1">
                  DETTAGLI
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onPinForDate(selectedDateStr)}
              className="w-full btn-tactile-sm bg-[#FFFDF8] border-dashed border-[#141414] text-[#141414] font-mono text-xs font-bold uppercase py-2.5 flex items-center justify-center gap-1 mt-2"
            >
              <Plus size={15} />
              <span>AGGIUNGI UN'ALTRA PARTITA</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
