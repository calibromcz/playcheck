import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';

export default function ScheduleModal({ isOpen, onClose, onSave, game }) {
  if (!isOpen || !game) return null;

  const [date, setDate] = useState(
    game.scheduledDate || new Date().toISOString().split('T')[0]
  );
  const [sessionNote, setSessionNote] = useState(game.sessionNote || '');

  useEffect(() => {
    if (game) {
      setDate(game.scheduledDate || new Date().toISOString().split('T')[0]);
      setSessionNote(game.sessionNote || '');
    }
  }, [game]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date) return;

    onSave({
      ...game,
      status: 'scheduled',
      scheduledDate: date,
      sessionNote: sessionNote.trim()
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
            <CalendarIcon size={18} className="stroke-[2.5]" />
            <h3 className="font-display text-base uppercase tracking-tight text-[#141414]">
              METTI IN AGENDA
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <span className="font-mono text-[10px] uppercase text-[#141414]/60 block font-bold">
              GIOCO DA FISSARE:
            </span>
            <div className="font-display text-lg uppercase text-[#141414] truncate">
              {game.title}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-[#141414] mb-1">
              DATA SESSIONE *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-[#F4EFE6] border-2 border-[#141414] font-mono text-base text-[#141414]"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-[#141414] mb-1">
              DETTAGLI LOGISTICI / NOTE
            </label>
            <input
              type="text"
              placeholder="Es. Venerdì ore 21 da Luca..."
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              className="w-full p-2 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414]"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full btn-tactile bg-[#FFE600] text-[#141414] font-display text-base uppercase py-3 tracking-wider"
            >
              SALVA IN AGENDA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
