import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Share2, Plus, Calendar as CalendarIcon, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const MONTH_NAMES = [
  'GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
  'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'
];

const DAY_NAMES_FULL = [
  'DOMENICA', 'LUNEDÌ', 'MARTEDÌ', 'MERCOLEDÌ', 'GIOVEDÌ', 'VENERDÌ', 'SABATO'
];

export default function CalendarView({ games, onSelectGame, onAddForDate }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(todayStr);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDateStr(todayStr);
  };

  // Days in month
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // LUN=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) calendarCells.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarCells.push(day);

  // Scheduled games mapping
  const scheduledMap = {};
  games.forEach(g => {
    if (g.status === 'scheduled' && g.scheduledDate) {
      scheduledMap[g.scheduledDate] = (scheduledMap[g.scheduledDate] || 0) + 1;
    }
  });

  // Selected Day Games
  const selectedDayGames = games.filter(
    g => g.status === 'scheduled' && g.scheduledDate === selectedDateStr
  );

  // Format Selected Day Header
  const getSelectedDayLabel = () => {
    try {
      const [y, m, d] = selectedDateStr.split('-');
      const dObj = new Date(Number(y), Number(m) - 1, Number(d));
      return `${DAY_NAMES_FULL[dObj.getDay()]} ${dObj.getDate()} ${MONTH_NAMES[dObj.getMonth()]}`;
    } catch (e) {
      return selectedDateStr;
    }
  };

  // WhatsApp share
  const handleCopyWhatsApp = () => {
    if (selectedDayGames.length === 0) return;
    const lines = [
      `🎲 *PLAYCHECK — PARTITE IN PROGRAMMA*`,
      `📅 *${getSelectedDayLabel()}*`,
      ...selectedDayGames.map(g => `• *${g.title}* (${g.weight})${g.sessionNote ? ` — "${g.sessionNote}"` : ''}`),
      `\nCi siete tutti? 🚀`
    ];
    const text = lines.join('\n');
    navigator.clipboard?.writeText(text);
    alert('Lista partite copiata! Ora puoi incollarla su WhatsApp.');
  };

  return (
    <div className="space-y-4">
      {/* Container Griglia Calendario pulita */}
      <div className="bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-3">
        {/* Header compatto Mese e tasto OGGI */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#141414]/20">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center border-2 border-[#141414] bg-[#F4EFE6] active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Mese precedente"
            >
              <ChevronLeft size={16} className="stroke-[3]" />
            </button>
            <h2 className="font-display text-base uppercase tracking-tight text-[#141414] px-1.5 min-w-[140px] text-center">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center border-2 border-[#141414] bg-[#F4EFE6] active:translate-x-[1px] active:translate-y-[1px]"
              aria-label="Mese successivo"
            >
              <ChevronRight size={16} className="stroke-[3]" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="btn-tactile-sm bg-[#FFE600] px-2.5 py-1 font-mono text-xs font-black uppercase text-[#141414]"
          >
            OGGI
          </button>
        </div>

        {/* Header Giorni della settimana: L M M G V S D */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-black uppercase pb-1 text-[#141414]/70">
          <div>L</div>
          <div>M</div>
          <div>M</div>
          <div>G</div>
          <div>V</div>
          <div className="text-[#FF4522]">S</div>
          <div className="text-[#FF4522]">D</div>
        </div>

        {/* Griglia giorni: SOLO numero + pallino sotto */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, idx) => {
            if (!day) {
              return <div key={`empty-${idx}`} className="h-11" />;
            }

            const cellDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = cellDateStr === todayStr;
            const isSelected = cellDateStr === selectedDateStr;
            const count = scheduledMap[cellDateStr] || 0;

            return (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDateStr(cellDateStr)}
                className={`h-11 border flex flex-col items-center justify-center relative transition-all select-none ${
                  isSelected
                    ? 'bg-[#141414] text-[#FFE600] font-black border-[#141414] shadow-none ring-2 ring-[#FFE600]'
                    : isToday
                    ? 'border-2 border-[#FF4522] bg-[#FFE600]/20 font-bold text-[#141414]'
                    : 'border-[#141414]/30 bg-white hover:bg-[#F4EFE6] text-[#141414]'
                }`}
              >
                <span className="font-mono text-xs leading-none">
                  {day}
                </span>

                {/* Semplice pallino se ci sono giochi pianificati */}
                {count > 0 && (
                  <span 
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isSelected ? 'bg-[#FFE600]' : 'bg-[#FF4522]'
                    }`} 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pannello Dettaglio del Giorno Selezionato */}
      <div className="bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-3 space-y-3">
        {/* Header giorno + Copia WhatsApp */}
        <div className="flex items-center justify-between pb-2 border-b border-[#141414]/20">
          <div>
            <span className="font-mono text-[10px] uppercase font-bold text-[#141414]/60 block">
              DETTAGLIO DATA
            </span>
            <h3 className="font-display text-sm uppercase text-[#141414] tracking-tight">
              {getSelectedDayLabel()}
            </h3>
          </div>

          {selectedDayGames.length > 0 && (
            <button
              onClick={handleCopyWhatsApp}
              className="btn-tactile-sm bg-[#B8FF2C] px-2 py-1 font-mono text-[11px] font-bold flex items-center gap-1"
              title="Copia per WhatsApp"
            >
              <Share2 size={13} />
              <span>CONDIVIDI</span>
            </button>
          )}
        </div>

        {/* Lista essenziale giochi del giorno */}
        {selectedDayGames.length === 0 ? (
          <div className="py-4 text-center space-y-2">
            <p className="font-mono text-xs text-[#141414]/60 uppercase">
              Nessun gioco fissato per questa data.
            </p>
            <button
              type="button"
              onClick={() => onAddForDate(selectedDateStr)}
              className="w-full btn-tactile bg-[#FFE600] font-display text-xs uppercase py-2.5 flex items-center justify-center gap-1.5"
            >
              <Plus size={15} className="stroke-[3]" />
              <span>+ AGGIUNGI GIOCO A QUESTA DATA</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDayGames.map(game => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="p-2.5 border-2 border-[#141414] bg-[#F4EFE6] flex items-center justify-between cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-display text-sm uppercase text-[#141414] truncate">
                    {game.title}
                  </div>
                  <div className="font-mono text-[11px] text-[#141414]/70">
                    {game.weight.toUpperCase()} {game.sessionNote ? `· "${game.sessionNote}"` : ''}
                  </div>
                </div>

                <div className="shrink-0 font-mono text-[10px] font-bold bg-[#FFE600] border border-[#141414] px-1.5 py-0.5">
                  GESTISCI
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => onAddForDate(selectedDateStr)}
              className="w-full btn-tactile-sm bg-[#FFFDF8] border-dashed border-[#141414] text-[#141414] font-mono text-xs uppercase py-2 flex items-center justify-center gap-1 mt-2"
            >
              <Plus size={14} />
              <span>AGGIUNGI ALTRO GIOCO</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
