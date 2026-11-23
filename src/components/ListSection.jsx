import React, { useState } from 'react';
import { Search, X, Pin, Check, ExternalLink, Plus } from 'lucide-react';
import { getBggLink } from '../utils/storage';

export default function ListSection({ 
  games, 
  onToggleCheck, 
  onTogglePin, 
  onSelectGame,
  onOpenAddModal
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const listGames = games.filter(g => g.status === 'list');

  const filteredGames = listGames.filter(g => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      g.title.toLowerCase().includes(q) ||
      (g.requestedBy && g.requestedBy.toLowerCase().includes(q))
    );
  });

  const pinnedGames = filteredGames.filter(g => g.pinned);
  const otherGames = filteredGames.filter(g => !g.pinned);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Intestazione Sezione Editoriale */}
      <div className="text-center pt-2">
        <h2 className="font-serif text-[26px] font-bold text-[#1C1917] tracking-tight">
          Lista Giochi
        </h2>
        <p className="text-[13px] text-[#78716C] mt-0.5">
          I titoli da provare · Spunta per spostare nel Diario
        </p>
      </div>

      {/* Barra di Ricerca Larga (h-12, rounded-xl, font 16px) */}
      <div className="relative w-full">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
        <input
          type="text"
          placeholder="Cerca per titolo o proponente..."
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

      {/* Sezione Priorità (Pinnati in Carosello Orizzontale) */}
      {pinnedGames.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-[#92400E]">
            <Pin size={13} className="fill-[#D97706] text-[#D97706]" />
            <span>In Priorità ({pinnedGames.length})</span>
          </div>

          <div className="flex gap-3 overflow-x-auto snap-x no-scrollbar pb-1 -mx-4 px-4">
            {pinnedGames.map(game => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="w-[220px] shrink-0 snap-start bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-3.5 cursor-pointer flex flex-col justify-between active:scale-[0.99] transition-transform select-none"
              >
                <div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h4 className="text-[15px] font-semibold text-[#1C1917] leading-snug line-clamp-2">
                      {game.title}
                    </h4>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePin(game.id);
                      }}
                      className="p-1 text-[#D97706] shrink-0 hover:scale-110 transition-transform"
                      title="Rimuovi priorità"
                    >
                      <Pin size={14} className="fill-[#D97706]" />
                    </button>
                  </div>
                  <p className="text-[12px] text-[#78716C]">
                    {game.weight?.toUpperCase()} · da {game.requestedBy || 'Io'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#EFECE4]">
                  <a
                    href={getBggLink(game.title, game.bggUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-medium text-[#1B4D3E] hover:underline flex items-center gap-0.5"
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
                    className="w-6 h-6 rounded-full border border-[#C7C0B2] bg-[#EFECE4] hover:bg-[#1B4D3E] hover:border-[#1B4D3E] hover:text-white flex items-center justify-center transition-colors text-transparent"
                    title="Segna come provato"
                  >
                    <Check size={13} className="stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divisorio Elegante Sottile */}
      <div className="relative flex items-center justify-center py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E4DFD3]" />
        </div>
        <div className="relative bg-[#F6F4EF] px-3 text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
          In Lista ({otherGames.length})
        </div>
      </div>

      {/* Schede Compatte in Lista */}
      {otherGames.length === 0 && pinnedGames.length === 0 ? (
        <div className="py-10 text-center bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-6 space-y-3">
          <p className="text-[15px] font-medium text-[#1C1917]">
            Nessun gioco in lista
          </p>
          <p className="text-xs text-[#78716C] max-w-xs mx-auto">
            {searchQuery 
              ? `Nessun risultato per "${searchQuery}".` 
              : 'La lista dei giochi da provare è vuota. Tocca il tasto verde "+" per aggiungere il primo!'}
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#1B4D3E] text-white text-xs font-semibold hover:bg-[#143A2F] transition-colors"
          >
            + Aggiungi gioco
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {otherGames.map(game => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-3.5 flex items-center gap-3 cursor-pointer select-none active:scale-[0.99] transition-transform"
            >
              {/* Checkbox morbida circolare 22x22px */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCheck(game);
                }}
                className="w-[22px] h-[22px] shrink-0 rounded-full border border-[#C7C0B2] bg-[#FFFFFF] hover:border-[#1B4D3E] hover:bg-[#E7F0EC] flex items-center justify-center transition-colors group"
                title="Spunta come provato"
                aria-label="Segna come provato"
              >
                <Check size={12} className="stroke-[2.5] text-transparent group-hover:text-[#1B4D3E]" />
              </button>

              {/* Centro: Titolo + Info + Link BGG */}
              <div className="flex-1 min-w-0">
                <h4 className="text-[15px] font-semibold text-[#1C1917] truncate leading-tight">
                  {game.title}
                </h4>
                <div className="flex items-center gap-2 text-[12px] text-[#78716C] truncate mt-0.5">
                  <span>{game.weight?.toUpperCase()}</span>
                  <span>·</span>
                  <span className="truncate">da {game.requestedBy || 'Io'}</span>
                  <span>·</span>
                  <a
                    href={getBggLink(game.title, game.bggUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[#1B4D3E] font-medium hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>BGG</span>
                    <ExternalLink size={9} />
                  </a>
                </div>
              </div>

              {/* Destra: Tasto Pin */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(game.id);
                }}
                className="w-8 h-8 shrink-0 flex items-center justify-center text-[#78716C] hover:text-[#D97706] transition-colors"
                title="Metti in priorità in alto"
                aria-label="Punta priorità"
              >
                <Pin size={16} className={game.pinned ? "fill-[#D97706] text-[#D97706]" : ""} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
