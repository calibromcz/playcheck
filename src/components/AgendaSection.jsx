import React, { useState } from 'react';
import { Search, X, Pin, Clock, MapPin, Plus } from 'lucide-react';

function formatDateBadge(dateStr) {
  if (!dateStr) return { dayNum: '--', monthName: 'Data' };
  try {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    const monthNames = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
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
    <div className="space-y-4 animate-fadeIn">
      {/* Intestazione Sezione Editoriale */}
      <div className="text-center pt-2">
        <h2 className="font-serif text-[26px] font-bold text-[#1C1917] tracking-tight">
          Agenda
        </h2>
        <p className="text-[13px] text-[#78716C] mt-0.5">
          Tutti gli appuntamenti e le serate gioco in programma
        </p>
      </div>

      {/* Ricerca e Filtro */}
      <div className="space-y-2">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
          <input
            type="text"
            placeholder="Cerca per gioco, luogo o note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-10 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl shadow-[0_2px_6px_rgba(28,25,23,0.03)] text-base text-[#1C1917] placeholder:text-[#78716C]/60 focus:outline-none focus:ring-1.5 focus:ring-[#1B4D3E]"
          />
          {searchQuery && (
            <button 
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[#78716C] hover:text-[#1C1917]"
              aria-label="Pulisci ricerca"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex justify-end gap-1.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilterMode('upcoming')}
            className={`px-3 py-1 rounded-lg border transition-colors ${
              filterMode === 'upcoming' 
                ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]' 
                : 'bg-[#FFFFFF] text-[#78716C] border-[#E4DFD3] hover:text-[#1C1917]'
            }`}
          >
            Prossimi
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg border transition-colors ${
              filterMode === 'all' 
                ? 'bg-[#1B4D3E] text-white border-[#1B4D3E]' 
                : 'bg-[#FFFFFF] text-[#78716C] border-[#E4DFD3] hover:text-[#1C1917]'
            }`}
          >
            Tutti
          </button>
        </div>
      </div>

      {/* Fascia In Evidenza (Pinnati) */}
      {pinnedEvents.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-[#92400E]">
            <Pin size={13} className="fill-[#D97706] text-[#D97706]" />
            <span>In Evidenza ({pinnedEvents.length})</span>
          </div>

          <div className="flex gap-3 overflow-x-auto snap-x no-scrollbar pb-1 -mx-4 px-4">
            {pinnedEvents.map(evt => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="w-[230px] shrink-0 snap-start bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-3.5 cursor-pointer flex flex-col justify-between active:scale-[0.99] transition-transform select-none"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className="text-xs font-bold text-[#D97706] bg-[#FEF3C7] rounded-md px-2 py-0.5">
                      {evt.date}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePinEvent(evt.id);
                      }}
                      className="p-1 text-[#D97706] hover:scale-110 transition-transform"
                      title="Togli evidenza"
                    >
                      <Pin size={14} className="fill-[#D97706]" />
                    </button>
                  </div>
                  <h4 className="text-[15px] font-semibold text-[#1C1917] truncate mt-1">
                    {evt.gameTitle}
                  </h4>
                </div>

                <div className="pt-2 mt-2 border-t border-[#EFECE4] space-y-0.5 text-[12px] text-[#78716C]">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} />
                    <span className="font-medium text-[#1C1917]">{evt.time || '21:00'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{evt.location || 'Tavolo da gioco'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divisorio */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E4DFD3]" />
        </div>
        <div className="relative bg-[#F6F4EF] px-3 text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
          {filterMode === 'upcoming' ? 'Prossimi appuntamenti' : 'Tutti gli eventi'} ({otherEvents.length})
        </div>
      </div>

      {/* Lista Appuntamenti */}
      {otherEvents.length === 0 && pinnedEvents.length === 0 ? (
        <div className="py-10 text-center bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-6 space-y-3">
          <p className="text-[15px] font-medium text-[#1C1917]">
            Nessuna sessione in agenda
          </p>
          <p className="text-xs text-[#78716C] max-w-xs mx-auto">
            Non hai partite pianificate. Tocca il tasto centrale "+" per fissare la prossima data!
          </p>
          <button
            type="button"
            onClick={onOpenAddEventModal}
            className="px-4 py-2 rounded-xl bg-[#1B4D3E] text-white text-xs font-semibold hover:bg-[#143A2F] transition-colors"
          >
            + Pinna nuovo evento
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {otherEvents.map(evt => {
            const { dayNum, monthName } = formatDateBadge(evt.date);
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-3.5 flex items-center gap-3 cursor-pointer select-none active:scale-[0.99] transition-transform"
              >
                {/* Blocco Data Elegante */}
                <div className="w-12 h-12 shrink-0 rounded-xl bg-[#EFECE4] flex flex-col items-center justify-center leading-none p-1">
                  <span className="text-[17px] font-bold text-[#1C1917]">{dayNum}</span>
                  <span className="text-[10px] font-semibold text-[#78716C] uppercase tracking-tight mt-0.5">{monthName}</span>
                </div>

                {/* Info Evento */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-[15px] font-semibold text-[#1C1917] truncate leading-tight">
                    {evt.gameTitle}
                  </h4>
                  <div className="flex items-center gap-2 text-[12px] text-[#78716C] truncate mt-0.5">
                    <span className="flex items-center gap-1 font-medium text-[#1C1917]">
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

                {/* Tasto Pin */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePinEvent(evt.id);
                  }}
                  className="w-8 h-8 shrink-0 flex items-center justify-center text-[#78716C] hover:text-[#D97706] transition-colors"
                  title="Metti in evidenza in alto"
                  aria-label="Punta priorità"
                >
                  <Pin size={16} className={evt.pinned ? "fill-[#D97706] text-[#D97706]" : ""} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
