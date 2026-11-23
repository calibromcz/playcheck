import React from 'react';
import { X, Download, Upload, Trash2, Info } from 'lucide-react';

export default function SettingsModal({ 
  isOpen, 
  onClose, 
  games = [], 
  events = [], 
  onRestoreDemo, 
  onClearAll, 
  onImportData 
}) {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    const backupData = {
      version: 'playcheck_v2',
      exportedAt: new Date().toISOString(),
      games,
      events
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `playcheck_v2_backup_${new Date().toISOString().split('T')[0]}.json`);
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
          const importedGames = Array.isArray(parsed) ? parsed : (parsed.games || []);
          const importedEvents = parsed.events || [];
          onImportData({ games: importedGames, events: importedEvents });
          alert(`Backup importato: ${importedGames.length} giochi e ${importedEvents.length} eventi!`);
          onClose();
        } else {
          alert("Formato file JSON non valido.");
        }
      } catch (err) {
        alert("Errore nella lettura del file JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#141414]/65 animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#FFFDF8] border-t-2 sm:border-2 border-[#141414] shadow-brutal p-4 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#141414]">
          <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#141414]">
            IMPOSTAZIONI & BACKUP
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-tactile-sm bg-[#F4EFE6] p-1.5"
            aria-label="Chiudi"
          >
            <X size={18} className="stroke-[2.5]" />
          </button>
        </div>

        <div className="space-y-2.5 font-mono text-xs">
          {/* Esporta Backup JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full btn-tactile bg-[#F4EFE6] hover:bg-[#FFE600] text-[#141414] py-3 px-3 flex items-center justify-between font-bold"
          >
            <div className="flex items-center gap-2">
              <Download size={16} />
              <span>ESPORTA BACKUP JSON</span>
            </div>
            <span className="text-[11px] text-[#141414]/60">
              ({games.length} giochi, {events.length} eventi)
            </span>
          </button>

          {/* Importa Backup JSON */}
          <label className="w-full btn-tactile bg-[#F4EFE6] hover:bg-[#B8FF2C] text-[#141414] py-3 px-3 flex items-center justify-between font-bold cursor-pointer">
            <div className="flex items-center gap-2">
              <Upload size={16} />
              <span>IMPORTA BACKUP JSON</span>
            </div>
            <input 
              type="file" 
              accept=".json,application/json" 
              onChange={handleFileImport}
              className="hidden" 
            />
          </label>

          {/* Ripristina Esempi */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Ripristinare i dati di esempio iniziali? I giochi correnti verranno sovrascritti.")) {
                onRestoreDemo();
                onClose();
              }
            }}
            className="w-full btn-tactile bg-[#F4EFE6] text-[#141414] py-3 px-3 flex items-center gap-2 font-bold"
          >
            <Info size={16} />
            <span>RICARICA DATI DI ESEMPIO</span>
          </button>

          {/* Svuota Tutto */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Sei sicuro di voler eliminare TUTTI i giochi e gli eventi salvati? Operazione irreversibile.")) {
                onClearAll();
                onClose();
              }
            }}
            className="w-full btn-tactile bg-[#F4EFE6] hover:bg-[#FF4522] hover:text-white text-[#FF4522] py-3 px-3 flex items-center gap-2 font-bold transition-colors"
          >
            <Trash2 size={16} />
            <span>SVUOTA TUTTO IL DATABASE</span>
          </button>
        </div>

        <div className="pt-2 text-center font-mono text-[11px] text-[#141414]/50">
          PlayCheck v2 · 100% Local-First
        </div>
      </div>
    </div>
  );
}
