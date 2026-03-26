/* --- ROI feature anatomy info --- */
const roiData = {
  roi_boilerplate: {
    title: 'Boilerplate & scaffolding — 32h → ~4h',
    items: [
      '<strong>Cosa include:</strong> setup progetto, struttura cartelle, modelli CRUD, routing, configurazioni, middleware, migration DB.',
      '<strong>Perch&eacute; 5-10x:</strong> Claude Code genera strutture complete in secondi partendo da una descrizione. Modelli, controller, DTO, validazione — tutto in un singolo prompt.',
      '<strong>Fonte:</strong> GitHub Research conferma +55% velocit&agrave; su task ripetitivi. Anthropic internal: 70-90% del codice aziendale &egrave; ora AI-produced.',
      '<strong>Esempio:</strong> "Crea un modulo ordini con entity, repository, service, controller REST, DTO, validazione e migration" — Claude Code genera tutto in ~2 minuti.'
    ]
  },
  roi_refactoring: {
    title: 'Refactoring su larga scala — 16h → ~3.5h',
    items: [
      '<strong>Cosa include:</strong> rinominare API, migrare pattern, aggiornare dipendenze, riorganizzare moduli, cambiare ORM o framework.',
      '<strong>Perch&eacute; 3-6x:</strong> Claude Code legge l\'intero codebase, identifica tutti i punti di impatto e applica le modifiche in modo coerente. Sub-agent su worktree paralleli per moduli diversi.',
      '<strong>Fonte:</strong> McKinsey: ottimizzazione codice esistente completata in ~2/3 del tempo con AI.',
      '<strong>Esempio:</strong> "Migra tutti gli endpoint da Express a Fastify mantenendo la stessa interfaccia" — Claude analizza, modifica e verifica la compatibilit&agrave;.'
    ]
  },
  roi_debug: {
    title: 'Debug complesso — 24h → ~8h',
    items: [
      '<strong>Cosa include:</strong> bug in produzione, race condition, memory leak, errori di integrazione, problemi di performance.',
      '<strong>Perch&eacute; 2-4x:</strong> Claude analizza stack trace, log e codice sorgente correlato. Propone fix mirati con spiegazione della root cause. Il senior valida e indirizza.',
      '<strong>Fonte:</strong> Anthropic: 55% degli engineer usano Claude quotidianamente per debug (categoria con uso giornaliero pi&ugrave; alto).',
      '<strong>Limite:</strong> bug legati a stato distribuito, timing e infrastruttura richiedono ancora forte supervisione umana — da qui lo speedup pi&ugrave; contenuto (2-4x vs 5-10x).'
    ]
  },
  roi_test: {
    title: 'Test writing (unit / integration) — 32h → ~5h',
    items: [
      '<strong>Cosa include:</strong> unit test, integration test, test E2E, mock/stub, fixture, test di regressione, coverage.',
      '<strong>Perch&eacute; 4-8x:</strong> Claude Code conosce intimamente il codice che ha scritto e genera test sistematici con edge case. Agenti paralleli testano moduli diversi simultaneamente.',
      '<strong>Fonte:</strong> McKinsey: top performer vedono 31-45% miglioramento qualit&agrave;. Index.dev: 30-60% risparmio su coding+testing combinati.',
      '<strong>Esempio:</strong> "Scrivi test completi per il modulo ordini con happy path, edge case, errori di validazione e test di integrazione con il DB" — copertura >90% in minuti.'
    ]
  },
  roi_review: {
    title: 'Code review & documentazione — 16h → ~4h',
    items: [
      '<strong>Cosa include:</strong> review di PR, feedback strutturato, documentazione API, README, commenti inline, changelog.',
      '<strong>Perch&eacute; 3-5x:</strong> Claude produce doc tecnica dettagliata in secondi, genera summary delle PR, identifica pattern problematici. Il senior si concentra sulla review architetturale.',
      '<strong>Fonte:</strong> McKinsey: documentazione completata in met&agrave; del tempo. GitHub: 60M+ Copilot code review con 71% feedback actionable.',
      '<strong>Nota:</strong> la review di codice AI-generated richiede attenzione diversa — focus su logica di business e sicurezza pi&ugrave; che su sintassi.'
    ]
  },
  roi_arch: {
    title: 'Architettura & design — 16h → ~9h',
    items: [
      '<strong>Cosa include:</strong> design di sistema, scelte architetturali, definizione interfacce, pattern selection, trade-off analysis.',
      '<strong>Perch&eacute; solo 1.5-2x:</strong> il senior guida ancora. Claude supporta analizzando codebase, suggerendo pattern e identificando rischi, ma le decisioni architetturali richiedono esperienza di dominio e visione d\'insieme.',
      '<strong>Fonte:</strong> BCG/Harvard: AI +25% velocit&agrave; su task cognitivi, ma solo "dentro la frontiera AI". Anthropic: design/planning &egrave; la categoria meno delegata (10% dell\'uso).',
      '<strong>Valore aggiunto:</strong> Claude eccelle nel generare alternative, valutare pro/contro di pattern diversi, e fare spike tecnici rapidi per validare ipotesi.'
    ]
  },
  roi_business: {
    title: 'Logica di business critica — 24h → ~12h',
    items: [
      '<strong>Cosa include:</strong> regole di business core, calcoli finanziari, workflow complessi, logica di pricing, compliance, validazioni di dominio.',
      '<strong>Perch&eacute; solo 1.5-2.5x:</strong> richiede supervisione stretta. Errori nella business logic hanno impatto diretto su revenue e compliance. Il senior deve validare ogni regola.',
      '<strong>Fonte:</strong> studio METR: su codebase mature e complesse, l\'AI pu&ograve; addirittura rallentare (-19%) se non supervisionata. La supervisione &egrave; il fattore critico.',
      '<strong>Best practice:</strong> il senior scrive le specifiche dettagliate, Claude implementa, il senior verifica con test case reali del dominio.'
    ]
  }
};

/* --- Pricing diff modal --- */
const diffData = {
  free: {
    title: 'Free — Differenze tra i piani',
    items: [
      '<strong>Claude:</strong> Uso limitato di Sonnet, no Claude Code, contesto ridotto.',
      '<strong>ChatGPT:</strong> GPT-4o mini, uso limitato, no image gen avanzata.',
      '<strong>Copilot:</strong> 2.000 completamenti + 50 chat/mese, supporto CLI e MCP base.',
      '<strong>Gemini:</strong> Gemini 3 Flash, 50 crediti AI/giorno, 15 GB storage.'
    ]
  },
  base: {
    title: 'Personal base — Differenze tra i piani',
    items: [
      '<strong>Claude Pro ($20):</strong> Opus 4.6 + Sonnet, Claude Code con limiti, contesto 1M, MCP nativo.',
      '<strong>ChatGPT Plus ($20):</strong> GPT-4o completo, image gen, Advanced Voice, Deep Research.',
      '<strong>Copilot Pro ($10):</strong> 300 richieste premium/mese, multi-modello (Anthropic, Google, OpenAI), coding agent.',
      '<strong>Gemini AI Pro ($22):</strong> Gemini 3.1 Pro, 1.000 crediti AI/mese, Gemini Code Assist, 2 TB storage, YouTube Premium incluso.'
    ]
  },
  premium: {
    title: 'Personal premium — Differenze tra i piani',
    items: [
      '<strong>Claude Max ($100–200):</strong> 5x o 20x l\'uso Pro, Claude Code esteso, ideale per sviluppatori intensivi.',
      '<strong>ChatGPT Pro ($200):</strong> Accesso illimitato a tutti i modelli incluso GPT-5.4 Pro, limiti massimi.',
      '<strong>Copilot Pro+ ($39):</strong> 1.500 richieste premium/mese, GitHub Spark, tutti i modelli top.',
      '<strong>Gemini AI Ultra ($275):</strong> 25.000 crediti AI/mese, Deep Think, Gemini Agent (US), 30 TB storage, Veo 3.1 completo.'
    ]
  },
  team: {
    title: 'Team / Business — Differenze tra i piani',
    items: [
      '<strong>Claude Team ($25–30):</strong> Seat Standard $25 (annuale) o $30 (mensile). Seat Premium $150 con Claude Code. Admin controls, min 5 utenti.',
      '<strong>ChatGPT Business ($25–30):</strong> Ex "Team". Admin console, dati esclusi dal training, GPT-5.4 Thinking.',
      '<strong>Copilot Business ($19):</strong> 300 richieste premium/utente, gestione utenti, IP indemnity, dati non usati per training.',
      '<strong>Gemini (in Workspace):</strong> Ora incluso nei piani Workspace Business/Enterprise senza add-on separato. Costo base Workspace: $12–18/utente.'
    ]
  },
  enterprise: {
    title: 'Enterprise — Differenze tra i piani',
    items: [
      '<strong>Claude:</strong> Pricing custom con SSO/SAML, audit log, compliance API, retention configurabile, supporto dedicato.',
      '<strong>ChatGPT (~$60, min 150 seat):</strong> Contratto annuale obbligatorio (~$108K/anno minimo). SSO, analytics admin, uso illimitato.',
      '<strong>Copilot ($39 + $21 GH Enterprise):</strong> Totale ~$60/utente. 1.000 richieste premium, knowledge bases, sicurezza avanzata. Richiede GitHub Enterprise Cloud.',
      '<strong>Gemini:</strong> Pricing custom via Google Sales. Integrato in Workspace Enterprise con compliance e sicurezza avanzata.'
    ]
  },
  agent: {
    title: 'Coding agent — Differenze tra i piani',
    items: [
      '<strong>Claude:</strong> Claude Code incluso dal piano Pro ($20). CLI agentica completa: legge il codebase, esegue comandi, crea PR. Estensibile via MCP e Skills.',
      '<strong>ChatGPT:</strong> Nessun coding agent nativo. Codex è solo via API a pagamento separato, non incluso nei piani consumer.',
      '<strong>Copilot:</strong> Coding agent disponibile da Pro ($10). Funziona in VS Code e CLI con supporto multi-modello.',
      '<strong>Gemini:</strong> Gemini Code Assist disponibile dal piano AI Pro ($22). CLI con supporto agentico, integrazione IDE.'
    ]
  },
  review: {
    title: 'Code Review in PR — Differenze tra i piani',
    items: [
      '<strong>Claude:</strong> Review multi-agente su PR GitHub, disponibile solo per Team ed Enterprise. Flotta di agenti specializzati con severity tagging. ~$15–25 per review.',
      '<strong>ChatGPT:</strong> Nessuna funzionalità nativa di code review su PR.',
      '<strong>Copilot:</strong> Code review integrato nelle PR da piano Pro ($10). Suggerimenti inline direttamente su GitHub.',
      '<strong>Gemini:</strong> Nessuna funzionalità nativa di code review su PR GitHub.'
    ]
  }
};

function openDiff(key) {
  const d = diffData[key] || roiData[key];
  if (!d) return;
  document.getElementById('diffTitle').textContent = d.title;
  document.getElementById('diffBody').innerHTML = d.items.map(i => '<li>' + i + '</li>').join('');
  document.getElementById('diffModal').classList.add('open');
}

function closeDiff(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  document.getElementById('diffModal').classList.remove('open');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('diffModal').classList.remove('open');
});

const slides = document.querySelectorAll('.slide');
const total = slides.length;
let cur = 0;

const dotsEl = document.getElementById('dots');
for (let i = 0; i < total; i++) {
  const d = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick = () => goTo(i);
  dotsEl.appendChild(d);
}

function updateSlides() {
  slides.forEach((s, i) => {
    s.classList.remove('active', 'before');
    if (i === cur) s.classList.add('active');
    else if (i < cur) s.classList.add('before');
  });
  document.getElementById('prev').disabled = cur === 0;
  document.getElementById('next').disabled = cur === total - 1;
  document.getElementById('counter').textContent = `${cur + 1} / ${total}`;
  document.getElementById('progress').style.width = `${(cur / (total - 1)) * 100}%`;
  document.querySelectorAll('.dot').forEach((d, i) => {
    d.className = 'dot' + (i === cur ? ' active' : '');
  });
}

function goTo(n) {
  if (n < 0 || n >= total || n === cur) return;
  cur = n;
  updateSlides();
}

function go(dir) { goTo(cur + dir); }

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
});

let tx = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) { dx < 0 ? go(1) : go(-1); }
});

updateSlides();
