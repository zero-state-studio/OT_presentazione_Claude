# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A **branded HTML slide-deck ecosystem** for OT Consulting. Each presentation is a self-contained HTML file that runs in the browser, navigates with arrow keys or swipe, and exports to PPTX with one click. There is no build step, no framework, and no package manager.

## Serving presentations locally

PPTX export requires HTTP (not `file://`):
```bash
python3 -m http.server 8000
# then open http://localhost:8000/presentazioni/<name>/
```

## Repository layout

```
shared/           # Design system — loaded by every presentation
  style.css       # Master CSS (variables, layout, all shared components)
  nav.js          # Navigation (keyboard, touch, dots, progress bar)
  pptx.js         # PPTX export (auto-injects button + overlay, no HTML needed)
  assets/
    OT.png        # OT Consulting logo
    foto/         # Team photos — filename is nomecognome.(png|webp|jpg)
    logo/         # Tech partner SVG logos

presentazioni/
  claude-for-ot/   # Enterprise adoption proposal (19 slides)
  claude-formazione/ # 3-day developer training course (13 slides)

pptx/             # Exported PPTX files (not source)

themes/
  standard/v1/   # Tema Standard OT (equivalent visivo di shared/style.css)
  minimal/v1/    # Tema Minimal (no decorazioni, tipografia pulita)
  <name>/<ver>/  # Struttura generica: meta.json + theme.css + variants/ + partials/
```

Each presentation folder contains:
- `index.html` — the full slide deck
- `style.css` — overrides loaded after `shared/style.css`
- presentation-specific `.js` files if interactive features exist

## Shared design system

**`shared/style.css`** is the single source of truth for all OT branding. Never duplicate its rules in presentation-specific CSS — only add overrides.

Key CSS variables (defined in `:root`):
- `--accent: #E60000` (OT red)
- `--text: #1a1a1a`, `--muted: #555555`, `--bg: #ffffff`
- `--gradient`: red gradient used for avatar borders

Responsive font scaling: `html { font-size: clamp(10px, min(1.25vw, 2.2vh), 26px) }` — all sizing in `rem` scales automatically with the viewport. The `vw`/`vh` units in individual components also follow this.

## Cover slide standard

> **Nota:** La struttura qui sotto si applica al tema **standard**. I temi alternativi (es. minimal) omettono gli elementi decorativi — vedi `themes/minimal/v1/partials/` per riferimento.

Every presentation's slide 0 follows this exact order and class structure:

```html
<div class="slide active" data-slide="0" style="align-items:flex-start;justify-content:center;padding:4rem">
  <div class="cover-deco-tl"></div>
  <div class="cover-deco-br"></div>
  <div class="cover-dot-grid"><!-- 48 spans --></div>

  <!-- 1. Title -->
  <h1 class="hero-title anim d1">Text <span class="highlight">AccentWord</span></h1>

  <!-- 2. Subtitle -->
  <p class="subtitle anim d2">Subtitle text.</p>

  <!-- 3. Stats — optional -->
  <div class="metrics anim d3" style="justify-content:flex-start;margin-top:2rem">
    <div class="metric"><div class="value">X</div><div class="label">Label</div></div>
  </div>

  <!-- 4. Team members — optional, BEFORE logo-bar -->
  <div class="cover-team anim d4">
    <div class="cover-team-member">
      <img src="../../shared/assets/foto/nomecognome.png" alt="NC">
      <div class="cover-team-member-name"><span>Nome</span><span>Cognome</span></div>
    </div>
  </div>

  <!-- 5. OT logo — always last, anchored to bottom via margin-top:auto -->
  <div class="logo-bar anim d5">
    <div class="ot-mark"><img src="../../shared/assets/OT.png" alt="OT"></div>
    <div class="ot-company">OT Consulting<br><small class="ot-division">TEAM-NAME</small></div>
  </div>
</div>
```

The `.logo-bar` has `margin-top: auto` in shared CSS, which anchors it to the bottom of the flex column. When `.cover-team` precedes it, `.cover-team` gets `margin-top: auto` (pushing both to the bottom), and `.cover-team + .logo-bar` overrides to `margin-top: .75rem`.

## Content slide standard

> **Nota:** La struttura qui sotto si applica a tutti i temi. I componenti disponibili possono variare per tema.

Every non-cover, non-closing slide must have `.content-slide` and this structure:

```html
<div class="slide content-slide" data-slide="N">
  <div class="slide-label">Section name</div>
  <h2 class="slide-title">Slide title</h2>
  <p class="section-desc">Brief description — mandatory, prevents margin-top:auto bug</p>
  <!-- content components -->
  <div class="slide-footer">
    <span class="copyright">&copy;OT Consulting. All rights reserved</span>
    <div class="ot-logo">
      <div class="ot-circle"><img src="../../shared/assets/OT.png" alt="OT"></div>
      <span class="ot-name">OT Consulting<br><small class="ot-division">TEAM-NAME</small></span>
    </div>
  </div>
</div>
```

`data-slide` must be sequential starting from 0. The `.section-desc` is not optional — omitting it breaks vertical alignment of content below.

## Available shared components

| Component | Classes |
|-----------|---------|
| Card grid | `.card-grid` + `.card` (with `.icon.orange/.blue/.green/.purple`) |
| Two columns | `.two-col` |
| Vertical timeline | `.timeline-vertical` + `.timeline-item` + `.timeline-dot` |
| Day overview | `.overview-grid` + `.day-card` |
| Theme cards | `.theme-grid` + `.theme-card` |
| Callout box | `.tip-box` |
| Bullet list | `.checklist` |
| Stats (cover/content) | `.metrics` + `.metric` > `.value` + `.label` |
| Pill tags | `.tags` + `.tag` |
| Big decorative number | `.big-number` |
| Command table | `.cmd-table` |
| Team grid (dedicated slide) | `.ambassadors` + `.ambassador` |

Icons must be **SVG inline** (stroke-based, 18×18 or 14×14). Never use emoji.

## Animations

Staggered fadeUp on cover/closing elements. Apply in order:
- `.anim.d1` through `.anim.d5` (delays: 0.1s, 0.2s, 0.3s, 0.4s, 0.5s)
- Only active on `.slide.active` — pptx.js injects `#pptx-no-anim` during export to freeze all at final state

## PPTX export architecture

`shared/pptx.js` auto-injects the PPTX button — **never add the button manually in HTML**.

Export flow: for each slide → `goTo(i)` → wait 650ms → hide UI → `html2canvas(document.body)` → normalize canvas to 16:9 (white padding to avoid distortion if browser isn't 16:9) → JPEG at 0.92 quality → `pptx.addSlide()`.

CDN dependencies loaded lazily on first click:
- `html2canvas@1.4.1` from cdnjs
- `pptxgenjs@3.12.0` from jsdelivr

## Creating a new presentation

Use `/presentazione-ot <folder-name>` — the skill handles interactive prompts (team, authors, placement, description) and generates the scaffolding. The skill is at `.claude/skills/presentazione-ot/SKILL.md`.

Team photo lookup convention: `mario.rossi@company.com` → `shared/assets/foto/mariorossi.(png|webp|jpg)`.

**After creating a new presentation**, add an entry to `presentations.json` at the project root so it appears in the launcher app (`index.html`). Fields: `folder`, `title`, `subtitle`, `category`, `division`, `slideCount`, `authors`, `createdAt`, `updatedAt` (dates in `YYYY-MM-DD` format).

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

Partial files are read by the skill at generation time, NOT loaded at browser runtime.

## Claude-for-ot specifics

- Has `data.js` with ROI and pricing comparison data used by modal diff buttons
- `.deck-ot` class on the deck enables per-slide density overrides in `style.css` (slides 11, 12 have compressed padding due to content density)
- Interactive modals: `openDiff(key)` / `closeDiff()` — escape key also closes

## Claude-formazione specifics

- `sorteggio.js` — interactive lottery that assigns participants to themed project areas (10 themes, 4 teams)
- `fireworks.js` — celebration animation triggered on sorteggio completion
- `style.css` has larger font/padding overrides for sparser content density (training slides need more whitespace)
