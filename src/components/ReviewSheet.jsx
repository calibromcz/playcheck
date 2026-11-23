import React, { useState, useEffect } from 'react';
import { X, Star, RotateCcw, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getBggLink, RATING_LABELS } from '../utils/storage';

const REVIEW_PROMPTS = [
  'Cosa mi è piaciuto',
  'Cosa non ha convinto',
  'Con chi rende meglio',
  'Lo rigiocherei o comprerei?'
];

export default function ReviewSheet({ 
  isOpen, 
  onClose, 
  game, 
  onSaveReview, 
  onRestoreToList 
}) {
  if (!isOpen || !game) return null;

  const [rating, setRating] = useState(game.rating || 0);
  const [reviewText, setReviewText] = useState(game.reviewText || '');

  useEffect(() => {
    if (game) {
      setRating(game.rating || 0);
      setReviewText(game.reviewText || '');
    }
  }, [game]);

  const handlePromptClick = (prompt) => {
    const addition = `\n• ${prompt}: `;
    setReviewText(prev => (prev.trim() ? prev + addition : `• ${prompt}: `));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (rating >= 4) {
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    }

    onSaveReview({
      ...game,
      rating,
      reviewText: reviewText.trim()
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141414]/65 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF8] border-t-2 border-[#141414] shadow-brutal p-4 space-y-4 max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-[#141414]/30 mx-auto rounded-full -mt-1 mb-1" />

        <div className="flex items-start justify-between pb-2 border-b-2 border-[#141414]">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#141414]/60 block tracking-wider">
              RECENSIONE & VOTO
            </span>
            <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#141414] truncate max-w-[280px]">
              {game.title}
            </h3>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="btn-tactile-sm bg-[#F4EFE6] p-1.5 shrink-0"
            aria-label="Chiudi"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Selettore Voto a 5 Stelle Grande e Tattile */}
          <div className="text-center space-y-1.5 p-3 bg-[#F4EFE6] border-2 border-[#141414]">
            <span className="font-mono text-xs font-black uppercase text-[#141414] block">
              VALUTAZIONE PERSONALE
            </span>
            
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-125 transition-transform"
                  aria-label={`Vota ${star} stelle`}
                >
                  <Star
                    size={32}
                    className={`stroke-[2.5] transition-colors ${
                      star <= rating
                        ? 'fill-[#FFE600] text-[#141414]'
                        : 'fill-transparent text-[#141414]/30'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="font-display text-sm font-bold uppercase text-[#141414]">
              {rating > 0 ? `${rating}/5 — ${RATING_LABELS[rating]}` : 'Tocca le stelle per votare'}
            </div>
          </div>

          {/* Chip di Spunti Cliccabili */}
          <div className="space-y-1.5">
            <span className="font-mono text-[11px] font-bold uppercase text-[#141414]/70 block">
              SPUNTI PER SCRIVERE (TOCCA PER INSERIRE):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="font-mono text-[11px] font-bold px-2 py-1 bg-[#F4EFE6] hover:bg-[#FFE600] border border-[#141414] transition-colors text-left"
                >
                  + {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Campo Nota Recensione Ampio */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              NOTE & RECENSIONE (AMPIO)
            </label>
            <textarea
              rows={5}
              placeholder="Scrivi qui cosa ne pensi dopo averlo provato al tavolo..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
            />
          </div>

          {/* Salva Recensione */}
          <button
            type="submit"
            className="w-full btn-tactile bg-[#B8FF2C] text-[#141414] font-display text-base font-bold uppercase py-3 tracking-wider"
          >
            SALVA NEL DIARIO
          </button>

          {/* Rimetti in Lista */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Spostare "${game.title}" dal Diario di nuovo nella Lista da provare?`)) {
                  onRestoreToList(game.id);
                  onClose();
                }
              }}
              className="font-mono text-xs text-[#141414]/60 hover:text-[#FF4522] inline-flex items-center gap-1 font-bold"
            >
              <RotateCcw size={13} />
              <span>Rimetti in Lista da provare</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
