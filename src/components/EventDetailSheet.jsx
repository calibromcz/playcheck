import React from 'react';
import { X, Calendar as CalendarIcon, Clock, MapPin, Pin, Trash2, Share2 } from 'lucide-react';

export default function EventDetailSheet({
  isOpen,
  onClose,
  event,
  onTogglePin,
  onDeleteEvent,
}) {
  if (!isOpen || !event) return null;

  const handleShareWhatsApp = () => {
    const text = `🎲 *${event.gameTitle}*\n📅 ${event.date} · ${event.time || '21:00'}\n📍 ${event.location || 'Tavolo da gioco'}${event.notes ? `\n📝 ${event.notes}` : ''}`;
    navigator.clipboard?.writeText(text);
    alert('Dettagli partita copiati per WhatsApp.');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="fixed inset-x-0 bottom-0 max-w-[430px] mx-auto bg-white rounded-t-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-[#D1D1D6] mx-auto rounded-full mb-4" />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8E8E93] block">
              Evento
            </span>
            <h3 className="text-[18px] font-bold text-[#111111] truncate mt-0.5">
              {event.gameTitle}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F0F3] flex items-center justify-center text-[#6E6E73] hover:text-[#111111] shrink-0"
            aria-label="Chiudi"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-[#F5F5F7] rounded-2xl p-4 space-y-2.5 text-[14px] text-[#111111] mb-4">
          <div className="flex items-center gap-2.5">
            <CalendarIcon size={16} className="text-[#6E6E73] shrink-0" />
            <span className="font-medium">{event.date}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={16} className="text-[#6E6E73] shrink-0" />
            <span>{event.time || '21:00'}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={16} className="text-[#6E6E73] shrink-0" />
            <span>{event.location || 'Tavolo da gioco'}</span>
          </div>
          {event.notes && (
            <p className="pt-2 border-t border-black/[0.06] text-[13px] text-[#6E6E73]">
              {event.notes}
            </p>
          )}
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full h-11 rounded-xl bg-[#111111] text-white text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Share2 size={15} />
            <span>Copia per WhatsApp</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                onTogglePin(event.id);
                onClose();
              }}
              className="h-11 rounded-xl bg-[#F0F0F3] text-[#111111] text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#E5E5EA] transition-colors"
            >
              <Pin
                size={14}
                className={event.pinned ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#6E6E73]'}
              />
              <span>{event.pinned ? 'Togli Pin' : 'Priorità'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Eliminare questo evento?')) {
                  onDeleteEvent(event.id);
                  onClose();
                }
              }}
              className="h-11 rounded-xl bg-[#F0F0F3] text-[#EF4444] text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-[#EF4444]/10 transition-colors"
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
