import React, { useState, useEffect } from 'react';
import { X, Pin } from 'lucide-react';

export default function UniversalAddModal({
  isOpen,
  onClose,
  onSaveGame,
  onSaveEvent,
  listGames = [],
  initialTab = 'game',
  initialDate = '',
  editingGame = null,
}) {
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
    if (!isOpen) return;
    if (editingGame) {
      setActiveTab('game');
      setGameTitle(editingGame.title || '');
      setBggUrl(editingGame.bggUrl || '');
      setRequestedBy(editingGame.requestedBy || '');
      setWeight(editingGame.weight || 'medio');
      setGamePinned(Boolean(editingGame.pinned));
    } else {
      setActiveTab(initialTab);
      setGameTitle('');
      setBggUrl('');
      setRequestedBy('');
      setWeight('medio');
      setGamePinned(false);
      setEventGameTitle('');
      setEventDate(initialDate || new Date().toISOString().split('T')[0]);
      setEventTime('21:00');
      setEventLocation('');
      setEventNotes('');
      setEventPinned(false);
    }
  }, [isOpen, initialTab, initialDate, editingGame]);

  if (!isOpen) return null;

  const handleCreateGame = (e) => {
    e.preventDefault();
    if (!gameTitle.trim()) return;

    onSaveGame({
      id: editingGame
        ? editingGame.id
        : 'game_' + Date.now() + Math.random().toString(36).substr(2, 4),
      title: gameTitle.trim(),
      bggUrl: bggUrl.trim(),
      requestedBy: requestedBy.trim(),
      weight,
      pinned: gamePinned,
      status: editingGame ? editingGame.status : 'list',
      rating: editingGame ? editingGame.rating : 0,
      reviewText: editingGame ? editingGame.reviewText : '',
      createdAt: editingGame ? editingGame.createdAt : new Date().toISOString(),
      playedAt: editingGame ? editingGame.playedAt : null,
    });

    onClose();
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventGameTitle.trim()) return;

    const matched = listGames.find(
      (g) => g.title.toLowerCase() === eventGameTitle.trim().toLowerCase()
    );

    onSaveEvent({
      id: 'evt_' + Date.now() + Math.random().toString(36).substr(2, 4),
      gameId: matched ? matched.id : null,
      gameTitle: eventGameTitle.trim(),
      date: eventDate,
      time: eventTime || '21:00',
      location: eventLocation.trim() || 'Tavolo da gioco',
      pinned: eventPinned,
      notes: eventNotes.trim(),
      createdAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="fixed inset-x-0 bottom-0 max-w-[430px] mx-auto bg-white rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl z-50 max-h-[90dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-[#D1D1D6] mx-auto rounded-full mb-4 shrink-0" />

        {/* Segmented Control iOS */}
        {!editingGame ? (
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <div className="bg-[#F0F0F3] p-1 rounded-xl grid grid-cols-2 flex-1">
              <button
                type="button"
                onClick={() => setActiveTab('game')}
                className={`py-2 rounded-lg text-[13px] font-semibold transition-all ${
                  activeTab === 'game'
                    ? 'bg-white text-[#111111] shadow-sm'
                    : 'text-[#6E6E73]'
                }`}
              >
                Gioco in Lista
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('event')}
                className={`py-2 rounded-lg text-[13px] font-semibold transition-all ${
                  activeTab === 'event'
                    ? 'bg-white text-[#111111] shadow-sm'
                    : 'text-[#6E6E73]'
                }`}
              >
                Evento in Calendario
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F0F0F3] flex items-center justify-center text-[#6E6E73] hover:text-[#111111] shrink-0"
              aria-label="Chiudi"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h3 className="text-[17px] font-bold text-[#111111]">Modifica gioco</h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F0F0F3] flex items-center justify-center text-[#6E6E73] hover:text-[#111111] shrink-0"
              aria-label="Chiudi"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Form Gioco */}
        {activeTab === 'game' && (
          <form onSubmit={handleCreateGame} className="overflow-y-auto space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] mb-1.5">
                Titolo *
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Es. Brass Birmingham, Harmonies..."
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3.5 text-[#111111] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#111111]/15"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] mb-1.5">
                Link BGG (opzionale)
              </label>
              <input
                type="url"
                placeholder="URL scheda BGG o vuoto per ricerca automatica"
                value={bggUrl}
                onChange={(e) => setBggUrl(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3.5 text-[#111111] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#111111]/15"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[12px] font-semibold text-[#6E6E73]">
                  Chi lo propone
                </label>
                <div className="flex gap-1.5">
                  {['Mio', 'Gruppo'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setRequestedBy(chip)}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F0F0F3] text-[#6E6E73] hover:text-[#111111]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="text"
                placeholder="Es. Marco, Elena..."
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3.5 text-[#111111] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#111111]/15"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] mb-1.5">
                Peso
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
                    className={`h-10 rounded-xl text-[13px] font-medium transition-colors ${
                      weight === w.id
                        ? 'bg-[#111111] text-white'
                        : 'bg-[#F5F5F7] text-[#6E6E73] hover:text-[#111111]'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setGamePinned(!gamePinned)}
              className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-2 text-[14px] font-medium text-[#111111]">
                <Pin
                  size={15}
                  className={gamePinned ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#8E8E93]'}
                />
                <span>Metti in Priorità</span>
              </span>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  gamePinned ? 'bg-[#F59E0B] text-white' : 'bg-[#E5E5EA] text-transparent'
                }`}
              >
                ✓
              </span>
            </button>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#111111] text-white text-[15px] font-semibold active:scale-[0.98] transition-transform"
            >
              {editingGame ? 'Salva modifiche' : 'Aggiungi in Lista'}
            </button>
          </form>
        )}

        {/* Form Evento */}
        {activeTab === 'event' && (
          <form onSubmit={handleCreateEvent} className="overflow-y-auto space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] mb-1.5">
                Gioco *
              </label>
              <input
                type="text"
                required
                autoFocus
                list="minimal-list-games"
                placeholder="Scegli o scrivi il titolo..."
                value={eventGameTitle}
                onChange={(e) => setEventGameTitle(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3.5 text-[#111111] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#111111]/15"
              />
              <datalist id="minimal-list-games">
                {listGames.map((g) => (
                  <option key={g.id} value={g.title} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[12px] font-semibold text-[#6E6E73] mb-1.5">
                  Data *
                </label>
                <input
                  type="date"
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3 text-[#111111] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-[#6E6E73] mb-1.5">
                  Ora *
                </label>
                <input
                  type="time"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3 text-[#111111] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] mb-1.5">
                Luogo
              </label>
              <input
                type="text"
                placeholder="Es. Casa Marco, Circolo..."
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3.5 text-[#111111] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#111111]/15"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#6E6E73] mb-1.5">
                Note (opzionale)
              </label>
              <input
                type="text"
                placeholder="Es. Portare playmat..."
                value={eventNotes}
                onChange={(e) => setEventNotes(e.target.value)}
                className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3.5 text-[#111111] placeholder:text-[#AEAEB2] focus:outline-none focus:ring-2 focus:ring-[#111111]/15"
              />
            </div>

            <button
              type="button"
              onClick={() => setEventPinned(!eventPinned)}
              className="w-full h-11 rounded-xl bg-[#F5F5F7] px-3.5 flex items-center justify-between"
            >
              <span className="flex items-center gap-2 text-[14px] font-medium text-[#111111]">
                <Pin
                  size={15}
                  className={eventPinned ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#8E8E93]'}
                />
                <span>Metti in Priorità</span>
              </span>
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  eventPinned ? 'bg-[#F59E0B] text-white' : 'bg-[#E5E5EA] text-transparent'
                }`}
              >
                ✓
              </span>
            </button>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#111111] text-white text-[15px] font-semibold active:scale-[0.98] transition-transform"
            >
              Pinna sul Calendario
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
