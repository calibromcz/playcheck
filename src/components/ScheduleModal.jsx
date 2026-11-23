import React, { useState } from 'react';
import { Calendar as CalendarIcon, X, Check } from 'lucide-react';

export default function ScheduleModal({ isOpen, onClose, onSave, game }) {
  if (!isOpen || !game) return null;

  const [date, setDate] = useState(
    game.scheduledDate || new Date().toISOString().split('T')[0]
  );
  const [sessionNote, setSessionNote] = useState(game.sessionNote || '');

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/75">
      <div 
        className="w-full max-w-sm bg-paper-card border-[2.5px] border-[#141414] card-tactile overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 bg-risograph-yellow border-b-2 border-[#141414]">
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} className="stroke-[3]" />
            <span className="font-display text-base uppercase tracking-tight text-[#141414]">
              PIANIFICA SESSIONE
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

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="bg-paper-bg p-2.5 border-2 border-[#141414]">
            <span className="font-mono text-[10px] uppercase text-[#141414]/70 block font-bold">GIOCO SELEZIONATO</span>
            <div className="font-display text-lg uppercase text-[#141414]">{game.title}</div>
          </div>

          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              DATA PARTITA *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-paper-bg border-2 border-[#141414] font-mono text-sm"
            />
          </div>

          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              NOTE LOGISTICHE / ORA / LUOGO
            </label>
            <input
              type="text"
              placeholder="Es. Venerdì sera da Luca ore 21:00..."
              value={sessionNote}
              onChange={(e) => setSessionNote(e.target.value)}
              className="w-full p-2.5 bg-paper-bg border-2 border-[#141414] font-body text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-tactile bg-risograph-yellow text-[#141414] font-display text-base uppercase py-2.5 border-2 border-[#141414]"
            >
              FISSATO IN CALENDARIO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
