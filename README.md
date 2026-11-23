# PLAYCHECK 🎲📋

> **Board Game Queue & Play Calendar PWA** — 100% Local-First & Mobile-First.

PlayCheck è una Progressive Web App pensata per appassionati di giochi da tavolo che vogliono gestire la propria coda di titoli da provare, programmare le sessioni di gioco su un calendario a strappo e timbrare con un verdetto indelebile ogni gioco una volta intavolato.

---

### 🎨 Identità Visiva: Tabletop Risograph Zine / Neo-Brutalismo Tattile
- **Palette carta & inchiostro**: Sfondo Carta Avorio `#F4EFE6`, Inchiostro `#141414`, Superficie comande `#FFFDF8`.
- **Accenti Risograph ad alto contrasto**:
  - Vermiglio (`#FF4522`) — Urgente / Azione primaria / Cinghiali
  - Giallo Evidenziatore (`#FFE600`) — Pianificato / Giochi medi / Header
  - Lime Acido (`#B8FF2C`) — Checked / Provato / Filler
  - Blu Cobalto (`#2447FF`) — Dettagli calendario & tag
  - Lilla Carta (`#D7C4FF`) — Note & dadi
- **Fisicità tattile**: Bordi netti da 2px e 2.5px, ombre rigide `box-shadow: 4px 4px 0px #141414`, feedback di pressione `:active` con traslazione fisica, timbri d'inchiostro inclinati (`rotate-[-6deg]`).
- **Tipografia**: *Archivo Black* (titoli e timbri), *Space Grotesk* (interfaccia), *JetBrains Mono* (dati scontrino e calendario).

---

### 🚀 Funzionalità Principali
1. **Coda Giochi (Queue)**:
   - Titolo, proponente/proprietario, peso (`filler`, `medio`, `cinghiale`), livello di hype (1-3 fiamme).
   - Filtro immediato per peso e ordinamento per Hype, Alfabetico o Recenti.
   - Pulsante **"PESCA"** con dado per estrarre casualmente un titolo dalla coda quando sei indeciso.
2. **Calendario Sessioni**:
   - Tabellone stile blocco note da muro a strappo con vista mensile.
   - Pianificazione rapida con data e note logistiche ("Da Luca ore 21", "Portare bustine").
   - Conteggio sessioni e indicatore visivo del giorno corrente.
3. **Archivio Provati & Timbro Verdetto**:
   - Segna un gioco come provato con tanto di coriandoli celebrativi.
   - Assegnazione del verdetto: `TOP / DA AVERE`, `OK / PIACEVOLE`, `PASSO`.
   - Visualizzazione con timbro inchiostrato inclinato `CHECKED`.
   - Possibilità di rimettere in coda in qualsiasi momento.
4. **100% Local-First & Offline**:
   - Salvataggio automatico e istantaneo in `localStorage` (`playcheck_bg_v1`).
   - Nessun account o login richiesto, nessun server esterno.
   - Pre-popolamento con 4 giochi realistici al primo avvio e banner per svuotamento rapido in un tap.
5. **Mobile-first PWA**:
   - Installabile come applicazione stand-alone su iOS e Android.
   - Meta tag completi, supporto safe area iOS, service worker per cache offline.

---

### 🛠️ Sviluppo Locale
```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Genera la build per produzione
npm run build
```

---

### 📦 GitHub Pages Deployment
La cartella `.github/workflows/deploy.yml` compila automaticamente il progetto e lo pubblica su GitHub Pages all'indirizzo:
`https://calibromcz.github.io/playcheck/`
