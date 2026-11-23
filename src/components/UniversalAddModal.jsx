import React, { useState, useEffect } from 'react';
import { X, ListChecks, CalendarClock, Pin } from 'lucide-react';

export default function UniversalAddModal({ 
  isOpen, 
  onClose, 
  onSaveGame, 
  onSaveEvent, 
  listGames = [],
  initialTab = 'game',
  initialDate = ''
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab);

  const [gameTitle, setGameTitle] = useState('');
  const [bggUrl, setBggUrl] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [weight, setWeight] = useState('medio');
  const [gamePinned, setGamePinned] = useState(false);

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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 backdrop-blur-[2px] animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFFFF] rounded-t-3xl shadow-[0_-8px_24px_rgba(28,25,23,0.08)] max-h-[92dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Maniglia grigia morbida */}
        <div className="w-10 h-1 bg-[#D6D1C4] mx-auto rounded-full mt-3 mb-1" />

        {/* Header con Switch fra i 2 Tab */}
        <div className="p-4 border-b border-[#E4DFD3] flex items-center justify-between gap-3">
          <div className="grid grid-cols-2 gap-2 flex-1 bg-[#EFECE4] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('game')}
              className={`py-2 px-2 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'game'
                  ? 'bg-[#FFFFFF] text-[#1B4D3E] shadow-sm font-bold'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <ListChecks size={15} />
              <span>Gioco in lista</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('event')}
              className={`py-2 px-2 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'event'
                  ? 'bg-[#FFFFFF] text-[#1B4D3E] shadow-sm font-bold'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
            >
              <CalendarClock size={15} />
              <span>Pinna evento</span>
            </button>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:bg-[#EFECE4] hover:text-[#1C1917]"
            aria-label="Chiudi"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Gioco */}
        {activeTab === 'game' && (
          <form onSubmit={handleCreateGame} className="p-4 overflow-y-auto space-y-4 pb-6">
            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">
                Titolo del gioco *
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Es. Brass Birmingham, Harmonies, Scout..."
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl text-base text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">
                Link BGG (opzionale)
              </label>
              <input
                type="url"
                placeholder="Incolla URL scheda BGG (o lascialo vuoto per ricerca automatica)"
                value={bggUrl}
                onChange={(e) => setBggUrl(e.target.value)}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl text-base text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#1B4D3E] placeholder:text-xs"
              />
              <span className="text-[11px] text-[#78716C] mt-1 block">
                Se vuoto, PlayCheck creerà automaticamente il link di ricerca diretta.
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-[#57534E]">
                  Chi lo propone
                </label>
                <div className="flex gap-1">
                  {['Mio', 'Gruppo'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRequestedBy(chip)}
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EFECE4] text-[#78716C] hover:text-[#1C1917]"
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
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl text-base text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">
                Peso / Complessità
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'filler', label: 'Filler' },
                  { id: 'medio', label: 'Medio' },
                  { id: 'cinghiale', label: 'Cinghiale' },
                ].map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setWeight(w.id)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all text-center ${
                      weight === w.id
                        ? 'bg-[#1B4D3E] text-white border-[#1B4D3E] font-semibold'
                        : 'bg-[#FFFFFF] border-[#E4DFD3] text-[#78716C] hover:text-[#1C1917]'
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
              className="p-3 bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-xl flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Pin size={16} className={gamePinned ? "fill-[#D97706] text-[#D97706]" : "text-[#78716C]"} />
                <span className="text-xs font-medium text-[#92400E]">
                  Metti subito in priorità in alto
                </span>
              </div>
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${gamePinned ? 'bg-[#D97706] border-[#D97706] text-white font-bold' : 'border-[#DDD7C9] bg-white'}`}>
                {gamePinned && '✓'}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#1B4D3E] hover:bg-[#143A2F] text-white text-[15px] font-semibold active:scale-[0.98] transition-all shadow-sm"
            >
              Salva in lista
            </button>
          </form>
        )}

        {/* Tab Evento */}
        {activeTab === 'event' && (
          <form onSubmit={handleCreateEvent} className="p-4 overflow-y-auto space-y-4 pb-6">
            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">
                Gioco della sessione *
              </label>
              <input
                type="text"
                required
                autoFocus
                list="list-games-editorial"
                placeholder="Scrivi o scegli un gioco..."
                value={eventGameTitle}
                onChange={(e) => setEventGameTitle(e.target.value)}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl text-base text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#1B4D3E]"
              />
              <datalist id="list-games-editorial">
                {listGames.map(g => (
                  <option key={g.id} value={g.title} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full h-11 px-2.5 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl font-mono text-base text-[#1C1917]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#57534E] mb-1">
                  Ora *
                </label>
                <input
                  type="time"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full h-11 px-2.5 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl font-mono text-base text-[#1C1917]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">
                Luogo / Circolo / Casa
              </label>
              <input
                type="text"
                placeholder="Es. Casa Marco, Circolo Brecht, Pub..."
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl text-base text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#1B4D3E]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#57534E] mb-1">
                Note organizzative (opzionale)
              </label>
              <input
                type="text"
                placeholder="Es. Portare playmat, spiegazione ore 20:45..."
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                className="w-full h-11 px-3 bg-[#FFFFFF] border border-[#DDD7C9] rounded-xl text-base text-[#1C1917] focus:outline-none focus:ring-1.5 focus:ring-[#1B4D3E]"
              />
            </div>

            {/* Toggle Priorità in Agenda */}
            <div 
              onClick={() => setEventPinned(!eventPinned)}
              className="p-3 bg-[#FEF3C7]/60 border border-[#FDE68A] rounded-xl flex items-center justify-between cursor-pointer select-none"
            >
              <div className="flex items-center gap-2">
                <Pin size={16} className={eventPinned ? "fill-[#D97706] text-[#D97706]" : "text-[#78716C]"} />
                <span className="text-xs font-medium text-[#92400E]">
                  Metti in evidenza in agenda
                </span>
              </div>
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${eventPinned ? 'bg-[#D97706] border-[#D97706] text-white font-bold' : 'border-[#DDD7C9] bg-white'}`}>
                {eventPinned && '✓'}
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#1B4D3E] hover:bg-[#143A2F] text-white text-[15px] font-semibold active:scale-[0.98] transition-all shadow-sm"
            >
              Pinna sul calendario
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
