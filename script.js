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
  const d = diffData[key];
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
