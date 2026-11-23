import React from 'react';
import { X, Download, Upload, Trash2, Info } from 'lucide-react';
import { STORAGE_KEY, INITIAL_DEMO_GAMES } from '../utils/storage';

export default function SettingsModal({ isOpen, onClose, games, onRestoreDemo, onClearAll, onImportData }) {
  if (!isOpen) return null;

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(games, null, 2));
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
        if (Array.isArray(parsed)) {
          onImportData(parsed);
          alert(`Importati con successo ${parsed.length} giochi!`);
          onClose();
        } else {
          alert("File JSON non valido: atteso un array di giochi.");
        }
      } catch (err) {
        alert("Errore nel leggere il file JSON.");
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
        <div className="flex items-center justify-between pb-3 border-b border-[#141414]/20">
          <h3 className="font-display text-lg uppercase tracking-tight text-[#141414]">
            IMPOSTAZIONI & DATI
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
          {/* Backup Esporta */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="w-full btn-tactile bg-[#F4EFE6] hover:bg-[#FFE600] text-[#141414] py-3 px-3 flex items-center justify-between font-bold"
          >
            <div className="flex items-center gap-2">
              <Download size={16} />
              <span>ESPORTA BACKUP JSON</span>
            </div>
            <span className="text-[11px] text-[#141414]/60">({games.length} giochi)</span>
          </button>

          {/* Importa */}
          <label className="w-full btn-tactile bg-[#F4EFE6] hover:bg-[#B8FF2C] text-[#141414] py-3 px-3 flex items-center justify-between font-bold cursor-pointer">
            <div className="flex items-center gap-2">
              <Upload size={16} />
              <span>IMPORTA FILE JSON</span>
            </div>
            <input 
              type="file" 
              accept=".json,application/json" 
              onChange={handleFileImport}
              className="hidden" 
            />
          </label>

          {/* Ripristina demo */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Ripristinare i 4 giochi di esempio? I dati attuali verranno sovrascritti.")) {
                onRestoreDemo();
                onClose();
              }
            }}
            className="w-full btn-tactile bg-[#F4EFE6] text-[#141414] py-3 px-3 flex items-center gap-2 font-bold"
          >
            <Info size={16} />
            <span>RICARICA ESEMPI INIZIALI</span>
          </button>

          {/* Svuota archivio */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Sei sicuro di voler eliminare TUTTI i giochi salvati? Operazione irreversibile.")) {
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
          PlayCheck · 100% Local-First · v1.2
        </div>
      </div>
    </div>
  );
}
