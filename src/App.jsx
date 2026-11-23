import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
  ListOrdered, 
  CheckCircle2, 
  Plus, 
  Filter, 
  Trash2, 
  Share2, 
  Sparkles, 
  RotateCcw,
  Dice5,
  Dices,
  Info,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loadGames, saveGames, WEIGHT_LABELS } from './utils/storage';
import GameCard from './components/GameCard';
import GameModal from './components/GameModal';
import ScheduleModal from './components/ScheduleModal';
import VerdictModal from './components/VerdictModal';
import CalendarView from './components/CalendarView';

export default function App() {
  const [games, setGames] = useState([]);
  const [isDemoBannerVisible, setIsDemoBannerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'calendar' | 'played'
  
  // Filters & sorting for Queue
  const [filterWeight, setFilterWeight] = useState('all');
  const [sortBy, setSortBy] = useState('hype'); // 'hype' | 'date' | 'title'

  // Modals state
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [schedulingGame, setSchedulingGame] = useState(null);
  const [verdictGame, setVerdictGame] = useState(null);

  // Load initial data
  useEffect(() => {
    const { games: loaded, isInitialDemo } = loadGames();
    setGames(loaded);
    if (isInitialDemo) {
      setIsDemoBannerVisible(true);
    }
  }, []);

  // Sync to localStorage
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
  };

  // Delete game handler
  const handleDeleteGame = (id) => {
    if (window.confirm('Rimuovere questo gioco dalla comanda?')) {
      const updated = games.filter(g => g.id !== id);
      updateGamesState(updated);
    }
  };

  // Clear demo data
  const handleClearDemo = () => {
    if (window.confirm('Vuoi svuotare i giochi di esempio e iniziare con la tua lista pulita?')) {
      updateGamesState([]);
      setIsDemoBannerVisible(false);
    }
  };

  // Dismiss demo banner
  const handleDismissBanner = () => {
    setIsDemoBannerVisible(false);
  };

  // Reset to queue
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
  };

  // Pick random game from queue
  const handleRandomPick = () => {
    const queueList = games.filter(g => g.status === 'queue');
    if (queueList.length === 0) {
      alert('Nessun gioco in coda da pescare!');
      return;
    }
    const randomGame = queueList[Math.floor(Math.random() * queueList.length)];
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    alert(`🎲 ESTRATTO DALLA CODA:\n\n"${randomGame.title.toUpperCase()}"\nRichiesto da: ${randomGame.requestedBy || 'IO'}\n\nÈ il momento di intavolarlo!`);
  };

  // Filtered queue items
  const queueGames = useMemo(() => {
    let list = games.filter(g => g.status === 'queue' || g.status === 'scheduled');
    
    if (filterWeight !== 'all') {
      list = list.filter(g => g.weight === filterWeight);
    }

    return list.sort((a, b) => {
      if (sortBy === 'hype') {
        return b.hype - a.hype;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [games, filterWeight, sortBy]);

  // Played items
  const playedGames = useMemo(() => {
    return games.filter(g => g.status === 'played').sort((a, b) => {
      const dateA = a.playedAt || a.createdAt;
      const dateB = b.playedAt || b.createdAt;
      return new Date(dateB) - new Date(dateA);
    });
  }, [games]);

  const scheduledCount = games.filter(g => g.status === 'scheduled').length;
  const queueCount = games.filter(g => g.status === 'queue').length;
  const playedCount = games.filter(g => g.status === 'played').length;

  return (
    <div className="relative min-h-[100dvh] bg-[#F4EFE6] text-[#141414] overflow-x-hidden pb-[calc(76px+env(safe-area-inset-bottom))]">
      {/* SVG Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035] z-50 bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="max-w-md mx-auto px-3.5 pt-4">
        {/* App Topbar Header */}
        <header className="mb-4">
          <div className="bg-paper-card border-[2.5px] border-[#141414] card-tactile p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-risograph-yellow p-1.5 border-2 border-[#141414] shadow-[2px_2px_0px_#141414] flex items-center justify-center">
                <CheckSquare size={22} className="stroke-[3] text-[#141414]" />
              </div>
              <div>
                <h1 className="font-display text-2xl tracking-tighter uppercase leading-none text-[#141414]">
                  PLAYCHECK
                </h1>
                <span className="font-mono text-[10px] font-bold text-risograph-cobalt tracking-widest uppercase block -mt-0.5">
                  BOARD GAME QUEUE & CALENDAR
                </span>
              </div>
            </div>

            {/* Quick action: Dices Pick */}
            <button
              onClick={handleRandomPick}
              className="btn-tactile bg-risograph-lilac text-[#141414] px-2.5 py-1.5 font-mono text-xs font-black flex items-center gap-1"
              title="Pesca a caso un gioco dalla coda"
            >
              <Dices size={16} className="stroke-[2.5]" />
              <span>PESCA</span>
            </button>
          </div>

          {/* Demo Data Banner if first launch */}
          {isDemoBannerVisible && (
            <div className="mt-3 bg-risograph-yellow border-2 border-[#141414] shadow-[3px_3px_0px_#141414] p-3 flex items-center justify-between gap-2 animate-fadeIn">
              <div className="font-mono text-xs text-[#141414] leading-snug">
                <span className="font-black uppercase block">📦 DATI DI ESEMPIO ATTIVI</span>
                <span>Puoi esplorare le comande o svuotarle in un colpo.</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleClearDemo}
                  className="btn-tactile-sm bg-white font-mono text-[11px] font-black uppercase px-2 py-1"
                >
                  SVUOTA
                </button>
                <button
                  onClick={handleDismissBanner}
                  className="btn-tactile-sm bg-[#141414] text-white font-mono text-[11px] font-black uppercase px-2 py-1"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Tab Switcher Buttons */}
        <nav className="grid grid-cols-3 gap-2 mb-4 font-display text-xs">
          <button
            onClick={() => setActiveTab('queue')}
            className={`btn-tactile py-2.5 px-1 uppercase flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'queue'
                ? 'bg-risograph-vermilion text-white'
                : 'bg-paper-card text-[#141414]'
            }`}
          >
            <div className="flex items-center gap-1 font-bold">
              <ListOrdered size={15} className="stroke-[2.5]" />
              <span>IN CODA</span>
            </div>
            <span className="font-mono text-[10px] font-black opacity-90">({queueCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`btn-tactile py-2.5 px-1 uppercase flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'calendar'
                ? 'bg-risograph-yellow text-[#141414]'
                : 'bg-paper-card text-[#141414]'
            }`}
          >
            <div className="flex items-center gap-1 font-bold">
              <CalendarIcon size={15} className="stroke-[2.5]" />
              <span>CALENDARIO</span>
            </div>
            <span className="font-mono text-[10px] font-black opacity-90">({scheduledCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('played')}
            className={`btn-tactile py-2.5 px-1 uppercase flex flex-col items-center justify-center gap-0.5 ${
              activeTab === 'played'
                ? 'bg-risograph-lime text-[#141414]'
                : 'bg-paper-card text-[#141414]'
            }`}
          >
            <div className="flex items-center gap-1 font-bold">
              <CheckCircle2 size={15} className="stroke-[2.5]" />
              <span>PROVATI</span>
            </div>
            <span className="font-mono text-[10px] font-black opacity-90">({playedCount})</span>
          </button>
        </nav>

        {/* VIEW 1: CODA / LISTA GIOCHI */}
        {activeTab === 'queue' && (
          <div>
            {/* Filter and sorting toolbar */}
            <div className="bg-paper-card border-2 border-[#141414] p-2.5 mb-3.5 shadow-[2px_2px_0px_#141414] flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                <span className="font-bold text-[#141414]/70">PESO:</span>
                {[
                  { id: 'all', label: 'TUTTI' },
                  { id: 'filler', label: 'FILLER' },
                  { id: 'medio', label: 'MEDIO' },
                  { id: 'cinghiale', label: 'CINGHIALE' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilterWeight(f.id)}
                    className={`px-2 py-0.5 border border-[#141414] uppercase text-[10px] font-bold ${
                      filterWeight === f.id
                        ? 'bg-[#141414] text-white font-black'
                        : 'bg-paper-bg text-[#141414]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 ml-auto">
                <ArrowUpDown size={13} className="text-[#141414]/70" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-paper-bg border border-[#141414] p-1 font-mono text-xs font-bold"
                >
                  <option value="hype">ORDINA: PIÙ HYPE</option>
                  <option value="date">ORDINA: RECENTI</option>
                  <option value="title">ORDINA: ALFABETICO</option>
                </select>
              </div>
            </div>

            {/* List of Game Cards */}
            {queueGames.length === 0 ? (
              <div className="bg-paper-card border-2 border-dashed border-[#141414]/40 p-8 text-center card-tactile">
                <div className="bg-risograph-yellow w-12 h-12 mx-auto border-2 border-[#141414] flex items-center justify-center mb-3">
                  <Dice5 size={24} className="stroke-[2.5]" />
                </div>
                <h3 className="font-display text-lg uppercase text-[#141414] mb-1">
                  CODA VUOTA
                </h3>
                <p className="font-body text-xs text-[#141414]/70 max-w-xs mx-auto mb-4">
                  Non hai giochi in attesa con questo filtro. Aggiungi il prossimo gioco che vuoi provare premendo il pulsante qui sotto!
                </p>
                <button
                  onClick={() => {
                    setEditingGame(null);
                    setIsGameModalOpen(true);
                  }}
                  className="btn-tactile bg-risograph-vermilion text-white font-display text-sm uppercase px-4 py-2"
                >
                  + AGGIUNGI GIOCO
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {queueGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onEdit={(g) => {
                      setEditingGame(g);
                      setIsGameModalOpen(true);
                    }}
                    onDelete={handleDeleteGame}
                    onSchedule={(g) => setSchedulingGame(g)}
                    onMarkPlayed={(g) => setVerdictGame(g)}
                    onMoveToQueue={handleMoveToQueue}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: CALENDARIO & SESSIONI */}
        {activeTab === 'calendar' && (
          <CalendarView
            games={games}
            onScheduleGame={(g) => setSchedulingGame(g)}
            onMarkPlayed={(g) => setVerdictGame(g)}
            onEditGame={(g) => {
              setEditingGame(g);
              setIsGameModalOpen(true);
            }}
          />
        )}

        {/* VIEW 3: GIOCHI PROVATI & ARCHIVIO */}
        {activeTab === 'played' && (
          <div>
            <div className="bg-paper-card border-2 border-[#141414] card-tactile p-3 mb-3 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-black uppercase text-risograph-cobalt tracking-widest block">
                  ALBO D'ORO DELLA CODA
                </span>
                <h3 className="font-display text-xl uppercase text-[#141414]">
                  GIOCHI SMARCATI ({playedGames.length})
                </h3>
              </div>
              <div className="stamp-checked px-2 py-0.5 font-display text-xs bg-risograph-lime border-2 border-[#141414]">
                ARCHIVIO
              </div>
            </div>

            {playedGames.length === 0 ? (
              <div className="bg-paper-card border-2 border-dashed border-[#141414]/40 p-8 text-center card-tactile">
                <CheckCircle2 size={36} className="mx-auto mb-2 text-[#141414]/40" />
                <h4 className="font-display text-base uppercase text-[#141414] mb-1">
                  ANCORA NESSUN GIOCO PROVATO
                </h4>
                <p className="font-body text-xs text-[#141414]/70">
                  Quando intavoli e completi una partita, premi "PROVATO!" su una scheda per assegnargli il verdetto definitivo!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {playedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onEdit={(g) => {
                      setEditingGame(g);
                      setIsGameModalOpen(true);
                    }}
                    onDelete={handleDeleteGame}
                    onSchedule={(g) => setSchedulingGame(g)}
                    onMarkPlayed={(g) => setVerdictGame(g)}
                    onMoveToQueue={handleMoveToQueue}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Action Bar (Mobile-first dock) */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-[#F4EFE6]/95 border-t-2 border-[#141414] backdrop-blur-none z-40 max-w-md mx-auto">
        <button
          onClick={() => {
            setEditingGame(null);
            setIsGameModalOpen(true);
          }}
          className="w-full btn-tactile bg-risograph-vermilion text-white font-display text-base uppercase py-3 border-2 border-[#141414] flex items-center justify-center gap-2 tracking-wider"
        >
          <Plus size={20} className="stroke-[3]" />
          <span>AGGIUNGI GIOCO ALLA CODA</span>
        </button>
      </div>

      {/* Modals */}
      <GameModal
        isOpen={isGameModalOpen}
        onClose={() => {
          setIsGameModalOpen(false);
          setEditingGame(null);
        }}
        onSave={handleSaveGame}
        editingGame={editingGame}
      />

      <ScheduleModal
        isOpen={Boolean(schedulingGame)}
        game={schedulingGame}
        onClose={() => setSchedulingGame(null)}
        onSave={(updated) => {
          handleSaveGame(updated);
          setSchedulingGame(null);
        }}
      />

      <VerdictModal
        isOpen={Boolean(verdictGame)}
        game={verdictGame}
        onClose={() => setVerdictGame(null)}
        onSave={(updated) => {
          handleSaveGame(updated);
          setVerdictGame(null);
        }}
      />
    </div>
  );
}
