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
    downloadAnchor.setAttribute("download", `playcheck_backup_${new Date().toISOString().split('T')[0]}.json`);
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
          alert(`Backup importato con successo: ${importedGames.length} giochi e ${importedEvents.length} eventi!`);
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/35 backdrop-blur-[2px] animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#FFFFFF] rounded-t-3xl sm:rounded-2xl shadow-[0_-8px_24px_rgba(28,25,23,0.08)] p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#E4DFD3]">
          <h3 className="font-serif text-[19px] font-bold text-[#1C1917]">
            Impostazioni & Dati
          </h3>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#78716C] hover:bg-[#EFECE4] hover:text-[#1C1917]"
            aria-label="Chiudi"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {/* Esporta Backup JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full py-3 px-3.5 rounded-xl border border-[#E4DFD3] bg-[#F6F4EF] hover:bg-[#EFECE4] text-[#1C1917] flex items-center justify-between font-semibold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Download size={16} className="text-[#1B4D3E]" />
              <span>Esporta backup JSON</span>
            </div>
            <span className="text-[11px] text-[#78716C] font-normal">
              ({games.length} giochi, {events.length} eventi)
            </span>
          </button>

          {/* Importa Backup JSON */}
          <label className="w-full py-3 px-3.5 rounded-xl border border-[#E4DFD3] bg-[#F6F4EF] hover:bg-[#EFECE4] text-[#1C1917] flex items-center justify-between font-semibold cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <Upload size={16} className="text-[#1B4D3E]" />
              <span>Importa file JSON</span>
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
            className="w-full py-3 px-3.5 rounded-xl border border-[#E4DFD3] bg-[#FFFFFF] hover:bg-[#F6F4EF] text-[#78716C] hover:text-[#1C1917] flex items-center gap-2.5 font-medium transition-colors"
          >
            <Info size={16} />
            <span>Ricarica dati di esempio</span>
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
            className="w-full py-3 px-3.5 rounded-xl border border-[#FEE2E2] bg-[#FFFFFF] hover:bg-[#FEE2E2] text-[#DC2626] flex items-center gap-2.5 font-medium transition-colors"
          >
            <Trash2 size={16} />
            <span>Svuota tutto il database locale</span>
          </button>
        </div>

        <div className="pt-1 text-center text-[11px] text-[#78716C]">
          PlayCheck · 100% Local-First
        </div>
      </div>
    </div>
  );
}
