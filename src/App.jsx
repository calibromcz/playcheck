import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  ListChecks, 
  CalendarClock, 
  BookOpen, 
  Plus, 
  Settings, 
  Dices,
  CheckSquare
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
  const [addModalTab, setAddModalTab] = useState('game'); // 'game' | 'event'
  const [addModalDate, setAddModalDate] = useState('');

  const [selectedGameForDetail, setSelectedGameForDetail] = useState(null);
  const [selectedGameForReview, setSelectedGameForReview] = useState(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast per annulla spostamento nel Diario
  const [toastMessage, setToastMessage] = useState(null);
  const [lastCheckedGameId, setLastCheckedGameId] = useState(null);
  const toastTimeoutRef = useRef(null);

  // Caricamento Iniziale
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

  // Checkbox toggle: spunta e sposta nel Diario
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
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });

    // Mostra toast con Annulla per 4 secondi
    setLastCheckedGameId(game.id);
    setToastMessage(`"${game.title}" spostato nel Diario!`);
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

  // Toggle Pin Gioco
  const handleTogglePinGame = (gameId) => {
    const updated = games.map(g => g.id === gameId ? { ...g, pinned: !g.pinned } : g);
    updateGames(updated);
  };

  // Toggle Pin Evento
  const handleTogglePinEvent = (eventId) => {
    const updated = events.map(e => e.id === eventId ? { ...e, pinned: !e.pinned } : e);
    updateEvents(updated);
  };

  // Rimetti gioco dal diario in lista
  const handleRestoreToList = (gameId) => {
    const updated = games.map(g => g.id === gameId ? { ...g, status: 'list', playedAt: null } : g);
    updateGames(updated);
  };

  // Salva Gioco
  const handleSaveGame = (newGame) => {
    const exists = games.some(g => g.id === newGame.id);
    let updated;
    if (exists) {
      updated = games.map(g => g.id === newGame.id ? newGame : g);
    } else {
      updated = [newGame, ...games];
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.8 } });
    }
    updateGames(updated);
  };

  // Salva Evento
  const handleSaveEvent = (newEvent) => {
    const exists = events.some(e => e.id === newEvent.id);
    let updated;
    if (exists) {
      updated = events.map(e => e.id === newEvent.id ? newEvent : e);
    } else {
      updated = [newEvent, ...events];
      confetti({ particleCount: 45, spread: 45, origin: { y: 0.8 } });
    }
    updateEvents(updated);
  };

  // Elimina Gioco
  const handleDeleteGame = (gameId) => {
    const updated = games.filter(g => g.id !== gameId);
    updateGames(updated);
  };

  // Elimina Evento
  const handleDeleteEvent = (eventId) => {
    const updated = events.filter(e => e.id !== eventId);
    updateEvents(updated);
  };

  // Pesca a caso tra i giochi in lista
  const handleRandomPick = () => {
    const listGames = games.filter(g => g.status === 'list');
    if (listGames.length === 0) {
      alert('Nessun gioco in lista da provare!');
      return;
    }
    const chosen = listGames[Math.floor(Math.random() * listGames.length)];
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    setSelectedGameForDetail(chosen);
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#F4EFE6] text-[#141414] overflow-x-hidden pb-28">
      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-50 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* HEADER COMPATTO (Logo a sinistra, Pesca & Settings a destra) */}
      <div className="max-w-md mx-auto px-4">
        <header className="h-14 flex items-center justify-between border-b-2 border-[#141414] py-2 mb-2">
          <div 
            onClick={() => setActiveTab('list')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 bg-[#FFE600] border-2 border-[#141414] flex items-center justify-center shadow-brutal-sm">
              <CheckSquare size={18} className="stroke-[3] text-[#141414]" />
            </div>
            <h1 className="font-display text-xl font-extrabold tracking-tight uppercase text-[#141414]">
              PLAYCHECK
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRandomPick}
              className="w-[38px] h-[38px] btn-tactile bg-[#FFFDF8] hover:bg-[#FFE600] flex items-center justify-center p-0"
              title="Pesca a caso un gioco dalla lista"
              aria-label="Pesca a caso"
            >
              <Dices size={18} className="stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="w-[38px] h-[38px] btn-tactile bg-[#FFFDF8] hover:bg-[#F4EFE6] flex items-center justify-center p-0"
              title="Impostazioni & Backup"
              aria-label="Impostazioni"
            >
              <Settings size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </header>

        {/* CONTENUTO VISTE */}
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

      {/* TOAST TEMPORANEO ANNULLA SPOSTAMENTO (4 SECONDI) */}
      {toastMessage && (
        <div className="fixed bottom-24 inset-x-4 max-w-sm mx-auto z-50 bg-[#141414] text-white border-2 border-[#141414] shadow-brutal p-3 flex items-center justify-between animate-fadeIn font-mono text-xs">
          <span className="truncate pr-2">{toastMessage}</span>
          <button
            type="button"
            onClick={handleUndoCheck}
            className="px-2.5 py-1 bg-[#FFE600] text-[#141414] font-black uppercase shrink-0"
          >
            ANNULLA
          </button>
        </div>
      )}

      {/* BARRA DI NAVIGAZIONE INFERIORE RIGOROSA A 5 PULSANTI (grid-cols-5, h-[72px]) */}
      <nav className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-40 bg-[#FFFDF8] border-t-[2.5px] border-[#141414] pb-[env(safe-area-inset-bottom)] select-none">
        <div className="grid grid-cols-5 items-center h-[72px] px-1 text-center">
          {/* 1. Calendario */}
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'calendar'
                ? 'font-black text-[#141414]'
                : 'text-[#141414]/50 hover:text-[#141414]'
            }`}
          >
            <div className={`p-1 rounded-sm ${activeTab === 'calendar' ? 'bg-[#FFE600]' : ''}`}>
              <CalendarIcon size={20} className="stroke-[2.5]" />
            </div>
            <span className="font-display text-[10px] font-bold uppercase tracking-tight mt-0.5">
              Calendario
            </span>
          </button>

          {/* 2. Lista */}
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'list'
                ? 'font-black text-[#141414]'
                : 'text-[#141414]/50 hover:text-[#141414]'
            }`}
          >
            <div className={`p-1 rounded-sm ${activeTab === 'list' ? 'bg-[#FFE600]' : ''}`}>
              <ListChecks size={20} className="stroke-[2.5]" />
            </div>
            <span className="font-display text-[10px] font-bold uppercase tracking-tight mt-0.5">
              Lista
            </span>
          </button>

          {/* 3. Tasto Centrale + (Colonna 3, 52x52px, rialzato -mt-5) */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                setAddModalTab(activeTab === 'calendar' || activeTab === 'agenda' ? 'event' : 'game');
                setAddModalDate('');
                setIsAddModalOpen(true);
              }}
              className="w-[52px] h-[52px] -mt-5 btn-tactile bg-[#FF4522] text-white flex items-center justify-center border-[2.5px] border-[#141414] shadow-brutal shrink-0"
              aria-label="Aggiungi rapido"
            >
              <Plus size={30} className="stroke-[3.5]" />
            </button>
          </div>

          {/* 4. Agenda */}
          <button
            type="button"
            onClick={() => setActiveTab('agenda')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'agenda'
                ? 'font-black text-[#141414]'
                : 'text-[#141414]/50 hover:text-[#141414]'
            }`}
          >
            <div className={`p-1 rounded-sm ${activeTab === 'agenda' ? 'bg-[#FFE600]' : ''}`}>
              <CalendarClock size={20} className="stroke-[2.5]" />
            </div>
            <span className="font-display text-[10px] font-bold uppercase tracking-tight mt-0.5">
              Agenda
            </span>
          </button>

          {/* 5. Diario */}
          <button
            type="button"
            onClick={() => setActiveTab('diary')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'diary'
                ? 'font-black text-[#141414]'
                : 'text-[#141414]/50 hover:text-[#141414]'
            }`}
          >
            <div className={`p-1 rounded-sm ${activeTab === 'diary' ? 'bg-[#FFE600]' : ''}`}>
              <BookOpen size={20} className="stroke-[2.5]" />
            </div>
            <span className="font-display text-[10px] font-bold uppercase tracking-tight mt-0.5">
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
