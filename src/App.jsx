import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  ListChecks, 
  CalendarClock, 
  BookOpen, 
  Plus, 
  Settings, 
  Dices,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  loadAppData, 
  saveGames, 
  saveEvents, 
  INITIAL_DEMO_GAMES, 
  INITIAL_DEMO_EVENTS 
} from './utils/storage';

import CalendarSection from './components/CalendarSection';
import ListSection from './components/ListSection';
import AgendaSection from './components/AgendaSection';
import DiarySection from './components/DiarySection';

import UniversalAddModal from './components/UniversalAddModal';
import ReviewSheet from './components/ReviewSheet';
import EventDetailSheet from './components/EventDetailSheet';
import GameDetailSheet from './components/GameDetailSheet';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);

  // Active Tab: 'calendar' | 'list' | 'agenda' | 'diary'
  const [activeTab, setActiveTab] = useState('list');

  // Modals & Bottom Sheets
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalTab, setAddModalTab] = useState('game');
  const [addModalDate, setAddModalDate] = useState('');

  const [selectedGameForDetail, setSelectedGameForDetail] = useState(null);
  const [selectedGameForReview, setSelectedGameForReview] = useState(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast per annulla spostamento nel Diario
  const [toastMessage, setToastMessage] = useState(null);
  const [lastCheckedGameId, setLastCheckedGameId] = useState(null);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    const { games: g, events: e } = loadAppData();
    setGames(g);
    setEvents(e);
  }, []);

  const updateGames = (newGames) => {
    setGames(newGames);
    saveGames(newGames);
  };

  const updateEvents = (newEvents) => {
    setEvents(newEvents);
    saveEvents(newEvents);
  };

  const handleToggleCheck = (game) => {
    const updated = games.map(g => {
      if (g.id === game.id) {
        return {
          ...g,
          status: 'played',
          playedAt: new Date().toISOString()
        };
      }
      return g;
    });
    updateGames(updated);
    confetti({ particleCount: 40, spread: 45, origin: { y: 0.7 } });

    setLastCheckedGameId(game.id);
    setToastMessage(`"${game.title}" spostato nel Diario`);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      setLastCheckedGameId(null);
    }, 4000);
  };

  const handleUndoCheck = () => {
    if (!lastCheckedGameId) return;
    const updated = games.map(g => {
      if (g.id === lastCheckedGameId) {
        return {
          ...g,
          status: 'list',
          playedAt: null
        };
      }
      return g;
    });
    updateGames(updated);
    setToastMessage(null);
    setLastCheckedGameId(null);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  };

  const handleTogglePinGame = (gameId) => {
    const updated = games.map(g => g.id === gameId ? { ...g, pinned: !g.pinned } : g);
    updateGames(updated);
  };

  const handleTogglePinEvent = (eventId) => {
    const updated = events.map(e => e.id === eventId ? { ...e, pinned: !e.pinned } : e);
    updateEvents(updated);
  };

  const handleRestoreToList = (gameId) => {
    const updated = games.map(g => g.id === gameId ? { ...g, status: 'list', playedAt: null } : g);
    updateGames(updated);
  };

  const handleSaveGame = (newGame) => {
    const exists = games.some(g => g.id === newGame.id);
    let updated;
    if (exists) {
      updated = games.map(g => g.id === newGame.id ? newGame : g);
    } else {
      updated = [newGame, ...games];
      confetti({ particleCount: 35, spread: 40, origin: { y: 0.8 } });
    }
    updateGames(updated);
  };

  const handleSaveEvent = (newEvent) => {
    const exists = events.some(e => e.id === newEvent.id);
    let updated;
    if (exists) {
      updated = events.map(e => e.id === newEvent.id ? newEvent : e);
    } else {
      updated = [newEvent, ...events];
      confetti({ particleCount: 35, spread: 40, origin: { y: 0.8 } });
    }
    updateEvents(updated);
  };

  const handleDeleteGame = (gameId) => {
    const updated = games.filter(g => g.id !== gameId);
    updateGames(updated);
  };

  const handleDeleteEvent = (eventId) => {
    const updated = events.filter(e => e.id !== eventId);
    updateEvents(updated);
  };

  const handleRandomPick = () => {
    const listGames = games.filter(g => g.status === 'list');
    if (listGames.length === 0) {
      alert('Nessun gioco in lista da provare!');
      return;
    }
    const chosen = listGames[Math.floor(Math.random() * listGames.length)];
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.5 } });
    setSelectedGameForDetail(chosen);
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#F6F4EF] text-[#1C1917] overflow-x-hidden pb-28">
      {/* Container Centrale con Spaziatura Pulita */}
      <div className="max-w-md mx-auto px-4">
        {/* Header Superiore Minimalista (56px, sfondo integrato) */}
        <header className="h-14 flex items-center justify-between py-2 border-b border-[#E4DFD3]/60 mb-2">
          {/* Logo Editoriale a sinistra */}
          <div 
            onClick={() => setActiveTab('list')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-7 h-7 rounded-lg bg-[#E7F0EC] border border-[#1B4D3E]/20 flex items-center justify-center text-[#1B4D3E]">
              <Sparkles size={15} />
            </div>
            <h1 className="font-serif text-[21px] font-bold tracking-tight text-[#1B4D3E]">
              PlayCheck
            </h1>
          </div>

          {/* 2 Bottoni Icona Circolari Morbidi 36x36px */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRandomPick}
              className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E4DFD3] text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE4] flex items-center justify-center shadow-sm transition-colors"
              title="Pesca a caso un gioco"
              aria-label="Pesca a caso"
            >
              <Dices size={17} />
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="w-9 h-9 rounded-full bg-[#FFFFFF] border border-[#E4DFD3] text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFECE4] flex items-center justify-center shadow-sm transition-colors"
              title="Impostazioni & Dati"
              aria-label="Impostazioni"
            >
              <Settings size={17} />
            </button>
          </div>
        </header>

        {/* Contenuto Viste */}
        <main>
          {activeTab === 'calendar' && (
            <CalendarSection
              events={events}
              onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
              onPinForDate={(dateStr) => {
                setAddModalTab('event');
                setAddModalDate(dateStr);
                setIsAddModalOpen(true);
              }}
            />
          )}

          {activeTab === 'list' && (
            <ListSection
              games={games}
              onToggleCheck={handleToggleCheck}
              onTogglePin={handleTogglePinGame}
              onSelectGame={(g) => setSelectedGameForDetail(g)}
              onOpenAddModal={() => {
                setAddModalTab('game');
                setAddModalDate('');
                setIsAddModalOpen(true);
              }}
            />
          )}

          {activeTab === 'agenda' && (
            <AgendaSection
              events={events}
              onTogglePinEvent={handleTogglePinEvent}
              onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
              onOpenAddEventModal={() => {
                setAddModalTab('event');
                setAddModalDate('');
                setIsAddModalOpen(true);
              }}
            />
          )}

          {activeTab === 'diary' && (
            <DiarySection
              games={games}
              onOpenReviewSheet={(g) => setSelectedGameForReview(g)}
              onRestoreToList={handleRestoreToList}
            />
          )}
        </main>
      </div>

      {/* Toast Notifica Spostamento con Annulla */}
      {toastMessage && (
        <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto z-50 bg-[#1C1917] text-[#FFFFFF] rounded-2xl shadow-lg p-3.5 flex items-center justify-between text-xs animate-fadeIn">
          <span className="truncate pr-2 font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={handleUndoCheck}
            className="px-2.5 py-1 rounded-lg bg-[#EFECE4] text-[#1C1917] font-semibold text-[11px] hover:bg-white shrink-0 transition-colors"
          >
            Annulla
          </button>
        </div>
      )}

      {/* Bottom Bar a 5 Pulsanti Elegante e Ariosa (68px, glassmorphism leggero) */}
      <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#E4DFD3] pb-[env(safe-area-inset-bottom)] select-none">
        <div className="grid grid-cols-5 items-center h-[68px] px-1 text-center">
          {/* 1. Calendario */}
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'calendar'
                ? 'text-[#1B4D3E] font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'calendar' ? 'bg-[#E7F0EC]' : ''}`}>
              <CalendarIcon size={20} />
            </div>
            <span className="text-[11px] font-medium tracking-tight mt-0.5">
              Calendario
            </span>
          </button>

          {/* 2. Lista */}
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'list'
                ? 'text-[#1B4D3E] font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'list' ? 'bg-[#E7F0EC]' : ''}`}>
              <ListChecks size={20} />
            </div>
            <span className="text-[11px] font-medium tracking-tight mt-0.5">
              Lista
            </span>
          </button>

          {/* 3. Tasto Centrale + (Colonna 3, Cerchio Elegante 48x48px rialzato) */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setAddModalTab(activeTab === 'calendar' || activeTab === 'agenda' ? 'event' : 'game');
                setAddModalDate('');
                setIsAddModalOpen(true);
              }}
              className="w-12 h-12 -mt-4 rounded-full bg-[#1B4D3E] hover:bg-[#143A2F] text-[#FFFFFF] flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
              aria-label="Aggiungi rapido"
            >
              <Plus size={24} className="stroke-[2.5]" />
            </button>
          </div>

          {/* 4. Agenda */}
          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'agenda'
                ? 'text-[#1B4D3E] font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'agenda' ? 'bg-[#E7F0EC]' : ''}`}>
              <CalendarClock size={20} />
            </div>
            <span className="text-[11px] font-medium tracking-tight mt-0.5">
              Agenda
            </span>
          </button>

          {/* 5. Diario */}
          <button
            type="button"
            onClick={() => setActiveTab('diary')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'diary'
                ? 'text-[#1B4D3E] font-semibold'
                : 'text-[#78716C] hover:text-[#1C1917]'
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-colors ${activeTab === 'diary' ? 'bg-[#E7F0EC]' : ''}`}>
              <BookOpen size={20} />
            </div>
            <span className="text-[11px] font-medium tracking-tight mt-0.5">
              Diario
            </span>
          </button>
        </div>
      </nav>

      {/* MODALI & BOTTOM SHEETS */}
      <UniversalAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSaveGame={handleSaveGame}
        onSaveEvent={handleSaveEvent}
        listGames={games.filter(g => g.status === 'list')}
        initialTab={addModalTab}
        initialDate={addModalDate}
      />

      <GameDetailSheet
        isOpen={Boolean(selectedGameForDetail)}
        game={selectedGameForDetail}
        onClose={() => setSelectedGameForDetail(null)}
        onToggleCheck={handleToggleCheck}
        onTogglePin={handleTogglePinGame}
        onScheduleGame={(g) => {
          setAddModalTab('event');
          setAddModalDate('');
          setIsAddModalOpen(true);
        }}
        onDeleteGame={handleDeleteGame}
      />

      <ReviewSheet
        isOpen={Boolean(selectedGameForReview)}
        game={selectedGameForReview}
        onClose={() => setSelectedGameForReview(null)}
        onSaveReview={(updated) => handleSaveGame(updated)}
        onRestoreToList={handleRestoreToList}
      />

      <EventDetailSheet
        isOpen={Boolean(selectedEventForDetail)}
        event={selectedEventForDetail}
        onClose={() => setSelectedEventForDetail(null)}
        onTogglePin={handleTogglePinEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        games={games}
        events={events}
        onRestoreDemo={() => {
          updateGames(INITIAL_DEMO_GAMES);
          updateEvents(INITIAL_DEMO_EVENTS);
        }}
        onClearAll={() => {
          updateGames([]);
          updateEvents([]);
        }}
        onImportData={({ games: g, events: e }) => {
          if (g) updateGames(g);
          if (e) updateEvents(e);
        }}
      />
    </div>
  );
}
