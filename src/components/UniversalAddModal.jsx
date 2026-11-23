import React, { useState, useEffect } from 'react';
import { X, ListChecks, CalendarClock, Pin } from 'lucide-react';

export default function UniversalAddModal({ 
  isOpen, 
  onClose, 
  onSaveGame, 
  onSaveEvent, 
  listGames = [],
  initialTab = 'game', // 'game' | 'event'
  initialDate = ''
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab);

  // Form Gioco in Lista
  const [gameTitle, setGameTitle] = useState('');
  const [bggUrl, setBggUrl] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [weight, setWeight] = useState('medio');
  const [gamePinned, setGamePinned] = useState(false);

  // Form Evento sul Calendario
  const [eventGameTitle, setEventGameTitle] = useState('');
  const [eventDate, setEventDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  const [eventTime, setEventTime] = useState('21:00');
  const [eventLocation, setEventLocation] = useState('');
  const [eventNotes, setEventNotes] = useState('');
  const [eventPinned, setEventPinned] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
    if (initialDate) setEventDate(initialDate);
  }, [initialTab, initialDate, isOpen]);

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (!gameTitle.trim()) return;

    onSaveGame({
      id: 'game_' + Date.now() + Math.random().toString(36).substr(2, 4),
      title: gameTitle.trim(),
      bggUrl: bggUrl.trim(),
      requestedBy: requestedBy.trim(),
      weight,
      pinned: gamePinned,
      status: 'list',
      rating: 0,
      reviewText: '',
      createdAt: new Date().toISOString(),
      playedAt: null
    });

    onClose();
    setGameTitle('');
    setBggUrl('');
    setRequestedBy('');
    setGamePinned(false);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventGameTitle.trim()) return;

    // Se esiste un gioco in lista con lo stesso titolo, colleghiamolo
    const matched = listGames.find(g => g.title.toLowerCase() === eventGameTitle.trim().toLowerCase());

    onSaveEvent({
      id: 'evt_' + Date.now() + Math.random().toString(36).substr(2, 4),
      gameId: matched ? matched.id : null,
      gameTitle: eventGameTitle.trim(),
      date: eventDate,
      time: eventTime || '21:00',
      location: eventLocation.trim() || 'Tavolo da gioco',
      pinned: eventPinned,
      notes: eventNotes.trim(),
      createdAt: new Date().toISOString()
    });

    onClose();
    setEventGameTitle('');
    setEventLocation('');
    setEventNotes('');
    setEventPinned(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141414]/65 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF8] border-t-2 sm:border-2 border-[#141414] shadow-brutal max-h-[92dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="w-12 h-1 bg-[#141414]/30 mx-auto rounded-full mt-2 mb-1" />

        {/* Header con Switch tra i 2 Tab Grandi */}
        <div className="p-3 border-b-2 border-[#141414] flex items-center justify-between gap-2">
          <div className="grid grid-cols-2 gap-1.5 flex-1">
            <button
              type="button"
              onClick={() => setActiveTab('game')}
              className={`py-2 px-2 text-center font-display text-xs font-bold uppercase border-2 border-[#141414] transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'game'
                  ? 'bg-[#141414] text-white shadow-brutal-sm font-black'
                  : 'bg-[#F4EFE6] text-[#141414]'
              }`}
            >
              <ListChecks size={15} />
              <span>+ GIOCO IN LISTA</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('event')}
              className={`py-2 px-2 text-center font-display text-xs font-bold uppercase border-2 border-[#141414] transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'event'
                  ? 'bg-[#FFE600] text-[#141414] shadow-brutal-sm font-black'
                  : 'bg-[#F4EFE6] text-[#141414]'
              }`}
            >
              <CalendarClock size={15} />
              <span>+ PINNA EVENTO</span>
            </button>
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

        {/* TAB 1: FORM GIOCO IN LISTA */}
        {activeTab === 'game' && (
          <form onSubmit={handleCreateGame} className="p-4 overflow-y-auto space-y-4 pb-6">
            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                TITOLO DEL GIOCO *
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Es. Brass Birmingham, Harmonies, Scout..."
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                className="w-full h-11 px-3 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                LINK BGG (OPZIONALE)
              </label>
              <input
                type="url"
                placeholder="Incolla URL scheda BGG (o lascialo vuoto per ricerca automatica)"
                value={bggUrl}
                onChange={(e) => setBggUrl(e.target.value)}
                className="w-full h-11 px-3 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none placeholder:text-xs"
              />
              <span className="text-[10px] font-mono text-[#141414]/60 mt-0.5 block">
                Se vuoto, PlayCheck creerà automaticamente il link di ricerca diretta BGG.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-mono text-xs font-black uppercase text-[#141414]">
                  CHI LO PROPONE
                </label>
                <div className="flex gap-1">
                  {['Mio', 'Gruppo'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRequestedBy(chip)}
                      className="font-mono text-[10px] font-bold px-2 py-0.5 border border-[#141414] bg-[#F4EFE6]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Es. Marco, Elena, Circolo..."
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full h-11 px-3 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
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
                    className={`btn-tactile-sm py-2 font-mono text-xs font-bold border-2 border-[#141414] text-center ${
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

            {/* Toggle Priorità Pin */}
            <div 
              onClick={() => setGamePinned(!gamePinned)}
              className="p-3 bg-[#FFE600]/30 border-2 border-[#141414] flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Pin size={16} className={gamePinned ? "fill-[#FF4522] text-[#FF4522]" : "text-[#141414]"} />
                <span className="font-mono text-xs font-black uppercase text-[#141414]">
                  METTI SUBITO IN PRIORITÀ IN ALTO
                </span>
              </div>
              <div className={`w-5 h-5 border-2 border-[#141414] flex items-center justify-center ${gamePinned ? 'bg-[#FF4522] text-white' : 'bg-white'}`}>
                {gamePinned && '✓'}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-tactile bg-[#FF4522] text-white font-display text-base font-bold uppercase py-3.5 tracking-wider"
            >
              SALVA IN LISTA
            </button>
          </form>
        )}

        {/* TAB 2: FORM PINNA EVENTO SUL CALENDARIO */}
        {activeTab === 'event' && (
          <form onSubmit={handleCreateEvent} className="p-4 overflow-y-auto space-y-4 pb-6">
            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                GIOCO DELLA SESSIONE *
              </label>
              <input
                type="text"
                required
                autoFocus
                list="list-games-suggestions"
                placeholder="Scrivi o scegli un gioco..."
                value={eventGameTitle}
                onChange={(e) => setEventGameTitle(e.target.value)}
                className="w-full h-11 px-3 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
              />
              <datalist id="list-games-suggestions">
                {listGames.map(g => (
                  <option key={g.id} value={g.title} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                  DATA *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full h-11 px-2 bg-[#F4EFE6] border-2 border-[#141414] font-mono text-base text-[#141414]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                  ORA *
                </label>
                <input
                  type="time"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full h-11 px-2 bg-[#F4EFE6] border-2 border-[#141414] font-mono text-base text-[#141414]"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                LUOGO / CIRCOLO / CASA
              </label>
              <input
                type="text"
                placeholder="Es. Casa Marco, Circolo Brecht, Pub..."
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full h-11 px-3 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-black uppercase text-[#141414] mb-1">
                NOTE / ORGANIZZAZIONE (OPZIONALE)
              </label>
              <input
                type="text"
                placeholder="Es. Portare playmat, spiegazione ore 20:45..."
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                className="w-full h-11 px-3 bg-[#F4EFE6] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
              />
            </div>

            {/* Toggle Priorità in Agenda */}
            <div 
              onClick={() => setEventPinned(!eventPinned)}
              className="p-3 bg-[#FFE600]/30 border-2 border-[#141414] flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Pin size={16} className={eventPinned ? "fill-[#FF4522] text-[#FF4522]" : "text-[#141414]"} />
                <span className="font-mono text-xs font-black uppercase text-[#141414]">
                  METTI IN EVIDENZA IN AGENDA
                </span>
              </div>
              <div className={`w-5 h-5 border-2 border-[#141414] flex items-center justify-center ${eventPinned ? 'bg-[#FF4522] text-white' : 'bg-white'}`}>
                {eventPinned && '✓'}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-tactile bg-[#FFE600] text-[#141414] font-display text-base font-bold uppercase py-3.5 tracking-wider"
            >
              PINNA SUL CALENDARIO
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
