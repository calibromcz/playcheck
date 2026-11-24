import React, { useState } from 'react';
import { Search, X, Star, ExternalLink } from 'lucide-react';
import { getBggLink } from '../utils/storage';

export default function DiarySection({
  games,
  onOpenReviewSheet,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const playedGames = games
    .filter((g) => g.status === 'played')
    .sort((a, b) => {
      const dateA = a.playedAt || a.createdAt;
      const dateB = b.playedAt || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });

  const filteredGames = playedGames.filter((g) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      g.title.toLowerCase().includes(q) ||
      (g.reviewText && g.reviewText.toLowerCase().includes(q))
    );
  });

  return (
    <div className="pt-2">
      {/* Barra Ricerca */}
      <div className="w-full h-11 rounded-xl bg-white border border-black/[0.07] px-3.5 flex items-center gap-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-4">
        <Search size={17} className="text-[#AEAEB2] shrink-0" />
        <input
          type="text"
          placeholder="Cerca tra i giochi provati..."
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

      {/* Lista Giochi Provati */}
      {filteredGames.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] text-center">
          <p className="text-[15px] font-semibold text-[#111111]">
            Nessun gioco nel diario
          </p>
          <p className="text-[13px] text-[#6E6E73] mt-1">
            {searchQuery
              ? `Nessun risultato per "${searchQuery}".`
              : 'Spunta la checkbox di un gioco nella Lista quando lo provi per aggiungerlo qui.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              onClick={() => onOpenReviewSheet(game)}
              className="bg-white rounded-2xl p-4 border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h4 className="text-[15px] font-semibold text-[#111111] leading-snug truncate">
                    {game.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[12px] text-[#6E6E73]">
                    {game.playedAt && (
                      <span className="shrink-0">
                        {new Date(game.playedAt).toLocaleDateString('it-IT')}
                      </span>
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

                {/* Stelle 1-5 */}
                <div className="flex items-center gap-0.5 shrink-0 pt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= (game.rating || 0)
                          ? 'fill-[#F59E0B] text-[#F59E0B]'
                          : 'fill-[#E5E5EA] text-[#E5E5EA]'
                      }
                    />
                  ))}
                </div>
              </div>

              {game.reviewText ? (
                <p className="mt-2.5 text-[13px] text-[#6E6E73] leading-relaxed line-clamp-2">
                  {game.reviewText}
                </p>
              ) : (
                <p className="mt-2.5 text-[13px] text-[#AEAEB2]">
                  Tocca per scrivere una recensione
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
