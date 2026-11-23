import React from 'react';
import { 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Flame, 
  Trash2, 
  Edit3, 
  User, 
  Clock, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { WEIGHT_LABELS, VERDICTS } from '../utils/storage';

export default function GameCard({ 
  game, 
  onEdit, 
  onDelete, 
  onMarkPlayed, 
  onSchedule, 
  onMoveToQueue 
}) {
  const weightInfo = WEIGHT_LABELS[game.weight] || WEIGHT_LABELS.medio;
  const isPlayed = game.status === 'played';
  const isScheduled = game.status === 'scheduled';
  const verdictInfo = game.verdict ? VERDICTS[game.verdict] : null;

  return (
    <div className={`relative bg-paper-card border-2 border-paper-border card-tactile p-4 mb-4 transition-all ${
      isPlayed ? 'bg-[#FAF6EE] opacity-95' : ''
    }`}>
      {/* Top Header: Requested by & Weight Badge */}
      <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-[#141414]/15">
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#141414]/75 truncate">
          <User size={13} className="stroke-[2.5]" />
          <span className="font-bold tracking-tight">RICHIESTO DA:</span>
          <span className="bg-[#141414]/10 px-1.5 py-0.5 font-black uppercase text-[#141414] truncate">
            {game.requestedBy || 'IO'}
          </span>
        </div>

        <div className={`font-mono text-[10px] font-black uppercase px-2 py-0.5 border border-[#141414] ${weightInfo.bg} ${weightInfo.text} tracking-wider shrink-0`}>
          {weightInfo.label}
        </div>
      </div>

      {/* Main Title & Hype Flames */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-display text-xl uppercase tracking-tight text-[#141414] leading-tight break-words">
          {game.title}
        </h3>
        
        {/* Hype Level */}
        <div className="flex items-center gap-0.5 shrink-0 bg-paper-bg px-1.5 py-1 border border-[#141414] shadow-[1px_1px_0px_#141414]" title={`Hype: ${game.hype}/3`}>
          {[1, 2, 3].map((val) => (
            <Flame 
              key={val} 
              size={15} 
              className={`${
                val <= game.hype 
                  ? 'fill-risograph-vermilion text-risograph-vermilion' 
                  : 'text-[#141414]/20 fill-transparent'
              } stroke-[2.5] transition-colors`} 
            />
          ))}
        </div>
      </div>

      {/* Scheduled Info / Ticket info */}
      {isScheduled && game.scheduledDate && (
        <div className="bg-risograph-yellow/30 border-2 border-[#141414] p-2.5 mb-3 font-mono text-xs flex flex-col gap-1 shadow-[2px_2px_0px_#141414]">
          <div className="flex items-center gap-1.5 text-risograph-cobalt font-black uppercase tracking-wider">
            <CalendarIcon size={14} className="stroke-[3]" />
            <span>SESSIONE FISSATA: {game.scheduledDate}</span>
          </div>
          {game.sessionNote && (
            <p className="text-[#141414] font-medium pl-5 italic border-l-2 border-[#141414]/30">
              "{game.sessionNote}"
            </p>
          )}
        </div>
      )}

      {/* Played Verdict Inked Stamp */}
      {isPlayed && (
        <div className="my-3 flex items-center justify-between bg-paper-bg border-2 border-dashed border-[#141414] p-3 relative overflow-hidden">
          <div className="flex flex-col font-mono text-xs">
            <span className="font-bold text-[#141414]/60 uppercase text-[10px]">VERDETTO FINALE:</span>
            <span className="font-display text-base uppercase text-[#141414]">
              {verdictInfo ? verdictInfo.label : 'NESSUN VERDETTO'}
            </span>
            {game.playedAt && (
              <span className="text-[10px] text-[#141414]/70 mt-0.5">
                Provato il: {new Date(game.playedAt).toLocaleDateString('it-IT')}
              </span>
            )}
          </div>

          {/* Stamp Badge */}
          <div className="stamp-checked px-3 py-1 font-display font-black text-sm uppercase bg-risograph-lime text-[#141414] shadow-sm shrink-0">
            CHECKED
          </div>
        </div>
      )}

      {/* Game Notes */}
      {game.notes && (
        <div className="font-body text-sm text-[#141414]/85 bg-white/70 border border-[#141414]/25 p-2 mb-3 leading-snug">
          {game.notes}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-[#141414] mt-2">
        <div className="flex items-center gap-1.5">
          <button 
            type="button"
            onClick={() => onEdit(game)}
            className="btn-tactile-sm bg-paper-bg hover:bg-risograph-lilac text-[#141414] p-1.5"
            title="Modifica gioco"
          >
            <Edit3 size={15} className="stroke-[2.5]" />
          </button>
          
          <button 
            type="button"
            onClick={() => onDelete(game.id)}
            className="btn-tactile-sm bg-paper-bg hover:bg-risograph-vermilion hover:text-white text-[#141414] p-1.5 transition-colors"
            title="Elimina"
          >
            <Trash2 size={15} className="stroke-[2.5]" />
          </button>

          {isPlayed && (
            <button
              type="button"
              onClick={() => onMoveToQueue(game)}
              className="btn-tactile-sm bg-paper-bg hover:bg-risograph-yellow text-[#141414] p-1.5 text-xs font-mono font-bold flex items-center gap-1"
              title="Rimetti in coda"
            >
              <RotateCcw size={14} />
              <span>IN CODA</span>
            </button>
          )}
        </div>

        {/* Primary State Action Buttons */}
        <div className="flex items-center gap-1.5">
          {!isPlayed && (
            <button
              type="button"
              onClick={() => onSchedule(game)}
              className="btn-tactile-sm bg-risograph-yellow text-[#141414] font-mono text-xs font-bold px-2.5 py-1.5 flex items-center gap-1"
            >
              <CalendarIcon size={14} className="stroke-[2.5]" />
              <span>{isScheduled ? 'RIPROGRAMMA' : 'PIANIFICA'}</span>
            </button>
          )}

          {!isPlayed ? (
            <button
              type="button"
              onClick={() => onMarkPlayed(game)}
              className="btn-tactile-sm bg-risograph-lime text-[#141414] font-mono text-xs font-black px-3 py-1.5 flex items-center gap-1 uppercase tracking-tight"
            >
              <CheckCircle2 size={14} className="stroke-[2.5]" />
              <span>PROVATO!</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
