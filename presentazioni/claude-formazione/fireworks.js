(function () {
  const canvas = document.createElement('canvas');
  canvas.id = 'fireworks-canvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let raf = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#E60000','#ff4444','#ff9900','#ffdd00','#44cc44','#44aaff','#cc44ff','#ff66aa','#ffffff'];

  function burst(x, y) {
    const count = 120;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - .5) * .3;
      const speed = 3 + Math.random() * 7;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size = 2 + Math.random() * 3;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color,
        size,
        gravity: .12 + Math.random() * .08,
        trail: [],
      });
    }
    if (!raf) loop();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.trail.push({ x: p.x, y: p.y, alpha: p.alpha });
      if (p.trail.length > 6) p.trail.shift();

      p.trail.forEach((t, i) => {
        ctx.globalAlpha = t.alpha * (i / p.trail.length) * .4;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, p.size * .6, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= .98;
      p.alpha -= .018;
    });

    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.alpha > 0);

    if (particles.length > 0) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  document.addEventListener('click', function (e) {
    const img = e.target.closest('img[src*="assets/foto/"]');
    if (!img) return;
    const rect = img.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    burst(cx, cy);
    setTimeout(() => burst(cx - 40, cy - 20), 120);
    setTimeout(() => burst(cx + 40, cy - 20), 240);
  });
})();
