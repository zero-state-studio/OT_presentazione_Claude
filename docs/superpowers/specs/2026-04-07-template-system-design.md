# Template System per Presentazioni OT Consulting

**Data:** 2026-04-07  
**Stato:** Approvato  
**Repository:** OT_presentazione_Claude

---

## Obiettivo

Permettere la creazione di presentazioni OT Consulting con temi grafici alternativi e completamente customizzabili, mantenendo la retrocompatibilità con le presentazioni esistenti. Il tema è selezionabile dall'utente al momento della creazione tramite la skill `/presentazione-ot`.

---

## 1. Struttura Repository

```
themes/
├── standard/                  # Tema attuale (estratto da shared/)
│   └── v1/
│       ├── meta.json
│       ├── theme.css
│       ├── theme.js           # (assente se non serve)
│       ├── variants/
│       │   ├── sys-fashion.css
│       │   └── data-engineering.css
│       └── partials/
│           ├── cover.html
│           ├── team.html
│           ├── content-slide.html
│           └── closing.html
├── minimal/
│   ├── v1/
│   │   ├── meta.json
│   │   ├── theme.css
│   │   ├── theme.js
│   │   ├── variants/
│   │   └── partials/
│   └── v2/
│       └── ...
└── dark/
    └── v1/
        └── ...

shared/
├── style.css                  # CSS base (invariato)
├── nav.js
├── pptx.js
└── assets/

presentazioni/
├── claude-for-ot/             # Presentazione esistente (invariata)
├── claude-formazione/         # Presentazione esistente (invariata)
└── nuova-presentazione/       # Generata con tema scelto
    ├── index.html
    ├── style.css
    └── assets/
```

---

## 2. Anatomia di un Tema

### `meta.json`

```json
{
  "name": "minimal",
  "version": "v1",
  "description": "Layout pulito, tipografia dominante, minimo uso di decorazioni",
  "variants": ["sys-fashion", "data-engineering"],
  "author": "OT Consulting"
}
```

### Ordine di caricamento CSS (da `index.html`)

```html
<link rel="stylesheet" href="../../shared/style.css">          <!-- Base invariabile -->
<link rel="stylesheet" href="../../themes/minimal/v1/theme.css"> <!-- Sovrascrive base -->
<link rel="stylesheet" href="../../themes/minimal/v1/variants/sys-fashion.css"> <!-- Colori/font divisione -->
<link rel="stylesheet" href="style.css">                        <!-- Override specifici della presentazione -->
```

### Ordine di caricamento JS (da `index.html`)

```html
<script src="../../shared/nav.js"></script>
<script src="../../themes/minimal/v1/theme.js"></script>  <!-- Omesso se il file non esiste -->
<script src="../../shared/pptx.js"></script>
```

### Partial HTML (`partials/*.html`)

I partial contengono frammenti HTML con placeholder `{{VARIABILE}}` che la skill sostituisce al momento della generazione. Non sono file caricati a runtime: vengono letti dalla skill e il loro contenuto viene scritto staticamente in `index.html`.

**Partial obbligatori per ogni tema:**
- `cover.html` — slide cover (data-slide="0")
- `team.html` — slide team (opzionale, inclusa se ci sono autori)
- `content-slide.html` — template per slide di contenuto generico
- `closing.html` — slide finale

**Variabili disponibili per i partial:**

| Variabile | Descrizione |
|-----------|-------------|
| `{{TITOLO}}` | Titolo della presentazione (tag `<title>`) |
| `{{TITOLO_HERO}}` | Prima parte del titolo nella cover |
| `{{PAROLA_ACCENT}}` | Parola in evidenza (span.highlight) |
| `{{SOTTOTITOLO}}` | Sottotitolo della cover |
| `{{TEAM_NAME}}` | Nome divisione OT (es. SYS-FASHION) |
| `{{CLOSING_LABEL}}` | Label slide closing |
| `{{CLOSING_TITLE}}` | Titolo slide closing |
| `{{CLOSING_ACCENT}}` | Parola in evidenza nel closing |
| `{{CLOSING_SUBTITLE}}` | Sottotitolo closing |
| `{{AUTORI_HTML}}` | Blocco HTML autori generato dalla skill |
| `{{N}}` | Numero progressivo della slide (data-slide) |
| `{{SEZIONE}}` | Label sezione (slide-label) |
| `{{TITOLO_SLIDE}}` | Titolo della slide di contenuto |
| `{{DESCRIZIONE}}` | Paragrafo descrittivo della slide |
| `{{CONTENUTO}}` | Blocco componenti (card-grid, timeline, ecc.) |
| `{{SLIDE_FOOTER}}` | Footer HTML della slide |

### `variants/*.css`

Ogni variante sovrascrive esclusivamente i CSS custom properties del tema, per adattare colori, font o proporzioni specifiche di una divisione:

```css
/* variants/sys-fashion.css */
:root {
  --accent: #E60000;
  --accent-secondary: #ff4444;
  /* eventuali font o spaziature specifiche */
}
```

---

## 3. Integrazione con la Skill `/presentazione-ot`

### Parametro tema

Il tema può essere passato come parametro al momento dell'invocazione:

```
/presentazione-ot nome-presentazione --tema minimal-v1
/presentazione-ot nome-presentazione --tema dark-v2 --variante sys-fashion
```

Se non specificato come parametro, la skill presenta una selezione interattiva:

```
Quale tema grafico vuoi usare?
1. Standard (tema OT Consulting attuale)
2. Minimal v1 — Layout pulito, tipografia dominante
3. Dark v1 — Sfondo scuro, contrasto elevato
> 1
```

### Flusso completo della skill (aggiornato)

1. Chiedi nome presentazione (se non in parametro)
2. Chiedi tema (se non in parametro `--tema`)
3. Chiedi divisione/team
4. Chiedi email autori
5. Chiedi dove mostrare il team (Home / Slide separata) — solo se autori forniti
6. Chiedi descrizione presentazione
7. Leggi i partial del tema scelto da `themes/<nome>/<versione>/partials/`
8. Genera `index.html` sostituendo i placeholder
9. Genera `style.css` con override vuoto + eventuali CSS per la slide Team
10. Crea `assets/`

### Generazione HTML dalla skill

La skill **non usa template statici hardcodati nel SKILL.md** per i temi non-standard. Invece:

1. Legge `themes/<nome>/<versione>/partials/cover.html`
2. Sostituisce i placeholder `{{VARIABILE}}` con i valori raccolti
3. Inserisce il risultato in `index.html`
4. Ripete per team, ogni slide di contenuto, closing

Per il tema `standard`, la skill mantiene il template attuale nel SKILL.md come fallback (retrocompatibilità).

### Generazione slide di contenuto

Se l'utente ha fornito una descrizione, la skill genera 3-6 slide di contenuto usando il partial `content-slide.html` del tema scelto. Il contenuto specifico (componenti, testi) viene generato dalla skill in base alla descrizione, rispettando i componenti disponibili nel tema.

### Migrazione di una presentazione esistente a un nuovo tema

La migrazione è una rigenerazione completa:

```
/presentazione-ot nome-presentazione --migra --tema minimal-v2
```

La skill sovrascrive `index.html` con i nuovi partial. L'utente deve confermare esplicitamente prima della sovrascrittura. `style.css` e `assets/` vengono preservati.

---

## 4. Tema Standard e Retrocompatibilità

### Estrazione del tema standard

Il tema `standard/v1` viene creato estraendo le definizioni visive dal `shared/style.css` attuale:
- `theme.css`: override alle variabili base (--accent, font declarations, decorazioni cover)
- `partials/`: cover e closing con la struttura attuale (decorazioni cerchi, logo-bar)
- Nessun `theme.js`

`shared/style.css` rimane **invariato**: contiene solo CSS utility/base applicabili a qualsiasi tema.

### Presentazioni esistenti

Le presentazioni in `presentazioni/claude-for-ot/` e `presentazioni/claude-formazione/` **non vengono toccate**. Continuano a usare `shared/style.css` direttamente e rimangono funzionanti.

### Versioning

| Tipo di cambiamento | Strategia |
|---------------------|-----------|
| Fix CSS/JS minore | Aggiornato nel file esistente (stesso numero versione) |
| Cambiamento visivo significativo | Nuova versione (`v2`) — le presentazioni su `v1` non sono impattate |
| Breaking change (struttura HTML partial) | Nuovo numero versione obbligatorio |

Le presentazioni che usano un tema fisso (es. `minimal/v1`) non ricevono mai aggiornamenti automatici: il numero di versione nel path `index.html` garantisce stabilità totale.

---

## 5. Considerazioni Tecniche

### Nessun build step

Il sistema funziona interamente a runtime nel browser. I partial sono processati dalla skill (Claude) al momento della generazione, non da uno script Node.js o un bundler.

### Compatibilità con `pptx.js`

`shared/pptx.js` rimane invariato e funziona con qualsiasi tema, poiché cattura l'intera pagina viewport.

### Compatibilità con `nav.js`

`shared/nav.js` dipende da `data-slide` numerati sequenzialmente — questo vincolo vale per tutti i temi e deve essere rispettato nei partial.

### Temi con `theme.js`

Se un tema richiede comportamenti JavaScript specifici (es. animazioni custom, componenti interattivi), il file `theme.js` viene caricato tra `nav.js` e `pptx.js`. Può esporre funzioni globali o auto-eseguirsi. Non può ridefinire le funzioni di `nav.js` (`go`, `goTo`, `cur`, `total`).
