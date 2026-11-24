import React, { useState, useEffect } from 'react';
import { X, Star, ExternalLink, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getBggLink, RATING_LABELS } from '../utils/storage';

const REVIEW_PROMPTS = [
  'Cosa mi è piaciuto',
  'Cosa meno',
  'Con chi rende',
  'Lo rigiocherei?',
];

export default function ReviewSheet({
  isOpen,
  onClose,
  game,
  onSaveReview,
  onRestoreToList,
}) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (game) {
      setRating(game.rating || 0);
      setReviewText(game.reviewText || '');
    }
  }, [game]);

  if (!isOpen || !game) return null;

  const handlePromptClick = (prompt) => {
    const addition = `\n• ${prompt}: `;
    setReviewText((prev) => (prev.trim() ? prev + addition : `• ${prompt}: `));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (rating >= 4) {
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.6 } });
    }
    onSaveReview({
      ...game,
      rating,
      reviewText: reviewText.trim(),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="fixed inset-x-0 bottom-0 max-w-[430px] mx-auto bg-white rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl z-50 max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#D1D1D6] mx-auto rounded-full mb-4" />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-[18px] font-bold text-[#111111] truncate">
              {game.title}
            </h3>
            <a
              href={getBggLink(game.title, game.bggUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-medium text-[#6E6E73] hover:text-[#111111] inline-flex items-center gap-1 mt-0.5"
            >
              <span>Scheda BGG</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F0F3] flex items-center justify-center text-[#6E6E73] hover:text-[#111111] shrink-0"
            aria-label="Chiudi"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Selettore Stelle 1-5 */}
          <div className="bg-[#F5F5F7] rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 active:scale-90 transition-transform"
                  aria-label={`Vota ${star} stelle`}
                >
                  <Star
                    size={32}
                    className={
                      star <= rating
                        ? 'fill-[#F59E0B] text-[#F59E0B]'
                        : 'fill-[#E5E5EA] text-[#E5E5EA]'
                    }
                  />
                </button>
              ))}
            </div>
            <p className="text-[13px] font-medium text-[#6E6E73] mt-2">
              {rating > 0 ? `${rating}/5 · ${RATING_LABELS[rating]}` : 'Tocca le stelle per votare'}
            </p>
          </div>

          {/* Chip Spunti */}
          <div className="flex flex-wrap gap-2">
            {REVIEW_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePromptClick(prompt)}
                className="text-[12px] font-medium px-3 py-1.5 rounded-full bg-[#F0F0F3] text-[#111111] hover:bg-[#E5E5EA] transition-colors"
              >
                + {prompt}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            placeholder="Scrivi le tue impressioni sulla partita..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="w-full min-h-[130px] rounded-xl bg-[#F5F5F7] p-3.5 text-[16px] text-[#111111] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#111111]/15"
          />

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-[#111111] text-white text-[15px] font-semibold active:scale-[0.98] transition-transform"
          >
            Salva recensione
          </button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Riportare "${game.title}" nella Lista da provare?`)) {
                  onRestoreToList(game.id);
                  onClose();
                }
              }}
              className="text-[13px] font-medium text-[#6E6E73] hover:text-[#EF4444] inline-flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw size={13} />
              <span>Riporta in Lista</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
