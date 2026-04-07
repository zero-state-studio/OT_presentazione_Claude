/**
 * Shared PPTX export module.
 * Include after nav.js — auto-injects button, overlay, and CDN libs.
 *
 * Depends on globals from nav.js: slides, total, cur, goTo
 *
 * Usage: just add <script src="../../shared/pptx.js"></script>
 * Optional: set window.PPTX_FILENAME before loading to customize output name.
 */

(function () {
  /* ── Inject PPTX button ── */
  const btn = document.createElement('button');
  btn.id = 'pptxBtn';
  btn.title = 'Scarica presentazione in formato PPTX';
  btn.innerHTML =
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>' +
    '<polyline points="7 10 12 15 17 10"/>' +
    '<line x1="12" y1="15" x2="12" y2="3"/>' +
    '</svg> PPTX';
  btn.onclick = downloadPptx;
  document.body.appendChild(btn);

  /* ── Inject overlay ── */
  const overlay = document.createElement('div');
  overlay.id = 'pptxOverlay';
  overlay.style.display = 'none';
  overlay.innerHTML =
    '<div id="pptxOverlayBox">' +
    '  <div id="pptxSpinner"></div>' +
    '  <strong>Generazione PPTX</strong>' +
    '  <p id="pptxStatus">Preparazione…</p>' +
    '</div>';
  document.body.appendChild(overlay);

  /* ── Load CDN libs lazily (on first click) ── */
  let libsLoaded = false;
  function loadLibs() {
    if (libsLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      let loaded = 0;
      const need = 2;
      function check() { if (++loaded === need) { libsLoaded = true; resolve(); } }

      const s1 = document.createElement('script');
      s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      s1.onload = check;
      s1.onerror = reject;
      document.head.appendChild(s1);

      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js';
      s2.onload = check;
      s2.onerror = reject;
      document.head.appendChild(s2);
    });
  }

  /* ── Derive filename from <title> or use custom ── */
  function getFilename() {
    if (window.PPTX_FILENAME) return window.PPTX_FILENAME;
    const title = document.title || 'presentazione';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.pptx';
  }

  /* ── Main export function ── */
  async function downloadPptx() {
    /* file:// guard */
    if (window.location.protocol === 'file:') {
      const overlayEl = document.getElementById('pptxOverlay');
      const statusEl = document.getElementById('pptxStatus');
      document.getElementById('pptxSpinner').style.display = 'none';
      document.querySelector('#pptxOverlayBox strong').textContent = 'Server HTTP richiesto';
      statusEl.innerHTML =
        'Apri la presentazione tramite un server locale:<br><br>' +
        '<code style="background:#f5f5f5;padding:.3rem .6rem;border-radius:6px;font-size:.78rem;display:inline-block">' +
        'python3 -m http.server 8000</code><br><br>' +
        'Poi apri <strong>http://localhost:8000</strong> e naviga alla presentazione.<br><br>' +
        '<button onclick="document.getElementById(\'pptxOverlay\').style.display=\'none\';document.getElementById(\'pptxSpinner\').style.display=\'\';document.querySelector(\'#pptxOverlayBox strong\').textContent=\'Generazione PPTX\';" ' +
        'style="margin-top:.5rem;padding:.4rem 1.2rem;border:1px solid #e0e0e0;border-radius:999px;cursor:pointer;font-family:inherit;font-size:.8rem">Chiudi</button>';
      overlayEl.style.display = 'flex';
      return;
    }

    const pptxBtn = document.getElementById('pptxBtn');
    const overlayEl = document.getElementById('pptxOverlay');
    const statusEl = document.getElementById('pptxStatus');
    const savedCur = cur;

    pptxBtn.disabled = true;
    overlayEl.style.display = 'flex';
    statusEl.textContent = 'Caricamento librerie…';

    try {
      await loadLibs();
    } catch (e) {
      statusEl.textContent = 'Errore nel caricamento delle librerie.';
      pptxBtn.disabled = false;
      return;
    }

    const uiEls = [
      document.querySelector('.nav'),
      document.getElementById('progress'),
      document.querySelector('.kbd-hint'),
      pptxBtn,
      overlayEl
    ];

    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';

    for (let i = 0; i < total; i++) {
      statusEl.textContent = `Slide ${i + 1} di ${total}…`;
      goTo(i);
      await new Promise(r => setTimeout(r, 650));
      uiEls.forEach(el => el && (el.style.visibility = 'hidden'));

      const noAnimStyle = document.createElement('style');
      noAnimStyle.id = 'pptx-no-anim';
      noAnimStyle.textContent =
        '*, *::before, *::after { animation: none !important; transition: none !important; }' +
        '.anim { opacity: 1 !important; transform: none !important; }';
      document.head.appendChild(noAnimStyle);

      try {
        const rawCanvas = await html2canvas(document.body, {
          scale: 1.5, useCORS: true, allowTaint: true, logging: false,
          width: window.innerWidth, height: window.innerHeight,
          scrollX: 0, scrollY: 0
        });

        /* Normalize to 16:9 to match LAYOUT_WIDE — avoids vertical/horizontal
           distortion when the browser viewport is not exactly 16:9.
           The slide background is white so any padding bars are invisible. */
        const TARGET_RATIO = 16 / 9;
        const rawRatio = rawCanvas.width / rawCanvas.height;
        let canvas = rawCanvas;
        if (Math.abs(rawRatio - TARGET_RATIO) > 0.005) {
          canvas = document.createElement('canvas');
          if (rawRatio > TARGET_RATIO) {
            canvas.width = rawCanvas.width;
            canvas.height = Math.round(rawCanvas.width / TARGET_RATIO);
          } else {
            canvas.height = rawCanvas.height;
            canvas.width = Math.round(rawCanvas.height * TARGET_RATIO);
          }
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(rawCanvas,
            (canvas.width - rawCanvas.width) / 2,
            (canvas.height - rawCanvas.height) / 2
          );
        }

        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const slide = pptx.addSlide();
        slide.addImage({ data: imgData, x: 0, y: 0, w: '100%', h: '100%' });
      } finally {
        document.getElementById('pptx-no-anim').remove();
        uiEls.forEach(el => el && (el.style.visibility = ''));
      }
    }
    goTo(savedCur);
    overlayEl.style.display = 'none';
    pptxBtn.disabled = false;

    try {
      await pptx.writeFile({ fileName: getFilename() });
    } catch (err) {
      console.error('PPTX write error:', err);
      alert('Errore durante la generazione del PPTX: ' + err.message);
    }
  }
})();
