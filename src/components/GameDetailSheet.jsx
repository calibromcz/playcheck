import React from 'react';
import { X, Calendar as CalendarIcon, CheckCircle2, Edit3, Trash2, RotateCcw, User, Flame, MapPin } from 'lucide-react';
import { WEIGHT_LABELS, VERDICTS } from '../utils/storage';

export default function GameDetailSheet({ 
  isOpen, 
  onClose, 
  game, 
  onSchedule, 
  onMarkPlayed, 
  onEdit, 
  onDelete, 
  onMoveToQueue 
}) {
  if (!isOpen || !game) return null;

  const weightInfo = WEIGHT_LABELS[game.weight] || WEIGHT_LABELS.medio;
  const isPlayed = game.status === 'played';
  const isScheduled = game.status === 'scheduled';
  const verdictInfo = game.verdict ? VERDICTS[game.verdict] : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141414]/65 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF8] border-t-2 border-[#141414] shadow-brutal p-4 space-y-4 max-h-[85dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar for bottom sheet */}
        <div className="w-12 h-1 bg-[#141414]/30 mx-auto rounded-full -mt-1 mb-2" />

        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-[#141414]/20 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#141414]/70">
              <span className="font-bold uppercase tracking-wider">
                {game.requestedBy ? `PROPOSTO DA ${game.requestedBy.toUpperCase()}` : 'IO'}
              </span>
              <span>·</span>
              <span className="font-bold uppercase">{weightInfo.label.split(' ')[0]}</span>
            </div>
            <h2 className="font-display text-xl uppercase tracking-tight text-[#141414] leading-tight">
              {game.title}
            </h2>
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

        {/* Status preview banner if scheduled or played */}
        {isScheduled && game.scheduledDate && (
          <div className="p-2.5 bg-[#FFE600]/25 border-l-4 border-[#141414] font-mono text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold uppercase text-[#141414]">
              <CalendarIcon size={14} className="stroke-[2.5]" />
              <span>IN AGENDA: {game.scheduledDate}</span>
            </div>
            {game.sessionNote && (
              <p className="text-[#141414]/80 italic pl-5">"{game.sessionNote}"</p>
            )}
          </div>
        )}

        {isPlayed && (
          <div className="p-2.5 bg-[#B8FF2C]/25 border-l-4 border-[#141414] font-mono text-xs flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-[#141414]/60 block font-bold">VERDETTO:</span>
              <span className="font-display text-sm uppercase text-[#141414]">
                {verdictInfo ? verdictInfo.label : 'PROVATO'}
              </span>
              {game.playedAt && (
                <span className="text-[10px] text-[#141414]/60 block mt-0.5">
                  il {new Date(game.playedAt).toLocaleDateString('it-IT')}
                </span>
              )}
            </div>
            <div className="stamp-checked px-2.5 py-0.5 font-display text-xs bg-[#B8FF2C] text-[#141414]">
              CHECKED
            </div>
          </div>
        )}

        {/* Hype Level */}
        <div className="flex items-center justify-between p-2.5 bg-[#F4EFE6] border border-[#141414]/20 font-mono text-xs">
          <span className="font-bold text-[#141414]/70 uppercase">LIVELLO DI HYPE:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((val) => (
              <Flame 
                key={val} 
                size={16} 
                className={val <= game.hype ? 'fill-[#FF4522] text-[#FF4522]' : 'text-[#141414]/20 fill-transparent'} 
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        {game.notes && (
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold uppercase text-[#141414]/60 block">NOTE:</span>
            <p className="font-body text-xs text-[#141414] bg-[#F4EFE6] p-2.5 border border-[#141414]/20 leading-relaxed">
              {game.notes}
            </p>
          </div>
        )}

        {/* 4 Chiare Azioni Primarie */}
        <div className="space-y-2 pt-2 border-t border-[#141414]/20">
          {!isPlayed ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSchedule(game);
              }}
              className="w-full btn-tactile bg-[#FFE600] text-[#141414] font-display text-sm uppercase py-2.5 flex items-center justify-center gap-2"
            >
              <CalendarIcon size={16} className="stroke-[2.5]" />
              <span>{isScheduled ? 'MODIFICA DATA IN AGENDA' : 'PIANIFICA DATA IN AGENDA'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onMoveToQueue(game);
              }}
              className="w-full btn-tactile bg-[#FFE600] text-[#141414] font-display text-sm uppercase py-2.5 flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} className="stroke-[2.5]" />
              <span>RIMETTI IN CODA DA PROVARE</span>
            </button>
          )}

          {!isPlayed && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onMarkPlayed(game);
              }}
              className="w-full btn-tactile bg-[#B8FF2C] text-[#141414] font-display text-sm uppercase py-2.5 flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} className="stroke-[2.5]" />
              <span>SEGNA COME PROVATO & VERDETTO</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(game);
              }}
              className="btn-tactile bg-[#F4EFE6] text-[#141414] font-display text-xs uppercase py-2 flex items-center justify-center gap-1.5"
            >
              <Edit3 size={14} className="stroke-[2.5]" />
              <span>MODIFICA</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(game.id);
              }}
              className="btn-tactile bg-[#F4EFE6] hover:bg-[#FF4522] hover:text-white text-[#FF4522] font-display text-xs uppercase py-2 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} className="stroke-[2.5]" />
              <span>ELIMINA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
