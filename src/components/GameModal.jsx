import React, { useState } from 'react';
import { X, Flame, CheckCircle, Calendar as CalendarIcon, Tag, User, AlignLeft } from 'lucide-react';

export default function GameModal({ isOpen, onClose, onSave, editingGame }) {
  if (!isOpen) return null;

  const [title, setTitle] = useState(editingGame ? editingGame.title : '');
  const [requestedBy, setRequestedBy] = useState(editingGame ? editingGame.requestedBy || '' : '');
  const [weight, setWeight] = useState(editingGame ? editingGame.weight : 'medio');
  const [hype, setHype] = useState(editingGame ? editingGame.hype : 2);
  const [status, setStatus] = useState(editingGame ? editingGame.status : 'queue');
  const [scheduledDate, setScheduledDate] = useState(editingGame ? editingGame.scheduledDate || '' : '');
  const [sessionNote, setSessionNote] = useState(editingGame ? editingGame.sessionNote || '' : '');
  const [notes, setNotes] = useState(editingGame ? editingGame.notes || '' : '');
  const [verdict, setVerdict] = useState(editingGame ? editingGame.verdict || null : null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const gameData = {
      id: editingGame ? editingGame.id : 'game_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      title: title.trim(),
      requestedBy: requestedBy.trim(),
      weight,
      hype: Number(hype),
      status,
      scheduledDate: status === 'scheduled' ? scheduledDate : null,
      sessionNote: status === 'scheduled' ? sessionNote.trim() : '',
      notes: notes.trim(),
      verdict: status === 'played' ? verdict : null,
      createdAt: editingGame ? editingGame.createdAt : new Date().toISOString(),
      playedAt: status === 'played' ? (editingGame?.playedAt || new Date().toISOString()) : null
    };

    onSave(gameData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141414]/75 backdrop-blur-none animate-fadeIn">
      <div 
        className="w-full max-w-md bg-paper-card border-[2.5px] border-[#141414] card-tactile max-h-[90dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Comanda */}
        <div className="flex items-center justify-between p-3.5 bg-risograph-yellow border-b-[2.5px] border-[#141414]">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg uppercase tracking-tight text-[#141414]">
              {editingGame ? 'MODIFICA SCHEDA' : 'NUOVA COMANDA GIOCO'}
            </span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="btn-tactile-sm bg-white p-1 text-[#141414]"
          >
            <X size={18} className="stroke-[3]" />
          </button>
        </div>

        {/* Form Body with Scroll */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          {/* Titolo Gioco */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              TITOLO DEL GIOCO *
            </label>
            <input
              type="text"
              required
              placeholder="Es. Ark Nova, Scout, Dune..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-paper-bg border-2 border-[#141414] font-body font-semibold text-[#141414] focus:outline-none focus:ring-2 focus:ring-risograph-cobalt"
            />
          </div>

          {/* Chi lo propone / Proprietario */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              RICHIESTO DA / PROPRIETARIO
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Es. Marco, Gruppo, Mio, Circolo..."
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full p-2 bg-paper-bg border-2 border-[#141414] font-body text-sm text-[#141414] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setRequestedBy('Mio')}
                className="btn-tactile-sm bg-risograph-lilac px-3 font-mono text-xs font-black"
              >
                MIO
              </button>
            </div>
          </div>

          {/* Complessità (Weight) */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              PESO / COMPLESSITÀ
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'filler', label: 'FILLER', sub: '<30m', bg: 'bg-risograph-lime' },
                { id: 'medio', label: 'MEDIO', sub: '45-90m', bg: 'bg-risograph-yellow' },
                { id: 'cinghiale', label: 'CINGHIALE', sub: '90m+', bg: 'bg-risograph-vermilion text-white' },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setWeight(w.id)}
                  className={`btn-tactile-sm p-2 text-center font-mono text-xs border-2 border-[#141414] flex flex-col items-center justify-center ${
                    weight === w.id 
                      ? `${w.bg} ring-2 ring-[#141414] font-black` 
                      : 'bg-paper-bg text-[#141414] opacity-75'
                  }`}
                >
                  <span className="font-bold uppercase leading-none">{w.label}</span>
                  <span className="text-[10px] opacity-80">{w.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Livello di Hype */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              LIVELLO DI HYPE (VOGLIA DI PROVARLO)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { level: 1, label: 'CURIOSO', flames: 1 },
                { level: 2, label: 'ALTO', flames: 2 },
                { level: 3, label: 'MUST PLAY', flames: 3 },
              ].map((h) => (
                <button
                  key={h.level}
                  type="button"
                  onClick={() => setHype(h.level)}
                  className={`btn-tactile-sm p-2 font-mono text-xs border-2 border-[#141414] flex flex-col items-center justify-center gap-1 ${
                    hype === h.level ? 'bg-risograph-vermilion text-white font-black' : 'bg-paper-bg text-[#141414]'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: h.flames }).map((_, i) => (
                      <Flame key={i} size={14} className={hype === h.level ? 'fill-white stroke-white' : 'fill-risograph-vermilion text-risograph-vermilion'} />
                    ))}
                  </div>
                  <span>{h.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stato del gioco */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              STATO SCHEDA
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'queue', label: 'IN CODA', bg: 'bg-paper-bg' },
                { id: 'scheduled', label: 'PIANIFICATO', bg: 'bg-risograph-yellow' },
                { id: 'played', label: 'PROVATO', bg: 'bg-risograph-lime' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  className={`btn-tactile-sm p-2 font-mono text-xs border-2 border-[#141414] ${
                    status === s.id ? `${s.bg} font-black ring-2 ring-[#141414]` : 'bg-white/50 text-[#141414]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campi condizionali per PIANIFICATO */}
          {status === 'scheduled' && (
            <div className="p-3 bg-risograph-yellow/20 border-2 border-[#141414] space-y-2.5">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                  DATA SESSIONE
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-[#141414] font-mono text-sm text-[#141414]"
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                  DETTAGLI LOGISTICI
                </label>
                <input
                  type="text"
                  placeholder="Es. Da Paolo ore 21:00, portare bustine..."
                  value={sessionNote}
                  onChange={(e) => setSessionNote(e.target.value)}
                  className="w-full p-2 bg-white border-2 border-[#141414] font-body text-sm"
                />
              </div>
            </div>
          )}

          {/* Campi condizionali per PROVATO (Verdetto) */}
          {status === 'played' && (
            <div className="p-3 bg-risograph-lime/20 border-2 border-[#141414] space-y-2">
              <label className="block font-mono text-xs font-black uppercase text-[#141414]">
                TIMBRO VERDETTO
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'top', label: 'TOP / DA AVERE', bg: 'bg-risograph-lime' },
                  { id: 'ok', label: 'OK / CARINO', bg: 'bg-risograph-yellow' },
                  { id: 'passo', label: 'PASSO', bg: 'bg-risograph-vermilion text-white' },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVerdict(v.id)}
                    className={`btn-tactile-sm p-2 font-mono text-xs text-center border-2 border-[#141414] ${
                      verdict === v.id ? `${v.bg} font-black ring-2 ring-[#141414]` : 'bg-white text-[#141414]'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note generali */}
          <div>
            <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
              NOTE / PROMEMORIA REGOLAMENTO
            </label>
            <textarea
              rows={2}
              placeholder="Note di acquisto, espansioni da includere, player count ideale..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 bg-paper-bg border-2 border-[#141414] font-body text-sm text-[#141414] focus:outline-none"
            />
          </div>

          {/* Pulsante Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full btn-tactile bg-risograph-vermilion text-white font-display text-base uppercase py-3 border-2 border-[#141414] tracking-wider"
            >
              {editingGame ? 'SALVA MODIFICHE' : 'REGISTRA IN CODA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
