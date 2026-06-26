// ============================================================
// MAP.JS — CHE GUEVARA: PATRIA O MUERTE
// Canvas-based interactive world map with animated journey paths
// ============================================================

class WorldMap {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.W = 0;
    this.H = 0;
    this.scale = 1;
    this.locations = locations;   // from locations-data.js
    this.journeyPath = journeyPath; // from locations-data.js
    this.drawnPaths = [];         // paths drawn so far
    this.animating = false;
    this.pathProgress = 0;        // 0..1 for current segment
    this.pathIndex = 0;           // which segment
    this.rafId = null;
    this.hoveredLocation = null;
    this.popup = document.getElementById('map-popup');
    this.highlightedId = null;

    // Precomputed pixel positions
    this.pixelPositions = {};

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', debounce(() => this.resize(), 200));

    this.canvas.addEventListener('mousemove', (e) => this.handleHover(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('mouseleave', () => this.hidePopup());

    // Touch
    this.canvas.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      this.handleClick({ clientX: t.clientX, clientY: t.clientY });
    }, { passive: true });

    // Listen for map highlight events from timeline
    EventBus.on('map:highlight', ({ locationId }) => {
      this.highlightLocation(locationId);
    });

    this.drawMap();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.W = this.canvas.width  = rect.width;
    this.H = this.canvas.height = this.canvas.offsetHeight || 520;
    this.scale = Math.min(this.W / 900, this.H / 520);
    this.computePixelPositions();
    this.drawMap();
  }

  // Convert mapPos (%) to canvas pixels
  toPixel(pos) {
    return {
      x: (pos.x / 100) * this.W,
      y: (pos.y / 100) * this.H
    };
  }

  computePixelPositions() {
    this.pixelPositions = {};
    this.locations.forEach(loc => {
      this.pixelPositions[loc.id] = this.toPixel(loc.mapPos);
    });
  }

  // ── Map background ─────────────────────────────────────────
  drawMap() {
    const ctx = this.ctx;
    const W = this.W, H = this.H;

    ctx.clearRect(0, 0, W, H);

    // Ocean background
    const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    if (isDark) {
      oceanGrad.addColorStop(0, '#0a0f18');
      oceanGrad.addColorStop(1, '#080c12');
    } else {
      oceanGrad.addColorStop(0, '#8ab4d0');
      oceanGrad.addColorStop(1, '#6a94b0');
    }
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 0, W, H);

    // Simplified continent shapes using filled polygons
    this.drawContinents(ctx, W, H, isDark);

    // Grid lines (latitude/longitude)
    this.drawGrid(ctx, W, H, isDark);

    // Draw completed journey paths
    this.drawPaths(ctx);

    // Draw location markers
    this.drawMarkers(ctx);
  }

  drawGrid(ctx, W, H, isDark) {
    ctx.save();
    ctx.strokeStyle = isDark ? 'rgba(100,130,100,0.06)' : 'rgba(60,80,100,0.12)';
    ctx.lineWidth = 0.5;
    // Horizontal lines
    for (let y = 0; y <= H; y += H / 9) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    // Vertical lines
    for (let x = 0; x <= W; x += W / 18) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    ctx.restore();
  }

  // Approximate continent outlines as simplified polygon regions
  drawContinents(ctx, W, H, isDark) {
    const landColor   = isDark ? '#1a2e1a' : '#b8c8a8';
    const borderColor = isDark ? '#2a4a2a' : '#8aaa78';

    ctx.fillStyle   = landColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth   = 1;

    const pc = (px, py) => [px / 100 * W, py / 100 * H];

    // Helper to draw a polygon
    const poly = (...pts) => {
      ctx.beginPath();
      ctx.moveTo(...pts[0]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    };

    // North America
    poly(
      pc(13,22), pc(24,22), pc(28,26), pc(30,32), pc(26,38),
      pc(22,44), pc(19,50), pc(17,50), pc(15,44), pc(12,36),
      pc(10,28)
    );
    // Greenland
    poly(pc(26,12), pc(36,10), pc(38,18), pc(32,22), pc(26,20));

    // South America
    poly(
      pc(22,44), pc(30,44), pc(34,50), pc(36,58), pc(34,68),
      pc(30,76), pc(26,78), pc(22,74), pc(20,66), pc(20,58),
      pc(22,50)
    );

    // Europe
    poly(
      pc(44,20), pc(56,20), pc(58,26), pc(56,32), pc(50,34),
      pc(44,32), pc(42,28)
    );

    // Africa
    poly(
      pc(44,34), pc(56,32), pc(62,38), pc(64,50), pc(62,62),
      pc(56,70), pc(50,72), pc(44,66), pc(42,54), pc(42,44)
    );

    // Middle East / South Asia
    poly(
      pc(56,26), pc(68,26), pc(74,30), pc(72,36), pc(60,38), pc(56,32)
    );

    // Asia (simplified)
    poly(
      pc(56,16), pc(78,14), pc(86,20), pc(88,28), pc(84,34),
      pc(76,36), pc(68,34), pc(60,30), pc(58,24)
    );

    // Southeast Asia
    poly(pc(74,38), pc(82,36), pc(86,42), pc(78,46), pc(72,44));

    // Australia
    poly(
      pc(76,56), pc(86,54), pc(90,60), pc(88,68), pc(80,70),
      pc(74,66), pc(72,60)
    );

    // Japan
    poly(pc(84,28), pc(87,26), pc(88,30), pc(85,32), pc(83,30));

    // UK
    poly(pc(44,20), pc(47,18), pc(47,22), pc(44,24));

    // Iceland
    poly(pc(37,14), pc(42,13), pc(42,17), pc(38,18));
  }

  // ── Draw paths ────────────────────────────────────────────
  drawPaths(ctx) {
    for (const path of this.drawnPaths) {
      this.drawPathSegment(ctx, path.from, path.to, 1, path.color || '#cc0000');
    }
  }

  drawPathSegment(ctx, fromId, toId, progress, color = '#cc0000') {
    const from = this.pixelPositions[fromId];
    const to   = this.pixelPositions[toId];
    if (!from || !to) return;

    // Bezier control point (arc up)
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2 - Math.abs(to.x - from.x) * 0.2 - 30;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth   = 2;
    ctx.globalAlpha = 0.75;
    ctx.setLineDash([6, 3]);
    ctx.shadowBlur  = 8;
    ctx.shadowColor = color;

    // Draw partial path based on progress
    ctx.beginPath();
    // Approximate bezier by linear interpolation of multiple points
    const steps = 40;
    const t1 = progress;
    ctx.moveTo(from.x, from.y);
    for (let i = 1; i <= Math.floor(steps * t1); i++) {
      const t = i / steps;
      const bx = Math.pow(1-t,2)*from.x + 2*(1-t)*t*midX + Math.pow(t,2)*to.x;
      const by = Math.pow(1-t,2)*from.y + 2*(1-t)*t*midY + Math.pow(t,2)*to.y;
      ctx.lineTo(bx, by);
    }
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
    ctx.setLineDash([]);
    ctx.restore();
  }

  // ── Draw markers ─────────────────────────────────────────
  drawMarkers(ctx) {
    const t = performance.now() / 1000;

    this.locations.forEach(loc => {
      const pos = this.pixelPositions[loc.id];
      if (!pos) return;

      const isHighlighted = this.highlightedId === loc.id;
      const isHovered     = this.hoveredLocation && this.hoveredLocation.id === loc.id;
      const color         = loc.color || '#cc0000';

      ctx.save();

      // Ping ring animation
      if (isHighlighted) {
        const ringSize = 8 + Math.abs(Math.sin(t * 3)) * 18;
        ctx.globalAlpha = 1 - Math.abs(Math.sin(t * 3)) * 0.8;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, ringSize, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Glow
      ctx.shadowBlur  = isHovered || isHighlighted ? 20 : 8;
      ctx.shadowColor = color;

      // Outer circle
      const radius = isHovered || isHighlighted ? 9 : 6;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner white dot
      ctx.shadowBlur = 0;
      ctx.fillStyle  = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius * 0.38, 0, Math.PI * 2);
      ctx.fill();

      // Year label
      if (isHovered || isHighlighted) {
        ctx.fillStyle   = '#ffffff';
        ctx.font        = `bold ${Math.floor(11 * Math.min(this.scale * 1.2, 1.2))}px "Roboto", sans-serif`;
        ctx.textAlign   = 'center';
        ctx.shadowBlur  = 6;
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.fillText(loc.year, pos.x, pos.y - radius - 6);
        ctx.shadowBlur  = 0;

        ctx.fillStyle   = 'rgba(255,255,255,0.7)';
        ctx.font        = `${Math.floor(9 * Math.min(this.scale * 1.2, 1.2))}px "Roboto", sans-serif`;
        ctx.fillText(loc.name.split(',')[0], pos.x, pos.y + radius + 14);
      }

      ctx.restore();
    });
  }

  // ── Hover / Click ─────────────────────────────────────────
  getLocationAtPoint(x, y) {
    for (const loc of this.locations) {
      const pos = this.pixelPositions[loc.id];
      if (!pos) continue;
      const dist = Math.hypot(pos.x - x, pos.y - y);
      if (dist <= 14) return loc;
    }
    return null;
  }

  handleHover(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const loc = this.getLocationAtPoint(x, y);
    this.hoveredLocation = loc;
    this.canvas.style.cursor = loc ? 'pointer' : 'default';

    if (loc) {
      this.showPopup(loc, e.clientX, e.clientY);
    } else {
      this.hidePopup();
    }
  }

  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const loc = this.getLocationAtPoint(x, y);
    if (loc) {
      this.highlightLocation(loc.id);
      showToast(`📍 ${loc.name} — ${loc.event} (${loc.year})`);
    }
  }

  showPopup(loc, clientX, clientY) {
    if (!this.popup) return;
    this.popup.innerHTML = `
      <h4>${loc.name}</h4>
      <div class="popup-year">${loc.year}</div>
      <p>${loc.event}</p>
      <p style="margin-top:4px;font-size:0.7rem;color:var(--clr-text-muted)">${loc.description}</p>
    `;

    const rect = this.canvas.getBoundingClientRect();
    let px = clientX - rect.left + 16;
    let py = clientY - rect.top  - 20;
    if (px + 240 > this.W) px = clientX - rect.left - 256;
    if (py < 0) py = 8;

    this.popup.style.left = px + 'px';
    this.popup.style.top  = py + 'px';
    this.popup.classList.add('visible');
  }

  hidePopup() {
    if (this.popup) this.popup.classList.remove('visible');
    this.hoveredLocation = null;
    this.canvas.style.cursor = 'default';
  }

  highlightLocation(id) {
    this.highlightedId = id;
  }

  // ── Play Journey animation ────────────────────────────────
  playJourney() {
    if (this.animating) return;
    this.animating   = true;
    this.drawnPaths  = [];
    this.pathIndex   = 0;
    this.pathProgress= 0;
    this.animatePath();
  }

  animatePath() {
    if (!this.animating || this.pathIndex >= this.journeyPath.length) {
      this.animating = false;
      return;
    }

    const [fromId, toId] = this.journeyPath[this.pathIndex];
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      if (!this.animating) return;
      const t = clamp((now - start) / duration, 0, 1);
      this.pathProgress = Easing.easeInOut(t);
      this.highlightedId = toId;

      // Redraw everything
      this.drawMap();
      // Show all completed segments + current partial
      this.drawnPaths.forEach(p => this.drawPathSegment(this.ctx, p.from, p.to, 1, '#cc0000'));
      this.drawPathSegment(this.ctx, fromId, toId, this.pathProgress, '#d4a017');
      this.drawMarkers(this.ctx);

      if (t < 1) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        // Path complete
        this.drawnPaths.push({ from: fromId, to: toId });
        this.pathIndex++;
        setTimeout(() => this.animatePath(), 200);
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  stopJourney() {
    this.animating = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.drawMap();
    this.drawPaths(this.ctx);
    this.drawMarkers(this.ctx);
  }

  resetJourney() {
    this.stopJourney();
    this.drawnPaths  = [];
    this.pathIndex   = 0;
    this.pathProgress= 0;
    this.highlightedId = null;
    this.drawMap();
  }

  // Continuous animation loop for marker pulsing
  startLoop() {
    const loop = () => {
      if (!this.animating) {
        // Still redraw for hover/highlight pulse effects
        this.drawMap();
        this.drawPaths(this.ctx);
        this.drawMarkers(this.ctx);
      }
      this.rafId = requestAnimationFrame(loop);
    };
    loop();
  }
}

let mapInstance = null;

function initMap() {
  mapInstance = new WorldMap('world-map-canvas');
  if (!mapInstance.canvas) return null;

  // Bind controls
  const playBtn  = document.getElementById('map-play-btn');
  const resetBtn = document.getElementById('map-reset-btn');

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (mapInstance.animating) {
        mapInstance.stopJourney();
        playBtn.textContent = '▶ Play Journey';
      } else {
        mapInstance.playJourney();
        playBtn.textContent = '⏹ Stop';
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      mapInstance.resetJourney();
      if (playBtn) playBtn.textContent = '▶ Play Journey';
      showToast('Map reset.');
    });
  }

  // Re-draw on theme change
  EventBus.on('theme:change', () => mapInstance.drawMap());

  mapInstance.startLoop();
  return mapInstance;
}
