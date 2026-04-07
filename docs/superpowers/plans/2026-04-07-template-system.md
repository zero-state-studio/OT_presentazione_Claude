# Template System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementare un sistema di temi/template selezionabili per le presentazioni OT Consulting, permettendo alla skill `/presentazione-ot` di generare presentazioni con aspetti grafici completamente diversi.

**Architecture:** Ogni tema vive in `themes/<name>/<version>/` con un `theme.css`, partial HTML (`cover.html`, `team.html`, `content-slide.html`, `closing.html`), varianti di divisione (`variants/*.css`) e un opzionale `theme.js`. La skill legge i partial dal tema scelto e li inietta staticamente in `index.html`. Le cartelle `shared/` e le presentazioni esistenti non vengono mai toccate.

**Tech Stack:** HTML statico, CSS (cascade layers tramite ordine `<link>`), partial HTML con placeholder `{{VAR}}`, Claude Code skill (SKILL.md)

---

## File Map

| Operazione | File |
|-----------|------|
| Crea | `themes/standard/v1/meta.json` |
| Crea | `themes/standard/v1/theme.css` |
| Crea | `themes/standard/v1/variants/sys-fashion.css` |
| Crea | `themes/standard/v1/variants/data-engineering.css` |
| Crea | `themes/standard/v1/partials/cover.html` |
| Crea | `themes/standard/v1/partials/team.html` |
| Crea | `themes/standard/v1/partials/content-slide.html` |
| Crea | `themes/standard/v1/partials/closing.html` |
| Crea | `themes/minimal/v1/meta.json` |
| Crea | `themes/minimal/v1/theme.css` |
| Crea | `themes/minimal/v1/variants/sys-fashion.css` |
| Crea | `themes/minimal/v1/variants/data-engineering.css` |
| Crea | `themes/minimal/v1/partials/cover.html` |
| Crea | `themes/minimal/v1/partials/team.html` |
| Crea | `themes/minimal/v1/partials/content-slide.html` |
| Crea | `themes/minimal/v1/partials/closing.html` |
| Modifica | `.claude/skills/presentazione-ot/SKILL.md` |

---

## Task 1: Scaffold themes/standard/v1

Crea la struttura del tema Standard — il tema attuale OT Consulting. Il suo `theme.css` è intenzionalmente quasi vuoto perché `shared/style.css` già contiene tutti gli stili standard.

**Files:**
- Crea: `themes/standard/v1/meta.json`
- Crea: `themes/standard/v1/theme.css`
- Crea: `themes/standard/v1/variants/sys-fashion.css`
- Crea: `themes/standard/v1/variants/data-engineering.css`

- [ ] **Step 1: Crea la cartella e meta.json**

```bash
mkdir -p themes/standard/v1/variants themes/standard/v1/partials
```

Crea `themes/standard/v1/meta.json`:
```json
{
  "name": "standard",
  "version": "v1",
  "description": "Tema OT Consulting standard: sfondo bianco, accent rosso, cerchi decorativi in cover, barra rossa sotto i titoli",
  "variants": ["sys-fashion", "data-engineering"],
  "hasJs": false,
  "author": "OT Consulting"
}
```

- [ ] **Step 2: Crea theme.css**

Il tema Standard è definito interamente da `shared/style.css`. Questo file è quasi vuoto per design — non duplicare stili.

Crea `themes/standard/v1/theme.css`:
```css
/* ══════════════════════════════════════════
   themes/standard/v1/theme.css
   Tema Standard OT Consulting.

   Tutti gli stili visivi di questo tema vivono già in shared/style.css.
   Questo file è intentionally quasi vuoto: aggiungere qui SOLO override
   che distinguono la versione v1 del tema standard da shared/style.css.
   ══════════════════════════════════════════ */
```

- [ ] **Step 3: Crea le varianti di divisione**

Crea `themes/standard/v1/variants/sys-fashion.css`:
```css
/* ══════════════════════════════════════════
   themes/standard/v1/variants/sys-fashion.css
   Override per la divisione SYS-FASHION.
   Sovrascrive solo CSS custom properties.
   ══════════════════════════════════════════ */

:root {
  /* SYS-FASHION usa l'accent rosso standard OT */
  /* Aggiungere qui eventuali override specifici della divisione */
}
```

Crea `themes/standard/v1/variants/data-engineering.css`:
```css
/* ══════════════════════════════════════════
   themes/standard/v1/variants/data-engineering.css
   Override per la divisione DATA-ENGINEERING.
   Sovrascrive solo CSS custom properties.
   ══════════════════════════════════════════ */

:root {
  /* DATA-ENGINEERING usa l'accent rosso standard OT */
  /* Aggiungere qui eventuali override specifici della divisione */
}
```

- [ ] **Step 4: Verifica la struttura**

```bash
find themes/standard -type f | sort
```

Output atteso:
```
themes/standard/v1/meta.json
themes/standard/v1/theme.css
themes/standard/v1/variants/data-engineering.css
themes/standard/v1/variants/sys-fashion.css
```
(La cartella `partials/` è creata ma vuota — viene popolata nel Task 2)

- [ ] **Step 5: Commit**

```bash
git add themes/standard/
git commit -m "feat: scaffold themes/standard/v1 structure (meta, CSS, variants)"
```

---

## Task 2: Partial HTML del tema Standard

I partial sono frammenti HTML puri (senza DOCTYPE/html/head/body) con placeholder `{{VAR}}`. La skill li legge e sostituisce i placeholder prima di scriverli in `index.html`.

**Placeholder usati nei partial:**
- `{{TITOLO_HERO}}` — prima parte del titolo cover
- `{{PAROLA_ACCENT}}` — parola in evidenza (span.highlight) nella cover/closing
- `{{SOTTOTITOLO}}` — sottotitolo della cover
- `{{METRICS_HTML}}` — blocco `.metrics` completo, oppure stringa vuota
- `{{COVER_TEAM_HTML}}` — blocco `.cover-team` completo, oppure stringa vuota
- `{{TEAM_NAME_FRAG}}` — `<br><small class="ot-division">NOME</small>` oppure stringa vuota
- `{{N}}` — numero data-slide (intero)
- `{{SEZIONE}}` — label sezione (slide-label)
- `{{TITOLO_SLIDE}}` — titolo slide di contenuto
- `{{DESCRIZIONE}}` — paragrafo descrittivo
- `{{CONTENUTO}}` — blocco componenti generato dalla skill
- `{{SLIDE_FOOTER}}` — footer HTML della slide
- `{{CLOSING_LABEL}}` — label closing
- `{{CLOSING_TITLE}}` — prima parte titolo closing
- `{{CLOSING_ACCENT}}` — parola accent closing

**Files:**
- Crea: `themes/standard/v1/partials/cover.html`
- Crea: `themes/standard/v1/partials/team.html`
- Crea: `themes/standard/v1/partials/content-slide.html`
- Crea: `themes/standard/v1/partials/closing.html`

- [ ] **Step 1: Crea cover.html**

Questo è il frammento della slide 0 del tema Standard (con cerchi decorativi, dot-grid e z-index sugli elementi).

Crea `themes/standard/v1/partials/cover.html`:
```html
<div class="slide active" data-slide="0" style="align-items:flex-start;justify-content:center;padding:4rem">
  <div class="cover-deco-tl"></div>
  <div class="cover-deco-br"></div>
  <div class="cover-dot-grid">
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
    <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
  <h1 style="position:relative;z-index:2" class="hero-title anim d1">{{TITOLO_HERO}} <span class="highlight">{{PAROLA_ACCENT}}</span></h1>
  <p class="subtitle anim d2" style="position:relative;z-index:2">{{SOTTOTITOLO}}</p>
  {{METRICS_HTML}}
  {{COVER_TEAM_HTML}}
  <div class="logo-bar anim d5" style="position:relative;z-index:2">
    <div class="ot-mark"><img src="../../shared/assets/OT.png" alt="OT"></div>
    <div class="ot-company">OT Consulting{{TEAM_NAME_FRAG}}</div>
  </div>
</div>
```

**Nota per la skill:** Se `{{METRICS_HTML}}` è presente, usare `class="anim d3"` sull'elemento `.metrics`. Se `{{COVER_TEAM_HTML}}` è presente, usare `class="anim d4"` sul `.cover-team`. Se entrambi assenti, il logo-bar rimane su `d5` senza problemi (gap nell'animazione è accettabile).

- [ ] **Step 2: Crea team.html**

Questo è il frammento della slide Team separata. La skill sostituisce `{{N}}` con il numero progressivo della slide e `{{AUTORI_HTML}}` con i blocchi `.ambassador` generati per ogni autore.

Crea `themes/standard/v1/partials/team.html`:
```html
<div class="slide content-slide" data-slide="{{N}}">
  <div class="slide-label">Il team</div>
  <h2 class="slide-title">Gli autori</h2>
  <p class="section-desc">Le persone che hanno realizzato questa presentazione.</p>
  <div class="ambassadors">
    {{AUTORI_HTML}}
  </div>
  {{SLIDE_FOOTER}}
</div>
```

**Blocco autore (la skill genera questo per ogni autore e lo concatena in `{{AUTORI_HTML}}`):**
```html
<div class="ambassador">
  <div class="avatar">
    <img class="avatar-inner" src="../../shared/assets/foto/{{FILENAME}}.{{EXT}}" alt="{{INIZIALI}}">
  </div>
  <div class="ch-name">{{COGNOME}} {{NOME}}</div>
  <div class="ch-role">{{EMAIL}}</div>
  <div class="ch-badge">{{TEAM_NAME}}</div>
</div>
```

**Blocco autore senza foto (quando il file non esiste in shared/assets/foto/):**
```html
<div class="ambassador">
  <div class="avatar">
    <div class="avatar-inner">{{INIZIALI}}</div>
  </div>
  <div class="ch-name">{{COGNOME}} {{NOME}}</div>
  <div class="ch-role">{{EMAIL}}</div>
  <div class="ch-badge">{{TEAM_NAME}}</div>
</div>
```

- [ ] **Step 3: Crea content-slide.html**

Template per una slide di contenuto generica. La skill usa questo partial per ogni slide di contenuto, sostituendo `{{CONTENUTO}}` con i componenti appropriati (card-grid, two-col, ecc.).

Crea `themes/standard/v1/partials/content-slide.html`:
```html
<div class="slide content-slide" data-slide="{{N}}">
  <div class="slide-label">{{SEZIONE}}</div>
  <h2 class="slide-title">{{TITOLO_SLIDE}}</h2>
  <p class="section-desc">{{DESCRIZIONE}}</p>
  {{CONTENUTO}}
  {{SLIDE_FOOTER}}
</div>
```

- [ ] **Step 4: Crea closing.html**

Crea `themes/standard/v1/partials/closing.html`:
```html
<div class="slide" data-slide="{{N}}" style="align-items:flex-start;justify-content:center;padding:4rem">
  <div class="cover-deco-tl"></div>
  <div class="cover-deco-br"></div>
  <div class="slide-label" style="position:relative;z-index:2">{{CLOSING_LABEL}}</div>
  <h1 class="hero-title" style="position:relative;z-index:2">{{CLOSING_TITLE}} <span class="highlight">{{CLOSING_ACCENT}}</span></h1>
  <p class="subtitle" style="position:relative;z-index:2">{{CLOSING_SUBTITLE}}</p>
  <div class="logo-bar" style="position:relative;z-index:2;margin-top:2rem">
    <div class="ot-mark"><img src="../../shared/assets/OT.png" alt="OT"></div>
    <div class="ot-company">OT Consulting{{TEAM_NAME_FRAG}}</div>
  </div>
</div>
```

- [ ] **Step 5: Verifica la struttura**

```bash
find themes/standard/v1/partials -type f | sort
```

Output atteso:
```
themes/standard/v1/partials/closing.html
themes/standard/v1/partials/content-slide.html
themes/standard/v1/partials/cover.html
themes/standard/v1/partials/team.html
```

- [ ] **Step 6: Commit**

```bash
git add themes/standard/v1/partials/
git commit -m "feat: add standard/v1 HTML partials (cover, team, content-slide, closing)"
```

---

## Task 3: Scaffold themes/minimal/v1

Il tema Minimal usa un layout pulito senza le decorazioni circolari della cover. La differenziazione visiva avviene solo tramite CSS — la struttura HTML dei partial è quasi identica allo standard, ma senza i cerchi e il dot-grid.

**Files:**
- Crea: `themes/minimal/v1/meta.json`
- Crea: `themes/minimal/v1/theme.css`
- Crea: `themes/minimal/v1/variants/sys-fashion.css`
- Crea: `themes/minimal/v1/variants/data-engineering.css`

- [ ] **Step 1: Crea la cartella e meta.json**

```bash
mkdir -p themes/minimal/v1/variants themes/minimal/v1/partials
```

Crea `themes/minimal/v1/meta.json`:
```json
{
  "name": "minimal",
  "version": "v1",
  "description": "Layout pulito, tipografia dominante, nessuna decorazione circolare, barra titolo sottile",
  "variants": ["sys-fashion", "data-engineering"],
  "hasJs": false,
  "author": "OT Consulting"
}
```

- [ ] **Step 2: Crea theme.css**

Questo CSS sovrascrive le regole visive del tema Standard ridefinendo le decorazioni della cover e il trattamento del titolo delle slide.

Crea `themes/minimal/v1/theme.css`:
```css
/* ══════════════════════════════════════════
   themes/minimal/v1/theme.css
   Tema Minimal OT Consulting.
   Override di shared/style.css per un look
   pulito, tipografico, senza decorazioni.
   ══════════════════════════════════════════ */

/* Cover: nessuna decorazione circolare */
.cover-deco-tl,
.cover-deco-br,
.cover-dot-grid {
  display: none;
}

/* Cover: separatore orizzontale sopra il logo OT */
.logo-bar {
  border-top: 1px solid var(--border);
  padding-top: 1.25rem;
  width: 100%;
}

/* Hero title: lettering più stretto, look editoriale */
.hero-title {
  letter-spacing: -0.02em;
}

/* Slide title: barra sottile 2px invece del bar spesso */
.slide-title::after {
  width: 2.5rem;
  height: 2px;
  background: var(--accent);
  border-radius: 0;
}
```

- [ ] **Step 3: Crea le varianti di divisione**

Crea `themes/minimal/v1/variants/sys-fashion.css`:
```css
/* ══════════════════════════════════════════
   themes/minimal/v1/variants/sys-fashion.css
   Override per la divisione SYS-FASHION nel tema Minimal.
   ══════════════════════════════════════════ */

:root {
  /* Aggiungere qui eventuali override specifici della divisione */
}
```

Crea `themes/minimal/v1/variants/data-engineering.css`:
```css
/* ══════════════════════════════════════════
   themes/minimal/v1/variants/data-engineering.css
   Override per la divisione DATA-ENGINEERING nel tema Minimal.
   ══════════════════════════════════════════ */

:root {
  /* Aggiungere qui eventuali override specifici della divisione */
}
```

- [ ] **Step 4: Verifica**

```bash
find themes/minimal -type f | sort
```

Output atteso:
```
themes/minimal/v1/meta.json
themes/minimal/v1/theme.css
themes/minimal/v1/variants/data-engineering.css
themes/minimal/v1/variants/sys-fashion.css
```

- [ ] **Step 5: Commit**

```bash
git add themes/minimal/
git commit -m "feat: scaffold themes/minimal/v1 (meta, CSS, variants)"
```

---

## Task 4: Partial HTML del tema Minimal

I partial del tema Minimal differiscono dallo Standard per l'assenza delle decorazioni nella cover/closing. Il `content-slide.html` e `team.html` sono identici allo standard (la differenziazione è CSS-only).

**Files:**
- Crea: `themes/minimal/v1/partials/cover.html`
- Crea: `themes/minimal/v1/partials/team.html`
- Crea: `themes/minimal/v1/partials/content-slide.html`
- Crea: `themes/minimal/v1/partials/closing.html`

- [ ] **Step 1: Crea cover.html (senza decorazioni)**

Nessun `.cover-deco-tl`, `.cover-deco-br`, `.cover-dot-grid`. Nessun `style="position:relative;z-index:2"` sugli elementi figlio (non c'è nulla da sovrapporre).

Crea `themes/minimal/v1/partials/cover.html`:
```html
<div class="slide active" data-slide="0" style="align-items:flex-start;justify-content:center;padding:4rem">
  <h1 class="hero-title anim d1">{{TITOLO_HERO}} <span class="highlight">{{PAROLA_ACCENT}}</span></h1>
  <p class="subtitle anim d2">{{SOTTOTITOLO}}</p>
  {{METRICS_HTML}}
  {{COVER_TEAM_HTML}}
  <div class="logo-bar anim d5">
    <div class="ot-mark"><img src="../../shared/assets/OT.png" alt="OT"></div>
    <div class="ot-company">OT Consulting{{TEAM_NAME_FRAG}}</div>
  </div>
</div>
```

- [ ] **Step 2: Crea team.html (identico a standard)**

Crea `themes/minimal/v1/partials/team.html`:
```html
<div class="slide content-slide" data-slide="{{N}}">
  <div class="slide-label">Il team</div>
  <h2 class="slide-title">Gli autori</h2>
  <p class="section-desc">Le persone che hanno realizzato questa presentazione.</p>
  <div class="ambassadors">
    {{AUTORI_HTML}}
  </div>
  {{SLIDE_FOOTER}}
</div>
```

- [ ] **Step 3: Crea content-slide.html (identico a standard)**

Crea `themes/minimal/v1/partials/content-slide.html`:
```html
<div class="slide content-slide" data-slide="{{N}}">
  <div class="slide-label">{{SEZIONE}}</div>
  <h2 class="slide-title">{{TITOLO_SLIDE}}</h2>
  <p class="section-desc">{{DESCRIZIONE}}</p>
  {{CONTENUTO}}
  {{SLIDE_FOOTER}}
</div>
```

- [ ] **Step 4: Crea closing.html (senza decorazioni)**

Crea `themes/minimal/v1/partials/closing.html`:
```html
<div class="slide" data-slide="{{N}}" style="align-items:flex-start;justify-content:center;padding:4rem">
  <div class="slide-label">{{CLOSING_LABEL}}</div>
  <h1 class="hero-title">{{CLOSING_TITLE}} <span class="highlight">{{CLOSING_ACCENT}}</span></h1>
  <p class="subtitle">{{CLOSING_SUBTITLE}}</p>
  <div class="logo-bar" style="margin-top:2rem">
    <div class="ot-mark"><img src="../../shared/assets/OT.png" alt="OT"></div>
    <div class="ot-company">OT Consulting{{TEAM_NAME_FRAG}}</div>
  </div>
</div>
```

- [ ] **Step 5: Commit**

```bash
git add themes/minimal/v1/partials/
git commit -m "feat: add minimal/v1 HTML partials (cover, team, content-slide, closing)"
```

---

## Task 5: Aggiornare SKILL.md

Questo è il task più importante: aggiornare la skill per supportare la selezione del tema, la lettura dei partial e il nuovo ordine di caricamento CSS/JS in `index.html`.

**File:**
- Modifica: `.claude/skills/presentazione-ot/SKILL.md`

Leggere il file per capire la struttura corrente prima di modificare.

- [ ] **Step 1: Aggiungi la selezione tema (nuovo Step 0)**

Subito dopo l'intestazione "## Flusso" e prima di "### Step 1: Chiedi il team", inserire:

```markdown
### Step 0: Seleziona il tema

Controlla se l'utente ha passato `--tema <nome>-<versione>` nell'invocazione (es. `/presentazione-ot mia-pres --tema minimal-v1`).

**Se `--tema` è presente nel comando:**
- Estrai nome e versione: `minimal-v1` → nome=`minimal`, versione=`v1`
- Verifica che esista `themes/<nome>/<versione>/meta.json`. Se non esiste, informa l'utente e mostra i temi disponibili.
- Memorizza il percorso tema: `TEMA_PATH = <nome>/<versione>` (es. `minimal/v1`)

**Se `--tema` è assente:**
- Leggi `meta.json` di tutti i temi disponibili enumerando `themes/*/` (usa Glob su `themes/*/meta.json`)
- Presenta la selezione:

> **Quale tema grafico vuoi usare?**
> 1. Standard v1 — Tema OT Consulting attuale (cerchi decorativi, barra rossa)
> 2. Minimal v1 — Layout pulito, tipografia dominante, nessuna decorazione
> _(aggiungi voci per ogni meta.json trovato, ordinati per nome+versione)_

Attendi la risposta numerica. Memorizza `TEMA_PATH` (es. `standard/v1` o `minimal/v1`).

**Variante di divisione:**
Se l'utente ha passato `--variante <nome>` (es. `--variante sys-fashion`):
- Verifica che esista `themes/{{TEMA_PATH}}/variants/<nome>.css`
- Memorizza `VARIANTE = <nome>`

In assenza di `--variante`, non caricare nessuna variante CSS (lascia `VARIANTE` vuoto).
```

- [ ] **Step 2: Aggiorna il template `<head>` in Step 4**

Trova nel SKILL.md la sezione "Step 4: Genera index.html" e il template HTML. Aggiorna il blocco `<head>` sostituendo:

```html
<link rel="stylesheet" href="../../shared/style.css">
<link rel="stylesheet" href="style.css">
```

con:

```html
<link rel="stylesheet" href="../../shared/style.css">
<link rel="stylesheet" href="../../themes/{{TEMA_PATH}}/theme.css">
{{VARIANT_LINK}}
<link rel="stylesheet" href="style.css">
```

Dove `{{VARIANT_LINK}}` viene sostituito con:
- `<link rel="stylesheet" href="../../themes/{{TEMA_PATH}}/variants/{{VARIANTE}}.css">` se `VARIANTE` è definita
- Stringa vuota se non c'è variante

- [ ] **Step 3: Aggiorna il blocco script in Step 4**

Trova il blocco script finale nel template HTML e sostituisci:

```html
<script src="../../shared/nav.js"></script>
<script src="../../shared/pptx.js"></script>
```

con:

```html
<script src="../../shared/nav.js"></script>
{{THEME_JS}}
<script src="../../shared/pptx.js"></script>
```

Dove `{{THEME_JS}}` viene sostituito con:
- `<script src="../../themes/{{TEMA_PATH}}/theme.js"></script>` se il file `themes/{{TEMA_PATH}}/theme.js` esiste (verificare con Read o Glob)
- Stringa vuota se non esiste

- [ ] **Step 4: Sostituisci la generazione slide con lettura dei partial**

Trovare nel SKILL.md la sezione "### Step 4: Genera index.html" che contiene la seguente istruzione:

> "Il file HTML DEVE seguire questa struttura esatta. Non improvvisare — usa il template sotto."

Sostituire quella sezione (l'istruzione + il template HTML hardcodato di cover, team, slide contenuto, closing) con:

```markdown
### Step 4: Genera index.html

Il file HTML si costruisce così:

1. **Leggi i partial** del tema scelto dalla cartella `themes/{{TEMA_PATH}}/partials/`:
   - `cover.html` — sempre incluso come slide 0
   - `team.html` — incluso solo se ci sono autori E l'utente ha scelto "Slide ad hoc"
   - `content-slide.html` — incluso una volta per ogni slide di contenuto generata
   - `closing.html` — sempre incluso come ultima slide

2. **Sostituisci i placeholder** `{{VAR}}` con i valori raccolti nei passi precedenti (vedi tabella placeholder nel design spec).

3. **Costruisci l'HTML completo** con questa struttura:

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

  [CONTENUTO DEI PARTIAL QUI — cover + team opzionale + slide contenuto + closing]

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
\```

**Placeholder opzionali nel partial cover.html:**
- `{{METRICS_HTML}}`: se l'utente non ha statistiche, sostituire con stringa vuota. Se sì, generare:
  ```html
  <div class="metrics anim d3" style="justify-content:flex-start;margin-top:2rem">
    <div class="metric"><div class="value">VAL</div><div class="label">LABEL</div></div>
    <!-- ripetere per ogni metrica -->
  </div>
  ```
- `{{COVER_TEAM_HTML}}`: se team è su "Slide ad hoc" o nessun autore, stringa vuota. Se "Home", generare:
  ```html
  <div class="cover-team anim d4">
    <div class="cover-team-member">
      <img src="../../shared/assets/foto/{{FILENAME}}.{{EXT}}" alt="{{INIZIALI}}">
      <div class="cover-team-member-name"><span>{{NOME}}</span><span>{{COGNOME}}</span></div>
    </div>
    <!-- ripetere per ogni membro -->
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
```

- [ ] **Step 5: Aggiungi la sezione migrazione**

Dopo la sezione "## Esempio di invocazione", aggiungere:

```markdown
## Migrazione di una presentazione esistente

Per applicare un nuovo tema a una presentazione già creata:

```
/presentazione-ot nome-presentazione --migra --tema minimal-v1
```

Prima di sovrascrivere, la skill DEVE:
1. Avvisare l'utente che `index.html` verrà sovrascritto
2. Chiedere conferma esplicita: **"Sei sicuro di voler sovrascrivere index.html? (s/n)"**
3. Se confermato: rigenerare `index.html` usando i partial del nuovo tema, mantenendo tutti i contenuti (titolo, autori, slide di contenuto) ma applicando il nuovo tema
4. `style.css` e `assets/` NON vengono mai toccati dalla migrazione
```

- [ ] **Step 6: Verifica la leggibilità del SKILL.md aggiornato**

Leggi il file modificato dall'inizio per assicurarti che:
- Il flusso Step 0 → Step 1 → Step 2 → Step 2b → Step 3 → Step 4 → ... sia coerente
- Non ci siano sezioni duplicate (es. due blocchi `<head>` template)
- Il template `index.html` nella sezione Step 4 non contenga il vecchio HTML hardcodato di cover/closing (deve essere solo la struttura shell con `[CONTENUTO DEI PARTIAL QUI]`)

- [ ] **Step 7: Commit**

```bash
git add .claude/skills/presentazione-ot/SKILL.md
git commit -m "feat: update presentazione-ot skill to support theme selection and partial-based generation"
```

---

## Task 6: Verifica retrocompatibilità

Le presentazioni esistenti (`claude-for-ot`, `claude-formazione`) non caricano alcun tema e devono continuare a funzionare identicamente.

- [ ] **Step 1: Verifica che i file delle presentazioni esistenti siano invariati**

```bash
git diff HEAD~1 presentazioni/
```

Output atteso: nessun diff (nessuna modifica alle presentazioni esistenti).

- [ ] **Step 2: Avvia un server locale e verifica visivamente**

```bash
python3 -m http.server 8000
```

Apri nel browser:
- `http://localhost:8000/presentazioni/claude-for-ot/` — deve caricarsi esattamente come prima
- `http://localhost:8000/presentazioni/claude-formazione/` — deve caricarsi esattamente come prima

Verificare:
- Cover slide: cerchi decorativi presenti, dot-grid visibile, animazioni funzionanti
- Navigazione con frecce e swipe funzionante
- Footer nelle slide di contenuto visibile
- Pulsante PPTX presente in basso a destra

- [ ] **Step 3: Verifica che il tema standard funzioni stand-alone**

Crea una presentazione di test minimale con tema standard per confermare il path CSS funzionante:

```bash
mkdir -p presentazioni/_test-standard/assets
```

Crea `presentazioni/_test-standard/index.html`:
```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Test Standard — OT Consulting</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../shared/style.css">
<link rel="stylesheet" href="../../themes/standard/v1/theme.css">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="progress" id="progress"></div>
<div class="deck" id="deck">
  <div class="slide active" data-slide="0" style="align-items:flex-start;justify-content:center;padding:4rem">
    <div class="cover-deco-tl"></div>
    <div class="cover-deco-br"></div>
    <div class="cover-dot-grid">
      <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
      <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
    </div>
    <h1 style="position:relative;z-index:2" class="hero-title anim d1">Test <span class="highlight">Standard</span></h1>
    <p class="subtitle anim d2" style="position:relative;z-index:2">Verifica del tema standard/v1.</p>
    <div class="logo-bar anim d5" style="position:relative;z-index:2">
      <div class="ot-mark"><img src="../../shared/assets/OT.png" alt="OT"></div>
      <div class="ot-company">OT Consulting</div>
    </div>
  </div>
  <div class="slide content-slide" data-slide="1">
    <div class="slide-label">Test</div>
    <h2 class="slide-title">Slide di contenuto</h2>
    <p class="section-desc">Verifica che la barra rossa sotto il titolo sia spessa (6px, gradiente).</p>
    <div class="slide-footer">
      <span class="copyright">&copy;OT Consulting. All rights reserved</span>
      <div class="ot-logo">
        <div class="ot-circle"><img src="../../shared/assets/OT.png" alt="OT"></div>
        <span class="ot-name">OT Consulting</span>
      </div>
    </div>
  </div>
</div>
<div class="nav">
  <button id="prev" onclick="go(-1)">&#x2039;</button>
  <div class="dots" id="dots"></div>
  <div class="counter" id="counter">1 / 2</div>
  <button id="next" onclick="go(1)">&#x203a;</button>
</div>
<div class="kbd-hint"><kbd>←</kbd> <kbd>→</kbd> per navigare</div>
<script src="../../shared/nav.js"></script>
<script src="../../shared/pptx.js"></script>
</body>
</html>
```

Crea `presentazioni/_test-standard/style.css`:
```css
/* Test Standard — override vuoto */
```

Apri `http://localhost:8000/presentazioni/_test-standard/` e verifica:
- Cover: cerchi rossi visibili, dot-grid visibile
- Slide 1: barra rossa spessa (6px, gradiente) sotto il titolo

- [ ] **Step 4: Verifica il tema minimal**

Crea `presentazioni/_test-minimal/assets/` e `presentazioni/_test-minimal/index.html`:

```html
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Test Minimal — OT Consulting</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;0,900;1,400;1,500&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../shared/style.css">
<link rel="stylesheet" href="../../themes/minimal/v1/theme.css">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="progress" id="progress"></div>
<div class="deck" id="deck">
  <div class="slide active" data-slide="0" style="align-items:flex-start;justify-content:center;padding:4rem">
    <h1 class="hero-title anim d1">Test <span class="highlight">Minimal</span></h1>
    <p class="subtitle anim d2">Verifica del tema minimal/v1: nessun cerchio, tipografia pulita.</p>
    <div class="logo-bar anim d5">
      <div class="ot-mark"><img src="../../shared/assets/OT.png" alt="OT"></div>
      <div class="ot-company">OT Consulting</div>
    </div>
  </div>
  <div class="slide content-slide" data-slide="1">
    <div class="slide-label">Test</div>
    <h2 class="slide-title">Slide di contenuto</h2>
    <p class="section-desc">Verifica che la barra sotto il titolo sia sottile (2px) e il logo-bar abbia il bordo superiore.</p>
    <div class="slide-footer">
      <span class="copyright">&copy;OT Consulting. All rights reserved</span>
      <div class="ot-logo">
        <div class="ot-circle"><img src="../../shared/assets/OT.png" alt="OT"></div>
        <span class="ot-name">OT Consulting</span>
      </div>
    </div>
  </div>
</div>
<div class="nav">
  <button id="prev" onclick="go(-1)">&#x2039;</button>
  <div class="dots" id="dots"></div>
  <div class="counter" id="counter">1 / 2</div>
  <button id="next" onclick="go(1)">&#x203a;</button>
</div>
<div class="kbd-hint"><kbd>←</kbd> <kbd>→</kbd> per navigare</div>
<script src="../../shared/nav.js"></script>
<script src="../../shared/pptx.js"></script>
</body>
</html>
```

Crea `presentazioni/_test-minimal/style.css`:
```css
/* Test Minimal — override vuoto */
```

Apri `http://localhost:8000/presentazioni/_test-minimal/` e verifica:
- Cover: **nessun** cerchio rosso, **nessun** dot-grid, hero-title con lettering stretto
- Logo-bar: bordo orizzontale superiore visibile
- Slide 1: barra sotto il titolo sottile (2px, solo rosso)
- Navigazione funzionante

- [ ] **Step 5: Rimuovi le presentazioni di test**

```bash
rm -rf presentazioni/_test-standard presentazioni/_test-minimal
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test: verify standard and minimal themes render correctly (test files removed)"
```

---

## Task 7: Aggiornare CLAUDE.md

Aggiornare la documentazione del progetto per riflettere la nuova struttura `themes/`.

**File:**
- Modifica: `CLAUDE.md`

- [ ] **Step 1: Aggiungi la sezione themes/ al Repository layout**

Trovare nel CLAUDE.md la sezione "## Repository layout" e aggiungere dopo il blocco `pptx/`:

```markdown
themes/
  standard/v1/   # Tema Standard OT (equivalente visivo di shared/style.css)
  minimal/v1/    # Tema Minimal (no decorazioni, tipografia pulita)
  <name>/<ver>/  # Struttura generica: meta.json + theme.css + variants/ + partials/
```

- [ ] **Step 2: Aggiungi nota sul sistema temi**

Aggiungere una sezione "## Theme system" dopo la sezione "## Creating a new presentation":

```markdown
## Theme system

Themes live in `themes/<name>/<version>/` and contain:
- `meta.json` — display name, description, variant list, `hasJs` flag
- `theme.css` — CSS overrides loaded after `shared/style.css`
- `variants/<division>.css` — CSS custom property overrides for a specific division
- `partials/` — HTML fragments (`cover.html`, `team.html`, `content-slide.html`, `closing.html`) with `{{PLACEHOLDER}}` variables replaced by the skill at generation time
- `theme.js` (optional) — loaded between `nav.js` and `pptx.js`; must not redefine `go`, `goTo`, `cur`, `total`

Load order in generated `index.html`:
```
shared/style.css → themes/<name>/<ver>/theme.css → variants/<division>.css → presentation/style.css
```

Existing presentations (`claude-for-ot`, `claude-formazione`) do **not** load any theme CSS and remain untouched.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with themes/ structure and theme system docs"
```

---

## Self-Review

**Copertura spec → piano:**

| Requisito spec | Task che lo implementa |
|----------------|----------------------|
| `themes/<name>/<ver>/` folder structure | Task 1, 3 |
| `meta.json` per ogni tema | Task 1 Step 1, Task 3 Step 1 |
| `theme.css` (quasi vuoto per standard) | Task 1 Step 2 |
| `theme.css` con override visivi (minimal) | Task 3 Step 2 |
| `variants/*.css` | Task 1 Step 3, Task 3 Step 3 |
| Partial HTML standard (cover, team, content, closing) | Task 2 |
| Partial HTML minimal (cover diverso, resto uguale) | Task 4 |
| Ordine caricamento CSS: shared → theme → variant → presentation | Task 5 Step 2 |
| Ordine caricamento JS: nav → theme.js(opt) → pptx | Task 5 Step 3 |
| Skill: selezione tema interattiva o via `--tema` | Task 5 Step 1 |
| Skill: lettura partial invece di template hardcodato | Task 5 Step 4 |
| Skill: `--variante` per divisione | Task 5 Step 1 |
| Migrazione `--migra` con conferma | Task 5 Step 5 |
| Retrocompatibilità presentazioni esistenti | Task 6 Step 2 |
| Nessun build step | soddisfatto per design (file statici) |
| `theme.js` non può ridefinire `go`/`goTo`/`cur`/`total` | Task 7 Step 2 (documentato) |
| CLAUDE.md aggiornato | Task 7 |

Tutti i requisiti coperti. Nessun placeholder TBD nel piano.
