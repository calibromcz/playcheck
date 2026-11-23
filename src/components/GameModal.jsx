import React, { useState, useEffect } from 'react';
import { X, Flame } from 'lucide-react';

export default function GameModal({ isOpen, onClose, onSave, editingGame, prefilledDate }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [weight, setWeight] = useState('medio');
  const [hype, setHype] = useState(2);
  const [scheduledDate, setScheduledDate] = useState('');
  const [sessionNote, setSessionNote] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingGame) {
      setTitle(editingGame.title || '');
      setRequestedBy(editingGame.requestedBy || '');
      setWeight(editingGame.weight || 'medio');
      setHype(editingGame.hype || 2);
      setScheduledDate(editingGame.scheduledDate || '');
      setSessionNote(editingGame.sessionNote || '');
      setNotes(editingGame.notes || '');
    } else {
      setTitle('');
      setRequestedBy('');
      setWeight('medio');
      setHype(2);
      setScheduledDate(prefilledDate || '');
      setSessionNote('');
      setNotes('');
    }
  }, [editingGame, prefilledDate, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const gameData = {
      id: editingGame ? editingGame.id : 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title.trim(),
      requestedBy: requestedBy.trim(),
      weight,
      hype: Number(hype),
      status: scheduledDate ? 'scheduled' : (editingGame?.status === 'played' ? 'played' : 'queue'),
      scheduledDate: scheduledDate || null,
      sessionNote: scheduledDate ? sessionNote.trim() : '',
      notes: notes.trim(),
      verdict: editingGame ? editingGame.verdict : null,
      createdAt: editingGame ? editingGame.createdAt : new Date().toISOString(),
      playedAt: editingGame ? editingGame.playedAt : null
    };

    onSave(gameData);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141414]/65 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF8] border-t-2 border-[#141414] shadow-brutal max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-12 h-1 bg-[#141414]/30 mx-auto rounded-full mt-2.5 mb-1" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#141414]/20">
          <h2 className="font-display text-base uppercase tracking-tight text-[#141414]">
            {editingGame ? 'MODIFICA GIOCO' : 'NUOVO GIOCO IN CODA'}
          </h2>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-tactile-sm bg-[#F4EFE6] p-1.5"
            aria-label="Chiudi"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Form Body con Scroll fluido */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 pb-6">
          {/* Titolo Gioco */}
          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-[#141414] mb-1">
              TITOLO DEL GIOCO *
            </label>
            <input
              type="text"
              required
              autoFocus={!editingGame}
              placeholder="Es. Ark Nova, Scout, Dune..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
            />
          </div>

          {/* Chi lo propone */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-mono text-[11px] font-black uppercase text-[#141414]">
                CHI LO PROPONE
              </label>
              <div className="flex gap-1">
                {['Mio', 'Gruppo'].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setRequestedBy(quick)}
                    className="font-mono text-[10px] font-bold px-1.5 py-0.5 border border-[#141414] bg-[#F4EFE6]"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Es. Marco, Elena, Mio..."
              value={requestedBy}
              onChange={(e) => setRequestedBy(e.target.value)}
              className="w-full p-2 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
            />
          </div>

          {/* Peso (3 bottoni affiancati) */}
          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-[#141414] mb-1">
              PESO / COMPLESSITÀ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'filler', label: 'FILLER' },
                { id: 'medio', label: 'MEDIO' },
                { id: 'cinghiale', label: 'CINGHIALE' },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWeight(w.id)}
                  className={`btn-tactile-sm py-2 font-mono text-xs border-2 border-[#141414] text-center ${
                    weight === w.id
                      ? 'bg-[#141414] text-white font-black'
                      : 'bg-[#F4EFE6] text-[#141414]'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hype (3 bottoni affiancati con fiamme) */}
          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-[#141414] mb-1">
              LIVELLO DI HYPE
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 1, label: 'NORMALE', emoji: '🔥' },
                { level: 2, label: 'ALTO', emoji: '🔥🔥' },
                { level: 3, label: 'MUST PLAY', emoji: '🔥🔥🔥' },
              ].map((h) => (
                <button
                  key={h.level}
                  type="button"
                  onClick={() => setHype(h.level)}
                  className={`btn-tactile-sm py-2 font-mono text-xs border-2 border-[#141414] text-center flex flex-col items-center justify-center ${
                    hype === h.level
                      ? 'bg-[#FF4522] text-white font-black'
                      : 'bg-[#F4EFE6] text-[#141414]'
                  }`}
                >
                  <span className="text-xs leading-none">{h.emoji}</span>
                  <span className="text-[10px] mt-0.5">{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Data Pianificata (opzionale) */}
          <div className="p-3 bg-[#FFE600]/20 border border-[#141414]/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-mono text-[11px] font-black uppercase text-[#141414]">
                METTI IN AGENDA (OPZIONALE)
              </label>
              {scheduledDate && (
                <button
                  type="button"
                  onClick={() => {
                    setScheduledDate('');
                    setSessionNote('');
                  }}
                  className="font-mono text-[10px] text-[#FF4522] font-bold"
                >
                  AZZERA DATA
                </button>
              )}
            </div>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full p-2 bg-[#FFFDF8] border-2 border-[#141414] font-mono text-base text-[#141414]"
            />
            {scheduledDate && (
              <input
                type="text"
                placeholder="Note logistica (es. Da Paolo ore 21)..."
                value={sessionNote}
                onChange={(e) => setSessionNote(e.target.value)}
                className="w-full p-2 bg-[#FFFDF8] border-2 border-[#141414] font-body text-base"
              />
            )}
          </div>

          {/* Note compatte opzionali */}
          <div>
            <label className="block font-mono text-[11px] font-black uppercase text-[#141414] mb-1">
              NOTE / PROMEMORIA (OPZIONALE)
            </label>
            <textarea
              rows={2}
              placeholder="Regolamento, espansioni, player count ideale..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
            />
          </div>

          {/* Bottone Finale Fisso */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-tactile bg-[#FF4522] text-white font-display text-base uppercase py-3 tracking-wider"
            >
              {editingGame ? 'SALVA MODIFICHE' : 'SALVA IN CODA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
