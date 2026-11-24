import React, { useState } from 'react';
import { Search, X, Pin, Clock, MapPin } from 'lucide-react';

const MONTH_SHORT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function formatDateBadge(dateStr) {
  if (!dateStr) return { day: '--', month: '' };
  try {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return {
      day: date.getDate(),
      month: MONTH_SHORT[date.getMonth()] || '',
    };
  } catch {
    return { day: '--', month: '' };
  }
}

export default function AgendaSection({
  events,
  onTogglePinEvent,
  onSelectEvent,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('upcoming'); // 'upcoming' | 'past'

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredEvents = events
    .filter((evt) => {
      if (filterMode === 'upcoming' && evt.date && evt.date < todayStr) return false;
      if (filterMode === 'past' && (!evt.date || evt.date >= todayStr)) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (evt.gameTitle && evt.gameTitle.toLowerCase().includes(q)) ||
        (evt.location && evt.location.toLowerCase().includes(q)) ||
        (evt.notes && evt.notes.toLowerCase().includes(q))
      );
    })
    .sort((a, b) =>
      filterMode === 'past'
        ? (b.date || '').localeCompare(a.date || '')
        : (a.date || '').localeCompare(b.date || '')
    );

  const pinnedEvents = filteredEvents.filter((e) => e.pinned);
  const otherEvents = filteredEvents.filter((e) => !e.pinned);

  return (
    <div className="pt-2">
      {/* Barra Ricerca */}
      <div className="w-full h-11 rounded-xl bg-white border border-black/[0.07] px-3.5 flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <Search size={17} className="text-[#AEAEB2] shrink-0" />
        <input
          type="text"
          placeholder="Cerca gioco, luogo o note..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-[#111111] placeholder:text-[#AEAEB2] focus:outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[#8E8E93] hover:text-[#111111] shrink-0"
            aria-label="Pulisci ricerca"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Toggle Pillola Prossimi / Passati */}
      <div className="flex justify-end mt-2.5">
        <div className="inline-flex bg-[#F0F0F3] p-0.5 rounded-full">
          <button
            type="button"
            onClick={() => setFilterMode('upcoming')}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
              filterMode === 'upcoming'
                ? 'bg-[#111111] text-white'
                : 'text-[#6E6E73] hover:text-[#111111]'
            }`}
          >
            Prossimi
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('past')}
            className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
              filterMode === 'past'
                ? 'bg-[#111111] text-white'
                : 'text-[#6E6E73] hover:text-[#111111]'
            }`}
          >
            Passati
          </button>
        </div>
      </div>

      {/* Fascia Priorità */}
      {pinnedEvents.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Pin size={12} className="fill-[#F59E0B] text-[#F59E0B] shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8E8E93]">
              Priorità
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x -mx-4 px-4 pb-1">
            {pinnedEvents.map((evt) => {
              const { day, month } = formatDateBadge(evt.date);
              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="w-[225px] shrink-0 snap-start bg-white rounded-2xl p-3.5 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-2.5 cursor-pointer active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.04em] px-2 py-0.5 rounded-full bg-[#F0F0F3] text-[#111111] shrink-0">
                      {day} {month}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePinEvent(evt.id);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[#F59E0B]"
                      aria-label="Rimuovi priorità"
                    >
                      <Pin size={15} className="fill-[#F59E0B]" />
                    </button>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-[15px] font-semibold text-[#111111] leading-snug truncate">
                      {evt.gameTitle}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[12px] text-[#6E6E73] truncate">
                      <span className="shrink-0">{evt.time || '21:00'}</span>
                      <span className="text-[#AEAEB2]">·</span>
                      <span className="truncate">{evt.location || 'Tavolo da gioco'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Divisorio */}
      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-black/[0.08]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8E8E93] shrink-0">
          Programmati
        </span>
        <div className="h-px flex-1 bg-black/[0.08]" />
      </div>

      {/* Lista Eventi */}
      {otherEvents.length === 0 && pinnedEvents.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-center">
          <p className="text-[15px] font-semibold text-[#111111]">
            {filterMode === 'upcoming' ? 'Nessun evento in programma' : 'Nessun evento passato'}
          </p>
          <p className="text-[13px] text-[#6E6E73] mt-1">
            Usa il tasto + in basso per pinnare una nuova serata.
          </p>
        </div>
      ) : otherEvents.length === 0 ? (
        <p className="text-center py-6 text-[13px] text-[#8E8E93]">
          Tutti gli eventi sono in Priorità
        </p>
      ) : (
        <div className="space-y-2.5">
          {otherEvents.map((evt) => {
            const { day, month } = formatDateBadge(evt.date);
            return (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt)}
                className="bg-white rounded-2xl p-3.5 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center gap-3.5 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F0F0F3] flex flex-col items-center justify-center shrink-0">
                  <span className="text-[17px] font-bold text-[#111111] leading-none">
                    {day}
                  </span>
                  <span className="text-[10px] font-semibold uppercase text-[#6E6E73] mt-0.5">
                    {month}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-[15px] font-semibold text-[#111111] leading-snug truncate">
                    {evt.gameTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[13px] text-[#6E6E73] truncate">
                    <Clock size={12} className="shrink-0" />
                    <span className="shrink-0">{evt.time || '21:00'}</span>
                    <span className="text-[#AEAEB2]">·</span>
                    <MapPin size={12} className="shrink-0" />
                    <span className="truncate">{evt.location || 'Tavolo da gioco'}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePinEvent(evt.id);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 hover:bg-[#F0F0F3] transition-colors"
                  aria-label="Metti in priorità"
                >
                  <Pin
                    size={16}
                    className={
                      evt.pinned
                        ? 'fill-[#F59E0B] text-[#F59E0B]'
                        : 'text-[#C7C7CC]'
                    }
                  />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
