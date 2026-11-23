import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
  ListOrdered, 
  CheckCircle2, 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Dices, 
  Settings, 
  X, 
  Flame,
  ArrowUpDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadGames, saveGames, INITIAL_DEMO_GAMES } from './utils/storage';
import GameCard from './components/GameCard';
import GameModal from './components/GameModal';
import GameDetailSheet from './components/GameDetailSheet';
import ScheduleModal from './components/ScheduleModal';
import VerdictModal from './components/VerdictModal';
import SettingsModal from './components/SettingsModal';
import CalendarView from './components/CalendarView';

export default function App() {
  const [games, setGames] = useState([]);
  const [isDemoBannerVisible, setIsDemoBannerVisible] = useState(false);
  
  // Navigation: 'queue' (vista principale a tab) | 'calendar'
  const [mainNav, setMainNav] = useState('queue'); // 'queue' | 'calendar'

  // Sotto-tab della coda: 'to_try' (DA PROVARE) | 'scheduled' (IN AGENDA) | 'played' (PROVATI)
  const [queueTab, setQueueTab] = useState('to_try'); 

  // Ricerca e filtri
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterWeight, setFilterWeight] = useState('all');
  const [sortBy, setSortBy] = useState('hype'); // 'hype' | 'date' | 'title'

  // Modali e Sheet
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [prefilledDate, setPrefilledDate] = useState('');
  const [selectedGameDetail, setSelectedGameDetail] = useState(null);
  const [schedulingGame, setSchedulingGame] = useState(null);
  const [verdictGame, setVerdictGame] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Caricamento dati
  useEffect(() => {
    const { games: loaded, isInitialDemo } = loadGames();
    setGames(loaded);
    if (isInitialDemo) {
      setIsDemoBannerVisible(true);
    }
  }, []);

  // Sync localStorage
  const updateGamesState = (newGames) => {
    setGames(newGames);
    saveGames(newGames);
  };

  // Add / Edit game handler
  const handleSaveGame = (gameData) => {
    const exists = games.some(g => g.id === gameData.id);
    let updated;
    if (exists) {
      updated = games.map(g => g.id === gameData.id ? gameData : g);
    } else {
      updated = [gameData, ...games];
      confetti({ particleCount: 40, spread: 45, origin: { y: 0.8 } });
    }
    updateGamesState(updated);
    setIsGameModalOpen(false);
    setEditingGame(null);
    setPrefilledDate('');
  };

  // Delete game handler
  const handleDeleteGame = (id) => {
    if (window.confirm('Eliminare questo gioco dalla comanda?')) {
      const updated = games.filter(g => g.id !== id);
      updateGamesState(updated);
      setSelectedGameDetail(null);
    }
  };

  // Move back to queue
  const handleMoveToQueue = (game) => {
    const updated = games.map(g => g.id === game.id ? {
      ...g,
      status: 'queue',
      scheduledDate: null,
      sessionNote: '',
      playedAt: null,
      verdict: null
    } : g);
    updateGamesState(updated);
    setSelectedGameDetail(null);
  };

  // Quick checkbox toggle on card
  const handleQuickToggle = (game) => {
    if (game.status === 'played') {
      // Se già provato, apri la scheda dettaglio per gestire
      setSelectedGameDetail(game);
    } else {
      // Se da provare o in agenda, apri il timbro rapido
      setVerdictGame(game);
    }
  };

  // Random Dice Pick
  const handleRandomPick = () => {
    const pool = games.filter(g => g.status === 'queue');
    if (pool.length === 0) {
      alert('Nessun gioco in coda "Da Provare" da pescare!');
      return;
    }
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    setSelectedGameDetail(chosen);
  };

  // Conteggi tab
  const countToTry = games.filter(g => g.status === 'queue').length;
  const countScheduled = games.filter(g => g.status === 'scheduled').length;
  const countPlayed = games.filter(g => g.status === 'played').length;

  // Filtraggio lista
  const displayedGames = useMemo(() => {
    let list = games.filter(g => {
      if (queueTab === 'to_try') return g.status === 'queue';
      if (queueTab === 'scheduled') return g.status === 'scheduled';
      if (queueTab === 'played') return g.status === 'played';
      return true;
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(g => 
        g.title.toLowerCase().includes(q) || 
        (g.requestedBy && g.requestedBy.toLowerCase().includes(q))
      );
    }

    if (filterWeight !== 'all') {
      list = list.filter(g => g.weight === filterWeight);
    }

    return list.sort((a, b) => {
      if (sortBy === 'hype') return b.hype - a.hype;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [games, queueTab, searchQuery, filterWeight, sortBy]);

  return (
    <div className="relative min-h-[100dvh] bg-[#F4EFE6] text-[#141414] overflow-x-hidden pb-28">
      {/* Noise Texture Overlay leggerissima */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-50 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-md mx-auto px-4">
        {/* HEADER MINIMALE: ALTEZZA MAX 56px */}
        <header className="h-14 flex items-center justify-between border-b-2 border-[#141414] py-2 mb-3">
          {/* Logo compatto a sinistra */}
          <div 
            onClick={() => setMainNav('queue')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 bg-[#FFE600] border-2 border-[#141414] flex items-center justify-center shadow-brutal-sm">
              <CheckSquare size={18} className="stroke-[3] text-[#141414]" />
            </div>
            <h1 className="font-display text-xl tracking-tight uppercase text-[#141414]">
              PLAYCHECK
            </h1>
          </div>

          {/* 2 Bottoni icona quadrati 38x38px a destra */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRandomPick}
              className="w-[38px] h-[38px] btn-tactile bg-[#FFFDF8] hover:bg-[#FFE600] flex items-center justify-center p-0"
              title="Pesca a caso un gioco dalla coda"
              aria-label="Pesca a caso"
            >
              <Dices size={18} className="stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="w-[38px] h-[38px] btn-tactile bg-[#FFFDF8] hover:bg-[#F4EFE6] flex items-center justify-center p-0"
              title="Impostazioni e Backup"
              aria-label="Impostazioni"
            >
              <Settings size={18} className="stroke-[2.5]" />
            </button>
          </div>
        </header>

        {/* Micro-striscia discreta per dati di esempio iniziali */}
        {isDemoBannerVisible && (
          <div className="mb-3 py-1.5 px-3 bg-[#FFE600] border-2 border-[#141414] flex items-center justify-between font-mono text-[11px] font-bold">
            <span className="truncate">📦 4 giochi di esempio caricati</span>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button 
                onClick={() => {
                  updateGamesState([]);
                  setIsDemoBannerVisible(false);
                }}
                className="underline hover:text-[#FF4522]"
              >
                Svuota
              </button>
              <span>·</span>
              <button 
                onClick={() => setIsDemoBannerVisible(false)}
                className="font-black"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* VISTA 1: CODA (DA PROVARE / IN AGENDA / PROVATI) */}
        {mainNav === 'queue' && (
          <div>
            {/* Barra dei 3 Tab Netti a tutta larghezza (stile schedario) */}
            <div className="grid grid-cols-3 gap-1.5 mb-3 font-display text-xs">
              <button
                type="button"
                onClick={() => setQueueTab('to_try')}
                className={`py-2 px-1 border-2 border-[#141414] text-center uppercase transition-all select-none ${
                  queueTab === 'to_try'
                    ? 'bg-[#141414] text-[#FFFDF8] shadow-brutal-sm font-black'
                    : 'bg-[#FFFDF8] text-[#141414] hover:bg-[#F4EFE6]'
                }`}
              >
                DA PROVARE ({countToTry})
              </button>

              <button
                type="button"
                onClick={() => setQueueTab('scheduled')}
                className={`py-2 px-1 border-2 border-[#141414] text-center uppercase transition-all select-none ${
                  queueTab === 'scheduled'
                    ? 'bg-[#FFE600] text-[#141414] shadow-brutal-sm font-black'
                    : 'bg-[#FFFDF8] text-[#141414] hover:bg-[#F4EFE6]'
                }`}
              >
                IN AGENDA ({countScheduled})
              </button>

              <button
                type="button"
                onClick={() => setQueueTab('played')}
                className={`py-2 px-1 border-2 border-[#141414] text-center uppercase transition-all select-none ${
                  queueTab === 'played'
                    ? 'bg-[#B8FF2C] text-[#141414] shadow-brutal-sm font-black'
                    : 'bg-[#FFFDF8] text-[#141414] hover:bg-[#F4EFE6]'
                }`}
              >
                PROVATI ({countPlayed})
              </button>
            </div>

            {/* Riga compatta: Ricerca a sinistra + Bottone compatto Filtri a destra */}
            <div className="flex items-center gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#141414]/50" />
                <input
                  type="text"
                  placeholder="Cerca titolo o amico..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-1.5 bg-[#FFFDF8] border-2 border-[#141414] font-body text-base text-[#141414] focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#141414]/50 hover:text-[#141414]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className={`btn-tactile-sm px-2.5 py-1.5 font-mono text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                  isFiltersOpen || filterWeight !== 'all' || sortBy !== 'hype'
                    ? 'bg-[#FFE600] text-[#141414]'
                    : 'bg-[#FFFDF8] text-[#141414]'
                }`}
              >
                <SlidersHorizontal size={14} className="stroke-[2.5]" />
                <span>FILTRI</span>
              </button>
            </div>

            {/* Pannellino filtri espandibile solo su richiesta */}
            {isFiltersOpen && (
              <div className="bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-3 mb-3 space-y-2.5 font-mono text-xs animate-fadeIn">
                <div>
                  <span className="font-black uppercase text-[10px] text-[#141414]/60 block mb-1">PESO:</span>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'all', label: 'TUTTI' },
                      { id: 'filler', label: 'FILLER' },
                      { id: 'medio', label: 'MEDIO' },
                      { id: 'cinghiale', label: 'CINGHIALE' },
                    ].map(f => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilterWeight(f.id)}
                        className={`py-1 border border-[#141414] font-bold text-center text-[10px] uppercase ${
                          filterWeight === f.id ? 'bg-[#141414] text-white font-black' : 'bg-[#F4EFE6]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#141414]/20">
                  <span className="font-black uppercase text-[10px] text-[#141414]/60">ORDINA PER:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-1 bg-[#F4EFE6] border border-[#141414] font-mono text-xs font-bold"
                  >
                    <option value="hype">PIÙ HYPE</option>
                    <option value="date">PIÙ RECENTE</option>
                    <option value="title">ALFABETICO</option>
                  </select>
                </div>
              </div>
            )}

            {/* LISTA SCHEDE GIOCO PULITA */}
            {displayedGames.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-[#141414]/30 bg-[#FFFDF8] p-6 space-y-3">
                <p className="font-display text-base uppercase text-[#141414]">
                  NESSUN GIOCO TROVATO
                </p>
                <p className="font-body text-xs text-[#141414]/70 max-w-xs mx-auto">
                  {searchQuery 
                    ? `Nessun risultato corrispondente a "${searchQuery}".` 
                    : queueTab === 'to_try'
                    ? 'La tua coda da provare è vuota. Tocca il tasto rosso "+" in basso per aggiungere il prossimo gioco!'
                    : queueTab === 'scheduled'
                    ? 'Nessun gioco in agenda. Seleziona un gioco per fissare una data!'
                    : 'Nessun gioco ancora timbrato come provato.'}
                </p>
                {queueTab === 'to_try' && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGame(null);
                      setPrefilledDate('');
                      setIsGameModalOpen(true);
                    }}
                    className="btn-tactile bg-[#FF4522] text-white font-display text-xs uppercase px-4 py-2 mt-2"
                  >
                    + AGGIUNGI ORA
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {displayedGames.map(game => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelect={(g) => setSelectedGameDetail(g)}
                    onQuickToggle={handleQuickToggle}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VISTA 2: CALENDARIO */}
        {mainNav === 'calendar' && (
          <CalendarView
            games={games}
            onSelectGame={(g) => setSelectedGameDetail(g)}
            onAddForDate={(dateStr) => {
              setEditingGame(null);
              setPrefilledDate(dateStr);
              setIsGameModalOpen(true);
            }}
          />
        )}
      </div>

      {/* BOTTOM BAR DI NAVIGAZIONE FISSA (Altezza 64px + Safe Area) */}
      <nav className="fixed bottom-0 left-0 right-0 h-[64px] pb-[env(safe-area-inset-bottom)] bg-[#F4EFE6] border-t-2 border-[#141414] z-40">
        <div className="max-w-md mx-auto h-full px-6 flex items-center justify-between">
          {/* Tab 1: CODA */}
          <button
            type="button"
            onClick={() => setMainNav('queue')}
            className={`flex flex-col items-center justify-center font-display text-[11px] uppercase tracking-wider select-none ${
              mainNav === 'queue' ? 'text-[#141414] font-black' : 'text-[#141414]/40 hover:text-[#141414]'
            }`}
          >
            <ListOrdered size={20} className="stroke-[2.5] mb-0.5" />
            <span>CODA</span>
          </button>

          {/* Tab 2: Tasto "+" Centrale Vermiglio */}
          <button
            type="button"
            onClick={() => {
              setEditingGame(null);
              setPrefilledDate('');
              setIsGameModalOpen(true);
            }}
            className="w-13 h-13 -mt-5 btn-tactile bg-[#FF4522] text-white rounded-none flex items-center justify-center shadow-brutal p-3 border-2 border-[#141414]"
            aria-label="Aggiungi nuovo gioco"
          >
            <Plus size={26} className="stroke-[3.5]" />
          </button>

          {/* Tab 3: CALENDARIO */}
          <button
            type="button"
            onClick={() => setMainNav('calendar')}
            className={`flex flex-col items-center justify-center font-display text-[11px] uppercase tracking-wider select-none ${
              mainNav === 'calendar' ? 'text-[#141414] font-black' : 'text-[#141414]/40 hover:text-[#141414]'
            }`}
          >
            <CalendarIcon size={20} className="stroke-[2.5] mb-0.5" />
            <span>CALENDARIO</span>
          </button>
        </div>
      </nav>

      {/* MODALI & BOTTOM SHEETS */}
      <GameModal
        isOpen={isGameModalOpen}
        onClose={() => {
          setIsGameModalOpen(false);
          setEditingGame(null);
          setPrefilledDate('');
        }}
        onSave={handleSaveGame}
        editingGame={editingGame}
        prefilledDate={prefilledDate}
      />

      <GameDetailSheet
        isOpen={Boolean(selectedGameDetail)}
        game={selectedGameDetail}
        onClose={() => setSelectedGameDetail(null)}
        onSchedule={(g) => setSchedulingGame(g)}
        onMarkPlayed={(g) => setVerdictGame(g)}
        onEdit={(g) => {
          setEditingGame(g);
          setIsGameModalOpen(true);
        }}
        onDelete={handleDeleteGame}
        onMoveToQueue={handleMoveToQueue}
      />

      <ScheduleModal
        isOpen={Boolean(schedulingGame)}
        game={schedulingGame}
        onClose={() => setSchedulingGame(null)}
        onSave={(updated) => {
          handleSaveGame(updated);
          setSchedulingGame(null);
          setSelectedGameDetail(null);
        }}
      />

      <VerdictModal
        isOpen={Boolean(verdictGame)}
        game={verdictGame}
        onClose={() => setVerdictGame(null)}
        onSave={(updated) => {
          handleSaveGame(updated);
          setVerdictGame(null);
          setSelectedGameDetail(null);
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        games={games}
        onRestoreDemo={() => updateGamesState(INITIAL_DEMO_GAMES)}
        onClearAll={() => updateGamesState([])}
        onImportData={(imported) => updateGamesState(imported)}
      />
    </div>
  );
}
