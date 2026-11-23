import React, { useState, useEffect } from 'react';
import { X, Star, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RATING_LABELS } from '../utils/storage';

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
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 backdrop-blur-[2px] animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFFFF] rounded-t-3xl shadow-[0_-8px_24px_rgba(28,25,23,0.08)] p-4 space-y-4 max-h-[92dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#D6D1C4] mx-auto rounded-full -mt-1 mb-1" />

        <div className="flex items-start justify-between pb-3 border-b border-[#E4DFD3]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block">
              Recensione & Voto
            </span>
            <h3 className="font-serif text-[20px] font-bold text-[#1C1917] truncate max-w-[280px]">
              {game.title}
            </h3>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:bg-[#EFECE4] hover:text-[#1C1917]"
            aria-label="Chiudi"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Selettore Voto a 5 Stelle Grande e Calmo */}
          <div className="text-center space-y-1.5 p-3.5 bg-[#F6F4EF] rounded-2xl border border-[#E4DFD3]">
            <span className="text-xs font-medium text-[#78716C] block">
              Valutazione personale
            </span>
            
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-115 transition-transform"
                  aria-label={`Vota ${star} stelle`}
                >
                  <Star
                    size={28}
                    className={`transition-colors ${
                      star <= rating
                        ? 'fill-[#D97706] text-[#D97706]'
                        : 'fill-transparent text-[#D6D1C4]'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="text-sm font-semibold text-[#1C1917]">
              {rating > 0 ? `${rating}/5 — ${RATING_LABELS[rating]}` : 'Tocca le stelle per votare'}
            </div>
          </div>

          {/* Chip di Spunti Cliccabili */}
          <div className="space-y-1.5">
            <span className="text-[12px] font-medium text-[#78716C] block">
              Spunti per scrivere (tocca per inserire):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#EFECE4] hover:bg-[#E4DFD3] text-[#1C1917] transition-colors text-left"
                >
                  + {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Campo Nota Recensione */}
          <div>
            <label className="block text-xs font-medium text-[#57534E] mb-1">
              Note & Recensione
            </label>
            <textarea
              rows={5}
              placeholder="Scrivi qui sensazioni, momenti memorabili o impressioni al tavolo..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full p-3 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl text-base text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#1B4D3E]"
            />
          </div>

          {/* Salva Recensione */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#1B4D3E] hover:bg-[#143A2F] text-white text-[15px] font-semibold active:scale-[0.98] transition-all shadow-sm"
          >
            Salva nel diario
          </button>

          {/* Rimetti in Lista */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Spostare "${game.title}" dal Diario di nuovo nella Lista da provare?`)) {
                  onRestoreToList(game.id);
                  onClose();
                }
              }}
              className="text-xs text-[#78716C] hover:text-[#DC2626] inline-flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw size={13} />
              <span>Rimetti in lista da provare</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
