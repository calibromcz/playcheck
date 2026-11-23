import React, { useState } from 'react';
import { Search, X, Star, ExternalLink, RotateCcw, Edit3 } from 'lucide-react';
import { getBggLink, RATING_LABELS } from '../utils/storage';

export default function DiarySection({ 
  games, 
  onOpenReviewSheet, 
  onRestoreToList 
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Solo giochi provati (status === 'played')
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
    <div className="space-y-5 animate-fadeIn">
      {/* Intestazione Sezione Grande */}
      <div className="text-center pt-2">
        <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-[#141414]">
          DIARIO DEL GIOCATORE
        </h2>
        <p className="text-xs font-medium text-[#141414]/60">
          I tuoi giochi provati, voti a stelle e recensioni personali
        </p>
      </div>

      {/* Barra di ricerca allargata */}
      <div className="relative w-full">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#141414]/50 pointer-events-none" />
        <input
          type="text"
          placeholder="Cerca tra i giochi provati o recensioni..."
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

      {/* Conteggio e Stato */}
      <div className="flex items-center justify-between px-1 font-mono text-xs text-[#141414]/70">
        <span>GIOCHI SMARCATI: <b>{playedGames.length}</b></span>
        <span className="font-bold text-[#141414]">Tocca per scrivere recensione</span>
      </div>

      {/* Schede Giochi Provati nel Diario */}
      {filteredGames.length === 0 ? (
        <div className="py-12 text-center border-2 border-dashed border-[#141414]/40 bg-[#FFFDF8] p-6 space-y-3">
          <p className="font-display text-base font-bold uppercase text-[#141414]">
            IL DIARIO È VUOTO
          </p>
          <p className="font-body text-xs text-[#141414]/70 max-w-xs mx-auto">
            {searchQuery 
              ? `Nessun gioco trovato per "${searchQuery}".` 
              : 'Quando provi un gioco dalla tua Lista, spunta la casella quadrata a sinistra e comparirà qui con voto e recensione!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGames.map(game => (
            <div
              key={game.id}
              onClick={() => onOpenReviewSheet(game)}
              className="bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-4 space-y-2.5 cursor-pointer select-none active:translate-x-[1px] active:translate-y-[1px]"
            >
              {/* Header scheda diario: Titolo + Stelle */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-display text-[17px] font-bold uppercase text-[#141414] leading-snug truncate">
                    {game.title}
                  </h4>
                  <div className="flex items-center gap-2 font-mono text-xs text-[#141414]/60 mt-0.5">
                    {game.playedAt && (
                      <span>Provato il {new Date(game.playedAt).toLocaleDateString('it-IT')}</span>
                    )}
                    <span>·</span>
                    <a
                      href={getBggLink(game.title, game.bggUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-0.5 text-[#141414] font-bold hover:underline"
                    >
                      <span>BGG</span>
                      <ExternalLink size={9} />
                    </a>
                  </div>
                </div>

                {/* Valutazione a Stelle */}
                <div className="flex items-center gap-0.5 shrink-0 bg-[#F4EFE6] border border-[#141414] px-2 py-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={15}
                      className={`stroke-[2] ${
                        s <= (game.rating || 0)
                          ? 'fill-[#FFE600] text-[#141414]'
                          : 'fill-transparent text-[#141414]/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Anteprima Recensione o Invito a scrivere */}
              {game.reviewText ? (
                <div className="p-3 bg-[#F4EFE6] border border-[#141414]/20 text-xs font-body text-[#141414] leading-relaxed line-clamp-3 italic">
                  "{game.reviewText}"
                </div>
              ) : (
                <div className="py-2 px-3 bg-[#FFE600]/25 border border-dashed border-[#141414]/40 font-mono text-xs font-bold text-[#141414] flex items-center justify-between">
                  <span>Nessuna recensione ancora scritta</span>
                  <span className="underline flex items-center gap-1">
                    <Edit3 size={12} />
                    Scrivi ora
                  </span>
                </div>
              )}

              {/* Azioni rapide scheda */}
              <div className="flex items-center justify-between pt-1 border-t border-[#141414]/20 font-mono text-xs">
                <span className="font-bold text-[#141414]">
                  {game.rating > 0 ? RATING_LABELS[game.rating] : 'Non votato'}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Rimetti "${game.title}" nella Lista da provare?`)) {
                      onRestoreToList(game.id);
                    }
                  }}
                  className="text-[#141414]/60 hover:text-[#FF4522] flex items-center gap-1 font-bold text-[11px]"
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
