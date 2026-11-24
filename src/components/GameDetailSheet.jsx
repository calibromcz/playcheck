import React from 'react';
import { X, Calendar as CalendarIcon, Check, Pin, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { getBggLink } from '../utils/storage';

const WEIGHT_TEXT = {
  filler: 'Filler',
  medio: 'Medio',
  cinghiale: 'Cinghiale',
};

export default function GameDetailSheet({
  isOpen,
  onClose,
  game,
  onToggleCheck,
  onTogglePin,
  onScheduleGame,
  onEditGame,
  onDeleteGame,
}) {
  if (!isOpen || !game) return null;

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
            <h3 className="text-[18px] font-bold text-[#111111] leading-snug">
              {game.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-[13px] text-[#6E6E73]">
              <span>{WEIGHT_TEXT[game.weight] || 'Medio'}</span>
              {game.requestedBy && (
                <>
                  <span className="text-[#AEAEB2]">·</span>
                  <span>da {game.requestedBy}</span>
                </>
              )}
            </div>
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

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => {
              onToggleCheck(game);
              onClose();
            }}
            className="w-full h-12 rounded-xl bg-[#111111] text-white text-[15px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Check size={17} />
            <span>Segna come provato</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onScheduleGame(game);
            }}
            className="w-full h-11 rounded-xl bg-[#F0F0F3] text-[#111111] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#E5E5EA] transition-colors"
          >
            <CalendarIcon size={16} />
            <span>Pinna sul calendario</span>
          </button>

          <a
            href={getBggLink(game.title, game.bggUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-xl bg-[#F0F0F3] text-[#111111] text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-[#E5E5EA] transition-colors"
          >
            <ExternalLink size={15} />
            <span>Apri su BoardGameGeek</span>
          </a>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEditGame(game);
              }}
              className="h-11 rounded-xl bg-[#F5F5F7] text-[#111111] text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#E5E5EA] transition-colors"
            >
              <Edit3 size={14} />
              <span>Modifica</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onTogglePin(game.id);
                onClose();
              }}
              className="h-11 rounded-xl bg-[#F5F5F7] text-[#111111] text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#E5E5EA] transition-colors"
            >
              <Pin
                size={14}
                className={game.pinned ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#6E6E73]'}
              />
              <span>{game.pinned ? 'Togli Pin' : 'Priorità'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Eliminare "${game.title}"?`)) {
                  onDeleteGame(game.id);
                  onClose();
                }
              }}
              className="h-11 rounded-xl bg-[#F5F5F7] text-[#EF4444] text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#EF4444]/10 transition-colors"
            >
              <Trash2 size={14} />
              <span>Elimina</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
