import React, { useState } from 'react';
import { Search, X, Pin, Check, ExternalLink } from 'lucide-react';
import { getBggLink } from '../utils/storage';

const WEIGHT_TEXT = {
  filler: 'Filler',
  medio: 'Medio',
  cinghiale: 'Cinghiale',
};

export default function ListSection({
  games,
  onToggleCheck,
  onTogglePin,
  onSelectGame,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const listGames = games.filter((g) => g.status === 'list');

  const filteredGames = listGames.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      g.title.toLowerCase().includes(q) ||
      (g.requestedBy && g.requestedBy.toLowerCase().includes(q))
    );
  });

  const pinnedGames = filteredGames.filter((g) => g.pinned);
  const otherGames = filteredGames.filter((g) => !g.pinned);

  return (
    <div className="pt-2">
      {/* Barra Ricerca */}
      <div className="w-full h-11 rounded-xl bg-white border border-black/[0.07] px-3.5 flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <Search size={17} className="text-[#AEAEB2] shrink-0" />
        <input
          type="text"
          placeholder="Cerca gioco o chi lo propone..."
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

      {/* Fascia Priorità */}
      {pinnedGames.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Pin size={12} className="fill-[#F59E0B] text-[#F59E0B] shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8E8E93]">
              Priorità
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x -mx-4 px-4 pb-1">
            {pinnedGames.map((game) => (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="w-[215px] shrink-0 snap-start bg-white rounded-2xl p-3.5 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-3 cursor-pointer active:scale-[0.99] transition-transform"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[15px] font-semibold text-[#111111] leading-snug line-clamp-2">
                      {game.title}
                    </h4>
                    {(game.weight || game.requestedBy) && (
                      <p className="text-[12px] text-[#6E6E73] mt-1 truncate">
                        {[
                          WEIGHT_TEXT[game.weight],
                          game.requestedBy ? `da ${game.requestedBy}` : null,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTogglePin(game.id);
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[#F59E0B]"
                    aria-label="Rimuovi priorità"
                  >
                    <Pin size={15} className="fill-[#F59E0B]" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-black/[0.05]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCheck(game);
                    }}
                    className="w-[22px] h-[22px] rounded-full border-[1.8px] border-[#C7C7CC] hover:border-[#111111] flex items-center justify-center shrink-0 transition-colors"
                    aria-label="Segna come provato"
                  >
                    <Check size={12} className="text-transparent" />
                  </button>

                  <a
                    href={getBggLink(game.title, game.bggUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[12px] font-medium text-[#6E6E73] hover:text-[#111111] inline-flex items-center gap-0.5 shrink-0"
                  >
                    <span>BGG</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divisorio */}
      <div className="flex items-center gap-3 my-4">
        <div className="h-px flex-1 bg-black/[0.08]" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8E8E93] shrink-0">
          In Lista · {otherGames.length}
        </span>
        <div className="h-px flex-1 bg-black/[0.08]" />
      </div>

      {/* Lista Compatta */}
      {otherGames.length === 0 && pinnedGames.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-center">
          <p className="text-[15px] font-semibold text-[#111111]">
            Nessun gioco in lista
          </p>
          <p className="text-[13px] text-[#6E6E73] mt-1">
            {searchQuery
              ? `Nessun risultato per "${searchQuery}".`
              : 'Usa il tasto + in basso per aggiungere un nuovo titolo.'}
          </p>
        </div>
      ) : otherGames.length === 0 ? (
        <p className="text-center py-6 text-[13px] text-[#8E8E93]">
          Tutti i giochi trovati sono in Priorità
        </p>
      ) : (
        <div className="space-y-2.5">
          {otherGames.map((game) => (
            <div
              key={game.id}
              onClick={() => onSelectGame(game)}
              className="bg-white rounded-2xl px-3.5 py-3 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] flex items-center gap-3 cursor-pointer active:scale-[0.99] transition-transform"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCheck(game);
                }}
                className="w-[22px] h-[22px] rounded-full border-[1.8px] border-[#C7C7CC] hover:border-[#111111] flex items-center justify-center shrink-0 transition-colors"
                aria-label="Segna come provato"
              >
                <Check size={12} className="text-transparent" />
              </button>

              <div className="min-w-0 flex-1">
                <h4 className="text-[15px] font-semibold text-[#111111] leading-snug truncate">
                  {game.title}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#6E6E73] truncate">
                  {WEIGHT_TEXT[game.weight] && (
                    <span className="shrink-0">{WEIGHT_TEXT[game.weight]}</span>
                  )}
                  {game.requestedBy && (
                    <>
                      <span className="text-[#AEAEB2]">·</span>
                      <span className="truncate">da {game.requestedBy}</span>
                    </>
                  )}
                  <span className="text-[#AEAEB2]">·</span>
                  <a
                    href={getBggLink(game.title, game.bggUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-medium text-[#111111] hover:underline inline-flex items-center gap-0.5 shrink-0"
                  >
                    <span>BGG</span>
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(game.id);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 hover:bg-[#F0F0F3] transition-colors"
                aria-label="Metti in priorità"
              >
                <Pin
                  size={16}
                  className={
                    game.pinned
                      ? 'fill-[#F59E0B] text-[#F59E0B]'
                      : 'text-[#C7C7CC]'
                  }
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
