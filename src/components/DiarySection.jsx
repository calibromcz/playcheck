import React, { useState } from 'react';
import { Search, X, Star, ExternalLink, RotateCcw } from 'lucide-react';
import { getBggLink, RATING_LABELS } from '../utils/storage';

export default function DiarySection({ 
  games, 
  onOpenReviewSheet, 
  onRestoreToList 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const playedGames = games.filter(g => g.status === 'played').sort((a, b) => {
    const dateA = a.playedAt || a.createdAt;
    const dateB = b.playedAt || b.createdAt;
    return new Date(dateB) - new Date(dateA);
  });

  const filteredGames = playedGames.filter(g => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      g.title.toLowerCase().includes(q) ||
      (g.reviewText && g.reviewText.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Intestazione Sezione Editoriale */}
      <div className="text-center pt-2">
        <h2 className="font-serif text-[26px] font-bold text-[#1C1917] tracking-tight">
          Diario
        </h2>
        <p className="text-[13px] text-[#78716C] mt-0.5">
          I tuoi giochi provati, voti personali e recensioni
        </p>
      </div>

      {/* Barra di Ricerca */}
      <div className="relative w-full">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#78716C] pointer-events-none" />
        <input
          type="text"
          placeholder="Cerca tra i giochi provati o recensioni..."
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

      <div className="flex items-center justify-between px-1 text-xs text-[#78716C]">
        <span>Giochi provati: <b className="text-[#1C1917]">{playedGames.length}</b></span>
        <span>Tocca per modificare recensione</span>
      </div>

      {/* Schede Giochi Provati nel Diario */}
      {filteredGames.length === 0 ? (
        <div className="py-12 text-center bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-6 space-y-3">
          <p className="text-[15px] font-medium text-[#1C1917]">
            Il diario è ancora vuoto
          </p>
          <p className="text-xs text-[#78716C] max-w-xs mx-auto">
            {searchQuery 
              ? `Nessun risultato per "${searchQuery}".` 
              : 'Quando intavoli e provi un gioco dalla tua Lista, spunta la casella rotonda e comparirà qui con voto a stelle e appunti!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => onOpenReviewSheet(game)}
              className="bg-[#FFFFFF] border border-[#E4DFD3] rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.04)] p-4 space-y-2.5 cursor-pointer select-none active:scale-[0.99] transition-transform"
            >
              {/* Header scheda diario: Titolo + Stelle */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-[16px] font-semibold text-[#1C1917] leading-snug truncate">
                    {game.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[12px] text-[#78716C] mt-0.5">
                    {game.playedAt && (
                      <span>Provato il {new Date(game.playedAt).toLocaleDateString('it-IT')}</span>
                    )}
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

                {/* Valutazione a Stelle Ambra */}
                <div className="flex items-center gap-0.5 shrink-0 bg-[#FEF3C7] rounded-lg px-2 py-1 border border-[#FDE68A]">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= (game.rating || 0)
                          ? 'fill-[#D97706] text-[#D97706]'
                          : 'fill-[#E4DFD3] text-[#E4DFD3]'
                      }
                    />
                  ))}
                </div>
              </div>

              {/* Anteprima Recensione o Invito */}
              {game.reviewText ? (
                <div className="p-3 rounded-xl bg-[#F6F4EF] text-[13px] text-[#1C1917] leading-relaxed line-clamp-3 italic">
                  "{game.reviewText}"
                </div>
              ) : (
                <div className="py-2 px-3 rounded-xl bg-[#F6F4EF] text-xs font-medium text-[#78716C] flex items-center justify-between">
                  <span>Nessuna recensione scritta</span>
                  <span className="text-[#1B4D3E] font-semibold hover:underline">
                    Scrivi recensione →
                  </span>
                </div>
              )}

              {/* Footer Scheda */}
              <div className="flex items-center justify-between pt-1 border-t border-[#EFECE4] text-xs">
                <span className="font-medium text-[#1C1917]">
                  {game.rating > 0 ? RATING_LABELS[game.rating] : 'Non valutato'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Rimetti "${game.title}" nella Lista da provare?`)) {
                      onRestoreToList(game.id);
                    }
                  }}
                  className="text-[#78716C] hover:text-[#DC2626] flex items-center gap-1 text-[11px] font-medium transition-colors"
                  title="Rimetti nella lista da provare"
                >
                  <RotateCcw size={12} />
                  <span>Rimetti in Lista</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
