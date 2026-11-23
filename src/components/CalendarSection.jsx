import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Pin, MapPin, Clock, Plus, Share2 } from 'lucide-react';

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

  // Mappa eventi per data
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
      `🎲 *PlayCheck — Partite in programma*`,
      `📅 *${getSelectedDayLabel()}*`,
      ...selectedDayEvents.map(e => `• *${e.gameTitle}* alle ${e.time || '21:00'}${e.location ? ` (${e.location})` : ''}${e.notes ? ` — "${e.notes}"` : ''}`),
      `\nCi vediamo al tavolo! 🌲`
    ];
    navigator.clipboard?.writeText(lines.join('\n'));
    alert('Dettagli della serata copiati negli appunti per WhatsApp!');
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Intestazione Sezione Editoriale */}
      <div className="text-center pt-2">
        <h2 className="font-serif text-[26px] font-bold text-[#1C1917] tracking-tight">
          Calendario
        </h2>
        <p className="text-[13px] text-[#78716C] mt-0.5">
          Tocca un giorno per scoprire gli appuntamenti o fissare una partita
        </p>
      </div>

      {/* Card Calendario Mensile Pulita Hobonichi */}
      <div className="bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-4">
        {/* Header Mese & Tasto Oggi */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E4DFD3]">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE4] transition-colors"
              aria-label="Mese precedente"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-serif text-[17px] font-bold text-[#1C1917] px-2 min-w-[140px] text-center">
              {MONTH_NAMES[month]} {year}
            </h3>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE4] transition-colors"
              aria-label="Mese successivo"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#EFECE4] text-[#1C1917] hover:bg-[#E4DFD3] transition-colors"
          >
            Oggi
          </button>
        </div>

        {/* Intestazione giorni settimana */}
        <div className="grid grid-cols-7 gap-1 text-center text-[12px] font-medium uppercase text-[#78716C] pb-2">
          <div>L</div>
          <div>M</div>
          <div>M</div>
          <div>G</div>
          <div>V</div>
          <div className="text-[#D97706]">S</div>
          <div className="text-[#D97706]">D</div>
        </div>

        {/* Griglia Giorni */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-11" />;
            }

            const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = cellDateStr === todayStr;
            const isSelected = cellDateStr === selectedDateStr;
            const dayEvents = eventsByDate[cellDateStr] || [];
            const count = dayEvents.length;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDateStr(cellDateStr)}
                className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all select-none ${
                  isSelected
                    ? 'bg-[#1B4D3E] text-[#FFFFFF] font-bold shadow-sm'
                    : isToday
                    ? 'ring-1.5 ring-[#1B4D3E] font-semibold text-[#1B4D3E] bg-[#E7F0EC]/50'
                    : 'text-[#1C1917] hover:bg-[#F6F4EF]'
                }`}
              >
                <span className="text-[14px] leading-none">
                  {day}
                </span>

                {/* Puntino morbido ambra se ci sono eventi */}
                {count > 0 && (
                  <span 
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? 'bg-[#FFFFFF]' : 'bg-[#D97706]'
                    }`} 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sezione del Giorno Selezionato */}
      <div className="bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E4DFD3]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block">
              Sessione del giorno
            </span>
            <h3 className="font-serif text-[18px] font-bold text-[#1C1917]">
              {getSelectedDayLabel()}
            </h3>
          </div>

          {selectedDayEvents.length > 0 && (
            <button
              onClick={handleShareWhatsApp}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#EFECE4] text-[#1C1917] hover:bg-[#E4DFD3] flex items-center gap-1.5 transition-colors"
              title="Condividi su WhatsApp"
            >
              <Share2 size={13} className="text-[#1B4D3E]" />
              <span>Condividi</span>
            </button>
          )}
        </div>

        {/* Lista Eventi del Giorno */}
        {selectedDayEvents.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-[13px] text-[#78716C]">
              Nessun gioco programmato per questa data.
            </p>
            <button
              type="button"
              onClick={() => onPinForDate(selectedDateStr)}
              className="w-full h-11 rounded-xl bg-[#1B4D3E] hover:bg-[#143A2F] text-[#FFFFFF] text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
            >
              <Plus size={16} />
              <span>Pinna sul calendario</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayEvents.map(evt => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="p-3 rounded-xl border border-[#E4DFD3] bg-[#F6F4EF] hover:bg-[#EFECE4] transition-colors flex items-center justify-between cursor-pointer"
              >
                <div className="space-y-0.5 min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    {evt.pinned && <Pin size={12} className="fill-[#D97706] text-[#D97706] shrink-0" />}
                    <h4 className="text-[15px] font-semibold text-[#1C1917] truncate">
                      {evt.gameTitle}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] text-[#78716C]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {evt.time || '21:00'}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{evt.location || 'Tavolo da gioco'}</span>
                    </span>
                  </div>
                </div>

                <span className="text-[12px] font-medium text-[#1B4D3E] bg-[#FFFFFF] border border-[#E4DFD3] rounded-lg px-2 py-1 shrink-0">
                  Dettagli
                </span>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onPinForDate(selectedDateStr)}
              className="w-full py-2.5 rounded-xl border border-dashed border-[#E4DFD3] text-[13px] font-medium text-[#78716C] hover:text-[#1C1917] hover:bg-[#F6F4EF] flex items-center justify-center gap-1.5 transition-colors mt-2"
            >
              <Plus size={14} />
              <span>Aggiungi un'altra partita</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
