import React from 'react';
import { X, Download, Upload, Trash2, RotateCcw } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  games = [],
  events = [],
  onRestoreDemo,
  onClearAll,
  onImportData,
}) {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    const backupData = {
      version: 'playcheck_v2',
      exportedAt: new Date().toISOString(),
      games,
      events,
    };
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `playcheck_backup_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.games || Array.isArray(parsed)) {
          const importedGames = Array.isArray(parsed) ? parsed : parsed.games || [];
          const importedEvents = parsed.events || [];
          onImportData({ games: importedGames, events: importedEvents });
          alert(
            `Importati ${importedGames.length} giochi e ${importedEvents.length} eventi.`
          );
          onClose();
        } else {
          alert('Formato file JSON non valido.');
        }
      } catch {
        alert('Errore nella lettura del file JSON.');
      }
    };
    reader.readAsText(file);
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

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold text-[#111111]">Dati e Backup</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0F0F3] flex items-center justify-center text-[#6E6E73] hover:text-[#111111]"
            aria-label="Chiudi"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full h-12 rounded-xl bg-[#F5F5F7] px-4 flex items-center justify-between text-[14px] font-medium text-[#111111] hover:bg-[#E5E5EA] transition-colors"
          >
            <span className="flex items-center gap-2.5">
              <Download size={16} />
              <span>Esporta backup JSON</span>
            </span>
            <span className="text-[12px] text-[#6E6E73]">
              {games.length} giochi · {events.length} eventi
            </span>
          </button>

          <label className="w-full h-12 rounded-xl bg-[#F5F5F7] px-4 flex items-center gap-2.5 text-[14px] font-medium text-[#111111] hover:bg-[#E5E5EA] transition-colors cursor-pointer">
            <Upload size={16} />
            <span>Importa backup JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleFileImport}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Ripristinare i dati di esempio? I dati attuali verranno sostituiti.'
                )
              ) {
                onRestoreDemo();
                onClose();
              }
            }}
            className="w-full h-12 rounded-xl bg-[#F5F5F7] px-4 flex items-center gap-2.5 text-[14px] font-medium text-[#6E6E73] hover:text-[#111111] transition-colors"
          >
            <RotateCcw size={16} />
            <span>Ricarica dati di esempio</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'Eliminare tutti i giochi e gli eventi salvati localmente?'
                )
              ) {
                onClearAll();
                onClose();
              }
            }}
            className="w-full h-12 rounded-xl bg-[#F5F5F7] px-4 flex items-center gap-2.5 text-[14px] font-medium text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
          >
            <Trash2 size={16} />
            <span>Svuota archivio locale</span>
          </button>
        </div>
      </div>
    </div>
  );
}
