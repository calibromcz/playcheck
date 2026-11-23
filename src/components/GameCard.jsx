import React from 'react';
import { Check, Flame } from 'lucide-react';
import { WEIGHT_LABELS, VERDICTS } from '../utils/storage';

function formatScheduleBadge(dateStr) {
  if (!dateStr) return null;
  try {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    const dayNames = ['DOM', 'LUN', 'MAR', 'MER', 'GIO', 'VEN', 'SAB'];
    const monthNames = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];
    return `${dayNames[date.getDay()]} ${date.getDate()} ${monthNames[date.getMonth()]}`;
  } catch (e) {
    return dateStr;
  }
}

export default function GameCard({ 
  game, 
  onSelect,
  onQuickToggle
}) {
  const isPlayed = game.status === 'played';
  const isScheduled = game.status === 'scheduled';
  const weightName = game.weight === 'cinghiale' ? 'CINGHIALE' : game.weight === 'filler' ? 'FILLER' : 'MEDIO';

  return (
    <div 
      onClick={() => onSelect(game)}
      className={`relative bg-[#FFFDF8] border-2 border-[#141414] shadow-brutal p-3 cursor-pointer transition-transform active:translate-x-[2px] active:translate-y-[2px] active:shadow-none select-none ${
        isPlayed ? 'opacity-85 bg-[#FAF7F0]' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left Column: Title & Metadata */}
        <div className="flex-1 min-w-0 pr-1">
          {/* Row 1: Titolo leggibile + Badge compatto */}
          <div className="flex items-baseline gap-2 mb-1 flex-wrap">
            <h3 className="font-display text-[17px] uppercase tracking-tight text-[#141414] leading-snug truncate max-w-[240px]">
              {game.title}
            </h3>

            {/* Singolo badge pulito a destra del titolo */}
            {isScheduled && game.scheduledDate && (
              <span className="font-mono text-[10px] font-black uppercase px-1.5 py-0.5 bg-[#FFE600] border border-[#141414] tracking-tight shrink-0">
                {formatScheduleBadge(game.scheduledDate)}
              </span>
            )}

            {isPlayed && (
              <span className="font-mono text-[10px] font-black uppercase px-1.5 py-0.5 bg-[#B8FF2C] border border-[#141414] tracking-tight shrink-0">
                PROVATO
              </span>
            )}
          </div>

          {/* Row 2: Monospace pulito discreto (MEDIO · 🔥🔥 · da Marco) */}
          <div className="flex items-center gap-1.5 font-mono text-[12px] text-[#141414]/70 truncate">
            <span className="font-bold">{weightName}</span>
            <span>·</span>
            <span className="text-[#FF4522] tracking-tighter" title={`Hype ${game.hype}/3`}>
              {'🔥'.repeat(game.hype || 1)}
            </span>
            {game.requestedBy && (
              <>
                <span>·</span>
                <span className="truncate">da {game.requestedBy}</span>
              </>
            )}
          </div>
        </div>

        {/* Right Single Quick Button: Spunta rapida / Checkbox tattile */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onQuickToggle(game);
          }}
          className={`w-9 h-9 shrink-0 border-2 border-[#141414] flex items-center justify-center transition-colors ${
            isPlayed 
              ? 'bg-[#B8FF2C] text-[#141414]' 
              : 'bg-[#F4EFE6] hover:bg-[#B8FF2C]/50 text-[#141414]/40 hover:text-[#141414]'
          }`}
          title={isPlayed ? "Già provato (tap per dettagli)" : "Segna come provato al volo"}
        >
          <Check size={18} className={isPlayed ? "stroke-[3.5] text-[#141414]" : "stroke-[2.5]"} />
        </div>
      </div>
    </div>
  );
}
