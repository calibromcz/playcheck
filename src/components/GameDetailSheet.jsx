import React from 'react';
import { X, Calendar as CalendarIcon, Check, Pin, Trash2, ExternalLink } from 'lucide-react';
import { getBggLink, WEIGHT_LABELS } from '../utils/storage';

export default function GameDetailSheet({ 
  isOpen, 
  onClose, 
  game, 
  onToggleCheck, 
  onTogglePin, 
  onScheduleGame, 
  onDeleteGame 
}) {
  if (!isOpen || !game) return null;

  const weightInfo = WEIGHT_LABELS[game.weight] || WEIGHT_LABELS.medio;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 backdrop-blur-[2px] animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFFFF] rounded-t-3xl shadow-[0_-8px_24px_rgba(28,25,23,0.08)] p-4 space-y-4 max-h-[88dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#D6D1C4] mx-auto rounded-full -mt-1 mb-1" />

        <div className="flex items-start justify-between pb-3 border-b border-[#E4DFD3]">
          <div className="space-y-0.5 min-w-0 pr-2">
            <div className="flex items-center gap-2 text-xs text-[#78716C]">
              <span className="font-semibold uppercase tracking-wider">{weightInfo.label}</span>
              <span>·</span>
              <span>da {game.requestedBy || 'Io'}</span>
            </div>
            <h3 className="font-serif text-[20px] font-bold text-[#1C1917] truncate leading-tight">
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

        {/* Info & Link BGG */}
        <div className="p-3.5 bg-[#F6F4EF] rounded-2xl border border-[#E4DFD3] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-[#78716C]">Scheda BoardGameGeek:</span>
            <a
              href={getBggLink(game.title, game.bggUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#EFECE4] hover:bg-[#E4DFD3] font-medium text-[#1B4D3E] flex items-center gap-1 transition-colors"
            >
              <span>Apri su BGG</span>
              <ExternalLink size={11} />
            </a>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#E4DFD3]">
            <span className="font-medium text-[#78716C]">Priorità in alto:</span>
            <span className="font-semibold text-[#1C1917]">
              {game.pinned ? 'In evidenza' : 'Normale'}
            </span>
          </div>
        </div>

        {/* Azioni Principali */}
        <div className="space-y-2 pt-1">
          {/* Tasto Spunta / Provato */}
          <button
            type="button"
            onClick={() => {
              onToggleCheck(game);
              onClose();
            }}
            className="w-full h-12 rounded-xl bg-[#1B4D3E] hover:bg-[#143A2F] text-white text-[15px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
          >
            <Check size={18} className="stroke-[2.5]" />
            <span>Segna come provato (sposta nel Diario)</span>
          </button>

          {/* Pinna sul Calendario */}
          <button
            type="button"
            onClick={() => {
              onScheduleGame(game);
              onClose();
            }}
            className="w-full h-11 rounded-xl bg-[#EFECE4] hover:bg-[#E4DFD3] text-[#1C1917] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <CalendarIcon size={16} className="text-[#1B4D3E]" />
            <span>Pinna data sul calendario</span>
          </button>

          {/* Bottoni secondari */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onTogglePin(game.id);
                onClose();
              }}
              className="h-10 rounded-xl border border-[#E4DFD3] bg-[#FFFFFF] hover:bg-[#F6F4EF] text-[#1C1917] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Pin size={14} className={game.pinned ? "fill-[#D97706] text-[#D97706]" : "text-[#78716C]"} />
              <span>{game.pinned ? 'Togli pin' : 'Metti pin'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Eliminare definitivamente "${game.title}"?`)) {
                  onDeleteGame(game.id);
                  onClose();
                }
              }}
              className="h-10 rounded-xl border border-[#FEE2E2] bg-[#FFFFFF] hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
