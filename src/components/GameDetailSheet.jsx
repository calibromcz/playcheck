import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Check, Pin, Trash2, Edit3, ExternalLink } from 'lucide-react';
import { getBggLink, WEIGHT_LABELS } from '../utils/storage';

export default function GameDetailSheet({ 
  isOpen, 
  onClose, 
  game, 
  onToggleCheck, 
  onTogglePin, 
  onScheduleGame, 
  onEditGame, 
  onDeleteGame 
}) {
  if (!isOpen || !game) return null;

  const isPlayed = game.status === 'played';
  const weightInfo = WEIGHT_LABELS[game.weight] || WEIGHT_LABELS.medio;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141414]/65 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF8] border-t-2 border-[#141414] shadow-brutal p-4 space-y-4 max-h-[88dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-[#141414]/30 mx-auto rounded-full -mt-1 mb-1" />

        <div className="flex items-start justify-between pb-2 border-b-2 border-[#141414]">
          <div className="space-y-1 min-w-0 pr-2">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#141414]/70">
              <span className="font-bold uppercase">{weightInfo.label}</span>
              <span>·</span>
              <span>da {game.requestedBy || 'Io'}</span>
            </div>
            <h3 className="font-display text-xl font-bold uppercase text-[#141414] truncate leading-tight">
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

        {/* Info & Link BGG */}
        <div className="p-3 bg-[#F4EFE6] border-2 border-[#141414] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#141414]/70 uppercase">SCHEDA SU BGG:</span>
            <a
              href={getBggLink(game.title, game.bggUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-[#FFE600] border border-[#141414] font-bold text-[#141414] flex items-center gap-1 hover:underline"
            >
              <span>APRI SU BGG</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-[#141414]/20">
            <span className="font-bold text-[#141414]/70 uppercase">PRIORITÀ IN ALTO:</span>
            <span className="font-black text-[#141414]">
              {game.pinned ? 'SÌ (IN EVIDENZA)' : 'NO'}
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
            className="w-full btn-tactile bg-[#B8FF2C] text-[#141414] font-display text-sm font-bold uppercase py-3 flex items-center justify-center gap-2"
          >
            <Check size={18} className="stroke-[3]" />
            <span>SEGNA COME PROVATO (SPOSTA NEL DIARIO)</span>
          </button>

          {/* Pinna sul Calendario */}
          <button
            type="button"
            onClick={() => {
              onScheduleGame(game);
              onClose();
            }}
            className="w-full btn-tactile bg-[#FFE600] text-[#141414] font-display text-sm font-bold uppercase py-2.5 flex items-center justify-center gap-2"
          >
            <CalendarIcon size={16} className="stroke-[2.5]" />
            <span>PINNA EVENTO SUL CALENDARIO</span>
          </button>

          {/* Griglia bottoni secondari */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onTogglePin(game.id);
                onClose();
              }}
              className="btn-tactile bg-[#FFFDF8] font-mono text-xs font-bold uppercase py-2 flex items-center justify-center gap-1.5"
            >
              <Pin size={14} className={game.pinned ? "fill-[#FF4522]" : ""} />
              <span>{game.pinned ? 'TOGLI PIN' : 'METTI PIN'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Eliminare definitivamente "${game.title}"?`)) {
                  onDeleteGame(game.id);
                  onClose();
                }
              }}
              className="btn-tactile bg-[#FFFDF8] hover:bg-[#FF4522] hover:text-white text-[#FF4522] font-mono text-xs font-bold uppercase py-2 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>ELIMINA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
