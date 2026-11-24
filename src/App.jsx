import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  ListChecks,
  CalendarClock,
  BookOpen,
  Plus,
  Settings,
  Dices,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  loadAppData,
  saveGames,
  saveEvents,
  INITIAL_DEMO_GAMES,
  INITIAL_DEMO_EVENTS,
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

const VIEW_TITLES = {
  calendar: 'Calendario',
  list: 'Lista',
  agenda: 'Agenda',
  diary: 'Diario',
};

export default function App() {
  const [games, setGames] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('list');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalTab, setAddModalTab] = useState('game');
  const [addModalDate, setAddModalDate] = useState('');
  const [editingGame, setEditingGame] = useState(null);

  const [selectedGameForDetail, setSelectedGameForDetail] = useState(null);
  const [selectedGameForReview, setSelectedGameForReview] = useState(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    const updated = games.map((g) =>
      g.id === game.id
        ? { ...g, status: 'played', playedAt: new Date().toISOString() }
        : g
    );
    updateGames(updated);
    confetti({ particleCount: 35, spread: 45, origin: { y: 0.7 } });

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
    const updated = games.map((g) =>
      g.id === lastCheckedGameId ? { ...g, status: 'list', playedAt: null } : g
    );
    updateGames(updated);
    setToastMessage(null);
    setLastCheckedGameId(null);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  };

  const handleTogglePinGame = (gameId) => {
    updateGames(games.map((g) => (g.id === gameId ? { ...g, pinned: !g.pinned } : g)));
  };

  const handleTogglePinEvent = (eventId) => {
    updateEvents(events.map((e) => (e.id === eventId ? { ...e, pinned: !e.pinned } : e)));
  };

  const handleRestoreToList = (gameId) => {
    updateGames(
      games.map((g) => (g.id === gameId ? { ...g, status: 'list', playedAt: null } : g))
    );
  };

  const handleSaveGame = (newGame) => {
    const exists = games.some((g) => g.id === newGame.id);
    if (exists) {
      updateGames(games.map((g) => (g.id === newGame.id ? newGame : g)));
    } else {
      updateGames([newGame, ...games]);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
    }
  };

  const handleSaveEvent = (newEvent) => {
    const exists = events.some((e) => e.id === newEvent.id);
    if (exists) {
      updateEvents(events.map((e) => (e.id === newEvent.id ? newEvent : e)));
    } else {
      updateEvents([newEvent, ...events]);
      confetti({ particleCount: 30, spread: 40, origin: { y: 0.8 } });
    }
  };

  const handleDeleteGame = (gameId) => {
    updateGames(games.filter((g) => g.id !== gameId));
  };

  const handleDeleteEvent = (eventId) => {
    updateEvents(events.filter((e) => e.id !== eventId));
  };

  const handleRandomPick = () => {
    const listGames = games.filter((g) => g.status === 'list');
    if (listGames.length === 0) {
      alert('Nessun gioco in lista da provare.');
      return;
    }
    const chosen = listGames[Math.floor(Math.random() * listGames.length)];
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.5 } });
    setSelectedGameForDetail(chosen);
  };

  return (
    <div className="min-h-[100dvh] w-full max-w-[430px] mx-auto bg-[#F5F5F7] flex flex-col relative">
      {/* Sticky Header 56px */}
      <header className="sticky top-0 z-30 h-14 px-4 flex items-center justify-between bg-[#F5F5F7]/85 backdrop-blur-xl">
        <h1 className="text-[22px] font-bold tracking-[-0.02em] text-[#111111]">
          {VIEW_TITLES[activeTab] || 'PlayCheck'}
        </h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRandomPick}
            className="w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
            aria-label="Pesca a caso"
          >
            <Dices size={17} />
          </button>
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.04)] active:scale-95 transition-transform"
            aria-label="Impostazioni e Backup"
          >
            <Settings size={17} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-28">
        {activeTab === 'calendar' && (
          <CalendarSection
            events={events}
            onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
            onPinForDate={(dateStr) => {
              setEditingGame(null);
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
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaSection
            events={events}
            onTogglePinEvent={handleTogglePinEvent}
            onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
          />
        )}

        {activeTab === 'diary' && (
          <DiarySection
            games={games}
            onOpenReviewSheet={(g) => setSelectedGameForReview(g)}
          />
        )}
      </main>

      {/* Toast Annulla */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[398px] z-50 bg-[#111111] text-white rounded-2xl shadow-lg px-4 py-3 flex items-center justify-between gap-3">
          <span className="text-[13px] font-medium truncate">{toastMessage}</span>
          <button
            type="button"
            onClick={handleUndoCheck}
            className="text-[13px] font-semibold text-[#F59E0B] shrink-0"
          >
            Annulla
          </button>
        </div>
      )}

      {/* Bottom Navigation Bar (5 colonne simmetriche) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 bg-white/[0.92] backdrop-blur-xl border-t border-black/[0.08] pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 items-center h-[64px] px-1">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'calendar' ? 'text-[#111111] font-semibold' : 'text-[#8E8E93] font-medium'
            }`}
          >
            <Calendar size={20} />
            <span className="text-[10px]">Calendario</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'list' ? 'text-[#111111] font-semibold' : 'text-[#8E8E93] font-medium'
            }`}
          >
            <ListChecks size={20} />
            <span className="text-[10px]">Lista</span>
          </button>

          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setEditingGame(null);
                setAddModalTab(
                  activeTab === 'calendar' || activeTab === 'agenda' ? 'event' : 'game'
                );
                setAddModalDate('');
                setIsAddModalOpen(true);
              }}
              className="w-11 h-11 rounded-full bg-[#111111] text-white flex items-center justify-center mx-auto shadow-md active:scale-95 transition-transform"
              aria-label="Aggiungi"
            >
              <Plus size={22} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'agenda' ? 'text-[#111111] font-semibold' : 'text-[#8E8E93] font-medium'
            }`}
          >
            <CalendarClock size={20} />
            <span className="text-[10px]">Agenda</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diary')}
            className={`flex flex-col items-center justify-center gap-1 ${
              activeTab === 'diary' ? 'text-[#111111] font-semibold' : 'text-[#8E8E93] font-medium'
            }`}
          >
            <BookOpen size={20} />
            <span className="text-[10px]">Diario</span>
          </button>
        </div>
      </nav>

      {/* Bottom Sheets & Modali */}
      <UniversalAddModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingGame(null);
        }}
        onSaveGame={handleSaveGame}
        onSaveEvent={handleSaveEvent}
        listGames={games.filter((g) => g.status === 'list')}
        initialTab={addModalTab}
        initialDate={addModalDate}
        editingGame={editingGame}
      />

      <GameDetailSheet
        isOpen={Boolean(selectedGameForDetail)}
        game={selectedGameForDetail}
        onClose={() => setSelectedGameForDetail(null)}
        onToggleCheck={handleToggleCheck}
        onTogglePin={handleTogglePinGame}
        onScheduleGame={() => {
          setEditingGame(null);
          setAddModalTab('event');
          setAddModalDate('');
          setIsAddModalOpen(true);
        }}
        onEditGame={(g) => {
          setEditingGame(g);
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
