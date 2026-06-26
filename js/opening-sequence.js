// ============================================================
// OPENING-SEQUENCE.JS — CHE GUEVARA: PATRIA O MUERTE
// The cinematic intro: stars → match sound + real voice → flame → face reveal → burn text
// AUDIO: Assets/Audio/ MP3 is used for "Patria o muerte" voice
// ============================================================

class OpeningSequence {
  constructor() {
    this.overlay    = document.getElementById('opening-sequence');
    this.canvas     = document.getElementById('opening-canvas');
    this.ctx        = this.canvas ? this.canvas.getContext('2d') : null;
    this.skipBtn    = document.getElementById('opening-skip');
    this.textEl     = document.getElementById('opening-text');
    this.subtitleEl = document.getElementById('opening-subtitle');

    this.W = 0;
    this.H = 0;
    this.phase = -1; // -1=waiting, 0=stars, 1=flame, 2=reveal, 3=smoke, 4=voice, 5=burn
    this.startTime = 0;
    this.rafId = null;
    this.skipped = false;
    this.completed = false;
    this.onComplete = null;

    // Particle arrays
    this.stars  = [];
    this.embers = [];
    this.smoke  = [];
    this.flame  = { x: 0, y: 0, active: false, intensity: 0 };

    // Portrait image
    this.portrait = null;
    this.portraitLoaded = false;
    this.portraitReveal = 0;

    // Audio elements
    this.audioCtx  = null;
    this.audioEl   = null;

    // Phase timings (ms)
    this.timings = {
      matchSound:     1000,
      flameAppears:   1300,
      portraitReveal: 2200,
      smokeStart:     3000,
      voiceStart:     3600,
      textBurn:       4800,
      subtitleFade:   5800,
      sequenceEnd:    8500
    };
  }

  init(onComplete) {
    if (!this.canvas || !this.ctx) {
      // Canvas not found — skip immediately
      if (onComplete) onComplete();
      return;
    }

    this.onComplete = onComplete;
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Skip on button click
    if (this.skipBtn) this.skipBtn.addEventListener('click', () => this.skip());
    // Skip on any keydown
    const keySkip = () => this.skip();
    document.addEventListener('keydown', keySkip, { once: true });
    // Skip on overlay click (not on skip button — it handles itself)
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target !== this.skipBtn && !this.skipBtn?.contains(e.target)) {
          if (this.phase === -1) {
            this.startSequence();
          } else {
            this.skip();
          }
        }
      });
    }

    // Load portrait
    this.loadPortrait();

    // Create audio element for the real voice
    this.createAudioElement();

    // Start
    this.initStars();
    this.loop();
  }

  startSequence() {
    this.phase = 0;
    this.startTime = performance.now();
    
    // Unlock audio context and HTML audio element
    if (this.audioEl) {
      this.audioEl.play().catch(()=>{});
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
    } catch(e){}

    this.schedulePhases();
  }

  resize() {
    this.W = this.canvas.width  = window.innerWidth;
    this.H = this.canvas.height = window.innerHeight;
    this.flame.x = this.W / 2;
    this.flame.y = this.H * 0.44;
  }

  loadPortrait() {
    this.portrait = new Image();
    this.portrait.onload  = () => { this.portraitLoaded = true; };
    this.portrait.onerror = () => { this.portraitLoaded = false; };
    this.portrait.src = 'Assets/Images/Che_Guevara_-_Guerrillero_Heroico_by_Alberto_Korda.jpg';
  }

  // ── Hidden <audio> for the real voice clip ────────────────
  createAudioElement() {
    this.audioEl = document.createElement('audio');
    this.audioEl.src = 'Assets/Audio/patria.mp3';
    this.audioEl.preload  = 'auto';
    this.audioEl.muted    = false;
    this.audioEl.volume   = 1.0;
    // Completely hidden — audio only
    this.audioEl.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
    this.audioEl.setAttribute('playsinline', '');
    this.audioEl.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.audioEl);

    // Try to preload
    this.audioEl.load();
  }

  initStars() {
    for (let i = 0; i < 180; i++) {
      this.stars.push({
        x: rand(0, this.W),
        y: rand(0, this.H),
        size: rand(0.3, 2.2),
        opacity: rand(0.05, 0.65),
        twinkle: rand(0, Math.PI * 2),
        speed: rand(0.003, 0.02)
      });
    }
  }

  schedulePhases() {
    const t = this.timings;

    setTimeout(() => this.playMatchSound(),   t.matchSound);
    setTimeout(() => { this.phase = 1; },     t.flameAppears);
    setTimeout(() => { this.phase = 2; },     t.portraitReveal);
    setTimeout(() => { this.phase = 3; },     t.smokeStart);
    setTimeout(() => {
      this.phase = 4;
      this.playAudioVoice();
    }, t.voiceStart);
    setTimeout(() => {
      this.phase = 5;
      this.burnText();
    }, t.textBurn);
    setTimeout(() => {
      if (!this.skipped && !this.completed) this.complete();
    }, t.sequenceEnd);
  }

  // ── WebAudio: match strike scratch ───────────────────────
  playMatchSound() {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = this.audioCtx;

      // Scratch noise burst
      const bufLen = Math.floor(ctx.sampleRate * 0.15);
      const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data   = buffer.getChannelData(0);
      for (let i = 0; i < bufLen; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 1.4);
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 2400;
      bpf.Q.value = 0.9;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(1.6, ctx.currentTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

      src.connect(bpf);
      bpf.connect(gain);
      gain.connect(ctx.destination);
      src.start();

      // Ignition click
      setTimeout(() => {
        try {
          const cBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.05), ctx.sampleRate);
          const cd   = cBuf.getChannelData(0);
          for (let i = 0; i < cd.length; i++) {
            cd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / cd.length, 2);
          }
          const cs = ctx.createBufferSource();
          cs.buffer = cBuf;

          const lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.value = 350;

          const cg = ctx.createGain();
          cg.gain.setValueAtTime(2.5, ctx.currentTime);
          cg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

          cs.connect(lp);
          lp.connect(cg);
          cg.connect(ctx.destination);
          cs.start();
        } catch(e) { /* silent */ }
      }, 110);

    } catch(e) {
      // AudioContext not supported — silent
    }
  }

  // ── Play the REAL audio voice for "Patria o muerte" ──────
  playAudioVoice() {
    if (!this.audioEl) return;

    // Modern browsers require user gesture for audio — try to play
    const playPromise = this.audioEl.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn('Intro audio blocked by autoplay policy:', error);
      });
    }

    // Stop audio after ~6 seconds (it's the voice clip only)
    setTimeout(() => {
      if (this.audioEl && !this.audioEl.paused) {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      }
    }, 6000);
  }



  // ── Burn text animation ───────────────────────────────────
  burnText() {
    if (!this.textEl) return;
    this.textEl.style.animation = 'none';
    this.textEl.style.opacity   = '0';
    this.textEl.textContent     = 'PATRIA O MUERTE';

    void this.textEl.offsetWidth; // force reflow

    this.textEl.style.animation        = 'burnText 2s cubic-bezier(0.16,1,0.3,1) forwards';
    this.textEl.style.webkitTextStroke = '1px rgba(204,0,0,0.5)';
    this.textEl.style.color            = '#cc3300';

    if (this.subtitleEl) {
      setTimeout(() => {
        this.subtitleEl.style.opacity    = '0';
        this.subtitleEl.textContent      = '1928 — 1967';
        this.subtitleEl.style.transition = 'opacity 1.2s ease';
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            this.subtitleEl.style.opacity = '1';
          });
        });
      }, 700);
    }
  }

  // ── Main render loop ──────────────────────────────────────
  loop() {
    if (this.skipped || this.completed) return;
    const now = performance.now();
    this.draw(now);
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  draw(now) {
    const ctx = this.ctx;
    const W = this.W, H = this.H;
    const elapsed = now - this.startTime;

    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, W, H);

    // ── Phase -1: Waiting for click ──────────────────────────
    if (this.phase === -1) {
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + 0.6 * Math.sin(now / 400)})`;
      ctx.font = '16px "Cinzel", serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2px';
      ctx.fillText('CLICK ANYWHERE TO START', W / 2, H / 2);
    }

    // ── Phase 0+: Stars ──────────────────────────────────────
    for (const s of this.stars) {
      s.twinkle += s.speed;
      const alpha = s.opacity * (0.35 + 0.65 * Math.abs(Math.sin(s.twinkle)));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ── Phase 1+: Flame ──────────────────────────────────────
    if (this.phase >= 1) {
      this.flame.intensity = Math.min(1, this.flame.intensity + 0.035);
      this.drawFlame(ctx, this.flame.x, this.flame.y, elapsed, this.flame.intensity);

      // Embers
      if (Math.random() < 0.45) {
        this.embers.push({
          x: this.flame.x + rand(-10, 10),
          y: this.flame.y - rand(10, 35),
          vx: rand(-1.5, 1.5),
          vy: rand(-3.5, -0.5),
          ay: 0.07,
          size: rand(0.8, 2.8),
          life: 0, maxLife: rand(25, 75),
          hue: rand(10, 50)
        });
      }
    }

    // ── Phase 2+: Portrait reveal ─────────────────────────────
    if (this.phase >= 2 && this.portraitLoaded) {
      this.portraitReveal = Math.min(1, this.portraitReveal + 0.007);
      this.drawPortrait(ctx, W, H, this.portraitReveal, elapsed);
    }

    // ── Phase 3+: Smoke ──────────────────────────────────────
    if (this.phase >= 3) {
      if (Math.random() < 0.3) {
        this.smoke.push({
          x: this.flame.x + rand(-8, 8),
          y: this.flame.y - 55,
          vx: rand(-0.25, 0.25),
          vy: rand(-0.9, -0.4),
          size: rand(8, 22),
          opacity: rand(0.1, 0.22),
          life: 0, maxLife: rand(90, 150),
          growth: rand(0.12, 0.38),
          wobble: rand(0, Math.PI * 2),
          ws: rand(0.01, 0.025)
        });
      }
    }

    // Update & draw embers
    for (let i = this.embers.length - 1; i >= 0; i--) {
      const e = this.embers[i];
      e.x += e.vx; e.y += e.vy; e.vy += e.ay; e.life++;
      ctx.globalAlpha = (1 - e.life / e.maxLife) * 0.9;
      ctx.shadowBlur = 6;
      ctx.shadowColor = `hsl(${e.hue},100%,60%)`;
      ctx.fillStyle   = `hsl(${e.hue},100%,72%)`;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      if (e.life >= e.maxLife) this.embers.splice(i, 1);
    }
    ctx.globalAlpha = 1;

    // Update & draw smoke
    for (let i = this.smoke.length - 1; i >= 0; i--) {
      const s = this.smoke[i];
      s.x += s.vx + Math.sin(s.wobble) * 0.2;
      s.y += s.vy;
      s.wobble += s.ws;
      s.size += s.growth;
      s.life++;
      const alpha = (1 - s.life / s.maxLife) * s.opacity;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
      g.addColorStop(0,   `rgba(65,65,65,${alpha * 0.8})`);
      g.addColorStop(0.5, `rgba(35,35,35,${alpha * 0.3})`);
      g.addColorStop(1,   'rgba(10,10,10,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      if (s.life >= s.maxLife) this.smoke.splice(i, 1);
    }
  }

  drawFlame(ctx, cx, cy, elapsed, intensity) {
    const t = elapsed / 1000;
    const f1 = Math.sin(t * 7.3)  * 0.08 + 1;
    const f2 = Math.sin(t * 11.7) * 0.06 + 1;
    const f3 = Math.sin(t * 5.1)  * 0.1  + 1;

    ctx.save();
    ctx.globalAlpha = intensity;

    // Outer ambient glow
    const outerGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 130);
    outerGlow.addColorStop(0,   'rgba(210,90,0,0.2)');
    outerGlow.addColorStop(0.5, 'rgba(150,45,0,0.08)');
    outerGlow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.fill();

    // Three layered flame shapes
    const layers = [
      { w: 46*f3, h: 85*f1,  c0:'#fff0aa', c1:'#ffbb00', c2:'#dd5500', a:1.0 },
      { w: 32*f1, h: 62*f2,  c0:'#ffffff', c1:'#ffe880', c2:'#ff8800', a:1.0 },
      { w: 18*f2, h: 38*f3,  c0:'#ffffff', c1:'#ffffff', c2:'#ffdd66', a:0.9 },
    ];

    for (const layer of layers) {
      ctx.save();
      ctx.translate(cx, cy - 10);
      const g = ctx.createLinearGradient(0, -layer.h, 0, 4);
      g.addColorStop(0,    layer.c0);
      g.addColorStop(0.25, layer.c1);
      g.addColorStop(0.7,  layer.c2);
      g.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.globalAlpha = intensity * layer.a;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 4);
      ctx.bezierCurveTo( layer.w,  4,  layer.w * 0.9, -layer.h * 0.5,  0, -layer.h);
      ctx.bezierCurveTo(-layer.w * 0.9, -layer.h * 0.5, -layer.w, 4, 0, 4);
      ctx.fill();
      ctx.restore();
    }

    // Ember base glow
    const eg = ctx.createRadialGradient(cx, cy + 8, 0, cx, cy + 8, 22);
    eg.addColorStop(0,   'rgba(255,185,0,0.95)');
    eg.addColorStop(0.4, 'rgba(255,85,0,0.6)');
    eg.addColorStop(0.8, 'rgba(180,20,0,0.2)');
    eg.addColorStop(1,   'transparent');
    ctx.globalAlpha = intensity;
    ctx.fillStyle = eg;
    ctx.beginPath();
    ctx.arc(cx, cy + 8, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawPortrait(ctx, W, H, reveal, elapsed) {
    const cx = W / 2;
    const cy = H * 0.35;
    const imgAspect = this.portrait.naturalWidth / this.portrait.naturalHeight || 0.75;
    const pH = H * 0.75;
    const pW = pH * imgAspect;
    const px = cx - pW / 2;
    const py = cy - pH * 0.5;

    const breathe = 1 + Math.sin(elapsed / 1300) * 0.003;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(breathe, breathe);
    ctx.translate(-cx, -cy);

    ctx.globalAlpha = reveal;
    ctx.drawImage(this.portrait, px, py, pW, pH);

    // Vignette — reveals from bottom (flame light)
    ctx.globalAlpha = 1;
    const vig = ctx.createRadialGradient(cx, H * 0.78, 0, cx, H * 0.5, H * 0.65);
    vig.addColorStop(0,   'rgba(0,0,0,0)');
    vig.addColorStop(0.3 + (1 - reveal) * 0.5, 'rgba(0,0,0,0.15)');
    vig.addColorStop(0.65 + (1 - reveal) * 0.3, 'rgba(0,0,0,0.75)');
    vig.addColorStop(1,   'rgba(0,0,0,0.98)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    // Top black bar
    const topG = ctx.createLinearGradient(0, 0, 0, H * 0.28);
    topG.addColorStop(0, 'rgba(0,0,0,1)');
    topG.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topG;
    ctx.fillRect(0, 0, W, H * 0.28);

    // Warm flame light wash
    const wl = ctx.createRadialGradient(cx, H, 0, cx, H * 0.62, H * 0.62);
    wl.addColorStop(0,   `rgba(205,85,12,${reveal * 0.28})`);
    wl.addColorStop(0.5, `rgba(155,42,0,${reveal * 0.11})`);
    wl.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = wl;
    ctx.fillRect(0, 0, W, H);

    // Sepia tone overlay
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = reveal * 0.12;
    ctx.fillStyle = '#3a1400';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // ── Skip / Complete ───────────────────────────────────────
  skip() {
    if (this.skipped || this.completed) return;
    this.skipped = true;
    this.complete();
  }

  complete() {
    if (this.completed) return;
    this.completed = true;

    cancelAnimationFrame(this.rafId);

    // Stop audio voice
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.currentTime = 0;
    }
    // Stop speech synthesis fallback
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // Fade out overlay
    if (this.overlay) {
      this.overlay.style.transition = 'opacity 0.85s ease';
      this.overlay.style.opacity = '0';
    }
    document.body.classList.remove('opening-active');

    setTimeout(() => {
      if (this.overlay) this.overlay.style.display = 'none';
      // Remove hidden audio element
      if (this.audioEl) {
        this.audioEl.remove();
        this.audioEl = null;
      }
      if (this.onComplete) this.onComplete();
    }, 900);
  }
}

// ── Init entry point ──────────────────────────────────────────
function initOpeningSequence(onComplete) {
  document.body.classList.add('opening-active');
  const seq = new OpeningSequence();
  seq.init(onComplete);
  return seq;
}
