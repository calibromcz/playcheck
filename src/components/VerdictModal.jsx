import React, { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { VERDICTS } from '../utils/storage';

export default function VerdictModal({ isOpen, onClose, onSave, game }) {
  if (!isOpen || !game) return null;

  const [verdict, setVerdict] = useState('top');
  const [playedNotes, setPlayedNotes] = useState(game.notes || '');

  const handleSave = (e) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/75">
      <div 
        className="w-full max-w-sm bg-paper-card border-[2.5px] border-[#141414] card-tactile overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 bg-risograph-lime border-b-2 border-[#141414]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={18} className="stroke-[3]" />
            <span className="font-display text-base uppercase tracking-tight text-[#141414]">
              TIMBRA COME PROVATO!
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="btn-tactile-sm bg-white p-1 text-[#141414]"
          >
            <X size={16} className="stroke-[3]" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-4 space-y-4">
          <div>
            <div className="font-mono text-[10px] font-bold text-[#141414]/60 uppercase">COMPLETI LA PROVA DI:</div>
            <div className="font-display text-xl uppercase text-[#141414]">{game.title}</div>
          </div>

          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1.5">
              SCEGLI IL TUO VERDETTO
            </label>
            <div className="space-y-2">
              {[
                { id: 'top', label: 'TOP / DA AVERE ASSOLUTAMENTE', desc: 'Esperienza incredibile, da comprare o rigiocare subito.', bg: 'bg-risograph-lime' },
                { id: 'ok', label: 'OK / CARINO MA SENZA FRETTA', desc: 'Partita godibile, da rigiocare se capita.', bg: 'bg-risograph-yellow' },
                { id: 'passo', label: 'PASSO / NON FA PER ME', desc: 'Non mi ha convinto, posso liberare spazio in mente.', bg: 'bg-risograph-vermilion text-white' },
              ].map((v) => (
                <div
                  key={v.id}
                  onClick={() => setVerdict(v.id)}
                  className={`p-2.5 border-2 border-[#141414] cursor-pointer btn-tactile-sm ${
                    verdict === v.id ? `${v.bg} ring-2 ring-[#141414] font-black` : 'bg-white text-[#141414]'
                  }`}
                >
                  <div className="font-display text-xs uppercase">{v.label}</div>
                  <div className="font-mono text-[10px] opacity-80 leading-tight mt-0.5">{v.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              PENSIERI A CALDO / NOTE FINALI
            </label>
            <textarea
              rows={2}
              placeholder="Sensazioni sul regolamento, punteggi, scaling in giocatori..."
              value={playedNotes}
              onChange={(e) => setPlayedNotes(e.target.value)}
              className="w-full p-2 bg-paper-bg border-2 border-[#141414] font-body text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full btn-tactile bg-risograph-lime text-[#141414] font-display text-base uppercase py-3 border-2 border-[#141414] tracking-wider"
            >
              TIMBRA "CHECKED"
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
