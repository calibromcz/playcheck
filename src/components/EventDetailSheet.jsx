import React from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Pin, Trash2, Edit3, Share2 } from 'lucide-react';

export default function EventDetailSheet({ 
  isOpen, 
  onClose, 
  event, 
  onTogglePin, 
  onDeleteEvent 
}) {
  if (!isOpen || !event) return null;

  const handleShareWhatsApp = () => {
    const text = `🎲 *PARTITA A ${event.gameTitle.toUpperCase()}*\n📅 Data: *${event.date}* ore *${event.time || '21:00'}*\n📍 Luogo: *${event.location || 'Tavolo da gioco'}*${event.notes ? `\n📝 "${event.notes}"` : ''}\n\nConfermate la presenza! 🚀`;
    navigator.clipboard?.writeText(text);
    alert('Dettagli partita copiati per WhatsApp!');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#141414]/65 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#FFFDF8] border-t-2 border-[#141414] shadow-brutal p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-[#141414]/30 mx-auto rounded-full -mt-1 mb-1" />

        <div className="flex items-start justify-between pb-2 border-b-2 border-[#141414]">
          <div>
            <span className="font-mono text-[10px] font-bold uppercase text-[#141414]/60 block tracking-wider">
              SESSIONE IN PROGRAMMA
            </span>
            <h3 className="font-display text-xl font-bold uppercase text-[#141414] truncate max-w-[270px]">
              {event.gameTitle}
            </h3>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="btn-tactile-sm bg-[#F4EFE6] p-1.5 shrink-0"
            aria-label="Chiudi"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Dettagli Logistica */}
        <div className="space-y-2.5 font-mono text-sm bg-[#F4EFE6] p-3.5 border-2 border-[#141414]">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-[#FF4522]" />
            <span className="font-bold">DATA: {event.date}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>ORA: <b>{event.time || '21:00'}</b></span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>LUOGO: <b>{event.location || 'Tavolo da gioco'}</b></span>
          </div>

          {event.notes && (
            <div className="pt-2 border-t border-[#141414]/20 text-xs italic">
              "{event.notes}"
            </div>
          )}
        </div>

        {/* Azioni */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full btn-tactile bg-[#B8FF2C] text-[#141414] font-display text-sm font-bold uppercase py-2.5 flex items-center justify-center gap-2"
          >
            <Share2 size={16} />
            <span>CONDIVIDI SU WHATSAPP</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onTogglePin(event.id);
                onClose();
              }}
              className="btn-tactile bg-[#FFE600] text-[#141414] font-mono text-xs font-bold uppercase py-2.5 flex items-center justify-center gap-1.5"
            >
              <Pin size={14} className={event.pinned ? "fill-[#FF4522]" : ""} />
              <span>{event.pinned ? 'TOGLI PIN' : 'METTI PIN'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Eliminare questo appuntamento dal calendario?')) {
                  onDeleteEvent(event.id);
                  onClose();
                }
              }}
              className="btn-tactile bg-[#F4EFE6] hover:bg-[#FF4522] hover:text-white text-[#FF4522] font-mono text-xs font-bold uppercase py-2.5 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>ELIMINA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
