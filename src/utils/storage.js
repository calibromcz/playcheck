// Data Model and Storage utilities for PlayCheck
export const STORAGE_KEY = 'playcheck_bg_v1';

export const INITIAL_DEMO_GAMES = [
  {
    id: 'demo-1',
    title: 'Ark Nova',
    requestedBy: 'Marco',
    weight: 'cinghiale',
    hype: 3,
    status: 'scheduled',
    scheduledDate: getRelativeDate(2), // fra 2 giorni
    sessionNote: 'Circolo ore 21:00 — portare playmat e mappe zoo!',
    notes: 'Voglio provare la strategia rettili e progetti di conservazione.',
    verdict: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    playedAt: null
  },
  {
    id: 'demo-2',
    title: 'Harmonies',
    requestedBy: 'Gruppo',
    weight: 'filler',
    hype: 3,
    status: 'queue',
    scheduledDate: null,
    sessionNote: '',
    notes: 'Draft di dischi per creare habitat tridimensionali per animali.',
    verdict: null,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    playedAt: null
  },
  {
    id: 'demo-3',
    title: 'Dune: Imperium - Uprising',
    requestedBy: 'Mio',
    weight: 'medio',
    hype: 2,
    status: 'queue',
    scheduledDate: null,
    sessionNote: '',
    notes: 'Nuovi vermi di sabbia e contratti spie. Da giocare in 4.',
    verdict: null,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    playedAt: null
  },
  {
    id: 'demo-4',
    title: 'Scout',
    requestedBy: 'Elena',
    weight: 'filler',
    hype: 3,
    status: 'played',
    scheduledDate: getRelativeDate(-3),
    sessionNote: 'Partita al pub con Matteo ed Elena',
    notes: 'Gioco di carte geniale, non puoi riordinare la mano!',
    verdict: 'top',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    playedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  }
];

function getRelativeDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

export function loadGames() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_GAMES));
      return { games: INITIAL_DEMO_GAMES, isInitialDemo: true };
    }
    const parsed = JSON.parse(raw);
    return { games: Array.isArray(parsed) ? parsed : [], isInitialDemo: false };
  } catch (e) {
    console.error('Error loading games from localStorage', e);
    return { games: INITIAL_DEMO_GAMES, isInitialDemo: true };
  }
}

export function saveGames(games) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch (e) {
    console.error('Error saving games', e);
  }
}

export const WEIGHT_LABELS = {
  filler: { label: 'FILLER (<30m)', bg: 'bg-[#B8FF2C]', text: 'text-[#141414]', border: 'border-[#141414]' },
  medio: { label: 'MEDIO (45-90m)', bg: 'bg-[#FFE600]', text: 'text-[#141414]', border: 'border-[#141414]' },
  cinghiale: { label: 'CINGHIALE (90m+)', bg: 'bg-[#FF4522]', text: 'text-white', border: 'border-[#141414]' }
};

export const VERDICTS = {
  top: { label: 'TOP / DA AVERE', bg: 'bg-[#B8FF2C]', text: 'text-[#141414]', stampColor: '#141414' },
  ok: { label: 'OK / PIACEVOLE', bg: 'bg-[#FFE600]', text: 'text-[#141414]', stampColor: '#141414' },
  passo: { label: 'PASSO / NON PER ME', bg: 'bg-[#FF4522]', text: 'text-white', stampColor: '#141414' }
};
