import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function VerdictModal({ isOpen, onClose, onSave, game }) {
  if (!isOpen || !game) return null;

  const [verdict, setVerdict] = useState('top');
  const [playedNotes, setPlayedNotes] = useState(game.notes || '');

  const handleSave = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.6 }
    });

    onSave({
      ...game,
      status: 'played',
      verdict,
      notes: playedNotes.trim(),
      playedAt: new Date().toISOString()
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141414]/65 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF8] border-t-2 border-[#141414] shadow-brutal p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-[#141414]/30 mx-auto rounded-full -mt-1 mb-1" />

        <div className="flex items-center justify-between pb-2 border-b border-[#141414]/20">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={18} className="stroke-[2.5] text-[#141414]" />
            <h3 className="font-display text-base uppercase tracking-tight text-[#141414]">
              TIMBRA GIOCO PROVATO
            </h3>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-tactile-sm bg-[#F4EFE6] p-1.5"
            aria-label="Chiudi"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <span className="font-mono text-[10px] uppercase text-[#141414]/60 block font-bold">
              HAI COMPLETATO LA PROVA DI:
            </span>
            <div className="font-display text-lg uppercase text-[#141414] truncate">
              {game.title}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-[#141414] mb-1.5">
              SCEGLI IL VERDETTO FINALE
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'top', label: 'TOP', sub: 'DA AVERE', bg: 'bg-[#B8FF2C]' },
                { id: 'ok', label: 'OK', sub: 'CARINO', bg: 'bg-[#FFE600]' },
                { id: 'passo', label: 'PASSO', sub: 'NON PER ME', bg: 'bg-[#FF4522] text-white' },
              ].map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVerdict(v.id)}
                  className={`btn-tactile-sm py-2 px-1 font-mono text-center border-2 border-[#141414] ${
                    verdict === v.id
                      ? `${v.bg} font-black ring-2 ring-[#141414]`
                      : 'bg-[#F4EFE6] text-[#141414]'
                  }`}
                >
                  <div className="font-display text-xs uppercase leading-none">{v.label}</div>
                  <div className="text-[10px] mt-1 opacity-80">{v.sub}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-[#141414] mb-1">
              PENSIERI A CALDO (OPZIONALE)
            </label>
            <textarea
              rows={2}
              placeholder="Sensazioni sul regolamento, numero di giocatori ideale..."
              value={playedNotes}
              onChange={(e) => setPlayedNotes(e.target.value)}
              className="w-full p-2 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full btn-tactile bg-[#B8FF2C] text-[#141414] font-display text-base uppercase py-3 tracking-wider"
            >
              TIMBRA "CHECKED"
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
