/**
 * Shared slide-deck navigation module.
 * Include this script at the end of any presentation HTML.
 *
 * Expected DOM:
 *   .slide[data-slide]  — each slide
 *   #dots               — container for dot indicators
 *   #counter            — "N / M" label
 *   #progress           — progress bar (width set via JS)
 *   #prev / #next       — nav buttons
 */

const slides = document.querySelectorAll('.slide');
const total  = slides.length;
let cur = 0;

/* ── dot indicators ── */
const dotsEl = document.getElementById('dots');
if (dotsEl) {
  for (let i = 0; i < total; i++) {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dotsEl.appendChild(d);
  }
}

/* ── core helpers ── */
function updateSlides() {
  slides.forEach((s, i) => {
    s.classList.remove('active', 'before');
    if (i === cur) s.classList.add('active');
    else if (i < cur) s.classList.add('before');
  });

  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  if (prevBtn) prevBtn.disabled = cur === 0;
  if (nextBtn) nextBtn.disabled = cur === total - 1;

  const counterEl = document.getElementById('counter');
  if (counterEl) counterEl.textContent = `${cur + 1} / ${total}`;

  const progressEl = document.getElementById('progress');
  if (progressEl) progressEl.style.width = `${(cur / (total - 1)) * 100}%`;

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

/* ── keyboard ── */
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(1); }
  if (e.key === 'ArrowLeft')                   { e.preventDefault(); go(-1); }
});

/* ── touch / swipe ── */
let _tx = 0;
document.addEventListener('touchstart', e => { _tx = e.touches[0].clientX; });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - _tx;
  if (Math.abs(dx) > 50) { dx < 0 ? go(1) : go(-1); }
});

/* ── init ── */
updateSlides();
