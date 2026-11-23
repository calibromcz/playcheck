// PlayCheck v2 Data Storage & Utilities
export const STORAGE_GAMES_KEY = 'playcheck_v2_games';
export const STORAGE_EVENTS_KEY = 'playcheck_v2_events';
const LEGACY_STORAGE_KEY = 'playcheck_bg_v1';

export const INITIAL_DEMO_GAMES = [
  {
    id: 'game-1',
    title: 'Ark Nova',
    bggUrl: 'https://boardgamegeek.com/boardgame/342942/ark-nova',
    requestedBy: 'Marco',
    weight: 'cinghiale',
    pinned: true,
    status: 'list',
    rating: 0,
    reviewText: '',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    playedAt: null
  },
  {
    id: 'game-2',
    title: 'Harmonies',
    bggUrl: '',
    requestedBy: 'Gruppo',
    weight: 'filler',
    pinned: true,
    status: 'list',
    rating: 0,
    reviewText: '',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    playedAt: null
  },
  {
    id: 'game-3',
    title: 'Dune: Imperium - Uprising',
    bggUrl: '',
    requestedBy: 'Mio',
    weight: 'medio',
    pinned: false,
    status: 'list',
    rating: 0,
    reviewText: '',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    playedAt: null
  },
  {
    id: 'game-4',
    title: 'Scout',
    bggUrl: 'https://boardgamegeek.com/boardgame/291453/scout',
    requestedBy: 'Elena',
    weight: 'filler',
    pinned: false,
    status: 'played',
    rating: 5,
    reviewText: 'Geniale gioco di carte dove non puoi mai riordinare la mano. Rapido, tesissimo e perfetto sia in 3 che in 5 giocatori!',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    playedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export function getRelativeDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export const INITIAL_DEMO_EVENTS = [
  {
    id: 'event-1',
    gameId: 'game-1',
    gameTitle: 'Ark Nova',
    date: getRelativeDate(2),
    time: '21:00',
    location: 'Circolo Brecht / Casa Marco',
    pinned: true,
    notes: 'Portare mappe dello zoo e playmat!',
    createdAt: new Date().toISOString()
  },
  {
    id: 'event-2',
    gameId: 'game-3',
    gameTitle: 'Dune: Imperium - Uprising',
    date: getRelativeDate(5),
    time: '20:30',
    location: 'Casa di Luca',
    pinned: false,
    notes: 'Partita a 4 giocatori con contratti spia',
    createdAt: new Date().toISOString()
  }
];

// Helper to generate BGG URL if empty
export function getBggLink(title, customUrl) {
  if (customUrl && customUrl.trim().startsWith('http')) {
    return customUrl.trim();
  }
  return `https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q=${encodeURIComponent(title || '')}`;
}

// Load data with automatic migration from v1
export function loadAppData() {
  try {
    let gamesRaw = localStorage.getItem(STORAGE_GAMES_KEY);
    let eventsRaw = localStorage.getItem(STORAGE_EVENTS_KEY);

    // Se mancano dati v2, prova a verificare se esiste la vecchia chiave v1
    if (!gamesRaw) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const legacyGames = JSON.parse(legacyRaw);
          if (Array.isArray(legacyGames) && legacyGames.length > 0) {
            const migratedGames = legacyGames.map(lg => ({
              id: lg.id || 'game_' + Date.now() + Math.random().toString(36).substr(2, 4),
              title: lg.title || 'Senza titolo',
              bggUrl: '',
              requestedBy: lg.requestedBy || '',
              weight: lg.weight || 'medio',
              pinned: lg.status === 'scheduled',
              status: lg.status === 'played' ? 'played' : 'list',
              rating: lg.verdict === 'top' ? 5 : lg.verdict === 'ok' ? 3 : lg.verdict === 'passo' ? 1 : 0,
              reviewText: lg.notes || '',
              createdAt: lg.createdAt || new Date().toISOString(),
              playedAt: lg.playedAt || null
            }));

            const migratedEvents = [];
            legacyGames.forEach(lg => {
              if (lg.status === 'scheduled' && lg.scheduledDate) {
                migratedEvents.push({
                  id: 'evt_' + Date.now() + Math.random().toString(36).substr(2, 4),
                  gameId: lg.id,
                  gameTitle: lg.title,
                  date: lg.scheduledDate,
                  time: '21:00',
                  location: lg.sessionNote || 'Tavolo da gioco',
                  pinned: true,
                  notes: '',
                  createdAt: new Date().toISOString()
                });
              }
            });

            localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(migratedGames));
            localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(migratedEvents));
            return { games: migratedGames, events: migratedEvents, isDemo: false };
          }
        } catch (e) {
          console.error("Migration error:", e);
        }
      }

      // Default demo
      localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(INITIAL_DEMO_GAMES));
      localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(INITIAL_DEMO_EVENTS));
      return { games: INITIAL_DEMO_GAMES, events: INITIAL_DEMO_EVENTS, isDemo: true };
    }

    const games = JSON.parse(gamesRaw) || [];
    const events = eventsRaw ? JSON.parse(eventsRaw) : [];
    return { games, events, isDemo: false };
  } catch (e) {
    console.error("Error loading app data:", e);
    return { games: INITIAL_DEMO_GAMES, events: INITIAL_DEMO_EVENTS, isDemo: true };
  }
}

export function saveGames(games) {
  try {
    localStorage.setItem(STORAGE_GAMES_KEY, JSON.stringify(games));
  } catch (e) {
    console.error("Error saving games:", e);
  }
}

export function saveEvents(events) {
  try {
    localStorage.setItem(STORAGE_EVENTS_KEY, JSON.stringify(events));
  } catch (e) {
    console.error("Error saving events:", e);
  }
}

export const WEIGHT_LABELS = {
  filler: { label: 'FILLER', sub: '<30m', bg: 'bg-[#B8FF2C]', text: 'text-[#141414]' },
  medio: { label: 'MEDIO', sub: '45-90m', bg: 'bg-[#FFE600]', text: 'text-[#141414]' },
  cinghiale: { label: 'CINGHIALE', sub: '90m+', bg: 'bg-[#FF4522]', text: 'text-white' }
};

export const RATING_LABELS = {
  1: 'Bocciato',
  2: 'Sottotono',
  3: 'Solido / Piacevole',
  4: 'Ottimo',
  5: 'Capolavoro'
};
