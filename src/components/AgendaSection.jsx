import React, { useState } from 'react';
import { Search, X, Pin, Calendar as CalendarIcon, Clock, MapPin, Plus, Share2 } from 'lucide-react';

function formatDateBadge(dateStr) {
  if (!dateStr) return { dayNum: '--', monthName: 'DATA' };
  try {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    const monthNames = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];
    return {
      dayNum: date.getDate(),
      monthName: monthNames[date.getMonth()]
    };
  } catch (e) {
    return { dayNum: dateStr, monthName: '' };
  }
}

export default function AgendaSection({ 
  events, 
  onTogglePinEvent, 
  onSelectEvent,
  onOpenAddEventModal 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('upcoming'); // 'upcoming' | 'all'

  const todayStr = new Date().toISOString().split('T')[0];

  // Filtra e ordina cronologicamente
  const filteredEvents = events.filter(evt => {
    if (filterMode === 'upcoming' && evt.date && evt.date < todayStr) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (evt.gameTitle && evt.gameTitle.toLowerCase().includes(q)) ||
      (evt.location && evt.location.toLowerCase().includes(q)) ||
      (evt.notes && evt.notes.toLowerCase().includes(q))
    );
  }).sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  const pinnedEvents = filteredEvents.filter(e => e.pinned);
  const otherEvents = filteredEvents.filter(e => !e.pinned);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Intestazione Sezione Grande */}
      <div className="text-center pt-2">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#141414]">
          AGENDA PARTITE
        </h2>
        <p className="text-xs font-medium text-[#141414]/60">
          Tutti gli appuntamenti e serate fissate sul calendario
        </p>
      </div>

      {/* Ricerca e Filtro Prossimi/Tutti */}
      <div className="space-y-2">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50 pointer-events-none" />
          <input
            type="text"
            placeholder="Cerca per gioco, luogo o note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-10 bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal font-body text-base text-[#141414] placeholder:text-[#141414]/40 focus:outline-none"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#141414]/60 hover:text-[#141414]"
              aria-label="Pulisci ricerca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex justify-end gap-1 font-mono text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilterMode('upcoming')}
            className={`px-3 py-1 border border-[#141414] ${
              filterMode === 'upcoming' ? 'bg-[#FFE600] text-[#141414]' : 'bg-[#FFFDF8] text-[#141414]/70'
            }`}
          >
            PROSSIMI
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 border border-[#141414] ${
              filterMode === 'all' ? 'bg-[#141414] text-white' : 'bg-[#FFFDF8] text-[#141414]/70'
            }`}
          >
            TUTTI
          </button>
        </div>
      </div>

      {/* FASCIA IN EVIDENZA / PINNATI */}
      {pinnedEvents.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1 font-mono text-xs font-black uppercase text-[#141414]">
            <Pin size={14} className="fill-[#FF4522] text-[#FF4522]" />
            <span>IN EVIDENZA ({pinnedEvents.length})</span>
          </div>

          <div className="flex gap-3 overflow-x-auto snap-x no-scrollbar pb-2 pt-1 -mx-4 px-4">
            {pinnedEvents.map(evt => {
              const { dayNum, monthName } = formatDateBadge(evt.date);
              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="w-[240px] shrink-0 snap-start bg-[#FFE600]/30 border-2 border-[#141414] shadow-brutal p-3.5 cursor-pointer relative flex flex-col justify-between active:translate-x-[2px] active:translate-y-[2px] select-none"
                >
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <div className="min-w-0">
                      <div className="font-mono text-xs font-black text-[#141414] flex items-center gap-1">
                        <CalendarIcon size={12} className="stroke-[2.5]" />
                        <span>{evt.date}</span>
                      </div>
                      <h4 className="font-display text-[16px] font-bold uppercase text-[#141414] truncate mt-0.5">
                        {evt.gameTitle}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePinEvent(evt.id);
                      }}
                      className="p-1 text-[#FF4522] hover:scale-110"
                      title="Togli evidenza"
                    >
                      <Pin size={15} className="fill-[#FF4522]" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#141414]/20 space-y-1 font-mono text-xs text-[#141414]/80">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <b>{evt.time || '21:00'}</b>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{evt.location || 'Tavolo da gioco'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DIVISORIO GRAFICO NETTO */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-[#141414]" />
        </div>
        <div className="relative bg-[#F4EFE6] px-3 font-mono text-xs font-black uppercase text-[#141414] tracking-wider">
          {filterMode === 'upcoming' ? 'PROSSIMI APPUNTAMENTI' : 'TUTTI GLI EVENTI'} ({otherEvents.length})
        </div>
      </div>

      {/* LISTA SCHEDE APPUNTAMENTI */}
      {otherEvents.length === 0 && pinnedEvents.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-[#141414]/40 bg-[#FFFDF8] p-6 space-y-3">
          <p className="font-display text-base font-bold uppercase text-[#141414]">
            NESSUNA SESSIONE IN AGENDA
          </p>
          <p className="font-body text-xs text-[#141414]/70 max-w-xs mx-auto">
            Non hai partite pianificate. Tocca il tasto "+" in basso o entra nel Calendario per fissare la prossima data!
          </p>
          <button
            type="button"
            onClick={onOpenAddEventModal}
            className="btn-tactile bg-[#FFE600] text-[#141414] font-display text-xs uppercase px-4 py-2 mt-2 font-bold"
          >
            + PINNA NUOVO EVENTO
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {otherEvents.map(evt => {
            const { dayNum, monthName } = formatDateBadge(evt.date);
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-3 flex items-center gap-3 cursor-pointer select-none active:translate-x-[1px] active:translate-y-[1px]"
              >
                {/* Blocco data ben leggibile a sinistra */}
                <div className="w-13 h-13 shrink-0 bg-[#F4EFE6] border-2 border-[#141414] flex flex-col items-center justify-center font-mono leading-none p-1">
                  <span className="text-[17px] font-black text-[#141414]">{dayNum}</span>
                  <span className="text-[10px] font-bold text-[#FF4522] tracking-tighter">{monthName}</span>
                </div>

                {/* Info Evento Centro */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-[16px] font-bold uppercase text-[#141414] truncate leading-tight">
                    {evt.gameTitle}
                  </h4>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#141414]/75 truncate mt-1">
                    <span className="flex items-center gap-1 font-bold">
                      <Clock size={12} />
                      {evt.time || '21:00'}
                    </span>
                    <span>·</span>
                    <span className="truncate flex items-center gap-1">
                      <MapPin size={12} className="shrink-0" />
                      <span className="truncate">{evt.location || 'Tavolo da gioco'}</span>
                    </span>
                  </div>
                </div>

                {/* Tasto Pin Destra */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePinEvent(evt.id);
                  }}
                  className="w-8 h-8 shrink-0 flex items-center justify-center border-2 border-[#141414] bg-[#F4EFE6] hover:bg-[#FFE600]"
                  title="Metti in evidenza in alto"
                  aria-label="Punta priorità"
                >
                  <Pin size={15} className={evt.pinned ? "fill-[#FF4522] text-[#FF4522]" : "text-[#141414]/50"} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
