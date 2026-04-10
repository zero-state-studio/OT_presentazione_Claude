---
name: presentazione-ot
description: Crea una nuova presentazione HTML slide-deck con lo stile grafico OT Consulting. Genera scaffolding completo con design system condiviso, navigazione, export PPTX, footer branded e struttura pronta per aggiungere contenuti.
user_invocable: true
---

# Skill: Presentazione OT Consulting

Questa skill crea una nuova presentazione HTML con il design system OT Consulting: sfondo bianco, accent rosso #E60000, font DM Sans + Space Mono, decorazioni cover con cerchi rossi, barra rossa sotto i titoli, footer con logo OT.

## Quando si attiva

Quando l'utente invoca `/presentazione-ot <nome-presentazione>`.

## Flusso

### Step 0: Seleziona il tema

**Se `--migra` è presente nel comando:**
- Salta tutti i passi Step 1-Step 7 del flusso normale
- Salta direttamente alla sezione **Migrazione di una presentazione esistente** in fondo a questo documento
- Se `--tema` è assente assieme a `--migra`, chiedi: **"Quale tema vuoi applicare alla migrazione?"** e mostra la lista temi

In assenza di `--migra`, procedi normalmente con il flusso qui sotto.

Controlla se l'utente ha passato `--tema <nome>-<versione>` nell'invocazione (es. `/presentazione-ot mia-pres --tema minimal-v1`).

**Se `--tema` è presente nel comando:**
- Estrai nome e versione: `minimal-v1` → nome=`minimal`, versione=`v1`
- Verifica che esista `themes/<nome>/<versione>/meta.json`. Se non esiste, informa l'utente e mostra i temi disponibili.
- Memorizza il percorso tema: `TEMA_PATH = <nome>/<versione>` (es. `minimal/v1`)

**Se `--tema` è assente:**
- Usa il tool Glob su `themes/*/*/meta.json` per trovare tutti i `meta.json` disponibili
- Leggi ogni `meta.json` trovato e costruisci la lista: nome, versione, description
- Presenta la selezione:

> **Quale tema grafico vuoi usare?**
> 1. Standard v1 — Tema OT Consulting attuale (cerchi decorativi, barra rossa)
> 2. Minimal v1 — Layout pulito, tipografia dominante, nessuna decorazione
> _(aggiungi voci per ogni meta.json trovato, ordinati per nome+versione)_

Attendi la risposta numerica. Memorizza `TEMA_PATH` (es. `standard/v1` o `minimal/v1`).

**Variante di divisione:**
Se l'utente ha passato `--variante <nome>` (es. `--variante sys-fashion`):
- Verifica che esista `themes/<valore di TEMA_PATH>/variants/<nome>.css`
- Memorizza `VARIANTE = <nome>`

In assenza di `--variante`, non caricare nessuna variante CSS (lascia `VARIANTE` vuoto).

### Step 1: Chiedi il team

Prima di creare qualsiasi file, chiedi all'utente:

> **Quale team/divisione OT Consulting?** (es. SYS-FASHION, DATA-ENGINEERING, CLOUD-OPS...)
> Premi Invio per lasciare vuoto (verrà usato solo "OT Consulting").

Attendi la risposta. Se l'utente fornisce un nome team, usalo come `TEAM_NAME` nel footer e nel logo-bar. Se lascia vuoto, ometti la riga `<small class="ot-division">` dal footer.

### Step 2: Chiedi gli autori

Dopo aver ricevuto il team, chiedi:

> **Email degli autori** (separate da virgola, facoltativo — premi Invio per saltare)
> Es: gianluca.ricaldone@otconsulting.com, leonardo.torella@otconsulting.com

Attendi la risposta.

**Se l'utente inserisce email**, per ciascuna:
1. **Ricava nome e cognome** dalla parte locale dell'email: `nome.cognome@...` → Nome = capitalize(nome), Cognome = capitalize(cognome)
2. **Ricava il filename della foto** concatenando nome e cognome senza separatori, tutto lowercase: `nome.cognome@...` → `nomecognome` (es. `gianlucaricaldone`). L'estensione può essere `.png`, `.webp` o `.jpg` — controlla quale esiste in `shared/assets/foto/`. Se nessuna esiste, usa un placeholder con le iniziali.
3. **Chiedi dove inserire i membri del team:**

> **Dove vuoi mostrare i membri del team?**
> 1 — Home (nella cover, sotto le statistiche e sopra il logo OT)
> 2 — Slide ad hoc (slide dedicata dopo la cover)

   - Se **1 (Home)**: inserisci il blocco `.cover-team` nella cover, **prima** del `.logo-bar` (vedi template cover)
   - Se **2 (Slide ad hoc)**: genera la slide Team separata (vedi sezione *Slide Team* nel template)

Se l'utente preme Invio senza inserire email, salta completamente la gestione team.

### Step 2b: Chiedi la descrizione

Dopo gli autori, chiedi:

> **Breve descrizione della presentazione** (facoltativo — premi Invio per saltare)
> Es: Introduzione a Claude Code per sviluppatori Java, focus su integrazione CI/CD

Attendi la risposta.
- **Se la descrizione è fornita**: genera slide di contenuto coerenti con il tema descritto (3-6 slide, usando i componenti disponibili).
- **Se la descrizione è vuota**: genera SOLO la cover, l'eventuale slide Team e la closing. Nessuna slide di contenuto aggiuntiva.

### Step 3: Crea la struttura dei file

Crea la cartella `presentazioni/<nome-presentazione>/` con:

```
presentazioni/<nome-presentazione>/
├── index.html    # Presentazione completa
├── style.css     # Override CSS specifici (inizialmente vuoto con commento)
└── assets/       # Cartella per immagini/PDF specifici
```

### Step 4: Genera index.html

Il file HTML si costruisce così:

**1. Leggi i partial** del tema scelto usando il tool Read:
   - `themes/{{TEMA_PATH}}/partials/cover.html` — sempre incluso come slide 0
   - `themes/{{TEMA_PATH}}/partials/team.html` — incluso solo se ci sono autori E l'utente ha scelto "Slide ad hoc"
   - `themes/{{TEMA_PATH}}/partials/content-slide.html` — incluso una volta per ogni slide di contenuto
   - `themes/{{TEMA_PATH}}/partials/closing.html` — sempre incluso come ultima slide

**2. Sostituisci i placeholder** `{{VAR}}` con i valori raccolti.

**Placeholder opzionali nel partial cover.html:**
- `{{METRICS_HTML}}`: se non ci sono statistiche → stringa vuota. Se sì, generare:
  ```html
  <div class="metrics anim d3" style="justify-content:flex-start;margin-top:2rem;position:relative;z-index:2">
    <div class="metric"><div class="value">VAL</div><div class="label">LABEL</div></div>
  </div>
  ```
- `{{COVER_TEAM_HTML}}`: se team è su "Slide ad hoc" o nessun autore → stringa vuota. Se "Home", generare:
  ```html
  <div class="cover-team anim d4" style="position:relative;z-index:2">
    <div class="cover-team-member">
      <img src="../../shared/assets/foto/{{FILENAME}}.{{EXT}}" alt="{{INIZIALI}}">
      <div class="cover-team-member-name"><span>{{NOME}}</span><span>{{COGNOME}}</span></div>
    </div>
  </div>
  ```
- `{{TEAM_NAME_FRAG}}`: se TEAM_NAME è vuoto → stringa vuota. Se sì → `<br><small class="ot-division">{{TEAM_NAME}}</small>`

**`{{SLIDE_FOOTER}}` nei partial content-slide e team:**
```html
<div class="slide-footer">
  <span class="copyright">&copy;OT Consulting. All rights reserved</span>
  <div class="ot-logo">
    <div class="ot-circle"><img src="../../shared/assets/OT.png" alt="OT"></div>
    <span class="ot-name">OT Consulting{{TEAM_NAME_FRAG}}</span>
  </div>
</div>
```

**Placeholder della closing (da partial closing.html):**
- `{{CLOSING_LABEL}}`: label della slide di chiusura (es. "Grazie", "Q&A", "Fine")
- `{{CLOSING_TITLE}}`: prima parte del titolo della closing
- `{{CLOSING_ACCENT}}`: parola in evidenza nella closing (span.highlight)
- `{{CLOSING_SUBTITLE}}`: sottotitolo della closing — chiedi all'utente oppure usa "Grazie per l'attenzione." come default

**3. Costruisci l'HTML completo** con questa struttura shell:

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITOLO}} — OT Consulting</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../shared/style.css">
<link rel="stylesheet" href="../../themes/{{TEMA_PATH}}/theme.css">
{{VARIANT_LINK}}
<link rel="stylesheet" href="style.css">
</head>
<body>

<div class="progress" id="progress"></div>
<div class="deck" id="deck">

  [QUI: cover partial + team partial opzionale + N content-slide partials + closing partial]

</div>

<div class="nav">
  <button id="prev" onclick="go(-1)">&#x2039;</button>
  <div class="dots" id="dots"></div>
  <div class="counter" id="counter">1 / {{TOTAL}}</div>
  <button id="next" onclick="go(1)">&#x203a;</button>
</div>

<div class="kbd-hint"><kbd>←</kbd> <kbd>→</kbd> per navigare</div>

<script src="../../shared/nav.js"></script>
{{THEME_JS}}
<script src="../../shared/pptx.js"></script>

</body>
</html>
```

Dove:
- `{{VARIANT_LINK}}` = `<link rel="stylesheet" href="../../themes/{{TEMA_PATH}}/variants/{{VARIANTE}}.css">` se VARIANTE è impostato, altrimenti stringa vuota
- `{{THEME_JS}}` = `<script src="../../themes/{{TEMA_PATH}}/theme.js"></script>` se il file esiste (verificare con Glob), altrimenti stringa vuota

### Step 5: Footer template

Ogni slide di contenuto (non cover/closing) DEVE avere questo footer come ultimo figlio:

**Se TEAM_NAME è stato fornito:**
```html
<div class="slide-footer">
  <span class="copyright">&copy;OT Consulting. All rights reserved</span>
  <div class="ot-logo">
    <div class="ot-circle"><img src="../../shared/assets/OT.png" alt="OT"></div>
    <span class="ot-name">OT Consulting<br><small class="ot-division">{{TEAM_NAME}}</small></span>
  </div>
</div>
```

**Se TEAM_NAME è vuoto:**
```html
<div class="slide-footer">
  <span class="copyright">&copy;OT Consulting. All rights reserved</span>
  <div class="ot-logo">
    <div class="ot-circle"><img src="../../shared/assets/OT.png" alt="OT"></div>
    <span class="ot-name">OT Consulting</span>
  </div>
</div>
```

### Step 6: Genera style.css

Crea un file CSS con commento iniziale e struttura pronta.

**Se NON ci sono autori:**
```css
/* ══════════════════════════════════════════
   {{NOME}} — Override CSS specifici
   Caricato DOPO shared/style.css
   ══════════════════════════════════════════ */

/* Aggiungi qui gli override per questa presentazione */
```

**Se ci sono autori**, aggiungi anche gli stili per la slide Team:
```css
/* ══════════════════════════════════════════
   {{NOME}} — Override CSS specifici
   Caricato DOPO shared/style.css
   ══════════════════════════════════════════ */

/* Team / Ambassadors */
.ambassadors { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1.5rem; max-width: 56.25rem; width: 100%; margin-top: 2rem; }
.ambassador { background: var(--bg); border: 1px solid var(--border); border-radius: 1rem; padding: 1.75rem 1.25rem; text-align: center; transition: all .3s; position: relative; overflow: hidden; box-shadow: 0 1px .25rem rgba(0, 0, 0, .04); }
.ambassador:hover { border-color: var(--accent); transform: translateY(-3px) }
.ambassador .avatar { width: 4.5rem; height: 4.5rem; border-radius: 50%; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; position: relative; }
.ambassador .avatar::before { content: ''; position: absolute; inset: -3px; border-radius: 50%; background: var(--gradient); z-index: 0; }
.ambassador .avatar .avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: var(--surface); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; font-size: 1.4rem; font-weight: 700; color: var(--accent); letter-spacing: .05em; }
img.avatar-inner { object-fit: cover; }
.ambassador .ch-name { font-weight: 700; font-size: 1rem; margin-bottom: .2rem; color: var(--text) }
.ambassador .ch-role { color: var(--muted); font-size: .78rem; line-height: 1.4 }
.ambassador .ch-badge { display: inline-flex; margin-top: .6rem; padding: .2rem .7rem; border-radius: .375rem; font-size: .68rem; font-weight: 600; background: rgba(230, 0, 0, .08); color: var(--accent); }

/* Aggiungi qui gli override per questa presentazione */
```

### Step 7: Crea assets/

Crea la cartella vuota `assets/` per immagini specifiche della presentazione.

### Step 8: Aggiorna presentations.json

Aggiungi un nuovo oggetto all'array in `presentations.json` nella root del progetto. Senza questo step la presentazione non sarà visibile nel launcher (`index.html`).

```json
{
  "folder": "presentazioni/<folder-name>",
  "title": "<titolo della cover>",
  "subtitle": "<sottotitolo della cover>",
  "category": "<categoria, es. Enterprise / Formazione / Demo>",
  "division": "<divisione OT, es. SYS-FASHION>",
  "slideCount": <numero di slide>,
  "authors": ["Nome Cognome"],
  "createdAt": "<YYYY-MM-DD>",
  "updatedAt": "<YYYY-MM-DD>"
}
```

## Regole di design

### Slide di contenuto — OBBLIGATORIO
- Classe `content-slide` su ogni slide non-cover/non-closing
- `slide-label` (sezione) + `h2.slide-title` (titolo) + `p.section-desc` (descrizione) come primi 3 elementi
- La `section-desc` è OBBLIGATORIA dopo il `slide-title` (previene il bug del margin-top:auto)
- Footer come ultimo elemento

### Icone — SVG Lucide-style
- Usare sempre icone SVG inline (stroke-based, 18x18 o 14x14)
- Wrapper con classe `.icon.orange`, `.icon.blue`, `.icon.green`, `.icon.purple`
- MAI usare emoji nelle slide

### Componenti disponibili (da shared/style.css)
- `.card-grid` + `.card` — griglia di card con icone
- `.two-col` — layout a due colonne
- `.timeline-vertical` + `.timeline-item` + `.timeline-dot` — timeline verticale
- `.overview-grid` + `.day-card` — griglia panoramica (3 colonne con bordo colorato top)
- `.theme-grid` + `.theme-card` — griglia di card tematiche
- `.tip-box` — box evidenziato con bordo laterale
- `.checklist` — lista con bullet rossi
- `.kv-row` + `.kv` — metriche chiave (numero grande + label)
- `.tags` + `.tag` — pill/tag in monospace
- `.big-number` — numero grande decorativo
- `.cmd-table` — tabella comandi (monospace a sinistra)
- `.logo-bar` — logo OT Consulting con divisione

### Script — OBBLIGATORIO
- `shared/nav.js` — navigazione (keyboard, touch, dots)
- `shared/pptx.js` — bottone PPTX auto-iniettato + export (NON aggiungere HTML per il bottone, pptx.js lo fa da solo)
- Script aggiuntivi specifici della presentazione vanno in file `.js` separati nella cartella del progetto

### Numerazione slide
- `data-slide` DEVE essere sequenziale da 0 a N
- Il counter nel nav DEVE essere `1 / {{N+1}}`

## Regole per la slide Team

### Derivazione dati dall'email
Da `nome.cognome@dominio.com`:
- **Nome**: capitalize della parte prima del punto → `Nome`
- **Cognome**: capitalize della parte dopo il punto → `Cognome`
- **Filename foto**: concatenazione lowercase senza separatori → `nomecognome`
- **Iniziali (alt)**: prima lettera di nome + prima lettera di cognome maiuscole → `NC`

### Ricerca foto
Controlla l'esistenza del file in `shared/assets/foto/` con le estensioni `.png`, `.webp`, `.jpg` (in quest'ordine). Usa la prima trovata. Se nessuna esiste, usa un `<div>` con le iniziali al posto dell'`<img>`.

### Badge
Il badge (`.ch-badge`) è libero — può essere un ruolo (es. "AI Ambassador", "Team Lead", "Developer") o omesso. Di default usare il team/divisione come badge.

### Layout griglia
La griglia `.ambassadors` usa `repeat(auto-fit, minmax(14rem, 1fr))` quindi si adatta automaticamente al numero di autori (1, 2, 3 o più).

## Esempio di invocazione

### Con autori e descrizione:
```
/presentazione-ot proposta-cloud-migration
> Quale team/divisione OT Consulting? CLOUD-OPS
> Email degli autori? mario.rossi@otconsulting.com, anna.verdi@otconsulting.com
> Breve descrizione? Proposta di migrazione infrastruttura on-prem verso AWS per il cliente XYZ
```
→ Genera: cover + slide Team (2 autori) + 3-6 slide di contenuto + closing

### Senza autori, con descrizione:
```
/presentazione-ot intro-claude
> Quale team/divisione OT Consulting? (Invio)
> Email degli autori? (Invio)
> Breve descrizione? Introduzione a Claude per sviluppatori
```
→ Genera: cover + 3-6 slide di contenuto + closing

### Senza nulla (scaffolding minimo):
```
/presentazione-ot template-vuoto
> Quale team/divisione OT Consulting? DATA-ENGINEERING
> Email degli autori? (Invio)
> Breve descrizione? (Invio)
```
→ Genera: cover + closing (solo 2 slide)

## Migrazione di una presentazione esistente

Per applicare un nuovo tema a una presentazione già creata:

```
/presentazione-ot nome-presentazione --migra --tema minimal-v1
```

Prima di sovrascrivere, la skill DEVE:
1. Avvisare l'utente che `index.html` verrà sovrascritto
2. Chiedere conferma esplicita: **"Sei sicuro di voler sovrascrivere index.html? (s/n)"**
3. Se confermato: rigenerare `index.html` usando i partial del nuovo tema
4. `style.css` e `assets/` NON vengono mai toccati dalla migrazione
