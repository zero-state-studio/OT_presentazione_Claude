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
      '<strong>Claude Pro (€16,83):</strong> Opus 4.6 + Sonnet, Claude Code con limiti, contesto 1M, MCP nativo.',
      '<strong>ChatGPT Plus (~€16,83):</strong> GPT-4o completo, image gen, Advanced Voice, Deep Research.',
      '<strong>Copilot Pro (~€8,42):</strong> 300 richieste premium/mese, multi-modello (Anthropic, Google, OpenAI), coding agent.',
      '<strong>Gemini AI Pro (~€18,52):</strong> Gemini 3.1 Pro, 1.000 crediti AI/mese, Gemini Code Assist, 2 TB storage, YouTube Premium incluso.'
    ]
  },
  premium: {
    title: 'Personal premium — Differenze tra i piani',
    items: [
      '<strong>Claude Max (€84–168):</strong> 5x o 20x l\'uso Pro, Claude Code esteso, ideale per sviluppatori intensivi.',
      '<strong>ChatGPT Pro (~€168):</strong> Accesso illimitato a tutti i modelli incluso GPT-5.4 Pro, limiti massimi.',
      '<strong>Copilot Pro+ (~€33):</strong> 1.500 richieste premium/mese, GitHub Spark, tutti i modelli top.',
      '<strong>Gemini AI Ultra (~€231):</strong> 25.000 crediti AI/mese, Deep Think, Gemini Agent (US), 30 TB storage, Veo 3.1 completo.'
    ]
  },
  team: {
    title: 'Team / Business — Differenze tra i piani',
    items: [
      '<strong>Claude Team (€16,83–21,04):</strong> Seat Standard €16,83 ann. / €21,04 mens. Seat Premium €84,18 ann. / €105,23 mens. con Claude Code. Admin controls, min 5 utenti.',
      '<strong>ChatGPT Business (~€21–25):</strong> Ex "Team". Admin console, dati esclusi dal training, GPT-5.4 Thinking.',
      '<strong>Copilot Business (~€16):</strong> 300 richieste premium/utente, gestione utenti, IP indemnity, dati non usati per training.',
      '<strong>Gemini (in Workspace):</strong> Ora incluso nei piani Workspace Business/Enterprise senza add-on separato. Costo base Workspace: ~€10–15/utente.'
    ]
  },
  enterprise: {
    title: 'Enterprise — Differenze tra i piani',
    items: [
      '<strong>Claude:</strong> Pricing custom con SSO/SAML, audit log, compliance API, retention configurabile, supporto dedicato.',
      '<strong>ChatGPT (~€50, min 150 seat):</strong> Contratto annuale obbligatorio (~€90K/anno minimo). SSO, analytics admin, uso illimitato.',
      '<strong>Copilot (€33 + €18 GH Enterprise):</strong> Totale ~€51/utente. 1.000 richieste premium, knowledge bases, sicurezza avanzata. Richiede GitHub Enterprise Cloud.',
      '<strong>Gemini:</strong> Pricing custom via Google Sales. Integrato in Workspace Enterprise con compliance e sicurezza avanzata.'
    ]
  },
  agent: {
    title: 'Coding agent — Differenze tra i piani',
    items: [
      '<strong>Claude:</strong> Claude Code incluso dal piano Pro (€16,83). CLI agentica completa: legge il codebase, esegue comandi, crea PR. Estensibile via MCP e Skills.',
      '<strong>ChatGPT:</strong> Nessun coding agent nativo. Codex è solo via API a pagamento separato, non incluso nei piani consumer.',
      '<strong>Copilot:</strong> Coding agent disponibile da Pro (~€8,42). Funziona in VS Code e CLI con supporto multi-modello.',
      '<strong>Gemini:</strong> Gemini Code Assist disponibile dal piano AI Pro (~€18,52). CLI con supporto agentico, integrazione IDE.'
    ]
  },
  review: {
    title: 'Code Review in PR — Differenze tra i piani',
    items: [
      '<strong>Claude:</strong> Review multi-agente su PR GitHub, disponibile solo per Team ed Enterprise. Flotta di agenti specializzati con severity tagging. ~€12–21 per review.',
      '<strong>ChatGPT:</strong> Nessuna funzionalità nativa di code review su PR.',
      '<strong>Copilot:</strong> Code review integrato nelle PR da piano Pro (~€8,42). Suggerimenti inline direttamente su GitHub.',
      '<strong>Gemini:</strong> Nessuna funzionalità nativa di code review su PR GitHub.'
    ]
  },

  /* ── Claude plan detail (slide 17) ── */
  c_free: {
    title: 'Claude Free — Dettaglio piano',
    items: [
      '<strong>Modello:</strong> Sonnet 4.6 con limiti di utilizzo (throttled nelle ore di punta).',
      '<strong>Contesto:</strong> ridotto rispetto a Pro; nessun accesso a Opus 4.6.',
      '<strong>Claude Code:</strong> non incluso — solo tramite API a pagamento separato.',
      '<strong>Accesso:</strong> Claude.ai web + app mobile (iOS/Android).',
      '<strong>Ideale per:</strong> scoperta della piattaforma, uso occasionale non professionale.'
    ]
  },
  c_pro: {
    title: 'Claude Pro €16,83/mo — Dettaglio piano',
    items: [
      '<strong>Modelli:</strong> Opus 4.6 + Sonnet 4.6, senza restrizioni di modello.',
      '<strong>Claude Code:</strong> CLI agentica inclusa — legge il codebase, esegue comandi, crea PR, estensibile via MCP e Skills.',
      '<strong>Contesto:</strong> 200K token standard, fino a 1M token su file o documenti grandi.',
      '<strong>MCP nativo:</strong> connessione a GitHub, Slack, DB, Figma e altri tool aziendali senza configurazione extra.',
      '<strong>Projects:</strong> memoria persistente per progetti — il modello ricorda contesto, preferenze e convenzioni del codebase.',
      '<strong>Ideale per:</strong> sviluppatori singoli, consultant, uso professionale quotidiano.'
    ]
  },
  c_max100: {
    title: 'Claude Max 5× (€84,18/mo) — Dettaglio piano',
    items: [
      '<strong>Utilizzo:</strong> 5× i messaggi e le sessioni Claude Code rispetto al piano Pro.',
      '<strong>Claude Code:</strong> sessioni lunghe senza interruzione per rate-limit — refactoring massicci, analisi di codebase grandi.',
      '<strong>Modelli:</strong> tutti disponibili incluso Opus 4.6 senza restrizioni.',
      '<strong>Priorità:</strong> accesso prioritario nelle ore di punta rispetto ai piani inferiori.',
      '<strong>Ideale per:</strong> sviluppatori che usano Claude Code come strumento principale di lavoro ogni giorno.'
    ]
  },
  c_max200: {
    title: 'Claude Max 20× (€168,35/mo) — Dettaglio piano',
    items: [
      '<strong>Utilizzo:</strong> 20× i messaggi e le sessioni Claude Code rispetto al piano Pro.',
      '<strong>Claude Code:</strong> praticamente illimitato per uso professionale intensivo — agenti autonomi, pipeline CI, refactoring di repo enterprise.',
      '<strong>Modelli:</strong> tutti disponibili, priorità massima garantita.',
      '<strong>Confronto GPT Pro:</strong> stesso prezzo di ChatGPT Pro (~€168) ma con CLI agentica e MCP inclusi nativamente.',
      '<strong>Ideale per:</strong> power user, team lead, sviluppatori che orchestrano agenti e flussi autonomi complessi.'
    ]
  },
  c_team_std: {
    title: 'Claude Team Standard €16,83–21,04/utente/mo — Dettaglio piano',
    items: [
      '<strong>Prezzo:</strong> €16,83/utente/mese (fatturazione annuale) oppure €21,04/utente/mese (mensile). Minimo 5 utenti.',
      '<strong>Incluso:</strong> tutto il piano Pro per ogni seat — Opus 4.6, Sonnet, contesto 1M, MCP, Projects.',
      '<strong>Admin console:</strong> gestione centralizzata degli utenti, ruoli e permessi.',
      '<strong>Privacy:</strong> dati delle conversazioni esclusi dal training del modello.',
      '<strong>Shared Projects:</strong> spazi condivisi dove il team collabora su Projects con memoria comune.',
      '<strong>Claude Code:</strong> incluso per uso personale; per Code Review su PR serve il seat Premium.'
    ]
  },
  c_team_prem: {
    title: 'Claude Team Premium €84,18–105,23/utente/mo — Dettaglio piano',
    items: [
      '<strong>Prezzo:</strong> €84,18/utente/mese (annuale) oppure €105,23/utente/mese (mensile). Seat separato dal Standard — non un upgrade, si acquista in aggiunta o in alternativa.',
      '<strong>Claude Code potenziato:</strong> limiti estesi per uso professionale intensivo in team.',
      '<strong>Code Review su PR:</strong> review multi-agente automatica su pull request GitHub con severity tagging e suggerimenti inline.',
      '<strong>GitHub Actions:</strong> integrazione nativa per pipeline CI/CD — Claude commenta, approva o richiede modifiche automaticamente.',
      '<strong>Multi-agent:</strong> orchestrazione di sotto-agenti su worktree paralleli per task indipendenti simultanei.',
      '<strong>Ideale per:</strong> team di sviluppo che vogliono integrare Claude nell\'intero ciclo di vita del codice.'
    ]
  },
  c_enterprise: {
    title: 'Claude Enterprise — Dettaglio piano',
    items: [
      '<strong>Pricing:</strong> custom tramite trattativa con Anthropic Sales — scala sul numero di seat e sui consumi API.',
      '<strong>Identity:</strong> SSO/SAML con Okta, Azure AD, Google Workspace e altri IdP aziendali.',
      '<strong>Sicurezza:</strong> audit log completo delle conversazioni, RBAC granulare, IP allowlist.',
      '<strong>Compliance:</strong> SOC 2 Type II, HIPAA ready (BAA disponibile), GDPR, data residency configurabile.',
      '<strong>Retention:</strong> policy di retention dati configurabili per paese e tipo di dato.',
      '<strong>Supporto:</strong> Customer Success dedicato, SLA garantiti, accesso anticipato a nuovi modelli e funzionalità.'
    ]
  }
};

function openImgModal() {
  document.getElementById('imgModal').classList.add('open');
}
function closeImgModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.classList.contains('modal-close')) return;
  document.getElementById('imgModal').classList.remove('open');
}

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
  if (e.key === 'Escape') {
    document.getElementById('diffModal').classList.remove('open');
    document.getElementById('imgModal').classList.remove('open');
  }
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

/* ── PPTX download ── */
async function downloadPptx() {
  // html2canvas non funziona con il protocollo file:// per restrizioni di sicurezza del browser.
  // La presentazione deve essere servita via HTTP.
  if (window.location.protocol === 'file:') {
    const overlayEl = document.getElementById('pptxOverlay');
    const statusEl = document.getElementById('pptxStatus');
    document.getElementById('pptxSpinner').style.display = 'none';
    document.querySelector('#pptxOverlayBox strong').textContent = 'Server HTTP richiesto';
    statusEl.innerHTML =
      'Apri la presentazione tramite un server locale:<br><br>' +
      '<code style="background:#f5f5f5;padding:.3rem .6rem;border-radius:6px;font-size:.78rem;display:inline-block">' +
      'python3 -m http.server 8000</code><br><br>' +
      'Poi vai su <strong>http://localhost:8000/claude-for-ot-consulting.html</strong><br><br>' +
      '<button onclick="document.getElementById(\'pptxOverlay\').style.display=\'none\';document.getElementById(\'pptxSpinner\').style.display=\'\';document.querySelector(\'#pptxOverlayBox strong\').textContent=\'Generazione PPTX\';" ' +
      'style="margin-top:.5rem;padding:.4rem 1.2rem;border:1px solid #e0e0e0;border-radius:999px;cursor:pointer;font-family:inherit;font-size:.8rem">Chiudi</button>';
    overlayEl.style.display = 'flex';
    return;
  }

  const btn = document.getElementById('pptxBtn');
  const overlayEl = document.getElementById('pptxOverlay');
  const statusEl = document.getElementById('pptxStatus');
  const savedCur = cur;

  btn.disabled = true;
  overlayEl.style.display = 'flex';

  // Elements to hide during each screen capture
  const uiEls = [
    document.querySelector('.nav'),
    document.getElementById('progress'),
    document.querySelector('.kbd-hint'),
    btn,
    overlayEl
  ];

  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33" x 7.5" (16:9)

  /* ── Force exact 16:9 capture area ──
     The PPTX slide is 16:9. If the browser viewport is NOT 16:9,
     html2canvas will capture a non-16:9 rectangle and PptxGenJS
     will stretch it to fit. We avoid this by capturing at a fixed
     16:9 resolution using a wrapper element. */
  const captureW = 1920;
  const captureH = 1080;

  // Create an off-screen wrapper that forces exactly 1920×1080
  const captureBox = document.createElement('div');
  captureBox.id = 'pptx-capture-box';
  captureBox.style.cssText =
    'position:fixed;top:0;left:0;width:' + captureW + 'px;height:' + captureH +
    'px;overflow:hidden;z-index:-9999;pointer-events:none;opacity:0;';
  document.body.appendChild(captureBox);

  for (let i = 0; i < total; i++) {
    statusEl.textContent = `Slide ${i + 1} di ${total}…`;
    goTo(i);

    // Wait for slide transition to complete
    await new Promise(r => setTimeout(r, 650));

    // Hide UI elements so they don't appear in the screenshot
    uiEls.forEach(el => el && (el.style.visibility = 'hidden'));

    // Freeze animations and force final (visible) state for all .anim elements
    const noAnimStyle = document.createElement('style');
    noAnimStyle.id = 'pptx-no-anim';
    noAnimStyle.textContent =
      '*, *::before, *::after { animation: none !important; transition: none !important; }' +
      '.anim { opacity: 1 !important; transform: none !important; }' +
      /* Force the deck to render at exactly 1920×1080 for the capture */
      '#pptx-capture-box .deck { width: ' + captureW + 'px !important; height: ' + captureH + 'px !important; }' +
      '#pptx-capture-box .slide { width: ' + captureW + 'px !important; height: ' + captureH + 'px !important; }';
    document.head.appendChild(noAnimStyle);

    // Clone the deck into the capture box at fixed 16:9 dimensions
    const deckEl = document.querySelector('.deck');
    const clone = deckEl.cloneNode(true);
    clone.style.width = captureW + 'px';
    clone.style.height = captureH + 'px';
    clone.style.position = 'relative';
    captureBox.innerHTML = '';
    captureBox.appendChild(clone);

    // Make capture box visible for html2canvas
    captureBox.style.opacity = '1';
    captureBox.style.zIndex = '99999';

    try {
      const canvas = await html2canvas(captureBox, {
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: captureW,
        height: captureH,
        scrollX: 0,
        scrollY: 0
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const slide = pptx.addSlide();
      slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
    } finally {
      captureBox.style.opacity = '0';
      captureBox.style.zIndex = '-9999';
      captureBox.innerHTML = '';
      document.getElementById('pptx-no-anim').remove();
      uiEls.forEach(el => el && (el.style.visibility = ''));
    }
  }

  captureBox.remove();
  goTo(savedCur);
  overlayEl.style.display = 'none';
  btn.disabled = false;

  try {
    await pptx.writeFile({ fileName: 'claude-ecosystem-ot-consulting.pptx' });
  } catch (err) {
    console.error('PPTX write error:', err);
    alert('Errore durante la generazione del PPTX: ' + err.message);
  }
}
