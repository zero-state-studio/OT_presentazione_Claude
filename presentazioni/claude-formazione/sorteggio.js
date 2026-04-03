/* ── Sorteggio animation ── */
const AREAS = [
  'Banca & Fintech', 'Viaggi & Turismo', 'Sport & Fitness',
  'Moda & Retail', 'Salute & Sanità', 'Food & Ristorazione',
  'Immobiliare', 'Education', 'Sostenibilità', 'Gaming'
];
const TEAMS = ['Team 1', 'Team 2', 'Team 3', 'Team 4'];
const TEAM_COLORS = ['var(--accent)', 'var(--blue)', 'var(--green)', 'var(--purple)'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startSorteggio() {
  const btn = document.getElementById('sortBtn');
  const resultsEl = document.getElementById('sortResults');
  const cards = document.querySelectorAll('[data-slide="9"] .theme-card');

  btn.disabled = true;
  resultsEl.innerHTML = '';
  cards.forEach(c => c.classList.remove('picked', 'dimmed', 'shuffling'));

  const available = shuffle([...Array(AREAS.length).keys()]);
  const picked = available.slice(0, 4);
  let step = 0;
  const totalFlashes = 20;

  // Phase 1: rapid flashing across all cards
  const flashInterval = setInterval(() => {
    cards.forEach(c => c.classList.remove('shuffling'));
    const idx = Math.floor(Math.random() * cards.length);
    cards[idx].classList.add('shuffling');
    step++;

    if (step >= totalFlashes) {
      clearInterval(flashInterval);
      cards.forEach(c => c.classList.remove('shuffling'));
      // Phase 2: reveal one by one
      revealPicks(picked, cards, resultsEl, btn);
    }
  }, 80);
}

function revealPicks(picked, cards, resultsEl, btn) {
  picked.forEach((areaIdx, i) => {
    setTimeout(() => {
      // Quick flash on the target card
      let flashes = 0;
      const quickFlash = setInterval(() => {
        const randomIdx = Math.floor(Math.random() * cards.length);
        cards.forEach(c => c.classList.remove('shuffling'));
        cards[randomIdx].classList.add('shuffling');
        flashes++;
        if (flashes >= 6) {
          clearInterval(quickFlash);
          cards.forEach(c => c.classList.remove('shuffling'));
          // Land on the picked card
          cards[areaIdx].classList.add('picked');

          // Dim non-picked cards after last pick
          if (i === picked.length - 1) {
            cards.forEach((c, ci) => {
              if (!picked.includes(ci)) c.classList.add('dimmed');
            });
            btn.disabled = false;
          }

          // Add chip
          const chip = document.createElement('div');
          chip.className = 'sort-chip';
          chip.style.animationDelay = '0s';
          chip.innerHTML = `<span class="chip-team">${TEAMS[i]}</span> ${AREAS[areaIdx]}`;
          resultsEl.appendChild(chip);
        }
      }, 60);
    }, i * 800);
  });
}
