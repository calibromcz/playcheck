import React, { useState } from 'react';
import { Search, X, Pin, Check, ExternalLink, Plus } from 'lucide-react';
import { getBggLink, WEIGHT_LABELS } from '../utils/storage';

export default function ListSection({ 
  games, 
  onToggleCheck, 
  onTogglePin, 
  onSelectGame,
  onOpenAddModal
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Solo giochi da provare (status === 'list')
  const listGames = games.filter(g => g.status === 'list');

  // Filtraggio ricerca
  const filteredGames = listGames.filter(g => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      g.title.toLowerCase().includes(q) ||
      (g.requestedBy && g.requestedBy.toLowerCase().includes(q))
    );
  });

  // Giochi con priorità pinnati
  const pinnedGames = filteredGames.filter(g => g.pinned);
  // Altri giochi
  const otherGames = filteredGames.filter(g => !g.pinned);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Intestazione Sezione Grande */}
      <div className="text-center pt-2">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#141414]">
          LISTA GIOCHI
        </h2>
        <p className="text-xs font-medium text-[#141414]/60">
          Coda dei titoli da provare · Spunta per spostare nel Diario
        </p>
      </div>

      {/* Barra di Ricerca Allargata 100% (h-12, 16px font) */}
      <div className="relative w-full">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50 pointer-events-none" />
        <input
          type="text"
          placeholder="Cerca gioco per titolo o amico..."
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

      {/* FASCIA PRIORITÀ PINNATA (Scorrimento Orizzontale Fluido) */}
      {pinnedGames.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1 font-mono text-xs font-black uppercase text-[#141414]">
            <Pin size={14} className="fill-[#FF4522] text-[#FF4522]" />
            <span>IN PRIORITÀ ({pinnedGames.length})</span>
          </div>

          <div className="flex gap-3 overflow-x-auto snap-x no-scrollbar pb-2 pt-1 -mx-4 px-4">
            {pinnedGames.map(game => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="w-[230px] shrink-0 snap-start bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-3 cursor-pointer relative flex flex-col justify-between active:translate-x-[2px] active:translate-y-[2px] select-none"
              >
                <div className="flex items-start justify-between gap-1 mb-2">
                  <h4 className="font-display text-[16px] font-bold uppercase text-[#141414] leading-tight line-clamp-2">
                    {game.title}
                  </h4>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(game.id);
                    }}
                    className="p-1 text-[#FF4522] hover:scale-110 shrink-0"
                    title="Rimuovi priorità"
                  >
                    <Pin size={15} className="fill-[#FF4522]" />
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#141414]/20">
                  <div className="flex items-center justify-between font-mono text-xs text-[#141414]/75">
                    <span className="font-bold">{game.weight.toUpperCase()}</span>
                    <span>da {game.requestedBy || 'Io'}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <a
                      href={getBggLink(game.title, game.bggUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-mono text-[11px] font-bold px-2 py-0.5 bg-[#F4EFE6] border border-[#141414] flex items-center gap-1 hover:bg-[#FFE600]"
                    >
                      <span>BGG</span>
                      <ExternalLink size={10} />
                    </a>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleCheck(game);
                      }}
                      className="w-7 h-7 border-2 border-[#141414] bg-[#B8FF2C] flex items-center justify-center hover:bg-[#B8FF2C]/80"
                      title="Segna come provato"
                    >
                      <Check size={16} className="stroke-[3]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-[#FFFDF8] border-2 border-dashed border-[#141414]/30 text-center font-mono text-xs text-[#141414]/60">
          💡 Tocca l'icona della puntina su una scheda per metterla in <b>Priorità</b> in alto.
        </div>
      )}

      {/* DIVISORIO GRAFICO NETTO */}
      <div className="relative flex items-center justify-center py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-[#141414]" />
        </div>
        <div className="relative bg-[#F4EFE6] px-3 font-mono text-xs font-black uppercase text-[#141414] tracking-wider">
          ALTRI IN LISTA ({otherGames.length})
        </div>
      </div>

      {/* LISTA SCHEDE COMPATTE */}
      {otherGames.length === 0 && pinnedGames.length === 0 ? (
        <div className="py-10 text-center border-2 border-dashed border-[#141414]/40 bg-[#FFFDF8] p-6 space-y-3">
          <p className="font-display text-base font-bold uppercase text-[#141414]">
            NESSUN GIOCO IN LISTA
          </p>
          <p className="font-body text-xs text-[#141414]/70 max-w-xs mx-auto">
            {searchQuery 
              ? `Nessun gioco trovato per "${searchQuery}".` 
              : 'La lista dei giochi da provare è vuota. Aggiungi il primo gioco con il tasto "+" in basso!'}
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="btn-tactile bg-[#FF4522] text-white font-display text-xs uppercase px-4 py-2 mt-2 font-bold"
          >
            + AGGIUNGI ORA
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {otherGames.map(game => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none active:translate-x-[1px] active:translate-y-[1px]"
            >
              {/* Checkbox tattile quadrata 22x22px a sinistra */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCheck(game);
                }}
                className="w-6 h-6 shrink-0 border-2 border-[#141414] bg-[#F4EFE6] hover:bg-[#B8FF2C] flex items-center justify-center transition-colors"
                title="Spunta come provato (sposta nel Diario)"
                aria-label="Segna provato"
              >
                <Check size={14} className="stroke-[3] text-transparent hover:text-[#141414]" />
              </button>

              {/* Centro: Titolo (16px bold) + Info + BGG link */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-0.5">
                  <h4 className="font-display text-[16px] font-bold uppercase text-[#141414] truncate">
                    {game.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 font-mono text-xs text-[#141414]/70 truncate">
                  <span className="font-bold">{game.weight.toUpperCase()}</span>
                  <span>·</span>
                  <span className="truncate">da {game.requestedBy || 'Io'}</span>
                  <span>·</span>
                  <a
                    href={getBggLink(game.title, game.bggUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-[#F4EFE6] border border-[#141414] hover:bg-[#FFE600] inline-flex items-center gap-0.5 text-[#141414]"
                  >
                    <span>BGG</span>
                    <ExternalLink size={8} />
                  </a>
                </div>
              </div>

              {/* Destra: Tasto Pin / Puntina in 1 tap */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(game.id);
                }}
                className="w-8 h-8 shrink-0 flex items-center justify-center border-2 border-[#141414] bg-[#F4EFE6] hover:bg-[#FFE600]"
                title="Metti in priorità in alto"
                aria-label="Punta priorità"
              >
                <Pin size={15} className={game.pinned ? "fill-[#FF4522] text-[#FF4522]" : "text-[#141414]/50"} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
