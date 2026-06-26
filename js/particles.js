// ============================================================
// PARTICLES.JS — CHE GUEVARA: PATRIA O MUERTE
// Canvas particle system: smoke, embers, stars, tribute sparks
// ============================================================

class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.pool = []; // object pool
    this.running = false;
    this.rafId = null;
    this.options = Object.assign({
      maxParticles: 150,
      type: 'smoke', // 'smoke' | 'embers' | 'stars' | 'sparks'
    }, options);
    this.resize();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  getParticle() {
    return this.pool.pop() || {};
  }

  recycleParticle(p) {
    this.pool.push(p);
  }

  spawn(type) {
    const p = this.getParticle();
    const w = this.canvas.width;
    const h = this.canvas.height;

    switch (type || this.options.type) {
      case 'smoke':
        return Object.assign(p, {
          type: 'smoke',
          x: rand(w * 0.3, w * 0.7),
          y: h * 0.5,
          vx: rand(-0.4, 0.4),
          vy: rand(-1.2, -0.5),
          size: rand(15, 45),
          opacity: rand(0.15, 0.35),
          growth: rand(0.2, 0.6),
          life: 0,
          maxLife: rand(90, 160),
          wobble: rand(0, Math.PI * 2),
          wobbleSpeed: rand(0.01, 0.03)
        });

      case 'embers':
        return Object.assign(p, {
          type: 'embers',
          x: rand(w * 0.4, w * 0.6),
          y: h * 0.5,
          vx: rand(-2.5, 2.5),
          vy: rand(-5, -1),
          ax: 0,
          ay: 0.08,
          size: rand(1.5, 3.5),
          opacity: rand(0.7, 1),
          life: 0,
          maxLife: rand(60, 120),
          hue: rand(10, 45), // orange-yellow
          twinkle: rand(0, Math.PI * 2)
        });

      case 'stars':
        return Object.assign(p, {
          type: 'stars',
          x: rand(0, w),
          y: rand(0, h),
          vx: rand(-0.08, 0.08),
          vy: rand(-0.05, 0.05),
          size: rand(0.5, 2.5),
          opacity: rand(0.1, 0.8),
          twinkleSpeed: rand(0.005, 0.025),
          twinkle: rand(0, Math.PI * 2),
          life: Infinity,
          maxLife: Infinity
        });

      case 'sparks':
        const angle = rand(0, Math.PI * 2);
        const speed = rand(2, 12);
        return Object.assign(p, {
          type: 'sparks',
          x: w / 2,
          y: h / 2,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          ay: 0.15,
          size: rand(2, 5),
          opacity: 1,
          life: 0,
          maxLife: rand(40, 90),
          hue: rand(0, 60),
          trail: []
        });
    }
  }

  start() {
    this.running = true;
    this.particles = [];
    // Populate initial particles
    if (this.options.type === 'stars') {
      for (let i = 0; i < this.options.maxParticles; i++) {
        this.particles.push(this.spawn('stars'));
      }
    }
    this.loop();
  }

  stop() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }

  clear() {
    this.stop();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = [];
  }

  loop() {
    if (!this.running) return;
    this.update();
    this.draw();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  update() {
    const type = this.options.type;

    // Spawn new particles at rate
    if (type !== 'stars') {
      const spawnRate = type === 'embers' ? 3 : type === 'sparks' ? 8 : 2;
      if (this.particles.length < this.options.maxParticles) {
        for (let i = 0; i < spawnRate; i++) {
          if (this.particles.length < this.options.maxParticles) {
            this.particles.push(this.spawn());
          }
        }
      }
    }

    // Update each particle
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life++;

      switch (p.type) {
        case 'smoke':
          p.x += p.vx + Math.sin(p.wobble) * 0.3;
          p.y += p.vy;
          p.wobble += p.wobbleSpeed;
          p.size += p.growth;
          p.opacity = (1 - p.life / p.maxLife) * 0.3;
          p.vx *= 0.995;
          break;

        case 'embers':
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.ay;
          p.vx *= 0.99;
          p.twinkle += 0.15;
          p.opacity = (1 - p.life / p.maxLife) * (0.7 + 0.3 * Math.sin(p.twinkle));
          break;

        case 'stars':
          p.x += p.vx;
          p.y += p.vy;
          p.twinkle += p.twinkleSpeed;
          p.opacity = 0.1 + 0.7 * Math.abs(Math.sin(p.twinkle));
          // Wrap around edges
          if (p.x < 0) p.x = this.canvas.width;
          if (p.x > this.canvas.width) p.x = 0;
          if (p.y < 0) p.y = this.canvas.height;
          if (p.y > this.canvas.height) p.y = 0;
          break;

        case 'sparks':
          if (p.trail.length > 6) p.trail.shift();
          p.trail.push({ x: p.x, y: p.y });
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.ay;
          p.vx *= 0.97;
          p.opacity = (1 - p.life / p.maxLife);
          break;
      }

      // Remove dead particles (except stars)
      if (p.life >= p.maxLife && p.type !== 'stars') {
        this.particles.splice(i, 1);
        this.recycleParticle(p);
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);

      switch (p.type) {
        case 'smoke': {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          grad.addColorStop(0, 'rgba(80,80,80,0.4)');
          grad.addColorStop(0.5, 'rgba(50,50,50,0.15)');
          grad.addColorStop(1, 'rgba(20,20,20,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'embers': {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 0.8)`;
          ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
        }

        case 'stars': {
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = p.size > 1.5 ? 4 : 0;
          ctx.shadowColor = 'rgba(255,255,255,0.5)';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
        }

        case 'sparks': {
          // Draw trail
          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) {
              ctx.lineTo(p.trail[i].x, p.trail[i].y);
            }
            ctx.strokeStyle = `hsla(${p.hue}, 100%, 60%, ${p.opacity * 0.4})`;
            ctx.lineWidth = p.size * 0.5;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
          ctx.shadowBlur = 10;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, 0.8)`;
          ctx.fillStyle = `hsla(${p.hue + 30}, 100%, 80%, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          break;
        }
      }

      ctx.restore();
    }
  }

  /**
   * Burst: emit N particles of a given type at once, then stop spawning.
   * Used for tribute animation.
   */
  burst(count = 80) {
    for (let i = 0; i < count; i++) {
      const p = this.spawn('sparks');
      this.particles.push(p);
    }
    this.running = true;
    this.loop();

    // Auto-stop after all particles die
    const check = setInterval(() => {
      if (this.particles.length === 0) {
        this.stop();
        clearInterval(check);
      }
    }, 100);
  }
}

// Global star system for opening sequence
let openingStars = null;

function initOpeningStars(canvas) {
  openingStars = new ParticleSystem(canvas, {
    maxParticles: 200,
    type: 'stars'
  });
  openingStars.start();
  return openingStars;
}

function stopOpeningStars() {
  if (openingStars) openingStars.clear();
}
