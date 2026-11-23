import React from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Pin, Trash2, Share2 } from 'lucide-react';

export default function EventDetailSheet({ 
  isOpen, 
  onClose, 
  event, 
  onTogglePin, 
  onDeleteEvent 
}) {
  if (!isOpen || !event) return null;

  const handleShareWhatsApp = () => {
    const text = `🎲 *Partita a ${event.gameTitle}*\n📅 Data: *${event.date}* alle ${event.time || '21:00'}\n📍 Luogo: *${event.location || 'Tavolo da gioco'}*${event.notes ? `\n📝 "${event.notes}"` : ''}\n\nConfermate la presenza! 🌲`;
    navigator.clipboard?.writeText(text);
    alert('Dettagli partita copiati negli appunti per WhatsApp!');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 backdrop-blur-[2px] animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFFFF] rounded-t-3xl shadow-[0_-8px_24px_rgba(28,25,23,0.08)] p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#D6D1C4] mx-auto rounded-full -mt-1 mb-1" />

        <div className="flex items-start justify-between pb-3 border-b border-[#E4DFD3]">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block">
              Sessione programmata
            </span>
            <h3 className="font-serif text-[20px] font-bold text-[#1C1917] truncate max-w-[270px]">
              {event.gameTitle}
            </h3>
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

        {/* Dettagli Logistica */}
        <div className="space-y-2 text-sm bg-[#F6F4EF] p-3.5 rounded-2xl border border-[#E4DFD3]">
          <div className="flex items-center gap-2 text-[#1C1917]">
            <CalendarIcon size={16} className="text-[#1B4D3E]" />
            <span className="font-semibold">{event.date}</span>
          </div>

          <div className="flex items-center gap-2 text-[#1C1917]">
            <Clock size={16} className="text-[#78716C]" />
            <span>Ora: <b>{event.time || '21:00'}</b></span>
          </div>

          <div className="flex items-center gap-2 text-[#1C1917]">
            <MapPin size={16} className="text-[#78716C]" />
            <span>Luogo: <b>{event.location || 'Tavolo da gioco'}</b></span>
          </div>

          {event.notes && (
            <div className="pt-2 border-t border-[#E4DFD3] text-xs text-[#78716C] italic">
              "{event.notes}"
            </div>
          )}
        </div>

        {/* Azioni */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full h-11 rounded-xl bg-[#EFECE4] hover:bg-[#E4DFD3] text-[#1C1917] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 size={15} className="text-[#1B4D3E]" />
            <span>Condividi su WhatsApp</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onTogglePin(event.id);
                onClose();
              }}
              className="h-11 rounded-xl border border-[#E4DFD3] bg-[#FFFFFF] hover:bg-[#F6F4EF] text-[#1C1917] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Pin size={14} className={event.pinned ? "fill-[#D97706] text-[#D97706]" : "text-[#78716C]"} />
              <span>{event.pinned ? 'Togli pin' : 'Metti pin'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Eliminare questo appuntamento dall\'agenda?')) {
                  onDeleteEvent(event.id);
                  onClose();
                }
              }}
              className="h-11 rounded-xl border border-[#FEE2E2] bg-[#FFFFFF] hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>Elimina</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
