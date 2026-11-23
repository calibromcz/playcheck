import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WEIGHT_LABELS } from '../utils/storage';

export default function CalendarView({ games, onScheduleGame, onMarkPlayed, onEditGame }) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  // Navigation
  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const monthNames = [
    'GENNAIO', 'FEBBRAIO', 'MARZO', 'APRILE', 'MAGGIO', 'GIUGNO',
    'LUGLIO', 'AGOSTO', 'SETTEMBRE', 'OTTOBRE', 'NOVEMBRE', 'DICEMBRE'
  ];

  // Days in month
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  // Filter games with scheduled dates in this month
  const scheduledGames = games.filter(g => g.status === 'scheduled' && g.scheduledDate);

  const getGamesForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledGames.filter(g => g.scheduledDate === dateStr);
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-4">
      {/* Blocco Note a Strappo Header */}
      <div className="bg-paper-card border-2 border-[#141414] card-tactile p-4">
        <div className="flex items-center justify-between border-b-2 border-[#141414] pb-3 mb-3">
          <div>
            <div className="font-mono text-[10px] font-black uppercase text-risograph-cobalt tracking-widest">
              TABELLONE APPUNTAMENTI
            </div>
            <h2 className="font-display text-2xl uppercase tracking-tight text-[#141414]">
              {monthNames[month]} {year}
            </h2>
          </div>

          <div className="flex gap-1">
            <button
              onClick={prevMonth}
              className="btn-tactile-sm bg-paper-bg p-2 text-[#141414]"
              aria-label="Mese precedente"
            >
              <ChevronLeft size={18} className="stroke-[3]" />
            </button>
            <button
              onClick={nextMonth}
              className="btn-tactile-sm bg-paper-bg p-2 text-[#141414]"
              aria-label="Mese successivo"
            >
              <ChevronRight size={18} className="stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs font-black uppercase mb-1.5 pb-1 border-b border-[#141414]">
          {['LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB', 'DOM'].map((d, idx) => (
            <div key={d} className={`${idx >= 5 ? 'text-risograph-vermilion' : 'text-[#141414]'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, idx) => {
            if (!day) {
              return (
                <div 
                  key={`empty-${idx}`} 
                  className="min-h-[52px] bg-[#141414]/5 border border-dashed border-[#141414]/20" 
                />
              );
            }

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === todayStr;
            const dayGames = getGamesForDay(day);
            const hasGames = dayGames.length > 0;

            return (
              <div
                key={day}
                className={`min-h-[52px] p-1 border-2 flex flex-col justify-between transition-colors ${
                  isToday 
                    ? 'border-risograph-vermilion bg-risograph-yellow/20 font-black' 
                    : 'border-[#141414] bg-white'
                } ${hasGames ? 'bg-risograph-yellow/40' : ''}`}
              >
                <div className="flex justify-between items-start leading-none">
                  <span className={`font-mono text-xs ${isToday ? 'bg-risograph-vermilion text-white px-1' : 'text-[#141414]'}`}>
                    {day}
                  </span>
                  {hasGames && (
                    <span className="w-2 h-2 rounded-full bg-risograph-vermilion inline-block" />
                  )}
                </div>

                {hasGames && (
                  <div className="mt-1 space-y-0.5">
                    {dayGames.slice(0, 2).map((g) => (
                      <div 
                        key={g.id} 
                        onClick={() => onEditGame(g)}
                        className="truncate text-[9px] font-mono font-bold bg-[#141414] text-white px-0.5 py-0.2 cursor-pointer hover:bg-risograph-cobalt"
                        title={g.title}
                      >
                        {g.title}
                      </div>
                    ))}
                    {dayGames.length > 2 && (
                      <div className="text-[8px] font-mono font-black text-risograph-vermilion">
                        +{dayGames.length - 2} ALTRI
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Prossimi appuntamenti schedulati */}
      <div className="bg-paper-card border-2 border-[#141414] card-tactile p-4">
        <h3 className="font-display text-lg uppercase tracking-tight text-[#141414] mb-3 flex items-center justify-between border-b-2 border-[#141414] pb-2">
          <span>PROSSIME SESSIONI IN PROGRAMMA</span>
          <span className="font-mono text-xs bg-risograph-yellow px-2 py-0.5 font-black border border-[#141414]">
            {scheduledGames.length}
          </span>
        </h3>

        {scheduledGames.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-[#141414]/30 bg-paper-bg">
            <p className="font-mono text-xs uppercase text-[#141414]/70 mb-2">
              Nessuna sessione pianificata sul calendario.
            </p>
            <p className="font-body text-xs text-[#141414]/60">
              Seleziona un gioco dalla Coda e premi "Pianifica" per fissare una data di prova con gli amici!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {scheduledGames
              .sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''))
              .map((g) => {
                const weightInfo = WEIGHT_LABELS[g.weight] || WEIGHT_LABELS.medio;
                return (
                  <div 
                    key={g.id} 
                    className="p-3 border-2 border-[#141414] bg-white flex flex-col gap-2 shadow-[2px_2px_0px_#141414]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-black text-risograph-cobalt">
                        <CalendarIcon size={14} className="stroke-[3]" />
                        <span>{g.scheduledDate}</span>
                      </div>
                      <span className={`font-mono text-[9px] font-black uppercase px-1.5 py-0.5 border border-[#141414] ${weightInfo.bg} ${weightInfo.text}`}>
                        {weightInfo.label}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h4 className="font-display text-base uppercase text-[#141414] leading-tight">
                        {g.title}
                      </h4>
                      <span className="font-mono text-[10px] text-[#141414]/70">
                        Proposto da: <b>{g.requestedBy || 'IO'}</b>
                      </span>
                    </div>

                    {g.sessionNote && (
                      <div className="font-mono text-xs text-[#141414]/80 bg-paper-bg p-1.5 border border-[#141414]/20 flex items-start gap-1">
                        <MapPin size={13} className="shrink-0 mt-0.5" />
                        <span>{g.sessionNote}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#141414]/20">
                      <button
                        onClick={() => onScheduleGame(g)}
                        className="btn-tactile-sm bg-paper-bg px-2.5 py-1 font-mono text-xs font-bold"
                      >
                        SPOSTA DATA
                      </button>
                      <button
                        onClick={() => {
                          confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } });
                          onMarkPlayed(g);
                        }}
                        className="btn-tactile-sm bg-risograph-lime px-3 py-1 font-mono text-xs font-black uppercase tracking-tight"
                      >
                        PARTITA FINITA!
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
